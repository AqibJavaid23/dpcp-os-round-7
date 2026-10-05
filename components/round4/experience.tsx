"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PageFrame } from "@/components/app-shell";
import { RoleIcon } from "@/components/round6/homes";
import { ROLE_META } from "@/lib/round6/nav";
import { VoiceCall } from "@/components/round7/voice";
import { ProjectReader } from "@/components/round7/project";
import { StatusTag, Surface } from "@/components/bits";
import { Sheet, AiHuman } from "@/components/round3/ui";
import { Button } from "@/components/ui/button";
import {
  APPOINTMENTS,
  DEADLINES,
  NOTES_QUALITY,
  ORG_TREE,
  ORIENTATION_STEPS,
  OVERDUE_COUNT,
  OVERDUE_NO_PROOF,
  REVIEW_EXAMPLES,
  RINGS,
  TEAM_PROJECTS,
  USAGE_COMPARE,
  WEEK_DAYS,
  WINS,
  type Commitment,
} from "@/lib/round4/data";
import { orientationProgress, useRound4 } from "@/lib/round4/store";
import { useRound3 } from "@/lib/round3/store";
import { useApp } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

export const VIEWS: { role: Role; label: string }[] = [
  { role: "employee", label: "DPCP Employee" },
  { role: "leader", label: "DPCP Lead" },
  { role: "administrator", label: "DPCP Admin" },
  { role: "george", label: "George" },
  { role: "owner", label: "Practice Owner" },
];

export function viewLabel(role: Role) {
  return VIEWS.find((view) => view.role === role)?.label ?? "Employee";
}

