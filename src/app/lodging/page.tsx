import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

// Re-render every 5 minutes so VA edits from /admin appear without a deploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Where to Stay in Tombstone, AZ",
  description:
    "Historic inns, guest ranches, glamping, B&Bs, and RV parks in Tombstone, Arizona. Sleep where the Old West still breathes.",
};

export default function LodgingPage() {
  return (
    <CategoryPage
      category="Lodging"
      path="/lodging"
      title="Rest Like a Legend"
      intro="Sleep where the Old West still breathes. From glamping tents under desert stars to boarding houses that put up miners in the 1880s — every place to stay in Tombstone comes with a story attached."
    />
  );
}
