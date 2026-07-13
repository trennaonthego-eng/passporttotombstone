import type { Business } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://passporttotombstone.com";

export const HOMEPAGE_FAQ = [
  {
    question: "What makes Tombstone different from other Old West towns?",
    answer:
      "Tombstone is alive. 1,400 people live here today. It's not a museum—it's a real community where history is part of everyday life. That authenticity is what makes it different.",
  },
  {
    question: "How do I experience authentic Tombstone?",
    answer:
      "Stay at a local lodging, eat where locals eat, walk the streets without a tour guide, join a local event, and listen to the people who live here. This Passport is your guide to those real experiences.",
  },
  {
    question: "Can I book Tombstone for a corporate event?",
    answer:
      "Yes. Tombstone hosts corporate retreats, conferences, film festivals, and weddings. Venues range from historic buildings to ranches that accommodate 50–500+ people. We'll help connect you with venues and plan your event.",
  },
  {
    question: "What should I do in Tombstone?",
    answer:
      "Visit Boot Hill Cemetery, watch a gunfight reenactment, tour the mines, stay overnight at a local lodging, eat at a historic saloon, and walk Allen Street. Each experience tells part of Tombstone's story.",
  },
  {
    question: "Why visit Tombstone in 2026?",
    answer:
      "Because authentic experiences are rare. Because this town is truly alive. Because you'll meet people who choose to live and work in this community. Because the story continues to be written.",
  },
];

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Passport to Tombstone",
    url: SITE_URL,
    description:
      "Destination marketing platform and event hosting hub for Tombstone, Arizona — the town too tough to die.",
    slogan: "Bring your people here. We'll host them right.",
    areaServed: {
      "@type": "City",
      name: "Tombstone",
      containedInPlace: { "@type": "State", name: "Arizona" },
    },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Passport to Tombstone",
    url: SITE_URL,
    description:
      "The canonical guide to experiencing authentic Tombstone, Arizona — lodging, dining, attractions, town events, and event hosting for groups of 50–500+.",
    publisher: { "@type": "Organization", name: "Passport to Tombstone", url: SITE_URL },
  };
}

export function touristDestinationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: "Tombstone, Arizona",
    description:
      "A living Old West town of roughly 1,400 residents, founded in 1877 after Ed Schieffelin's silver strike. Home of the O.K. Corral, Boothill Graveyard, and the Bird Cage Theatre. A National Historic Landmark district since 1961 — the town too tough to die.",
    url: SITE_URL,
    touristType: ["History lovers", "Culture seekers", "Event planners", "Families"],
    geo: { "@type": "GeoCoordinates", latitude: 31.7129, longitude: -110.0676 },
    includesAttraction: [
      { "@type": "TouristAttraction", name: "O.K. Corral", url: `${SITE_URL}/business/attractions_001` },
      { "@type": "TouristAttraction", name: "Boothill Graveyard", url: `${SITE_URL}/business/attractions_005` },
      { "@type": "TouristAttraction", name: "The Bird Cage Theatre", url: `${SITE_URL}/business/attractions_004` },
      { "@type": "TouristAttraction", name: "Good Enough Underground Mine Tours", url: `${SITE_URL}/business/attractions_010` },
    ],
  };
}

export function categoryItemListSchema(
  categoryName: string,
  path: string,
  items: { id: string; name: string; description: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryName} in Tombstone, Arizona`,
    url: `${SITE_URL}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      description: item.description,
      url: `${SITE_URL}/business/${item.id}`,
    })),
  };
}

export const EVENTS_PAGE_FAQ = [
  {
    question: "How many people can Tombstone venues accommodate?",
    answer:
      "Tombstone venues range from intimate historic buildings to open-air arenas. Silver Spur Homestead hosts up to 50 guests, Tombstone Monument Guest Ranch up to 100, The Saloon Theatre up to 150, the O.K. Corral up to 200, and The Shootout Arena up to 300. Combined with town lodging, Tombstone can host groups of 50–500+ across multiple venues.",
  },
  {
    question: "What types of events can I host in Tombstone?",
    answer:
      "Corporate retreats, conferences, film festivals, weddings, and private events. Venues include working guest ranches, historic saloons and theaters, and an outdoor arena. Team-building options range from horseback rides to gunfight shows and underground mine tours.",
  },
  {
    question: "Is there lodging for large groups in Tombstone?",
    answer:
      "Yes. Tombstone has 30 lodging options including hotels, guest ranches, glamping, B&Bs, vacation rentals, and RV parks. Larger properties like the Tombstone Grand Hotel and Tombstone Monument Guest Ranch handle group blocks, and the rest of the town's inns and rentals absorb overflow within walking distance of Allen Street.",
  },
  {
    question: "How do I start planning an event in Tombstone?",
    answer:
      "Submit the inquiry form on this page with your event type, expected attendee count, and preferred dates. Passport to Tombstone connects you with matching venues, coordinates local logistics, and helps market your event — there's no fee to inquire.",
  },
];

export function eventsFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: EVENTS_PAGE_FAQ.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOMEPAGE_FAQ.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function localBusinessSchema(business: Business) {
  const typeByCategory: Record<Business["category"], string> = {
    Lodging: "LodgingBusiness",
    Dining: "FoodEstablishment",
    Attractions: "TouristAttraction",
    Shopping: "Store",
    Services: "LocalBusiness",
  };

  // business.address is either a full street address ("123 E. Allen Street,
  // Tombstone, AZ 85638") or just "Tombstone, AZ 85638" for listings without
  // a public street address (mostly private vacation rentals) — only the
  // former has a street portion worth extracting.
  const streetAddress =
    business.address && !business.address.startsWith("Tombstone")
      ? business.address.split(",")[0].trim()
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": typeByCategory[business.category],
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      ...(streetAddress ? { streetAddress } : {}),
      addressLocality: "Tombstone",
      addressRegion: "AZ",
      postalCode: "85638",
      addressCountry: "US",
    },
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.website ? { url: business.website } : {}),
    ...(business.hours ? { openingHours: business.hours } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
