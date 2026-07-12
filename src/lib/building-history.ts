import type { Business } from "@/lib/types";

const STREET_NOTES: Record<string, string> = {
  allen: "Allen Street was Tombstone's main commercial strip during the silver boom — the block that burned twice, in 1881 and 1882, and was rebuilt in brick both times.",
  toughnut: "Toughnut Street takes its name from the Tough Nut Mine, the 1877 discovery that founded the town.",
  fremont: "Fremont Street ran past the courthouse and many of the town's early civic buildings.",
  safford: "Safford Street was named for Arizona Territory's governor at the time Tombstone was founded.",
};

/**
 * Honest, non-invented framing for the "then" side of a business page.
 * For Attractions, the business's own story/description IS the historical
 * account (those are documented sites). For everything else, we give
 * accurate general context about the town and street rather than inventing
 * specifics about a building we have no record for.
 */
export function buildingHistoryFor(business: Business): string {
  if (business.category === "Attractions") {
    return business.story;
  }

  const streetKey = Object.keys(STREET_NOTES).find((key) =>
    business.address?.toLowerCase().includes(key)
  );
  const streetNote = streetKey ? STREET_NOTES[streetKey] : null;

  const general =
    "Tombstone was founded in 1877 after prospector Ed Schieffelin struck silver in these hills. The town boomed through the early 1880s, survived two major fires, and kept going after the silver ran out — earning the name \"the town too tough to die.\" The Tombstone Historic District was declared a National Historic Landmark in 1961.";

  return streetNote ? `${general} ${streetNote}` : general;
}
