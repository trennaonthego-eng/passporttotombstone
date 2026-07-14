import Link from "next/link";
import { featuredEvent } from "@/data/featured-event";

/** Homepage "main event" banner — one flagship event, poster-styled, sourced
 * from the official flyer. No inquiry form: just information and a link to
 * the full calendar / the event's own info source. */
export default function FeaturedEventBanner() {
  return (
    <section className="bg-tombstone-light py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border-2 border-tombstone-gold/50 bg-gradient-to-b from-[#2b211a] to-[#1d150f] px-6 py-10 text-center text-white shadow-xl sm:px-12 sm:py-14">
          <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(193,153,63,0.18),transparent_70%)]" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-tombstone-gold sm:text-sm">
              ★ {featuredEvent.eyebrow} ★
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] text-[#f5eee0] sm:text-6xl">
              {featuredEvent.title}
            </h2>
            <p className="mt-4 font-display text-lg italic text-tombstone-gold sm:text-xl">
              {featuredEvent.tagline}
            </p>

            <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-4 text-tombstone-gold">
              <span className="h-px flex-1 bg-tombstone-gold/50" />
              <span className="text-sm">✦</span>
              <span className="h-px flex-1 bg-tombstone-gold/50" />
            </div>

            <p className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
              {featuredEvent.dateLabel}
            </p>
            <p className="mt-1 text-sm uppercase tracking-widest text-white/70">
              {featuredEvent.subtitle}
            </p>

            <div className="mt-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
              {featuredEvent.schedule.map((day) => (
                <div key={day.day} className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  <p className="text-xs font-bold uppercase tracking-widest text-tombstone-gold">
                    {day.day}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {day.items.map((item) => (
                      <li key={item} className="text-sm leading-snug text-white/85">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/calendar"
                className="w-full rounded-full bg-tombstone-red px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-black/30 transition hover:bg-[#b8532e] sm:w-auto"
              >
                See the Full Calendar
              </Link>
              <a
                href={featuredEvent.infoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full border border-tombstone-gold/70 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-tombstone-gold transition hover:bg-tombstone-gold hover:text-tombstone-dark sm:w-auto"
              >
                More Info
              </a>
            </div>

            <p className="mt-8 text-xs text-white/50">
              Sponsored by {featuredEvent.sponsors.join(" · ")}
              <br />
              More information: {featuredEvent.infoLabel} · {featuredEvent.phone}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
