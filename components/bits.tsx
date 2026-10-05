import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import type { Tone } from "@/lib/types";
import { cn } from "@/lib/utils";

const tones: Record<Tone, string> = {
  green: "bg-status-green-bg text-status-green",
  amber: "bg-status-amber-bg text-status-amber",
  red: "bg-status-red-bg text-status-red",
  blue: "bg-status-blue-bg text-status-blue",
  neutral: "bg-status-neutral-bg text-status-neutral",
};

export function StatusTag({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  max,
  tone = "green",
}: {
  value: number;
  max: number;
  tone?: "green" | "amber";
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#e6e8ec]">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-200",
          tone === "amber" ? "bg-status-amber" : "bg-status-green"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-[#e4e6ea]", className)} />;
}

export function ErrorState({ message }: { message: string }) {
  const { setScreenState } = useApp();
  return (
    <div className="rounded-[14px] border border-border bg-card p-8">
      <p className="text-sm text-foreground">{message}</p>
      <Button className="mt-4" onClick={() => setScreenState("ready")}>
        Try again
      </Button>
    </div>
  );
}

export function LoadingBlock() {
  return (
    <div className="space-y-4">
      <Bone className="h-6 w-48" />
      <Bone className="h-4 w-72" />
      <Bone className="h-56 w-full rounded-[14px]" />
      <div className="grid gap-3 md:grid-cols-3">
        <Bone className="h-24 rounded-[14px]" />
        <Bone className="h-24 rounded-[14px]" />
        <Bone className="h-24 rounded-[14px]" />
      </div>
    </div>
  );
}

export function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function Surface({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("rounded-3xl bg-card p-5 shadow-[0_8px_30px_rgba(18,59,120,0.06)] md:p-6", className)}>
      {children}
    </section>
  );
}
