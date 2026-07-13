# Passport to Tombstone

Destination marketing platform and event hosting hub for Tombstone, Arizona.

**Positioning:** "Bring your people here. We'll host them right."

## What's built

- **Homepage** (`/`) — hero, Tombstone story, featured Story Partners, Where to Stay, Saloon Stories, What to Do, Event Hub, Made in Tombstone, real events calendar (7 recurring/annual town events), newsletter signup, FAQ (with FAQPage schema)
- **Category pages** — `/lodging` (30), `/dining` (16), `/attractions` (20), `/shopping` (40), `/services` (20) — 126 businesses total, all with story-first cards, tier badges, real addresses/phones where known, and LocalBusiness + BreadcrumbList schema
- **Events page** (`/events`) — 5 event-host venues with capacities (Silver Spur Homestead, Tombstone Monument Guest Ranch, O.K. Corral, The Saloon Theatre, The Shootout Arena) plus historic town venues, event types, and a working inquiry form
- **Partnerships page** (`/partnerships`) — Free / Featured $49 / Premier $199 / Newsletter Sponsor $25, each tier's CTA goes to `/upgrade`, plus FAQ
- **Pay-to-upgrade checkout** (`/upgrade`) — pick a tier, search-select your listing (or just give a business name for Newsletter Sponsor), pay via Stripe Checkout. A webhook (`/api/stripe/webhook`), not the redirect, is what actually grants the upgrade once payment clears — see "Set up Stripe" below
- **API routes** — `/api/newsletter` and `/api/event-inquiry` write to Supabase; both degrade gracefully (accept + log) until Supabase env vars are set
- **AI SEO** — Organization/FAQPage/LocalBusiness/BreadcrumbList/Event JSON-LD and `/llms.txt`
- **Seed data** — 126 businesses in `src/data/businesses.ts` (the single source of truth, raw dataset + normalizer); town events in `src/data/events.ts` and `src/data/calendar-events.ts`; `supabase/seed.sql` is generated from the business data
- **Page-curl navigation** — routes transition with a book-page-turn effect (Next.js View Transitions API); respects `prefers-reduced-motion`
- **1880s photography** — real, public-domain 1881 photo of Allen Street (C.S. Fly) in the homepage hero
- **Calendar page** (`/calendar`) — 23 dated 2026 town events grouped by month, with Google Maps links and Event schema
- **Business detail pages** (`/business/[id]`) — one page per business split into "The Building" (honest historic context) and "Today" (current business info); stays live for every business (AI SEO), but only linked from listing cards for Premier partners — everyone else's card links to their own website
- **Trip planner** — "Add to Trip" on every business card, a floating trip tray (persists via localStorage, no account needed), and a "Save & Get Share Link" flow that publishes to `/trip/[slug]` once Supabase is connected
- **AI concierge** — floating chat widget that answers questions and suggests real businesses/events from the site's own data; works today via a local keyword matcher, upgrades to real Claude replies the moment `ANTHROPIC_API_KEY` is set
- **Accounts** — email magic-link sign-in (Supabase Auth) at `/account` to save trips across devices; itinerary saving works anonymously too

## Admin panel (VA-friendly)

`/admin` is a password-gated dashboard — no coding knowledge needed:

1. **📋 Event Inquiries** — every inquiry from the events form, with a status
   dropdown (New → Contacted → Booked/Closed).
2. **💌 Newsletter List** — all subscribers with one-click CSV download.
3. **📅 Calendar Events** — add events that appear on the public /calendar
   within 5 minutes; remove them just as easily.
4. **📊 Update Businesses** — download every business as a spreadsheet, edit
   in Excel/Google Sheets (phone, hours, story, tier, add/remove rows), upload
   back. Every row is validated before anything saves.
5. **📸 Add Photos** — pick a business, upload a JPG/PNG/WEBP, done. The photo
   replaces the generated placeholder art everywhere that business appears
   (listing cards, its own page, event-type pages) within 5 minutes. Uploading
   again for the same business replaces the old photo.
