type LogoVariant = "fine" | "compact";

const FINE = {
  stroke: 5.5,
  muted: [
    "M53.95 33.53 A22 22 0 0 1 40.24 52.40",
    "M37.32 53.35 A22 22 0 0 1 15.15 46.14",
    "M13.34 43.66 A22 22 0 0 1 13.34 20.34",
    "M15.15 17.86 A22 22 0 0 1 37.32 10.65",
  ],
  active: "M40.24 11.60 A22 22 0 0 1 53.95 30.47",
};

const COMPACT = {
  stroke: 7,
  muted: [
    "M53.52 27.43 A22 22 0 0 1 46.72 48.35",
    "M43.00 51.05 A22 22 0 0 1 21.00 51.05",
    "M17.28 48.35 A22 22 0 0 1 10.48 27.43",
    "M11.90 23.05 A22 22 0 0 1 29.70 10.12",
  ],
  active: "M34.30 10.12 A22 22 0 0 1 52.10 23.05",
};

export default function Logo({
  size = 26,
  idPrefix = "logo",
  variant = "fine",
}: {
  size?: number;
  idPrefix?: string;
  variant?: LogoVariant;
}) {
  const glowId = `${idPrefix}-glow`;
  const sweepId = `${idPrefix}-sweep`;
  const { stroke, muted, active } = variant === "compact" ? COMPACT : FINE;

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={sweepId} x1="32" y1="32" x2="52" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2DE37B" stopOpacity="0" />
          <stop offset="1" stopColor="#2DE37B" stopOpacity=".45" />
        </linearGradient>
      </defs>
      <path d="M32 32 L46.8 9.6 A27 27 0 0 1 56.6 22.4 Z" fill={`url(#${sweepId})`} />
      <g className="logo-muted" strokeWidth={stroke} strokeLinecap="round">
        {muted.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path
        className="logo-active"
        d={active}
        strokeWidth={stroke}
        strokeLinecap="round"
        filter={`url(#${glowId})`}
      />
      <circle className="logo-dot" cx="32" cy="32" r="3.4" filter={`url(#${glowId})`} />
    </svg>
  );
}
