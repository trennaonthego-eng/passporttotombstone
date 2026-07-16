/**
 * Content model for the four informational event-type pages (/weddings,
 * /filming, /corporate-retreats, /conferences). These pages are browse-and-
 * contact-directly — no forms, no coordination. Venue/service cards reference
 * business ids so they always render current directory data.
 */

export interface EventPageSection {
  heading: string;
  blurb?: string;
  businessIds?: string[];
  bullets?: string[];
  categoryLink?: { label: string; href: string };
}

export interface SampleItinerary {
  name: string;
  steps: string[];
}

export interface EventPageDef {
  slug: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  tagline: string;
  metaDescription: string;
  why: { heading: string; points: string[] };
  sections: EventPageSection[];
  itineraries?: SampleItinerary[];
  checklist?: string[];
  closingNote: string;
}

export const eventPages: EventPageDef[] = [
  {
    slug: "weddings",
    navLabel: "Weddings",
    eyebrow: "Weddings & Ceremonies",
    title: "Get Married in the Wild West",
    tagline: "Authentic Tombstone locations for unforgettable ceremonies.",
    metaDescription:
      "Wedding venues in Tombstone, Arizona: guest ranches, glamping, historic churches, and the O.K. Corral itself. Small-town charm, year-round sunshine, and a backdrop no ballroom can match.",
    why: {
      heading: "Why Tombstone for Weddings",
      points: [
        "Small-town charm — the whole town feels like part of your celebration",
        "An authentic Western backdrop, not a themed one",
        "Year-round Arizona sunshine for outdoor ceremonies",
        "Photo opportunities you cannot get anywhere else: Allen Street, desert sunsets, 1880s storefronts",
      ],
    },
    sections: [
      {
        heading: "Venues Perfect for Weddings",
        blurb: "Contact venues directly — every card links to the venue's own phone and website.",
        businessIds: ["lodging_026", "attractions_001", "attractions_002", "attractions_017"],
      },
      {
        heading: "Historic Churches",
        blurb: "Three working congregations in historic buildings, including the oldest Episcopal church in Arizona.",
        businessIds: ["services_002", "services_003", "services_004"],
      },
      {
        heading: "Reception Dining & Catering",
        businessIds: ["dining_001", "dining_004", "dining_008"],
      },
      {
        heading: "Photography",
        blurb: "Period photography in 1880s costume, or classic coverage on the real streets.",
        businessIds: ["attractions_019", "attractions_020"],
      },
      {
        heading: "Lodging for Your Guests",
        blurb: "Thirty options from historic hotels to glamping and RV parks, most within walking distance of downtown.",
        categoryLink: { label: "Browse all lodging", href: "/lodging" },
        businessIds: ["lodging_003", "lodging_012"],
      },
    ],
    closingNote:
      "Got married in Tombstone? We'd love to feature real Tombstone weddings — share your photos and story at events@passporttotombstone.com.",
  },
  {
    slug: "filming",
    navLabel: "Filming",
    eyebrow: "Film & Production",
    title: "Hollywood Comes to Tombstone",
    tagline: "The real Old West — perfect for your production.",
    metaDescription:
      "Film in Tombstone, Arizona: authentic 1880s buildings and streets, desert landscapes, ready-to-film gunfight venues, ranches, and year-round production weather. Location info and local contacts.",
    why: {
      heading: "Why Tombstone for Filming",
      points: [
        "Authentic 1880s buildings and streetscapes — a National Historic Landmark district, not a set",
        "High-desert landscapes and big-sky backdrops in every direction",
        "Year-round production weather",
        "A town whose story Hollywood keeps returning to — and working reenactment casts who live here",
        "Walkable logistics: locations, lodging, and catering within blocks",
      ],
    },
    sections: [
      {
        heading: "Locations Perfect for Filming",
        blurb:
          "The historic district itself — Allen Street, churches, and mines — plus venues built for staged action.",
        businessIds: ["attractions_001", "attractions_002", "attractions_003", "attractions_005", "attractions_010"],
      },
      {
        heading: "Ranches & Open Land",
        businessIds: ["lodging_001", "lodging_026"],
      },
      {
        heading: "Cast & Crew Lodging",
        categoryLink: { label: "Browse all lodging", href: "/lodging" },
        businessIds: ["lodging_003", "lodging_012", "lodging_007"],
      },
      {
        heading: "Catering & Craft Services",
        categoryLink: { label: "Browse all dining", href: "/dining" },
        businessIds: ["dining_001", "dining_008", "dining_009"],
      },
      {
        heading: "Permits & City Coordination",
        blurb:
          "Filming in the historic district is coordinated through the City of Tombstone — start there for permits, street closures, and local crew referrals.",
        businessIds: ["services_009"],
      },
    ],
    closingNote:
      "Scouting Tombstone for a production? The venues above take direct contact, and the City of Tombstone coordinates permits and closures.",
  },
  {
    slug: "corporate-retreats",
    navLabel: "Corporate Retreats",
    eyebrow: "Team Retreats",
    title: "Bring Your Team to Tombstone",
    tagline: "Unforgettable retreats in the real Old West.",
    metaDescription:
      "Corporate retreat venues and team activities in Tombstone, Arizona: guest ranches, glamping, gunfight shows, mine tours, ghost tours, and group dining. Sample itineraries included.",
    why: {
      heading: "Why Tombstone for Corporate Retreats",
      points: [
        "Team bonding through experiences people actually remember — not another hotel ballroom",
        "Built-in activities: gunfight shows, underground mine tours, ghost tours, a target-shooting zipline",
        "Lodging for every budget, from ranches and glamping to hotels and RV parks",
        "Group dining in working 1880s saloons",
        "A networking backdrop your team will talk about for years",
      ],
    },
    sections: [
      {
        heading: "Retreat Venues",
        blurb: "Contact venues directly for group rates and availability.",
        businessIds: ["lodging_001", "lodging_026", "attractions_017"],
      },
      {
        heading: "Team Activities",
        businessIds: [
          "attractions_001",
          "attractions_002",
          "attractions_003",
          "attractions_010",
          "attractions_012",
          "attractions_016",
          "attractions_018",
          "attractions_019",
        ],
      },
      {
        heading: "Group Food & Beverage",
        categoryLink: { label: "Browse all dining", href: "/dining" },
        businessIds: ["dining_001", "dining_004", "dining_007", "dining_008", "dining_012"],
      },
      {
        heading: "Group Lodging",
        blurb: "Hotels, ranches, glamping, and RV parks — thirty options for teams of any size.",
        categoryLink: { label: "Browse all lodging", href: "/lodging" },
        businessIds: ["lodging_003", "lodging_012"],
      },
    ],
    itineraries: [
      {
        name: "Half-Day Team Builder",
        steps: [
          "Gunfight show at the O.K. Corral",
          "Group lunch at Big Nose Kate's Saloon",
          "Old-time group photo at Can Can Old Time Photos",
        ],
      },
      {
        name: "2-Day Team Retreat",
        steps: [
          "Day 1: check in at Tombstone Monument Guest Ranch, trail ride, ranch dinner",
          "Day 2: Good Enough Mine tour, gunfight show, group dinner at Crystal Palace",
        ],
      },
      {
        name: "3-Day Leadership Retreat",
        steps: [
          "Day 1: arrive, glamping check-in at Silver Spur Homestead, sunset session",
          "Day 2: strategy morning, Outlaw Zipline + mine tour afternoon, saloon dinner",
          "Day 3: Boothill walk, ghost tour debrief night, closing dinner",
        ],
      },
    ],
    closingNote:
      "Every venue above takes direct contact for group rates. Want the town's help planning something bigger? Use the inquiry form on the Bring Your Event Here page.",
  },
  {
    slug: "conferences",
    navLabel: "Conferences",
    eyebrow: "Conferences & Summits",
    title: "Host Your Conference in Tombstone",
    tagline: "A unique conference destination with Western character.",
    metaDescription:
      "Conference venues in Tombstone, Arizona: The Shootout Arena, guest ranches, group lodging for 30–500+, catering, coffee shops, and built-in break activities in a walkable historic district.",
    why: {
      heading: "Why Tombstone for Conferences",
      points: [
        "An intimate destination that keeps attendees together and engaged",
        "Everything within a walkable historic district",
        "Natural break activities: 30-minute gunfight shows, Boothill, mine tours",
        "A memorable location that measurably helps attendance",
        "Evening networking in real 1880s saloons",
      ],
    },
    sections: [
      {
        heading: "Conference Venues",
        blurb:
          "For historic town halls like Schieffelin Hall, coordinate through the City of Tombstone below.",
        businessIds: ["attractions_017", "lodging_001", "lodging_026", "services_009"],
      },
      {
        heading: "Lodging for Attendees",
        blurb: "Budget to premium, 30–500+ attendees across town, walking distance to downtown.",
        categoryLink: { label: "Browse all lodging", href: "/lodging" },
        businessIds: ["lodging_003", "lodging_012", "lodging_007"],
      },
      {
        heading: "Food, Beverage & Coffee Breaks",
        categoryLink: { label: "Browse all dining", href: "/dining" },
        businessIds: ["dining_001", "dining_004", "dining_002", "dining_013"],
      },
      {
        heading: "Break Activities",
        businessIds: ["attractions_001", "attractions_005", "attractions_010", "attractions_012", "attractions_019"],
      },
      {
        heading: "Free-Time & Evening Options",
        categoryLink: { label: "Browse all attractions", href: "/attractions" },
        businessIds: ["attractions_004", "attractions_016", "dining_012"],
      },
    ],
    checklist: [
      "Pick your main venue (capacity + AV needs)",
      "Reserve lodging blocks early — the town books out during festival weekends",
      "Arrange transportation for off-site arrivals (Tucson is ~70 miles)",
      "Book catering and coffee breaks",
      "Schedule break activities (gunfight shows run ~30 minutes)",
      "Contact venues directly for group rates",
    ],
    closingNote:
      "Contact venues directly for group rates. For multi-venue conferences, the inquiry form on the Bring Your Event Here page reaches the whole town at once.",
  },
];

export function getEventPage(slug: string) {
  return eventPages.find((p) => p.slug === slug);
}
