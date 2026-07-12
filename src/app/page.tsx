import Image from "next/image";
import Link from "next/link";
import BusinessCard from "@/components/BusinessCard";
import JsonLd from "@/components/JsonLd";
import NewsletterForm from "@/components/NewsletterForm";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";
import { featuredHomepageBusinesses, getByCategory } from "@/data/businesses";
import { townEvents } from "@/data/events";
import {
  HOMEPAGE_FAQ,
  faqPageSchema,
  organizationSchema,
  touristDestinationSchema,
  webSiteSchema,
} from "@/lib/structured-data";

const EXPERIENCES = [
  {
    title: "Gunfight Reenactments",
    copy: "Thirty seconds in 1881 made this corner famous. Watch it brought back to life, daily, on the street where it happened.",
  },
  {
    title: "Boot Hill Graveyard",
    copy: "The town's first residents rest here — outlaws, miners, pioneers. Read the headstones; they don't sugarcoat anything.",
  },
  {
    title: "Underground Mine Tours",
    copy: "The silver under these streets built everything above them. Go down and see where the story started.",
  },
  {
    title: "Historic Walking Tours",
    copy: "Every building on Allen Street has a story. Walk with the people who know them all — or wander on your own.",
  },
];

const EVENT_TYPES = [
  {
    title: "Corporate Retreats",
    copy: "Team building on a working ranch. Strategy sessions in a historic saloon. Your team will never forget an offsite in Tombstone.",
  },
  {
    title: "Conferences & Festivals",
    copy: "Film festivals, industry summits, and gatherings that need a backdrop no convention center can match.",
  },
  {
    title: "Weddings & Private Events",
    copy: "Say your vows where legends walked. The whole town becomes part of your celebration.",
  },
];

