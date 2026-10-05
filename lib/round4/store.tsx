"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  COMMITMENTS,
  CONSENT_ROWS,
  OPEN_QUESTIONS,
  ORIENTATION_STEPS,
  type Commitment,
  type CommitmentStatus,
} from "@/lib/round4/data";

export interface MakeupTask {
  id: string;
  personId: string;
  person: string;
  team: string;
  kind: "Make-up stand-up" | "Make-up update";
  due: string;
  status: "open" | "done" | "overdue";
  reason?: string;
}

export interface Round4Api {
  commitments: Commitment[];
  setCommitment: (id: string, status: CommitmentStatus, extra?: { proof?: string; dropReason?: string }) => void;
  makeup: MakeupTask[];
  markAbsent: (input: { personId: string; person: string; team: string; kind: MakeupTask["kind"]; reason?: string }) => void;
  completeMakeup: (id: string) => void;
  notes: Record<string, string>;
  saveNote: (meetingId: string, text: string) => void;
  consent: Record<string, string>;
  setConsent: (id: string, state: string) => void;
  questions: { id: string; title: string; owner: string; parked: string; age: string }[];
  parkQuestion: (id: string) => void;
  closeQuestion: (id: string) => void;
  superseded: boolean;
  supersedeBarter: () => void;
  orientationDone: Record<string, boolean>;
  toggleStep: (id: string) => void;
  leadConfirmed: boolean;
  confirmLead: () => void;
  showTraining: boolean;
  setShowTraining: (value: boolean) => void;
  recareGoal: number;
  setRecareGoal: (n: number) => void;
  recareTaps: Record<string, number>;
  tapRecare: (outcome: string) => void;
  studyTaps: Record<string, number>;
  tapStudy: (fn: string) => void;
  offices: number;
  setOffices: (n: number) => void;
  catchupRead: boolean;
  readCatchup: () => void;
  makeupChat: { open: boolean; kind: string; step: number; answers: string[] };
  openMakeup: (kind: string) => void;
  closeMakeup: () => void;
  answerMakeup: (text: string) => void;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
  promoted: boolean;
  promote: () => void;
  filingBlocked: boolean;
}

const Ctx = createContext<Round4Api | null>(null);

const SEED_MAKEUP: MakeupTask[] = [
  {
    id: "mk-imran",
    personId: "imran",
    person: "Imran Cole",
    team: "Insurance & Billing",
    kind: "Make-up stand-up",
    due: "Mon Oct 19",
    status: "overdue",
    reason: "Out of the stand-up",
  },
];

export function Round4Provider({ children }: { children: ReactNode }) {
  const [commitments, setCommitments] = useState<Commitment[]>(COMMITMENTS);
  const [makeup, setMakeup] = useState<MakeupTask[]>(SEED_MAKEUP);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [consent, setConsentState] = useState<Record<string, string>>(
    Object.fromEntries(CONSENT_ROWS.map((row) => [row.id, row.state]))
  );
  const [questions, setQuestions] = useState(OPEN_QUESTIONS);
  const [superseded, setSuperseded] = useState(true);
  const [orientationDone, setOrientation] = useState<Record<string, boolean>>({});
  const [leadConfirmed, setLead] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [recareGoal, setRecareGoal] = useState(35);
  const [recareTaps, setRecare] = useState<Record<string, number>>({ Booked: 11, "Left message": 8, "No answer": 6, Declined: 2, "Bad number": 1 });
  const [studyTaps, setStudy] = useState<Record<string, number>>({ Posting: 14, "AR follow-up": 6, Phones: 9, Scheduling: 8 });
  const [offices, setOffices] = useState(5);
  const [catchupRead, setCatchup] = useState(false);
  const [makeupChat, setChat] = useState<Round4Api["makeupChat"]>({ open: false, kind: "Make-up stand-up", step: 0, answers: [] });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [promoted, setPromoted] = useState(false);

  const api = useMemo<Round4Api>(
    () => ({
      commitments,
      setCommitment: (id, status, extra) =>
        setCommitments((rows) =>
          rows.map((row) =>
            row.id === id
              ? {
                  ...row,
                  status,
                  proof: extra?.proof ?? row.proof,
                  dropReason: extra?.dropReason ?? row.dropReason,
                  overdue: status === "Done" || status === "Dropped" ? false : row.overdue,
                }
              : row
          )
        ),
      makeup,
      markAbsent: (input) =>
        setMakeup((rows) => [
          {
            id: `mk-${Date.now()}`,
            personId: input.personId,
            person: input.person,
            team: input.team,
            kind: input.kind,
            due: "Wed Oct 21",
            status: "open",
            reason: input.reason,
          },
          ...rows,
        ]),
      completeMakeup: (id) => setMakeup((rows) => rows.map((row) => (row.id === id ? { ...row, status: "done" } : row))),
      notes,
      saveNote: (meetingId, text) => setNotes((current) => ({ ...current, [meetingId]: text })),
      consent,
      setConsent: (id, state) => setConsentState((current) => ({ ...current, [id]: state })),
      questions,
      parkQuestion: (id) =>
        setQuestions((rows) => rows.map((row) => (row.id === id ? { ...row, parked: "Task force invite drafted" } : row))),
      closeQuestion: (id) => setQuestions((rows) => rows.filter((row) => row.id !== id)),
      superseded,
      supersedeBarter: () => setSuperseded(true),
      orientationDone,
      toggleStep: (id) => setOrientation((current) => ({ ...current, [id]: !current[id] })),
      leadConfirmed,
      confirmLead: () => setLead(true),
      showTraining,
      setShowTraining,
      recareGoal,
      setRecareGoal,
      recareTaps,
      tapRecare: (outcome) => setRecare((current) => ({ ...current, [outcome]: (current[outcome] ?? 0) + 1 })),
      studyTaps,
      tapStudy: (fn) => setStudy((current) => ({ ...current, [fn]: (current[fn] ?? 0) + 1 })),
      offices,
      setOffices,
      catchupRead,
      readCatchup: () => setCatchup(true),
      makeupChat,
      openMakeup: (kind) => setChat({ open: true, kind, step: 0, answers: [] }),
      closeMakeup: () => setChat((current) => ({ ...current, open: false })),
      answerMakeup: (text) =>
        setChat((current) => ({
          ...current,
          answers: [...current.answers, text],
          step: Math.min(current.step + 1, 4),
        })),
      calendarOpen,
      setCalendarOpen,
      promoted,
      promote: () => setPromoted(true),
      filingBlocked: true,
    }),
    [
      commitments,
      makeup,
      notes,
      consent,
      questions,
      superseded,
      orientationDone,
      leadConfirmed,
      showTraining,
      recareGoal,
      recareTaps,
      studyTaps,
      offices,
      catchupRead,
      makeupChat,
      calendarOpen,
      promoted,
    ]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useRound4() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useRound4 outside provider");
  return value;
}

export function orientationProgress(done: Record<string, boolean>) {
  const filled = ORIENTATION_STEPS.filter((step) => done[step.id]).length;
  return Math.round((filled / ORIENTATION_STEPS.length) * 100);
}
