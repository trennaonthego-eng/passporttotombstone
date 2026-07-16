"use client";

import { useCallback, useEffect, useState } from "react";
import CopyBlock from "@/components/CopyBlock";
import { businesses as seedBusinesses } from "@/data/businesses";

type Tab =
  | "inquiries"
  | "signups"
  | "events"
  | "businesses"
  | "toolkit"
  | "photos"
  | "stamps"
  | "updates";

// Post templates are a Premier perk, delivered to the business by the team —
// never shown on the public site.
const PAYING_PARTNERS = seedBusinesses.filter((b) => b.tier !== "free");

function socialTemplate(b: (typeof seedBusinesses)[number]) {
  return `${b.story}\n\n${b.description}\n\n📍 Find us in Tombstone, Arizona — the town too tough to die.${b.address ? `\n${b.address}` : ""}${b.phone ? `\n📞 ${b.phone}` : ""}\n\n#Tombstone #TombstoneAZ #OldWest #PassportToTombstone`;
}

function gbpTemplate(b: (typeof seedBusinesses)[number]) {
  return `${b.description}\n\n${b.story}\n\nProudly part of Passport to Tombstone — the guide to the real Old West.${b.phone ? ` Call ${b.phone}.` : ""}`;
}

interface Inquiry {
  id: string;
  event_name: string;
  event_type: string;
  attendee_count: number;
  preferred_dates: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  message: string;
  status: string;
  created_at: string;
}

interface Signup {
  email: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

interface TownEvent {
  id: string;
  name: string;
  event_date: string;
  time_label: string;
  venue: string;
  address: string;
}

interface ListingUpdate {
  id: string;
  business_id: string | null;
  business_name: string;
  address: string | null;
  hours: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  note: string | null;
  contact_email: string;
  created_at: string;
}

interface BusinessListItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "🆕 New",
  contacted: "📞 Contacted",
  booked: "✅ Booked",
  closed: "📁 Closed",
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<Tab | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [events, setEvents] = useState<TownEvent[]>([]);
  const [businessList, setBusinessList] = useState<BusinessListItem[]>([]);

  const authFetch = useCallback(
    (path: string, init?: RequestInit) =>
      fetch(path, {
        ...init,
        headers: {
          ...(init?.headers ?? {}),
          Authorization: `Bearer ${password}`,
          "Content-Type": "application/json",
        },
      }),
    [password]
  );

