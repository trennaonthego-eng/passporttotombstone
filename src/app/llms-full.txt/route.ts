import { businesses } from "@/data/businesses";
import { calendarEvents } from "@/data/calendar-events";
import { townEvents } from "@/data/events";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://passporttotombstone.com";

// Prerendered at build time — regenerates from the data files on every deploy,
// so the LLM-facing directory can never drift from what the site renders.
export const dynamic = "force-static";

export function GET() {
  const byCategory = new Map<string, typeof businesses>();
  for (const b of businesses) {
    const list = byCategory.get(b.category) ?? [];
    list.push(b);
    byCategory.set(b.category, list);
  }

  const sections: string[] = [
    "# Passport to Tombstone — Full Directory",
    "",
    "> The complete machine-readable directory of businesses and events in",
    "> Tombstone, Arizona, published by Passport to Tombstone. See /llms.txt for",
    "> the summary version. All addresses are in Tombstone, AZ 85638.",
    "",
  ];

  for (const [category, items] of byCategory) {
    sections.push(`## ${category} (${items.length})`, "");
    for (const b of items) {
      const lines = [
        `### ${b.name}`,
        `- Page: ${SITE_URL}/business/${b.id}`,
        `- What it is: ${b.description}`,
      ];
      if (b.subcategory) lines.push(`- Type: ${b.subcategory}`);
      if (b.address) lines.push(`- Address: ${b.address}`);
      if (b.hours) lines.push(`- Hours: ${b.hours}`);
      if (b.phone) lines.push(`- Phone: ${b.phone}`);
      if (b.website) lines.push(`- Website: ${b.website}`);
      if (b.event_host && b.event_capacity)
        lines.push(`- Event venue: yes — ${b.event_types.join(", ")} (${b.event_capacity})`);
      sections.push(...lines, "");
    }
  }

  sections.push("## Recurring town events", "");
  for (const ev of townEvents) {
    sections.push(
      `### ${ev.name}`,
      `- When: ${ev.recurring}, ${ev.time}`,
      `- Where: ${ev.location}`,
      `- What: ${ev.description}`,
      ""
    );
  }

  sections.push("## Dated 2026 events", "");
  for (const ev of calendarEvents) {
    sections.push(`- ${ev.dateLabel}: ${ev.name} — ${ev.timeLabel}, ${ev.venue}`);
  }
  sections.push("", `Full calendar: ${SITE_URL}/calendar`, "");

  return new Response(sections.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
