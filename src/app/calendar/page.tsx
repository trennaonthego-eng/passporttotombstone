import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { calendarEvents, calendarMonths } from "@/data/calendar-events";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Historic Tombstone Events — Calendar",
  description:
    "Coming events in Tombstone, Arizona: Vigilante Sundays, Helldorado Days, bull riding at the Shoot-Out Arena, the monthly market, and more. Dates, times, and locations for the town too tough to die.",
};

function mapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function eventListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Historic Tombstone Events",
    itemListElement: calendarEvents.map((ev, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: ev.name,
        startDate: ev.startIso,
        endDate: ev.endIso,
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: ev.venue,
          address: {
            "@type": "PostalAddress",
            streetAddress: ev.address.split(",")[0],
            addressLocality: "Tombstone",
            addressRegion: "AZ",
            postalCode: "85638",
            addressCountry: "US",
          },
        },
      },
    })),
  };
}

export default function CalendarPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events Calendar", path: "/calendar" },
        ])}
      />
      <JsonLd data={eventListSchema()} />

      {/* HERO */}
      <section className="bg-tombstone-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-gold">
            Events Calendar
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Historic Tombstone Events
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            Tombstone, Arizona is a living town with a colorful past that is celebrated
            throughout the year with many different events that bring Tombstone&apos;s
            unique history to life.
          </p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
        <div className="rounded-lg border border-tombstone-gold/40 bg-tombstone-gold/10 p-4 text-sm text-tombstone-dark/80">
          All event information is thought to be correct, however event schedules and
          venues are subject to change. Please verify event details with the venue before
          your visit.
        </div>
      </section>

      {/* EVENTS BY MONTH */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {calendarMonths.map((month) => (
          <div key={month} className="mb-12">
            <h2 className="border-b-2 border-tombstone-red pb-2 font-display text-2xl font-bold text-tombstone-navy">
              {month}
            </h2>
            <div className="mt-4 space-y-4">
              {calendarEvents
                .filter((ev) => ev.month === month)
                .map((ev, i) => (
                  <article
                    key={`${ev.name}-${ev.dateLabel}-${i}`}
                    className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div className="flex w-full shrink-0 flex-row items-center gap-3 sm:w-36 sm:flex-col sm:items-start sm:gap-0.5">
                      <span className="rounded-md bg-tombstone-red px-2.5 py-1 text-sm font-bold text-white sm:rounded-b-none sm:px-3">
                        {ev.dateLabel}
                      </span>
                      <span className="text-xs text-tombstone-dark/60 sm:rounded-b-md sm:bg-tombstone-light sm:px-3 sm:py-1">
                        {ev.timeLabel}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-tombstone-dark">
                        {ev.name}
                      </h3>
                      <p className="mt-0.5 text-sm text-tombstone-dark/70">
                        {ev.venue} ·{" "}
                        <a
                          href={mapsUrl(ev.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-tombstone-navy underline decoration-tombstone-navy/30 hover:decoration-tombstone-navy"
                        >
                          {ev.address}
                        </a>
                      </p>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* SUBMIT AN EVENT + NEWSLETTER CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-tombstone-navy">
            Know of a Tombstone event that isn&apos;t listed here?
          </h2>
          <p className="mt-3 text-sm text-tombstone-dark/75">
            Tell us about it and we&apos;ll get it on the calendar — and in front of the
            newsletter.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:events@passporttotombstone.com?subject=Tombstone%20Event%20Submission"
              className="rounded-md bg-tombstone-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-tombstone-red/90"
            >
              Submit an Event
            </a>
            <Link
              href="/events"
              className="rounded-md border-2 border-tombstone-navy px-6 py-2.5 text-sm font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
            >
              Host Your Own Event Here
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
