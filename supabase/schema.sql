-- Passport to Tombstone — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query),
-- then run seed.sql to load the businesses.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- businesses
-- ---------------------------------------------------------------------------
create table if not exists businesses (
  id text primary key,
  name text not null,
  category text,               -- "Lodging" | "Dining" | "Attractions" | "Shopping" | "Services"
  subcategory text,
  description text,
  story text,                  -- narrative about why this business matters
  address text,
  hours text,                  -- free text, e.g. "Daily 10am-5pm" or "Sun service 10:30am"
  phone text,
  email text,
  website text,
  image_url text,
  tier text default 'free',    -- "free" | "featured" | "premium_featured" | "event_host"
  event_host boolean default false,
  event_types text[] default '{}',
  event_capacity text,
  is_featured_on_homepage boolean default false,
  featured_expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Safe to re-run: adds the "hours" column if this table already existed
-- from an earlier version of this schema.
alter table businesses add column if not exists hours text;

-- ---------------------------------------------------------------------------
-- newsletter_signups
-- ---------------------------------------------------------------------------
create table if not exists newsletter_signups (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

-- ---------------------------------------------------------------------------
-- partnerships
-- ---------------------------------------------------------------------------
create table if not exists partnerships (
  id uuid primary key default uuid_generate_v4(),
  business_id text references businesses(id),
  business_name text,          -- set for standalone newsletter sponsors with no business_id
  partnership_type text,       -- "featured" | "premier" | "newsletter_sponsor"
  tier text,
  monthly_price numeric,
  status text default 'pending', -- "active" | "pending" | "expired" | "canceled"
  starts_at timestamptz,
  expires_at timestamptz,
  contact_email text,
  contact_phone text,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- Safe to re-run: adds Stripe tracking + standalone-sponsor columns if this
-- table already existed from an earlier version of this schema.
alter table partnerships add column if not exists business_name text;
alter table partnerships add column if not exists stripe_customer_id text;
alter table partnerships add column if not exists stripe_subscription_id text;
create unique index if not exists partnerships_stripe_subscription_id_key
  on partnerships (stripe_subscription_id) where stripe_subscription_id is not null;

-- ---------------------------------------------------------------------------
-- event_inquiries
-- ---------------------------------------------------------------------------
create table if not exists event_inquiries (
  id uuid primary key default uuid_generate_v4(),
  event_name text,
  event_type text,             -- "Corporate Retreat" | "Conference" | "Film Festival" | "Wedding" | "Other"
  attendee_count integer,
  preferred_dates text,
  contact_name text,
  contact_email text,
  contact_phone text,
  message text,
  venue_inquiries text[] default '{}',
  status text default 'new',   -- "new" | "contacted" | "booked" | "closed"
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- itineraries
-- Trip-planner output from the AI concierge / "Add to Trip" tray. Anonymous
-- visitors get a random share_slug; signed-in visitors also get user_id so
-- the trip shows up under their account.
-- ---------------------------------------------------------------------------
create table if not exists itineraries (
  id uuid primary key default uuid_generate_v4(),
  share_slug text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  title text default 'My Tombstone Trip',
  items jsonb not null default '[]', -- ItineraryItem[]: {id, kind, name, category, note}
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- town_events
-- Calendar events added from the /admin dashboard (the built-in 2026 schedule
-- lives in the codebase; these are additions a VA can make without code).
-- ---------------------------------------------------------------------------
create table if not exists town_events (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  event_date date not null,
  time_label text not null,     -- "10:00 AM - 4:00 PM"
  venue text not null,
  address text default 'Tombstone, AZ 85638',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- The site uses the anon key from the browser/server, so:
--   * anyone may read businesses
--   * anyone may insert newsletter signups and event inquiries
--   * nothing else is exposed to anon
-- ---------------------------------------------------------------------------
alter table businesses enable row level security;
alter table newsletter_signups enable row level security;
alter table partnerships enable row level security;
alter table event_inquiries enable row level security;
alter table itineraries enable row level security;
alter table town_events enable row level security;

-- Anyone can read town events (they render on the public /calendar page).
-- Writes happen only through the admin API using the service-role key.
create policy "public read town events"
  on town_events for select using (true);

create policy "public read businesses"
  on businesses for select using (true);

create policy "public insert newsletter signups"
  on newsletter_signups for insert with check (true);

create policy "public insert event inquiries"
  on event_inquiries for insert with check (true);

-- Itineraries: anyone can create one (anonymous trip planning) and read one
-- by its (unguessable) share_slug — same trust model as any share-link
-- product. Only the owning user can update/delete their own saved trips.
create policy "public insert itineraries"
  on itineraries for insert with check (true);

create policy "public read itineraries by slug"
  on itineraries for select using (true);

create policy "owner update own itineraries"
  on itineraries for update using (auth.uid() = user_id);

create policy "owner delete own itineraries"
  on itineraries for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage: business photos
-- Public bucket so uploaded photos load on the public site without signed
-- URLs. Uploads/replacements happen only through the admin API using the
-- service-role key (which bypasses storage RLS entirely), so no insert/update
-- policy is needed here — only public read.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('business-photos', 'business-photos', true)
on conflict (id) do nothing;

create policy "public read business photos"
  on storage.objects for select
  using (bucket_id = 'business-photos');
