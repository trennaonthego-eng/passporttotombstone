# AI SEO Readiness Report — passporttotombstone.com

**Date:** 2026-07-12
**Status:** Pre-launch structural pass (site not yet deployed)
**API cost:** $0.00 — no live-query APIs were used. A live visibility audit
(LLM citation checks, AI search volume, Google AI Overview coverage via
DataForSEO) requires a deployed public site and a DataForSEO account; run it
~21 days after launch.

## Why this is a readiness report, not a visibility audit

The site only exists on localhost. No AI model can currently cite it, so
measuring "does ChatGPT recommend us" would return zero by definition. What
matters pre-launch is that every structural pattern AI systems favor is in
place on day one. That's what this pass implemented and verified.

## What's in place (verified locally on 2026-07-12)

| Surface | Status | Detail |
|---|---|---|
| `robots.txt` | ✅ Added | Allows all crawlers; explicitly welcomes GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot, cohere-ai. Blocks only `/api/` and `/account`. Points to sitemap. |
| `sitemap.xml` | ✅ Added | 135 URLs — 9 core pages + 126 business pages, generated from the data layer. |
| `llms.txt` | ✅ Rewritten | Accurate summary: positioning, all key routes, citable facts (population, founding, O.K. Corral date, venue capacities, recurring events), keywords, contact. |
| `llms-full.txt` | ✅ Added | ~38 KB machine-readable directory of all 126 businesses (address, phone, website, venue capacity) + all events, generated from the same data files the site renders — cannot drift. |
| FAQPage schema | ✅ | Homepage (5 traveler Q&As) and /events (4 event-planner Q&As), both with matching **visible** FAQ sections, answers 40–80 words, answer-first. |
| Organization schema | ✅ | Homepage. |
| WebSite schema | ✅ Added | Homepage. |
| TouristDestination schema | ✅ Added | Homepage — geo coordinates, tourist types, four flagship attractions linked. |
| LocalBusiness schema | ✅ | Every category page and every one of the 126 business detail pages (typed per category: LodgingBusiness, FoodEstablishment, TouristAttraction, Store, LocalBusiness). |
| ItemList schema | ✅ Added | All 5 category pages — positioned lists linking every business to its canonical page. |
| Event schema | ✅ | /calendar — all 23 dated 2026 events with ISO start/end and Place. |
| BreadcrumbList schema | ✅ | Category, calendar, events, partnerships, and business detail pages. |
| Canonical URLs | ✅ Added | `metadataBase` + per-route canonical on every page. |
| Answer-first content | ✅ | Every page leads with a direct statement of what it is; business pages split into "The Building" / "Today". |
| Server-rendered HTML | ✅ | 146 routes prerendered static/SSG — full content available to crawlers without JavaScript. |
| Unique titles/descriptions | ✅ | Per-page metadata everywhere, template-suffixed. |

All JSON-LD on the homepage was machine-validated (4 blocks, 0 parse errors:
Organization, WebSite, TouristDestination, FAQPage).

## Known gaps to close post-launch

1. **E-E-A-T / authorship** — no named author or About page yet. Add an About
   page with the founder's story and Person schema once launch messaging is
   decided.
2. **Third-party citations** — AI models weigh corroboration. Getting the town
   businesses, the Chamber, and tombstoneforward.com to link to their
   passporttotombstone.com pages is the highest-leverage off-page move.
3. **Google Search Console + Bing Webmaster Tools** — submit the sitemap at
   launch. Bing matters more than usual: it feeds ChatGPT search.
4. **Live audit** — ~21 days post-launch, run the full ai-seo-audit skill with
   DataForSEO connected to measure actual citation rates and competitor
   patterns (discovertombstone.com and tombstonechamber.com are the local
   incumbents to benchmark against).

## Timing expectations

Citation lift from structural fixes typically appears in 14–21 days based on
industry data. Off-page changes (third-party mentions, reviews) take 30–60
days. AI search engines re-crawl and re-rank slower than Google. Don't expect
overnight changes. Run the weekly tracking audit to watch the curve.
