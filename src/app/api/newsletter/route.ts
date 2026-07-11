import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    // Supabase not connected yet (pre-launch/local dev). Accept the signup so
    // the UX can be tested, but log it so it isn't silently lost.
    console.warn(`[newsletter] Supabase not configured — signup not persisted: ${email}`);
    return Response.json({ ok: true, persisted: false });
  }

  const supabase = getSupabase()!;
  const { error } = await supabase.from("newsletter_signups").insert({ email });

  if (error) {
    // 23505 = unique_violation: already subscribed, treat as success.
    if (error.code === "23505") {
      return Response.json({ ok: true, alreadySubscribed: true });
    }
    console.error("[newsletter] insert failed:", error.message);
    return Response.json(
      { error: "Could not save your signup. Please try again." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
