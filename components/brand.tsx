"use client";

import { familyLogos, logos } from "@/lib/brand";
import { MISSION, MISSION_MEANING } from "@/components/mission";
import { useApp } from "@/lib/store";
import type { FamilyId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Wordmark({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const src = tone === "dark" ? logos.wordmarkDark : logos.wordmarkLight;
  return (
    <img
      src={src}
      alt="Dental Practice Copilot"
      className={cn("h-8 w-auto", className)}
    />
  );
}

export function CopilotMark({
  tone = "color",
  className,
}: {
  tone?: "color" | "white";
  className?: string;
}) {
  return (
    <img
      src={tone === "white" ? logos.markWhite : logos.markColor}
      alt=""
      className={cn("h-7 w-7 object-contain", className)}
    />
  );
}

export function FamilyLogo({
  family,
  className,
}: {
  family: FamilyId;
  className?: string;
}) {
  const logo = familyLogos[family];
  if (!logo) {
    return <CopilotMark className={cn("h-8 w-8", className)} />;
  }
  return (
    <img
      src={logo.src}
      alt={logo.alt}
      className={cn("h-8 w-auto max-w-[148px] object-contain object-left", className)}
    />
  );
}

export function Lockup({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const ink = tone === "dark" ? "text-white" : "text-dpcp-navy";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <CopilotMark tone={tone === "dark" ? "white" : "color"} className="h-9 w-9" />
      <span className={cn("font-heading text-[13px] leading-[1.15] font-semibold tracking-tight", ink)}>
        <span className="block">Dental Practice</span>
        <span className="block">Copilot OS</span>
      </span>
    </span>
  );
}

export function DepartmentMark({
  departmentId,
  family,
  name,
  className,
}: {
  departmentId: string;
  family: FamilyId;
  name?: string;
  className?: string;
}) {
  if (departmentId === "operations") {
    return (
      <span
        className={cn(
          "inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-dpcp-navy px-2 font-heading text-[11px] font-semibold tracking-wide text-white",
          className
        )}
      >
        {name ?? "Ops"}
      </span>
    );
  }
  return <FamilyLogo family={family} className={className} />;
}

export function ProductFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-16 flex flex-col items-center gap-2 px-4 pt-10 pb-4 text-center", className)}>
      <CopilotMark className="h-8 w-8" />
      <p className="font-heading text-sm font-semibold tracking-tight text-dpcp-navy">Dental Practice Copilot OS</p>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{MISSION}</p>
      <p className="max-w-md text-xs text-muted-foreground">{MISSION_MEANING}</p>
      <FeedbackLink />
    </footer>
  );
}

function FeedbackLink() {
  const app = useApp();
  return (
    <button type="button" className="mt-2 text-xs text-dpcp-blue" onClick={() => app.setFeedbackOpen(true)}>
      Feedback on DPCP OS
    </button>
  );
}

export function HbsFooter() {
  return <ProductFooter />;
}
