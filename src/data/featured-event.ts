/**
 * The homepage's single "main event" banner — one flagship event at a time,
 * sourced from the official event flyer. Swap this out as the featured event
 * changes month to month.
 */

export interface FeaturedEventDay {
  day: string;
  items: string[];
}

export interface FeaturedEvent {
  eyebrow: string;
  title: string;
  tagline: string;
  dateLabel: string;
  startIso: string;
  endIso: string;
  subtitle: string;
  schedule: FeaturedEventDay[];
  sponsors: string[];
  infoUrl: string;
  infoLabel: string;
  phone: string;
}

export const featuredEvent: FeaturedEvent = {
  eyebrow: "Tombstone, Arizona's Inaugural",
  title: "Weekend of the Cowboy",
  tagline: "Four Days of Western Fun in Tombstone, Arizona",
  dateLabel: "July 23–26, 2026",
  startIso: "2026-07-23T17:00:00-07:00",
  endIso: "2026-07-26T17:00:00-07:00",
  subtitle: "Celebrating National Day of the Cowboy",
  schedule: [
    { day: "Thursday", items: ["“Spaghetti Western” Dinner & Silent Auction with Special Western Guests"] },
    { day: "Friday", items: ["Wild West Show", "The Brady Seals Band Concert", "Line Dancing on Allen Street"] },
    { day: "Saturday", items: ["Wild West Parade", "Lil' Buckaroos Allen St. Rodeo", "Bull Riding"] },
    { day: "Sunday", items: ["Western Movie Extravaganza", "Tombstone Vigilantes"] },
  ],
  sponsors: ["Discover Tombstone", "Tombstone Forward Association", "Shoot Out Arena"],
  infoUrl: "https://discovertombstone.com",
  infoLabel: "DiscoverTombstone.com",
  phone: "520-457-2202",
};
