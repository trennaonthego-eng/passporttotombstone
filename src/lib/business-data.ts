import { businesses as seedBusinesses } from "@/data/businesses";
import { getSupabase } from "@/lib/supabase";
import type { Business, Category, Tier } from "@/lib/types";

/**
 * Merged business data: the reviewed seed in src/data/businesses.ts is the
 * base; rows in the Supabase `businesses` table (edited by the VA through
 * /admin → Update Businesses) override seed entries by id, and rows with new
 * ids are appended. With Supabase unconfigured the site runs on the seed
 * alone. Pages using this must set `export const revalidate` so VA edits
 * appear without a deploy.
 */

const VALID_CATEGORIES = new Set(["Lodging", "Dining", "Attractions", "Shopping", "Services"]);
const VALID_TIERS = new Set(["free", "featured", "premium_featured", "event_host"]);

interface BusinessRow {
  id: string;
  name: string | null;
  category: string | null;
  subcategory: string | null;
  description: string | null;
  story: string | null;
  address: string | null;
  hours: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  tier: string | null;
  event_host: boolean | null;
  event_types: string[] | null;
  event_capacity: string | null;
  is_featured_on_homepage: boolean | null;
}

function rowToBusiness(row: BusinessRow, base?: Business): Business {
  const website = row.website?.trim()
    ? row.website.startsWith("http")
      ? row.website
      : `https://${row.website}`
    : base?.website ?? null;

  return {
    id: row.id,
    name: row.name?.trim() || base?.name || row.id,
    category: (VALID_CATEGORIES.has(row.category ?? "")
      ? row.category
      : base?.category ?? "Services") as Category,
    subcategory: row.subcategory?.trim() || base?.subcategory || null,
    description: row.description?.trim() || base?.description || "",
    story: row.story?.trim() || base?.story || "",
    address: row.address?.trim() || base?.address || null,
    hours: row.hours?.trim() || base?.hours || null,
    phone: row.phone?.trim() || base?.phone || null,
    email: row.email?.trim() || base?.email || null,
    website,
    image_url: row.image_url?.trim() || base?.image_url || "",
    tier: (VALID_TIERS.has(row.tier ?? "") ? row.tier : base?.tier ?? "free") as Tier,
    event_host: row.event_host ?? base?.event_host ?? false,
    event_types: row.event_types ?? base?.event_types ?? [],
    event_capacity: row.event_capacity?.trim() || base?.event_capacity || null,
    is_featured_on_homepage:
      row.is_featured_on_homepage ?? base?.is_featured_on_homepage ?? false,
    featured_expires_at: base?.featured_expires_at ?? null,
    created_at: base?.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getAllBusinesses(): Promise<Business[]> {
  const supabase = getSupabase();
  if (!supabase) return seedBusinesses;

  const { data, error } = await supabase.from("businesses").select("*");
  if (error || !data || data.length === 0) return seedBusinesses;

  const map = new Map(seedBusinesses.map((b) => [b.id, b]));
  for (const row of data as BusinessRow[]) {
    if (!row.id) continue;
    map.set(row.id, rowToBusiness(row, map.get(row.id)));
  }
  return [...map.values()];
}

export async function getBusinessesByCategory(category: Business["category"]) {
  return (await getAllBusinesses()).filter((b) => b.category === category);
}

export async function getBusinessById(id: string) {
  return (await getAllBusinesses()).find((b) => b.id === id);
}
