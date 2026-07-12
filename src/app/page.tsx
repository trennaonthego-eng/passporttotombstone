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
      <JsonLd data={faqPageSchema()} />

      {/* 1. HERO */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-b from-tombstone-navy via-tombstone-dark to-tombstone-dark">
        <div className="absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(45deg,var(--color-tombstone-gold)_0,var(--color-tombstone-gold)_1px,transparent_1px,transparent_16px)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-tombstone-gold">
            Tombstone, Arizona
          </p>
          <h1 className="font-display text-5xl font-bold text-white sm:text-7xl">
            Passport to Tombstone
          </h1>
          <p className="mt-4 font-display text-xl text-tombstone-gold sm:text-2xl">
            Step into the real Old West. A town too tough to die.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80">
            Tombstone isn&apos;t a museum. It&apos;s alive. 1,400 people live here. Every
            business has a story. Every street remembers history. Come experience the
            authentic Old West—or bring your entire team for an unforgettable retreat.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#newsletter"
              className="w-full rounded-md bg-tombstone-red px-8 py-3 font-semibold text-white transition hover:bg-tombstone-red/90 sm:w-auto"
            >
              Begin Your Journey
            </a>
            <Link
              href="/events"
              className="w-full rounded-md border-2 border-tombstone-gold px-8 py-3 font-semibold text-tombstone-gold transition hover:bg-tombstone-gold hover:text-tombstone-dark sm:w-auto"
            >
              Bring Your Event Here
            </Link>
          </div>
        </div>
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
      <section className="bg-tombstone-navy py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
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
