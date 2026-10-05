"use client";

import { useMemo, useState } from "react";
import { PageFrame } from "@/components/app-shell";
import { useApp } from "@/lib/store";
import { DUTIES, GAPS, ROLES, SOPS, SYSTEMS, searchKnowledge, type SopDoc } from "@/lib/round3/knowledge";
import { DraftLabel, Gate, SampleBanner, Segmented } from "@/components/round3/ui";

const TILES = ["SOPs", "Roles", "Who does what", "Systems", "Departments", "Policies", "Templates"];

export function KnowledgeScreen() {
  const app = useApp();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");
  const [view, setView] = useState("home");
  const [sopId, setSopId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);
  const departments = ["All", ...new Set(SOPS.map((sop) => sop.department))];
  const result = useMemo(() => searchKnowledge(query, dept === "All" ? undefined : { department: dept }), [query, dept]);

  return (
    <PageFrame title="Knowledge" lede="Search once. The answer cites the SOP it came from.">
      <Gate
        empty={
          <div>
            <p className="font-heading text-xl text-dpcp-navy">The library is empty in this preview.</p>
            <button type="button" className="mt-3 text-sm text-dpcp-blue" onClick={() => app.setScreenState("ready")}>
              Show the sample library
            </button>
          </div>
        }
      >
        <SampleBanner />
        <input className="mt-4 h-14 w-full rounded-2xl bg-white px-4 text-lg outline-none" value={query} onChange={(event) => { setQuery(event.target.value); setView("search"); }} placeholder="Search SOPs, roles, systems" aria-label="Search knowledge" />
        <div className="mt-3 flex flex-wrap gap-2">
          {departments.map((item) => (
            <button key={item} type="button" className={`min-h-11 rounded-full px-3 text-sm ${dept === item ? "bg-dpcp-navy text-white" : "bg-white"}`} onClick={() => setDept(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Segmented value={view} onChange={setView} options={[{ id: "home", label: "Browse" }, { id: "search", label: "Results" }, { id: "coverage", label: "Coverage" }, { id: "who", label: "Who does what" }]} />
        </div>
        {query && result.answer && (
          <article className="mt-4 rounded-2xl bg-white p-4">
            <DraftLabel />
            <p className="mt-2 text-sm">{result.answer}</p>
            {result.source && <p className="mt-2 text-xs text-muted-foreground">Source: {result.source.title}, sample.</p>}
          </article>
        )}
        {view === "home" && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {TILES.map((tile) => (
              <button key={tile} type="button" className="rounded-2xl bg-white p-4 text-left" onClick={() => setView(tile === "Who does what" ? "who" : tile === "Roles" ? "roles" : tile === "Systems" ? "systems" : "search")}>
                <h2 className="font-heading text-lg text-dpcp-navy">{tile}</h2>
                <p className="text-sm text-muted-foreground">{tile === "SOPs" ? `${SOPS.length} sample SOPs` : "Sample"}</p>
              </button>
            ))}
          </div>
        )}
        {(view === "search" || view === "home") && view === "search" && (
          <SopList items={result.sops} onOpen={setSopId} />
        )}
        {view === "roles" && (
          <div className="mt-4 space-y-2">
            {ROLES.filter((role) => !query || result.roles.some((item) => item.id === role.id)).map((role) => (
              <button key={role.id} type="button" className="block w-full rounded-2xl bg-white p-4 text-left" onClick={() => setRoleId(role.id)}>
                <h2 className="font-heading text-lg text-dpcp-navy">{role.title}</h2>
                <p className="text-sm text-muted-foreground">{role.purpose}</p>
              </button>
            ))}
          </div>
        )}
        {view === "systems" && (
          <ul className="mt-4 space-y-2">
            {(query ? result.systems : SYSTEMS).map((system) => (
              <li key={system.id} className="rounded-2xl bg-white p-4 text-sm">
                <p className="font-medium text-dpcp-navy">{system.name}</p>
                <p>{system.purpose}</p>
                <p className="text-muted-foreground">Owner {system.owner}. {system.access}</p>
                <a href="/tickets/" className="text-dpcp-blue">Ask IT for access</a>
              </li>
            ))}
          </ul>
        )}
        {view === "who" && (
          <ul className="mt-4 space-y-2">
            {(query ? result.duties : DUTIES).map((duty) => (
              <li key={duty.task} className="rounded-2xl bg-white p-4 text-sm">
                <p className="font-medium">{duty.task}</p>
                <p>{duty.person} · {duty.role} · {duty.department}</p>
                <p className="text-muted-foreground">Backup {duty.backup}</p>
              </li>
            ))}
          </ul>
        )}
        {view === "coverage" && <Coverage onCreate={(title) => app.handToReview(`Create SOP: ${title}`, "No SOP yet. Sample task for the owner of that department.")} />}
        {sopId && <SopPage id={sopId} onBack={() => setSopId(null)} />}
        {roleId && <RolePage id={roleId} onBack={() => setRoleId(null)} onSop={setSopId} />}
      </Gate>
    </PageFrame>
  );
}

function SopList({ items, onOpen }: { items: SopDoc[]; onOpen: (id: string) => void }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((sop) => (
        <li key={sop.id}>
          <button type="button" className="w-full rounded-2xl bg-white p-4 text-left" onClick={() => onOpen(sop.id)}>
            <p className="text-xs text-muted-foreground">{sop.department} · Sample</p>
            <h2 className="font-heading text-lg text-dpcp-navy">{sop.title}</h2>
            <p className="text-sm">{sop.summary}</p>
          </button>
        </li>
      ))}
      {items.length === 0 && <li className="text-sm text-muted-foreground">No SOP yet. Create one?</li>}
    </ul>
  );
}

function SopPage({ id, onBack }: { id: string; onBack: () => void }) {
  const app = useApp();
  const sop = SOPS.find((item) => item.id === id);
  if (!sop) return null;
  return (
    <article className="mt-4 rounded-2xl bg-white p-4">
      <button type="button" className="text-sm text-dpcp-blue" onClick={onBack}>Back</button>
      <p className="mt-2 text-xs text-muted-foreground">Sample · {sop.department} · version {sop.version}</p>
      <h2 className="font-heading text-2xl text-dpcp-navy">{sop.title}</h2>
      <p className="mt-2 text-sm">{sop.summary}</p>
      <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
        {sop.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="mt-3 text-sm">Owner {sop.owner}. Review due {sop.reviewDue}.</p>
      <p className="text-sm">Checklist: {sop.checklist ?? "None yet"}. Training: {sop.training ?? "Not linked"}. Video: {sop.video}.</p>
      <p className="text-sm">Used in: {sop.usedIn.join(", ") || "—"}.</p>
      <ul className="mt-2 text-xs text-muted-foreground">
        {sop.history.map((row) => (
          <li key={row.version}>v{row.version} · {row.at} · {row.note}</li>
        ))}
      </ul>
      <button type="button" className="mt-3 min-h-11 text-sm text-dpcp-blue" onClick={() => app.handToReview(`Edit SOP: ${sop.title}`, "Suggested edit. Sample. A lead reviews it before it replaces the current version.")}>
        Suggest an edit
      </button>
    </article>
  );
}

function RolePage({ id, onBack, onSop }: { id: string; onBack: () => void; onSop: (id: string) => void }) {
  const role = ROLES.find((item) => item.id === id);
  if (!role) return null;
  return (
    <article className="mt-4 rounded-2xl bg-white p-4 text-sm">
      <button type="button" className="text-dpcp-blue" onClick={onBack}>Back</button>
      <h2 className="font-heading mt-2 text-2xl text-dpcp-navy">{role.title}</h2>
      <p className="mt-2">{role.purpose}</p>
      <p className="mt-2">Reports to {role.reportsTo}.</p>
      <p className="mt-2">Daily: {role.daily.join(", ")}. Weekly: {role.weekly.join(", ")}.</p>
      <p className="mt-2">KPIs: {role.kpis.join(", ")}.</p>
      <p className="mt-2">Systems: {role.systems.join(", ")}.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {role.sops.map((sopId) => (
          <button key={sopId} type="button" className="rounded-full bg-muted px-3 py-2" onClick={() => onSop(sopId)}>
            {SOPS.find((sop) => sop.id === sopId)?.title}
          </button>
        ))}
      </div>
    </article>
  );
}

function Coverage({ onCreate }: { onCreate: (title: string) => void }) {
  const byDept = new Map<string, { published: number; draft: number; missing: number }>();
  SOPS.forEach((sop) => {
    const row = byDept.get(sop.department) ?? { published: 0, draft: 0, missing: 0 };
    row.published += 1;
    byDept.set(sop.department, row);
  });
  GAPS.forEach((gap) => {
    const row = byDept.get(gap.department) ?? { published: 0, draft: 0, missing: 0 };
    row[gap.status] += 1;
    byDept.set(gap.department, row);
  });
  return (
    <div className="mt-4">
      <ul className="space-y-2">
        {[...byDept.entries()].map(([dept, row]) => (
          <li key={dept} className="rounded-2xl bg-white p-4 text-sm">
            {dept}: {row.published} published · {row.draft} draft · {row.missing} missing
          </li>
        ))}
      </ul>
      <h3 className="mt-4 font-heading text-lg text-dpcp-navy">No SOP yet</h3>
      <ul className="mt-2 space-y-2">
        {GAPS.map((gap) => (
          <li key={gap.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 text-sm">
            <span>{gap.title} · {gap.department} · {gap.status}</span>
            <button type="button" className="min-h-11 text-dpcp-blue" onClick={() => onCreate(gap.title)}>
              Create one?
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
