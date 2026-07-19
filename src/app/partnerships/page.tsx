import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Partner With Us — Pricing & Tiers",
  description:
    "Every business in Tombstone is part of our story. Free listings, featured placements, event host partnerships, and newsletter sponsorships for Tombstone businesses.",
};

const TIERS = [
  {
    icon: "📖",
    name: "Free Listing",
    price: "Free",
    highlight: false,
    features: [
      "Business card listing (name, phone, hours, website link)",
      "Appears on your category page",
      "Basic contact info",
    ],
    cta: "Get Listed / Update Info",
    href: "/update-listing",
  },
  {
    icon: "⭐",
    name: "Featured",
    price: "$49/month",
    highlight: false,
    features: [
      "Everything in Free, plus:",
      "⭐ Star badge on your listing card",
      "Dedicated landing page with your full story",
      "Passport stamp QR code — visitors collect a stamp at your counter",
      "Featured in 2 newsletters per month",
    ],
    cta: "Go Featured",
    href: "/upgrade?tier=featured",
  },
  {
    icon: "👑",
    name: "Premium",
    price: "$99/month",
    highlight: true,
    features: [
      "Everything in Featured, plus:",
      "👑 Premium badge + top placement on your category page",
      "The Marshal (our AI guide) recommends you first",
      "Priority in visitor trip-planner suggestions",
      "Featured in all 4 newsletters per month",
      "2 blog posts about your business (great for Google & AI search)",
      "Homepage rotation in \"Featured Businesses\"",
      "Photo gallery on your landing page",
      "Placement on event pages (weddings, filming, retreats)",
      "Monthly ready-to-post social & Google Business templates",
    ],
    cta: "Go Premium",
    href: "/upgrade?tier=premier",
  },
  {
    icon: "🎫",
    name: "Newsletter Sponsor",
    price: "$25/month",
    highlight: false,
    features: [
      "Logo + short story in every weekly newsletter (all 4)",
      "Standalone — no business listing required",
    ],
    cta: "Sponsor the Newsletter",
    href: "/upgrade?tier=newsletter_sponsor",
  },
];

const FAQ = [
  {
    q: "What does it mean to be a Story Partner?",
    a: "It means we tell your story, not just list your address. Every partner gets a narrative listing that explains why your business matters to Tombstone — written to attract visitors who care about authentic experiences, not just the cheapest option. The free tier gets you in the Passport; paid tiers put your story in front of more people, more often.",
  },
  {
    q: "What does the Premium landing page include?",
    a: "A dedicated page on this site telling your full story — narrative, photo gallery, hours, contact details, and links — plus auto-generated social media and Google Business Profile post templates you can reuse. Premium partners also appear in the event-type pages (weddings, filming, retreats, conferences) where their venue or service fits.",
  },
  {
    q: "Will I make more money?",
    a: "Our job is to bring more of the right visitors through your doors — travelers who stay overnight, spend locally, and come back. Event bookings alone can bring 50+ people for multiple nights. We can't promise numbers, but every tier is priced so that a handful of extra customers a month covers it.",
  },
  {
    q: "Can I switch tiers?",
    a: "Yes, anytime. Start free, upgrade when you see the traffic, or scale back seasonally. Partnerships are month-to-month — no long-term contracts.",
  },
];

export default function PartnershipsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Partnerships", path: "/partnerships" },
        ])}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-20 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_70%_at_50%_25%,rgba(193,153,63,0.18),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Partner With Us to Tell Tombstone&apos;s Story
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80">
            Every business in Tombstone is part of our story. Partner with us to help
            visitors discover what makes this town real—and bring more people through your
            doors.
          </p>
        </div>
      </section>

      {/* SUMMER SPECIAL BANNER */}
      <section className="bg-tombstone-red py-4">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold text-white sm:text-base">
            ☀️ <span className="uppercase tracking-widest">Summer Special</span> — 50% off
            Featured &amp; Premium every month through November. Use code{" "}
            <span className="rounded bg-white/20 px-2 py-0.5 font-mono font-bold">SUMMER50</span>{" "}
            at checkout.
          </p>
        </div>
      </section>

      {/* TIERS */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-6 shadow-sm ${
                tier.highlight
                  ? "border-tombstone-gold bg-white ring-2 ring-tombstone-gold"
                  : "border-black/10 bg-white"
              }`}
            >
              {tier.highlight && (
                <span className="mb-3 w-fit rounded-full bg-tombstone-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-tombstone-dark">
                  Most Popular
                </span>
              )}
              <div className="text-3xl">{tier.icon}</div>
              <h2 className="mt-3 font-display text-xl font-bold text-tombstone-dark">
                {tier.name}
              </h2>
              <p className="mt-1 text-2xl font-bold text-tombstone-navy">{tier.price}</p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm text-tombstone-dark/80">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="mt-0.5 text-tombstone-red">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-6 rounded-md px-5 py-2.5 text-center text-sm font-semibold transition ${
                  tier.highlight
                    ? "bg-tombstone-red text-white hover:bg-tombstone-red/90"
                    : "border-2 border-tombstone-navy text-tombstone-navy hover:bg-tombstone-navy hover:text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-tombstone-navy">
            Partner Questions
          </h2>
          <div className="mt-8 space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="rounded-lg border border-black/10 bg-tombstone-light p-5">
                <summary className="cursor-pointer font-display font-semibold text-tombstone-dark marker:text-tombstone-red">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-tombstone-dark/80">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contact" className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-tombstone-navy">
            Ready to tell your story?
          </h2>
          <p className="mt-4 text-base text-tombstone-dark/75">
            Email us and tell us about your business. We&apos;ll get your story into the
            Passport.
          </p>
          <a
            href="mailto:partners@passporttotombstone.com?subject=Partnership%20Inquiry"
            className="mt-8 inline-block rounded-md bg-tombstone-red px-8 py-3 font-semibold text-white transition hover:bg-tombstone-red/90"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
