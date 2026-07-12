import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-tombstone-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-white">
            Passport to <span className="text-tombstone-gold">Tombstone</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-white/60">
            A town too tough to die. Bring your people here — we&apos;ll host them right.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/lodging" className="hover:text-white">Lodging</Link></li>
            <li><Link href="/dining" className="hover:text-white">Dining</Link></li>
            <li><Link href="/attractions" className="hover:text-white">Attractions</Link></li>
            <li><Link href="/shopping" className="hover:text-white">Shopping</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/calendar" className="hover:text-white">Events Calendar</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Business</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/events" className="hover:text-white">Bring Your Event Here</Link></li>
            <li><Link href="/partnerships" className="hover:text-white">Partnerships & Pricing</Link></li>
          </ul>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/50">Follow</p>
          <ul className="mt-3 flex gap-4 text-sm">
            <li><a href="#" className="hover:text-white">Instagram</a></li>
            <li><a href="#" className="hover:text-white">Facebook</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/40 sm:px-6">
        © {new Date().getFullYear()} Passport to Tombstone. All rights reserved.
      </div>
    </footer>
  );
}
