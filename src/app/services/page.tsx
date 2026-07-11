import type { Metadata } from "next";
import CategoryPage from "@/components/CategoryPage";

export const metadata: Metadata = {
  title: "Local Services in Tombstone, AZ",
  description:
    "Real estate, tours, event planning, and visitor services from the people who live and work in Tombstone, Arizona.",
};

export default function ServicesPage() {
  return (
    <CategoryPage
      category="Services"
      path="/services"
      title="The People Who Keep the Town Running"
      intro="Behind every storefront is someone who chose this town. Whether you're visiting for a weekend, planning an event, or putting down roots — these are the locals who can make it happen."
    />
  );
}