export function SwitchView() {
  const app = useApp();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <PageFrame title="Switch view" lede="Each view is its own home. The preview stays on this page when that page exists for the view.">
      <div className="grid gap-3 sm:grid-cols-2">
        {VIEWS.map((view) => {
          const meta = ROLE_META[view.role];
          const current = app.ui.role === view.role;
          return (
            <button
              key={view.role}
              type="button"
              className={cn("rounded-3xl bg-white px-5 py-5 text-left shadow-[0_8px_30px_rgba(18,59,120,0.06)]", current && "ring-2")}
              style={current ? { borderColor: meta.accent, outline: `2px solid ${meta.accent}` } : undefined}
              onClick={() => {
                app.setRole(view.role);
                if (view.role === "owner" && (pathname === "/workday" || pathname === "/today")) router.push("/owner");
                else if (view.role !== "owner" && pathname === "/owner") router.push("/workday");
              }}
            >
              <RoleIcon role={view.role} color={meta.accent} />
              <p className="font-heading mt-3 text-xl" style={{ color: meta.accent }}>{meta.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{meta.line}</p>
              <p className="mt-2 text-xs" style={{ color: meta.accent }}>{current ? "Current view" : "Open this view"}</p>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="mt-3 w-full rounded-3xl bg-[#1c2430] px-5 py-5 text-left text-white"
        onClick={() => router.push("/desk")}
      >
        <p className="font-heading text-xl">Practice Level Team Member</p>
        <p className="mt-1 text-sm text-white/80">Shared computer at the office. Tap your name, then today's list. No login.</p>
      </button>
      <section className="mt-8">
        <h2 className="font-heading text-xl text-dpcp-navy">Department tab</h2>
        <p className="mt-1 text-sm text-muted-foreground">The tab just before More follows this person. Try three departments.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            ["nadia", "Nadia Reyes", "Insurance"],
            ["amina", "Amina Farouk", "Staffing"],
            ["theo", "Theo March", "Equipment"],
          ].map(([id, name, dept]) => (
            <button
              key={id}
              type="button"
              className="rounded-2xl bg-white px-4 py-4 text-left"
              onClick={() => {
                app.setPerson(id);
                router.push("/workday");
              }}
            >
              <p className="font-medium text-dpcp-navy">{dept}</p>
              <p className="text-sm text-muted-foreground">{name}</p>
            </button>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

export function AppointmentsToday() {
  const r4 = useRound4();
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-2xl text-dpcp-navy">Appointments today</h2>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-dpcp-navy shadow-sm" aria-label="Open calendar" onClick={() => r4.setCalendarOpen(true)}>
          <CalendarIcon />
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Calendar events. Not patient appointments.</p>
      <div className="mt-3 space-y-2">
        {APPOINTMENTS.map((item) => (
          <div key={item.id} className="flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-[0_8px_30px_rgba(18,59,120,0.05)]">
            <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-dpcp-navy">{item.time} · {item.title}</p>
              <p className="text-xs text-muted-foreground">{item.type}</p>
            </div>
            <Link href={item.join} className="text-sm text-dpcp-blue">Join</Link>
          </div>
        ))}
      </div>
      <CalendarSheet />
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </svg>
  );
}

export function CalendarSheet() {
  const r4 = useRound4();
  const [mode, setMode] = useState<"day" | "week">("day");
  return (
    <Sheet open={r4.calendarOpen} title="Calendar" onClose={() => r4.setCalendarOpen(false)}>
      <div className="mb-3 flex gap-2">
        <button type="button" className={cn("rounded-full px-3 py-2 text-sm", mode === "day" ? "bg-dpcp-navy text-white" : "bg-muted")} onClick={() => setMode("day")}>Day</button>
        <button type="button" className={cn("rounded-full px-3 py-2 text-sm", mode === "week" ? "bg-dpcp-navy text-white" : "bg-muted")} onClick={() => setMode("week")}>Week</button>
      </div>
      {mode === "day" ? (
        <ul className="space-y-2">
          {APPOINTMENTS.map((item) => (
            <li key={item.id} className="rounded-2xl bg-muted px-3 py-2 text-sm">{item.time} · {item.title}</li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-5 gap-1">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="rounded-xl bg-muted p-2 text-[11px]">
              <p className="font-medium text-dpcp-navy">{day}</p>
              {day.startsWith("Tue") && <p className="mt-1">4 events</p>}
            </div>
          ))}
        </div>
      )}
      <Link href="/calendar" className="mt-4 inline-block text-sm text-dpcp-blue" onClick={() => r4.setCalendarOpen(false)}>Full calendar</Link>
    </Sheet>
  );
}

export function CatchUpCard() {
  const r4 = useRound4();
  const app = useApp();
  if (app.ui.role === "owner") return null;
  return (
    <section className="mt-4 rounded-3xl bg-white px-5 py-4 shadow-[0_8px_30px_rgba(18,59,120,0.06)]">
      <p className="text-[11px] tracking-wide text-muted-foreground">Catch-up</p>
      <p className="mt-1 text-sm text-dpcp-navy">You were absent from yesterday's stand-up. Recap: the deposit date is still open, and two items are yours.</p>
      <p className="mt-2 text-sm">Your items: log the exceptions, and finish the make-up.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="outline" onClick={r4.readCatchup}>{r4.catchupRead ? "Recap read" : "Mark recap read"}</Button>
        <Button onClick={() => r4.openMakeup("Make-up stand-up")}>Complete make-up meeting</Button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{OVERDUE_COUNT} items overdue, {OVERDUE_NO_PROOF} with no proof.</p>
      <MakeupChat />
    </section>
  );
}

const CHAT_STEPS = [
  "Here is the agenda the team used.",
  "Here are the questions they answered.",
  "Your answers are recorded.",
  "Recap and action items are ready.",
  "A short summary is on the meeting record. The lead still confirms it.",
];

export function MakeupChat() {
  const r4 = useRound4();
  const [text, setText] = useState("");
  const agendas = ["What did you finish?", "What are you taking?", "What is blocking you?"];
  return (
    <Sheet open={r4.makeupChat.open} title={r4.makeupChat.kind} onClose={r4.closeMakeup}>
      <AiHuman ai={r4.makeupChat.step >= 4} />
      {r4.makeupChat.step < 4 && <span className="ml-2"><AiHuman ai={false} /></span>}
      <p className="mt-3 text-sm">{CHAT_STEPS[r4.makeupChat.step]}</p>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {agendas.map((line) => <li key={line}>{line}</li>)}
      </ul>
      {r4.makeupChat.answers.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {r4.makeupChat.answers.map((answer) => <li key={answer}>You: {answer}</li>)}
        </ul>
      )}
      {r4.makeupChat.step >= 4 ? (
        <p className="mt-3 text-sm">Done by AI. Needs a human: the lead confirms the summary.</p>
      ) : (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            if (!text.trim()) return;
            r4.answerMakeup(text.trim());
            setText("");
          }}
        >
          <input value={text} onChange={(event) => setText(event.target.value)} className="h-11 flex-1 rounded-2xl bg-muted px-3 text-sm" placeholder="Your answer" aria-label="Make-up answer" />
          <Button type="submit">Send</Button>
        </form>
      )}
    </Sheet>
  );
}

export function MakeupLauncher({ compact = false }: { compact?: boolean }) {
  const r4 = useRound4();
  return (
    <div className={compact ? "mb-4 flex flex-wrap gap-2" : "mb-4 flex flex-wrap gap-2"}>
      <Button onClick={() => r4.openMakeup("Make-up stand-up")}>Make-up stand-up</Button>
      <Button variant="outline" onClick={() => r4.openMakeup("Make-up update")}>Make-up update</Button>
      <MakeupChat />
    </div>
  );
}

export function MeetingsTools() {
  const r4 = useRound4();
  const [ledger, setLedger] = useState(false);
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => r4.openMakeup("Make-up meeting")}>Make-up meeting</Button>
        <Button variant="outline" onClick={() => r4.openMakeup("Make-up stand-up")}>Make-up stand-up</Button>
        <Button variant="outline" onClick={() => r4.openMakeup("Make-up update")}>Make-up update</Button>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-dpcp-navy shadow-sm" aria-label="Take notes" onClick={() => r4.saveNote("header", r4.notes.header ?? "")}>
          <span aria-hidden>✎</span>
        </button>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-dpcp-navy shadow-sm" aria-label="Open the commitments ledger" onClick={() => setLedger(true)}>
          <span aria-hidden>☰</span>
        </button>
        <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-dpcp-navy shadow-sm" aria-label="Make-up stand-up" onClick={() => r4.openMakeup("Make-up stand-up")}>
          <span aria-hidden>↻</span>
        </button>
      </div>
      <MakeupChat />
      {ledger && (
        <div className="mt-4">
          <Ledger />
          <button type="button" className="mt-2 text-sm text-dpcp-blue" onClick={() => setLedger(false)}>Hide ledger</button>
        </div>
      )}
    </div>
  );
}

export function notesLabel(meetingId: string, typed?: string) {
  if (typed && typed.trim()) return { label: "Typed notes", tone: "blue" as const };
  return NOTES_QUALITY[meetingId] ?? null;
}

export function Ledger() {
  const app = useApp();
  const r4 = useRound4();
  const [owner, setOwner] = useState("all");
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [noProof, setNoProof] = useState(false);
  const [series, setSeries] = useState("all");
  const [department, setDepartment] = useState("all");
  const [proof, setProof] = useState("");
  const [reason, setReason] = useState("");
  const lead = app.ui.role === "leader" || app.ui.role === "george" || app.ui.role === "administrator";
  const rows = r4.commitments.filter((row) => {
    if (app.ui.role === "employee" && row.ownerId !== app.viewer.id) return false;
    if (app.ui.role === "leader" && row.department !== "Insurance" && row.ownerId !== app.viewer.id) return false;
    if (owner !== "all" && row.owner !== owner) return false;
    if (overdueOnly && !row.overdue) return false;
    if (noProof && (row.proof || row.status === "Done" || row.status === "Dropped")) return false;
    if (series !== "all" && row.series !== series) return false;
    if (department !== "all" && row.department !== department) return false;
    return true;
  });
  const owners = Array.from(new Set(r4.commitments.map((row) => row.owner)));
  const departments = Array.from(new Set(r4.commitments.map((row) => row.department)));
  return (
    <section>
      <h2 className="font-heading text-xl text-dpcp-navy">Commitments</h2>
      <p className="mt-1 text-sm text-muted-foreground">New Location Team (Wed/Fri) · 6 occurrences · {r4.commitments.length} items. {OVERDUE_COUNT} overdue, {OVERDUE_NO_PROOF} with no proof.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <select aria-label="Owner" className="h-10 rounded-xl bg-muted px-2" value={owner} onChange={(event) => setOwner(event.target.value)}>
          <option value="all">All owners</option>
          {owners.map((name) => <option key={name}>{name}</option>)}
        </select>
        <select aria-label="Series" className="h-10 rounded-xl bg-muted px-2" value={series} onChange={(event) => setSeries(event.target.value)}>
          <option value="all">All series</option>
          <option>New Location Team (Wed/Fri)</option>
        </select>
        <select aria-label="Department" className="h-10 rounded-xl bg-muted px-2" value={department} onChange={(event) => setDepartment(event.target.value)}>
          <option value="all">All departments</option>
          {departments.map((name) => <option key={name}>{name}</option>)}
        </select>
        <button type="button" className={cn("rounded-full px-3", overdueOnly && "bg-dpcp-navy text-white")} onClick={() => setOverdueOnly((value) => !value)}>Overdue</button>
        <button type="button" className={cn("rounded-full px-3", noProof && "bg-dpcp-navy text-white")} onClick={() => setNoProof((value) => !value)}>No proof</button>
      </div>
      <ul className="mt-3 space-y-2">
        {rows.slice(0, 12).map((row) => (
          <CommitmentRow key={row.id} row={row} lead={lead} proof={proof} reason={reason} setProof={setProof} setReason={setReason} />
        ))}
      </ul>
      {rows.length > 12 && <p className="mt-2 text-xs text-muted-foreground">{rows.length - 12} more in this filter.</p>}
      <MakeupCompliance />
    </section>
  );
}

function CommitmentRow({
  row,
  lead,
  proof,
  reason,
  setProof,
  setReason,
}: {
  row: Commitment;
  lead: boolean;
  proof: string;
  reason: string;
  setProof: (value: string) => void;
  setReason: (value: string) => void;
}) {
  const r4 = useRound4();
  return (
    <li className="rounded-2xl bg-white px-3 py-3 text-sm shadow-sm">
      <p className="font-medium text-dpcp-navy">{row.title}</p>
      <p className="text-xs text-muted-foreground">{row.owner} · {row.department} · occurrence {row.occurrence} · due {row.originalDue} → {row.currentDue}{row.carried ? ` · carried ${row.carried}` : ""}</p>
      <p className="mt-1">{row.status}{row.overdue ? " · overdue" : ""}{row.proof ? ` · ${row.proof}` : ""}{row.dropReason ? ` · ${row.dropReason}` : ""}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "Done", { proof: proof || `File · ${row.id}` })}>Done</button>
        <button type="button" className="text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "In progress")}>Still on it</button>
        <button type="button" className="text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "In progress")}>Blocked</button>
        <button type="button" className="text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "Dropped", { dropReason: reason || "No longer needed" })}>Drop</button>
      </div>
      <input value={proof} onChange={(event) => setProof(event.target.value)} placeholder="Proof link" aria-label="Proof link" className="mt-2 h-10 w-full rounded-xl bg-muted px-2 text-sm" />
      {lead && (
        <button type="button" className="mt-1 text-xs text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "Done", { proof: reason || "No link: explain" })}>
          No link: explain
        </button>
      )}
      {lead && <input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Lead explanation" aria-label="Lead explanation" className="mt-1 h-10 w-full rounded-xl bg-muted px-2 text-sm" />}
    </li>
  );
}

