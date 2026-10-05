"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_MONTH, monthsFor, type PracticeMonth } from "@/lib/round3/balance";
import { seedTickets, type Ticket, type TicketDept, type TicketPriority, type TicketStatus } from "@/lib/round3/tickets";
import { APPROVALS, AI_ACTIVITY } from "@/lib/round3/catalog";

export interface ResolutionPlan {
  id: string;
  practiceId: string;
  month: string;
  part: number;
  metric: string;
  text: string;
  owner: string;
  requestIds: string[];
  reviewDate: string;
  outcome: "open" | "resolved" | "keep";
  before?: string;
  after?: string;
}

export interface ApprovalItem {
  id: string;
  title: string;
  risk: "outbound" | "money" | "commitment" | "data";
  department: string;
  why: string;
  state: "open" | "approved" | "rejected";
  reason?: string;
}

export interface ActivityItem {
  id: string;
  department: string;
  status: string;
  time: string;
  input: string;
  output: string;
  risk: string;
}

export interface ReportDraft {
  id: string;
  reviewId: string;
  practiceId: string;
  month: string;
  text: string;
}

interface Round3 {
  tickets: Ticket[];
  addTicket: (input: { practiceId: string; requester: string; department: TicketDept; type: string; priority: TicketPriority; title: string; body: string; phi?: boolean; photo?: string }) => string;
  setTicketStatus: (id: string, status: TicketStatus) => void;
  reassignTicket: (id: string, department: TicketDept, reason: string) => void;
  replyTicket: (id: string, text: string, visibility: "practice" | "internal") => void;
  rateTicket: (id: string, score: number, note: string) => void;
  reopenTicket: (id: string) => void;
  linkDuplicate: (id: string, originalId: string) => void;
  plans: ResolutionPlan[];
  savePlan: (plan: Omit<ResolutionPlan, "id" | "outcome"> & { id?: string }) => void;
  setPlanOutcome: (id: string, outcome: ResolutionPlan["outcome"]) => void;
  notes: Record<string, string>;
  saveNote: (practiceId: string, month: string, part: number, text: string) => void;
  overrides: Record<string, PracticeMonth>;
  saveAssessment: (month: PracticeMonth) => void;
  month: string;
  setMonth: (month: string) => void;
  approvals: ApprovalItem[];
  decideApproval: (id: string, state: "approved" | "rejected", reason?: string) => void;
  addApproval: (item: Omit<ApprovalItem, "id" | "state">) => void;
  activity: ActivityItem[];
  flags: Record<string, boolean>;
  toggleFlag: (id: string) => void;
  ackedAlerts: Record<string, boolean>;
  ackAlert: (id: string) => void;
  revokedDevices: Record<string, boolean>;
  revokeDevice: (id: string) => void;
  integrations: Record<string, boolean>;
  toggleIntegration: (id: string) => void;
  started: Record<string, boolean>;
  ended: Record<string, boolean>;
  startDay: (personId: string) => void;
  endDay: (personId: string) => void;
  quizPasses: Record<string, boolean>;
  passQuiz: (key: string) => void;
  reports: ReportDraft[];
  addReport: (report: ReportDraft) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  upgradeAsks: string[];
  askUpgrade: (practiceId: string) => void;
  auditExtra: { id: string; at: string; who: string; where: string; action: string }[];
  logAudit: (who: string, where: string, action: string) => void;
}

const Round3Context = createContext<Round3 | null>(null);

const SEED_PLANS: ResolutionPlan[] = [
  {
    id: "plan-copper-aug",
    practiceId: "copper",
    month: "2026-08",
    part: 1,
    metric: "1.7",
    text: "Book the next hygiene visit at the chair, before checkout.",
    owner: "Robin Hale",
    requestIds: ["tr-2"],
    reviewDate: "2026-09-20",
    outcome: "resolved",
    before: "78%",
    after: "82%",
  },
  {
    id: "plan-copper-sep",
    practiceId: "copper",
    month: "2026-09",
    part: 1,
    metric: "1.5",
    text: "Work the overdue recare list and run a reactivation campaign. Hygiene keeps booking at the chair.",
    owner: "Robin Hale",
    requestIds: ["mk-3", "tr-1"],
    reviewDate: "2026-11-03",
    outcome: "open",
  },
];

