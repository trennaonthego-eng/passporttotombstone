import { getAdminSupabase, isAuthorized } from "@/lib/supabase-admin";

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
    .from("town_events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ events: data });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }
  const supabase = getAdminSupabase();
  if (!supabase) {
    return Response.json({ error: "Supabase isn't connected yet." }, { status: 503 });
  }

  let body: {
    name?: string;
    event_date?: string;
    time_label?: string;
    venue?: string;
    address?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const errors: string[] = [];
  if (!body.name?.trim()) errors.push("Event name is required.");
  if (!body.event_date || !/^\d{4}-\d{2}-\d{2}$/.test(body.event_date))
    errors.push("Pick an event date.");
  if (!body.time_label?.trim()) errors.push("Time is required (e.g. 10:00 AM - 4:00 PM).");
  if (!body.venue?.trim()) errors.push("Venue is required.");
  if (errors.length > 0) {
    return Response.json({ error: errors.join(" ") }, { status: 400 });
  }

  const { error } = await supabase.from("town_events").insert({
    name: body.name!.trim(),
    event_date: body.event_date,
    time_label: body.time_label!.trim(),
    venue: body.venue!.trim(),
    address: body.address?.trim() || "Tombstone, AZ 85638",
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }
  const supabase = getAdminSupabase();
  if (!supabase) {
    return Response.json({ error: "Supabase isn't connected yet." }, { status: 503 });
  }
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Missing event id." }, { status: 400 });
  }
  const { error } = await supabase.from("town_events").delete().eq("id", id);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}
