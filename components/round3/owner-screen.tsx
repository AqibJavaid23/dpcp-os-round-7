"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { BalanceBoard } from "@/components/round6/balance-board";
import { CopilotLogo } from "@/components/round6/marks";
import { OWNER_SNAPS, PRACTICES, practiceById } from "@/lib/round2/data";
import { useApp } from "@/lib/store";
import {
  EXPLAINER,
  METRICS,
  MONTHS,
  PARTS,
  evaluate,
  formatValue,
  helpFor,
  metricById,
  monthLabel,
  monthsFor,
  type Band,
} from "@/lib/round3/balance";
import { BASELINES, DEPT_CARDS, HEALTH, VALUE_EVENTS, WINS } from "@/lib/round3/catalog";
import { pdfBlob } from "@/lib/round3/pdf";
import { assessmentFor, sparkFor, useRound3 } from "@/lib/round3/store";
import type { TicketDept } from "@/lib/round3/tickets";
import { AiHuman, BandPill, DraftLabel, Gate, SampleBanner, Sheet, Spark } from "@/components/round3/ui";

export function OwnerDashboard() {
  const app = useApp();
  const r3 = useRound3();
  const ownerLocked = app.ui.role === "owner";
  const [picked, setPicked] = useState("copper");
  const practiceId = ownerLocked ? "copper" : picked;
  const practice = practiceById(practiceId)!;
  const month = assessmentFor(practiceId, r3.month, r3.overrides);
  const evaled = evaluate(month);
  const history = monthsFor(practiceId);
  const snap = OWNER_SNAPS.find((row) => row.practiceId === practiceId);
  const [counted, setCounted] = useState(false);
  const [metricId, setMetricId] = useState<string | null>(null);
  const [trendKey, setTrendKey] = useState<string | null>(null);
  const [review, setReview] = useState(false);
  const [manual, setManual] = useState(false);
  const [helpOpen, setHelpOpen] = useState<string | null>(null);

  const events = VALUE_EVENTS.filter((event) => event.practiceId === practiceId && event.month === r3.month);
  const recovered = events.filter((event) => event.type === "recovered").reduce((sum, event) => sum + event.amount, 0);
  const saved = events.filter((event) => event.type === "saved").reduce((sum, event) => sum + event.amount, 0);
  const hours = events.filter((event) => event.type === "time").reduce((sum, event) => sum + event.amount, 0);
  const handled = r3.tickets.filter((ticket) => ticket.practiceId === practiceId).length + (practiceId === "copper" ? 170 : 40);
  const mine = r3.tickets.filter((ticket) => ticket.practiceId === practiceId);
  const responded = mine.filter((ticket) => ticket.firstResponseAt);
  const median = responded.length ? Math.round(responded.reduce((sum, ticket) => sum + (Date.parse(ticket.firstResponseAt!) - Date.parse(ticket.openedAt)) / 60000, 0) / responded.length) : 0;
  const aiShare = mine.length ? Math.round((mine.filter((ticket) => ticket.aiFirst).length / mine.length) * 100) : 0;
  const rated = mine.filter((ticket) => ticket.rating);
  const sat = rated.length ? (rated.reduce((sum, ticket) => sum + (ticket.rating ?? 0), 0) / rated.length).toFixed(1) : "4.4";
  const cards = DEPT_CARDS[practiceId] ?? [];
  const plans = r3.plans.filter((plan) => plan.practiceId === practiceId);
  const currentPlan = plans.find((plan) => plan.month === r3.month && plan.metric === evaled.priority.metric);
  const priorityMetric = evaled.priority.metric ? metricById(evaled.priority.metric) : null;
  const baseline = BASELINES.find((row) => row.practiceId === practiceId);

  function exportReport() {
    const lines = [
      `${practice.name} · ${monthLabel(r3.month)} · Sample`,
      `Handled ${handled}. Recovered $${recovered.toLocaleString("en-US")}. Saved $${saved.toLocaleString("en-US")}. Time given back ${hours} hours (estimate).`,
      "",
      "Balance Assessment",
      EXPLAINER,
      evaled.priority.mode === "priority" && priorityMetric ? `Priority: Part ${evaled.priority.part} ${priorityMetric.name} ${formatValue(priorityMetric.id, month.values[priorityMetric.id])} target ${priorityMetric.target}` : evaled.priority.mode === "watch" && priorityMetric ? `Watch: Part ${evaled.priority.part} ${priorityMetric.name}` : "No failing part.",
      currentPlan ? `Plan: ${currentPlan.text} Review ${currentPlan.reviewDate}` : "No plan yet.",
      "",
      ...METRICS.map((metric) => `${metric.id} ${metric.name}: ${formatValue(metric.id, month.values[metric.id])} (${evaluate(month).byMetric[metric.id]})`),
    ];
    const blob = pdfBlob(`${practice.name} monthly report`, lines);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${practice.id}-${r3.month}-report.pdf`;
    anchor.click();
    const reviewId = app.handToReview(`${practice.name} monthly report ${monthLabel(r3.month)}`, lines.join("\n"));
    r3.addReport({ id: `rep-${Date.now()}`, reviewId, practiceId, month: r3.month, text: lines.join("\n") });
  }

  const health = [
    ["Collections", snap?.collections ?? `$${HEALTH.find((row) => row.practiceId === practiceId)?.collections.toLocaleString("en-US")}`, snap?.collectionsGoal ?? "Goal", snap?.collectionsTrend ?? "flat"],
    ["AR 90+", snap?.ar ?? formatValue("5.3", month.values["5.3"]), snap?.arGoal ?? "Under 10%", snap?.arTrend ?? "flat"],
    ["New patients", snap?.newPatients ?? String(month.values["1.1"]), snap?.npGoal ?? "30–40", snap?.npTrend ?? "flat"],
    ["Cost per new patient", snap?.cost ?? "Sample", snap?.costGoal ?? "Trusted", snap?.costTrend ?? "flat"],
    ["Open roles", snap?.roles ?? "None urgent", "Fill the seat", "flat"],
    ["Lists finished", snap?.lists ?? "Sample", "Every opener", "flat"],
    ["Building and equipment", snap?.building ?? "Nothing urgent", "Nothing urgent", "flat"],
  ] as const;

  return (
    <PageFrame title={practice.name} lede="Your office, in one picture. Every practice uses this same view.">
      <Gate>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {!ownerLocked && (
            <label className="text-sm text-muted-foreground">
              Practice{" "}
              <select className="min-h-11 rounded-full bg-white px-3" value={practiceId} onChange={(event) => setPicked(event.target.value)} aria-label="Practice">
                {PRACTICES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="text-sm text-muted-foreground">
            Month{" "}
            <select className="min-h-11 rounded-full bg-white px-3" value={r3.month} onChange={(event) => r3.setMonth(event.target.value)} aria-label="Month">
              {[...MONTHS].reverse().map((item) => (
                <option key={item} value={item}>
                  {monthLabel(item)}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="min-h-11 rounded-full bg-dpcp-blue px-4 text-sm text-white" onClick={exportReport}>
            Export monthly report
          </button>
          <Link href="/mobile/" className="text-sm text-dpcp-blue">
            Open in Mobile
          </Link>
        </div>
        <SampleBanner />
        <p className="mt-2 text-xs text-muted-foreground">
          <DraftLabel /> until you approve the export in Review. Nothing is sent on its own.
        </p>

        <section className="mt-4 rounded-2xl bg-dpcp-navy-deep px-4 py-3 text-white">
          <p className="text-xs tracking-wide text-white/70 uppercase">Needs you</p>
          <p className="mt-1 text-lg">{(snap?.needs.length ?? 0) === 0 ? "Nothing needs you today." : snap!.needs.slice(0, 3).join(" · ")}</p>
        </section>

        <section className="mt-6">
          <p className="font-heading text-2xl text-dpcp-navy">
            In {monthLabel(r3.month).split(" ")[0]}, DPCP handled {handled} items for {practice.name.split(" ")[0] === "Copper" ? "Copper Canyon" : practice.name.replace(" Dental", "").replace(" Family", "").replace(" Arts", "").replace(" Pediatric", "").replace(" Smiles", "")}.
          </p>
          <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
            <ValueTile label="Recovered" value={`$${recovered.toLocaleString("en-US")}`} onHow={() => setCounted(true)} />
            <ValueTile label="Saved" value={`$${saved.toLocaleString("en-US")}`} onHow={() => setCounted(true)} />
            <ValueTile label="Time given back" value={`${hours} h`} note="Estimate" onHow={() => setCounted(true)} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-2xl text-dpcp-navy">Practice health</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {health.map(([label, score, goal, trend]) => (
              <article key={label} className="rounded-3xl bg-white px-4 py-4 shadow-[var(--r3-shadow)]">
                <p className="font-heading text-2xl text-dpcp-navy">
                  {score} <span className="text-base">{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
                </p>
                <p className="mt-1 text-sm text-dpcp-navy">{label}</p>
                <p className="text-xs text-muted-foreground">Goal {goal}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-2xl text-dpcp-navy">By department</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <article key={card.department} className="rounded-3xl bg-white p-4 shadow-[var(--r3-shadow)]">
                <div className="flex items-center gap-2">
                  <CopilotLogo id={deptMark(card.department)} size="sm" />
                  <h3 className="font-heading text-lg text-dpcp-navy">{card.department}</h3>
                </div>
                <p className="font-heading mt-3 text-xl text-dpcp-navy">
                  {card.outcome} <span>{card.trend === "up" ? "↑" : card.trend === "down" ? "↓" : "→"}</span>
                </p>
                <p className="text-xs text-muted-foreground">Goal {card.goal}</p>
                <p className="mt-2 text-sm text-muted-foreground">{card.lines[0]}</p>
              </article>
            ))}
          </div>
        </section>

        <details className="mt-4 rounded-3xl bg-white px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium text-dpcp-navy">What DPCP is handling</summary>
          <ul className="mt-3 space-y-2">
            {(snap?.handling ?? cards.map((card) => `${card.department}: ${card.lines.join(" · ")}`)).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>

        <section className="mt-8 grid gap-3 sm:grid-cols-4">
          {[
            ["Requests handled", String(mine.length), "All of them"],
            ["Median first response", `${median} min`, "Sample SLA"],
            ["Resolved with AI first", `${aiShare}%`, "70%"],
            ["Satisfaction", sat, "4.5"],
          ].map(([label, score, goal]) => (
            <article key={label} className="rounded-2xl bg-white p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="font-heading text-2xl text-dpcp-navy">{score}</p>
              <p className="text-xs text-muted-foreground">Goal {goal}</p>
            </article>
          ))}
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-2xl text-dpcp-navy">Progress since joining</h2>
          <p className="mt-1 text-sm text-muted-foreground">{baseline ? `Joined ${baseline.joined}. Compared with that month, not with other practices.` : "Baseline is captured at onboarding. Sample."}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ProgressTile label="AR 90+" then={baseline?.ar90 ?? "—"} now={formatValue("5.3", month.values["5.3"])} onOpen={() => setTrendKey("5.3")} />
            <ProgressTile label="Days in AR" then={baseline?.days ?? "—"} now={formatValue("5.4", month.values["5.4"])} onOpen={() => setTrendKey("5.4")} />
            <ProgressTile label="Supply cost" then={baseline?.supply ?? "—"} now="5.4% of collections" onOpen={() => setTrendKey("supply")} />
            <ProgressTile label="New patients / doctor" then={baseline?.patients ?? "—"} now={formatValue("1.1", month.values["1.1"])} onOpen={() => setTrendKey("1.1")} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-2xl text-dpcp-navy">Wins</h2>
          <ul className="mt-3 space-y-2">
            {(WINS[practiceId] ?? [{ text: "A quiet month. The team kept the lists.", by: "By your team" }]).map((win) => (
              <li key={win.text} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 text-sm">
                <span>{win.text}</span>
                <AiHuman ai={win.by === "Done by AI"} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl bg-dpcp-tint/50 p-5">
          <p className="text-xs tracking-wide text-dpcp-navy uppercase">Your top opportunity this month</p>
          {priorityMetric && evaled.priority.part ? (
            <>
              <p className="mt-2 text-lg text-dpcp-navy">
                {evaled.priority.mode === "watch" ? "Watch" : "Part " + evaled.priority.part + ", " + PARTS[evaled.priority.part - 1].name}. {priorityMetric.name} is {formatValue(priorityMetric.id, month.values[priorityMetric.id])} (target {priorityMetric.target}).
              </p>
              <p className="mt-2 text-sm">
                DPCP is on it:{" "}
                {currentPlan
                  ? currentPlan.requestIds
                      .map((id) => r3.tickets.find((ticket) => ticket.id === id))
                      .filter(Boolean)
                      .map((ticket) => `${ticket!.title} (${ticket!.department})`)
                      .join("; ") || "a request is linked"
                  : "ask for help and it will show here"}
                . Review on {currentPlan?.reviewDate ?? "the date you set"}.
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg">No failing part this month. Keep the rhythm.</p>
          )}
        </section>

        <BalanceSection
          practiceId={practiceId}
          onMetric={setMetricId}
          onHelp={setHelpOpen}
          onReview={() => setReview(true)}
          onManual={() => setManual(true)}
        />

        <Sheet open={counted} title="How we counted" onClose={() => setCounted(false)}>
          {events.length === 0 && <p className="text-sm">No dollar events for this month. Sample months with events are September 2026 for Copper Canyon, Saguaro, and Lakeview.</p>}
          <ul className="space-y-3">
            {events.map((event) => (
              <li key={event.id} className="text-sm">
                <span className="font-medium text-dpcp-navy">
                  {event.type === "time" ? `${event.amount} hours` : `$${event.amount.toLocaleString("en-US")}`}
                </span>{" "}
                · {event.department} · {event.method}. Source {event.source}. {event.estimate && <span className="text-status-amber">Estimate</span>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Saved counts only a verified difference from the prior price. Avoided costs are not included.</p>
        </Sheet>

        <MetricSheet practiceId={practiceId} metricId={metricId} onClose={() => setMetricId(null)} onHelp={setHelpOpen} />

        <Sheet open={trendKey != null} title="Twelve month trend" onClose={() => setTrendKey(null)}>
          {trendKey && trendKey !== "supply" ? (
            <>
              <Spark values={sparkFor(practiceId, trendKey, r3.overrides)} good={trendKey.startsWith("5") || trendKey === "1.9" ? "down" : "up"} />
              <ol className="mt-3 space-y-1 text-sm">
                {history.map((row) => (
                  <li key={row.month}>
                    {monthLabel(row.month)} · {formatValue(trendKey, row.values[trendKey])}
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="text-sm">Supply cost moved from the onboarding baseline toward 5.4% of collections. Sample. This tile is not a peer ranking.</p>
          )}
        </Sheet>

        <ReviewWizard open={review} onClose={() => setReview(false)} practiceId={practiceId} />
        <ManualForm open={manual} onClose={() => setManual(false)} practiceId={practiceId} />
        <HelpSheet metricId={helpOpen} practiceId={practiceId} onClose={() => setHelpOpen(null)} />
      </Gate>
    </PageFrame>
  );
}

function ValueTile({ label, value, note, onHow }: { label: string; value: string; note?: string; onHow: () => void }) {
  return (
    <article className="min-w-[200px] flex-1 rounded-2xl bg-white p-4 shadow-[var(--r3-shadow)]">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-heading text-3xl text-dpcp-navy">{value}</p>
      {note && <p className="text-xs text-status-amber">{note}</p>}
      <button type="button" className="mt-2 min-h-11 text-sm text-dpcp-blue" onClick={onHow}>
        How we counted
      </button>
    </article>
  );
}

function ProgressTile({ label, then, now, onOpen }: { label: string; then: string; now: string; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="rounded-2xl bg-white p-4 text-left shadow-[var(--r3-shadow)]">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{then}</p>
      <p className="font-heading text-xl text-dpcp-navy">{now} ↑</p>
    </button>
  );
}

function deptMark(name: string) {
  const key = name.toLowerCase();
  if (key.includes("staff")) return "staffing";
  if (key.includes("equip")) return "equipment";
  if (key.includes("suppl")) return "supplies";
  if (key.includes("account") || key.includes("finance")) return "accounting";
  if (key.includes("market")) return "marketing";
  if (key.includes("construct") || key.includes("it")) return key.includes("construct") ? "construction" : "it";
  if (key.includes("insur")) return "insurance";
  return "dpcp";
}

function BalanceSection({ practiceId, onMetric, onHelp, onReview, onManual }: { practiceId: string; onMetric: (id: string) => void; onHelp: (id: string) => void; onReview: () => void; onManual: () => void }) {
  const r3 = useRound3();
  const month = assessmentFor(practiceId, r3.month, r3.overrides);
  const evaled = evaluate(month);

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="min-h-11 rounded-full bg-dpcp-blue px-4 text-sm text-white" onClick={onReview}>
          Start monthly review
        </button>
        <button type="button" className="text-sm text-dpcp-blue" onClick={onManual}>
          Enter this month by hand
        </button>
      </div>
      <BalanceBoard practiceId={practiceId} onMetric={onMetric} onHelp={onHelp} />
      <div className="mt-4 rounded-2xl bg-white p-4">
        <PlanBlock practiceId={practiceId} />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {PARTS.map((part) => (
          <NoteBox key={part.id} practiceId={practiceId} part={part.id} />
        ))}
      </div>
      {evaled.priority.metric && (
        <p className="mt-3 text-xs text-muted-foreground">Priority reading {evaled.priority.metric}. Open a scorecard for the formula.</p>
      )}
      <History practiceId={practiceId} />
    </section>
  );
}

function NoteBox({ practiceId, part }: { practiceId: string; part: number }) {
  const r3 = useRound3();
  const key = `${practiceId}:${r3.month}:${part}`;
  return (
    <label className="mt-2 block text-sm">
      Notes and observations
      <textarea className="mt-1 w-full rounded-2xl bg-white p-3" rows={2} value={r3.notes[key] ?? ""} onChange={(event) => r3.saveNote(practiceId, r3.month, part, event.target.value)} />
    </label>
  );
}

function PlanBlock({ practiceId }: { practiceId: string }) {
  const r3 = useRound3();
  const month = assessmentFor(practiceId, r3.month, r3.overrides);
  const evaled = evaluate(month);
  const plan = r3.plans.find((item) => item.practiceId === practiceId && item.month === r3.month && item.metric === evaled.priority.metric);
  if (!plan) return <p className="mt-2 text-sm text-muted-foreground">No resolution plan for this month yet. Start the monthly review to write one. The review date defaults to 30 days.</p>;
  const due = plan.reviewDate <= "2026-10-20";
  return (
    <div className="mt-3 text-sm">
      <p>{plan.text}</p>
      <p className="mt-1 text-muted-foreground">
        Owner {plan.owner} · Review {plan.reviewDate} · {plan.outcome}
      </p>
      {due && (
        <div className="mt-2 rounded-2xl bg-muted p-3">
          <p className="font-medium">Did it work?</p>
          <p>
            Before {plan.before ?? "the last reading"} · now {plan.after ?? "this month"}.
          </p>
          <div className="mt-2 flex gap-2">
            <button type="button" className="min-h-11 rounded-full bg-dpcp-blue px-3 text-white" onClick={() => r3.setPlanOutcome(plan.id, "resolved")}>
              Resolved, move on
            </button>
            <button type="button" className="min-h-11 rounded-full bg-white px-3" onClick={() => r3.setPlanOutcome(plan.id, "keep")}>
              Keep the plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function History({ practiceId }: { practiceId: string }) {
  const r3 = useRound3();
  const rows = r3.plans.filter((plan) => plan.practiceId === practiceId);
  if (rows.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="font-heading text-lg text-dpcp-navy">What worked, what didn't</h3>
      <ul className="mt-2 space-y-2">
        {rows.map((plan) => (
          <li key={plan.id} className="rounded-2xl bg-white px-4 py-3 text-sm">
            {monthLabel(plan.month)} · {plan.metric} · {plan.text} · {plan.outcome}
            {plan.before && ` · ${plan.before} → ${plan.after}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetricSheet({ practiceId, metricId, onClose, onHelp }: { practiceId: string; metricId: string | null; onClose: () => void; onHelp: (id: string) => void }) {
  const r3 = useRound3();
  const month = assessmentFor(practiceId, r3.month, r3.overrides);
  const metric = metricId ? metricById(metricId) : null;
  const band = metric ? evaluate(month).byMetric[metric.id] : "na";
  return (
    <Sheet open={Boolean(metric)} title={metric ? `${metric.id} ${metric.name}` : ""} onClose={onClose}>
      {metric && (
        <div className="space-y-3 text-sm">
          <BandPill band={band} />
          <p>{metric.why}</p>
          <p>
            <span className="text-muted-foreground">How it's calculated. </span>
            {metric.formula}
          </p>
          <p>
            <span className="text-muted-foreground">Source. </span>
            {metric.source}
          </p>
          <p>
            <span className="text-muted-foreground">Bands. </span>
            {metric.bands}
          </p>
          {metric.id === "5.1" && <p>Red starts below 90%. Below 88% is an active billing problem.</p>}
          <p>
            <span className="text-muted-foreground">If red, what to do. </span>
            {metric.ifRed}
          </p>
          <p>
            <span className="text-muted-foreground">Related. </span>
            Check {metric.related.join(" and ") || "the part above"} first.
          </p>
          <p>Intent: {metric.intent}</p>
          {month.substitutes.includes(metric.id) && metric.substitute && <p>Measured as: {metric.substitute}.</p>}
          <Spark values={sparkFor(practiceId, metric.id, r3.overrides)} />
          {metric.perProvider && (
            <ul>
              {month.providers
                .filter((provider) => provider.values[metric.id] != null && (metric.part !== 4 || provider.role === "hygienist" || metric.id.startsWith("4") === false || provider.role === "doctor"))
                .map((provider) => (
                  <li key={provider.name}>
                    {provider.name} · {provider.ft ? "full time" : "part time"} · {formatValue(metric.id, provider.values[metric.id])}
                  </li>
                ))}
            </ul>
          )}
          {band === "red" && (
            <button type="button" className="min-h-11 rounded-full bg-dpcp-blue px-4 text-white" onClick={() => onHelp(metric.id)}>
              Get DPCP help
            </button>
          )}
        </div>
      )}
    </Sheet>
  );
}

function HelpSheet({ metricId, practiceId, onClose }: { metricId: string | null; practiceId: string; onClose: () => void }) {
  const r3 = useRound3();
  const month = assessmentFor(practiceId, r3.month, r3.overrides);
  const suggestions = metricId ? helpFor(metricId, evaluate(month).byMetric) : [];
  const [sent, setSent] = useState<string[]>([]);
  return (
    <Sheet open={Boolean(metricId)} title="Get DPCP help" onClose={onClose}>
      <p className="text-sm text-muted-foreground">Suggested. George can change the map later.</p>
      <ul className="mt-3 space-y-3">
        {suggestions.map((item) => (
          <li key={item.queue} className="rounded-2xl bg-muted p-3 text-sm">
            <p className="font-medium text-dpcp-navy">{item.queueLabel}</p>
            <p>{item.text}</p>
            <button
              type="button"
              className="mt-2 min-h-11 rounded-full bg-dpcp-blue px-3 text-white"
              onClick={() => {
                if (sent.includes(item.queue)) return;
                const metric = metricById(metricId!);
                const id = r3.addTicket({
                  practiceId,
                  requester: month.reviewer,
                  department: item.queue as TicketDept,
                  type: "Module request",
                  priority: "normal",
                  title: `${metric.id} ${metric.name} is ${formatValue(metric.id, month.values[metric.id])} (target ${metric.target})`,
                  body: item.text,
                });
                setSent((list) => [...list, item.queue]);
                const plan = r3.plans.find((row) => row.practiceId === practiceId && row.month === r3.month && row.metric === metric.id);
                if (plan) r3.savePlan({ ...plan, requestIds: [...plan.requestIds, id] });
              }}
            >
              {sent.includes(item.queue) ? "Request sent" : "Send the request"}
            </button>
          </li>
        ))}
      </ul>
      {sent.length > 0 && (
        <p className="mt-3 text-sm">
          It's on the <Link href="/tickets/" className="text-dpcp-blue">ticket queue</Link> and on the bridge card.
        </p>
      )}
    </Sheet>
  );
}

function ReviewWizard({ open, onClose, practiceId }: { open: boolean; onClose: () => void; practiceId: string }) {
  const r3 = useRound3();
  const month = assessmentFor(practiceId, r3.month, r3.overrides);
  const evaled = evaluate(month);
  const [step, setStep] = useState(0);
  const [text, setText] = useState("Work this one metric until the review date.");
  const metric = evaled.priority.metric;
  const blocked = evaled.priority.mode === "priority" && r3.plans.some((plan) => plan.practiceId === practiceId && plan.part < (evaled.priority.part ?? 0) && plan.outcome === "open");
  return (
    <Sheet open={open} title="Monthly review" onClose={onClose}>
      <p className="text-sm text-muted-foreground">The office manager owns the numbers. The doctors own Part 2.</p>
      {step === 0 && (
        <div className="mt-3">
          <p className="text-sm">Start with the summary. The first red part is the only priority.</p>
          <button type="button" className="mt-3 min-h-11 rounded-full bg-dpcp-blue px-4 text-white" onClick={() => setStep(1)}>
            See the priority
          </button>
        </div>
      )}
      {step === 1 && metric && (
        <div className="mt-3 text-sm">
          <p>
            {evaled.priority.mode === "watch" ? "Watch, not a priority. " : ""}
            {metricById(metric).name} is {formatValue(metric, month.values[metric])}. Target {metricById(metric).target}.
          </p>
          <button type="button" className="mt-3 min-h-11 rounded-full bg-dpcp-blue px-4 text-white" onClick={() => setStep(2)}>
            Write the plan
          </button>
        </div>
      )}
      {step === 2 && (
        <form
          className="mt-3 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!metric || !evaled.priority.part) return;
            r3.savePlan({
              practiceId,
              month: r3.month,
              part: evaled.priority.part,
              metric,
              text,
              owner: month.reviewer,
              requestIds: [],
              reviewDate: "2026-11-19",
            });
            setStep(3);
          }}
        >
          {blocked && <p className="text-sm text-status-amber">A higher part still has an open plan. Finish that before a plan on a lower part.</p>}
          <textarea className="w-full rounded-2xl bg-muted p-3" rows={3} value={text} onChange={(event) => setText(event.target.value)} aria-label="Resolution plan" />
          <p className="text-xs text-muted-foreground">Review date defaults to 30 days: Nov 19, 2026.</p>
          <button type="submit" className="min-h-11 rounded-full bg-dpcp-blue px-4 text-white" disabled={blocked}>
            Save the plan
          </button>
        </form>
      )}
      {step === 3 && <p className="mt-3 text-sm">Saved. Come back on the review date and ask whether it worked.</p>}
    </Sheet>
  );
}

function ManualForm({ open, onClose, practiceId }: { open: boolean; onClose: () => void; practiceId: string }) {
  const r3 = useRound3();
  const base = assessmentFor(practiceId, r3.month, r3.overrides);
  const [values, setValues] = useState(base.values);
  const shown = useMemo(() => values, [values]);
  return (
    <Sheet open={open} title="Enter the month" onClose={onClose}>
      <p className="text-sm text-muted-foreground">For a practice without a PMS feed, and for availability (1.6 and 3.2), which is counted on the schedule.</p>
      <div className="mt-3 grid gap-2">
        {METRICS.map((metric) => (
          <label key={metric.id} className="flex items-center justify-between gap-3 text-sm">
            <span>
              {metric.id} {metric.name}
            </span>
            <input
              className="h-11 w-28 rounded-xl bg-muted px-2"
              value={shown[metric.id]}
              onChange={(event) => setValues((current) => ({ ...current, [metric.id]: Number(event.target.value) }))}
              aria-label={metric.name}
            />
          </label>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 min-h-11 rounded-full bg-dpcp-blue px-4 text-white"
        onClick={() => {
          r3.saveAssessment({ ...base, values });
          onClose();
        }}
      >
        Save this month
      </button>
    </Sheet>
  );
}
