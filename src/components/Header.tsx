"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/story", label: "The Story" },
  { href: "/lodging", label: "Lodging" },
  { href: "/dining", label: "Dining" },
  { href: "/attractions", label: "Attractions" },
  { href: "/shopping", label: "Shopping" },
  { href: "/services", label: "Services" },
  { href: "/calendar", label: "Calendar" },
  { href: "/passport", label: "My Passport" },
  { href: "/live", label: "Live Here" },
  { href: "/events", label: "Bring Your Event Here" },
  { href: "/partnerships", label: "Partner With Us" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-tombstone-light/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-lg font-bold text-tombstone-navy sm:text-xl" onClick={() => setOpen(false)}>
          Passport to <span className="text-tombstone-red">Tombstone</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-tombstone-dark transition hover:text-tombstone-red"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            className="rounded-full border border-tombstone-navy/30 px-3 py-1 text-sm font-medium text-tombstone-navy transition hover:bg-tombstone-navy hover:text-white"
          >
            Account
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
        >
          <span className={`h-0.5 w-6 bg-tombstone-dark transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-tombstone-dark transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-tombstone-dark transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/10 bg-tombstone-light px-4 pb-4 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-sm font-medium text-tombstone-dark hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="rounded px-2 py-2 text-sm font-medium text-tombstone-dark hover:bg-black/5"
          >
            Account
          </Link>
        </nav>
      )}
    </header>
  );
}
