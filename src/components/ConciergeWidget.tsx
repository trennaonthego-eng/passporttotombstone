"use client";

import { useState, type FormEvent } from "react";
import type { ItineraryItem } from "@/lib/types";
import { useItinerary } from "@/lib/itinerary-context";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  suggestions?: ItineraryItem[];
}

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Howdy — I'm the Passport concierge. Tell me what you're after (lodging, saloons, gunfights, an event venue, whatever) and I'll pull real Tombstone spots and help build your trip.",
};

export default function ConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { add, has } = useItinerary();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: nextMessages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .slice(-8)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, suggestions: data.suggestions },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? `Sorry — ${err.message}`
              : "Sorry, something went wrong on my end.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-tombstone-navy px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30 transition hover:bg-[#2a1e15]"
        >
          💬 Ask the Concierge
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 left-5 z-40 flex max-h-[70vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-tombstone-dark/10 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-tombstone-dark/10 bg-tombstone-navy px-4 py-3">
            <h2 className="font-display text-base font-semibold text-white">Tombstone Concierge</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close concierge"
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <p
                  className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-left text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-tombstone-red text-white"
                      : "bg-tombstone-light text-tombstone-dark"
                  }`}
                >
                  {m.content}
                </p>
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {m.suggestions.map((s) => {
                      const added = has(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          disabled={added}
                          onClick={() => add(s)}
                          className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition ${
                            added
                              ? "border-tombstone-gold/40 bg-tombstone-gold/10 text-tombstone-dark/60"
                              : "border-tombstone-navy/20 text-tombstone-navy hover:bg-tombstone-navy hover:text-white"
                          }`}
                        >
                          <span className="truncate">{s.name}</span>
                          <span className="shrink-0 pl-2">{added ? "✓" : "+ Add"}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
            {loading && <p className="text-xs text-tombstone-dark/50">Thinking…</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-tombstone-dark/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Where should I stay?"
              className="flex-1 rounded-md border border-black/15 px-3 py-2 text-sm focus:border-tombstone-red focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md bg-tombstone-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b8532e] disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
