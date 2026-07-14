"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { getSupabase } from "@/lib/supabase";

/** Landing page for a partner's stamp QR code: /stamp/{business_id}?t={token}.
 * Signed-in visitors get the stamp instantly; everyone else signs in with a
 * magic link that brings them right back here to finish the claim. */
function StampClaim() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const token = search.get("t") ?? "";
  const { user, loading, configured, signInWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [signInStatus, setSignInStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [signInError, setSignInError] = useState("");

  const [claim, setClaim] = useState<
    | { state: "pending" }
    | { state: "done"; businessName: string; total: number; halfway: number; complete: number }
    | { state: "error"; message: string }
  >({ state: "pending" });
  const claimed = useRef(false);

  useEffect(() => {
    if (!user || !configured || claimed.current) return;
    claimed.current = true;
    (async () => {
      const supabase = getSupabase()!;
      const { data } = await supabase.auth.getSession();
      const res = await fetch("/api/stamp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ business_id: params.id, token }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setClaim({ state: "error", message: payload.error ?? "Something went wrong." });
      } else {
        setClaim({
          state: "done",
          businessName: payload.business_name,
          total: payload.total,
          halfway: payload.milestones.halfway,
          complete: payload.milestones.complete,
        });
      }
    })();
  }, [user, configured, params.id, token]);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setSignInStatus("sending");
    // The default redirect goes to /account; we want the visitor to land back
    // on this exact stamp URL so the claim finishes automatically.
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href },
    });
    if (error) {
      setSignInStatus("error");
      setSignInError(error.message);
    } else {
      setSignInStatus("sent");
    }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-tombstone-red">
        Passport to Tombstone
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold text-tombstone-navy">Stamp Station</h1>

      {!configured && (
        <p className="mt-6 rounded-lg border border-tombstone-gold/40 bg-tombstone-gold/10 p-4 text-sm text-tombstone-dark/80">
          The stamp program isn&apos;t live yet — check back soon.
        </p>
      )}

      {configured && loading && <p className="mt-6 text-sm text-tombstone-dark/60">Loading…</p>}

      {configured && !loading && !user && (
        <div className="mt-6">
          <p className="text-sm text-tombstone-dark/75">
            You found a stamp! Sign in with your email to add it to your passport — no
            password, we&apos;ll send you a magic link that brings you right back here.
          </p>
          {signInStatus === "sent" ? (
            <p className="mt-4 rounded-lg bg-tombstone-navy/10 p-4 text-sm text-tombstone-navy">
              Check your inbox — tap the link we sent to {email} and your stamp will be
              waiting.
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
                disabled={signInStatus === "sending"}
                className="rounded-md bg-tombstone-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#b8532e] disabled:opacity-60"
              >
                {signInStatus === "sending" ? "Sending…" : "Send Magic Link"}
              </button>
            </form>
          )}
          {signInStatus === "error" && (
            <p className="mt-2 text-xs text-tombstone-red">{signInError}</p>
          )}
        </div>
      )}

      {configured && user && claim.state === "pending" && (
        <p className="mt-6 text-sm text-tombstone-dark/60">Stamping your passport…</p>
      )}

      {configured && user && claim.state === "error" && (
        <p className="mt-6 rounded-lg border border-tombstone-red/40 bg-tombstone-red/10 p-4 text-sm text-tombstone-red">
          {claim.message}
        </p>
      )}

      {configured && user && claim.state === "done" && (
        <div className="mt-8">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-tombstone-red/70 bg-tombstone-red/5">
            <span className="text-5xl">🤠</span>
          </div>
          <h2 className="mt-5 font-display text-2xl font-bold text-tombstone-dark">
            Stamped at {claim.businessName}!
          </h2>
          <p className="mt-2 text-sm text-tombstone-dark/70">
            {claim.total >= claim.complete
              ? "Your passport is complete — you've earned the full reward tier. 🎉"
              : claim.total >= claim.halfway
                ? `That's ${claim.total} of ${claim.complete} — past the halfway milestone. Keep going for the full rewards.`
                : `That's ${claim.total} of ${claim.complete} stamps. ${claim.halfway - claim.total > 0 ? `${claim.halfway - claim.total} more to your first reward.` : ""}`}
          </p>
          <Link
            href="/passport"
            className="mt-6 inline-block rounded-full bg-tombstone-navy px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-tombstone-dark"
          >
            View My Passport
          </Link>
        </div>
      )}
    </section>
  );
}

export default function StampPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-sm text-tombstone-dark/60">Loading…</p>}>
      <StampClaim />
    </Suspense>
  );
}
