import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import UpgradeForm from "@/components/UpgradeForm";
import { getAllBusinesses } from "@/lib/business-data";
import type { UpgradeTier } from "@/lib/stripe";
import { breadcrumbSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Upgrade Your Partnership",
  description:
    "Upgrade to a Featured or Premier Story Partner listing, or sponsor the newsletter — pay securely and go live within minutes.",
};

// Re-render every 5 minutes so newly added businesses show up in the picker.
export const revalidate = 300;

const VALID_TIERS: UpgradeTier[] = ["featured", "premier", "newsletter_sponsor"];

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; canceled?: string }>;
}) {
  const params = await searchParams;
  const initialTier: UpgradeTier = VALID_TIERS.includes(params.tier as UpgradeTier)
    ? (params.tier as UpgradeTier)
    : "featured";

  const businesses = (await getAllBusinesses())
    .map((b) => ({ id: b.id, name: b.name, category: b.category }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Partnerships", path: "/partnerships" },
          { name: "Upgrade", path: "/upgrade" },
        ])}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-20 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_60%_60%_at_50%_30%,rgba(193,153,63,0.2),transparent_70%)]" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-tombstone-gold sm:text-sm">
            Partnerships
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Upgrade Your Partnership
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/80">
            Pick a tier, tell us who you are, and pay securely — your listing upgrades
            automatically once payment goes through.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <UpgradeForm
            businesses={businesses}
            initialTier={initialTier}
            canceled={params.canceled === "1"}
          />
        </div>
      </section>
    </>
  );
}
