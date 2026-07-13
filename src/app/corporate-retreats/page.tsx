import type { Metadata } from "next";
import EventTypePage from "@/components/EventTypePage";
import { getEventPage } from "@/data/event-pages";

const def = getEventPage("corporate-retreats")!;

// Re-render every 5 minutes so VA edits (photos, addresses) from /admin appear without a deploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: def.title,
  description: def.metaDescription,
};

export default function CorporateRetreatsPage() {
  return <EventTypePage def={def} />;
}
