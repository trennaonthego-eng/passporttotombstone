"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className={`text-sm font-medium ${dark ? "text-tombstone-gold" : "text-tombstone-navy"}`}>
        You&apos;re in. Welcome to the story.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full flex-1 rounded-md border border-black/15 bg-white px-4 py-2.5 text-sm text-tombstone-dark placeholder:text-tombstone-dark/40 focus:border-tombstone-red focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-md bg-tombstone-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-tombstone-red/90 disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Join the Story"}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-xs text-tombstone-red">{errorMessage}</p>}
    </div>
  );
}
