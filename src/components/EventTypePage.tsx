import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";
import { getById } from "@/data/businesses";
import type { EventPageDef } from "@/data/event-pages";
import { breadcrumbSchema } from "@/lib/structured-data";

function VenueCard({ id }: { id: string }) {
  const b = getById(id);
  if (!b) return null;
  const contactHref = b.website ?? `/business/${b.id}`;
  const external = Boolean(b.website);
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-tombstone-dark/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <PlaceholderPhoto seed={b.id} className="h-36 w-full" />
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="font-display text-lg font-bold text-tombstone-dark">{b.name}</h3>
        {b.subcategory && (
          <p className="text-xs font-semibold uppercase tracking-wide text-tombstone-navy">
            {b.subcategory}
            {b.event_capacity ? ` · ${b.event_capacity}` : ""}
          </p>
        )}
        <p className="text-sm leading-relaxed text-tombstone-dark/75">{b.description}</p>
        {b.address && <p className="text-xs text-tombstone-dark/60">📍 {b.address}</p>}
        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          {b.phone ? (
            <a href={`tel:${b.phone}`} className="text-tombstone-dark/70 hover:text-tombstone-dark">
              {b.phone}
            </a>
          ) : (
            <span />
          )}
          <a
            href={contactHref}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-semibold text-tombstone-red hover:underline"
          >
            Contact Venue →
          </a>
        </div>
      </div>
    </article>
  );
}

export default function EventTypePage({ def }: { def: EventPageDef }) {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: def.navLabel, path: `/${def.slug}` },
        ])}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-24 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_60%_at_50%_30%,rgba(193,153,63,0.2),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-tombstone-gold sm:text-sm">
            {def.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{def.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl font-display text-lg italic text-tombstone-gold sm:text-xl">
            {def.tagline}
          </p>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-tombstone-navy">{def.why.heading}</h2>
        <ul className="mt-6 space-y-3">
          {def.why.points.map((point) => (
            <li key={point} className="flex gap-3 text-base text-tombstone-dark/85">
              <span className="mt-0.5 text-tombstone-gold">✦</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTIONS */}
      {def.sections.map((section, i) => (
        <section
          key={section.heading}
          className={i % 2 === 0 ? "bg-white py-16" : "py-16"}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-tombstone-navy sm:text-3xl">
              {section.heading}
            </h2>
            {section.blurb && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tombstone-dark/75">
                {section.blurb}
              </p>
            )}
            {section.businessIds && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.businessIds.map((id) => (
                  <VenueCard key={id} id={id} />
                ))}
              </div>
            )}
            {section.categoryLink && (
              <div className="mt-6">
                <Link
                  href={section.categoryLink.href}
                  className="inline-block rounded-md border-2 border-tombstone-navy px-5 py-2 text-sm font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
                >
                  {section.categoryLink.label} →
                </Link>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* SAMPLE ITINERARIES */}
      {def.itineraries && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-tombstone-navy sm:text-3xl">
              Sample Itineraries
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {def.itineraries.map((it) => (
                <div key={it.name} className="rounded-2xl border border-tombstone-gold/40 bg-tombstone-light p-6">
                  <h3 className="font-display text-lg font-bold text-tombstone-dark">{it.name}</h3>
                  <ol className="mt-4 space-y-2">
                    {it.steps.map((step, i) => (
                      <li key={step} className="flex gap-2 text-sm text-tombstone-dark/80">
                        <span className="font-bold text-tombstone-red">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CHECKLIST */}
      {def.checklist && (
        <section className="py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold text-tombstone-navy sm:text-3xl">
              Planning Checklist
            </h2>
            <ul className="mt-6 space-y-3 rounded-2xl border border-black/10 bg-white p-6">
              {def.checklist.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-tombstone-dark/85">
                  <span className="text-tombstone-red">☐</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CLOSING */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-base leading-relaxed text-tombstone-dark/80">{def.closingNote}</p>
          <Link
            href="/events"
            className="mt-8 inline-block rounded-full bg-tombstone-red px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#b8532e]"
          >
            Bring Your Event Here
          </Link>
        </div>
      </section>
    </>
  );
}