export function StillOpen() {
  const r4 = useRound4();
  const rows = r4.commitments.filter((row) => row.status !== "Done" && row.status !== "Dropped").slice(0, 6);
  return (
    <Surface className="mt-4">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Still open</p>
      <ul className="mt-2 space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="text-sm">
            <p>{row.title}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <button type="button" className="text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "Done", { proof: row.proof || `File · ${row.id}` })}>Done</button>
              <button type="button" className="text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "In progress")}>Still on it</button>
              <button type="button" className="text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "In progress")}>Blocked</button>
              <button type="button" className="text-dpcp-blue" onClick={() => r4.setCommitment(row.id, "Dropped", { dropReason: "Dropped from this meeting" })}>Drop</button>
            </div>
          </li>
        ))}
      </ul>
    </Surface>
  );
}

export function MakeupCompliance() {
  const r4 = useRound4();
  const app = useApp();
  const overdue = r4.makeup.filter((row) => row.status === "overdue");
  const show = app.ui.role === "leader" || app.ui.role === "george" || app.ui.role === "administrator";
  if (!show) return null;
  return (
    <div className="mt-4 rounded-2xl bg-status-red-bg px-4 py-3 text-sm text-status-red">
      <p className="font-medium">Make-up meetings overdue</p>
      {overdue.length === 0 && <p>None. Completing a make-up clears it.</p>}
      {overdue.map((row) => (
        <p key={row.id} className="mt-1">{row.person} · {row.team} · {row.kind} · due {row.due}</p>
      ))}
      <p className="mt-2 text-xs">Counts per person and per team. A missed make-up is a compliance failure.</p>
    </div>
  );
}

