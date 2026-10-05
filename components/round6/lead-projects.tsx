"use client";

import { useState } from "react";
import { TEAM_PROJECTS } from "@/lib/round4/data";
import { cn } from "@/lib/utils";

const EXTRA = [
  { id: "p-over", team: "Insurance", name: "Lakeview filing follow-up", owner: "Nadia Reyes", status: "Overdue", next: "Send the count", blocker: "Waiting on a scan", due: "Oct 16" },
];

const LOAD = [
  { name: "Omar Hale", items: 5 },
  { name: "Nadia Reyes", items: 8 },
  { name: "Imran Cole", items: 4 },
  { name: "Leila Okonkwo", items: 6 },
  { name: "Jonas Keller", items: 3 },
  { name: "Amina Farouk", items: 4 },
];

function tone(status: string) {
  if (status === "Overdue" || status === "Blocked") return "text-status-red";
  if (status === "Needs you") return "text-status-amber";
  return "text-status-green";
}

export function LeadProjects() {
  const [mode, setMode] = useState<"board" | "list">("board");
  const projects = [...EXTRA, ...TEAM_PROJECTS];
  const columns = ["On track", "Due soon", "Blocked", "Overdue"];
  const columnOf = (status: string) => {
    if (status === "Overdue") return "Overdue";
    if (status === "Blocked") return "Blocked";
    if (status === "Needs you") return "Due soon";
    return "On track";
  };

  return (
    <section className="mb-8" aria-label="Projects">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl text-dpcp-navy">Projects</h2>
          <p className="text-sm text-muted-foreground">A first board for the lead. The full spec is still open.</p>
        </div>
        <div className="flex rounded-full bg-white p-1 text-sm">
          <button type="button" className={cn("rounded-full px-3 py-1", mode === "board" && "bg-dpcp-navy text-white")} onClick={() => setMode("board")}>
            Board
          </button>
          <button type="button" className={cn("rounded-full px-3 py-1", mode === "list" && "bg-dpcp-navy text-white")} onClick={() => setMode("list")}>
            List
          </button>
        </div>
      </div>

      {mode === "board" ? (
        <div className="mt-3 grid gap-3 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column} className="rounded-3xl bg-[#E7EEF6]/60 p-3">
              <p className="text-xs font-medium text-dpcp-navy">{column}</p>
              <div className="mt-2 space-y-2">
                {projects.filter((project) => columnOf(project.status) === column).map((project) => (
                  <article key={project.id} className="rounded-2xl bg-white p-3 text-sm">
                    <p className="font-medium text-dpcp-navy">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.owner}</p>
                    <p className={cn("text-xs", tone(project.status))}>{project.status} · {project.due}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {projects.map((project) => (
            <li key={project.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-3 py-3 text-sm">
              <span className="font-medium text-dpcp-navy">{project.name}</span>
              <span>{project.owner}</span>
              <span className={tone(project.status)}>{project.status}</span>
              <span className="text-muted-foreground">{project.due}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-3xl bg-white p-4">
        <p className="text-sm font-medium text-dpcp-navy">Workload</p>
        <div className="mt-3 space-y-2">
          {LOAD.map((person) => (
            <div key={person.name}>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>{person.name}</span>
                <span>{person.items} open</span>
              </div>
              <div className="h-2 rounded-full bg-[#E7EEF6]">
                <div className="h-2 rounded-full bg-[#0E6B5C]" style={{ width: `${person.items * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
