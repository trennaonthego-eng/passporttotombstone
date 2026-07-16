import { getBusinessById } from "@/lib/business-data";
import { getAdminSupabase, isAuthorized } from "@/lib/supabase-admin";

/** Review queue for business-submitted listing updates. Approving one merges
 * the submitted fields into the live business row; rejecting just files it.
 * This is the "ask permission before posting" gate — nothing a business
 * submits touches the site until it's approved here. */

export async function GET(request: Request) {
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

  const { data, error } = await supabase
    .from("listing_updates")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ updates: data });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }
  const supabase = getAdminSupabase();
  if (!supabase) {
    return Response.json({ error: "Supabase isn't connected yet." }, { status: 503 });
  }

  let body: { id?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.id || !["approve", "reject"].includes(body.action ?? "")) {
    return Response.json({ error: "Send an update id and approve/reject." }, { status: 400 });
  }

  const { data: update, error: fetchError } = await supabase
    .from("listing_updates")
    .select("*")
    .eq("id", body.id)
    .single();
  if (fetchError || !update) {
    return Response.json({ error: "Update not found." }, { status: 404 });
  }

  if (body.action === "approve") {
    if (!update.business_id) {
      return Response.json(
        { error: "This submission isn't linked to a directory listing — add the business via the CSV first." },
        { status: 400 }
      );
    }
    const business = await getBusinessById(update.business_id);
    if (!business) {
      return Response.json({ error: "That business no longer exists." }, { status: 404 });
    }

    // Merge: submitted fields win, everything else keeps its current value.
    const { error: upsertError } = await supabase.from("businesses").upsert(
      {
        id: business.id,
        name: business.name,
        category: business.category,
        subcategory: business.subcategory,
        description: business.description,
        story: business.story,
        address: update.address ?? business.address,
        hours: update.hours ?? business.hours,
        phone: update.phone ?? business.phone,
        email: update.email ?? business.email,
        website: update.website ?? business.website,
        image_url: business.image_url,
        tier: business.tier,
        event_host: business.event_host,
        event_types: business.event_types,
        event_capacity: business.event_capacity,
        is_featured_on_homepage: business.is_featured_on_homepage,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (upsertError) {
      return Response.json({ error: upsertError.message }, { status: 500 });
    }
  }

  const { error: statusError } = await supabase
    .from("listing_updates")
    .update({
      status: body.action === "approve" ? "approved" : "rejected",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", body.id);
  if (statusError) {
    return Response.json({ error: statusError.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
