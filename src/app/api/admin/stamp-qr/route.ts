import QRCode from "qrcode";
import { isAuthorized } from "@/lib/supabase-admin";
import { getBusinessById } from "@/lib/business-data";
import { isStampProgramConfigured, stampToken } from "@/lib/stamps";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://passporttotombstone.com";

/** Returns the printable stamp QR (data-URL PNG) + link for one business.
 * The token in the URL is what proves the visitor was at the counter, so this
 * only ever leaves the building as a printed QR code — hence admin-only. */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }
  if (!isStampProgramConfigured()) {
    return Response.json(
      { error: "Stamp program isn't configured — set STAMP_SECRET (or connect Supabase) first." },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const businessId = url.searchParams.get("business_id") ?? "";
  const business = await getBusinessById(businessId);
  if (!business) {
    return Response.json({ error: "Unknown business." }, { status: 404 });
  }

  const stampUrl = `${SITE_URL}/stamp/${businessId}?t=${stampToken(businessId)}`;
  const qr = await QRCode.toDataURL(stampUrl, {
    margin: 1,
    width: 480,
    color: { dark: "#2b211a", light: "#ffffff" },
  });

  return Response.json({ business_name: business.name, stamp_url: stampUrl, qr });
}
