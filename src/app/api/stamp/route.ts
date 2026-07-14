import { getBusinessById } from "@/lib/business-data";
import { getAdminSupabase } from "@/lib/supabase-admin";
import { isValidStampToken, MILESTONES } from "@/lib/stamps";

/**
 * Claims a stamp for the signed-in visitor. Called from /stamp/[id] after the
 * visitor scans a partner QR code on-site.
 *
 * Body: { business_id, token }.  Auth: the visitor's Supabase access token as
 * a Bearer header — verified server-side, then the stamp is written with the
 * service role (there is no public insert policy on passport_stamps).
 */
export async function POST(request: Request) {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return Response.json(
      { error: "The stamp program isn't connected yet — Supabase setup is required first." },
      { status: 503 }
    );
  }

  let body: { business_id?: string; token?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  const businessId = body.business_id ?? "";
  const token = body.token ?? "";

  if (!isValidStampToken(businessId, token)) {
    return Response.json(
      { error: "That stamp code isn't valid. Scan the QR code posted at the business." },
      { status: 403 }
    );
  }

  const business = await getBusinessById(businessId);
  if (!business) {
    return Response.json({ error: "We don't recognize that business." }, { status: 404 });
  }

  const jwt = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !userData.user) {
    return Response.json({ error: "Sign in first to collect stamps." }, { status: 401 });
  }
  const userId = userData.user.id;

  const { error: insertError } = await supabase
    .from("passport_stamps")
    .upsert(
      { user_id: userId, business_id: businessId },
      { onConflict: "user_id,business_id", ignoreDuplicates: true }
    );
  if (insertError) {
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  const { count } = await supabase
    .from("passport_stamps")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return Response.json({
    business_name: business.name,
    total: count ?? 1,
    milestones: MILESTONES,
  });
}
