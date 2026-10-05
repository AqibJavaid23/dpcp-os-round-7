import { PILLARS } from "@/lib/culture";
import type { Pillar } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PillarIcon({ pillar, className }: { pillar: Pillar; className?: string }) {
  const common = cn("h-4 w-4", className);
  if (pillar === "intelligence") {
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden>
        <circle cx="8" cy="8" r="2.2" fill="currentColor" />
        <path d="M8 1.5v2.2M8 12.3v2.2M1.5 8h2.2M12.3 8h2.2M3.2 3.2l1.6 1.6M11.2 11.2l1.6 1.6M12.8 3.2l-1.6 1.6M4.8 11.2l-1.6 1.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (pillar === "energy") {
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden>
        <path d="M9 1.5 4 9h3.2L6.5 14.5 12 7H8.6L9 1.5Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className={common} aria-hidden>
      <path d="M8 1.8 13 4v4.2c0 3-2.1 4.7-5 5.8-2.9-1.1-5-2.8-5-5.8V4L8 1.8Z" fill="currentColor" />
    </svg>
  );
}

export function PillarTag({ pillar, className }: { pillar: Pillar; className?: string }) {
  const meta = PILLARS[pillar];
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", className)}
      style={{ background: meta.soft, color: meta.color }}
    >
      <PillarIcon pillar={pillar} />
      {meta.label}
    </span>
  );
}

export function PillarTrio() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {(Object.keys(PILLARS) as Pillar[]).map((pillar) => {
        const meta = PILLARS[pillar];
        return (
          <div key={pillar} className="rounded-2xl p-4" style={{ background: meta.soft }}>
            <span style={{ color: meta.color }}>
              <PillarIcon pillar={pillar} className="h-6 w-6" />
            </span>
            <p className="font-heading mt-3 text-lg" style={{ color: meta.color }}>
              {meta.label}
            </p>
            <p className="mt-1 text-sm text-dpcp-navy">{meta.line}</p>
            <p className="mt-2 text-sm leading-relaxed text-dpcp-navy">{meta.definition}</p>
            <ul className="mt-2 space-y-1 text-xs text-dpcp-navy/80">
              {meta.examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
