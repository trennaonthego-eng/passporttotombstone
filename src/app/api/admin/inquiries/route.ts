import { getAdminSupabase, isAuthorized } from "@/lib/supabase-admin";

const STATUSES = ["new", "contacted", "booked", "closed"];

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
    .from("event_inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ inquiries: data });
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }
  const supabase = getAdminSupabase();
  if (!supabase) {
    return Response.json({ error: "Supabase isn't connected yet." }, { status: 503 });
  }

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!body.id || !body.status || !STATUSES.includes(body.status)) {
    return Response.json({ error: "Need an inquiry id and a valid status." }, { status: 400 });
  }

  const { error } = await supabase
    .from("event_inquiries")
    .update({ status: body.status })
    .eq("id", body.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}
