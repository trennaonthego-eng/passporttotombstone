import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { ItineraryItem } from "@/lib/types";

function randomSlug(): string {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);
}

export async function POST(request: Request) {
  let body: { items?: ItineraryItem[]; title?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Your trip is empty — add something first." }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    return Response.json(
      {
        error:
          "Sharing isn't connected yet — this site's Supabase project needs to be set up before trips can be saved. Your trip is still saved in this browser.",
      },
      { status: 503 }
    );
  }

  const supabase = getSupabase()!;

  // Optional: attach the signed-in user, if any, so it shows up in "My Trips".
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const share_slug = randomSlug();
  const { error } = await supabase.from("itineraries").insert({
    share_slug,
    user_id: user?.id ?? null,
    title: body.title ?? "My Tombstone Trip",
    items,
  });

  if (error) {
    console.error("[itinerary] insert failed:", error.message);
    return Response.json({ error: "Could not save your trip. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true, share_slug });
}