6. **🧰 Partner Toolkit** — ready-to-post social/Google Business templates for
   paying partners, with a one-click "email to business" button. Never shown
   on the public site.

Setup: set `ADMIN_PASSWORD` (the login you give your VA) and
`SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API → service_role)
in Vercel's environment variables. `/admin` is blocked in robots.txt. Photo
storage uses a `business-photos` bucket created automatically by
`supabase/schema.sql` — no separate Supabase dashboard step needed.

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

### 4. Set up Stripe (optional — pay-to-upgrade at `/upgrade`)

Skip this if you're not ready to take payments yet — the site works fine without
it, the `/upgrade` form just shows "Payments aren't set up yet."

1. Go to https://dashboard.stripe.com and create an account (or use an
   existing one). Toggle **Test mode** on while you try this out — switch to
   live mode later when you're ready for real charges.
2. **Developers → API keys** → copy the **Secret key** → Vercel env var
   `STRIPE_SECRET_KEY`.
3. **Product catalog → Add product** — create three, each with a **recurring**
   monthly price:
   - "Featured Story Partner" — $49.00/month → copy its Price ID (starts `price_`) → `STRIPE_PRICE_FEATURED`
   - "Premier Story Partner" — $199.00/month → → `STRIPE_PRICE_PREMIER`
   - "Newsletter Sponsor" — $25.00/month → → `STRIPE_PRICE_SPONSOR`
4. **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://YOUR_SITE/api/stripe/webhook`
   - Events to send: `checkout.session.completed` and `customer.subscription.deleted`
   - After creating it, click the endpoint → **Signing secret** → copy →
     `STRIPE_WEBHOOK_SECRET`
5. Add all five values (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
   `STRIPE_PRICE_FEATURED`, `STRIPE_PRICE_PREMIER`, `STRIPE_PRICE_SPONSOR`) as
   Vercel environment variables, then redeploy (Vercel → Deployments → ⋯ →
   Redeploy) so the new variables take effect.
6. Test it: visit `/upgrade`, use [Stripe's test card](https://docs.stripe.com/testing)
   `4242 4242 4242 4242` with any future expiry/CVC. Confirm the business's
   tier updates in Supabase **Table Editor → businesses** and a row appears in
   **partnerships** within a minute or two (the webhook, not the redirect, is
   what grants the upgrade).
7. When ready for real payments, switch Stripe out of Test mode, swap in the
   live secret key / price IDs / webhook secret, and redeploy.

### 5. Verify

- Homepage loads with featured partners.
- Submit the newsletter form, then check Supabase **Table Editor → newsletter_signups**.
- Submit an event inquiry, check **event_inquiries**.
- Add something to the trip tray, hit **Save & Get Share Link**, check
  **Table Editor → itineraries**, and confirm the `/trip/[slug]` link loads.
- Sign in at `/account` with your email and confirm the magic-link email arrives.
- If Stripe is set up, run a test upgrade (see step 4.6 above).
- Validate structured data at https://search.google.com/test/rich-results.

## Photo credits

- `public/images/tombstone-1881-fly.jpg` — Allen Street, Tombstone, Arizona, 1881.
  Photograph by C. S. Fly. Public domain (published before 1928 / photographer
  deceased over 100 years). Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tombstone_(probably_in_1881).jpg).
  Used in the homepage hero.

## Before public launch (known gaps)

- **Most business images are still placeholders** — styled desert-scene tiles,
  not photography. Upload real photos via `/admin` → 📸 Add Photos (see
  above) — one photo per business, appears everywhere that business is
  listed. A few businesses have `image_url` values that hotlink
  discovertombstone.com from the original seed data; those are stored but
  deliberately never rendered (copyright + hotlinking) — they'll keep showing
  the placeholder until someone uploads a real photo.
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
