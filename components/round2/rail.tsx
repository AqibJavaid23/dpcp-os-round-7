"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES, copilotsFor, copilotById } from "@/lib/round2/data";
import { useRound2 } from "@/lib/round2/context";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function BookToggle() {
  const r2 = useRound2();
  return (
    <div className="flex rounded-full bg-white p-1 text-sm shadow-sm">
      {(["hdg", "client"] as const).map((book) => (
        <button key={book} type="button" onClick={() => r2.setBook(book)} className={cn("rounded-full px-3 py-1", r2.book === book ? "bg-dpcp-navy text-white" : "text-muted-foreground")}>
          {book === "hdg" ? "HDG" : "Client"}
        </button>
      ))}
    </div>
  );
}

export function DeptRail() {
  const app = useApp();
  const list = copilotsFor(app.viewer.id, app.ui.role);
  if (app.ui.role === "owner") return null;
  return (
    <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-border bg-white px-3 py-4 lg:block">
      <p className="px-2 text-[11px] tracking-wide text-muted-foreground uppercase">Department</p>
      <div className="mt-2 space-y-1">
        {list.length === 0 && <p className="px-2 text-xs text-muted-foreground">No copilot on this login.</p>}
        {list.map((copilot) => (
          <Link key={copilot.id} href={`/copilot/${copilot.id}`} className="block rounded-2xl px-2 py-2 no-underline hover:bg-[#f6f7f9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={copilot.logo} alt={copilot.short} className="h-6 w-auto" />
          </Link>
        ))}
      </div>
      <RailModules />
    </aside>
  );
}

function RailModules() {
  const pathname = usePathname();
  const match = pathname.match(/\/copilot\/([^/]+)/);
  const found = match ? copilotById(match[1]) : undefined;
  const id = found?.id;
  if (!id) return null;
  return (
    <div className="mt-4 space-y-1">
      <a href={`/copilot/${id}/`} className="block rounded-xl px-2 py-1 text-xs text-dpcp-navy no-underline">
        Home
      </a>
      {MODULES[id].map((mod) => (
        <a key={mod.id} href={`/copilot/${id}/#${mod.id}`} className="block rounded-xl px-2 py-1 text-xs text-muted-foreground no-underline hover:text-dpcp-navy">
          {mod.name}
        </a>
      ))}
    </div>
  );
}
