import { getBusinessById } from "@/lib/business-data";
import { getAdminSupabase, isAuthorized } from "@/lib/supabase-admin";

/**
 * VA photo upload: multipart form with `business_id` and `file`.
 * Stores the image in the public `business-photos` Supabase Storage bucket
 * (one file per business, overwritten on re-upload) and writes the resulting
 * URL onto businesses.image_url. Category/business pages revalidate every
 * 5 minutes, so a new photo appears on the live site shortly after upload.
 */

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const TIER_TO_INTERNAL: Record<string, string> = {
  free: "free",
  featured: "featured",
  premium_featured: "premium_featured",
  event_host: "event_host",
};

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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Couldn't read the upload." }, { status: 400 });
  }

  const businessId = form.get("business_id");
  const file = form.get("file");

  if (typeof businessId !== "string" || !businessId) {
    return Response.json({ error: "Pick a business first." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return Response.json({ error: "No photo was attached." }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return Response.json({ error: "Please upload a JPG, PNG, or WEBP image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "That photo is over 8MB — please use a smaller file." }, { status: 400 });
  }

  const business = await getBusinessById(businessId);
  if (!business) {
    return Response.json({ error: "Couldn't find that business." }, { status: 404 });
  }

  const path = `${businessId}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from("business-photos")
    .upload(path, bytes, { contentType: file.type, upsert: true });

  if (uploadError) {
    return Response.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabase.storage.from("business-photos").getPublicUrl(path);
  // Cache-bust so a replacement photo doesn't keep showing the old cached image.
  const imageUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

  // Upsert the full business row (same pattern as the CSV importer) so a
  // photo upload works even for businesses that only exist in the seed data
  // and have no row in Supabase yet.
  const { error: dbError } = await supabase.from("businesses").upsert(
    {
      id: business.id,
      name: business.name,
      category: business.category,
      subcategory: business.subcategory,
      description: business.description,
      story: business.story,
      address: business.address,
      hours: business.hours,
      phone: business.phone,
      email: business.email,
      website: business.website,
      image_url: imageUrl,
      tier: TIER_TO_INTERNAL[business.tier] ?? "free",
      event_host: business.event_host,
      event_types: business.event_types,
      event_capacity: business.event_capacity,
      is_featured_on_homepage: business.is_featured_on_homepage,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (dbError) {
    return Response.json({ error: dbError.message }, { status: 500 });
  }

  return Response.json({ ok: true, image_url: imageUrl });
}
