import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

let client: Stripe | null = null;
if (secretKey) {
  client = new Stripe(secretKey);
}

/** Server-only Stripe client. Never import from client components. */
export function getStripe(): Stripe | null {
  return client;
}

export const isStripeConfigured = Boolean(
  process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_WEBHOOK_SECRET &&
    process.env.STRIPE_PRICE_FEATURED &&
    process.env.STRIPE_PRICE_PREMIER &&
    process.env.STRIPE_PRICE_SPONSOR
);

export type UpgradeTier = "featured" | "premier" | "newsletter_sponsor";

export const TIER_PRICE_ENV: Record<UpgradeTier, string | undefined> = {
  featured: process.env.STRIPE_PRICE_FEATURED,
  premier: process.env.STRIPE_PRICE_PREMIER,
  newsletter_sponsor: process.env.STRIPE_PRICE_SPONSOR,
};

export const TIER_LABELS: Record<UpgradeTier, string> = {
  featured: "Featured Story Partner ($49/month)",
  premier: "Premium Story Partner ($99/month)",
  newsletter_sponsor: "Newsletter Sponsor ($25/month)",
};

// Internal businesses.tier value each upgrade tier grants once payment clears.
export const TIER_TO_BUSINESS_TIER: Record<UpgradeTier, string> = {
  featured: "featured",
  premier: "premium_featured",
  newsletter_sponsor: "featured", // sponsorship doesn't change listing tier by itself
};
