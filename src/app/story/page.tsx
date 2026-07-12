import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";
import { characters, timeline } from "@/data/history";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "The Story of Tombstone — Myth vs. the Record",
  description:
    "The documented history of Tombstone, Arizona: Ed Schieffelin's 1877 silver strike, the 30-second gunfight of October 26, 1881, two great fires, the flooded mines, and the town that refused to die. Plus the real stories of Wyatt Earp, Doc Holliday, Big Nose Kate, and Curly Bill.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://passporttotombstone.com";

function charactersSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Historical figures of Tombstone, Arizona",
    itemListElement: characters.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: c.name,
        description: c.record,
        url: `${SITE_URL}/story#${c.id}`,
      },
    })),
  };
}

export default function StoryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "The Story", path: "/story" },
        ])}
      />
      <JsonLd data={charactersSchema()} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-20 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_70%_at_50%_25%,rgba(193,153,63,0.18),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-tombstone-gold sm:text-sm">
            The Storytelling Core
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
            The Legend &amp; the Record
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-display text-lg italic text-tombstone-gold sm:text-xl">
            Hollywood told you a story. The town remembers what actually happened.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80">
            Everything below sticks to the documented record — and where the myth and the
            record disagree, we tell you both. That honesty is the most Tombstone thing
            about this town.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <h2 className="text-center font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
          From Silver Strike to Living Landmark
        </h2>
        <div className="relative mt-14">
          {/* spine */}
          <div className="absolute left-[19px] top-0 h-full w-px bg-tombstone-gold/50 sm:left-1/2" />
          <ol className="space-y-12">
            {timeline.map((ev, i) => (
              <li key={ev.year + ev.title} className="relative sm:grid sm:grid-cols-2 sm:gap-10">
                {/* node */}
                <span className="absolute left-[11px] top-1.5 h-4 w-4 rounded-full border-2 border-tombstone-gold bg-tombstone-light sm:left-1/2 sm:-ml-2" />
                <div
                  className={`pl-12 sm:pl-0 ${
                    i % 2 === 0
                      ? "sm:col-start-1 sm:pr-10 sm:text-right"
                      : "sm:col-start-2 sm:pl-10"
                  }`}
                >
                  <p className="font-display text-2xl font-bold text-tombstone-red">{ev.year}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-tombstone-dark">
                    {ev.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-tombstone-dark/80">{ev.story}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CHARACTERS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-tombstone-red">
            The Cast — As They Actually Were
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
            Myth vs. the Record
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {characters.map((c) => (
              <article
                key={c.id}
                id={c.id}
                className="overflow-hidden rounded-2xl border border-tombstone-dark/10 bg-tombstone-light shadow-sm"
              >
                <div className="relative h-36">
                  <PlaceholderPhoto seed={c.id} className="h-full w-full" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="font-display text-2xl font-bold text-white">{c.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-widest text-tombstone-gold">
                      {c.lived} · {c.role}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-tombstone-dark/50">
                      The myth
                    </p>
                    <p className="mt-1 font-display text-sm italic text-tombstone-dark/75">
                      {c.myth}
                    </p>
                  </div>
                  <div className="border-t border-tombstone-gold/40 pt-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-tombstone-red">
                      The record
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-tombstone-dark/85">
                      {c.record}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-tombstone-navy">
            Now walk the streets where it happened.
          </h2>
          <p className="mt-4 text-base text-tombstone-dark/75">
            The lot off Fremont Street, the Bird Cage, Boothill — they&apos;re all still
            here, and so are the people keeping them alive.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/attractions"
              className="rounded-full bg-tombstone-red px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#b8532e]"
            >
              See the Real Places
            </Link>
            <Link
              href="/lodging"
              className="rounded-full border border-tombstone-navy px-8 py-3 text-sm font-semibold uppercase tracking-widest text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
            >
              Stay the Night
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
