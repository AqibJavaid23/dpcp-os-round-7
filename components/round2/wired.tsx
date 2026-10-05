"use client";

import Link from "next/link";
import { useState } from "react";
import { APPEAL_V1, APPEAL_V2, LOADS, SLOW_LINE } from "@/lib/round2/data";
import { useRound2 } from "@/lib/round2/context";
import { useApp } from "@/lib/store";
import { PEOPLE } from "@/lib/seed";

export function TodayFloorTasks() {
  const app = useApp();
  const r2 = useRound2();
  const mine = r2.requests.filter((req) => {
    if (req.stage === "done" || req.stage === "ai" || req.stage === "received") return false;
    if (req.kind === "appeal" && (req.stage === "lead" || req.stage === "review" || req.stage === "v2" || req.stage === "revising")) {
      const lead = req.stage === "lead" && app.viewer.id === "omar";
      return app.viewer.id === "nadia" || app.ui.role === "george" || lead;
    }
    if (app.ui.role === "george") return req.stage === "specialist" || req.stage === "lead";
    return req.humanOwnerId === app.viewer.id && (req.stage === "specialist" || req.stage === "lead");
  });
  if (mine.length === 0) return null;
  return (
    <div className="mt-3 space-y-3">
      {mine.map((req) => (
        <Link
          key={req.id}
          href={req.kind === "appeal" ? "/review" : req.kind === "repair" ? "/copilot/equipment/#service" : `/copilot/${req.copilot === "operations" ? "construction" : req.copilot}/`}
          onClick={() => {
            if (req.kind === "appeal") r2.openReview(req.id);
          }}
          className="block rounded-3xl bg-white px-4 py-4 no-underline shadow-[0_8px_30px_rgba(18,59,120,0.06)]"
        >
          <p className="text-base font-medium text-dpcp-navy">{req.humanTitle || req.text}</p>
          <p className="mt-1 text-sm text-muted-foreground">AI already did: {req.aiDid || "sorted the request."}</p>
        </Link>
      ))}
    </div>
  );
}

