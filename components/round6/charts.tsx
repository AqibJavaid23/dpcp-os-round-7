"use client";

export function Ring({
  value,
  center,
  caption,
  color = "#123B78",
  size = 96,
}: {
  value: number;
  center: string;
  caption?: string;
  color?: string;
  size?: number;
}) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * circ;
  return (
    <figure className="flex flex-col items-center text-center">
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={caption ? `${caption} ${center}` : center}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#E7EEF6" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="54" textAnchor="middle" fontSize="13" fontFamily="Montserrat, sans-serif" fill="#123B78">
          {center}
        </text>
      </svg>
      {caption && <figcaption className="mt-1 max-w-[9rem] text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function Bars({
  rows,
  max,
}: {
  rows: { label: string; value: number; color: string }[];
  max?: number;
}) {
  const top = max ?? Math.max(...rows.map((row) => row.value), 1);
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex justify-between text-xs text-muted-foreground">
            <span>{row.label}</span>
            <span>{row.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-[#E7EEF6]">
            <div className="h-2.5 rounded-full" style={{ width: `${Math.max(6, (row.value / top) * 100)}%`, background: row.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Trend({ values, color = "#0081CE" }: { values: number[]; color?: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 28 - ((value - min) / span) * 24;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 32" className="h-10 w-full" aria-hidden>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
}
