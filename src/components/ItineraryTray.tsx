"use client";

import { useState } from "react";
import { useItinerary } from "@/lib/itinerary-context";

export default function ItineraryTray() {
  const { items, remove, clear, isOpen, setOpen } = useItinerary();
  const [shareState, setShareState] = useState<
    { status: "idle" } | { status: "loading" } | { status: "done"; url: string } | { status: "error"; message: string }
  >({ status: "idle" });

  async function handleShare() {
    setShareState({ status: "loading" });
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create a share link.");
      setShareState({ status: "done", url: `${window.location.origin}/trip/${data.share_slug}` });
    } catch (err) {
      setShareState({
        status: "error",
        message: err instanceof Error ? err.message : "Could not create a share link.",
      });
    }
  }

  if (items.length === 0 && !isOpen) return null;

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-tombstone-red px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-[#b8532e]"
        >
          🧭 My Trip
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-tombstone-red">
            {items.length}
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex max-h-[70vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-tombstone-dark/10 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-tombstone-dark/10 bg-tombstone-navy px-4 py-3">
            <h2 className="font-display text-base font-semibold text-white">My Tombstone Trip</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close trip tray"
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {items.length === 0 ? (
              <p className="p-4 text-center text-sm text-tombstone-dark/60">
                Nothing added yet. Tap &ldquo;Add to Trip&rdquo; on any business, event, or ask
                the concierge to build one for you.
              </p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-2 rounded-lg bg-tombstone-light p-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-tombstone-dark">{item.name}</p>
                      <p className="text-xs text-tombstone-dark/60">{item.note || item.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="shrink-0 text-tombstone-red/70 hover:text-tombstone-red"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-tombstone-dark/10 p-3">
              {shareState.status === "done" ? (
                <div className="rounded-lg bg-tombstone-gold/15 p-2.5 text-xs text-tombstone-dark">
                  <p className="font-semibold">Share link ready:</p>
                  <a
                    href={shareState.url}
                    className="break-all text-tombstone-navy underline"
                  >
                    {shareState.url}
                  </a>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={shareState.status === "loading"}
                  className="w-full rounded-md bg-tombstone-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b8532e] disabled:opacity-60"
                >
                  {shareState.status === "loading" ? "Creating link…" : "Save & Get Share Link"}
                </button>
              )}
              {shareState.status === "error" && (
                <p className="mt-2 text-xs text-tombstone-red">{shareState.message}</p>
              )}
              <button
                type="button"
                onClick={clear}
                className="mt-2 w-full text-center text-xs text-tombstone-dark/50 hover:text-tombstone-dark"
              >
                Clear trip
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
