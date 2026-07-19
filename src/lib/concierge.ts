import { businesses } from "@/data/businesses";
import { calendarEvents } from "@/data/calendar-events";
import type { ItineraryItem } from "@/lib/types";

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "to", "in", "of", "for", "with", "on", "is", "are",
  "i", "im", "we", "us", "my", "want", "would", "like", "please", "can", "you", "me",
  "what", "where", "when", "how", "do", "does", "some", "any", "good", "best",
]);

// Cheap singularization so "saloons"/"gunfights"/"tours" match the singular
// forms used in business copy ("saloon", "gunfight", "tour"). Not a real
// stemmer, just strips a trailing "s" — good enough for this vocabulary.
function singularize(word: string): string {
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) {
    return word.slice(0, -1);
  }
  return word;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
    .map(singularize);
}

export interface ConciergeMatch {
  item: ItineraryItem;
  score: number;
  blurb: string;
}

/** Keyword-overlap matcher over local data — the concierge's fallback brain
 * when no LLM key is configured, and the retrieval step that keeps the LLM
 * prompt small when one is. */
export function findMatches(message: string, limit = 5): ConciergeMatch[] {
  const queryTokens = new Set(tokenize(message));
  if (queryTokens.size === 0) return [];

  const scored: ConciergeMatch[] = [];

  for (const b of businesses) {
    const haystack = tokenize(
      [b.name, b.category, b.subcategory, b.description, b.story].filter(Boolean).join(" ")
    );
    const overlap = haystack.filter((w) => queryTokens.has(w)).length;
    if (overlap > 0) {
      scored.push({
        item: { id: b.id, kind: "business", name: b.name, category: b.category },
        score: overlap,
        blurb: b.story,
      });
    }
  }

  calendarEvents.forEach((ev, i) => {
    const haystack = tokenize([ev.name, ev.venue].join(" "));
    const overlap = haystack.filter((w) => queryTokens.has(w)).length;
    if (overlap > 0) {
      scored.push({
        item: {
          id: `calendar:${i}`,
          kind: "calendar-event",
          name: ev.name,
          category: "Event",
          note: `${ev.dateLabel} · ${ev.timeLabel}`,
        },
        score: overlap,
        blurb: `${ev.venue}, ${ev.dateLabel}`,
      });
    }
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

const CATEGORY_HINTS: Record<string, string> = {
  stay: "Lodging",
  sleep: "Lodging",
  hotel: "Lodging",
  lodging: "Lodging",
  eat: "Dining",
  food: "Dining",
  drink: "Dining",
  saloon: "Dining",
  restaurant: "Dining",
  dining: "Dining",
  see: "Attractions",
  do: "Attractions",
  visit: "Attractions",
  gunfight: "Attractions",
  mine: "Attractions",
  museum: "Attractions",
  attraction: "Attractions",
  shop: "Shopping",
  shopping: "Shopping",
  wedding: "Services",
  event: "Services",
  retreat: "Services",
};

function hintedCategoryFor(message: string): string | undefined {
  const lower = message.toLowerCase();
  return Object.entries(CATEGORY_HINTS).find(([k]) => lower.includes(k))?.[1];
}

/** findMatches() plus a category fallback: phrasing like "where should I
 * stay" or "what should I do" rarely shares literal words with business
 * copy, so a detected category hint (stay → Lodging) pulls top businesses
 * from that category directly instead of relying on keyword overlap alone. */
// Paid-partner priority: when the Marshal (or the trip planner it feeds)
// recommends businesses, Premium partners list first, then Featured, then
// free — a paid perk, applied as a tiebreak within relevance.
const TIER_RANK: Record<string, number> = {
  premium_featured: 0,
  event_host: 0,
  featured: 1,
  free: 2,
};

function tierRank(businessId: string): number {
  const b = businesses.find((x) => x.id === businessId);
  return b ? (TIER_RANK[b.tier] ?? 2) : 2;
}

function getMatches(message: string, limit: number): ConciergeMatch[] {
  const keywordMatches = findMatches(message, limit);
  const hintedCategory = hintedCategoryFor(message);

  const seen = new Set(keywordMatches.map((m) => m.item.id));
  const categoryMatches: ConciergeMatch[] = !hintedCategory
    ? []
    : businesses
        .filter((b) => b.category === hintedCategory && !seen.has(b.id))
        .sort((a, b) => (TIER_RANK[a.tier] ?? 2) - (TIER_RANK[b.tier] ?? 2))
        .slice(0, limit - keywordMatches.length)
        .map((b) => ({
          item: { id: b.id, kind: "business", name: b.name, category: b.category },
          score: 0,
          blurb: b.story,
        }));

  return [...keywordMatches, ...categoryMatches]
    .sort((a, b) => {
      // Events have no tier; keep them ordered by relevance among themselves.
      const rankA = a.item.kind === "business" ? tierRank(a.item.id) : 1;
      const rankB = b.item.kind === "business" ? tierRank(b.item.id) : 1;
      return rankA - rankB || b.score - a.score;
    })
    .slice(0, limit);
}

// What this product actually is — the concierge needs to know this about
// itself, not just the business directory, or it fumbles basic "what is
// this site" questions.
export const SITE_DESCRIPTION =
  "An immersive digital travel guide to Tombstone, Arizona, featuring an interactive trip planner, AI-driven concierge, and cinematic storytelling to help visitors experience the legendary Old West.";

const IDENTITY_PATTERNS = [
  /what (is|are) (this|passport|you)/,
  /who are you/,
  /what (do|can) you do/,
  /what('s| is) this (site|website|app|place)/,
  /tell me about (this|yourself|passport)/,
  /how does this work/,
];

function isIdentityQuestion(message: string): boolean {
  const lower = message.toLowerCase();
  return IDENTITY_PATTERNS.some((re) => re.test(lower));
}

export function ruleBasedReply(message: string): { reply: string; matches: ConciergeMatch[] } {
  if (isIdentityQuestion(message)) {
    return {
      reply: `I'm the Marshal — Passport to Tombstone's guide. ${SITE_DESCRIPTION} Ask me about lodging, saloons, gunfights, mine tours, shopping, or hosting an event, and I'll pull real spots from the Passport and help you build a trip.`,
      matches: [],
    };
  }

  const matches = getMatches(message, 5);
  const hintedCategory = hintedCategoryFor(message);

  if (matches.length === 0) {
    return {
      reply:
        "I couldn't find a strong match for that in the Passport yet — try asking about lodging, saloons, gunfights, mine tours, shopping, or hosting an event, and I'll pull real Tombstone spots for you.",
      matches: [],
    };
  }

  const names = matches.slice(0, 3).map((m) => m.item.name);
  const lead = hintedCategory
    ? `Here's what's real in Tombstone for ${hintedCategory.toLowerCase()}:`
    : "Here's what I found in the Passport for that:";

  return {
    reply: `${lead} ${names.join(", ")}${matches.length > 3 ? ", and a couple more" : ""}. Want me to add any of these to your trip?`,
    matches,
  };
}

interface AnthropicReplyResult {
  reply: string;
  matches: ConciergeMatch[];
}

export async function anthropicReply(
  message: string,
  history: { role: "user" | "assistant"; content: string }[]
): Promise<AnthropicReplyResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const matches = getMatches(message, 8);

  if (!apiKey) {
    const fallback = ruleBasedReply(message);
    return { reply: fallback.reply, matches: fallback.matches };
  }

  const catalog = matches
    .map((m) => `- [${m.item.kind}:${m.item.id}] ${m.item.name} (${m.item.category ?? ""}) — ${m.blurb}`)
    .join("\n");

  const systemPrompt = `You are "the Marshal" — Passport to Tombstone's AI guide, a warm, knowledgeable presence for Tombstone, Arizona (the real town, 1,400 residents, "too tough to die"). This product, Passport to Tombstone, is: ${SITE_DESCRIPTION} If asked what this site is, who you are, or what you can do, answer with that description in your own words — don't dodge it or talk about unrelated businesses. Otherwise, help visitors plan an itinerary using ONLY the businesses/events listed below; do not invent businesses, addresses, or historical claims. Keep replies to 2-3 sentences, conversational, no corny Old West clichés. If nothing below fits, say so honestly and suggest browsing the site's categories instead.

Available matches for this query:
${catalog || "(none matched — tell the visitor to browse Lodging, Dining, Attractions, Shopping, Services, or the Events Calendar)"}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 300,
        system: systemPrompt,
        messages: [...history, { role: "user", content: message }],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic API returned ${res.status}`);
    const data = await res.json();
    const reply = data.content?.[0]?.text?.trim();
    if (!reply) throw new Error("Empty response from Anthropic API");

    return { reply, matches };
  } catch (err) {
    console.error("[concierge] Anthropic call failed, falling back to keyword matcher:", err);
    const fallback = ruleBasedReply(message);
    return { reply: fallback.reply, matches: fallback.matches };
  }
}
