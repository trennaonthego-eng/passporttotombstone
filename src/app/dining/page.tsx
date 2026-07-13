import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

// Re-render every 5 minutes so VA edits from /admin appear without a deploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Saloons & Restaurants in Tombstone, AZ",
  description:
    "Eat and drink in Tombstone's historic saloons and restaurants — some pouring since 1881. Taste the history, meet the people.",
};

export default function DiningPage() {
  return (
    <CategoryPage
      category="Dining"
      path="/dining"
      title="Saloon Stories"
      intro="Taste the history. Meet the people. Some of these bars have been pouring since 1881, in buildings that took stray bullets and kept serving. The locals still eat and drink here — that tells you everything."
    />
  );
}
