"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { APPEAL_V1, CHAIR_AI, PATIENT_NOTE, routeCategory, type Book, type Category, type CopilotId, type Shout } from "@/lib/round2/data";

export type Stage = "received" | "ai" | "specialist" | "review" | "revising" | "v2" | "lead" | "done";

export type RequestKind = "appeal" | "repair" | "general";

export interface FloorRequest {
  id: string;
  practiceId: string;
  authorName: string;
  category: string;
  copilot: CopilotId | "operations";
  deptLabel: string;
  text: string;
  urgency: string;
  stage: Stage;
  kind: RequestKind;
  aiFirst: boolean;
  aiDid: string;
  humanTitle: string;
  humanOwnerId: string;
  result: string;
  updates: { at: string; text: string }[];
  comment?: string;
  version: number;
  rating?: number;
  ratingNote?: string;
}

export type FloorTab = "home" | "lists" | "support" | "track" | "training" | "day" | "wins" | "help";

interface Round2 {
  book: Book;
  setBook: (book: Book) => void;
  who: Record<string, string | null>;
  setWho: (practiceId: string, personId: string | null) => void;
  touch: (practiceId: string) => void;
  ticks: Record<string, { by: string; at: string }>;
  toggleTick: (key: string, by: string) => void;
  acks: Record<string, boolean>;
  ack: (id: string) => void;
  shouts: Shout[];
  addShout: (shout: Shout) => void;
  lessons: Record<string, { done: boolean; signed: boolean }>;
  finishLesson: (key: string) => void;
  signLesson: (key: string) => void;
  marks: Record<string, "scheduled" | "seen">;
  setMark: (id: string, state: "scheduled" | "seen") => void;
  requests: FloorRequest[];
  submitRequest: (input: { practiceId: string; authorName: string; category: Category; text: string; urgency: string }) => string;
  openReview: (id: string) => void;
  commentAppeal: (id: string, comment: string) => void;
  approveAppeal: (id: string) => void;
  approveLead: (id: string) => void;
  completeRepair: (id: string) => void;
  completeGeneral: (id: string) => void;
  rateRequest: (id: string, score: number, note: string) => void;
  floorTab: FloorTab;
  setFloorTab: (tab: FloorTab) => void;
  draft: string;
  setDraft: (text: string) => void;
  draftCategory: Category;
  setDraftCategory: (category: Category) => void;
  demoOn: boolean;
  demoStep: number;
  startDemo: () => void;
  nextDemo: () => { href: string; title: string; action?: "submit-appeal" | "as-nadia" | "as-omar" | "submit-chair" | "as-george" } | null;
  stopDemo: () => void;
  clientFocus: string | null;
  setClientFocus: (id: string | null) => void;
  callClaim: string | null;
  setCallClaim: (id: string | null) => void;
  callOutcome: string | null;
  setCallOutcome: (text: string) => void;
}

const Round2Context = createContext<Round2 | null>(null);

const SEED_REQUESTS: FloorRequest[] = [
  {
    id: "req-gasket",
    practiceId: "saguaro",
    authorName: "Pete Nunez",
    category: "Equipment",
    copilot: "equipment",
    deptLabel: "Equipment",
    text: "Autoclave door gasket looks flat.",
    urgency: "This week",
    stage: "done",
    kind: "general",
    aiFirst: true,
    aiDid: "Matched the gasket to the model and ordered the part.",
    humanTitle: "Confirm the gasket arrived",
    humanOwnerId: "theo",
    result: "Part shipped. The office can fit it.",
    updates: [
      { at: "Oct 14, 9:12 AM", text: "Received." },
      { at: "Oct 14, 9:14 AM", text: "AI matched the part." },
      { at: "Oct 16, 2:02 PM", text: "Done. Part shipped." },
    ],
    version: 1,
  },
];

function stamp() {
  return "Oct 20, 10:42 AM";
}

