import QRCode from "qrcode";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://passporttotombstone.com";

/** Data URL PNG QR code pointing at a business's detail page — for printing
 * and posting at the physical building. */
export async function businessQrDataUrl(businessId: string): Promise<string> {
  const url = `${SITE_URL}/business/${businessId}`;
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 320,
    color: { dark: "#2b211a", light: "#f5eee0" },
  });
}
