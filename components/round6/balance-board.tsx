"use client";

import { useState } from "react";
import { EXPLAINER, METRICS, PARTS, evaluate, formatValue, monthLabel, monthsFor, type Band } from "@/lib/round3/balance";
import { assessmentFor, sparkFor, useRound3 } from "@/lib/round3/store";
import { Sheet } from "@/components/round3/ui";
import { Trend } from "@/components/round6/charts";
import { cn } from "@/lib/utils";

const BAND_COLOR: Record<Band, string> = {
  green: "#157a45",
  amber: "#8a5a00",
  red: "#c4322b",
  diagnostic: "#0081CE",
  na: "#8aa0b8",
};

function bandFill(band: Band) {
  if (band === "green") return 88;
  if (band === "amber") return 62;
  if (band === "red") return 34;
  if (band === "diagnostic") return 50;
  return 8;
}

export function BalanceBoard({ practiceId, onMetric, onHelp }: { practiceId: string; onMetric: (id: string) => void; onHelp: (id: string) => void }) {
  const r3 = useRound3();
  const month = assessmentFor(practiceId, r3.month, r3.overrides);
  const evaled = evaluate(month);
  const [guide, setGuide] = useState(false);
  const [partId, setPartId] = useState<number | null>(evaled.priority.part);
  const priority = evaled.priority;
  const focus = priority.metric ? METRICS.find((metric) => metric.id === priority.metric) : null;
  const spark = focus ? sparkFor(practiceId, focus.id, r3.overrides) : [];
  const strip = monthsFor(practiceId).slice(-6);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-heading text-2xl text-dpcp-navy">Balance Assessment</h2>
        <button type="button" className="text-sm text-dpcp-blue" onClick={() => setGuide(true)}>
          How to read this
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {PARTS.map((part) => {
          const band = evaled.byPart[part.id];
          const hot = priority.part === part.id;
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => setPartId(part.id)}
              className={cn("rounded-3xl bg-white p-3 text-left shadow-[0_8px_30px_rgba(18,59,120,0.05)]", hot && "ring-2 ring-dpcp-blue")}
            >
              <Gauge value={bandFill(band)} color={BAND_COLOR[band]} label={band === "green" ? "On" : band === "amber" ? "Watch" : band === "red" ? "Act" : "—"} />
              <p className="mt-2 text-sm font-medium text-dpcp-navy">Part {part.id}</p>
              <p className="text-xs text-muted-foreground">{part.name}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {evaled.counts[part.id].green} on target · {evaled.counts[part.id].amber} close · {evaled.counts[part.id].red} below
              </p>
            </button>
          );
        })}
      </div>

      {focus && (
        <div className="mt-4 rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(18,59,120,0.05)]">
          <p className="text-xs tracking-wide text-muted-foreground uppercase">{priority.mode === "watch" ? "Watch" : "This month"}</p>
          <p className="font-heading mt-1 text-xl text-dpcp-navy">{focus.name}</p>
          <p className="font-heading text-3xl text-dpcp-navy">{formatValue(focus.id, month.values[focus.id])}</p>
          <Trend values={spark} color={BAND_COLOR[evaled.byMetric[focus.id]]} />
          <div className="mt-2 flex flex-wrap gap-3">
            <button type="button" className="text-sm text-dpcp-blue" onClick={() => onMetric(focus.id)}>
              Open the reading
            </button>
            <button type="button" className="text-sm text-dpcp-blue" onClick={() => onHelp(focus.id)}>
              Get DPCP help
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs text-muted-foreground">Six months, this office only</p>
        <div className="mt-2 flex gap-3 overflow-x-auto">
          {strip.map((row) => {
            const result = evaluate(assessmentFor(practiceId, row.month, r3.overrides));
            return (
              <div key={row.month} className="text-center">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((part) => (
                    <span key={part} className="h-3 w-3 rounded-full" style={{ background: BAND_COLOR[result.byPart[part]] }} title={`Part ${part}`} />
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{monthLabel(row.month).split(" ")[0]}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {METRICS.filter((metric) => (partId ? metric.part === partId : true)).map((metric) => {
          const band = evaled.byMetric[metric.id];
          return (
            <button key={metric.id} type="button" onClick={() => onMetric(metric.id)} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left">
              <Gauge value={bandFill(band)} color={BAND_COLOR[band]} label={formatValue(metric.id, month.values[metric.id]).replace("Insurance ", "").slice(0, 6)} size={64} />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-dpcp-navy">{metric.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{metric.id}</span>
              </span>
            </button>
          );
        })}
      </div>

      <Sheet open={guide} title="How to read this" onClose={() => setGuide(false)}>
        <p className="text-sm">{EXPLAINER}</p>
        <p className="mt-3 text-sm text-muted-foreground">Green is on target. Amber is close. Red needs a plan. This office is compared with itself. There is no ranking.</p>
        <p className="mt-3 text-sm">Open any scorecard for the formula, the source, and what to do when it is red.</p>
      </Sheet>
    </div>
  );
}

function Gauge({ value, color, label, size = 84 }: { value: number; color: string; label: string; size?: number }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const dash = (Math.max(0, Math.min(100, value)) / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r={radius} fill="none" stroke="#E7EEF6" strokeWidth="8" />
      <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${dash} ${circ - dash}`} transform="rotate(-90 50 50)" />
      <text x="50" y="54" textAnchor="middle" fontSize="11" fontFamily="Montserrat, sans-serif" fill="#123B78">
        {label}
      </text>
    </svg>
  );
}
