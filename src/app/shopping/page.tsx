import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

// Re-render every 5 minutes so VA edits from /admin appear without a deploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Shops & Galleries in Tombstone, AZ",
  description:
    "Shop local in Tombstone — artisan goods, Old West mercantile, antiques, and gifts made by the people who live here.",
};

export default function ShoppingPage() {
  return (
    <CategoryPage
      category="Shopping"
      path="/shopping"
      title="Made in Tombstone"
      intro="Support the artisans, shopkeepers, and makers who keep this town more than a memory. Everything here was chosen, made, or found by someone who calls Tombstone home."
    />
  );
}
