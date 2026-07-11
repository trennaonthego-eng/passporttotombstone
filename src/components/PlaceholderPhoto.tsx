const GRADIENTS = [
  "from-tombstone-navy to-tombstone-dark",
  "from-tombstone-red to-tombstone-navy",
  "from-tombstone-dark to-tombstone-red",
  "from-tombstone-navy via-tombstone-dark to-tombstone-red",
];

function hashSeed(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
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
  const gradient = GRADIENTS[hashSeed(seed) % GRADIENTS.length];
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(45deg,#fff_0,#fff_1px,transparent_1px,transparent_12px)]" />
      <span className="relative px-4 text-center font-display text-lg font-semibold tracking-wide text-white/90 drop-shadow">
        {label ?? seed}
      </span>
    </div>
  );
}
