"use client";

import Link from "next/link";
import type { Business } from "@/lib/types";
import { useItinerary } from "@/lib/itinerary-context";
import BusinessPhoto from "./BusinessPhoto";

const TIER_BADGE: Record<Business["tier"], string | null> = {
  free: null,
  featured: "Featured",
  premium_featured: "Premier Partner",
  event_host: "Event Host",
};

export default function BusinessCard({ business }: { business: Business }) {
  const badge = TIER_BADGE[business.tier];
  const { add, remove, has } = useItinerary();
  const inTrip = has(business.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-tombstone-dark/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden">
        <BusinessPhoto
          seed={business.id}
          imageUrl={business.image_url}
          alt={business.name}
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-tombstone-gold px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-md">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-tombstone-dark">{business.name}</h3>
        </div>

        {business.subcategory && (
          <span className="w-fit rounded-full bg-tombstone-navy/10 px-2.5 py-0.5 text-xs font-semibold text-tombstone-navy">
            {business.subcategory}
          </span>
        )}

        <p className="text-sm leading-relaxed text-tombstone-dark/80">{business.story}</p>

        <div className="space-y-0.5 text-xs text-tombstone-dark/65">
          {business.address && <p>📍 {business.address}</p>}
          <p>🕐 {business.hours ?? "Hours vary — call ahead"}</p>
          {business.phone && (
            <a href={`tel:${business.phone}`} className="block hover:text-tombstone-dark">
              📞 {business.phone}
            </a>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm">
          {/* Detail pages stay live for every business (AI SEO), but the link
              is a paid perk: premier gets the full profile, everyone else
              points to their own website. */}
          {business.tier === "premium_featured" ? (
            <Link href={`/business/${business.id}`} className="font-semibold text-tombstone-red hover:underline">
              View Full Profile →
            </Link>
          ) : business.website ? (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-tombstone-red hover:underline"
            >
              Visit Website →
            </a>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() =>
              inTrip
                ? remove(business.id)
                : add({ id: business.id, kind: "business", name: business.name, category: business.category })
            }
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition ${
              inTrip
                ? "border-tombstone-red bg-tombstone-red/10 text-tombstone-red"
                : "border-tombstone-navy/30 text-tombstone-navy hover:bg-tombstone-navy hover:text-white"
            }`}
          >
            {inTrip ? "✓ Added" : "+ Add to Trip"}
          </button>
        </div>
      </div>
    </article>
  );
}
