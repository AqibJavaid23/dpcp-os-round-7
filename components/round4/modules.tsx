"use client";

import { useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { StatusTag, Surface } from "@/components/bits";
import { AiHuman, SampleBanner } from "@/components/round3/ui";
import { Button } from "@/components/ui/button";
import {
  ASSETS,
  CONSENT_ROWS,
  DEADLINES,
  DECISION_LOG,
  DEPENDENCIES,
  DEPT_TILES,
  IDENTITY,
  KIT_LINES,
  LAUNCH_LANES,
  LAUNCH_STEPS,
  LANE_LINKS,
  OPEN_QUESTIONS,
  OUTREACH_STEPS,
  PAYERS,
  PLAN_RULES,
  PORTAL_MATRIX,
  PORTAL_PRACTICES,
  PROGRAMS,
  QUOTE_DIFFS,
  RECARE_BUCKETS,
  STUDY_FUNCTIONS,
  TEMPLATES,
} from "@/lib/round4/data";
import { useRound4 } from "@/lib/round4/store";
import { useApp } from "@/lib/store";
import { CopilotLogo } from "@/components/round6/marks";
import { copilotById } from "@/lib/round6/copilots";
import { cn } from "@/lib/utils";

export function DepartmentsScreen() {
  return (
    <PageFrame title="Departments & Copilots" lede="Every department, plus the programs that cross them.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DEPT_TILES.map((tile) => {
          const brand = ["Insurance", "Equipment", "Supplies", "Staffing", "IT", "Accounting", "Marketing", "Construction"].includes(tile.label)
            ? copilotById(tile.label === "IT" ? "it" : tile.label === "Accounting" ? "accounting" : tile.label.toLowerCase())
            : copilotById("dpcp");
          return (
            <Link key={tile.label} href={tile.href} className="rounded-3xl bg-white px-4 py-5 no-underline shadow-sm">
              <CopilotLogo id={brand.id} />
              <p className="font-heading mt-3 text-lg text-dpcp-navy">{tile.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/tickets" className="text-dpcp-blue">Tickets</Link>
        <Link href="/performance" className="text-dpcp-blue">Performance</Link>
        <Link href="/clients" className="text-dpcp-blue">Clients</Link>
        <Link href="/outreach" className="text-dpcp-blue">Outreach</Link>
        <Link href="/portals" className="text-dpcp-blue">Portals</Link>
        <Link href="/kit" className="text-dpcp-blue">Kit</Link>
        <Link href="/plan-check" className="text-dpcp-blue">Plan check</Link>
        <Link href="/schedule" className="text-dpcp-blue">Care team flow</Link>
        <Link href="/study" className="text-dpcp-blue">Time study</Link>
        <Link href="/recare" className="text-dpcp-blue">Recare</Link>
      </div>
    </PageFrame>
  );
}

export function LaunchScreen() {
  const [apply, setApply] = useState<"future" | "open">("future");
  const [location, setLocation] = useState(PROGRAMS[0].id);
  const program = PROGRAMS.find((item) => item.id === location) ?? PROGRAMS[0];
  const money = DEADLINES.length;
  return (
    <PageFrame title="Location Launch Program" lede="Standard HDG opening. The New Location lead can edit the template.">
      <SampleBanner />
      <p className="mt-2 text-sm">Template follows the 17-step workflow, with sample durations. Editing asks whether it applies to future locations only, or also to open programs.</p>
      <div className="mt-3 flex gap-2 text-sm">
        <button type="button" className={cn("rounded-full px-3 py-2", apply === "future" && "bg-dpcp-navy text-white")} onClick={() => setApply("future")}>Future locations only</button>
        <button type="button" className={cn("rounded-full px-3 py-2", apply === "open" && "bg-dpcp-navy text-white")} onClick={() => setApply("open")}>Also open programs</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {PROGRAMS.map((item) => (
          <button key={item.id} type="button" className={cn("rounded-full px-3 py-2 text-sm", location === item.id ? "bg-dpcp-blue text-white" : "bg-white")} onClick={() => setLocation(item.id)}>
            {item.location} · {item.book} · {item.phase}
          </button>
        ))}
      </div>
      <Surface className="mt-4">
        <p className="font-heading text-2xl text-dpcp-navy">{program.location}</p>
        <p className="text-sm text-muted-foreground">Target open {program.target} · {program.countdown}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {program.gates.map((gate) => (
            <StatusTag key={gate.label} tone={gate.tone === "green" ? "green" : gate.tone === "amber" ? "amber" : "red"}>{gate.label}</StatusTag>
          ))}
        </div>
      </Surface>
      <div className="mt-4 space-y-2">
        {program.lanes.map((lane) => (
          <Surface key={lane.name}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-dpcp-navy">{lane.name}</p>
              <span className="text-sm">{lane.pct}%</span>
            </div>
            <p className="text-sm">{lane.owner} · next {lane.next}</p>
            <p className="text-sm text-muted-foreground">Blocker: {lane.blocker}</p>
            {LANE_LINKS[lane.name] && <Link href={LANE_LINKS[lane.name]} className="text-sm text-dpcp-blue">Open the record</Link>}
          </Surface>
        ))}
      </div>
      <section className="mt-6">
        <h2 className="font-heading text-xl text-dpcp-navy">Dependencies</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {DEPENDENCIES.map((row) => (
            <li key={row.id} className="rounded-2xl bg-white px-3 py-2">{row.later} ← {row.earlier}</li>
          ))}
        </ul>
        <p className="mt-2 text-sm"><AiHuman ai /> Critical path: compressor ship window, then soft opening.</p>
      </section>
      <section className="mt-6" id="deadlines">
        <h2 className="font-heading text-xl text-dpcp-navy">Money at stake this week</h2>
        <p className="text-sm">{money} lines. Operational stakes, not pay.</p>
        <ul className="mt-2 space-y-2">
          {DEADLINES.map((item) => (
            <li key={item.id} className={cn("rounded-2xl px-3 py-2 text-sm", item.days <= 2 ? "bg-status-red-bg text-status-red" : "bg-status-amber-bg text-status-amber")}>
              {item.date} · {item.stake} · {item.detail} · {item.owner}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6" id="identity">
        <IdentityCard />
      </section>
      <section className="mt-6">
        <h2 className="font-heading text-xl text-dpcp-navy">Template steps</h2>
        <ol className="mt-2 list-decimal pl-5 text-sm">
          {LAUNCH_STEPS.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <p className="mt-2 text-xs text-muted-foreground">Lanes: {LAUNCH_LANES.join(", ")}</p>
      </section>
    </PageFrame>
  );
}

export function IdentityCard() {
  const r4 = useRound4();
  return (
    <Surface>
      <h2 className="font-heading text-xl text-dpcp-navy">{IDENTITY.practice} identity</h2>
      <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
        <div>Legal name · {IDENTITY.legalName}</div>
        <div>DBA · {IDENTITY.dba}</div>
        <div>Entity · {IDENTITY.entityType}</div>
        <div>Registered · {IDENTITY.registered}</div>
        <div>Physical · {IDENTITY.physical}</div>
        <div>Mailing · {IDENTITY.mailing}</div>
        <div>EIN · {IDENTITY.ein}</div>
        <div>NPI-1 · {IDENTITY.npi1}</div>
        <div>NPI-2 · {IDENTITY.npi2}</div>
        <div>Phone · {IDENTITY.phone}</div>
        <div>Domain · {IDENTITY.domain}</div>
        <div>Email · {IDENTITY.email}</div>
        <div>Texting · {IDENTITY.texting}</div>
      </dl>
      <p className="mt-2 text-xs text-muted-foreground">Each field has an owner, a source document, and a verified date. Secrets stay in the team vault.</p>
      <ul className="mt-3 space-y-1 text-sm">
        {IDENTITY.usages.map((row) => (
          <li key={row.where}>{row.ok ? "✓" : "✗"} {row.where}: {row.note}</li>
        ))}
      </ul>
      {r4.filingBlocked && <p className="mt-3 rounded-2xl bg-status-red-bg px-3 py-2 text-sm text-status-red">{IDENTITY.mismatch}</p>}
      <p className="mt-2 text-sm">A missing field becomes a task for the owner of that field.</p>
    </Surface>
  );
}

export function DecisionsLog({ showQueue }: { showQueue: boolean }) {
  const app = useApp();
  const r4 = useRound4();
  const [tab, setTab] = useState<"queue" | "log" | "questions">(app.ui.role === "george" ? "queue" : "log");
  const [conflict, setConflict] = useState(false);
  return (
    <div>
      <p className="mb-3 text-sm">Log: Keep ordering and shipment tracking on separate sheets. Superseded by Barter rejected: the flooring labor barter.</p>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        {showQueue && <button type="button" className={cn(tab === "queue" && "font-semibold text-dpcp-navy")} onClick={() => setTab("queue")}>Approval queue</button>}
        <button type="button" className={cn(tab === "log" && "font-semibold text-dpcp-navy")} onClick={() => setTab("log")}>Log</button>
        {(app.ui.role === "george" || app.ui.role === "leader") && (
          <button type="button" className={cn(tab === "questions" && "font-semibold text-dpcp-navy")} onClick={() => setTab("questions")}>Open questions</button>
        )}
      </div>
      {tab === "log" && (
        <div className="space-y-2">
          {DECISION_LOG.map((row) => (
            <Surface key={row.id}>
              <p className="font-medium text-dpcp-navy">{row.title}</p>
              <p className="text-sm">{row.rule}</p>
              <p className="text-xs text-muted-foreground">{row.department} · {row.source} · {row.who} · {row.date}</p>
              {row.supersedes && <p className="text-sm">Supersedes {row.supersedes}</p>}
              {row.supersededBy && <p className="text-sm">Superseded by {row.supersededBy}</p>}
            </Surface>
          ))}
          {r4.superseded && <p className="text-sm">One decision is superseded by a later one: the flooring labor barter.</p>}
          <Button variant="outline" onClick={() => setConflict(true)}>Check a conflicting decision</Button>
          {conflict && (
            <Surface>
              <p className="text-sm">This new decision contradicts a logged one. Supersede?</p>
              <Button className="mt-2" onClick={() => { r4.supersedeBarter(); app.showToast("A person confirmed the supersede."); }}>Supersede</Button>
            </Surface>
          )}
          <p className="text-sm"><Link href="/knowledge" className="text-dpcp-blue">Suggest an SOP edit</Link></p>
        </div>
      )}
      {tab === "questions" && (
        <div className="space-y-2">
          {r4.questions.map((row) => (
            <Surface key={row.id}>
              <p className="font-medium text-dpcp-navy">{row.title}</p>
              <p className="text-sm">{row.owner} · {row.age}{row.parked ? ` · ${row.parked}` : ""}</p>
              <div className="mt-2 flex gap-2">
                <Button variant="outline" onClick={() => { r4.parkQuestion(row.id); app.showToast("Calendar invite drafted. Needs approval."); }}>Park for a task force</Button>
                <Button variant="outline" onClick={() => r4.closeQuestion(row.id)}>Close into the log</Button>
              </div>
            </Surface>
          ))}
          {r4.questions.length === 0 && <p className="text-sm">No open questions.</p>}
          <p className="text-xs text-muted-foreground">Seed questions included {OPEN_QUESTIONS.length}.</p>
        </div>
      )}
      {tab === "queue" && <p className="text-sm text-muted-foreground">The approval queue is below.</p>}
    </div>
  );
}

export function OutreachScreen() {
  const r4 = useRound4();
  const app = useApp();
  const [dept, setDept] = useState("Staffing");
  return (
    <PageFrame title="Outreach" lede="Same steps for staffing, construction barter, and marketing. A person approves the send.">
      <div className="mb-3 flex gap-2 text-sm">
        {["Staffing", "Construction", "Marketing"].map((name) => (
          <button key={name} type="button" className={cn("rounded-full px-3 py-2", dept === name && "bg-dpcp-navy text-white")} onClick={() => setDept(name)}>{name}</button>
        ))}
      </div>
      <p className="text-sm">Amina's recruiting profile · Suggested by AI · best time is 4–5 PM local.</p>
      <ol className="mt-3 space-y-2">
        {OUTREACH_STEPS.map((step) => {
          const textBlocked = step.kind === "text";
          return (
            <li key={step.n} className="rounded-2xl bg-white px-3 py-3 text-sm">
              <p>{step.n}. {step.label}</p>
              {textBlocked ? <p className="text-status-amber">Text stays off until consent is checked.</p> : <AiHuman ai={false} />}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 space-y-2">
        {CONSENT_ROWS.map((row) => (
          <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-3 py-2 text-sm">
            <span>{row.name}</span>
            <span>{r4.consent[row.id]}</span>
            <button type="button" className="text-dpcp-blue" disabled={r4.consent[row.id] !== "Consent to text ✓"} onClick={() => app.showToast(r4.consent[row.id] === "Consent to text ✓" ? "Text step available." : "Text is disabled.")}>
              Text
            </button>
            <button type="button" className="text-dpcp-blue" onClick={() => r4.setConsent(row.id, "Consent to text ✓")}>Mark consent</button>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {TEMPLATES.map((tpl) => (
          <Surface key={tpl.id}>
            <p className="font-medium text-dpcp-navy">{tpl.name}</p>
            <p className="text-sm">Approver {tpl.approver} · sends {tpl.sends} · replies {tpl.replies} · calls {tpl.calls} · {tpl.rate}</p>
          </Surface>
        ))}
      </div>
      <p className="mt-2 text-sm">v3 replies more often than v2. Approve and send is still a person.</p>
    </PageFrame>
  );
}

export function PortalsScreen() {
  const [blockedOnly, setBlockedOnly] = useState(false);
  return (
    <PageFrame title="Payer portal access" lede="Status only. Credentials stay in the team vault.">
      <button type="button" className="mb-3 text-sm text-dpcp-blue" onClick={() => setBlockedOnly((value) => !value)}>
        {blockedOnly ? "Show every cell" : "AR filter · can't work: no portal access"}
      </button>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="p-2">Practice</th>
              {PAYERS.map((payer) => <th key={payer} className="p-2">{payer}</th>)}
            </tr>
          </thead>
          <tbody>
            {PORTAL_PRACTICES.map((practice) => (
              <tr key={practice}>
                <td className="p-2">{practice}</td>
                {PAYERS.map((payer) => {
                  const cell = PORTAL_MATRIX[practice][payer];
                  if (blockedOnly && cell === "Access ✓") return <td key={payer} className="p-2" />;
                  return <td key={payer} className="p-2">{cell}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Surface className="mt-4">
        <p className="text-sm">MFA for Desert PPO at Saguaro is held by the practice owner role. Last successful login Oct 12. The login is stored in the team vault.</p>
        <p className="mt-2 text-sm">Lakeview is blocked from offshore on Desert PPO. About 40 paid claims have no follow-up. 8–10 denials are still fixable and feed the timely-filing countdown.</p>
        <p className="mt-2 text-sm">A gap opens a ticket. Fix before it expires.</p>
        <Link href="/tickets" className="text-sm text-dpcp-blue">Open the queue</Link>
      </Surface>
    </PageFrame>
  );
}

export function KitScreen() {
  const r4 = useRound4();
  return (
    <PageFrame title="Standard location kit" lede="HDG standard list, times the number of offices.">
      <label className="text-sm">
        Offices
        <input type="number" aria-label="Offices" value={r4.offices} onChange={(event) => r4.setOffices(Number(event.target.value) || 1)} className="ml-2 h-10 w-20 rounded-xl bg-muted px-2" />
      </label>
      <ul className="mt-3 space-y-2">
        {KIT_LINES.map((line) => (
          <li key={line.id} className="rounded-2xl bg-white px-3 py-2 text-sm">
            <p>{line.section} · {line.item}</p>
            <p>Qty {line.qty} × {r4.offices} offices = {line.qty * r4.offices}{line.flag ? ` · ${line.flag}` : ""}</p>
          </li>
        ))}
      </ul>
      <section className="mt-4">
        <h2 className="font-heading text-xl text-dpcp-navy">Quote vs sheet · {QUOTE_DIFFS.length} discrepancies</h2>
        <ul className="mt-2 list-disc pl-5 text-sm">
          {QUOTE_DIFFS.map((line) => <li key={line}>{line}</li>)}
        </ul>
        <p className="mt-2 text-sm">Jonas Keller and Theo March clear these before payment is approved.</p>
      </section>
    </PageFrame>
  );
}

export function AssetsScreen() {
  const r4 = useRound4();
  const app = useApp();
  return (
    <PageFrame title="Asset register" lede="What the company runs, and what is still on a personal account.">
      <ul className="space-y-2">
        {ASSETS.map((asset) => (
          <li key={asset.id} className={cn("rounded-2xl bg-white px-3 py-3 text-sm", asset.personal && "ring-1 ring-status-red")}>
            <p className="font-medium text-dpcp-navy">{asset.kind} · {asset.name}</p>
            <p>Owner {asset.owner} · {asset.account}{asset.clientOwned ? " · client-owned" : ""}</p>
            <p>Renewal {asset.renewal} · monthly cost sample ${asset.cost} · last healthy {asset.healthy}</p>
            <p>Stored in the team vault.{asset.stage ? ` ${asset.stage}.` : ""}{asset.failures ? ` Failures in 24h: ${asset.failures}. Primary down, backup idle.` : ""}</p>
            {asset.idle && <p>No use in 30 days. Cancel?</p>}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button disabled={app.ui.role !== "george" || r4.promoted} onClick={r4.promote}>
          {r4.promoted ? "Promoted" : "Promote to production"}
        </Button>
        {app.ui.role !== "george" && <p className="text-sm text-muted-foreground">George approves the promote.</p>}
      </div>
      <p className="mt-3 text-sm">Renewals feed Deadlines. A job that ran under a closed workspace is red.</p>
    </PageFrame>
  );
}

export function PlanCheckScreen() {
  const [scope, setScope] = useState("Plan check");
  return (
    <PageFrame title="Plan check" lede="AI pre-fills. A person signs off. Sample, not real pricing.">
      <ul className="space-y-2">
        {PLAN_RULES.map((rule) => (
          <li key={rule.id} className="rounded-2xl bg-white px-3 py-2 text-sm">
            <p className="font-medium text-dpcp-navy">{rule.label} · {rule.result}</p>
            <p>{rule.comment}</p>
          </li>
        ))}
      </ul>
      <Surface className="mt-4">
        <p className="font-medium text-dpcp-navy">Design-service intake</p>
        <label className="mt-2 block text-sm">
          Scope
          <select aria-label="Scope" className="mt-1 h-10 w-full rounded-xl bg-muted px-2" value={scope} onChange={(event) => setScope(event.target.value)}>
            <option>Blocking</option>
            <option>Full set</option>
            <option>Plan check</option>
          </select>
        </label>
        <p className="mt-2 text-sm">As-builts incomplete. Jurisdiction is on 2023. Turnaround is a sample week. Out of scope: onsite scanning, civil, and parking.</p>
        <p className="mt-2 text-sm">Architect weekly hours 24. Queue 3 drawings. Sample, not real pricing.</p>
      </Surface>
    </PageFrame>
  );
}

export function ScheduleScreen() {
  const [mode, setMode] = useState("Standard");
  const [days, setDays] = useState(2);
  return (
    <PageFrame title="Care team flow" lede="HDG standard, editable. Counts and slots only.">
      <div className="flex flex-wrap gap-2 text-sm">
        {["Standard", "Solo-new-doctor", "Seller-transition"].map((item) => (
          <button key={item} type="button" className={cn("rounded-full px-3 py-2", mode === item && "bg-dpcp-navy text-white")} onClick={() => setMode(item)}>{item}</button>
        ))}
      </div>
      <Surface className="mt-3">
        <p className="text-sm">Columns: doctor, hygiene, assisted hygiene. Templates for Copper Canyon (HDG) and Saguaro (client).</p>
        <p className="mt-2 text-sm">90-minute new patient = 30 doctor + 60 hygiene.</p>
        <p className="text-sm">SRP 1 hour per 2 quadrants.</p>
        <label className="mt-2 block text-sm">
          Release blocks
          <input type="number" aria-label="Release blocks" value={days} onChange={(event) => setDays(Number(event.target.value) || 0)} className="ml-2 h-10 w-16 rounded-xl bg-muted px-2" />
          days out
        </label>
        <p className="mt-2 text-sm">This template gives a new patient 3 hygiene openings within 9 days.</p>
      </Surface>
      <p className="mt-3 text-sm"><Link href="/training" className="text-dpcp-blue">Training module · Care team flow</Link></p>
    </PageFrame>
  );
}

export function StudyScreen() {
  const r4 = useRound4();
  const app = useApp();
  return (
    <PageFrame title="Time study" lede="Counts only. No screenshots. No pay figures.">
      <p className="text-sm">Office manager picks roles and a 1–2 week window. Two-clinic client. Posting vs follow-up.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {STUDY_FUNCTIONS.map((fn) => (
          <button key={fn} type="button" className="rounded-full bg-white px-3 py-2 text-sm shadow-sm" onClick={() => r4.tapStudy(fn)}>
            {fn} {r4.studyTaps[fn] ?? 0}
          </button>
        ))}
      </div>
      <Surface className="mt-4">
        <p className="text-sm">Hours by function sit next to the role-page mix. Posting is heavier than follow-up.</p>
        <p className="mt-2 text-sm">Could move to DPCP: verification and recare calls.</p>
        <p className="mt-2 text-sm">Suggested by AI: 3 front desk for a 12-operatory clinic.</p>
        <Button className="mt-3" variant="outline" onClick={() => app.showToast("Exported to Review and linked to the Balance resolution plan.")}>Export to Review</Button>
      </Surface>
    </PageFrame>
  );
}

export function RecareScreen() {
  const r4 = useRound4();
  const total = Object.values(r4.recareTaps).reduce((sum, n) => sum + n, 0);
  const outcomes = ["Booked", "Left message", "No answer", "Declined", "Bad number"];
  return (
    <PageFrame title="Recare calls" lede="A counter and a result. The patient list stays in the PMS.">
      <p className="text-sm">Goal <input aria-label="Daily goal" type="number" value={r4.recareGoal} onChange={(event) => r4.setRecareGoal(Number(event.target.value) || 0)} className="h-10 w-20 rounded-xl bg-muted px-2" /> per person per day. Editable per practice.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {outcomes.map((outcome) => (
          <button key={outcome} type="button" className="rounded-full bg-white px-3 py-2 text-sm" onClick={() => r4.tapRecare(outcome)}>{outcome}</button>
        ))}
      </div>
      <p className="mt-3 text-sm">{total} of {r4.recareGoal}. Team total {total + 40}.</p>
      <ul className="mt-3 text-sm">
        {RECARE_BUCKETS.map((bucket) => <li key={bucket.id}>{bucket.label}: {bucket.count}</li>)}
      </ul>
      <p className="mt-3 text-sm">Unconfirmed within 48 hours → release. Today’s release count: 6.</p>
      <Link href="/owner" className="text-sm text-dpcp-blue">Weekly attempts-to-booked · Balance 1.5</Link>
    </PageFrame>
  );
}
