"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { CopilotLogo } from "@/components/round6/marks";
import { DeptModuleLinks } from "@/components/round4/experience";
import { useApp } from "@/lib/store";
import {
  BUILD_STAGES,
  COPILOTS,
  MODULES,
  copilotsFor,
  copilotById,
  practiceById,
  rowsFor,
  type CopilotId,
  type WorkRow,
} from "@/lib/round2/data";
import { useRound2 } from "@/lib/round2/context";
import { TeamLoad } from "@/components/round2/wired";
import { cn } from "@/lib/utils";

export function CopilotScreen({ copilotId }: { copilotId: string }) {
  const copilot = copilotById(copilotId);
  const app = useApp();
  const [moduleId, setModuleId] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setModuleId(window.location.hash.replace("#", "") || null);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  if (!copilot) {
    return (
      <PageFrame title="Department">
        <p className="text-sm">That department is not in this prototype.</p>
      </PageFrame>
    );
  }

  const allowed = copilotsFor(app.viewer.id, app.ui.role);
  if (!allowed.some((item) => item.id === copilot.id)) {
    return (
      <PageFrame title={copilot.short}>
        <p className="text-sm">Your login is not on {copilot.short}. George can open every department.</p>
      </PageFrame>
    );
  }

  const module = MODULES[copilot.id].find((item) => item.id === moduleId) ?? null;

  return (
    <PageFrame title={module ? module.name : copilot.short} lede={module ? module.purpose : copilot.blurb}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <CopilotLogo id={copilot.id} labeled />
        {copilot.id === "insurance" && <PhiBadge />}
        {module && (
          <a href={`/copilot/${copilot.id}/`} className="text-sm text-dpcp-blue">
            Department home
          </a>
        )}
      </div>
      {module ? <ModuleView copilotId={copilot.id} moduleId={module.id} special={module.special} /> : <DepartmentHome copilotId={copilot.id} />}
    </PageFrame>
  );
}

function PhiBadge() {
  return <span className="rounded-full bg-[#E7EEF6] px-3 py-1 text-xs text-dpcp-navy">PHI stays in the PMS until BAA</span>;
}