export function TakeNotes({ meetingId }: { meetingId: string }) {
  const r4 = useRound4();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(r4.notes[meetingId] ?? "");
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Take notes</Button>
      <Sheet open={open} title="Take notes" onClose={() => setOpen(false)}>
        <p className="text-sm">Typed notes. Gemini notes stay on the meeting when the host has shared them.</p>
        <textarea
          value={text}
          aria-label="Typed notes"
          onChange={(event) => {
            setText(event.target.value);
            r4.saveNote(meetingId, event.target.value);
          }}
          className="mt-3 min-h-28 w-full rounded-2xl bg-muted px-3 py-2 text-sm"
        />
        <p className="mt-2 text-sm">Saved on this meeting. {text ? `Typed notes: ${text}` : "Typed notes are empty."}</p>
      </Sheet>
    </>
  );
}

export function AbsentButton({ kind = "Make-up stand-up" }: { kind?: "Make-up stand-up" | "Make-up update" }) {
  const app = useApp();
  const r4 = useRound4();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>I'll be absent</Button>
      <Sheet open={open} title="I'll be absent" onClose={() => setOpen(false)}>
        <label className="text-sm">
          Reason (optional)
          <input value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1 h-11 w-full rounded-2xl bg-muted px-3 text-sm" />
        </label>
        <Button
          className="mt-3"
          onClick={() => {
            r4.markAbsent({ personId: app.viewer.id, person: app.viewer.name, team: "Your team", kind, reason });
            app.showToast("Complete make-up meeting is due by the end of the next business day.");
            setOpen(false);
          }}
        >
          Create make-up task
        </Button>
      </Sheet>
    </>
  );
}

