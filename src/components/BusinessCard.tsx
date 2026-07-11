import type { Business } from "@/lib/types";
import PlaceholderPhoto from "./PlaceholderPhoto";

const TIER_BADGE: Record<Business["tier"], string | null> = {
  free: null,
  featured: "Featured",
  premium_featured: "Premier Partner",
  event_host: "Event Host",
};

export default function BusinessCard({ business }: { business: Business }) {
  const badge = TIER_BADGE[business.tier];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative h-44 w-full">
        <PlaceholderPhoto seed={business.id} label={business.name} className="h-full w-full" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-tombstone-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-tombstone-dark shadow">
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

        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <div className="flex flex-col gap-0.5 text-tombstone-dark/60">
            {business.phone && <span>{business.phone}</span>}
          </div>
          {business.website ? (
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-tombstone-red hover:underline"
            >
              Learn more →
            </a>
          ) : (
            <span className="font-semibold text-tombstone-red/70">Learn more →</span>
          )}
        </div>
      </div>
    </article>
  );
}
