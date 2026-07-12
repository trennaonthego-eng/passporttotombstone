"use client";

import { useState } from "react";
import BusinessCard from "@/components/BusinessCard";
import type { Business } from "@/lib/types";

export default function FilteredBusinessGrid({
  items,
  subcategories,
}: {
  items: Business[];
  subcategories: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const visible = selected ? items.filter((b) => b.subcategory === selected) : items;

  const pillClass = (active: boolean) =>
    `rounded-full px-3 py-1 text-xs font-semibold transition ${
      active
        ? "bg-tombstone-red text-white shadow-sm"
        : "bg-tombstone-navy/10 text-tombstone-navy hover:bg-tombstone-navy/20"
    }`;

  return (
    <>
      {subcategories.length > 1 && (
        <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-pressed={selected === null}
            className={pillClass(selected === null)}
          >
            All ({items.length})
          </button>
          {subcategories.map((sub) => {
            const count = items.filter((b) => b.subcategory === sub).length;
            const active = selected === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setSelected(active ? null : sub)}
                aria-pressed={active}
                className={pillClass(active)}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="text-tombstone-dark/60">No listings match that filter yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((b) => (
            <BusinessCard key={b.id} business={b} />
          ))}
        </div>
      )}
    </>
  );
}
