import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToTripButton from "@/components/AddToTripButton";
import JsonLd from "@/components/JsonLd";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";
import { businesses, getById } from "@/data/businesses";
import { buildingHistoryFor } from "@/lib/building-history";
import { businessQrDataUrl } from "@/lib/qr";
import { breadcrumbSchema, localBusinessSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return businesses.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const business = getById(id);
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
  const business = getById(id);
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