export function AppealReview() {
  const app = useApp();
  const r2 = useRound2();
  const req = r2.requests.find((item) => item.kind === "appeal" && item.stage !== "done" && item.stage !== "ai" && item.stage !== "received" && item.stage !== "specialist");
  const [note, setNote] = useState("Cite the perio history and the date of the prior crown.");
  if (!req) return null;
  const visible = app.viewer.id === "nadia" || app.viewer.id === "omar" || app.ui.role === "george";
  if (!visible) return null;
  const letter = req.version >= 2 ? APPEAL_V2 : APPEAL_V1;
  return (
    <article className="mb-6 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(18,59,120,0.06)]">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">Appeal letter · Saguaro · claim 88-1042</p>
      <h2 className="font-heading mt-2 text-2xl text-dpcp-navy">Review appeal draft</h2>
      <p className="mt-1 text-sm text-muted-foreground">Over $1,000, so Nadia approves and Omar signs. PHI stays in the PMS.</p>
      {req.stage === "revising" ? (
        <p className="mt-4 text-sm">Revising from your notes…</p>
      ) : (
        <>
          {req.version >= 2 && (
            <div className="mt-4 rounded-2xl bg-[#E7EEF6] p-3 text-sm">
              <p className="text-xs text-dpcp-navy">What changed</p>
              <p className="mt-1 text-muted-foreground line-through">The prior crown on this tooth sits outside that window.</p>
              <p className="mt-1">The prior crown was placed in March 2014, outside Aetna's 5-year window. Perio notes (initials J.R.) show the tooth still needs full coverage.</p>
            </div>
          )}
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-[#f6f7f9] p-3 font-sans text-sm">{letter}</pre>
          {req.stage === "review" && (
            <div className="mt-4">
              <label className="text-sm text-dpcp-navy" htmlFor="appeal-note">Point by point</label>
              <textarea id="appeal-note" value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-2 w-full rounded-2xl border border-border p-3 text-sm" />
              <button type="button" className="mt-3 min-h-11 rounded-full bg-dpcp-navy px-4 text-sm text-white" onClick={() => note.trim() && r2.commentAppeal(req.id, note.trim())}>
                Submit feedback
              </button>
            </div>
          )}
          {req.stage === "v2" && (app.viewer.id === "nadia" || app.ui.role === "george") && (
            <button type="button" className="mt-4 min-h-11 rounded-full bg-dpcp-navy px-4 text-sm text-white" onClick={() => r2.approveAppeal(req.id)}>
              Approve
            </button>
          )}
          {req.stage === "lead" && (
            <div className="mt-4">
              <p className="text-sm">Waiting on Omar Hale. $2,860 is over the $1,000 line.</p>
              {(app.viewer.id === "omar" || app.ui.role === "george") && (
                <button type="button" className="mt-3 min-h-11 rounded-full bg-dpcp-navy px-4 text-sm text-white" onClick={() => r2.approveLead(req.id)}>
                  Approve as lead
                </button>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}

export function OtherDrafts() {
  const app = useApp();
  const drafts = [
    { id: "pnl", title: "Saguaro September P&L", owner: "elena", kind: "Five sections. Collections $310,000. 4-wall 36.3%." },
    { id: "snap", title: "Lakeview weekly snapshot", owner: "priya", kind: "Week of Sep 28. The one snapshot still unsent." },
    { id: "landed", title: "EQ-0412 landed-cost sheet", owner: "theo", kind: "Product $28,000. Landed $46,100." },
    { id: "bid", title: "Mesa Verde simulated GC bid", owner: "rowan", kind: "$412,000 simulated. Cash $96,400. Barter $38,200." },
  ].filter((draft) => app.ui.role === "george" || app.viewer.id === draft.owner);
  if (drafts.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="font-heading text-xl text-dpcp-navy">Other drafts</h2>
      <div className="mt-3 space-y-2">
        {drafts.map((draft) => (
          <article key={draft.id} className="rounded-3xl bg-white px-4 py-3">
            <p className="text-sm font-medium text-dpcp-navy">{draft.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{draft.kind}</p>
            <p className="mt-1 text-xs text-[#8A4B12]">Needs a human</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FloorReplies() {
  const r2 = useRound2();
  const done = r2.requests.filter((req) => req.stage === "done" && req.kind !== "general");
  if (done.length === 0) return null;
  return (
    <div className="mt-3 space-y-2">
      {done.map((req) => (
        <article key={req.id} className="rounded-3xl bg-white px-4 py-3">
          <p className="text-xs text-muted-foreground">Practice desk · {req.deptLabel}</p>
          <p className="mt-1 text-sm">{req.result}</p>
        </article>
      ))}
    </div>
  );
}

export function TeamLoad({ personIds, showRollup }: { personIds: string[]; showRollup?: boolean }) {
  const rows = LOADS.filter((row) => personIds.includes(row.personId));
  if (rows.length === 0 && !showRollup) return null;
  return (
    <section className="mt-4 rounded-3xl bg-white p-4">
      <h3 className="font-heading text-lg text-dpcp-navy">Workload</h3>
      <div className="mt-3 space-y-3">
        {rows.map((row) => {
          const person = PEOPLE.find((p) => p.id === row.personId);
          return (
            <div key={row.personId} className="border-t border-border pt-3 text-sm first:border-0 first:pt-0">
              <p className="font-medium text-dpcp-navy">{person?.name}</p>
              <p className="text-muted-foreground">Open {row.open} · due today {row.due} · overdue {row.overdue}</p>
              {row.blocker && <p>Blocked: {row.blocker}</p>}
              <p className="text-muted-foreground">First response {row.first} · to done {row.done} · SLA breaches {row.sla}</p>
              <p>On time {row.onTime} · goal 85%</p>
              {row.out && <p>{row.out}{row.cover ? ` · cover ${row.cover}` : ""}</p>}
            </div>
          );
        })}
      </div>
      {showRollup && <p className="mt-4 text-sm text-dpcp-navy">{SLOW_LINE}</p>}
    </section>
  );
}
