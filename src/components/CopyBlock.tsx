"use client";

import { useState } from "react";

export default function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/http) — user can still select manually.
    }
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-tombstone-navy">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-tombstone-navy/30 px-3 py-1 text-xs font-semibold text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-tombstone-dark/85">{text}</p>
    </div>
  );
}
