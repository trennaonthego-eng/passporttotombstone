"use client";

import { useMemo, useState } from "react";
import type { UpgradeTier } from "@/lib/stripe";

interface BusinessOption {
  id: string;
  name: string;
  category: string;
}

const TIER_OPTIONS: { value: UpgradeTier; label: string; price: string }[] = [
  { value: "featured", label: "Featured Story Partner", price: "$49/month" },
  { value: "premier", label: "Premium Story Partner", price: "$99/month" },
  { value: "newsletter_sponsor", label: "Newsletter Sponsor", price: "$25/month" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UpgradeForm({
  businesses,
  initialTier,
  canceled,
}: {
  businesses: BusinessOption[];
  initialTier: UpgradeTier;
  canceled: boolean;
}) {
  const [tier, setTier] = useState<UpgradeTier>(initialTier);
  const [businessId, setBusinessId] = useState("");
  const [businessSearch, setBusinessSearch] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  // Optional listing-info updates collected at signup; they go into the
  // review queue (approved from /admin), never straight to the live site.
  const [listingInfo, setListingInfo] = useState({ address: "", hours: "", website: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const needsExistingListing = tier === "featured" || tier === "premier";

  const filtered = useMemo(() => {
    if (!businessSearch.trim()) return [];
    const q = businessSearch.toLowerCase();
    return businesses.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 8);
  }, [businessSearch, businesses]);

  function selectBusiness(b: BusinessOption) {
    setBusinessId(b.id);
    setBusinessName(b.name);
    setBusinessSearch(b.name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (needsExistingListing && !businessId) {
      setError("Search for and select your business listing above.");
      return;
    }
    if (!needsExistingListing && !businessName.trim()) {
      setError("Enter your business name.");
      return;
    }
    if (!EMAIL_RE.test(contactEmail)) {
      setError("Enter a valid contact email.");
      return;
    }

    setStatus("loading");

    // File any listing-info updates first (they queue for review either way —
    // a checkout hiccup shouldn't lose them). Best-effort: don't block payment.
    if (businessId && Object.values(listingInfo).some((v) => v.trim())) {
      fetch("/api/listing-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          contact_email: contactEmail.trim(),
          ...listingInfo,
        }),
      }).catch(() => {});
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          business_id: needsExistingListing ? businessId : undefined,
          business_name: businessName.trim(),
          contact_email: contactEmail.trim(),
          contact_phone: contactPhone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      window.location.href = data.url;
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const input =
    "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm focus:border-tombstone-red focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {canceled && (
        <p className="rounded-md border border-tombstone-gold/40 bg-tombstone-gold/10 p-3 text-sm text-tombstone-dark/80">
          Checkout was canceled — nothing was charged. Ready when you are.
        </p>
      )}

      <div>
        <label className="text-sm font-semibold text-tombstone-dark">Choose your tier</label>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {TIER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setTier(opt.value);
                setBusinessId("");
                setBusinessSearch("");
              }}
              className={`rounded-md border-2 p-3 text-left text-sm transition ${
                tier === opt.value
                  ? "border-tombstone-red bg-tombstone-red/5"
                  : "border-black/10 hover:border-tombstone-red/40"
              }`}
            >
              <p className="font-semibold text-tombstone-dark">{opt.label}</p>
              <p className="text-tombstone-dark/60">{opt.price}</p>
            </button>
          ))}
        </div>
      </div>

      {needsExistingListing ? (
        <div className="relative">
          <label className="text-sm font-semibold text-tombstone-dark">
            Which listing are you upgrading?
          </label>
          <input
            type="text"
            value={businessSearch}
            onChange={(e) => {
              setBusinessSearch(e.target.value);
              setBusinessId("");
            }}
            placeholder="Search by business name…"
            className={`${input} mt-2`}
          />
          {filtered.length > 0 && !businessId && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-black/10 bg-white shadow-lg">
              {filtered.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => selectBusiness(b)}
                  className="flex w-full items-center justify-between border-b border-black/5 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-tombstone-light"
                >
                  <span>{b.name}</span>
                  <span className="text-xs text-tombstone-dark/50">{b.category}</span>
                </button>
              ))}
            </div>
          )}
          {businessId && (
            <p className="mt-1 text-xs font-semibold text-tombstone-red">
              ✓ Selected: {businessName}
            </p>
          )}
        </div>
      ) : (
        <div>
          <label className="text-sm font-semibold text-tombstone-dark">Business name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Your business name, as it should appear in the newsletter"
            className={`${input} mt-2`}
          />
          <p className="mt-1 text-xs text-tombstone-dark/50">
            Newsletter sponsorship doesn&apos;t require an existing directory listing.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-tombstone-dark">Contact email</label>
          <input
            type="email"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={`${input} mt-2`}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-tombstone-dark">Contact phone (optional)</label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className={`${input} mt-2`}
          />
        </div>
      </div>

      {needsExistingListing && businessId && (
        <div className="rounded-lg border border-black/10 bg-tombstone-light/50 p-4">
          <p className="text-sm font-semibold text-tombstone-dark">
            Update your listing info while you&apos;re here (optional)
          </p>
          <p className="mt-1 text-xs text-tombstone-dark/60">
            We review updates before they go live. You can also update anytime at{" "}
            <span className="font-semibold">/update-listing</span> — free tier included.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={listingInfo.address}
              onChange={(e) => setListingInfo((f) => ({ ...f, address: e.target.value }))}
              placeholder="Street address"
              className={input}
            />
            <input
              type="text"
              value={listingInfo.hours}
              onChange={(e) => setListingInfo((f) => ({ ...f, hours: e.target.value }))}
              placeholder="Open hours"
              className={input}
            />
            <input
              type="text"
              value={listingInfo.website}
              onChange={(e) => setListingInfo((f) => ({ ...f, website: e.target.value }))}
              placeholder="Website"
              className={input}
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-tombstone-red">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-tombstone-red px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#b8532e] disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Redirecting to checkout…" : "Continue to Payment"}
      </button>
      <p className="text-xs text-tombstone-dark/50">
        You&apos;ll pay securely through Stripe. Subscriptions are month-to-month — cancel
        anytime. ☀️ Summer special: enter code <span className="font-bold">SUMMER50</span> on
        the checkout page for 50% off every month through November.
      </p>
    </form>
  );
}
