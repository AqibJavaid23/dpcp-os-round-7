"use client";

import { useState, type ReactNode } from "react";
import { ErrorState, LoadingBlock, StatusTag, Surface } from "@/components/bits";
import { useApp } from "@/lib/store";
import { relatedSop } from "@/lib/round3/knowledge";
import type { Band } from "@/lib/round3/balance";
import { cn } from "@/lib/utils";

export function Gate({ children, empty }: { children: ReactNode; empty?: ReactNode }) {
  const app = useApp();
  if (app.ui.screenState === "loading") return <LoadingBlock />;
  if (app.ui.screenState === "error") return <ErrorState message="This page didn't load. Try again." />;
  if (app.ui.screenState === "offline") {
    return (
      <div className="space-y-3">
        <p className="rounded-2xl bg-status-amber-bg px-4 py-3 text-sm text-status-amber">You're offline. You can read what was already on this screen. Sending waits until you're back.</p>
        {children}
      </div>
    );
  }
  if (app.ui.screenState === "paused") {
    return (
      <div className="space-y-3">
        <p className="rounded-2xl bg-status-blue-bg px-4 py-3 text-sm text-status-blue">AI is paused. The lists and the work you do yourself are still here.</p>
        {children}
      </div>
    );
  }
  if (app.ui.screenState === "empty") {
    return (
      empty ?? (
        <Surface>
          <p className="font-heading text-xl text-dpcp-navy">Nothing here yet</p>
          <p className="mt-2 text-sm text-muted-foreground">When the next item arrives, it will show up in this spot.</p>
        </Surface>
      )
    );
  }
  return <>{children}</>;
}

export function BandPill({ band }: { band: Band | "watch" }) {
  if (band === "green") return <StatusTag tone="green">On target</StatusTag>;
  if (band === "amber" || band === "watch") return <StatusTag tone="amber">{band === "watch" ? "Watch" : "Monitor"}</StatusTag>;
  if (band === "red") return <StatusTag tone="red">Action</StatusTag>;
  if (band === "diagnostic") return <StatusTag>Diagnostic</StatusTag>;
  return <StatusTag>Not scored</StatusTag>;
}

export function Mark({ band }: { band: Band }) {
  if (band === "green") return <span className="text-status-green">✓</span>;
  if (band === "amber") return <span className="text-status-amber">!</span>;
  if (band === "red") return <span className="text-status-red">✗</span>;
  if (band === "diagnostic") return <span className="text-muted-foreground">·</span>;
  return <span className="text-muted-foreground">—</span>;
}

export function AiHuman({ ai }: { ai: boolean }) {
  return ai ? <StatusTag tone="blue">Done by AI</StatusTag> : <StatusTag tone="amber">Needs a human</StatusTag>;
}

export function DraftLabel() {
  return <span className="text-[11px] text-status-blue">Drafted by AI</span>;
}

export function SampleBanner() {
  return <p className="text-xs text-muted-foreground">Sample data. Real feeds come later. Names and numbers are fictional.</p>;
}

export function Segmented({ value, options, onChange }: { value: string; options: { id: string; label: string }[]; onChange: (id: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full bg-muted p-1">
      {options.map((option) => (
        <button key={option.id} type="button" onClick={() => onChange(option.id)} className={cn("min-h-11 rounded-full px-3 text-sm", value === option.id ? "bg-white font-medium text-dpcp-navy shadow-sm" : "text-muted-foreground")}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="r3-motion fixed inset-0 z-50 flex items-end justify-center bg-black/30" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0" aria-label="Close" onClick={onClose} />
      <div className="relative max-h-[88dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-card p-5 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="font-heading text-xl text-dpcp-navy">{title}</h2>
          <button type="button" className="min-h-11 text-sm text-dpcp-blue" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Spark({ values, good }: { values: number[]; good?: "up" | "down" }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const d = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 96 + 2;
      const y = 28 - ((value - min) / span) * 24;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const rising = values[values.length - 1] >= values[0];
  const tone = good === "down" ? !rising : rising;
  return (
    <svg viewBox="0 0 100 32" className="h-8 w-24" aria-hidden>
      <path d={d} fill="none" stroke={tone ? "#157a45" : "#c4322b"} strokeWidth="2" />
    </svg>
  );
}

export function SopChip({ text }: { text: string }) {
  const sop = relatedSop(text);
  if (!sop) return <span className="text-xs text-muted-foreground">No SOP yet. Create one?</span>;
  return (
    <a href={`/knowledge/#${sop.id}`} className="inline-flex min-h-8 items-center rounded-full bg-dpcp-tint/40 px-3 text-xs text-dpcp-navy no-underline">
      Related SOP · {sop.title}
    </a>
  );
}

export function UndoToast({ text, onUndo }: { text: string; onUndo: () => void }) {
  const [hidden, setHidden] = useState(false);
  if (hidden || !text) return null;
  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-dpcp-navy-deep px-4 py-2 text-sm text-white">
      <span>{text}</span>
      <button
        type="button"
        className="font-medium underline"
        onClick={() => {
          onUndo();
          setHidden(true);
        }}
      >
        Undo
      </button>
    </div>
  );
}

export function Suggest({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-status-blue-bg px-3 py-1 text-xs text-status-blue">
          Suggested · {item}
        </span>
      ))}
    </div>
  );
}
