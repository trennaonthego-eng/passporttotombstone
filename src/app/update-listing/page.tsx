import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ListingUpdateForm from "@/components/ListingUpdateForm";
import { getAllBusinesses } from "@/lib/business-data";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Update Your Listing",
  description:
    "Own a Tombstone business? Update your address, hours, phone, email, or website in the Passport to Tombstone directory — free for every listing.",
};

// Re-render every 5 minutes so newly added businesses show up in the picker.
export const revalidate = 300;

export default async function UpdateListingPage({
  searchParams,
}: {
  searchParams: Promise<{ business?: string }>;
}) {
  const params = await searchParams;
  const businesses = (await getAllBusinesses())
    .map((b) => ({ id: b.id, name: b.name, category: b.category }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Update Your Listing", path: "/update-listing" },
        ])}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-16 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_60%_at_50%_30%,rgba(193,153,63,0.2),transparent_70%)]" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-tombstone-gold sm:text-sm">
            For Tombstone Businesses
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Update Your Listing
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/80">
            Keep your address, hours, phone, email, and website current — free for every
            listing, no partnership required. We review each update before it goes live.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <ListingUpdateForm businesses={businesses} initialBusinessId={params.business} />
        </div>
      </section>
    </>
  );
}