  async function load(which: Tab) {
    setLoading(true);
    setError("");
    try {
      const paths: Record<Tab, string | null> = {
        inquiries: "/api/admin/inquiries",
        signups: "/api/admin/signups",
        events: "/api/admin/town-events",
        businesses: null, // download/upload UI only, nothing to prefetch
        toolkit: null, // renders from seed data, nothing to prefetch
        photos: "/api/admin/businesses?format=json",
        stamps: "/api/admin/businesses?format=json",
        updates: "/api/admin/listing-updates",
      };
      const path = paths[which];
      if (path) {
        const res = await authFetch(path);
        const data = await res.json();
        // 503 = password was right but Supabase isn't connected — let the VA
        // in and show the message instead of locking them out.
        if (res.status === 503) {
          setLoggedIn(true);
          setTab(which);
          setError(data.error);
          return;
        }
        if (!res.ok) throw new Error(data.error);
        if (which === "inquiries") setInquiries(data.inquiries);
        else if (which === "signups") setSignups(data.signups);
        else if (which === "events") setEvents(data.events);
        else if (which === "photos" || which === "stamps") setBusinessList(data.businesses);
        else if (which === "updates") setListingUpdates(data.updates);
      }
      setTab(which);
      setLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setError("");
    const res = await authFetch("/api/admin/inquiries", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setInquiries((list) => list.map((q) => (q.id === id ? { ...q, status } : q)));
    } else {
      const data = await res.json();
      setError(data.error ?? "Could not update.");
    }
  }

  async function deleteEvent(id: string) {
    if (!window.confirm("Remove this event from the public calendar?")) return;
    const res = await authFetch(`/api/admin/town-events?id=${id}`, { method: "DELETE" });
    if (res.ok) setEvents((list) => list.filter((e) => e.id !== id));
  }

  // simple new-event form state
  const [form, setForm] = useState({ name: "", event_date: "", time_label: "", venue: "", address: "" });
  const [saving, setSaving] = useState(false);

  // CSV upload state
  const [csvBusy, setCsvBusy] = useState(false);
  const [csvResult, setCsvResult] = useState("");

  // Listing-update review state
  const [listingUpdates, setListingUpdates] = useState<ListingUpdate[]>([]);

  async function reviewUpdate(id: string, action: "approve" | "reject") {
    setError("");
    const res = await authFetch("/api/admin/listing-updates", {
      method: "PATCH",
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      setListingUpdates((list) => list.filter((u) => u.id !== id));
    } else {
      const data = await res.json();
      setError(data.error ?? "Could not update.");
    }
  }

  // Stamp QR state
  const [stampSearch, setStampSearch] = useState("");
  const [stampBusy, setStampBusy] = useState(false);
  const [stampQr, setStampQr] = useState<{ businessName: string; url: string; qr: string } | null>(null);

  async function loadStampQr(businessId: string) {
    setStampBusy(true);
    setStampQr(null);
    setError("");
    try {
      const res = await authFetch(`/api/admin/stamp-qr?business_id=${encodeURIComponent(businessId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStampQr({ businessName: data.business_name, url: data.stamp_url, qr: data.qr });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not build the QR code.");
    } finally {
      setStampBusy(false);
    }
  }

  // Photo upload state
  const [photoBusinessId, setPhotoBusinessId] = useState("");
  const [photoSearch, setPhotoSearch] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoResult, setPhotoResult] = useState("");

  async function uploadPhoto(file: File) {
    if (!photoBusinessId) {
      setError("Pick a business first.");
      return;
    }
    setPhotoBusy(true);
    setPhotoResult("");
    setError("");
    try {
      const form = new FormData();
      form.append("business_id", photoBusinessId);
      form.append("file", file);
      const res = await fetch("/api/admin/photo", {
        method: "POST",
        headers: { Authorization: `Bearer ${password}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBusinessList((list) =>
        list.map((b) => (b.id === photoBusinessId ? { ...b, image_url: data.image_url } : b))
      );
      const name = businessList.find((b) => b.id === photoBusinessId)?.name ?? "that business";
      setPhotoResult(`✓ Photo saved for ${name}. It appears on the site within 5 minutes.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setPhotoBusy(false);
    }
  }

  async function downloadBusinessesCsv() {
    const res = await authFetch("/api/admin/businesses");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not download.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tombstone-businesses.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function uploadBusinessesCsv(file: File) {
    setCsvBusy(true);
    setCsvResult("");
    setError("");
    try {
      const text = await file.text();
      const res = await authFetch("/api/admin/businesses", { method: "POST", body: text });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCsvResult(`✓ ${data.count} businesses updated. Changes appear on the site within 5 minutes.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setCsvBusy(false);
    }
  }

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await authFetch("/api/admin/town-events", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save.");
      return;
    }
    setForm({ name: "", event_date: "", time_label: "", venue: "", address: "" });
    load("events");
  }

  useEffect(() => {
    document.title = "Admin | Passport to Tombstone";
  }, []);

  const input =
    "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm focus:border-tombstone-red focus:outline-none";

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-tombstone-navy">Team Login</h1>
        <p className="mt-2 text-sm text-tombstone-dark/70">
          Enter the team password to open the dashboard.
        </p>
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            load("inquiries");
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={input}
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="rounded-md bg-tombstone-red px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Checking…" : "Open Dashboard"}
          </button>
          {error && <p className="text-xs text-tombstone-red">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-tombstone-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-tombstone-dark/70">
        Pick a job. Nothing here can break the website.
      </p>

      {/* THE 3 BUTTONS */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ["inquiries", "📋", "Event Inquiries", "People who want to bring events to town"],
            ["signups", "💌", "Newsletter List", "See and download subscriber emails"],
            ["events", "📅", "Calendar Events", "Add events to the public calendar"],
            ["businesses", "📊", "Update Businesses", "Download, edit in Excel, re-upload"],
            ["photos", "📸", "Add Photos", "Swap the placeholder art for real photos"],
            ["toolkit", "🧰", "Partner Toolkit", "Post templates to email paying partners"],
            ["stamps", "🪪", "Stamp QR Codes", "Print passport stamp codes for partner counters"],
            ["updates", "📥", "Listing Updates", "Approve info changes businesses send in"],
          ] as [Tab, string, string, string][]
        ).map(([key, icon, label, hint]) => (
          <button
            key={key}
            type="button"
            onClick={() => load(key)}
            className={`rounded-2xl border-2 p-6 text-left transition ${
              tab === key
                ? "border-tombstone-red bg-white shadow-md"
                : "border-black/10 bg-white hover:border-tombstone-red/50"
            }`}
          >
            <span className="text-3xl">{icon}</span>
            <p className="mt-2 font-display text-lg font-bold text-tombstone-dark">{label}</p>
            <p className="mt-1 text-xs text-tombstone-dark/60">{hint}</p>
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-md border border-tombstone-red/40 bg-tombstone-red/10 p-3 text-sm text-tombstone-red">
          {error}
        </p>
      )}
      {loading && <p className="mt-6 text-sm text-tombstone-dark/60">Loading…</p>}

      {/* INQUIRIES */}
      {tab === "inquiries" && !loading && (
        <div className="mt-8 space-y-4">
          {inquiries.length === 0 && (
            <p className="text-sm text-tombstone-dark/60">No event inquiries yet.</p>
          )}
          {inquiries.map((q) => (
            <div key={q.id} className="rounded-xl border border-black/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-tombstone-dark">
                    {q.event_name}{" "}
                    <span className="text-sm font-normal text-tombstone-dark/60">
                      · {q.event_type} · {q.attendee_count} people · {q.preferred_dates}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-tombstone-dark/80">
                    {q.contact_name} —{" "}
                    <a href={`mailto:${q.contact_email}`} className="text-tombstone-red underline">
                      {q.contact_email}
                    </a>
                    {q.contact_phone && <> · {q.contact_phone}</>}
                  </p>
                  {q.message && <p className="mt-2 text-sm text-tombstone-dark/70">{q.message}</p>}
                </div>
                <select
                  value={q.status}
                  onChange={(e) => updateStatus(q.id, e.target.value)}
                  className="rounded-md border border-black/15 bg-tombstone-light px-2 py-1.5 text-sm font-semibold"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SIGNUPS */}
      {tab === "signups" && !loading && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-tombstone-dark">
              {signups.length} subscriber{signups.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={async () => {
                const res = await authFetch("/api/admin/signups?format=csv");
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "newsletter-signups.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="rounded-md bg-tombstone-navy px-4 py-2 text-sm font-semibold text-white"
            >
              ⬇️ Download as spreadsheet (CSV)
            </button>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-tombstone-light text-xs uppercase tracking-wide text-tombstone-dark/60">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((s) => (
                  <tr key={s.email} className="border-t border-black/5">
                    <td className="px-4 py-2">{s.email}</td>
                    <td className="px-4 py-2 text-tombstone-dark/60">
                      {new Date(s.subscribed_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PARTNER TOOLKIT — templates the team emails to paying partners */}
      {tab === "toolkit" && !loading && (
        <div className="mt-8 space-y-8">
          <p className="text-sm text-tombstone-dark/70">
            These are the ready-to-post templates for paying partners. Copy them, or use
            the email button to send them straight to the business — they never appear on
            the public site.
          </p>
          {PAYING_PARTNERS.map((b) => {
            const social = socialTemplate(b);
            const gbp = gbpTemplate(b);
            const emailBody = `Hi ${b.name} team,\n\nHere are your ready-to-post templates from Passport to Tombstone.\n\n--- SOCIAL MEDIA POST ---\n\n${social}\n\n--- GOOGLE BUSINESS PROFILE POST ---\n\n${gbp}\n\nPost them as-is or tweak however you like!\n\n— Passport to Tombstone`;
            return (
              <div key={b.id} className="rounded-xl border border-black/10 bg-tombstone-light p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-lg font-bold text-tombstone-dark">
                    {b.name}
                    <span className="ml-2 rounded-full bg-tombstone-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                      Premier
                    </span>
                  </p>
                  <a
                    href={`mailto:${b.email ?? ""}?subject=${encodeURIComponent(
                      `Your Passport to Tombstone post templates — ${b.name}`
                    )}&body=${encodeURIComponent(emailBody)}`}
                    className="rounded-md bg-tombstone-navy px-4 py-2 text-sm font-semibold text-white"
                  >
                    ✉️ Email to business
                  </a>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <CopyBlock label="Social media post" text={social} />
                  <CopyBlock label="Google Business Profile post" text={gbp} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BUSINESSES (CSV round-trip) */}
      {tab === "businesses" && !loading && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white p-6">
            <p className="font-display text-lg font-bold text-tombstone-dark">Step 1 — Download</p>
            <p className="mt-2 text-sm text-tombstone-dark/70">
              Get the current business list as a spreadsheet. Open it in Excel or Google
              Sheets. You can change phone numbers, descriptions, stories, tiers
              (free / featured / premier), add new rows, or fix anything that&apos;s wrong.
            </p>
            <button
              type="button"
              onClick={downloadBusinessesCsv}
              className="mt-4 rounded-md bg-tombstone-navy px-5 py-2.5 text-sm font-semibold text-white"
            >
              ⬇️ Download Current CSV
            </button>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-6">
            <p className="font-display text-lg font-bold text-tombstone-dark">Step 2 — Upload</p>
            <p className="mt-2 text-sm text-tombstone-dark/70">
              When you&apos;re done editing, save as CSV and upload it here. The system
              checks every row before saving — if anything&apos;s off, nothing changes and
              you&apos;ll see exactly which rows to fix.
            </p>
            <label className="mt-4 block cursor-pointer rounded-lg border-2 border-dashed border-tombstone-navy/30 p-6 text-center text-sm font-semibold text-tombstone-navy hover:border-tombstone-red/60">
              {csvBusy ? "Uploading…" : "Click to choose your edited CSV"}
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                disabled={csvBusy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadBusinessesCsv(file);
                  e.target.value = "";
                }}
              />
            </label>
            {csvResult && (
              <p className="mt-3 rounded-md border border-green-600/30 bg-green-600/10 p-3 text-sm font-semibold text-green-800">
                {csvResult}
              </p>
            )}
          </div>
        </div>
      )}

      {/* PHOTOS */}
      {tab === "photos" && !loading && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white p-6">
            <p className="font-display text-lg font-bold text-tombstone-dark">
              Select a business
            </p>
            <input
              type="text"
              placeholder="Search by name…"
              value={photoSearch}
              onChange={(e) => setPhotoSearch(e.target.value)}
              className={`${input} mt-4`}
            />
            <div className="mt-3 max-h-80 overflow-y-auto rounded-md border border-black/10">
              {businessList
                .filter((b) => b.name.toLowerCase().includes(photoSearch.toLowerCase()))
                .map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setPhotoBusinessId(b.id)}
                    className={`flex w-full items-center justify-between border-b border-black/5 px-3 py-2 text-left text-sm last:border-b-0 ${
                      photoBusinessId === b.id
                        ? "bg-tombstone-red/10 font-semibold text-tombstone-red"
                        : "hover:bg-tombstone-light"
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-xs text-tombstone-dark/50">
                      {b.image_url.includes(".supabase.co/storage/") ? "📷 has photo" : b.category}
                    </span>
                  </button>
                ))}
              {businessList.length === 0 && (
                <p className="p-3 text-sm text-tombstone-dark/50">No businesses found.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-6">
            <p className="font-display text-lg font-bold text-tombstone-dark">Upload a photo</p>
            <p className="mt-2 text-sm text-tombstone-dark/70">
              {photoBusinessId
                ? `Uploading for: ${businessList.find((b) => b.id === photoBusinessId)?.name}`
                : "Pick a business on the left first."}
            </p>
            <label
              className={`mt-4 block rounded-lg border-2 border-dashed p-6 text-center text-sm font-semibold ${
                photoBusinessId
                  ? "cursor-pointer border-tombstone-navy/30 text-tombstone-navy hover:border-tombstone-red/60"
                  : "cursor-not-allowed border-black/10 text-tombstone-dark/30"
              }`}
            >
              {photoBusy ? "Uploading…" : "Click to choose a photo (JPG, PNG, or WEBP)"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={!photoBusinessId || photoBusy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadPhoto(file);
                  e.target.value = "";
                }}
              />
            </label>
            {photoResult && (
              <p className="mt-3 rounded-md border border-green-600/30 bg-green-600/10 p-3 text-sm font-semibold text-green-800">
                {photoResult}
              </p>
            )}
            <p className="mt-4 text-xs text-tombstone-dark/50">
              One photo per business — uploading a new one replaces the old one. It becomes
              the picture shown on the listing card and the business page.
            </p>
          </div>
        </div>
      )}

      {/* LISTING UPDATES (review queue) */}
      {tab === "updates" && !loading && (
        <div className="mt-8 space-y-4">
          {listingUpdates.length === 0 && (
            <p className="text-sm text-tombstone-dark/60">
              No pending updates. When a business submits new info (address, hours, phone,
              email, website), it shows up here for approval before anything goes live.
            </p>
          )}
          {listingUpdates.map((u) => (
            <div key={u.id} className="rounded-xl border border-black/10 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-tombstone-dark">
                    {u.business_name}
                  </p>
                  <p className="text-xs text-tombstone-dark/60">
                    Submitted {new Date(u.created_at).toLocaleDateString()} by{" "}
                    <a href={`mailto:${u.contact_email}`} className="text-tombstone-red underline">
                      {u.contact_email}
                    </a>
                  </p>
                  <dl className="mt-3 space-y-1 text-sm text-tombstone-dark/80">
                    {u.address && <div><span className="font-semibold">Address:</span> {u.address}</div>}
                    {u.hours && <div><span className="font-semibold">Hours:</span> {u.hours}</div>}
                    {u.phone && <div><span className="font-semibold">Phone:</span> {u.phone}</div>}
                    {u.email && <div><span className="font-semibold">Email:</span> {u.email}</div>}
                    {u.website && <div><span className="font-semibold">Website:</span> {u.website}</div>}
                    {u.note && <div><span className="font-semibold">Note:</span> {u.note}</div>}
                  </dl>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => reviewUpdate(u.id, "approve")}
                    className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                  >
                    ✓ Approve & publish
                  </button>
                  <button
                    type="button"
                    onClick={() => reviewUpdate(u.id, "reject")}
                    className="rounded-md border border-tombstone-red/40 px-4 py-2 text-sm font-semibold text-tombstone-red hover:bg-tombstone-red/10"
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* STAMP QR CODES */}
      {tab === "stamps" && !loading && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white p-6">
            <p className="font-display text-lg font-bold text-tombstone-dark">
              Pick a stamp location
            </p>
            <p className="mt-2 text-sm text-tombstone-dark/70">
              Every business can be a stamp location — pick one to get its unique QR code,
              then print it and post it at the counter. Visitors scan it on-site to add the
              stamp to their digital passport.
            </p>
            <input
              type="text"
              placeholder="Search by name…"
              value={stampSearch}
              onChange={(e) => setStampSearch(e.target.value)}
              className={`${input} mt-4`}
            />
            <div className="mt-3 max-h-80 overflow-y-auto rounded-md border border-black/10">
              {businessList
                .filter((b) => b.name.toLowerCase().includes(stampSearch.toLowerCase()))
                .map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => loadStampQr(b.id)}
                    className="flex w-full items-center justify-between border-b border-black/5 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-tombstone-light"
                  >
                    <span>{b.name}</span>
                    <span className="text-xs text-tombstone-dark/50">{b.category}</span>
                  </button>
                ))}
              {businessList.length === 0 && (
                <p className="p-3 text-sm text-tombstone-dark/50">No businesses found.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-6 text-center">
            {stampBusy && <p className="text-sm text-tombstone-dark/60">Building QR code…</p>}
            {!stampBusy && !stampQr && (
              <p className="text-sm text-tombstone-dark/60">
                Pick a business on the left — its printable QR code shows up here.
              </p>
            )}
            {stampQr && (
              <div>
                <p className="font-display text-lg font-bold text-tombstone-dark">
                  {stampQr.businessName}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stampQr.qr}
                  alt={`Passport stamp QR code for ${stampQr.businessName}`}
                  className="mx-auto mt-4 w-64 rounded-lg border border-black/10"
                />
                <p className="mt-3 break-all text-xs text-tombstone-dark/50">{stampQr.url}</p>
                <div className="mt-4 flex justify-center gap-3">
                  <a
                    href={stampQr.qr}
                    download={`stamp-qr-${stampQr.businessName.replace(/\W+/g, "-").toLowerCase()}.png`}
                    className="rounded-md bg-tombstone-navy px-4 py-2 text-sm font-semibold text-white"
                  >
                    ⬇️ Download PNG
                  </a>
                </div>
                <p className="mt-4 text-xs text-tombstone-dark/50">
                  Print it on a rack card or counter placard. The code only works for this
                  business — it can&apos;t be reused anywhere else.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EVENTS */}
      {tab === "events" && !loading && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form onSubmit={addEvent} className="rounded-xl border border-black/10 bg-white p-5">
            <p className="font-display text-lg font-bold text-tombstone-dark">
              Add an event to the public calendar
            </p>
            <div className="mt-4 space-y-3">
              <input
                className={input}
                placeholder="Event name (e.g. Vigilante Sunday)"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <input
                className={input}
                type="date"
                value={form.event_date}
                onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
              />
              <input
                className={input}
                placeholder="Time (e.g. 10:00 AM - 4:00 PM)"
                value={form.time_label}
                onChange={(e) => setForm((f) => ({ ...f, time_label: e.target.value }))}
              />
              <input
                className={input}
                placeholder="Venue (e.g. Downtown Tombstone)"
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
              />
              <input
                className={input}
                placeholder="Address (optional)"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-md bg-tombstone-red px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Publish to Calendar"}
              </button>
              <p className="text-xs text-tombstone-dark/50">
                It appears on the public calendar within 5 minutes.
              </p>
            </div>
          </form>

          <div>
            <p className="font-display text-lg font-bold text-tombstone-dark">
              Events you&apos;ve added
            </p>
            <div className="mt-4 space-y-3">
              {events.length === 0 && (
                <p className="text-sm text-tombstone-dark/60">
                  None yet. The built-in 2026 schedule is managed separately.
                </p>
              )}
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-black/10 bg-white p-4"
                >
                  <div>
                    <p className="text-sm font-bold text-tombstone-dark">{ev.name}</p>
                    <p className="text-xs text-tombstone-dark/60">
                      {ev.event_date} · {ev.time_label} · {ev.venue}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteEvent(ev.id)}
                    className="text-xs font-semibold text-tombstone-red hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
