import { getAllBusinesses } from "@/lib/business-data";
import { getAdminSupabase, isAuthorized } from "@/lib/supabase-admin";

/**
 * VA business editing via CSV round-trip:
 *   GET  ?format=csv  → download every business as a spreadsheet
 *   POST (csv text)   → validate + upsert rows into the Supabase businesses
 *                       table; the site merges them over the seed within 5 min.
 * Tier names in the CSV are VA-friendly: free | featured | premier.
 */

const CSV_COLUMNS = [
  "id",
  "name",
  "category",
  "subcategory",
  "description",
  "story",
  "address",
  "hours",
  "phone",
  "email",
  "website",
  "image_url",
  "tier",
  "event_host",
  "event_types",
  "event_capacity",
] as const;

const TIER_TO_INTERNAL: Record<string, string> = {
  free: "free",
  featured: "featured",
  premier: "premium_featured",
  premium_featured: "premium_featured",
};
const TIER_TO_CSV: Record<string, string> = {
  free: "free",
  featured: "featured",
  premium_featured: "premier",
  event_host: "premier",
};

const VALID_CATEGORIES = new Set(["Lodging", "Dining", "Attractions", "Shopping", "Services"]);

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Minimal RFC-4180 CSV parser (quotes, embedded commas/newlines). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }

  const businesses = await getAllBusinesses();

  const url = new URL(request.url);
  if (url.searchParams.get("format") === "json") {
    // Lightweight list for the admin UI (e.g. the Add Photos business picker)
    // — not the full CSV shape.
    return Response.json({
      businesses: businesses
        .map((b) => ({ id: b.id, name: b.name, category: b.category, image_url: b.image_url }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    });
  }

  const lines = [
    CSV_COLUMNS.join(","),
    ...businesses.map((b) =>
      [
        b.id,
        b.name,
        b.category,
        b.subcategory ?? "",
        b.description,
        b.story,
        b.address ?? "",
        b.hours ?? "",
        b.phone ?? "",
        b.email ?? "",
        b.website ?? "",
        b.image_url ?? "",
        TIER_TO_CSV[b.tier] ?? "free",
        b.event_host ? "true" : "false",
        b.event_types.join("; "),
        b.event_capacity ?? "",
      ]
        .map((v) => csvEscape(String(v)))
        .join(",")
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="tombstone-businesses.csv"`,
    },
  });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }
  const supabase = getAdminSupabase();
  if (!supabase) {
    return Response.json(
      { error: "Supabase isn't connected yet — add SUPABASE_SERVICE_ROLE_KEY to the environment." },
      { status: 503 }
    );
  }

  const text = await request.text();
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return Response.json({ error: "That file looks empty — it needs a header row plus at least one business." }, { status: 400 });
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const colIndex = (name: string) => header.indexOf(name);
  if (colIndex("id") === -1 || colIndex("name") === -1) {
    return Response.json(
      { error: 'The CSV must include at least "id" and "name" columns. Download the current CSV to get the right format.' },
      { status: 400 }
    );
  }

  const problems: string[] = [];
  const records = rows.slice(1).map((row, i) => {
    const get = (name: string) => {
      const idx = colIndex(name);
      return idx === -1 ? "" : (row[idx] ?? "").trim();
    };
    const id = get("id");
    const name = get("name");
    const category = get("category");
    const tierRaw = get("tier").toLowerCase();
    if (!id) problems.push(`Row ${i + 2}: missing id.`);
    if (!name) problems.push(`Row ${i + 2}: missing name.`);
    if (category && !VALID_CATEGORIES.has(category))
      problems.push(`Row ${i + 2}: category "${category}" isn't one of Lodging/Dining/Attractions/Shopping/Services.`);
    if (tierRaw && !TIER_TO_INTERNAL[tierRaw])
      problems.push(`Row ${i + 2}: tier "${tierRaw}" isn't one of free/featured/premier.`);
    return {
      id,
      name,
      category: category || null,
      subcategory: get("subcategory") || null,
      description: get("description") || null,
      story: get("story") || null,
      address: get("address") || null,
      hours: get("hours") || null,
      phone: get("phone") || null,
      email: get("email") || null,
      website: get("website") || null,
      image_url: get("image_url") || null,
      tier: TIER_TO_INTERNAL[tierRaw] ?? "free",
      event_host: get("event_host").toLowerCase() === "true",
      event_types: get("event_types")
        ? get("event_types").split(";").map((s) => s.trim()).filter(Boolean)
        : [],
      event_capacity: get("event_capacity") || null,
      updated_at: new Date().toISOString(),
    };
  });

  if (problems.length > 0) {
    return Response.json(
      { error: `Nothing was saved. Fix these and re-upload:\n${problems.slice(0, 10).join("\n")}` },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("businesses").upsert(records, { onConflict: "id" });
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, count: records.length });
}
