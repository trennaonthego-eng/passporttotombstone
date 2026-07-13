import type { Metadata } from "next";
import EventTypePage from "@/components/EventTypePage";
import { getEventPage } from "@/data/event-pages";

const def = getEventPage("weddings")!;

export const metadata: Metadata = {
  title: def.title,
  description: def.metaDescription,
};

export default function WeddingsPage() {
  return <EventTypePage def={def} />;
}