function makeRequest(input: { practiceId: string; authorName: string; category: Category; text: string; urgency: string }): FloorRequest {
  const route = routeCategory(input.category, input.text);
  const lower = input.text.toLowerCase();
  const appeal = route.copilot === "insurance" && (lower.includes("denied") || lower.includes("crown") || lower.includes("appeal"));
  const repair = route.copilot === "equipment" && (lower.includes("recline") || lower.includes("op 7") || lower.includes("chair"));
  const kind: RequestKind = appeal ? "appeal" : repair ? "repair" : "general";
  const humanOwnerId = kind === "appeal" ? "nadia" : route.copilot === "equipment" ? "theo" : route.copilot === "supplies" ? "jonas" : route.copilot === "staffing" ? "amina" : route.copilot === "accounting" ? "elena" : route.copilot === "marketing" ? "priya" : "rowan";
  return {
    id: `req-${Math.random().toString(36).slice(2, 8)}`,
    practiceId: input.practiceId,
    authorName: input.authorName,
    category: input.category,
    copilot: route.copilot,
    deptLabel: route.label,
    text: input.text,
    urgency: input.urgency,
    stage: "ai",
    kind,
    aiFirst: route.aiFirst,
    aiDid: "",
    humanTitle: "",
    humanOwnerId,
    result: "",
    updates: [{ at: stamp(), text: "Received from the practice desk." }],
    version: 1,
  };
}

function advanceAi(req: FloorRequest): FloorRequest {
  if (req.kind === "appeal") {
    return {
      ...req,
      stage: "specialist",
      aiDid: "Pulled the denial. It is a frequency limitation on claim 88-1042, D2740 ×2, $2,860. Drafted appeal v1 and a short note for the front desk.",
      humanTitle: "Review appeal draft for Saguaro claim 88-1042",
      updates: [...req.updates, { at: "Oct 20, 10:44 AM", text: "AI found the denial and drafted appeal v1." }],
    };
  }
  if (req.kind === "repair") {
    return {
      ...req,
      stage: "specialist",
      aiDid: CHAIR_AI,
      humanTitle: "Set a tech visit for Copper Canyon Op 7",
      updates: [...req.updates, { at: "Oct 20, 10:44 AM", text: "AI finished troubleshooting. A tech visit is next." }],
    };
  }
  return {
    ...req,
    stage: req.aiFirst ? "specialist" : "specialist",
    aiDid: req.aiFirst ? "Sorted the request and drafted the next step." : "This one needs a person from the start.",
    humanTitle: `Take the ${req.deptLabel} request from ${req.authorName}`,
    updates: [...req.updates, { at: "Oct 20, 10:44 AM", text: req.aiFirst ? "AI prepared the next step." : "A person has it." }],
  };
}

