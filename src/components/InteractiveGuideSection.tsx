"use client";

import { useConcierge } from "@/lib/concierge-context";
import { useItinerary } from "@/lib/itinerary-context";

/** Homepage flagship-features showcase — makes the trip planner and AI
 * concierge visible and clickable from the first screen, instead of relying
 * on visitors to notice the small floating launcher buttons on their own. */
export default function InteractiveGuideSection() {
  const { setOpen: setItineraryOpen } = useItinerary();
  const { setOpen: setConciergeOpen } = useConcierge();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-20 text-white">
      <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_70%_at_50%_20%,rgba(193,153,63,0.16),transparent_70%)]" />
      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-tombstone-gold sm:text-sm">
          Your Personal Guide
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Plan Like You&apos;re Already Here
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/75">
          This isn&apos;t a static brochure. Build a real itinerary as you browse, or just
          tell the Marshal what you&apos;re after — it knows every business and event in
          the Passport.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-8 text-left ring-1 ring-white/10 transition hover:ring-tombstone-gold/50">
            <span className="text-3xl">🧭</span>
            <h3 className="mt-4 font-display text-xl font-bold text-tombstone-gold">
              Build Your Trip
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Add lodging, saloons, gunfights, and venues to a live itinerary as you
              explore. Save it, share it with your crew, no account required.
            </p>
            <button
              type="button"
              onClick={() => setItineraryOpen(true)}
              className="mt-6 rounded-full bg-tombstone-red px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#b8532e]"
            >
              Start Planning
            </button>
          </div>

          <div className="rounded-2xl bg-white/5 p-8 text-left ring-1 ring-white/10 transition hover:ring-tombstone-gold/50">
            <span className="text-3xl">🤠</span>
            <h3 className="mt-4 font-display text-xl font-bold text-tombstone-gold">
              Ask the Marshal
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Tell it what you&apos;re after — &quot;where should I stay,&quot; &quot;any
              good saloons&quot; — and it pulls real Tombstone spots, not generic
              suggestions.
            </p>
            <button
              type="button"
              onClick={() => setConciergeOpen(true)}
              className="mt-6 rounded-full border border-tombstone-gold/70 px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-tombstone-gold transition hover:bg-tombstone-gold hover:text-tombstone-dark"
            >
              Chat Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
