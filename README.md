# Passport to Tombstone

Destination marketing platform and event hosting hub for Tombstone, Arizona.

**Positioning:** "Bring your people here. We'll host them right."

## What's built

- **Homepage** (`/`) — hero, Tombstone story, featured Story Partners, Where to Stay, Saloon Stories, What to Do, Event Hub, Made in Tombstone, real events calendar (7 recurring/annual town events), newsletter signup, FAQ (with FAQPage schema)
- **Category pages** — `/lodging` (30), `/dining` (16), `/attractions` (20), `/shopping` (40), `/services` (20) — 126 businesses total, all with story-first cards, tier badges, real addresses/phones where known, and LocalBusiness + BreadcrumbList schema
- **Events page** (`/events`) — 5 event-host venues with capacities (Silver Spur Homestead, Tombstone Monument Guest Ranch, O.K. Corral, The Saloon Theatre, The Shootout Arena) plus historic town venues, event types, and a working inquiry form
- **Partnerships page** (`/partnerships`) — all 5 tiers (Free / $49 / $199 / $499 / $199 sponsor) plus FAQ
- **API routes** — `/api/newsletter` and `/api/event-inquiry` write to Supabase; both degrade gracefully (accept + log) until Supabase env vars are set
- **AI SEO** — Organization/FAQPage/LocalBusiness/BreadcrumbList/Event JSON-LD and `/llms.txt`
- **Seed data** — 126 businesses in `src/data/businesses.ts` (the single source of truth, raw dataset + normalizer); town events in `src/data/events.ts` and `src/data/calendar-events.ts`; `supabase/seed.sql` is generated from the business data
- **Page-curl navigation** — routes transition with a book-page-turn effect (Next.js View Transitions API); respects `prefers-reduced-motion`
- **1880s photography** — real, public-domain 1881 photo of Allen Street (C.S. Fly) in the homepage hero
- **Calendar page** (`/calendar`) — 23 dated 2026 town events grouped by month, with Google Maps links and Event schema
- **Business detail pages + QR codes** (`/business/[id]`) — one page per business split into "The Building" (honest historic context) and "Today" (current business info), each with a downloadable QR code linking back to that page for physical placement
- **Trip planner** — "Add to Trip" on every business card, a floating trip tray (persists via localStorage, no account needed), and a "Save & Get Share Link" flow that publishes to `/trip/[slug]` once Supabase is connected
- **AI concierge** — floating chat widget that answers questions and suggests real businesses/events from the site's own data; works today via a local keyword matcher, upgrades to real Claude replies the moment `ANTHROPIC_API_KEY` is set
- **Accounts** — email magic-link sign-in (Supabase Auth) at `/account` to save trips across devices; itinerary saving works anonymously too

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
```

The site works with zero configuration — it renders from local seed data and the
forms accept submissions without persisting until Supabase is connected.

## Go live (one-time setup, ~30 minutes)

### 1. Push to GitHub

1. Create a new repository at https://github.com/new (name: `passport-to-tombstone`, private is fine).
2. In this folder run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/passport-to-tombstone.git
   git push -u origin main
   ```

### 2. Create the Supabase project

1. Go to https://supabase.com → New project (free tier). Name it `passport-to-tombstone`.
2. When it's ready, open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
3. New query again, paste [`supabase/seed.sql`](supabase/seed.sql), **Run**.
   (This imports all 126 businesses.)
4. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. (For accounts) In **Authentication → Providers**, email/magic-link sign-in is
   on by default — no extra setup needed. In **Authentication → URL Configuration**,
   add your production URL to the redirect allow-list once deployed.

### 3. Deploy to Vercel

1. Go to https://vercel.com → **Add New → Project** → import the GitHub repo.
2. Framework preset: Next.js (auto-detected). Before clicking Deploy, open
   **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = (from step 2)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from step 2)
   - `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://passporttotombstone.com`)
   - `ANTHROPIC_API_KEY` = optional — adds real Claude replies to the concierge.
     Without it, the concierge still works using the local keyword matcher.
3. Click **Deploy**. Every future `git push` to `main` redeploys automatically.

### 4. Verify

- Homepage loads with featured partners.
- Submit the newsletter form, then check Supabase **Table Editor → newsletter_signups**.
- Submit an event inquiry, check **event_inquiries**.
- Add something to the trip tray, hit **Save & Get Share Link**, check
  **Table Editor → itineraries**, and confirm the `/trip/[slug]` link loads.
- Sign in at `/account` with your email and confirm the magic-link email arrives.
- Validate structured data at https://search.google.com/test/rich-results.

## Photo credits

- `public/images/tombstone-1881-fly.jpg` — Allen Street, Tombstone, Arizona, 1881.
  Photograph by C. S. Fly. Public domain (published before 1928 / photographer
  deceased over 100 years). Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tombstone_(probably_in_1881).jpg).
  Used in the homepage hero.

## Before public launch (known gaps)

- **Business images are placeholders** — styled desert-scene tiles, not photography.
  A few businesses have `image_url` values that hotlink discovertombstone.com; those are stored but
  deliberately not rendered (copyright + hotlinking). Replace with owned or
  licensed photography, then render `image_url` in `src/components/BusinessCard.tsx`.
- **Tiers are pay-to-play** — only Silver Spur Homestead and Team Franko carry
  Premier badges; every other listing is a free Story Partner. When a business
  signs a paid partnership, add its id to `PREMIER_IDS` or `FEATURED_IDS` in
  `src/data/businesses.ts` and regenerate the SQL seed.
- **Newsletter sending** (Resend/Mailchimp) is not wired up — signups are captured
  in Supabase; sending is a separate step.
- **Social links** in the footer point to `#`.
- **Some contact fields are still blank** in the dataset (empty phone/website on
  smaller listings) — fill in as verified.

## Updating business data

Edit `src/data/businesses.ts` (that's what the site renders), then run:

```bash
node scripts/generate-seed.mjs
```

and re-run the new `supabase/seed.sql` in the Supabase SQL Editor (it upserts —
safe to run repeatedly).

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Supabase (PostgreSQL) · Vercel
