"use client";

import { copilotById } from "@/lib/round6/copilots";
import { cn } from "@/lib/utils";

/** Same mark, a distinct color per copilot. A later brand pass replaces the art. */
export function CopilotLogo({
  id,
  size = "md",
  labeled = false,
  className,
}: {
  id: string;
  size?: "sm" | "md" | "lg";
  labeled?: boolean;
  className?: string;
}) {
  const brand = copilotById(id);
  const box = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-11 w-11";
  const mark = size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6 w-6";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("inline-flex shrink-0 items-center justify-center rounded-2xl", box)} style={{ background: brand.color }} aria-hidden>
        <img src="/brand/logos/copilot-mark_icon_white.png" alt="" className={cn("object-contain", mark)} />
      </span>
      {labeled && (
        <span className="min-w-0 text-left">
          <span className="block font-heading text-sm leading-tight font-semibold text-dpcp-navy">{brand.name}</span>
        </span>
      )}
    </span>
  );
}
