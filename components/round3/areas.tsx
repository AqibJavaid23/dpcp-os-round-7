"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { StatusTag } from "@/components/bits";
import { PRACTICES, practiceById } from "@/lib/round2/data";
import { useApp } from "@/lib/store";
import { ALERTS, AUDIT, BAAS, BENCHMARK, CLIENTS, DEVICES, FINDINGS, HEALTH, HIRES, INTEGRATIONS, MODULES_TRAIN, PATHS, PERMISSIONS, ROLE_PRESET, SHIFTS, TIERS, WORKFORCE, ACTIONS, servicesFor } from "@/lib/round3/catalog";
import { SOPS } from "@/lib/round3/knowledge";
import { useRound3 } from "@/lib/round3/store";
import { DEPT_META, slaState } from "@/lib/round3/tickets";
import { AiHuman, DraftLabel, Gate, SampleBanner, Segmented, Sheet, Spark } from "@/components/round3/ui";
import { cn } from "@/lib/utils";

export function PerformanceScreen() {
  const r3 = useRound3();
  const app = useApp();
  const [sort, setSort] = useState<"score" | "name">("score");
  const [book, setBook] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const rows = HEALTH.filter((row) => book === "all" || practiceById(row.practiceId)?.kind === book).slice().sort((a, b) => (sort === "name" ? a.practiceId.localeCompare(b.practiceId) : b.score - a.score));
  return (
    <PageFrame title="Practice performance" lede="Every practice, then the one that needs a person.">
      <Gate>
        <SampleBanner />
        <div className="mt-3 flex flex-wrap gap-2">
          <Segmented value={book} onChange={setBook} options={[{ id: "all", label: "All" }, { id: "hdg", label: "HDG" }, { id: "client", label: "Client" }]} />
          <button type="button" className="min-h-11 text-sm text-dpcp-blue" onClick={() => setSort(sort === "score" ? "name" : "score")}>
            Sort by {sort === "score" ? "name" : "score"}
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {rows.map((row) => {
            const practice = practiceById(row.practiceId)!;
            return (
              <article key={row.practiceId} className="rounded-2xl bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-heading text-lg text-dpcp-navy">{practice.name}</h2>
                  <StatusTag>{practice.kind === "hdg" ? "HDG" : "Client"}</StatusTag>
                </div>
                <p className="font-heading text-3xl text-dpcp-navy">{row.score} <span className="text-base">{row.trend[11].value >= row.trend[0].value ? "↑" : "↓"}</span></p>
                <p className="text-xs text-muted-foreground">Health score · goal 80</p>
                <p className="mt-2 text-sm">{row.note}</p>
                <DraftLabel />
                <div className="mt-3 flex gap-3 text-sm">
                  <button type="button" className="text-dpcp-blue" onClick={() => setOpen(row.practiceId)}>Open</button>
                  <button type="button" className="text-dpcp-blue" onClick={() => setCompare((list) => list.includes(row.practiceId) ? list.filter((id) => id !== row.practiceId) : [...list, row.practiceId].slice(-2))}>
                    {compare.includes(row.practiceId) ? "Compared" : "Compare"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        {compare.length === 2 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {compare.map((id) => {
              const row = HEALTH.find((item) => item.practiceId === id)!;
              return <p key={id} className="rounded-2xl bg-muted p-4 text-sm">{practiceById(id)?.name}: score {row.score}, checklist {row.checklist}%, satisfaction {row.satisfaction}</p>;
            })}
          </div>
        )}
        <section className="mt-8">
          <h2 className="font-heading text-2xl text-dpcp-navy">Alerts</h2>
          <ul className="mt-3 space-y-2">
            {ALERTS.map((alert) => (
              <li key={alert.id} className="rounded-2xl bg-white p-4 text-sm">
                <StatusTag tone={alert.tone === "red" ? "red" : "amber"}>{alert.rule}</StatusTag>
                <p className="mt-2">{practiceById(alert.practiceId)?.name}. {alert.detail}</p>
                <p className="text-muted-foreground">Owner {alert.owner}. {alert.action}</p>
                <button type="button" className="mt-2 min-h-11 text-dpcp-blue" onClick={() => r3.ackAlert(alert.id)}>{r3.ackedAlerts[alert.id] ? "Acknowledged" : "Acknowledge"}</button>
              </li>
            ))}
          </ul>
        </section>
        <Sheet open={Boolean(open)} title={open ? practiceById(open)?.name ?? "" : ""} onClose={() => setOpen(null)}>
          {open && <PracticeDetail id={open} />}
        </Sheet>
        <button type="button" className="mt-4 text-sm text-dpcp-blue" onClick={() => app.handToReview("Monthly practice report", "Portfolio snapshot. Drafted by AI. Sample. It stays in Review until a person approves it.")}>Export a monthly practice report</button>
      </Gate>
    </PageFrame>
  );
}

function PracticeDetail({ id }: { id: string }) {
  const row = HEALTH.find((item) => item.practiceId === id)!;
  const practice = practiceById(id)!;
  const client = practice.kind === "client";
  return (
    <div className="space-y-3 text-sm">
      <p className="font-heading text-3xl text-dpcp-navy">{row.score} <span className="text-base">↑</span></p>
      <p className="text-xs text-muted-foreground">Goal 80</p>
      <Spark values={row.trend.map((point) => point.value)} />
      <p>Collections ${row.collections.toLocaleString("en-US")} · goal ${row.collectionsGoal.toLocaleString("en-US")}</p>
      <p>Checklist {row.checklist}% · open issues {row.openIssues} · SLA breaches {row.slaBreaches} · satisfaction {row.satisfaction}</p>
      <p>{row.note}</p>
      {client && <p className="text-muted-foreground">HDG benchmark, anonymized: checklist {BENCHMARK.checklist}%, satisfaction {BENCHMARK.satisfaction}. {BENCHMARK.label}</p>}
      <p className="text-xs">Open issues come from the same tickets as the queue. <Link href="/tickets/" className="text-dpcp-blue">Tickets</Link></p>
      <Link href="/owner/" className="text-dpcp-blue">Owner page for this book</Link>
    </div>
  );
}

export function WorkforceScreen() {
  const r3 = useRound3();
  const app = useApp();
  const [view, setView] = useState("mine");
  const me = WORKFORCE[0];
  return (
    <PageFrame title="Workforce" lede="Time is counted in the app. AI only describes it.">
      <Gate>
        <SampleBanner />
        <Segmented value={view} onChange={setView} options={[{ id: "mine", label: "My work" }, { id: "team", label: "Team" }, { id: "report", label: "Daily report" }, { id: "trends", label: "Execution" }, { id: "practice", label: "Practice staff" }]} />
        {view === "mine" && (
          <section className="mt-4 rounded-2xl bg-white p-4">
            <h2 className="font-heading text-xl text-dpcp-navy">{me.name}</h2>
            <p className="text-sm text-muted-foreground">{me.activeHours} h tracked today. {me.done} of {me.planned} tasks done.</p>
            <AiHuman ai={false} />
            <p className="mt-2 text-sm">Done by AI {me.aiShare}% · hours saved estimate {me.hoursSaved}. {me.metadataOnly && "Insurance team: activity metadata only. No screen images."}</p>
            {me.systemFailure && <p className="mt-2 text-sm text-status-blue">{me.systemFailure}</p>}
            <div className="mt-3 flex gap-2">
              <button type="button" className="min-h-11 rounded-full bg-dpcp-blue px-4 text-white" onClick={() => r3.startDay(me.id)}>{r3.started[me.id] ? "Started" : "I'm starting"}</button>
              <button type="button" className="min-h-11 rounded-full bg-muted px-4" onClick={() => r3.endDay(me.id)}>{r3.ended[me.id] ? "Day closed" : "End the day"}</button>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {["Review appeal draft", "Clear three ERA exceptions", "Call the office about a missing narrative"].map((task, index) => (
                <li key={task} className="rounded-xl bg-muted px-3 py-2">{index < me.done ? "Done · " : "Planned · "}{task}</li>
              ))}
            </ul>
          </section>
        )}
        {view === "team" && (
          <ul className="mt-4 space-y-2">
            {[...WORKFORCE].sort((a, b) => a.name.localeCompare(b.name)).map((person) => (
              <li key={person.id} className="rounded-2xl bg-white p-4 text-sm">
                <p className="font-medium text-dpcp-navy">{person.name} · {person.team}</p>
                <p>Started {person.startedAt} · active {person.activeHours} h · {person.done} of {person.planned} · on time {person.onTime}/{person.planned}</p>
                <p className="text-muted-foreground">Blocker: {person.blockers}. Idle incidents: {person.idle}. Not a ranking.</p>
              </li>
            ))}
          </ul>
        )}
        {view === "report" && (
          <section className="mt-4 space-y-3">
            <p className="text-sm">Pre-send check: no Invalid Date. Every person is on this page. Sample.</p>
            {WORKFORCE.map((person) => (
              <article key={person.id} className="rounded-2xl bg-white p-4 text-sm">
                <h3 className="font-heading text-lg text-dpcp-navy">{person.name}</h3>
                <p>First activity {person.startedAt}. Last activity 10:42 AM. Time by task: DPCP OS {person.activeHours} h.</p>
                <p>Top apps: {person.apps}. Idle incidents: {person.idle}. Yesterday: {Math.max(person.done - 1, 1)} tasks.</p>
                <p><DraftLabel /> {person.name.split(" ")[0]} kept the morning queue moving and left one item with a person.</p>
              </article>
            ))}
            <button type="button" className="min-h-11 rounded-full bg-dpcp-blue px-4 text-white" onClick={() => app.handToReview("Daily workforce report", "End-of-day report. Drafted by AI. Every person is listed. No Invalid Date. It stays in Review.")}>Send the preview to Review</button>
          </section>
        )}
        {view === "trends" && (
          <ul className="mt-4 space-y-2">
            {WORKFORCE.map((person) => (
              <li key={person.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 text-sm">
                <span>{person.name}</span>
                <Spark values={[72, 76, 80, Math.round((person.onTime / person.planned) * 100)]} />
                <span>{Math.round((person.onTime / person.planned) * 100)} <span className="text-muted-foreground">goal 85 · 4 weeks</span></span>
              </li>
            ))}
          </ul>
        )}
        {view === "practice" && (
          <ul className="mt-4 space-y-2">
            {SHIFTS.map((shift) => (
              <li key={shift.name} className="rounded-2xl bg-white p-4 text-sm">
                <p className="font-medium">{shift.name} · {shift.role}</p>
                <p>{shift.inToday ? "In today" : "Off"} · checklist {shift.checklist}% · {shift.training}</p>
                <p className="text-xs text-muted-foreground">{practiceById(shift.practiceId)?.name}. Practice staff are tracked by lists and tasks, not Time Doctor.</p>
              </li>
            ))}
          </ul>
        )}
      </Gate>
    </PageFrame>
  );
}

export function TrainingScreen() {
  const r3 = useRound3();
  const [path, setPath] = useState(PATHS[0].id);
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [view, setView] = useState("paths");
  const modules = MODULES_TRAIN.filter((item) => item.path === path);
  return (
    <PageFrame title="Training" lede="A short lesson, then a quiz. A person signs the skills that need one.">
      <Gate>
        <SampleBanner />
        <Segmented value={view} onChange={setView} options={[{ id: "paths", label: "Paths" }, { id: "hires", label: "New hires" }, { id: "manager", label: "Manager" }]} />
        {view === "paths" && (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {PATHS.map((item) => (
                <button key={item.id} type="button" className={cn("min-h-11 rounded-full px-3 text-sm", path === item.id ? "bg-dpcp-navy text-white" : "bg-white")} onClick={() => setPath(item.id)}>
                  {item.title}
                </button>
              ))}
            </div>
            <ul className="mt-4 space-y-2">
              {modules.map((item, index) => {
                const passed = r3.quizPasses[`me:${item.id}`];
                return (
                  <li key={item.id}>
                    <button type="button" className="flex w-full items-center justify-between rounded-2xl bg-white p-4 text-left" onClick={() => setModuleId(item.id)}>
                      <span>
                        <span className="text-xs text-muted-foreground">{index + 1} · {item.minutes} min</span>
                        <span className="block">{item.title}</span>
                      </span>
                      <span className="text-sm">{passed ? "Passed" : "Start"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {view === "hires" && (
          <ul className="mt-4 space-y-2">
            {HIRES.map((hire) => (
              <li key={hire.name} className="rounded-2xl bg-white p-4 text-sm">
                <p className="font-medium text-dpcp-navy">{hire.name} · {hire.role}</p>
                <p>Day {hire.day}. Modules {hire.modules}. {hire.checkins}.</p>
                <p>{hire.signed ? "Supervisor signed." : "Waiting on a supervisor sign-off."}</p>
              </li>
            ))}
            <p className="text-xs text-muted-foreground">Day 7, 30, and 90 reuse the staffing check-in. Sample until Monday's program arrives.</p>
          </ul>
        )}
        {view === "manager" && (
          <ul className="mt-4 space-y-2 text-sm">
            {MODULES_TRAIN.map((item) => (
              <li key={item.id} className="rounded-2xl bg-white p-4">
                {item.title} · pass mark {item.pass} of {item.questions.length}
                {item.unlocks && <span> · unlocks {item.unlocks}</span>}
              </li>
            ))}
          </ul>
        )}
        <Player id={moduleId} onClose={() => setModuleId(null)} />
      </Gate>
    </PageFrame>
  );
}

function Player({ id, onClose }: { id: string | null; onClose: () => void }) {
  const r3 = useRound3();
  const item = MODULES_TRAIN.find((module) => module.id === id);
  const sop = SOPS.find((row) => row.id === item?.sopId);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string | null>(null);
  if (!item) return null;
  const score = item.questions.filter((question, index) => answers[index] === question.answer).length;
  return (
    <Sheet open title={item.title} onClose={onClose}>
      <div className="rounded-2xl bg-dpcp-navy-deep p-4 text-white">
        <p className="text-xs text-white/70">Sample video · captions on</p>
        <p className="mt-2 text-sm">{item.captions}</p>
      </div>
      <p className="mt-3 text-sm">{sop?.summary}</p>
      <ol className="mt-2 list-decimal pl-5 text-sm">
        {sop?.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <div className="mt-4 space-y-3">
        {item.questions.map((question, index) => (
          <fieldset key={question.q}>
            <legend className="text-sm">{question.q}</legend>
            {question.choices.map((choice, choiceIndex) => (
              <label key={choice} className="mt-1 flex min-h-11 items-center gap-2 text-sm">
                <input type="radio" name={`q-${index}`} checked={answers[index] === choiceIndex} onChange={() => setAnswers((current) => ({ ...current, [index]: choiceIndex }))} />
                {choice}
              </label>
            ))}
          </fieldset>
        ))}
      </div>
      <button type="button" className="mt-3 min-h-11 rounded-full bg-dpcp-blue px-4 text-white" onClick={() => {
        if (score >= item.pass) {
          r3.passQuiz(`me:${item.id}`);
          setResult(item.unlocks ? `Passed. You can sign off ${item.unlocks}.` : "Passed.");
        } else setResult("Not yet. Retake when you're ready.");
      }}>Check</button>
      {result && <p className="mt-2 text-sm">{result}</p>}
      <p className="mt-3 text-sm"><DraftLabel /> Ask about this SOP from the floating mark. It answers from the library.</p>
    </Sheet>
  );
}

export function ClientsScreen() {
  const r3 = useRound3();
  const [id, setId] = useState<string | null>("saguaro");
  const [step, setStep] = useState(0);
  const account = CLIENTS.find((item) => item.practiceId === id);
  const steps = ["Pick services", "Connect the PMS", "Enroll devices", "Import the roster", "Agreements"];
  return (
    <PageFrame title="Client practices" lede="Same work as an HDG office. The tag and the services change.">
      <Gate>
        <SampleBanner />
        <p className="mt-2 text-xs text-status-amber">Sample, not real pricing.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <article key={tier.id} className="rounded-2xl bg-white p-4 text-sm">
              <h2 className="font-heading text-lg text-dpcp-navy">{tier.name}</h2>
              <p>{tier.price}</p>
              <p className="text-muted-foreground">{tier.includes.join(", ")}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {CLIENTS.map((item) => (
            <button key={item.practiceId} type="button" className={cn("min-h-11 rounded-full px-3 text-sm", id === item.practiceId ? "bg-dpcp-navy text-white" : "bg-white")} onClick={() => setId(item.practiceId)}>
              {practiceById(item.practiceId)?.name}
            </button>
          ))}
        </div>
        {account && (
          <article className="mt-4 rounded-2xl bg-white p-4 text-sm">
            <h2 className="font-heading text-xl text-dpcp-navy">{practiceById(account.practiceId)?.name}</h2>
            <p>{account.tier} · {account.contact} · renews {account.renewal}</p>
            <p>Health {account.health} · satisfaction {account.satisfaction}</p>
            <p>Services: {account.services.join(", ")}</p>
            <p className="mt-2">{account.cross}</p>
            <button type="button" className="mt-2 min-h-11 text-dpcp-blue" onClick={() => r3.askUpgrade(account.practiceId)}>{r3.upgradeAsks.includes(account.practiceId) ? "Upgrade requested" : "Request an upgrade"}</button>
            <h3 className="mt-4 font-medium">Onboarding</h3>
            <ol className="mt-2 space-y-1">
              {account.onboard.map((item) => <li key={item.step}>{item.done ? "Done" : "Open"} · {item.step}</li>)}
            </ol>
            <h3 className="mt-4 font-medium">Invoices</h3>
            <ul>
              {account.invoices.map((invoice) => <li key={invoice.id}>{invoice.month} · {invoice.amount} · {invoice.status}</li>)}
            </ul>
          </article>
        )}
        <section className="mt-6">
          <h2 className="font-heading text-xl text-dpcp-navy">Start a client</h2>
          <p className="text-sm">Step {step + 1} of {steps.length}: {steps[step]}</p>
          <button type="button" className="mt-2 min-h-11 rounded-full bg-dpcp-blue px-4 text-white" onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>{step === steps.length - 1 ? "Agreement status: signed in this sample" : "Next"}</button>
        </section>
        <p className="mt-4 text-xs text-muted-foreground">HDG offices are on every copilot: {servicesFor("copper").join(", ")}.</p>
      </Gate>
    </PageFrame>
  );
}

export function AdminScreen() {
  const r3 = useRound3();
  const [view, setView] = useState("people");
  const [person, setPerson] = useState("employee");
  const people = [
    ["Nadia Reyes", "employee", "Insurance"],
    ["Omar Hale", "lead", "Insurance"],
    ["Rowan Blake", "admin", "IT"],
    ["A release seat", "release", "Platform"],
    ["Dr. Mara Ellison", "practice owner", "Copper Canyon"],
    ["Casey Nguyen", "practice staff", "Copper Canyon"],
  ];
  return (
    <PageFrame title="Admin and security" lede="Least access. Money needs a different person than the one who asked.">
      <Gate>
        <SampleBanner />
        <Segmented value={view} onChange={setView} options={[{ id: "people", label: "People" }, { id: "permissions", label: "Permissions" }, { id: "audit", label: "Audit" }, { id: "hipaa", label: "Data" }, { id: "devices", label: "Devices" }, { id: "integrations", label: "Integrations" }, { id: "flags", label: "Kill switches" }]} />
        {view === "people" && (
          <ul className="mt-4 space-y-2 text-sm">
            {people.map(([name, role, team]) => (
              <li key={name} className="rounded-2xl bg-white p-4">
                <p className="font-medium text-dpcp-navy">{name}</p>
                <p>{role} · {team}. A person can lead one team and belong to another. Sample.</p>
              </li>
            ))}
          </ul>
        )}
        {view === "permissions" && (
          <div className="mt-4 overflow-x-auto">
            <div className="mb-2 flex flex-wrap gap-2">
              {Object.keys(ROLE_PRESET).map((role) => (
                <button key={role} type="button" className={cn("min-h-11 rounded-full px-3 text-sm", person === role ? "bg-dpcp-navy text-white" : "bg-white")} onClick={() => setPerson(role)}>{role}</button>
              ))}
            </div>
            <table className="w-full text-left text-sm">
              <thead><tr><th>Area</th>{ACTIONS.map((action) => <th key={action}>{action}</th>)}</tr></thead>
              <tbody>
                {PERMISSIONS.map((area) => (
                  <tr key={area} className="border-t border-border">
                    <td className="py-2">{area}</td>
                    {ACTIONS.map((action) => <td key={action}>{(ROLE_PRESET[person]?.[area] ?? []).includes(action) ? "Yes" : "—"}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-muted-foreground">Money is approve-only for a practice owner, and the requester is never the releaser.</p>
          </div>
        )}
        {view === "audit" && (
          <ul className="mt-4 space-y-2 text-sm">
            {[...r3.auditExtra, ...AUDIT].map((row) => (
              <li key={row.id} className="rounded-2xl bg-white p-4">
                {row.at} · {row.who} · {row.action}
                {"flagged" in row && row.flagged ? <span className="ml-2 text-status-amber">Admin read of a message body</span> : null}
              </li>
            ))}
            <button type="button" className="text-dpcp-blue" onClick={() => r3.logAudit("George", "Audit", "Exported the audit log. Sample.")}>Export</button>
          </ul>
        )}
        {view === "hipaa" && (
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-2xl bg-[#E7EEF6] p-4">No PHI until a BAA. Insurance screens link out. Patient identifiers in this prototype are fake initials.</p>
            <ul>{BAAS.map((row) => <li key={row.vendor} className="rounded-2xl bg-white p-3">{row.vendor} · {row.status} · {row.date}</li>)}</ul>
            <p>PHI screen hits this month: 0 copies. Retention: 18 months, sample. Access review due Nov 1. MFA coverage: 26 of 28 sample seats. Privacy notice: 26 acknowledged.</p>
            {FINDINGS.map((finding) => <p key={finding.id} className="rounded-2xl bg-white p-3">{finding.title} · {finding.owner} · due {finding.due}</p>)}
          </div>
        )}
        {view === "devices" && (
          <ul className="mt-4 space-y-2 text-sm">
            {DEVICES.map((device) => (
              <li key={device.id} className="rounded-2xl bg-white p-4">
                <p className="font-medium">{practiceById(device.practiceId)?.name} · {device.name}</p>
                <p>Last seen {device.lastSeen}. Expires {device.expires}. {device.pin}.</p>
                <button type="button" className="mt-2 min-h-11 text-status-red" onClick={() => r3.revokeDevice(device.id)}>{r3.revokedDevices[device.id] ? "Revoked" : "Revoke now"}</button>
              </li>
            ))}
          </ul>
        )}
        {view === "integrations" && (
          <ul className="mt-4 space-y-2 text-sm">
            {INTEGRATIONS.map((item) => (
              <li key={item.id} className="rounded-2xl bg-white p-4">
                <p className="font-medium text-dpcp-navy">{item.name}</p>
                <p>{r3.integrations[item.id] ? "Disconnected in this sample" : item.health} · last sync {item.sync} · {item.owner}</p>
                {item.gate && <p className="text-status-amber">A production automation change waits for George.</p>}
                <button type="button" className="mt-2 min-h-11 text-dpcp-blue" onClick={() => r3.toggleIntegration(item.id)}>{r3.integrations[item.id] ? "Connect" : "Disconnect"}</button>
              </li>
            ))}
          </ul>
        )}
        {view === "flags" && (
          <ul className="mt-4 space-y-2 text-sm">
            {Object.keys(r3.flags).map((flag) => (
              <li key={flag} className="flex items-center justify-between rounded-2xl bg-white p-4">
                <span>{flag}</span>
                <button type="button" className="min-h-11 text-dpcp-blue" onClick={() => r3.toggleFlag(flag)}>{r3.flags[flag] === false ? "Off" : "On"}</button>
              </li>
            ))}
          </ul>
        )}
      </Gate>
    </PageFrame>
  );
}

export function AiScreens() {
  const r3 = useRound3();
  const [view, setView] = useState("activity");
  const [reason, setReason] = useState("");
  const [rejectId, setRejectId] = useState<string | null>(null);
  const open = r3.approvals.filter((item) => item.state === "open");
  return (
    <PageFrame title="AI activity" lede="What the bots did, what they're doing, and what is waiting on a person.">
      <Gate>
        <SampleBanner />
        <Segmented value={view} onChange={setView} options={[{ id: "activity", label: "Activity" }, { id: "approvals", label: "Approvals" }]} />
        {view === "activity" && (
          <ul className="mt-4 space-y-2">
            {r3.activity.map((item) => (
              <li key={item.id} className="rounded-2xl bg-white p-4 text-sm">
                <div className="flex flex-wrap gap-2"><StatusTag tone={item.status === "Working" ? "blue" : item.status === "Done" ? "green" : "amber"}>{item.status}</StatusTag><AiHuman ai /></div>
                <p className="mt-2 font-medium text-dpcp-navy">{item.department} · {item.time}</p>
                <p>Input {item.input}. Output {item.output}.</p>
                <p className="text-muted-foreground">Risk {item.risk}. No spend cap. Usage sits on the usage page.</p>
              </li>
            ))}
          </ul>
        )}
        {view === "approvals" && (
          <div className="mt-4 space-y-4">
            {(["outbound", "money", "commitment", "data"] as const).map((risk) => (
              <section key={risk}>
                <h2 className="font-heading text-lg text-dpcp-navy">{risk}</h2>
                <ul className="mt-2 space-y-2">
                  {r3.approvals.filter((item) => item.risk === risk).map((item) => (
                    <li key={item.id} className="rounded-2xl bg-white p-4 text-sm">
                      <p className="font-medium">{item.title}</p>
                      <p>{item.why}</p>
                      <p className="text-xs text-muted-foreground">{item.department} · {item.state}{item.reason ? ` · ${item.reason}` : ""}</p>
                      {item.state === "open" && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button type="button" className="min-h-11 rounded-full bg-dpcp-blue px-3 text-white" onClick={() => r3.decideApproval(item.id, "approved")}>Approve</button>
                          <button type="button" className="min-h-11 rounded-full bg-muted px-3" onClick={() => setRejectId(item.id)}>Reject</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {open.length === 0 && <p className="text-sm">Nothing is waiting.</p>}
          </div>
        )}
        <Sheet open={Boolean(rejectId)} title="Why not?" onClose={() => setRejectId(null)}>
          <textarea className="w-full rounded-2xl bg-muted p-3" rows={3} value={reason} onChange={(event) => setReason(event.target.value)} aria-label="Reason" />
          <button type="button" className="mt-3 min-h-11 rounded-full bg-dpcp-blue px-4 text-white" onClick={() => { if (rejectId && reason.trim()) { r3.decideApproval(rejectId, "rejected", reason.trim()); setRejectId(null); setReason(""); } }}>Reject</button>
        </Sheet>
      </Gate>
    </PageFrame>
  );
}

export function MobileScreen() {
  const r3 = useRound3();
  const [tab, setTab] = useState("brief");
  const [note, setNote] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const brief = "3 decisions. Copper Canyon recare is the priority. Lakeview AR is the alert. One cart is over the limit.";
  useEffect(() => {
    window.localStorage.setItem("dpcp-mobile-brief", brief);
  }, [brief]);
  return (
    <PageFrame title="DPCP OS Mobile" lede="The phone home for a doctor, an owner, or a lead.">
      <Gate>
        <div className="mx-auto max-w-sm">
          {!unlocked ? (
            <button type="button" className="mt-6 flex min-h-40 w-full flex-col items-center justify-center rounded-3xl bg-dpcp-navy-deep text-white" onClick={() => setUnlocked(true)}>
              <span className="text-3xl">Face ID</span>
              <span className="mt-2 text-sm text-white/70">Sample unlock. Tap to open the last brief, even offline.</span>
            </button>
          ) : (
            <>
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {[["brief", "Brief"], ["approvals", "Approvals"], ["practices", "Practices"], ["tickets", "Tickets"], ["team", "Team"]].map(([id, label]) => (
                  <button key={id} type="button" className={cn("min-h-12 rounded-full px-3", tab === id ? "bg-dpcp-navy text-white" : "bg-white")} onClick={() => setTab(id)}>{label}</button>
                ))}
              </div>
              {tab === "brief" && (
                <article className="mt-4 rounded-3xl bg-white p-5">
                  <p className="text-xs text-muted-foreground">This morning</p>
                  <p className="mt-2 text-lg">{brief}</p>
                  <p className="mt-3 text-sm">Health 74 · Copper Canyon. Alert: Lakeview AR. <Link href="/owner/" className="text-dpcp-blue">Owner page</Link></p>
                </article>
              )}
              {tab === "approvals" && (
                <ul className="mt-4 space-y-3">
                  {r3.approvals.filter((item) => item.state === "open").map((item) => (
                    <li key={item.id} className="rounded-3xl bg-white p-4">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">Swipe in spirit: the buttons are thumb-sized. Money and outbound ask again.</p>
                      <div className="mt-3 flex gap-2">
                        <button type="button" className="min-h-14 flex-1 rounded-full bg-status-green text-white" onClick={() => (item.risk === "money" || item.risk === "outbound" ? setConfirm(item.id) : r3.decideApproval(item.id, "approved"))}>Approve</button>
                        <button type="button" className="min-h-14 flex-1 rounded-full bg-muted" onClick={() => r3.decideApproval(item.id, "rejected", "Sent back from the phone.")}>Send back</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {tab === "practices" && (
                <ul className="mt-4 space-y-2">
                  {PRACTICES.map((practice) => (
                    <li key={practice.id}><Link href="/owner/" className="block rounded-3xl bg-white p-4 no-underline">{practice.name}<span className="mt-1 block text-sm text-muted-foreground">{practice.kind === "hdg" ? "HDG" : "Client"} · open the owner page</span></Link></li>
                  ))}
                </ul>
              )}
              {tab === "tickets" && (
                <ul className="mt-4 space-y-2">
                  {r3.tickets.filter((ticket) => ticket.status === "new" || ticket.status === "progress").slice(0, 6).map((ticket) => (
                    <li key={ticket.id} className="rounded-3xl bg-white p-4 text-sm">
                      <p>{ticket.title}</p>
                      <p className="text-muted-foreground">{DEPT_META[ticket.department].label} · {slaState(ticket).breach ? "SLA breach" : "On the clock"}</p>
                      <Link href="/tickets/" className="text-dpcp-blue">Reply or escalate</Link>
                    </li>
                  ))}
                </ul>
              )}
              {tab === "team" && (
                <div className="mt-4 rounded-3xl bg-white p-4 text-sm">
                  <p>In today: {SHIFTS.filter((shift) => shift.inToday).map((shift) => shift.name.split(" ")[0]).join(", ")}.</p>
                  <p className="mt-2">Coverage gap: Owen is off. Friday at Red Rock still needs a hygienist.</p>
                  <p className="mt-2">Win: hygiene reappointment at Saguaro hit 91%.</p>
                  <button type="button" className="mt-3 min-h-12 text-dpcp-blue" onClick={() => setNote("Nice work on the morning list.")}>Shout-out</button>
                </div>
              )}
              <label className="mt-4 block text-sm">
                Quick note
                <textarea className="mt-1 w-full rounded-2xl bg-white p-3" rows={2} value={note} onChange={(event) => setNote(event.target.value)} aria-label="Quick note" />
              </label>
              <button type="button" className="mt-2 min-h-12 text-sm text-dpcp-blue" onClick={() => setNote("Sample voice note: check the recare list before lunch.")}>Voice to text</button>
              <p className="mt-3 text-xs text-muted-foreground">Push, sample: one alert, one escalation, one approval. The last brief is saved on this phone.</p>
            </>
          )}
          <Sheet open={Boolean(confirm)} title="Send this?" onClose={() => setConfirm(null)}>
            <p className="text-sm">Money and outbound messages ask one more time.</p>
            <button type="button" className="mt-3 min-h-12 w-full rounded-full bg-dpcp-blue text-white" onClick={() => { if (confirm) r3.decideApproval(confirm, "approved"); setConfirm(null); }}>Approve</button>
            <button type="button" className="mt-2 min-h-12 w-full text-sm" onClick={() => setConfirm(null)}>Cancel</button>
          </Sheet>
        </div>
      </Gate>
    </PageFrame>
  );
}

export function DesignScreen() {
  const r3 = useRound3();
  const [open, setOpen] = useState(false);
  return (
    <PageFrame title="Design" lede="Every component, in one place, for a daily look-and-feel pass.">
      <div className="flex gap-2">
        <button type="button" className="min-h-11 rounded-full bg-white px-3" onClick={() => r3.setTheme("light")}>Light</button>
        <button type="button" className="min-h-11 rounded-full bg-dpcp-navy px-3 text-white" onClick={() => r3.setTheme("dark")}>Dark</button>
      </div>
      <div className="mt-6 space-y-6">
        <section>
          <h2 className="font-heading text-xl text-dpcp-navy">Buttons</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className="min-h-11 rounded-full bg-dpcp-blue px-4 text-white">Approve</button>
            <button type="button" className="min-h-11 rounded-full bg-white px-4">Cancel</button>
          </div>
        </section>
        <section className="rounded-2xl bg-white p-4 shadow-[var(--r3-shadow)]">
          <h2 className="font-heading text-xl text-dpcp-navy">Card</h2>
          <p className="text-sm">One idea. Soft corner. Light shadow.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl text-dpcp-navy">Status</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusTag tone="green">On track</StatusTag>
            <StatusTag tone="amber">Due soon</StatusTag>
            <StatusTag tone="red">Blocked</StatusTag>
            <StatusTag tone="blue">AI working</StatusTag>
            <StatusTag>Not started</StatusTag>
          </div>
        </section>
        <section>
          <button type="button" className="min-h-11 text-dpcp-blue" onClick={() => setOpen(true)}>Open a sheet</button>
          <Sheet open={open} title="Sheet" onClose={() => setOpen(false)}><p className="text-sm">Sheets slide up. Work stays behind them.</p></Sheet>
        </section>
        <section>
          <h2 className="font-heading text-xl text-dpcp-navy">Empty</h2>
          <p className="rounded-2xl bg-white p-4 text-sm">Nothing here yet. The next step is one button.</p>
        </section>
      </div>
    </PageFrame>
  );
}

export function MyDay({ role, name, practiceId }: { role: string; name: string; practiceId: string }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const tasks = tasksFor(role, practiceId);
  const open = tasks.filter((task) => !done[task]);
  const closed = tasks.filter((task) => done[task]);
  return (
    <div className="space-y-3">
      <section className="rounded-[28px] bg-white p-4">
        <p className="text-xs tracking-wide text-[#6d6456] uppercase">Preview of the day</p>
        <p className="mt-2 text-sm">{previewFor(role, name)}</p>
      </section>
      <section className="rounded-[28px] bg-white p-4">
        <h2 className="font-heading text-xl">To-do</h2>
        <ul className="mt-2 space-y-2">
          {open.map((task) => (
            <li key={task}>
              <button type="button" className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-[#f7f1e6] px-3 text-left text-sm" onClick={() => setDone((current) => ({ ...current, [task]: true }))}>
                <span className="h-6 w-6 rounded-full border border-[#1c2430]" />
                {task}
              </button>
            </li>
          ))}
          {open.length === 0 && <li className="text-sm text-[#6d6456]">The list is clear.</li>}
        </ul>
      </section>
      <section className="rounded-[28px] bg-white p-4">
        <h2 className="font-heading text-xl">Completed</h2>
        <ul className="mt-2 space-y-2">
          {closed.map((task) => (
            <li key={task} className="flex items-center gap-3 text-sm line-through opacity-70">
              <span className="day-check flex h-6 w-6 items-center justify-center rounded-full bg-[#1f6b4a] text-xs text-white">✓</span>
              {task}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function tasksFor(role: string, practiceId: string) {
  if (role === "Hygiene") return ["Set up the room", "Sterilizer is ready", "Book the next visit at the chair", "Note a low glove box"];
  if (role === "Assistants") return ["Turn the last op", "Cassette count", "Lab cases due today, count only", "Sign the sterilizer check if you passed"];
  if (role === "Office manager") return [`${practiceId === "copper" ? "Open-the-day is at 80%" : "Lists are caught up"}`, "See who is in and who is off", "One cart is waiting", "Training still open for one person"];
  if (role === "Doctors") return ["Production is on pace in the sample", "One clinical substitution needs you", "A hire note is waiting", "The team hit a reappointment high"];
  return ["Huddle card is on the counter", "Confirmations, count only", "Two calls to mark scheduled or seen", "Insurance verifications are in", "Open requests", "Close the day"];
}

function previewFor(role: string, name: string) {
  if (role === "Doctors") return `${name.split(" ")[0]}, three decisions and a full book. No patient names on this card.`;
  if (role === "Office manager") return "Coverage is one person short this afternoon. One approval is waiting.";
  if (role === "Hygiene") return "Your room is set. One supply is low. Training is due this week.";
  if (role === "Assistants") return "Turnover is the morning. One cassette is out for repair.";
  return "Huddle first. Confirmations are a count. The open requests are on the tracker.";
}
