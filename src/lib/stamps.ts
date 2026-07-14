import { createHmac, timingSafeEqual } from "crypto";

/**
 * Server-only helpers for the Passport stamp program.
 *
 * Each participating business gets a QR code pointing at
 *   /stamp/{business_id}?t={token}
 * where the token is an HMAC of the business id. The token is what makes the
 * printed QR code at the counter worth something: the plain business id is
 * public on the website, so without the token anyone could "collect" stamps
 * from their couch. Phase 2 can add geo-verification on top.
 */

const REWARD_MILESTONE = 5;
const COMPLETE_MILESTONE = 10;
export const MILESTONES = { halfway: REWARD_MILESTONE, complete: COMPLETE_MILESTONE };

function secret(): string | null {
  // Dedicated secret preferred; fall back to the service-role key so the
  // program works without an extra env var (both are server-only).
  return process.env.STAMP_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
}

export const isStampProgramConfigured = () => Boolean(secret());

export function stampToken(businessId: string): string | null {
  const key = secret();
  if (!key) return null;
  return createHmac("sha256", key).update(`stamp:${businessId}`).digest("hex").slice(0, 20);
}

export function isValidStampToken(businessId: string, token: string): boolean {
  const expected = stampToken(businessId);
  if (!expected || !token || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}
