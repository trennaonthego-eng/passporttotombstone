"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase";
import type { Itinerary } from "@/lib/types";

export default function AccountPage() {
  const { user, loading, configured, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [trips, setTrips] = useState<Itinerary[] | null>(null);

  useEffect(() => {
    if (!user || !configured) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase
      .from("itineraries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setTrips(data ?? []));
  }, [user, configured]);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await signInWithEmail(email);
    if (error) {
      setStatus("error");
      setErrorMessage(error);
    } else {
      setStatus("sent");
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-tombstone-navy">Your Account</h1>

      {!configured && (
        <div className="mt-6 rounded-lg border border-tombstone-gold/40 bg-tombstone-gold/10 p-4 text-sm text-tombstone-dark/80">
          Accounts aren&apos;t connected yet — this site&apos;s Supabase project needs to be set
          up first. Your trip planner still works without an account; it&apos;s just saved to
          this browser instead of the cloud. See the README for setup steps.
        </div>
      )}

      {configured && loading && <p className="mt-6 text-sm text-tombstone-dark/60">Loading…</p>}

      {configured && !loading && !user && (
        <div className="mt-6">
          <p className="text-sm text-tombstone-dark/75">
            Sign in with your email to save trips across devices and share them later. No
            password — we&apos;ll send you a magic link.
          </p>
          {status === "sent" ? (
            <p className="mt-4 rounded-lg bg-tombstone-navy/10 p-4 text-sm text-tombstone-navy">
              Check your inbox — click the link we sent to {email} to sign in.
            </p>
          ) : (
            <form onSubmit={handleSignIn} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-md border border-black/15 px-4 py-2.5 text-sm focus:border-tombstone-red focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="rounded-md bg-tombstone-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b8532e] disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send Magic Link"}
              </button>
            </form>
          )}
          {status === "error" && <p className="mt-2 text-xs text-tombstone-red">{errorMessage}</p>}
        </div>
      )}

      {configured && user && (
        <div className="mt-6">
          <div className="flex items-center justify-between rounded-lg bg-tombstone-light p-4">
            <p className="text-sm text-tombstone-dark">
              Signed in as <span className="font-semibold">{user.email}</span>
            </p>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-sm font-semibold text-tombstone-red hover:underline"
            >
              Sign out
            </button>
          </div>

          <h2 className="mt-8 font-display text-xl font-bold text-tombstone-navy">My Trips</h2>
          {trips === null ? (
            <p className="mt-3 text-sm text-tombstone-dark/60">Loading your trips…</p>
          ) : trips.length === 0 ? (
            <p className="mt-3 text-sm text-tombstone-dark/60">
              No saved trips yet. Build one with the trip tray or the Marshal, then hit
              &ldquo;Save &amp; Get Share Link&rdquo; while signed in.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {trips.map((t) => (
                <li key={t.share_slug} className="rounded-lg border border-black/10 p-3">
                  <Link href={`/trip/${t.share_slug}`} className="font-semibold text-tombstone-navy hover:underline">
                    {t.title}
                  </Link>
                  <p className="text-xs text-tombstone-dark/60">{t.items.length} stops</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
