import { CONTACT_EMAIL } from "@/lib/contact";
import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Live Here — What It's Actually Like to Live in Tombstone, Arizona",
  description:
    "Thinking about making Tombstone home? The honest picture of living in Tombstone, AZ: the high-desert climate, the schools, the everyday essentials, the neighbors, and who to talk to about the market.",
};

/** Real everyday-life anchors, all pulled from the business directory —
 * nothing invented. Each id links to the live listing. */
const EVERYDAY_LIFE: { icon: string; label: string; detail: string; businessId?: string }[] = [
  {
    icon: "🏫",
    label: "Schools",
    detail:
      "Tombstone Unified School District runs Walter J. Meyer Elementary and Tombstone High School — home of the Yellow Jackets — right in town.",
    businessId: "services_026",
  },
  {
    icon: "🏦",
    label: "Banking",
    detail: "Vantage West Credit Union on Sumner Street handles mortgages, car loans, and everyday banking.",
    businessId: "services_008",
  },
  {
    icon: "📚",
    label: "Library",
    detail: "The city library lives in the old railroad depot on 4th Street, tied into the Cochise County system.",
    businessId: "services_010",
  },
  {
    icon: "📮",
    label: "Post Office",
    detail: "The post office on Haskell Street doubles as the community message board — small-town style.",
    businessId: "services_020",
  },
  {
    icon: "🚒",
    label: "Fire & Emergency",
    detail: "Tombstone's volunteer fire department protects the town from San Diego Street.",
    businessId: "services_016",
  },
  {
    icon: "🗞️",
    label: "Local News",
    detail: "The Tombstone News, a weekly paper, still covers the town and Cochise County the old way.",
    businessId: "services_019",
  },
  {
    icon: "⛪",
    label: "Churches",
    detail: "Several congregations worship in town, from Bethel Chapel to St. Paul's — Arizona's oldest Protestant church building.",
  },
  {
    icon: "🤝",
    label: "Community",
    detail:
      "The Lions Club, American Legion Post #24, the Vigilantes, and the Chamber of Commerce keep a town of 1,400 busier than cities ten times its size.",
    businessId: "services_012",
  },
];

const DISTANCES = [
  { place: "Sierra Vista", note: "groceries, hospitals, big-box shopping", drive: "~30 min" },
  { place: "Benson & I-10", note: "the interstate, Amtrak stop", drive: "~30 min" },
  { place: "Bisbee", note: "the artsy neighbor down Highway 80", drive: "~30 min" },
  { place: "Tucson", note: "international airport, university, city life", drive: "~1 hr 15 min" },
];

export default function LiveHerePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Live Here", path: "/live" },
        ])}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-20 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_70%_at_50%_25%,rgba(193,153,63,0.18),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-tombstone-gold sm:text-sm">
            Stay · Play · Live
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
            What If You Didn&apos;t Go Home?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-display text-lg italic text-tombstone-gold sm:text-xl">
            Some people visit Tombstone. Some people recognize it.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80">
            About 1,400 people wake up here every day — in a National Historic Landmark, in
            the high desert, in a town where the post office is the social network and your
            neighbors show up. This page is the honest picture of what living here is
            actually like.
          </p>
        </div>
      </section>

      {/* THE LIFE */}
      <section className="bg-tombstone-light py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-tombstone-navy">The Life</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-tombstone-dark/80">
            <p>
              Tombstone sits at roughly 4,500 feet in the high desert of Cochise County —
              which means real seasons without the extremes. Summers run noticeably cooler
              than Phoenix or Tucson, winters bring crisp mornings and the occasional dusting
              of snow, and the monsoon turns the hills green every July. The night sky is the
              kind most people have never actually seen.
            </p>
            <p>
              It&apos;s a working town, not a theme park. The gunfights end at five and the
              town that&apos;s left is the real one: kids at Meyer Elementary, Friday nights
              behind the high school, the Lions Club and the Legion and the Vigilantes all
              run by people you&apos;ll know by name within a month. Living in a town of
              1,400 means you are not anonymous — most people here consider that the whole
              point.
            </p>
            <p>
              The trade-offs are honest ones. Big grocery runs, hospitals, and airports mean
              a drive. Jobs in town lean on tourism, the school district, and the city;
              plenty of residents work remote or commute to Sierra Vista. If you need a
              food-delivery-at-midnight kind of life, this isn&apos;t it. If you want land,
              quiet, history, and neighbors — keep reading.
            </p>
          </div>
        </div>
      </section>

      {/* EVERYDAY ESSENTIALS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-tombstone-navy">
            The Everyday Essentials
          </h2>
          <p className="mt-2 text-sm text-tombstone-dark/70">
            All real, all in the directory — this is the town behind the boardwalk.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {EVERYDAY_LIFE.map((item) => (
              <div key={item.label} className="rounded-xl border border-black/10 bg-tombstone-light/60 p-5">
                <p className="font-display text-lg font-bold text-tombstone-dark">
                  {item.icon} {item.label}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-tombstone-dark/75">
                  {item.detail}
                </p>
                {item.businessId && (
                  <Link
                    href={`/business/${item.businessId}`}
                    className="mt-2 inline-block text-xs font-semibold text-tombstone-red hover:underline"
                  >
                    See the listing →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DISTANCES */}
      <section className="bg-tombstone-light py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-tombstone-navy">
            Close Enough, Far Enough
          </h2>
          <p className="mt-2 text-sm text-tombstone-dark/70">
            Tombstone is remote in spirit, not in practice.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {DISTANCES.map((d) => (
              <div
                key={d.place}
                className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-5"
              >
                <div>
                  <p className="font-display text-lg font-bold text-tombstone-dark">{d.place}</p>
                  <p className="text-sm text-tombstone-dark/70">{d.note}</p>
                </div>
                <p className="shrink-0 rounded-full bg-tombstone-navy/10 px-3 py-1 text-sm font-semibold text-tombstone-navy">
                  {d.drive}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THINKING ABOUT MAKING TOMBSTONE HOME */}
      <section className="bg-gradient-to-b from-[#2b211a] to-[#1d150f] py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-tombstone-gold">
            The Next Step
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Thinking About Making Tombstone Home?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80">
            Trenna Hiney has lived and sold real estate here for years — she knows which
            streets flood in monsoon season, which parcels have water rights, and where to
            look for what you actually want. Team Franko at Keller Williams Southern Arizona
            covers Tombstone and the surrounding Cochise County towns.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/business/services_007"
              className="w-full rounded-full bg-tombstone-red px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-black/30 transition hover:bg-[#b8532e] sm:w-auto"
            >
              Work With Trenna
            </Link>
            <a
              href="https://discoverazrealty.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-tombstone-gold/70 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-tombstone-gold transition hover:bg-tombstone-gold hover:text-tombstone-dark sm:w-auto"
            >
              DiscoverAZRealty.com
            </a>
          </div>
          <p className="mt-6 text-sm text-white/60">
            No pressure, no pitch — questions about the market are welcome any time.
          </p>
        </div>
      </section>

      {/* CONTACT US */}
      <section id="contact" className="bg-tombstone-light py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold text-tombstone-navy">Contact Us</h2>
          <p className="mt-3 text-sm leading-relaxed text-tombstone-dark/75">
            Curious what it&apos;s like, what&apos;s on the market, or whether the town fits
            the life you&apos;re picturing? Send a note — a real person answers.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Thinking%20about%20living%20in%20Tombstone`}
            className="mt-6 inline-block rounded-full bg-tombstone-navy px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-tombstone-dark"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
