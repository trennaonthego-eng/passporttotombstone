import { CONTACT_EMAIL } from "@/lib/contact";
import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import {
  EVENTS_PAGE_FAQ,
  breadcrumbSchema,
  eventsFaqSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Host Your Event in Tombstone, AZ",
  description:
    "Bring your corporate retreat, conference, film festival, or wedding to Tombstone, Arizona. Venues for 50–500+ people. We'll connect you with venues, coordinate logistics, and help market your event.",
};

const EVENT_SERVICES = [
  {
    title: "Corporate Retreats",
    copy: "Team building that doesn't feel like team building. Horseback rides, gunfight shows, ranch dinners under the stars — and meeting space when you actually need to work. Your team comes back with stories, not just slides.",
    href: "/corporate-retreats",
    cta: "Plan Your Corporate Retreat",
  },
  {
    title: "Conferences & Industry Events",
    copy: "Host your festival, summit, or industry gathering in a town that IS the venue. Historic buildings, open-air spaces, and a community that shows up to support the events it hosts.",
    href: "/conferences",
    cta: "Plan Your Conference",
  },
  {
    title: "Weddings & Private Events",
    copy: "A backdrop no venue catalog can match. Historic churches, ranch ceremonies, saloon receptions — with the whole town ready to make your day part of its story.",
    href: "/weddings",
    cta: "Plan Your Wedding",
  },
  {
    title: "Film & Production",
    copy: "The real Old West, ready for your production. Authentic 1880s streets and buildings — a National Historic Landmark district, not a set — plus desert landscapes, working reenactment casts, and year-round shooting weather.",
    href: "/filming",
    cta: "Plan Your Production",
  },
];

export default function EventsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
        ])}
      />
      <JsonLd data={eventsFaqSchema()} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-24 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_55%_at_50%_30%,rgba(193,153,63,0.2),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-display text-4xl font-bold sm:text-6xl">
            Bring Your Event to Tombstone
          </h1>
          <p className="mt-4 font-display text-lg text-tombstone-gold sm:text-xl">
            Corporate retreats. Conferences. Film festivals. Weddings. 50–500+ people.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80">
            Your people will remember an event in Tombstone for the rest of their lives.
            We&apos;ll connect you with venues, coordinate logistics, and help market your
            event — so all you have to do is bring your group.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-block rounded-md bg-tombstone-red px-8 py-3 font-semibold text-white transition hover:bg-tombstone-red/90"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* EVENT TYPES & SERVICES */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
            What We Host
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {EVENT_SERVICES.map((svc) => (
              <div
                key={svc.title}
                className="flex flex-col rounded-xl border border-black/10 bg-tombstone-light p-6"
              >
                <h3 className="font-display text-xl font-bold text-tombstone-navy">
                  {svc.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-tombstone-dark/80">{svc.copy}</p>
                <Link
                  href={svc.href}
                  className="mt-auto pt-5 text-sm font-semibold text-tombstone-red hover:underline"
                >
                  {svc.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — answer-first, matches FAQPage schema */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-tombstone-navy">
          Event Planning Questions
        </h2>
        <div className="mt-8 space-y-4">
          {EVENTS_PAGE_FAQ.map((faq) => (
            <details key={faq.question} className="rounded-lg border border-black/10 bg-white p-5">
              <summary className="cursor-pointer font-display font-semibold text-tombstone-dark marker:text-tombstone-red">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-tombstone-dark/80">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
            Bring Your Event to Tombstone
          </h2>
          <p className="mt-4 text-base text-tombstone-dark/75">
            Tell us what you&apos;re planning — venue matching, logistics, and local
            coordination — and we&apos;ll take it from there.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Event%20Inquiry`}
            className="mt-8 inline-block rounded-md bg-tombstone-red px-8 py-3 font-semibold text-white transition hover:bg-tombstone-red/90"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