function noteKey(practiceId: string, month: string, part: number) {
  return `${practiceId}:${month}:${part}`;
}

export function Round3Provider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(() => seedTickets());
  const [plans, setPlans] = useState<ResolutionPlan[]>(SEED_PLANS);
  const [notes, setNotes] = useState<Record<string, string>>({
    [noteKey("copper", "2026-09", 1)]: "Recare is the leak. The chair booking work moved reappointment. The active base is still unscheduled. Sample.",
  });
  const [overrides, setOverrides] = useState<Record<string, PracticeMonth>>({});
  const [month, setMonth] = useState(DEFAULT_MONTH);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(() =>
    APPROVALS.map((item) => ({
      id: item.id,
      title: item.title,
      risk: item.risk as ApprovalItem["risk"],
      department: item.department,
      why: item.why,
      state: "open" as const,
    })),
  );
  const [activity] = useState<ActivityItem[]>(AI_ACTIVITY);
  const [flags, setFlags] = useState<Record<string, boolean>>({ insurance: true, equipment: true, supplies: true, staffing: true, it: true, accounting: true, marketing: true, construction: true, "nightly-report": true });
  const [ackedAlerts, setAcked] = useState<Record<string, boolean>>({});
  const [revokedDevices, setRevoked] = useState<Record<string, boolean>>({});
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({});
  const [started, setStarted] = useState<Record<string, boolean>>({ nadia: true, omar: true });
  const [ended, setEnded] = useState<Record<string, boolean>>({});
  const [quizPasses, setQuiz] = useState<Record<string, boolean>>({ "mia:as-1": true });
  const [reports, setReports] = useState<ReportDraft[]>([]);
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [upgradeAsks, setUpgrades] = useState<string[]>([]);
  const [auditExtra, setAudit] = useState<Round3["auditExtra"]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dpcp-dark", theme === "dark");
  }, [theme]);

  const api = useMemo<Round3>(() => {
    const log = (who: string, where: string, action: string) => {
      setAudit((rows) => [{ id: `au-${Date.now()}`, at: "Oct 20, 10:42 AM", who, where, action }, ...rows]);
    };
    return {
      tickets,
      addTicket: (input) => {
        const id = `tk-${Math.random().toString(36).slice(2, 7)}`;
        const ticket: Ticket = {
          id,
          number: `DP-${2600 + tickets.length}`,
          practiceId: input.practiceId,
          requester: input.requester,
          device: "Front desk",
          department: input.department,
          type: input.type,
          priority: input.priority,
          status: "triaged",
          owner: "AI triage",
          title: input.title,
          body: input.body,
          phi: Boolean(input.phi),
          aiFirst: true,
          aiDid: "AI picked the department from the description.",
          humanNeeded: "A person confirms the next step.",
          openedAt: "2026-10-20T17:42:00Z",
          firstResponseAt: "2026-10-20T17:42:00Z",
          resolvedAt: null,
          slaPaused: false,
          escalation: 0,
          tier: input.practiceId === "saguaro" ? "Growth" : input.practiceId === "lakeview" || input.practiceId === "redrock" ? "Essentials" : "Full Partner",
          events: [
            { at: "2026-10-20T17:42:00Z", text: "Submitted.", by: "practice" },
            { at: "2026-10-20T17:42:00Z", text: "AI triaged it.", by: "ai" },
          ],
          replies: [],
          photo: input.photo,
        };
        setTickets((list) => [ticket, ...list]);
        log(input.requester, input.department, `Opened ${ticket.number}`);
        return id;
      },
      setTicketStatus: (id, status) => setTickets((list) => list.map((ticket) => (ticket.id === id ? { ...ticket, status, events: [...ticket.events, { at: "2026-10-20T17:42:00Z", text: `Status: ${status}`, by: "human" as const }] } : ticket))),
      reassignTicket: (id, department, reason) =>
        setTickets((list) => list.map((ticket) => (ticket.id === id ? { ...ticket, department, events: [...ticket.events, { at: "2026-10-20T17:42:00Z", text: `Moved. ${reason}`, by: "human" as const }] } : ticket))),
      replyTicket: (id, text, visibility) =>
        setTickets((list) => list.map((ticket) => (ticket.id === id ? { ...ticket, replies: [...ticket.replies, { at: "Oct 20, 10:42 AM", by: "You", text, visibility }] } : ticket))),
      rateTicket: (id, score, note) =>
        setTickets((list) => list.map((ticket) => (ticket.id === id ? { ...ticket, rating: score, ratingNote: note, status: "closed", events: [...ticket.events, { at: "2026-10-20T17:42:00Z", text: `Rated ${score}.`, by: "practice" as const }] } : ticket))),
      reopenTicket: (id) => setTickets((list) => list.map((ticket) => (ticket.id === id ? { ...ticket, status: "progress", events: [...ticket.events, { at: "2026-10-20T17:42:00Z", text: "Reopened within 7 days.", by: "practice" as const }] } : ticket))),
      linkDuplicate: (id, originalId) => setTickets((list) => list.map((ticket) => (ticket.id === id ? { ...ticket, duplicateOf: originalId } : ticket))),
      plans,
      savePlan: (plan) => {
        const id = plan.id ?? `plan-${Date.now()}`;
        setPlans((list) => [{ ...plan, id, outcome: "open" }, ...list.filter((item) => item.id !== id)]);
      },
      setPlanOutcome: (id, outcome) => setPlans((list) => list.map((plan) => (plan.id === id ? { ...plan, outcome } : plan))),
      notes,
      saveNote: (practiceId, monthId, part, text) => setNotes((current) => ({ ...current, [noteKey(practiceId, monthId, part)]: text })),
      overrides,
      saveAssessment: (row) => setOverrides((current) => ({ ...current, [`${row.practiceId}:${row.month}`]: row })),
      month,
      setMonth,
      approvals,
      decideApproval: (id, state, reason) => setApprovals((list) => list.map((item) => (item.id === id ? { ...item, state, reason } : item))),
      addApproval: (item) => setApprovals((list) => [{ ...item, id: `ap-${Date.now()}`, state: "open" }, ...list]),
      activity,
      flags,
      toggleFlag: (id) => setFlags((current) => ({ ...current, [id]: current[id] === false })),
      ackedAlerts,
      ackAlert: (id) => setAcked((current) => ({ ...current, [id]: true })),
      revokedDevices,
      revokeDevice: (id) => {
        setRevoked((current) => ({ ...current, [id]: true }));
        log("Rowan Blake", "Devices", `Revoked ${id}`);
      },
      integrations,
      toggleIntegration: (id) => setIntegrations((current) => ({ ...current, [id]: !current[id] })),
      started,
      ended,
      startDay: (personId) => setStarted((current) => ({ ...current, [personId]: true })),
      endDay: (personId) => setEnded((current) => ({ ...current, [personId]: true })),
      quizPasses,
      passQuiz: (key) => setQuiz((current) => ({ ...current, [key]: true })),
      reports,
      addReport: (report) => setReports((list) => [report, ...list]),
      theme,
      setTheme: setThemeState,
      upgradeAsks,
      askUpgrade: (practiceId) => setUpgrades((list) => (list.includes(practiceId) ? list : [practiceId, ...list])),
      auditExtra,
      logAudit: log,
    };
  }, [ackedAlerts, activity, approvals, auditExtra, ended, flags, integrations, month, notes, overrides, plans, quizPasses, reports, revokedDevices, started, theme, tickets, upgradeAsks]);

  return <Round3Context.Provider value={api}>{children}</Round3Context.Provider>;
}

export function useRound3() {
  const ctx = useContext(Round3Context);
  if (!ctx) throw new Error("useRound3 outside provider");
  return ctx;
}

export function assessmentFor(practiceId: string, month: string, overrides: Record<string, PracticeMonth>) {
  return overrides[`${practiceId}:${month}`] ?? monthsFor(practiceId).find((row) => row.month === month)!;
}

export function sparkFor(practiceId: string, metricId: string, overrides: Record<string, PracticeMonth>) {
  return monthsFor(practiceId).map((row) => overrides[`${practiceId}:${row.month}`]?.values[metricId] ?? row.values[metricId]);
}
