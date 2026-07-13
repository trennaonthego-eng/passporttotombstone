import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToTripButton from "@/components/AddToTripButton";
import CopyBlock from "@/components/CopyBlock";
import JsonLd from "@/components/JsonLd";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";
import { businesses } from "@/data/businesses";
import { getBusinessById } from "@/lib/business-data";
import { buildingHistoryFor } from "@/lib/building-history";
import { businessQrDataUrl } from "@/lib/qr";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/structured-data";

// Prerender all seed businesses; VA edits (and VA-added businesses, rendered
// on demand) refresh within 5 minutes without a deploy.
export const revalidate = 300;
export const dynamicParams = true;

export function generateStaticParams() {
  return businesses.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const business = await getBusinessById(id);
  if (!business) return {};
  return {
    title: business.name,
    description: business.description,
  };
}

const CATEGORY_PATH: Record<string, string> = {
  Lodging: "/lodging",
  Dining: "/dining",
  Attractions: "/attractions",
  Shopping: "/shopping",
  Services: "/services",
};

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const business = await getBusinessById(id);
  if (!business) notFound();

  const [history, qrDataUrl] = await Promise.all([
    Promise.resolve(buildingHistoryFor(business)),
    businessQrDataUrl(business.id),
  ]);

  return (
    <>
      <JsonLd data={localBusinessSchema(business)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: business.category, path: CATEGORY_PATH[business.category] ?? "/" },
          { name: business.name, path: `/business/${business.id}` },
        ])}
      />

      <section className="relative h-72 w-full overflow-hidden sm:h-96">
        <PlaceholderPhoto seed={business.id} className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-tombstone-dark/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-4 pb-6 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Link
              href={CATEGORY_PATH[business.category] ?? "/"}
              className="text-xs font-semibold uppercase tracking-widest text-tombstone-gold"
            >
              ← {business.category}
            </Link>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">
              {business.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          {business.subcategory && (
            <span className="rounded-full bg-tombstone-navy/10 px-3 py-1 text-xs font-semibold text-tombstone-navy">
              {business.subcategory}
            </span>
          )}
          <AddToTripButton id={business.id} name={business.name} category={business.category} />
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-bold text-tombstone-navy">The Building</h2>
            <p className="mt-3 text-sm leading-relaxed text-tombstone-dark/80">{history}</p>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-tombstone-navy">Today</h2>
            <p className="mt-3 text-sm leading-relaxed text-tombstone-dark/80">
              {business.description}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-tombstone-dark/80">{business.story}</p>
            <dl className="mt-5 space-y-1 text-sm text-tombstone-dark/70">
              {business.address && (
                <div className="flex gap-2">
                  <dt className="font-semibold">Address:</dt>
                  <dd>{business.address}</dd>
                </div>
              )}
              {business.phone && (
                <div className="flex gap-2">
                  <dt className="font-semibold">Phone:</dt>
                  <dd>{business.phone}</dd>
                </div>
              )}
              {business.website && (
                <div className="flex gap-2">
                  <dt className="font-semibold">Website:</dt>
                  <dd>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-tombstone-red hover:underline"
                    >
                      {business.website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* PREMIER PERKS — full landing page treatment for paying partners */}
        {business.tier === "premium_featured" && (
          <>
            {/* Current listings — Team Franko real estate placeholder until
                Trenna supplies live listing data and photos */}
            {business.id === "services_007" && (
              <div className="mt-14">
                <h2 className="font-display text-2xl font-bold text-tombstone-navy">
                  Current Listings
                </h2>
                <p className="mt-2 text-sm text-tombstone-dark/70">
                  Live listings are on their way. In the meantime, contact Trenna directly
                  for what&apos;s on the market in Tombstone and Cochise County right now.
                </p>
                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="overflow-hidden rounded-2xl border border-dashed border-tombstone-navy/25 bg-tombstone-light"
                    >
                      <PlaceholderPhoto seed={`listing-${n}`} className="h-32 w-full opacity-60" />
                      <div className="p-4">
                        <p className="font-display text-sm font-bold text-tombstone-dark/60">
                          Listing photo &amp; details coming soon
                        </p>
                        <p className="mt-1 text-xs text-tombstone-dark/50">
                          Address · Price · Beds/Baths
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo gallery — populated via admin once real photos exist */}
            <div className="mt-14">
              <h2 className="font-display text-2xl font-bold text-tombstone-navy">
                Photo Gallery
              </h2>
              <p className="mt-2 text-sm text-tombstone-dark/70">
                Real photography coming soon — these tiles are placeholders.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {["a", "b", "c", "d"].map((k) => (
                  <PlaceholderPhoto
                    key={k}
                    seed={`${business.id}-gallery-${k}`}
                    className="h-32 w-full rounded-xl"
                  />
                ))}
              </div>
            </div>

            {/* Auto-generated post templates */}
            <div className="mt-14">
              <h2 className="font-display text-2xl font-bold text-tombstone-navy">
                Ready-to-Post Templates
              </h2>
              <p className="mt-2 text-sm text-tombstone-dark/70">
                A Premier perk: copy, tweak if you like, and post.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <CopyBlock
                  label="Social media post"
                  text={`${business.story}\n\n${business.description}\n\n📍 Find us in Tombstone, Arizona — the town too tough to die.${business.address ? `\n${business.address}` : ""}${business.phone ? `\n📞 ${business.phone}` : ""}\n\n#Tombstone #TombstoneAZ #OldWest #PassportToTombstone`}
                />
                <CopyBlock
                  label="Google Business Profile post"
                  text={`${business.description}\n\n${business.story}\n\nProudly part of Passport to Tombstone — the guide to the real Old West.${business.phone ? ` Call ${business.phone}.` : ""}`}
                />
              </div>
            </div>
          </>
        )}

        <div className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-tombstone-navy/25 bg-tombstone-light p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-tombstone-navy/70">
            For the building — scan or print
          </p>
          <Image
            src={qrDataUrl}
            alt={`QR code linking to the Passport to Tombstone page for ${business.name}`}
            width={160}
            height={160}
            className="rounded-lg border border-tombstone-navy/10 bg-white p-2"
            unoptimized
          />
          <p className="max-w-xs text-xs text-tombstone-dark/60">
            Post this at the building — visitors scan it for the building&apos;s history and
            what it is today.
          </p>
          <a
            href={qrDataUrl}
            download={`${business.id}-qr.png`}
            className="text-xs font-semibold text-tombstone-red hover:underline"
          >
            Download QR Code
          </a>
        </div>
      </section>
    </>
  );
}