export function TeamOps() {
  const app = useApp();
  const [call, setCall] = useState<string | null>(null);
  const lead = app.ui.role === "leader" || app.ui.role === "george";
  return (
    <section className="mb-8 space-y-3">
      <div className="mb-3 flex flex-wrap gap-2">
        <Button onClick={() => setCall("Make-up daily stand-up")}>Make-up daily stand-up</Button>
        <Button onClick={() => setCall("Make-up daily update")}>Make-up daily update</Button>
      </div>
      {call && <VoiceCall title={call} onClose={() => setCall(null)} />}
      {!lead && TEAM_PROJECTS.map((project) => (
        <Surface key={project.id}>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{project.team}</p>
          <p className="font-heading text-lg text-dpcp-navy">{project.name}</p>
          <p className="mt-1 text-sm">Owner {project.owner} · {project.status} · next {project.next}</p>
          <p className="text-sm text-muted-foreground">Blocker: {project.blocker} · due {project.due}</p>
        </Surface>
      ))}
      <Surface>
        <p className="font-medium text-dpcp-navy">Open commitments</p>
        <p className="mt-1 text-sm">{OVERDUE_COUNT} overdue, {OVERDUE_NO_PROOF} with no proof. <Link className="text-dpcp-blue" href="/meetings">Open the ledger</Link></p>
      </Surface>
      <Surface>
        <p className="font-medium text-dpcp-navy">Decisions and questions</p>
        <p className="mt-1 text-sm">Ordering and shipment tracking stay on separate sheets.</p>
      </Surface>
      <MakeupCompliance />
      <Surface>
        <p className="font-medium text-dpcp-navy">Escalation</p>
        <p className="mt-1 text-sm">Ask the lead first, then operations, then George.</p>
      </Surface>
      <Surface>
        <p className="font-medium text-dpcp-navy">Weekly ops scorecard</p>
        <p className="mt-1 text-sm">Items done with proof 50% · make-ups completed 80% · deadlines at risk 5</p>
      </Surface>
      {lead && (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => app.showToast("Confirmed. Needs a human only where a lead still has to sign.")}>Confirm all</Button>
          <Button variant="outline" onClick={() => app.showToast("Reassigned on this team.")}>Reassign</Button>
          <Button variant="outline" onClick={() => app.showToast("Nudge drafted. Approve and send.")}>Nudge</Button>
        </div>
      )}
    </section>
  );
}

export function WinsCulture() {
  const app = useApp();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const featured = WINS[0];
  return (
    <section className="mt-12">
      <h2 className="font-heading text-2xl text-dpcp-navy">Wins & Culture</h2>
      <button type="button" onClick={() => setOpen(true)} className="mt-3 w-full overflow-hidden rounded-[28px] bg-dpcp-navy-deep px-6 py-8 text-left text-white">
        <p className="text-xs tracking-[0.18em] text-white/70 uppercase">{featured.kind}</p>
        <p className="font-heading mt-3 text-3xl leading-tight">{featured.title}</p>
        <p className="mt-3 max-w-md text-sm text-white/80">The week gets a moment. Tap to add your own.</p>
      </button>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {WINS.slice(1).map((win) => (
          <button key={win.id} type="button" className="rounded-3xl bg-white px-4 py-4 text-left shadow-sm" onClick={() => setOpen(true)}>
            <p className="text-[11px] tracking-wide text-dpcp-blue uppercase">{win.kind}</p>
            <p className="mt-1 font-heading text-lg text-dpcp-navy">{win.title}</p>
          </button>
        ))}
      </div>
      <p className="mt-4 rounded-3xl border border-dashed border-dpcp-tint bg-white px-4 py-4 text-sm text-dpcp-navy">Our core values (coming soon)</p>
      <Sheet open={open} title="Shout-out" onClose={() => setOpen(false)}>
        <textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-24 w-full rounded-2xl bg-muted px-3 py-2 text-sm" placeholder="Who made the day better?" />
        <Button className="mt-3" onClick={() => { app.showToast("Drafted. Approve and send."); setOpen(false); }}>Approve and send</Button>
      </Sheet>
    </section>
  );
}

