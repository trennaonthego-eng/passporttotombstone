// Regenerates supabase/seed.sql from src/data/businesses.ts so the SQL seed
// can never drift from the data the site renders locally.
// Run with: node scripts/generate-seed.mjs   (Node 23+ strips TS types natively)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const { businesses } = await import("../src/data/businesses.ts");

const q = (v) => (v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) =>
  a.length === 0 ? "'{}'" : `ARRAY[${a.map((x) => q(x)).join(", ")}]`;

const rows = businesses
  .map(
    (b) =>
      `(${[
        q(b.id),
        q(b.name),
        q(b.category),
        q(b.subcategory),
        q(b.description),
        q(b.story),
        q(b.address),
        q(b.phone),
        q(b.email),
        q(b.website),
        q(b.image_url || null),
        q(b.tier),
        b.event_host,
        arr(b.event_types),
        q(b.event_capacity),
        b.is_featured_on_homepage,
      ].join(", ")})`
  )
  .join(",\n");

const sql = `-- Passport to Tombstone — business seed data
-- Generated from src/data/businesses.ts by scripts/generate-seed.mjs — do not edit by hand.
-- Run after schema.sql in the Supabase SQL Editor.

insert into businesses
  (id, name, category, subcategory, description, story, address, phone, email, website,
   image_url, tier, event_host, event_types, event_capacity, is_featured_on_homepage)
values
${rows}
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  subcategory = excluded.subcategory,
  description = excluded.description,
  story = excluded.story,
  address = excluded.address,
  phone = excluded.phone,
  email = excluded.email,
  website = excluded.website,
  image_url = excluded.image_url,
  tier = excluded.tier,
  event_host = excluded.event_host,
  event_types = excluded.event_types,
  event_capacity = excluded.event_capacity,
  is_featured_on_homepage = excluded.is_featured_on_homepage,
  updated_at = now();
`;

const out = join(root, "supabase", "seed.sql");
writeFileSync(out, sql);
console.log(`Wrote ${businesses.length} businesses to ${out}`);
