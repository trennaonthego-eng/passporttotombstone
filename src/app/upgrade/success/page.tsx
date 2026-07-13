import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're Upgraded",
  description: "Thanks for partnering with Passport to Tombstone.",
  robots: { index: false },
};

export default function UpgradeSuccessPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-5xl">🤠</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-tombstone-navy sm:text-4xl">
        Thanks — you&apos;re all set.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base text-tombstone-dark/75">
        Your payment went through. We&apos;re finishing setup on our end — your upgraded
        badge and placement appear on the site within a few minutes. A receipt is on its
        way to your email from Stripe.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-tombstone-red px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#b8532e]"
        >
          Back to the Homepage
        </Link>
        <Link
          href="/partnerships"
          className="rounded-full border border-tombstone-navy px-8 py-3 text-sm font-semibold uppercase tracking-widest text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
        >
          View Partnership Tiers
        </Link>
      </div>
    </section>
  );
}
