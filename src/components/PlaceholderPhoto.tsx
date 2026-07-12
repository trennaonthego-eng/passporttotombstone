/**
 * Deterministic desert-scene artwork used in place of photography until real
 * images are added. Each seed gets its own composition — time of day, sun
 * position, and ridge lines all derive from a hash of the seed — so cards feel
 * individual while sharing one visual language.
 */

interface Palette {
  skyTop: string;
  skyBottom: string;
  sun: string;
  ridges: [string, string, string];
}

// Dawn, dusk, and night over the high desert — all inside the site palette.
const PALETTES: Palette[] = [
  { skyTop: "#EFE3C8", skyBottom: "#D9A96E", sun: "#C1993F", ridges: ["#8A5A33", "#5C3B22", "#3A2A1C"] },
  { skyTop: "#E8C99B", skyBottom: "#B96F42", sun: "#EED9A8", ridges: ["#7A4A2A", "#552F1B", "#33241A"] },
  { skyTop: "#4A3826", skyBottom: "#2B211A", sun: "#E9D8B0", ridges: ["#241B14", "#1D150F", "#150F0B"] },
  { skyTop: "#E3D3B3", skyBottom: "#C08653", sun: "#D9B267", ridges: ["#6E4226", "#4C2F1C", "#2F211A"] },
];

function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Small deterministic PRNG so ridge lines are unique per seed but stable.
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ridgePath(rand: () => number, baseY: number, amp: number): string {
  const W = 400;
  const H = 225;
  const segments = 6 + Math.floor(rand() * 3);
  let d = `M0,${H} L0,${(baseY + (rand() - 0.5) * amp).toFixed(1)}`;
  for (let i = 1; i <= segments; i++) {
    const x = (W / segments) * i;
    const y = baseY + (rand() - 0.5) * amp * 2;
    const cx = x - W / segments / 2;
    const cy = baseY + (rand() - 0.5) * amp * 2.4;
    d += ` Q${cx.toFixed(1)},${cy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
  }
  d += ` L${W},${H} Z`;
  return d;
}

export default function PlaceholderPhoto({
  seed,
  label,
  className = "",
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  const hash = hashSeed(seed);
  const palette = PALETTES[hash % PALETTES.length];
  const rand = mulberry32(hash);
  const sunX = 60 + rand() * 280;
  const sunY = 45 + rand() * 60;
  const sunR = 16 + rand() * 14;
  const isNight = palette === PALETTES[2];
  const gid = `sky-${hash.toString(36)}`;

  const ridges = [
    ridgePath(rand, 120, 22),
    ridgePath(rand, 150, 18),
    ridgePath(rand, 180, 14),
  ];

  const stars = isNight
    ? Array.from({ length: 18 }, () => ({
        x: rand() * 400,
        y: rand() * 100,
        r: 0.6 + rand() * 0.9,
      }))
    : [];

  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 400 225"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.skyTop} />
            <stop offset="100%" stopColor={palette.skyBottom} />
          </linearGradient>
        </defs>
        <rect width="400" height="225" fill={`url(#${gid})`} />
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#EFE3C8" opacity="0.8" />
        ))}
        <circle cx={sunX} cy={sunY} r={sunR} fill={palette.sun} opacity={isNight ? 0.95 : 0.9} />
        <circle cx={sunX} cy={sunY} r={sunR * 2.2} fill={palette.sun} opacity="0.12" />
        <path d={ridges[0]} fill={palette.ridges[0]} />
        <path d={ridges[1]} fill={palette.ridges[1]} />
        <path d={ridges[2]} fill={palette.ridges[2]} />
      </svg>
      {label && (
        <span className="absolute bottom-3 left-4 border-t border-tombstone-gold/70 pt-1.5 font-display text-sm font-semibold tracking-wide text-white/95 drop-shadow">
          {label}
        </span>
      )}
    </div>
  );
}
