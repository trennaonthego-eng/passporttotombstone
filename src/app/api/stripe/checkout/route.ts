import { getBusinessById } from "@/lib/business-data";
import {
  TIER_PRICE_ENV,
  getStripe,
  isStripeConfigured,
  type UpgradeTier,
} from "@/lib/stripe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_TIERS: UpgradeTier[] = ["featured", "premier", "newsletter_sponsor"];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://passporttotombstone.com";

interface CheckoutBody {
  tier?: string;
  business_id?: string;
  business_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

export async function POST(request: Request) {
  if (!isStripeConfigured) {
    return Response.json(
      { error: "Payments aren't set up yet — check back soon or contact us to upgrade manually." },
      { status: 503 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const tier = body.tier as UpgradeTier;
  if (!VALID_TIERS.includes(tier)) {
    return Response.json({ error: "Pick a valid partnership tier." }, { status: 400 });
  }

  const errors: string[] = [];
  const businessName = body.business_name?.trim();
  if (!businessName) errors.push("Business name is required.");
  if (!body.contact_email || !EMAIL_RE.test(body.contact_email))
    errors.push("A valid contact email is required.");

  let businessId = body.business_id?.trim() || null;
  if (tier === "featured" || tier === "premier") {
    if (!businessId) errors.push("Select which listing you're upgrading.");
    else {
      const business = await getBusinessById(businessId);
      if (!business) errors.push("Couldn't find that business in the directory.");
    }
  }

  if (errors.length > 0) {
    return Response.json({ error: errors.join(" ") }, { status: 400 });
  }

  const priceId = TIER_PRICE_ENV[tier];
  if (!priceId) {
    return Response.json(
      { error: `Pricing for this tier isn't configured yet — contact us to upgrade manually.` },
      { status: 503 }
    );
  }

  const stripe = getStripe()!;
  const metadata = {
    tier,
    business_id: businessId ?? "",
    business_name: businessName!,
    contact_email: body.contact_email!.trim(),
    contact_phone: body.contact_phone?.trim() ?? "",
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: body.contact_email!.trim(),
      success_url: `${SITE_URL}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/upgrade?canceled=1&tier=${tier}`,
      metadata,
      subscription_data: { metadata },
    });

    if (!session.url) {
      return Response.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
    }
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[stripe/checkout] session creation failed:", err);
    return Response.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }
}
