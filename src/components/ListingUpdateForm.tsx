"use client";

import { useMemo, useState } from "react";

interface BusinessOption {
  id: string;
  name: string;
  category: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Public "update your listing" form — open to every business, free tier
 * included. Submissions land in a review queue; nothing goes live until
 * approved from the admin dashboard. */
export default function ListingUpdateForm({
  businesses,
  initialBusinessId,
}: {
  businesses: BusinessOption[];
  initialBusinessId?: string;
}) {
  const initial = businesses.find((b) => b.id === initialBusinessId);
  const [businessId, setBusinessId] = useState(initial?.id ?? "");
  const [businessSearch, setBusinessSearch] = useState(initial?.name ?? "");
  const [fields, setFields] = useState({
    address: "",
    hours: "",
    phone: "",
    email: "",
    website: "",
    note: "",
  });
  const [contactEmail, setContactEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    if (!businessSearch.trim() || businessId) return [];
    const q = businessSearch.toLowerCase();
    return businesses.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 8);
  }, [businessSearch, businessId, businesses]);

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (!businessId) {
      setStatus("error");
      setMessage("Search for and select your business above.");
      return;
    }
    if (!EMAIL_RE.test(contactEmail)) {
      setStatus("error");
      setMessage("Enter a valid contact email so we can follow up.");
      return;
    }
    if (!Object.values(fields).some((v) => v.trim())) {
      setStatus("error");
      setMessage("Fill in at least one field you'd like updated.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/listing-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          contact_email: contactEmail.trim(),
          ...fields,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      setMessage(data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const input =
    "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm focus:border-tombstone-red focus:outline-none";

  if (status === "sent") {
    return (
      <p className="rounded-lg border border-green-600/30 bg-green-600/10 p-4 text-sm font-semibold text-green-800">
        ✓ {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <label className="text-sm font-semibold text-tombstone-dark">Your business</label>
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
        {filtered.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-black/10 bg-white shadow-lg">
            {filtered.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setBusinessId(b.id);
                  setBusinessSearch(b.name);
                }}
                className="flex w-full items-center justify-between border-b border-black/5 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-tombstone-light"
              >
                <span>{b.name}</span>
                <span className="text-xs text-tombstone-dark/50">{b.category}</span>
              </button>
            ))}
          </div>
        )}
        {businessId && (
          <p className="mt-1 text-xs font-semibold text-tombstone-red">✓ Selected: {businessSearch}</p>
        )}
      </div>

      <p className="text-xs text-tombstone-dark/60">
        Fill in only what&apos;s changing — blank fields keep their current value.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-tombstone-dark">Street address</label>
          <input type="text" value={fields.address} onChange={set("address")} placeholder="123 E. Allen Street, Tombstone, AZ 85638" className={`${input} mt-2`} />
        </div>
        <div>
          <label className="text-sm font-semibold text-tombstone-dark">Open hours</label>
          <input type="text" value={fields.hours} onChange={set("hours")} placeholder="Daily 10am–5pm" className={`${input} mt-2`} />
        </div>
        <div>
          <label className="text-sm font-semibold text-tombstone-dark">Phone</label>
          <input type="tel" value={fields.phone} onChange={set("phone")} placeholder="520-457-0000" className={`${input} mt-2`} />
        </div>
        <div>
          <label className="text-sm font-semibold text-tombstone-dark">Business email</label>
          <input type="email" value={fields.email} onChange={set("email")} placeholder="hello@yourbusiness.com" className={`${input} mt-2`} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-tombstone-dark">Website</label>
          <input type="text" value={fields.website} onChange={set("website")} placeholder="yourbusiness.com" className={`${input} mt-2`} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-tombstone-dark">Anything else? (optional)</label>
          <textarea value={fields.note} onChange={set("note")} rows={3} placeholder="Anything we should know — seasonal hours, a name change, a correction…" className={`${input} mt-2`} />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-tombstone-dark">Your contact email</label>
        <input type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@example.com" className={`${input} mt-2 sm:max-w-sm`} />
        <p className="mt-1 text-xs text-tombstone-dark/50">
          Only used if we have a question about your update — never published.
        </p>
      </div>

      {status === "error" && <p className="text-sm text-tombstone-red">{message}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-tombstone-red px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#b8532e] disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Submit Update"}
      </button>
      <p className="text-xs text-tombstone-dark/50">
        Every update is reviewed before it goes live — usually within a couple of days.
      </p>
    </form>
  );
}
