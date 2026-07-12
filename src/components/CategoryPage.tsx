import FilteredBusinessGrid from "@/components/FilteredBusinessGrid";
import JsonLd from "@/components/JsonLd";
import { getByCategory } from "@/data/businesses";
import {
  breadcrumbSchema,
  categoryItemListSchema,
  localBusinessSchema,
} from "@/lib/structured-data";
import type { Category } from "@/lib/types";

const TIER_ORDER: Record<string, number> = {
  premium_featured: 0,
  event_host: 1,
  featured: 2,
  free: 3,
};

export default function CategoryPage({
  category,
  path,
  title,
  intro,
}: {
  category: Category;
  path: string;
  title: string;
  intro: string;
}) {
  const items = [...getByCategory(category)].sort(
    (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier] || a.name.localeCompare(b.name)
  );

  const subcategories = Array.from(
    new Set(items.map((b) => b.subcategory).filter(Boolean))
  ) as string[];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: category, path },
        ])}
      />
      <JsonLd data={categoryItemListSchema(category, path, items)} />
      {items.map((b) => (
        <JsonLd key={b.id} data={localBusinessSchema(b)} />
      ))}

      <section className="relative overflow-hidden bg-gradient-to-b from-[#1d150f] to-[#4c2f1c] py-16 text-white">
        <div className="absolute inset-0 [background:radial-gradient(ellipse_70%_80%_at_30%_20%,rgba(193,153,63,0.16),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-tombstone-gold">
            {category}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {items.length === 0 ? (
          <p className="text-tombstone-dark/60">
            Listings coming soon. Are you a {category.toLowerCase()} business in Tombstone?{" "}
            <a href="/partnerships" className="font-semibold text-tombstone-red hover:underline">
              Get listed free.
            </a>
          </p>
        ) : (
          <FilteredBusinessGrid items={items} subcategories={subcategories} />
        )}
      </section>
    </>
  );
}
