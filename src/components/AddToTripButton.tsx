"use client";

import { useItinerary } from "@/lib/itinerary-context";

export default function AddToTripButton({
  id,
  name,
  category,
}: {
  id: string;
  name: string;
  category: string;
}) {
  const { add, remove, has } = useItinerary();
  const inTrip = has(id);

  return (
    <button
      type="button"
      onClick={() => (inTrip ? remove(id) : add({ id, kind: "business", name, category }))}
      className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
        inTrip
          ? "border-tombstone-red bg-tombstone-red/10 text-tombstone-red"
          : "border-tombstone-navy bg-tombstone-navy text-white hover:bg-[#2a1e15]"
      }`}
    >
      {inTrip ? "✓ Added to Trip" : "+ Add to Trip"}
    </button>
  );
}
