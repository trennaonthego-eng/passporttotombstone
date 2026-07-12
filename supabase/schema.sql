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
  partnership_type text,       -- "story" | "featured" | "premier" | "event_host" | "newsletter_sponsor"
  tier text,
  monthly_price numeric,
  status text default 'pending', -- "active" | "pending" | "expired"
  starts_at timestamptz,
  expires_at timestamptz,
  contact_email text,
  contact_phone text,
  created_at timestamptz default now()
);

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