export function Round2Provider({ children }: { children: ReactNode }) {
  const [book, setBook] = useState<Book>("hdg");
  const [who, setWhoState] = useState<Record<string, string | null>>({});
  const [seen, setSeen] = useState<Record<string, number>>({});
  const [ticks, setTicks] = useState<Record<string, { by: string; at: string }>>({
    "copper:open:Lights, music, and the scent on": { by: "Casey Nguyen", at: "7:12 AM" },
    "copper:open:Phones off night mode": { by: "Casey Nguyen", at: "7:14 AM" },
    "saguaro:open:Lights, music, and the scent on": { by: "Maria Alvarez", at: "7:05 AM" },
    "saguaro:open:Phones off night mode": { by: "Maria Alvarez", at: "7:06 AM" },
    "saguaro:open:Ops have the morning setup": { by: "Pete Nunez", at: "7:18 AM" },
    "saguaro:open:Huddle card on the counter": { by: "Jordan Ellis", at: "7:22 AM" },
    "saguaro:huddle:Who is in today": { by: "Jordan Ellis", at: "7:41 AM" },
  });
  const [acks, setAcks] = useState<Record<string, boolean>>({});
  const [shouts, setShouts] = useState<Shout[]>([]);
  const [lessons, setLessons] = useState<Record<string, { done: boolean; signed: boolean }>>({});
  const [marks, setMarks] = useState<Record<string, "scheduled" | "seen">>({});
  const [requests, setRequests] = useState<FloorRequest[]>(SEED_REQUESTS);
  const [floorTab, setFloorTab] = useState<FloorTab>("home");
  const [draft, setDraft] = useState("");
  const [draftCategory, setDraftCategory] = useState<Category>("Insurance/billing");
  const [demoOn, setDemoOn] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [clientFocus, setClientFocus] = useState<string | null>(null);
  const [callClaim, setCallClaim] = useState<string | null>(null);
  const [callOutcome, setCallOutcome] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now();
      setWhoState((current) => {
        let changed = false;
        const next = { ...current };
        for (const [practiceId, personId] of Object.entries(current)) {
          if (!personId) continue;
          const at = seen[practiceId];
          if (!at) continue;
          if (now - at > 5 * 60 * 1000) {
            next[practiceId] = null;
            changed = true;
          }
        }
        return changed ? next : current;
      });
    }, 15000);
    return () => window.clearInterval(timer);
  }, [seen]);

  const api = useMemo<Round2>(() => {
    const patchReq = (id: string, fn: (req: FloorRequest) => FloorRequest) => {
      setRequests((list) => list.map((req) => (req.id === id ? fn(req) : req)));
    };
    return {
      book,
      setBook,
      who,
      setWho: (practiceId, personId) => {
        setWhoState((w) => ({ ...w, [practiceId]: personId }));
        setSeen((s) => ({ ...s, [practiceId]: Date.now() }));
        setFloorTab("home");
      },
      touch: (practiceId) => setSeen((s) => ({ ...s, [practiceId]: Date.now() })),
      ticks,
      toggleTick: (key, by) =>
        setTicks((t) => {
          if (t[key]) {
            const next = { ...t };
            delete next[key];
            return next;
          }
          return { ...t, [key]: { by, at: "10:42 AM" } };
        }),
      acks,
      ack: (id) => setAcks((a) => ({ ...a, [id]: true })),
      shouts,
      addShout: (shout) => setShouts((list) => [shout, ...list]),
      lessons,
      finishLesson: (key) => setLessons((l) => ({ ...l, [key]: { done: true, signed: l[key]?.signed ?? false } })),
      signLesson: (key) => setLessons((l) => ({ ...l, [key]: { done: true, signed: true } })),
      marks,
      setMark: (id, state) => setMarks((m) => ({ ...m, [id]: state })),
      requests,
      submitRequest: (input) => {
        const created = makeRequest(input);
        if (!created.aiFirst) {
          const ready = advanceAi({ ...created, stage: "received" });
          ready.updates = [{ at: stamp(), text: "Received." }, { at: stamp(), text: "A person will help." }];
          setRequests((list) => [ready, ...list]);
          return ready.id;
        }
        setRequests((list) => [created, ...list]);
        window.setTimeout(() => {
          setRequests((list) => list.map((req) => (req.id === created.id && req.stage === "ai" ? advanceAi(req) : req)));
        }, 900);
        return created.id;
      },
      openReview: (id) =>
        patchReq(id, (req) => {
          if (req.kind !== "appeal") return req;
          if (req.stage === "done" || req.stage === "lead" || req.stage === "v2" || req.stage === "revising" || req.stage === "review") return req;
          const ready = req.aiDid ? req : advanceAi(req);
          return { ...ready, stage: "review" };
        }),
      commentAppeal: (id, comment) => {
        patchReq(id, (req) => ({ ...req, stage: "revising", comment }));
        window.setTimeout(() => {
          setRequests((list) =>
            list.map((req) =>
              req.id === id && req.stage === "revising"
                ? {
                    ...req,
                    stage: "v2",
                    version: 2,
                    updates: [...req.updates, { at: "Oct 20, 10:51 AM", text: "AI revised the appeal from the review note." }],
                  }
                : req
            )
          );
        }, 700);
      },
      approveAppeal: (id) =>
        patchReq(id, (req) => ({
          ...req,
          stage: "lead",
          updates: [...req.updates, { at: "Oct 20, 10:55 AM", text: "Nadia approved v2. $2,860 is over $1,000, so the lead still signs." }],
        })),
      approveLead: (id) =>
        patchReq(id, (req) => ({
          ...req,
          stage: "done",
          result: "Done: appeal submitted, we'll update you when the payer responds.",
          updates: [...req.updates, { at: "Oct 20, 11:02 AM", text: "Omar Hale approved the send. Appeal submitted." }],
        })),
      completeRepair: (id) =>
        patchReq(id, (req) => ({
          ...req,
          stage: "done",
          result: "Done: tech visit is Thursday. We'll message the office when we're on the way.",
          updates: [...req.updates, { at: "Oct 20, 11:10 AM", text: "Theo set the Thursday visit." }],
        })),
      completeGeneral: (id) =>
        patchReq(id, (req) => ({
          ...req,
          stage: "done",
          result: "Done. The practice desk can see the update.",
          updates: [...req.updates, { at: stamp(), text: "Marked done." }],
        })),
      rateRequest: (id, score, note) =>
        patchReq(id, (req) => ({
          ...req,
          rating: score,
          ratingNote: note,
          updates: [...req.updates, { at: stamp(), text: `Rated ${score} of 5.` }],
        })),
      floorTab,
      setFloorTab,
      draft,
      setDraft,
      draftCategory,
      setDraftCategory,
      demoOn,
      demoStep,
      startDemo: () => {
        setDemoOn(true);
        setDemoStep(1);
        setBook("client");
        setFloorTab("home");
        setWhoState((w) => ({ ...w, saguaro: "maria" }));
        setSeen((s) => ({ ...s, saguaro: Date.now() }));
      },
      nextDemo: () => {
        const step = demoStep + 1;
        setDemoStep(step);
        if (step === 2) {
          setFloorTab("support");
          setDraftCategory("Insurance/billing");
          setDraft("Patient says insurance denied her crown, can you check?");
          return { href: "/practice/saguaro/", title: "Maria sends the crown question" };
        }
        if (step === 3) {
          setFloorTab("track");
          return { href: "/practice/saguaro/", title: "Tracker shows AI working, then the draft", action: "submit-appeal" };
        }
        if (step === 4) {
          setBook("client");
          return { href: "/workday/", title: "Nadia's Today has the appeal", action: "as-nadia" };
        }
        if (step === 5) return { href: "/review/", title: "Review the appeal" };
        if (step === 6) return { href: "/review/", title: "Comment, then the revision" };
        if (step === 7) return { href: "/review/", title: "Nadia approves. The lead still signs." };
        if (step === 8) return { href: "/review/", title: "Omar approves the send", action: "as-omar" };
        if (step === 9) {
          setFloorTab("track");
          setBook("client");
          return { href: "/practice/saguaro/", title: "Maria sees Done" };
        }
        if (step === 10) {
          setFloorTab("track");
          setBook("client");
          return { href: "/practice/saguaro/", title: "Maria rates the request" };
        }
        if (step === 11) {
          setBook("hdg");
          setFloorTab("support");
          setDraftCategory("Equipment");
          setDraft("Op 7 chair won't recline");
          setWhoState((w) => ({ ...w, copper: "casey" }));
          setSeen((s) => ({ ...s, copper: Date.now() }));
          return { href: "/practice/copper-canyon/", title: "Copper Canyon reports the chair", action: "submit-chair" };
        }
        if (step === 12) return { href: "/copilot/equipment/#service", title: "Equipment desk sets the visit", action: "as-george" };
        if (step === 13) {
          setFloorTab("track");
          setBook("hdg");
          return { href: "/practice/copper-canyon/", title: "The office sees the visit" };
        }
        setDemoOn(false);
        return null;
      },
      stopDemo: () => setDemoOn(false),
      clientFocus,
      setClientFocus,
      callClaim,
      setCallClaim,
      callOutcome,
      setCallOutcome,
    };
  }, [acks, book, callClaim, callOutcome, clientFocus, demoOn, demoStep, draft, draftCategory, floorTab, lessons, marks, requests, shouts, ticks, who]);

  return <Round2Context.Provider value={api}>{children}</Round2Context.Provider>;
}

export function useRound2() {
  const ctx = useContext(Round2Context);
  if (!ctx) throw new Error("useRound2 outside provider");
  return ctx;
}

export const APPEAL_LETTER = { v1: APPEAL_V1, note: PATIENT_NOTE };
