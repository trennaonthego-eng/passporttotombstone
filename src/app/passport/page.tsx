"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase";
import { businesses as seedBusinesses } from "@/data/businesses";

const HALFWAY = 5;
const COMPLETE = 10;

interface StampRow {
  business_id: string;
  created_at: string;
}

const businessName = (id: string) =>
  seedBusinesses.find((b) => b.id === id)?.name ?? "A Tombstone partner";

export default function PassportPage() {
  const { user, loading, configured, signOut } = useAuth();
  const [stamps, setStamps] = useState<StampRow[] | null>(null);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user || !configured) return;
    const supabase = getSupabase();
    if (!supabase) return;
    supabase
      .from("passport_stamps")
      .select("business_id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => setStamps(data ?? []));
  }, [user, configured]);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Redirect the magic link back here (not /account) so the visitor lands
    // straight on their passport.
    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setErrorMessage("Accounts aren't connected yet.");
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href },
    });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  const count = stamps?.length ?? 0;
  const slots = Array.from({ length: COMPLETE }, (_, i) => stamps?.[i] ?? null);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tombstone-red">
        The Stamp Collection
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold text-tombstone-navy">My Passport</h1>
      <p className="mt-3 max-w-xl text-sm text-tombstone-dark/75">
        Scan the Passport QR code posted at participating Tombstone businesses to collect
        stamps. Ten stamps completes your passport and unlocks the reward tier.
      </p>

      {!configured && (
        <p className="mt-8 rounded-lg border border-tombstone-gold/40 bg-tombstone-gold/10 p-4 text-sm text-tombstone-dark/80">
          The stamp program isn&apos;t live yet — check back soon.
        </p>
      )}

      {configured && loading && <p className="mt-8 text-sm text-tombstone-dark/60">Loading…</p>}

      {configured && !loading && !user && (
        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-tombstone-dark/75">
            Sign in with your email to open your passport. No password — we&apos;ll send you
            a magic link.
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
        <>
          <div className="mt-8 flex items-center justify-between rounded-lg bg-tombstone-light p-4">
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

          {/* Progress */}
          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-xl font-bold text-tombstone-dark">
                {count} of {COMPLETE} stamps
              </p>
              <p className="text-xs uppercase tracking-widest text-tombstone-dark/50">
                {count >= COMPLETE
                  ? "Passport complete"
                  : count >= HALFWAY
                    ? "Halfway milestone reached"
                    : `${HALFWAY - count} to your first milestone`}
              </p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full bg-tombstone-red transition-all"
                style={{ width: `${Math.min(100, (count / COMPLETE) * 100)}%` }}
              />
            </div>
          </div>

          {/* Stamp grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {slots.map((stamp, i) => (
              <div
                key={i}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 p-2 text-center ${
                  stamp
                    ? "border-tombstone-red/60 bg-tombstone-red/5"
                    : "border-dashed border-black/15 bg-white"
                }`}
              >
                {stamp ? (
                  <>
                    <span className="text-3xl">🤠</span>
                    <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-tight text-tombstone-dark">
                      {businessName(stamp.business_id)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-tombstone-dark/50">
                      {new Date(stamp.created_at).toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <span className="text-2xl text-black/15">{i + 1}</span>
                )}
              </div>
            ))}
          </div>

          {/* Rewards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div
              className={`rounded-2xl border-2 p-6 ${
                count >= HALFWAY
                  ? "border-tombstone-gold bg-tombstone-gold/10"
                  : "border-black/10 bg-white"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-tombstone-gold">
                {HALFWAY}-Stamp Milestone {count >= HALFWAY ? "· Unlocked ✓" : ""}
              </p>
              <p className="mt-2 font-display text-lg font-bold text-tombstone-dark">
                Halfway There
              </p>
              <p className="mt-1 text-sm text-tombstone-dark/70">
                A digital badge on your passport and a partner discount code to keep you
                exploring.
              </p>
            </div>
            <div
              className={`rounded-2xl border-2 p-6 ${
                count >= COMPLETE
                  ? "border-tombstone-red bg-tombstone-red/5"
                  : "border-black/10 bg-white"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-tombstone-red">
                {COMPLETE}-Stamp Reward {count >= COMPLETE ? "· Unlocked ✓" : ""}
              </p>
              <p className="mt-2 font-display text-lg font-bold text-tombstone-dark">
                Passport Complete
              </p>
              <ul className="mt-2 space-y-1 text-sm text-tombstone-dark/70">
                <li>👕 Passport to Tombstone t-shirt</li>
                <li>🍰 Free dessert at a partner restaurant</li>
                <li>🏨 Lodging discount on your next stay</li>
                <li>🎁 Entry into the monthly experience giveaway</li>
              </ul>
            </div>
          </div>

          {count >= COMPLETE && (
            <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-4 text-sm text-green-800">
              🎉 Your passport is complete! Watch your inbox — we&apos;ll email you how to
              claim your rewards.
            </p>
          )}

          <p className="mt-10 text-xs text-tombstone-dark/50">
            Looking for stamp locations? Ask at any participating business, or start with
            the <Link href="/attractions" className="underline">attractions</Link> along
            Allen Street.
          </p>
        </>
      )}
    </section>
  );
}
