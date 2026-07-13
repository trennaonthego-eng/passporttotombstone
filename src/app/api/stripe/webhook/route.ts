import type Stripe from "stripe";
import { getBusinessById } from "@/lib/business-data";
import { getStripe, TIER_TO_BUSINESS_TIER, type UpgradeTier } from "@/lib/stripe";
import { getAdminSupabase } from "@/lib/supabase-admin";

/**
 * Source of truth for granting/revoking paid tiers. The /upgrade success page
 * is just a "thanks, hang tight" message — this webhook is what actually
 * flips a business to Featured/Premier once Stripe confirms payment, and
 * flips it back if the subscription is later canceled.
 */

const MONTHLY_PRICE: Record<UpgradeTier, number> = {
  featured: 49,
  premier: 199,
  newsletter_sponsor: 25,
};

const TIER_TO_INTERNAL: Record<string, string> = {
  free: "free",
  featured: "featured",
  premium_featured: "premium_featured",
  event_host: "event_host",
};

async function upgradeBusinessTier(businessId: string, upgradeTier: UpgradeTier) {
  const supabase = getAdminSupabase();
  if (!supabase) return;

  const business = await getBusinessById(businessId);
  if (!business) return;

  await supabase.from("businesses").upsert(
    {
      id: business.id,
      name: business.name,
      category: business.category,
      subcategory: business.subcategory,
      description: business.description,
      story: business.story,
      address: business.address,
      hours: business.hours,
      phone: business.phone,
      email: business.email,
      website: business.website,
      image_url: business.image_url,
      tier: TIER_TO_BUSINESS_TIER[upgradeTier],
      event_host: business.event_host,
      event_types: business.event_types,
      event_capacity: business.event_capacity,
      is_featured_on_homepage: business.is_featured_on_homepage,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
}

async function downgradeBusinessTier(businessId: string) {
  const supabase = getAdminSupabase();
  if (!supabase) return;

  const business = await getBusinessById(businessId);
  if (!business) return;

  await supabase
    .from("businesses")
    .update({ tier: TIER_TO_INTERNAL.free, updated_at: new Date().toISOString() })
    .eq("id", businessId);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = getAdminSupabase();
  if (!supabase) return;

  const metadata = session.metadata ?? {};
  const tier = metadata.tier as UpgradeTier | undefined;
  if (!tier) return;

  const businessId = metadata.business_id || null;
  const businessName = metadata.business_name || null;
  const customerId = typeof session.customer === "string" ? session.customer : null;
  const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

  if (businessId) {
    await upgradeBusinessTier(businessId, tier);
  }

  await supabase.from("partnerships").insert({
    business_id: businessId,
    business_name: businessName,
    partnership_type: tier,
    tier,
    monthly_price: MONTHLY_PRICE[tier],
    status: "active",
    starts_at: new Date().toISOString(),
    contact_email: metadata.contact_email || session.customer_email || null,
    contact_phone: metadata.contact_phone || null,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
  });
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const supabase = getAdminSupabase();
  if (!supabase) return;

  const metadata = subscription.metadata ?? {};
  const businessId = metadata.business_id || null;

  await supabase
    .from("partnerships")
    .update({ status: "canceled", expires_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id);

  if (businessId) {
    await downgradeBusinessTier(businessId);
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return Response.json({ error: "Stripe isn't configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature." }, { status: 400 });
  }

  // Stripe signature verification needs the exact raw request body.
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed:", err);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;
      default:
        break; // ignore events we don't act on
    }
  } catch (err) {
    console.error(`[stripe/webhook] handler failed for ${event.type}:`, err);
    return Response.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