export default function HomePage() {
  const lodging = getByCategory("Lodging").slice(0, 6);
  const dining = getByCategory("Dining").slice(0, 4);
  const shopping = getByCategory("Shopping").slice(0, 3);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={webSiteSchema()} />
      <JsonLd data={touristDestinationSchema()} />
      <JsonLd data={faqPageSchema()} />

      {/* 1. HERO */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-tombstone-dark">
        {/* 1881 Allen Street, Tombstone — C.S. Fly, public domain (Wikimedia Commons) */}
        <Image
          src="/images/tombstone-1881-fly.jpg"
          alt="Allen Street, Tombstone, Arizona in 1881 — photograph by C.S. Fly"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.55] [filter:grayscale(1)_sepia(0.3)_contrast(1.15)_brightness(0.9)]"
        />
        {/* archival tone-map: crush the scan into the site's leather palette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1d150f]/85 via-[#1d150f]/55 to-[#4c2f1c]/95" />
        <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(43,29,15,0)_0%,rgba(29,21,15,0.5)_100%)]" />
        {/* warm lamplight glow */}
        <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_50%_at_50%_38%,rgba(193,153,63,0.22),transparent_70%)]" />
        {/* desert horizon rising into the next section */}
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-[90px] w-full sm:h-[140px]"
          aria-hidden="true"
        >
          <path
            d="M0,140 L0,96 Q120,72 260,88 Q400,104 540,80 Q660,60 800,84 Q940,108 1080,86 Q1240,62 1440,92 L1440,140 Z"
            fill="#6E4226"
            opacity="0.45"
          />
          <path
            d="M0,140 L0,116 Q180,96 360,110 Q560,126 760,106 Q980,86 1180,108 Q1320,122 1440,112 L1440,140 Z"
            fill="var(--color-tombstone-light)"
          />
        </svg>
        <div className="relative mx-auto max-w-4xl px-4 pb-32 pt-24 text-center sm:px-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.4em] text-tombstone-gold sm:text-sm">
            Tombstone · Arizona · Est. 1879
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-[#f5eee0] sm:text-8xl">
            Passport to
            <br />
            Tombstone
          </h1>
          <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-4 text-tombstone-gold">
            <span className="h-px flex-1 bg-tombstone-gold/50" />
            <span className="text-sm">✦</span>
            <span className="h-px flex-1 bg-tombstone-gold/50" />
          </div>
          <p className="mt-6 font-display text-xl italic text-tombstone-gold sm:text-2xl">
            Step into the real Old West. A town too tough to die.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#f5eee0]/75">
            Tombstone isn&apos;t a museum. It&apos;s alive. 1,400 people live here. Every
            business has a story. Every street remembers history. Come experience the
            authentic Old West—or bring your entire team for an unforgettable retreat.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#newsletter"
              className="w-full rounded-full bg-tombstone-red px-9 py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-black/30 transition hover:bg-[#b8532e] sm:w-auto"
            >
              Begin Your Journey
            </a>
            <Link
              href="/events"
              className="w-full rounded-full border border-tombstone-gold/70 px-9 py-3.5 text-sm font-semibold uppercase tracking-widest text-tombstone-gold transition hover:bg-tombstone-gold hover:text-tombstone-dark sm:w-auto"
            >
              Bring Your Event Here
            </Link>
          </div>
        </div>
        <p className="absolute bottom-3 right-4 z-10 text-[10px] tracking-wide text-[#f5eee0]/40 sm:bottom-4 sm:right-6">
          Allen Street, Tombstone, 1881 — photograph by C. S. Fly, public domain
        </p>
      </section>

      {/* 2. THE TOMBSTONE STORY */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
          This Is Tombstone in 2026
        </h2>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-tombstone-dark/85">
          <p>
            In 1877, a prospector named Ed Schieffelin was told the only thing he&apos;d
            find in these hills was his own tombstone. He found silver instead — and named
            his claim after the warning. The town that grew around it became one of the
            wildest, richest boomtowns in the American West.
          </p>
          <p>
            The silver ran out. The town didn&apos;t. While hundreds of boomtowns turned to
            dust, Tombstone kept going — earning its name as &quot;the town too tough to
            die.&quot; Today, 1,400 people choose to live here. They run the saloons, guide
            the tours, keep the buildings standing, and keep the story honest.
          </p>
          <p>
            That&apos;s what makes Tombstone different. This isn&apos;t a theme park built
            to look old. It&apos;s a real community living inside real history — and
            it&apos;s open to you.
          </p>
        </div>
        <Link
          href="/story"
          className="mt-8 inline-block rounded-md border-2 border-tombstone-navy px-6 py-2.5 font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
        >
          Read the Full Story — Myth vs. the Record
        </Link>
      </section>

      {/* 3. FEATURED STORY PARTNERS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-red">
            Featured Story Partners
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
            The People Keeping Tombstone Alive
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredHomepageBusinesses.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHERE TO STAY */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-red">
          Where to Stay
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
          Rest Like a Legend
        </h2>
        <p className="mt-4 max-w-2xl text-base text-tombstone-dark/80">
          Sleep where the Old West still breathes — historic inns, guest ranches, glamping
          under desert stars, and cabins built where miners once bunked.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lodging.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/lodging"
            className="inline-block rounded-md border-2 border-tombstone-navy px-6 py-2.5 font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
          >
            See All Lodging
          </Link>
        </div>
      </section>

      {/* 5. EAT & DRINK */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-red">
            Eat &amp; Drink
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
            Saloon Stories
          </h2>
          <p className="mt-4 max-w-2xl text-base text-tombstone-dark/80">
            Taste the history. Meet the people. Some of these bars have been pouring since
            1881 — and the locals still drink here.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dining.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/dining"
              className="inline-block rounded-md border-2 border-tombstone-navy px-6 py-2.5 font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
            >
              See All Dining
            </Link>
          </div>
        </div>
      </section>

      {/* 6. EXPERIENCE THE REAL TOMBSTONE */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-red">
          Experience the Real Tombstone
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
          What to Do
        </h2>
        <p className="mt-4 max-w-2xl text-base text-tombstone-dark/80">
          This isn&apos;t re-enacted for tourists and packed away at night. This is real —
          the sites, the streets, the underground.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERIENCES.map((exp) => (
            <div
              key={exp.title}
              className="rounded-xl border border-black/10 bg-white p-6 shadow-sm"
            >
              <PlaceholderPhoto seed={exp.title} className="h-28 w-full rounded-lg" label="" />
              <h3 className="mt-4 font-display text-lg font-bold text-tombstone-dark">
                {exp.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-tombstone-dark/75">{exp.copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/attractions"
            className="inline-block rounded-md border-2 border-tombstone-navy px-6 py-2.5 font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
          >
            See All Attractions
          </Link>
        </div>
      </section>

      {/* 7. BRING YOUR EVENT (EVENT HUB) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-20 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_80%_at_50%_15%,rgba(193,153,63,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-gold">
            Bring Your Event to Tombstone
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            Host Your People Here
          </h2>
          <p className="mt-4 max-w-2xl text-base text-white/80">
            Corporate retreats. Film festivals. Conferences. Weddings. Bring your group —
            we&apos;ll host them right. Venues from historic buildings to working ranches,
            for 50 to 500+ people, with a whole town as your backdrop.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {EVENT_TYPES.map((ev) => (
              <div key={ev.title} className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10">
                <h3 className="font-display text-xl font-bold text-tombstone-gold">
                  {ev.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{ev.copy}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="inline-block rounded-md bg-tombstone-red px-8 py-3 font-semibold text-white transition hover:bg-tombstone-red/90"
            >
              Tell Us About Your Event
            </Link>
          </div>
        </div>
      </section>

      {/* 8. EXPLORE LOCAL */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-red">
          Explore Local
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
          Made in Tombstone
        </h2>
        <p className="mt-4 max-w-2xl text-base text-tombstone-dark/80">
          Support the artisans, shopkeepers, and makers who keep this town more than a
          memory.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shopping.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/shopping"
            className="inline-block rounded-md border-2 border-tombstone-navy px-6 py-2.5 font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
          >
            See All Shops
          </Link>
        </div>
      </section>

      {/* 9. EVENTS CALENDAR */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-tombstone-red">
            Events Calendar
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
            What&apos;s Happening
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {townEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col rounded-xl border border-black/10 bg-tombstone-light p-5"
              >
                <span className="w-fit rounded-full bg-tombstone-red/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-tombstone-red">
                  {ev.recurring}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-tombstone-dark">
                  {ev.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-tombstone-dark/75">
                  {ev.description}
                </p>
                <div className="mt-auto pt-3 text-xs text-tombstone-dark/60">
                  <p>{ev.time}</p>
                  <p>{ev.location}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/calendar"
              className="inline-block rounded-md border-2 border-tombstone-navy px-6 py-2.5 font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
            >
              See the Full Calendar
            </Link>
            <p className="mt-4 text-sm text-tombstone-dark/70">
              Join the newsletter below and we&apos;ll bring the calendar to you every week.
            </p>
          </div>
        </div>
      </section>

      {/* 10. NEWSLETTER */}
      <section id="newsletter" className="bg-tombstone-dark py-20 text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Join the Story</h2>
          <p className="mt-4 max-w-xl text-base text-white/75">
            Get insider access to Tombstone&apos;s authentic experiences — the stories
            behind the businesses, this week&apos;s events, and tips only the locals know.
            Every Thursday.
          </p>
          <div className="mt-8 flex w-full justify-center">
            <NewsletterForm dark />
          </div>
        </div>
      </section>

      {/* FAQ (visible, matches FAQPage schema) */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-tombstone-navy">
          Questions Travelers Ask
        </h2>
        <div className="mt-8 space-y-6">
          {HOMEPAGE_FAQ.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-black/10 bg-white p-5"
            >
              <summary className="cursor-pointer font-display font-semibold text-tombstone-dark marker:text-tombstone-red">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-tombstone-dark/80">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