function DepartmentHome({ copilotId }: { copilotId: CopilotId }) {
  const copilot = copilotById(copilotId)!;
  const r2 = useRound2();
  const app = useApp();
  const human = humanItems(copilotId, r2.book);
  const requests = r2.requests.filter((req) => req.copilot === copilotId && matchesBook(req.practiceId, r2.book));
  const isLead = copilot.leadId === app.viewer.id || app.ui.role === "george";

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex flex-wrap gap-2">
          <a href="/tickets/" className="rounded-full bg-status-blue-bg px-3 py-1 text-xs text-status-blue no-underline">Suggested · Open this department's queue</a>
          <a href="/knowledge/" className="rounded-full bg-[#E7EEF6] px-3 py-1 text-xs text-dpcp-navy no-underline">Related SOP · department home</a>
          <span className="rounded-full bg-status-blue-bg px-3 py-1 text-xs text-status-blue">AI working · {copilot.aiSince.split(".")[0]}</span>
        </div>
        <DeptModuleLinks copilotId={copilotId} />
        <h2 className="font-heading text-2xl text-dpcp-navy">Needs a human today</h2>
        <ul className="mt-3 space-y-2">
          {human.map((row) => (
            <li key={row.id} className="rounded-3xl bg-white px-4 py-3 text-sm shadow-[0_8px_30px_rgba(18,59,120,0.05)]">
              <span className="mr-2 rounded-full bg-[#F8E7D8] px-2 py-0.5 text-[11px] text-[#8A4B12]">Needs a human</span>
              {row.title}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-heading text-2xl text-dpcp-navy">Done by AI since yesterday</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">{copilot.aiSince}</p>
      </section>
      <section>
        <h2 className="font-heading text-2xl text-dpcp-navy">Practice requests</h2>
        <div className="mt-3 space-y-2">
          {requests.length === 0 && <p className="text-sm text-muted-foreground">Nothing live from the desks on this book.</p>}
          {requests.map((req) => (
            <article key={req.id} className="rounded-3xl bg-white px-4 py-3 text-sm">
              <p>{req.text}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {req.stage} · {req.urgency} · owner {req.deptLabel}
                {req.stage !== "done" && req.urgency === "Today" ? " · SLA: same day" : ""}
              </p>
              {req.stage === "specialist" && req.kind !== "appeal" && (
                <button type="button" className="mt-2 text-dpcp-blue" onClick={() => (req.kind === "repair" ? r2.completeRepair(req.id) : r2.completeGeneral(req.id))}>
                  Mark the human step done
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-heading text-2xl text-dpcp-navy">Department pulse</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {copilot.pulses.map((pulse) => (
            <div key={pulse.label} className="rounded-3xl bg-white px-4 py-4">
              <p className="text-xs text-muted-foreground">{pulse.label}</p>
              <p className="font-heading mt-1 text-2xl text-dpcp-navy">
                {pulse.score} <span className="text-base">{pulse.trend === "up" ? "↑" : pulse.trend === "down" ? "↓" : "→"}</span>
              </p>
              <p className="text-xs text-muted-foreground">Goal {pulse.goal}</p>
            </div>
          ))}
        </div>
      </section>
      {isLead && <LeadLoad copilotId={copilotId} />}
      <ModuleLinks copilotId={copilotId} />
    </div>
  );
}

function humanItems(copilotId: CopilotId, book: "hdg" | "client") {
  const first = MODULES[copilotId][0];
  return rowsFor(copilotId, first.id)
    .filter((row) => row.lane === "human" && visible(row, book))
    .slice(0, 6);
}

function matchesBook(practiceId: string | undefined, book: "hdg" | "client") {
  if (!practiceId) return true;
  return practiceById(practiceId)?.kind === book;
}

function visible(row: WorkRow, book: "hdg" | "client") {
  return matchesBook(row.practiceId, book);
}

export function ModuleLinks({ copilotId }: { copilotId: CopilotId }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {MODULES[copilotId].map((mod) => (
        <a key={mod.id} href={`/copilot/${copilotId}/#${mod.id}`} className="rounded-3xl bg-white px-4 py-3 text-sm no-underline text-dpcp-navy">
          {mod.name}
        </a>
      ))}
    </div>
  );
}

function ModuleView({ copilotId, moduleId, special }: { copilotId: CopilotId; moduleId: string; special?: string }) {
  const r2 = useRound2();
  const rows = rowsFor(copilotId, moduleId).filter((row) => visible(row, r2.book));
  const ai = rows.filter((row) => row.lane === "ai");
  const human = rows.filter((row) => row.lane === "human");

  return (
    <div className="space-y-6">
      {special === "rcm" && <ClientCards book={r2.book} />}
      {special === "ar" && <CallMode />}
      {special === "denials" && <DenialBridge />}
      {special === "pnl" && <Pnl book={r2.book} />}
      {special === "service" && <ServiceActions />}
      {special === "pipeline" && r2.book === "hdg" && <StageStrip />}
      {special === "landed" && r2.book === "hdg" && (
        <p className="rounded-3xl bg-white px-4 py-3 text-sm">EQ-0412 · product $28,000 → landed $46,100 · bond open · PL, CI, and BL matched · two SKUs still missing a GUDID, so the PO waits.</p>
      )}
      {special === "bid" && r2.book === "hdg" && (
        <p className="rounded-3xl bg-white px-4 py-3 text-sm">Simulated bid $412,000. Cash $96,400. Barter $38,200. Painting market $31,000 against actual $5,800. The file is also in Review.</p>
      )}
      <Split title="Needs a human" tone="human" rows={human} />
      <Split title="Done by AI" tone="ai" rows={ai} />
    </div>
  );
}

function Split({ title, tone, rows }: { title: string; tone: "ai" | "human"; rows: WorkRow[] }) {
  const [open, setOpen] = useState<string | null>(rows[0]?.id ?? null);
  return (
    <section>
      <h2 className="font-heading text-xl text-dpcp-navy">{title}</h2>
      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <article key={row.id} className="rounded-3xl bg-white px-4 py-3">
            <button type="button" className="flex w-full items-start justify-between gap-3 text-left" onClick={() => setOpen(open === row.id ? null : row.id)}>
              <span>
                <span className={cn("mr-2 rounded-full px-2 py-0.5 text-[11px]", tone === "ai" ? "bg-[#E5F4FC] text-dpcp-blue" : "bg-[#F8E7D8] text-[#8A4B12]")}>{tone === "ai" ? "Done by AI" : "Needs a human"}</span>
                <span className="text-sm font-medium text-dpcp-navy">{row.title}</span>
              </span>
              <span className="text-xs text-muted-foreground">{row.status}</span>
            </button>
            {open === row.id && (
              <p className="mt-2 text-sm text-muted-foreground">
                {row.detail} {row.meta ? `· ${row.meta}` : ""}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function ClientCards({ book }: { book: "hdg" | "client" }) {
  const r2 = useRound2();
  const cards = rowsFor("insurance", "rcm").filter((row) => visible(row, book) && row.id.startsWith("rcm-"));
  const focus = r2.clientFocus ? cards.find((card) => card.practiceId === r2.clientFocus) : null;
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-2">
        {cards.map((card) => (
          <button key={card.id} type="button" onClick={() => r2.setClientFocus(card.practiceId ?? null)} className="rounded-3xl bg-white p-4 text-left">
            <span className="text-xs text-muted-foreground">{practiceById(card.practiceId ?? "")?.kind === "hdg" ? "HDG" : "Client"}</span>
            <p className="font-heading text-lg text-dpcp-navy">{card.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.detail}</p>
          </button>
        ))}
      </div>
      {focus && (
        <div className="mt-3 rounded-3xl bg-[#E7EEF6] p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-xl text-dpcp-navy">{focus.title} workspace</h3>
            <button type="button" className="text-sm" onClick={() => r2.setClientFocus(null)}>Close</button>
          </div>
          <p className="mt-2 text-sm">{focus.detail}</p>
          <p className="mt-2 text-xs text-dpcp-navy">Open work stays in the PMS. This workspace shows the task, the count, and the owner.</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a className="text-dpcp-blue" href="/copilot/insurance/#claims">Claims</a>
            <a className="text-dpcp-blue" href="/copilot/insurance/#ar">AR</a>
            <a className="text-dpcp-blue" href="/copilot/insurance/#denials">Appeals</a>
          </div>
        </div>
      )}
    </div>
  );
}

function CallMode() {
  const r2 = useRound2();
  return (
    <section className="rounded-3xl bg-white p-4">
      <h2 className="font-heading text-xl text-dpcp-navy">Call mode</h2>
      <p className="mt-1 text-sm text-muted-foreground">One claim. Script on the left. Outcome on the right. Initials only.</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <p className="text-sm">Saguaro · claim 88-1042 · Aetna · $2,860 · D2740 ×2 · 74 days. Ask for the reprocessing reference. Do not read a member ID aloud from this screen. It is not here.</p>
        <div className="flex flex-col gap-2">
          {["Paid / in process", "Needs info", "Denied → appeal", "Resubmit", "Write-off request"].map((outcome) => (
            <button key={outcome} type="button" className={cn("min-h-11 rounded-2xl px-3 text-left text-sm", r2.callOutcome === outcome ? "bg-dpcp-navy text-white" : "bg-[#f4f6f8]")} onClick={() => { r2.setCallClaim("88-1042"); r2.setCallOutcome(outcome); }}>
              {outcome}
            </button>
          ))}
        </div>
      </div>
      {r2.callOutcome && <p className="mt-3 text-sm text-dpcp-blue">Logged: {r2.callOutcome}. A write-off still needs the lead.</p>}
    </section>
  );
}

function DenialBridge() {
  return (
    <p className="rounded-3xl bg-white px-4 py-3 text-sm">
      Frequency limitation 12 · missing narrative 7 · downgrade 5. The live Saguaro appeal opens in Review, next to this studio. Copper Canyon Delta D4910 is on v2 after the note “cite perio history.”
    </p>
  );
}

function Pnl({ book }: { book: "hdg" | "client" }) {
  const client = book === "client";
  const sections = client
    ? [
        ["Summary", "Collections $310,000"],
        ["Cost of producing dentistry", "23.7%"],
        ["Operating costs", "33.5%"],
        ["Growth costs", "6.5%"],
        ["4-wall profitability", "36.3%"],
      ]
    : [
        ["Summary", "First full month. Do not call it a trend."],
        ["Cost of producing dentistry", "Thin history"],
        ["Operating costs", "Still opening"],
        ["Growth costs", "Tracking is not trusted yet"],
        ["4-wall profitability", "Not stable"],
      ];
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {sections.map(([title, value]) => (
        <div key={title} className="rounded-3xl bg-white px-4 py-3">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="mt-1 text-sm text-dpcp-navy">{value}</p>
        </div>
      ))}
      <p className="text-xs text-muted-foreground sm:col-span-2">No personal pay. Associate cost, when it appears, is a practice ratio.</p>
    </div>
  );
}

function ServiceActions() {
  const r2 = useRound2();
  const repair = r2.requests.find((req) => req.kind === "repair" && req.stage !== "done");
  if (!repair) return <p className="text-sm text-muted-foreground">No live chair ticket. The sample row above is the standing Op 7 note.</p>;
  return (
    <div className="rounded-3xl bg-[#F8E7D8] px-4 py-4">
      <p className="text-sm font-medium text-dpcp-navy">{repair.humanTitle}</p>
      <p className="mt-1 text-sm">AI already did: {repair.aiDid}</p>
      <button type="button" className="mt-3 min-h-11 rounded-full bg-dpcp-navy px-4 text-sm text-white" onClick={() => r2.completeRepair(repair.id)}>
        Set the Thursday visit
      </button>
    </div>
  );
}

function StageStrip() {
  const current = 5;
  return (
    <ol className="flex gap-1 overflow-x-auto pb-1">
      {BUILD_STAGES.map((stage, index) => (
        <li key={stage} className={cn("shrink-0 rounded-full px-2 py-1 text-[11px]", index === current ? "bg-dpcp-navy text-white" : index < current ? "bg-[#E7EEF6] text-dpcp-navy" : "bg-white text-muted-foreground")}>
          {index + 1}. {stage}
        </li>
      ))}
    </ol>
  );
}

export function DeptMore() {
  const app = useApp();
  const list = copilotsFor(app.viewer.id, app.ui.role);
  return (
    <div className="mb-4 space-y-2">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Departments</p>
      {list.map((copilot) => (
        <Link key={copilot.id} href={`/copilot/${copilot.id}`} className="block rounded-3xl bg-white px-4 py-3 no-underline">
          <span className="text-sm text-dpcp-navy">{copilot.name}</span>
        </Link>
      ))}
    </div>
  );
}

function LeadLoad({ copilotId }: { copilotId: CopilotId }) {
  const copilot = COPILOTS.find((item) => item.id === copilotId)!;
  return <TeamLoad personIds={copilot.members} />;
}

export function CopilotIndex() {
  const app = useApp();
  const list = copilotsFor(app.viewer.id, app.ui.role);
  return (
    <PageFrame title="Departments" lede="The eight copilots. You see the ones on your login.">
      <DeptMore />
      {list.length === 0 && <p className="text-sm">Nothing assigned.</p>}
    </PageFrame>
  );
}