export function ReviewDeck() {
  const [open, setOpen] = useState<string | null>(null);
  const item = REVIEW_EXAMPLES.find((row) => row.id === open);
  if (item) return <ProjectReader item={item} onBack={() => setOpen(null)} />;
  return (
    <div className="space-y-3">
      {REVIEW_EXAMPLES.map((row) => (
        <button key={row.id} type="button" className="w-full rounded-3xl bg-white px-5 py-5 text-left shadow-[0_8px_30px_rgba(18,59,120,0.06)]" onClick={() => setOpen(row.id)}>
          <h2 className="font-heading text-2xl tracking-tight text-dpcp-navy">{row.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{row.forWhom}</p>
        </button>
      ))}
    </div>
  );
}

export function WhereYouFit() {
  const [open, setOpen] = useState<string | null>("you");
  const ring = RINGS.find((item) => item.id === open) ?? RINGS[0];
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl text-dpcp-navy">Where you fit</h2>
      <div className="mt-4 flex flex-col items-center">
        {RINGS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpen(item.id)}
            className="flex items-center justify-center rounded-full border border-dpcp-tint text-sm text-dpcp-navy"
            style={{ width: 280 - index * 48, height: 64, marginTop: index === 0 ? 0 : -8, background: index === 3 ? "#0B254B" : index === 2 ? "#123B78" : index === 1 ? "#0081CE" : "#BFD0E8", color: index >= 1 ? "white" : "#123B78" }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <Surface className="mt-4">
        <p className="font-medium text-dpcp-navy">{ring.label}</p>
        <p className="mt-1 text-sm">{ring.mission}</p>
        <p className="mt-2 text-sm text-muted-foreground">{ring.id === "company" ? "Dental Practice Copilot" : "People on this ring sit in People & Org."}</p>
      </Surface>
    </section>
  );
}

export function OrientationForm() {
  const r4 = useRound4();
  const progress = orientationProgress(r4.orientationDone);
  const training = r4.showTraining || (progress === 100 && r4.leadConfirmed);
  return (
    <section className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-heading text-2xl text-dpcp-navy">{training ? "Training" : "Orientation"}</h2>
        <button type="button" className="text-sm text-dpcp-blue" onClick={() => r4.setShowTraining(!r4.showTraining)}>
          {r4.showTraining ? "View orientation" : "View training"}
        </button>
      </div>
      <div className="mt-3 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-dpcp-blue" style={{ width: `${training && r4.showTraining ? 100 : progress}%` }} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{progress}% · lead {r4.leadConfirmed ? "confirmed" : "has not confirmed"}</p>
      {training ? (
        <Surface className="mt-3">
          <p className="text-sm">Modules are open, including Care team flow.</p>
          <Link href="/schedule" className="mt-2 inline-block text-sm text-dpcp-blue">Care team flow</Link>
          <Link href="/training" className="mt-2 block text-sm text-dpcp-blue">Training paths</Link>
        </Surface>
      ) : (
        <ul className="mt-3 space-y-2">
          {ORIENTATION_STEPS.map((step) => (
            <li key={step.id}>
              <button type="button" className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left text-sm" onClick={() => r4.toggleStep(step.id)}>
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border", r4.orientationDone[step.id] && "bg-dpcp-navy text-white")}>{r4.orientationDone[step.id] ? "✓" : ""}</span>
                {step.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <Button className="mt-3" variant="outline" onClick={r4.confirmLead}>Lead confirms</Button>
    </section>
  );
}

export function UsageComparisons() {
  return (
    <section className="mt-8 space-y-3">
      <h2 className="font-heading text-xl text-dpcp-navy">Comparisons</h2>
      <Surface>
        <p className="text-sm font-medium text-dpcp-navy">You vs your history</p>
        <p className="mt-1 text-sm">Week tasks {USAGE_COMPARE.selfWeek.join(" · ")}</p>
        <p className="text-sm">Month tasks {USAGE_COMPARE.selfMonth.join(" · ")}</p>
      </Surface>
      <Surface>
        <p className="text-sm font-medium text-dpcp-navy">Other departments</p>
        {USAGE_COMPARE.departments.map((row) => (
          <p key={row.name} className="text-sm">{row.name} · average {row.tasks} tasks</p>
        ))}
      </Surface>
      <Surface>
        <p className="text-sm font-medium text-dpcp-navy">Whole company</p>
        <p className="mt-1 text-sm">Average {USAGE_COMPARE.companyAvg} tasks · percentile {USAGE_COMPARE.percentile}</p>
      </Surface>
    </section>
  );
}

export function OrgTree() {
  const [open, setOpen] = useState<string | null>(ORG_TREE[0].team);
  const [tab, setTab] = useState<"tree" | "raci" | "paths">("tree");
  return (
    <section className="mb-6">
      <div className="mb-3 flex flex-wrap gap-2 text-sm">
        <button type="button" className={cn(tab === "tree" && "font-semibold text-dpcp-navy")} onClick={() => setTab("tree")}>Teams</button>
        <button type="button" className={cn(tab === "raci" && "font-semibold text-dpcp-navy")} onClick={() => setTab("raci")}>RACI</button>
        <button type="button" className={cn(tab === "paths" && "font-semibold text-dpcp-navy")} onClick={() => setTab("paths")}>Escalation</button>
      </div>
      {tab === "tree" && ORG_TREE.map((team) => (
        <div key={team.team} className="mb-2 rounded-2xl bg-white p-3">
          <button type="button" className="text-left" onClick={() => setOpen(open === team.team ? null : team.team)}>
            <p className="font-medium text-dpcp-navy">{team.team}</p>
            <p className="text-xs text-muted-foreground">{team.mission} · lead {team.lead}</p>
          </button>
          {open === team.team && team.pods.map((pod) => (
            <div key={pod.name} className="mt-2 pl-3">
              <p className="text-sm">{pod.name}</p>
              <ul className="text-sm text-muted-foreground">
                {pod.people.map((person) => <li key={person}>{person}{person === team.lead ? " · lead" : ""}</li>)}
              </ul>
            </div>
          ))}
        </div>
      ))}
      {tab === "raci" && (
        <Surface>
          <p className="text-sm">Facilities questions go to the New Location lead first. Credentialing is Nadia Reyes. Recruiting is Amina Farouk. A dotted line runs from marketing launch to the New Location lead.</p>
          <p className="mt-2 text-sm">George-time: 6 questions reached him, 4 came through a lead, 2 skipped the lead and are flagged.</p>
        </Surface>
      )}
      {tab === "paths" && (
        <Surface>
          <p className="text-sm">Ask the lead first, then operations, then George. A question that skipped the lead is flagged. It is not held back.</p>
          <p className="mt-2 text-sm">Official channel per department. The AI can offer: Move to the Staffing channel?</p>
        </Surface>
      )}
      <p className="mt-2 text-sm"><Link href="/admin" className="text-dpcp-blue">Permissions</Link></p>
    </section>
  );
}

export function DeadlineStrip() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {DEADLINES.map((item) => (
        <Link key={item.id} href="/launch#deadlines" className={cn("min-w-[200px] rounded-2xl px-3 py-2 text-xs no-underline", item.days <= 0 ? "bg-status-red-bg text-status-red" : item.days <= 2 ? "bg-status-red-bg text-status-red" : "bg-status-amber-bg text-status-amber")}>
          <p className="font-medium">{item.date} · {item.stake}</p>
          <p>{item.detail}</p>
          <p>{item.owner}</p>
        </Link>
      ))}
    </div>
  );
}

export function DeptModuleLinks({ copilotId }: { copilotId: string }) {
  const links = [
    ["/launch#deadlines", "Deadlines"],
    copilotId === "staffing" || copilotId === "construction" || copilotId === "marketing" ? ["/outreach", "Outreach"] : null,
    copilotId === "insurance" ? ["/portals", "Portal access"] : null,
    copilotId === "supplies" || copilotId === "equipment" ? ["/kit", "Standard kit"] : null,
    copilotId === "construction" ? ["/plan-check", "Plan check"] : null,
    copilotId === "it" || copilotId === "marketing" ? ["/assets", "Asset register"] : null,
  ].filter(Boolean) as [string, string][];
  return (
    <div className="mb-4 space-y-3">
      <DeadlineStrip />
      <div className="flex flex-wrap gap-2">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-full bg-[#E7EEF6] px-3 py-1 text-xs text-dpcp-navy no-underline">{label}</Link>
        ))}
      </div>
    </div>
  );
}

export function SettingsExtras() {
  const r3 = useRound3();
  return (
    <div className="mt-3 space-y-3">
      <Surface>
        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Theme</p>
        <div className="mt-2 flex gap-2">
          <Button variant="outline" onClick={() => r3.setTheme("light")}>Light</Button>
          <Button variant="outline" onClick={() => r3.setTheme("dark")}>Dark</Button>
        </div>
      </Surface>
      <Surface>
        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Integration health</p>
        <p className="mt-2 text-sm">Gmail connected · Slack connected · Time Doctor connected · stored in the team vault</p>
      </Surface>
      <Surface>
        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Kill switches</p>
        <p className="mt-2 text-sm">Nightly report can be paused from Admin.</p>
        <Link href="/admin" className="text-sm text-dpcp-blue">Open admin</Link>
      </Surface>
      <Surface>
        <Link href="/design" className="text-sm text-dpcp-blue">Design gallery</Link>
        <Link href="/screens" className="mt-2 block text-sm text-dpcp-blue">All screens</Link>
        <Link href="/system" className="mt-2 block text-sm text-dpcp-blue">System health</Link>
        <Link href="/activity" className="mt-2 block text-sm text-dpcp-blue">AI activity</Link>
        <Link href="/mobile" className="mt-2 block text-sm text-dpcp-blue">Mobile</Link>
      </Surface>
    </div>
  );
}

export function AskInMessage({ subject }: { subject: string }) {
  const skipped = /george|facilities|hood/i.test(subject);
  return (
    <div className="mt-3 rounded-2xl bg-[#E7EEF6] px-3 py-3 text-sm text-dpcp-navy">
      <p>Facilities questions go to the New Location lead first.</p>
      {skipped && <p className="mt-1 text-status-amber">Flagged: this question skipped the lead. It is not held back.</p>}
      <p className="mt-2">Move to the Staffing channel?</p>
    </div>
  );
}

export function GeorgeTime() {
  const app = useApp();
  if (app.ui.role !== "george") return null;
  return (
    <Surface className="mb-4">
      <p className="text-sm font-medium text-dpcp-navy">George-time</p>
      <p className="mt-1 text-sm">6 questions reached you · 4 through a lead · 2 skipped the lead and are flagged.</p>
    </Surface>
  );
}

export function RecarePanel() {
  const r4 = useRound4();
  const total = Object.values(r4.recareTaps).reduce((sum, n) => sum + n, 0);
  const outcomes = ["Booked", "Left message", "No answer", "Declined", "Bad number"];
  return (
    <section className="rounded-[28px] bg-white p-4">
      <p className="text-xs tracking-wide text-[#6d6456] uppercase">Recare calls</p>
      <p className="mt-1 text-sm">Goal {r4.recareGoal} attempts. Counts only. No patient list.</p>
      <label className="mt-2 block text-sm">
        Goal
        <input type="number" value={r4.recareGoal} aria-label="Recare goal" onChange={(event) => r4.setRecareGoal(Number(event.target.value) || 0)} className="ml-2 h-10 w-20 rounded-xl bg-[#f7f1e6] px-2" />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        {outcomes.map((outcome) => (
          <button key={outcome} type="button" className="rounded-full bg-[#f7f1e6] px-3 py-2 text-sm" onClick={() => r4.tapRecare(outcome)}>
            {outcome} {r4.recareTaps[outcome] ?? 0}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm">{total} of {r4.recareGoal} · team total {total + 40}</p>
      <p className="mt-2 text-sm">Unconfirmed within 48 hours → release. Today’s release count: 6.</p>
      <Link href="/owner" className="mt-2 inline-block text-sm text-dpcp-blue">Balance 1.5</Link>
    </section>
  );
}

export function ScheduleCompare() {
  return (
    <section className="rounded-[28px] bg-white p-4 text-sm">
      <p className="font-medium">Today versus template</p>
      <p className="mt-1">Chair hours on the template: 36. Filled slots: 31. Counts only.</p>
    </section>
  );
}

export function TimeStudyChips() {
  const r4 = useRound4();
  const functions = ["Check-in", "Phones", "Scheduling", "Verification", "Posting", "AR follow-up", "Treatment coordination", "Recare calls", "Downtime"];
  return (
    <section className="rounded-[28px] bg-white p-4">
      <p className="text-sm font-medium">What are you working on?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {functions.map((fn) => (
          <button key={fn} type="button" className="rounded-full bg-[#f7f1e6] px-3 py-2 text-sm" onClick={() => r4.tapStudy(fn)}>
            {fn} {r4.studyTaps[fn] ?? 0}
          </button>
        ))}
      </div>
    </section>
  );
}
