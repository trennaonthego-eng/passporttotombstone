import { getBusinessById } from "@/lib/business-data";
import { getAdminSupabase } from "@/lib/supabase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public endpoint for businesses (any tier, free included) to submit updated
 * info — address, hours, phone, email, website. Nothing changes on the live
 * site here: the row lands as "pending" and goes live only after it's
 * approved from the /admin dashboard.
 */
export async function POST(request: Request) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return Response.json(
      { error: "Updates aren't connected yet — please email us your changes instead." },
      { status: 503 }
    );
  }

  let body: Record<string, string | undefined>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const contactEmail = body.contact_email?.trim() ?? "";
  if (!EMAIL_RE.test(contactEmail)) {
    return Response.json({ error: "A valid contact email is required." }, { status: 400 });
  }

  const businessId = body.business_id?.trim() || null;
  let businessName = body.business_name?.trim() || "";
  if (businessId) {
    const business = await getBusinessById(businessId);
    if (!business) {
      return Response.json({ error: "Couldn't find that business in the directory." }, { status: 404 });
    }
    businessName = business.name;
  }
  if (!businessName) {
    return Response.json({ error: "Business name is required." }, { status: 400 });
  }

  const clip = (v?: string) => {
    const t = v?.trim();
    return t ? t.slice(0, 500) : null;
  };

  const fields = {
    address: clip(body.address),
    hours: clip(body.hours),
    phone: clip(body.phone),
    email: clip(body.email),
    website: clip(body.website),
    note: clip(body.note),
  };

  if (!Object.values(fields).some(Boolean)) {
    return Response.json({ error: "Fill in at least one field to update." }, { status: 400 });
  }

  const { error } = await supabase.from("listing_updates").insert({
    business_id: businessId,
    business_name: businessName,
    contact_email: contactEmail,
    ...fields,
  });
  if (error) {
    return Response.json({ error: "Could not save your update. Please try again." }, { status: 500 });
  }

  return Response.json({
    ok: true,
    message: "Got it! We review every update before it goes live — usually within a couple of days.",
  });
}
