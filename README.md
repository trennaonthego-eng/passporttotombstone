# Passport to Tombstone

Destination marketing platform and event hosting hub for Tombstone, Arizona.

**Positioning:** "Bring your people here. We'll host them right."

## What's built

- **Homepage** (`/`) — hero, Tombstone story, featured Story Partners, Where to Stay, Saloon Stories, What to Do, Event Hub, Made in Tombstone, real events calendar (7 recurring/annual town events), newsletter signup, FAQ (with FAQPage schema)
- **Category pages** — `/lodging` (30), `/dining` (16), `/attractions` (20), `/shopping` (40), `/services` (20) — 126 businesses total, all with story-first cards, tier badges, real addresses/phones where known, and LocalBusiness + BreadcrumbList schema
- **Events page** (`/events`) — 5 event-host venues with capacities (Silver Spur Homestead, Tombstone Monument Guest Ranch, O.K. Corral, The Saloon Theatre, The Shootout Arena) plus historic town venues, event types, and a working inquiry form
- **Partnerships page** (`/partnerships`) — all 5 tiers (Free / $49 / $199 / $499 / $199 sponsor) plus FAQ
- **API routes** — `/api/newsletter` and `/api/event-inquiry` write to Supabase; both degrade gracefully (accept + log) until Supabase env vars are set
- **AI SEO** — Organization/FAQPage/LocalBusiness/BreadcrumbList JSON-LD and `/llms.txt`
- **Seed data** — 126 businesses in `src/data/businesses.ts` (the single source of truth, raw dataset + normalizer); town events in `src/data/events.ts`; `supabase/seed.sql` is generated from the business data

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

### 3. Deploy to Vercel

1. Go to https://vercel.com → **Add New → Project** → import the GitHub repo.
2. Framework preset: Next.js (auto-detected). Before clicking Deploy, open
   **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = (from step 2)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from step 2)
   - `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://passporttotombstone.com`)
3. Click **Deploy**. Every future `git push` to `main` redeploys automatically.

### 4. Verify

- Homepage loads with featured partners.
- Submit the newsletter form, then check Supabase **Table Editor → newsletter_signups**.
- Submit an event inquiry, check **event_inquiries**.
- Validate structured data at https://search.google.com/test/rich-results.

## Before public launch (known gaps)

- **Images are placeholders** — styled gradient tiles. A few businesses have
  `image_url` values that hotlink discovertombstone.com; those are stored but
  deliberately not rendered (copyright + hotlinking). Replace with owned or
  licensed photography, then render `image_url` in `src/components/BusinessCard.tsx`.
- **Tier review** — nearly every business in the imported dataset is marked
  `featured` (the $49/mo tier), so most cards carry a Featured badge. Review
  which businesses are actually paying partners and downgrade the rest to
  `story_partner` in `src/data/businesses.ts`.
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
