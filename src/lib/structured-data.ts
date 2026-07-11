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

  return {
    "@context": "https://schema.org",
    "@type": typeByCategory[business.category],
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tombstone",
      addressRegion: "AZ",
      postalCode: "85638",
      addressCountry: "US",
    },
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(business.website ? { url: business.website } : {}),
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
