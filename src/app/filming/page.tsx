import type { Metadata } from "next";
import EventTypePage from "@/components/EventTypePage";
import { getEventPage } from "@/data/event-pages";

const def = getEventPage("filming")!;

export const metadata: Metadata = {
  title: def.title,
  description: def.metaDescription,
};

export default function FilmingPage() {
  return <EventTypePage def={def} />;
}
