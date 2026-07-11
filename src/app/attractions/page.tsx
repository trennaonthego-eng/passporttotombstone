import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Things to Do in Tombstone, AZ",
  description:
    "Gunfight reenactments, Boot Hill Graveyard, underground mine tours, the Bird Cage Theatre, and more. The real Old West, not a recreation.",
};

export default function AttractionsPage() {
  return (
    <CategoryPage
      category="Attractions"
      path="/attractions"
      title="Experience the Real Tombstone"
      intro="This isn't re-enacted for tourists and packed away at night. The gunfight corner, the graveyard, the mines, the theatre — they're the real places where the real story happened, kept alive by people who take that seriously."
    />
  );
}
