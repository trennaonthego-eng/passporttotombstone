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
    .from("newsletter_signups")
    .select("email, subscribed_at, unsubscribed_at")
    .order("subscribed_at", { ascending: false })
    .limit(5000);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("format") === "csv") {
    const rows = [
      "email,subscribed_at,unsubscribed_at",
      ...data.map((r) =>
        [r.email, r.subscribed_at ?? "", r.unsubscribed_at ?? ""]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];
    return new Response(rows.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="newsletter-signups.csv"`,
      },
    });
  }

  return Response.json({ signups: data });
}
