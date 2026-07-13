import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Itinerary, ItineraryItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "A Shared Tombstone Trip",
  description: "A trip itinerary built with Passport to Tombstone's interactive trip planner.",
};

async function getItinerary(slug: string): Promise<Itinerary | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabase()!;
  const { data } = await supabase
    .from("itineraries")
    .select("*")
    .eq("share_slug", slug)
    .single();
  return data;
}

const KIND_LABEL: Record<ItineraryItem["kind"], string> = {
  business: "Business",
  "calendar-event": "Event",
  "town-event": "Event",
};

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const itinerary = await getItinerary(slug);

  if (!itinerary) notFound();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-16 text-white">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_80%_at_30%_20%,rgba(193,153,63,0.16),transparent_70%)]" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-gold">
          A Shared Trip
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{itinerary.title}</h1>
        <p className="mt-3 text-sm text-white/70">
          Built with Passport to Tombstone&apos;s trip planner — {itinerary.items.length} stop
          {itinerary.items.length === 1 ? "" : "s"}.
        </p>

        <div className="mt-8 space-y-3">
          {itinerary.items.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10"
            >
              <div>
                <p className="font-display font-semibold text-white">{item.name}</p>
                <p className="text-xs text-white/60">
                  {KIND_LABEL[item.kind]}
                  {item.category ? ` · ${item.category}` : ""}
                  {item.note ? ` · ${item.note}` : ""}
                </p>
              </div>
              {item.kind === "business" && (
                <Link
                  href={`/business/${item.id}`}
                  className="shrink-0 text-sm font-semibold text-tombstone-gold hover:underline"
                >
                  View →
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="inline-block rounded-full border border-tombstone-gold/70 px-6 py-2.5 text-sm font-semibold text-tombstone-gold transition hover:bg-tombstone-gold hover:text-tombstone-dark"
          >
            Plan Your Own Trip
          </Link>
        </div>
      </div>
    </section>
  );
}
