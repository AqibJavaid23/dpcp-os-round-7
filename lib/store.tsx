"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { completionReminder } from "@/lib/chain";
import { CHECKIN_QUESTIONS } from "@/lib/checkins";
import { nextIdeaStatus, themeFor } from "@/lib/evolve";
import { clientReady } from "@/lib/life";
import { escalationChain, supervisorId } from "@/lib/feedback";
import { nextStage, withStage } from "@/lib/rollout";
import { callModel } from "@/lib/models";
import { DEPARTMENTS, PEOPLE, createSeed } from "@/lib/seed";
import { outcomeForOption, routeText } from "@/lib/router";
import type {
  ChatItem,
  CheckinSlot,
  ClientFeedback,
  Decision,
  FeedbackStatus,
  DepartmentId,
  InboxItem,
  Model,
  ModelTaskType,
  Person,
  Role,
  ScreenState,
  Task,
} from "@/lib/types";
import { uid } from "@/lib/format";

const VIEWER: Record<Role, string> = {
  employee: "nadia",
  leader: "omar",
  administrator: "amina",
  george: "george",
  owner: "dr-mara",
};

const PRACTICE_OWNER: Person = {
  id: "dr-mara",
  name: "Dr. Mara Ellison",
  firstName: "Mara",
  initials: "ME",
  role: "owner",
  title: "Practice owner",
  departmentId: "owner",
  email: "mara.ellison@dpcp.example",
  tz: "AZ",
  goal: 85,
  execution: 90,
  streak: 3,
  savedToday: "0 m",
  shift: "8:00 AM – 5:00 PM AZ",
  todayDone: 0,
  todayTotal: 1,
  status: "on_track",
  statusLabel: "On track",
  workingNow: "Practice health",
};

interface Toast {
  text: string;
  undo?: boolean;
}

interface Ui {
  role: Role;
  /** When set, this person is the signed-in preview. Cleared by Switch view role cards. */
  viewerId: string | null;
  signedIn: boolean;
  screenState: ScreenState;
  slackReconnect: boolean;
  reviewHidden: boolean;
  chatCollapsed: boolean;
  feedbackOpen: boolean;
  toast: Toast | null;
  editingTaskId: string | null;
  draftBuffer: string;
  selectedPersonId: string;
  peekOpen: boolean;
  sheet: "blocked" | "time" | "closeout" | "nudge" | "reassign" | "message" | "proof" | null;
  sheetTaskId: string | null;
  proofText: string;
  pendingHint: string | null;
  confirmMoneyId: string | null;
}

const initialUi: Ui = {
  role: "employee",
  viewerId: null,
  signedIn: false,
  screenState: "ready",
  slackReconnect: false,
  reviewHidden: true,
  chatCollapsed: false,
  feedbackOpen: false,
  toast: null,
  editingTaskId: null,
  draftBuffer: "",
  selectedPersonId: "imran",
  peekOpen: false,
  sheet: null,
  sheetTaskId: null,
  proofText: "",
  pendingHint: null,
  confirmMoneyId: null,
};

interface AppValue {
  ui: Ui;
  model: Model;
  viewer: Person;
  people: Person[];
  departments: typeof DEPARTMENTS;
  myTasks: Task[];
  focus: Task | null;
  peek: Task[];
  progress: { done: number; total: number; remainingMin: number; position: number };
  aiPaused: boolean;
  offline: boolean;
  banner: { tone: "amber" | "neutral"; text: string; action?: string } | null;
  noticeOpen: boolean;
  setRole: (role: Role) => void;
  setPerson: (id: string) => void;
  signedIn: boolean;
  booted: boolean;
  signIn: (role: Role) => void;
  signOut: () => void;
  isOwner: boolean;
  isAdmin: boolean;
  canEditAccess: boolean;
  canViewAccess: boolean;
  myMemberships: import("@/lib/types").Membership[];
  addReviewNote: (id: string, blockId: string | null, text: string) => void;
  requestReviewChanges: (id: string) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
  sendReview: (id: string) => void;
  handToReview: (title: string, body: string) => string;
  selectReview: (id: string) => void;
  setMembership: (personId: string, departmentId: DepartmentId, teamRole: import("@/lib/types").TeamRole) => void;
  removeMembership: (personId: string, departmentId: DepartmentId) => void;
  setScreenState: (state: ScreenState) => void;
  setSlackReconnect: (v: boolean) => void;
  setReviewHidden: (v: boolean) => void;
  setChatCollapsed: (v: boolean) => void;
  setFeedbackOpen: (v: boolean) => void;
  setSelectedDept: (id: DepartmentId) => void;
  setSelectedPerson: (id: string) => void;
  openSheet: (sheet: Ui["sheet"], taskId?: string) => void;
  closeSheet: () => void;
  setPeekOpen: (v: boolean) => void;
  setProofText: (v: string) => void;
  showToast: (text: string) => void;
  dismissToast: () => void;
  undo: () => void;
  reset: () => void;
  startEdit: (task: Task) => void;
  cancelEdit: () => void;
  saveDraft: (body: string) => void;
  approveTask: (id: string) => void;
  markDone: (id: string, proof?: string) => void;
  markBlocked: (id: string, reason: string) => void;
  needMoreTime: (id: string, when: string) => void;
  skipTask: (id: string) => void;
  submitDay: () => void;
  reopenNotice: () => void;
  acknowledge: () => void;
  questionNotice: () => void;
  sendChat: (text: string) => void;
  chooseOption: (messageId: string, optionId: string, label: string) => void;
  confirmMove: (messageId: string, yes: boolean) => void;
  resolveApproval: (messageId: string, action: "send" | "cancel") => void;
  newChat: () => void;
  setChatContext: (text: string | null) => void;
  deliverJob: (title: string) => void;
  cancelJob: (id: string) => void;
  sendTicket: (input: { kind: "bug" | "idea"; body: string; impact: "little" | "workaround" | "stuck"; screen: string }) => void;
  fileMessage: (id: string) => void;
  neededMe: (id: string) => void;
  releaseHeld: (id: string) => void;
  chooseMessageOption: (id: string, option: string) => void;
  reassign: (taskId: string, personId: string, reason: string) => void;
  moveToTomorrow: (taskId: string) => void;
  messagePerson: (name: string) => void;
  decide: (id: string, choice: string) => void;
  setConfirmMoney: (id: string | null) => void;
  pauseAi: (on: boolean) => void;
  recheckConnectors: () => void;
  completeFinish: (id: string) => void;
  stuckFinish: (id: string) => void;
  requestTimeOff: () => void;
  advanceOnboarding: () => void;
  confirmMeeting: (id: string) => void;
  addComment: (taskId: string, text: string) => void;
  reconnectSlack: () => void;
  taskById: (id: string) => Task | undefined;
  canViewTask: (task: Task) => boolean;
  completeCheckin: (slot: CheckinSlot, answers: string[]) => void;
  setModelRoute: (taskType: ModelTaskType, field: "primary" | "backup", modelId: string) => void;
  advanceRollout: (personId: string) => void;
  completeOrientation: () => void;
  approveGeorge: (id: string) => void;
  fileGeorge: (id: string) => void;
  askBot: (text: string) => void;
  addFeedbackNote: (id: string, text: string) => void;
  setFeedbackStatus: (id: string, status: FeedbackStatus) => void;
  sendFeedbackFollowUp: (id: string) => void;
  submitFeedback: (input: { practice: string; clientName: string; aboutId: string; stars: number; body: string }) => void;
  reactToCulture: (postId: string, kind: "proud" | "thanks" | "withyou") => void;
  commentOnCulture: (postId: string, text: string) => void;
  addShoutout: (aboutId: string, text: string, pillar: "intelligence" | "energy" | "integrity") => void;
  shareSuggestion: (id: string) => void;
  addGrowthNote: (personId: string, pillar: "intelligence" | "energy" | "integrity", text: string) => void;
  saveGrowthReview: (personId: string, summary: string, scores: { pillar: "intelligence" | "energy" | "integrity"; score: number; note: string }[]) => void;
  finalizeGrowthReview: (personId: string) => void;
  addSkill: (personId: string, name: string, pillar: "intelligence" | "energy" | "integrity") => void;
  submitIdea: (input: { body: string; mode: "text" | "voice"; screen: string; screenTitle: string }) => void;
  voteIdea: (id: string) => void;
  advanceIdea: (id: string) => void;
  addAppreciation: (aboutId: string, text: string, pillar: "intelligence" | "energy" | "integrity") => void;
  suggestCultureIdea: (text: string) => void;
  toggleTrainingStep: (personId: string, stepId: string) => void;
  signOffTraining: (personId: string) => void;
  savePulse: (id: string, answers: string[]) => void;
  postSendoff: (text: string) => void;
  saveExitFeedback: (text: string) => void;
  toggleOffboard: (list: "handover" | "access", id: string) => void;
  ackMessage: (id: string) => void;
  updateProjectPhase: (projectId: string, phaseId: string, patch: { name?: string; ownerId?: string; due?: string; status?: "done" | "now" | "waiting" | "blocked" }) => void;
  updateTemplatePhase: (templateId: string, phaseId: string, name: string) => void;
}

const AppContext = createContext<AppValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [model, setModel] = useState<Model>(() => createSeed());
  const [ui, setUi] = useState<Ui>(initialUi);
  const [booted, setBooted] = useState(false);
  const undoRef = useRef<Model | null>(null);
  const pathname = usePathname();
  const uiRef = useRef(ui);
  uiRef.current = ui;

  const viewer = ui.viewerId
    ? (PEOPLE.find((p) => p.id === ui.viewerId) ?? PEOPLE[0])
    : ui.role === "owner"
      ? PRACTICE_OWNER
      : (PEOPLE.find((p) => p.id === VIEWER[ui.role]) ?? PEOPLE[0]);
  const aiPaused = ui.screenState === "paused" || model.georgePaused;
  const offline = ui.screenState === "offline";

  useEffect(() => {
    const saved = window.sessionStorage.getItem("dpcp-role");
    const savedPerson = window.sessionStorage.getItem("dpcp-viewer");
    const person = PEOPLE.find((item) => item.id === savedPerson);
    if (person) {
      setUi((current) => ({ ...current, signedIn: true, role: person.role, viewerId: person.id }));
    } else if (saved === "employee" || saved === "leader" || saved === "administrator" || saved === "george" || saved === "owner") {
      setUi((current) => ({ ...current, signedIn: true, role: saved, viewerId: null }));
    }
    setBooted(true);
  }, []);

  useEffect(() => {
    if (!booted) return;
    if (ui.signedIn) {
      window.sessionStorage.setItem("dpcp-role", ui.role);
      if (ui.viewerId) window.sessionStorage.setItem("dpcp-viewer", ui.viewerId);
      else window.sessionStorage.removeItem("dpcp-viewer");
    } else {
      window.sessionStorage.removeItem("dpcp-role");
      window.sessionStorage.removeItem("dpcp-viewer");
    }
  }, [booted, ui.signedIn, ui.role, ui.viewerId]);

  useEffect(() => {
    if (!ui.toast) return;
    const t = window.setTimeout(() => setUi((u) => ({ ...u, toast: null })), 5000);
    return () => window.clearTimeout(t);
  }, [ui.toast]);

  useEffect(() => {
    if (offline) return;
    setModel((m) => {
      if (!m.tasks.some((t) => t.queued)) return m;
      return {
        ...m,
        tasks: m.tasks.map((t) =>
          t.queued
            ? {
                ...t,
                queued: false,
                why: "Laura wrote again. Please check before sending.",
              }
            : t
        ),
      };
    });
  }, [offline]);

  const patch = (fn: (m: Model) => Model, toast?: string, undo = false) => {
    setModel((prev) => {
      if (undo) undoRef.current = prev;
      return fn(prev);
    });
    if (toast) setUi((u) => ({ ...u, toast: { text: toast, undo } }));
  };

  const showToast = (text: string) => setUi((u) => ({ ...u, toast: { text } }));

  const myTasks = model.tasks
    .filter((t) => t.ownerId === viewer.id)
    .slice()
    .sort((a, b) => a.order - b.order);
  const openTasks = myTasks.filter((t) => t.status !== "done");
  const focus = ui.screenState === "empty" ? null : (openTasks[0] ?? null);
  const peek = openTasks.slice(1, 4);
  const doneCount = myTasks.filter((t) => t.status === "done").length;
  const progress = {
    done: doneCount,
    total: myTasks.length,
    remainingMin: openTasks.reduce((s, t) => s + t.estimateMin, 0),
    position: Math.min(doneCount + 1, myTasks.length),
  };

  const banner = offline
    ? {
        tone: "neutral" as const,
        text: "You're offline. You can keep working; changes will sync when you're back.",
      }
    : aiPaused
      ? {
          tone: "amber" as const,
          text: "AI is paused. You can keep working; anything already prepared still works. New items will be prepared when it's back.",
        }
      : ui.slackReconnect
        ? {
            tone: "amber" as const,
            text: "Slack needs you to reconnect (it happens every so often). Messages are waiting and nothing is lost.",
            action: "Reconnect Slack",
          }
        : null;

  const noticeOpen =
    model.forceNotice ||
    (!model.noticeAcked &&
      !model.noticeQuestioned &&
      pathname !== "/" &&
      !pathname.startsWith("/setup"));

  const value = useMemo<AppValue>(() => {
    const addTask = (m: Model, title: string, why: string, ownerId: string): Model => {
      const task: Task = {
        id: uid("task"),
        ownerId,
        departmentId: viewer.departmentId === "owner" ? "operations" : viewer.departmentId,
        title,
        why,
        kind: "review",
        status: "open",
        sourceLabel: "From chat",
        sourceKind: "app",
        dueLabel: "Today",
        dueTone: "blue",
        originalDue: "Oct 20, 5:00 PM",
        currentDue: "Oct 20, 5:00 PM",
        estimateMin: 25,
        spentMin: 0,
        prepared: ["Prepared from your chat request"],
        doneDefinition: "You have read the result",
        steps: [],
        history: [{ id: uid("h"), at: "10:42 AM AZ", actor: "AI", text: "Created from chat." }],
        comments: [],
        related: [],
        skips: 0,
        order: 3.5,
      };
      return { ...m, tasks: [...m.tasks, task], jobDelivered: true };
    };

    return {
      ui,
      model,
      viewer,
      people: PEOPLE,
      departments: DEPARTMENTS,
      myTasks,
      focus,
      peek,
      progress,
      aiPaused,
      offline,
      banner,
      noticeOpen,
      setRole: (role) => setUi((u) => ({ ...u, role, viewerId: null })),
      setPerson: (id) => {
        const person = PEOPLE.find((item) => item.id === id);
        if (!person) return;
        setUi((u) => ({ ...u, role: person.role, viewerId: person.id, signedIn: true }));
      },
      signedIn: ui.signedIn,
      booted,
      signIn: (role) => setUi((u) => ({ ...u, role, signedIn: true, viewerId: null })),
      signOut: () => setUi((u) => ({ ...u, signedIn: false })),
      setScreenState: (screenState) => setUi((u) => ({ ...u, screenState })),
      setSlackReconnect: (slackReconnect) => setUi((u) => ({ ...u, slackReconnect })),
      setReviewHidden: (reviewHidden) => setUi((u) => ({ ...u, reviewHidden })),
      setChatCollapsed: (chatCollapsed) => setUi((u) => ({ ...u, chatCollapsed })),
      setFeedbackOpen: (feedbackOpen) => setUi((u) => ({ ...u, feedbackOpen })),
      setSelectedDept: (selectedDept) => setModel((m) => ({ ...m, selectedDept })),
      setSelectedPerson: (selectedPersonId) => setUi((u) => ({ ...u, selectedPersonId })),
      openSheet: (sheet, taskId) =>
        setUi((u) => ({ ...u, sheet, sheetTaskId: taskId ?? u.sheetTaskId })),
      closeSheet: () => setUi((u) => ({ ...u, sheet: null, sheetTaskId: null })),
      setPeekOpen: (peekOpen) => setUi((u) => ({ ...u, peekOpen })),
      setProofText: (proofText) => setUi((u) => ({ ...u, proofText })),
      showToast,
      dismissToast: () => setUi((u) => ({ ...u, toast: null })),
      undo: () => {
        if (!undoRef.current) return;
        setModel(undoRef.current);
        undoRef.current = null;
        setUi((u) => ({ ...u, toast: { text: "Undone." } }));
      },
      reset: () => {
        setModel(createSeed());
        setUi(initialUi);
      },
      startEdit: (task) =>
        setUi((u) => ({
          ...u,
          editingTaskId: task.id,
          draftBuffer: task.draft?.body ?? "",
        })),
      cancelEdit: () => setUi((u) => ({ ...u, editingTaskId: null })),
      saveDraft: (body) => {
        const id = ui.editingTaskId;
        if (!id) return;
        patch(
          (m) => ({
            ...m,
            tasks: m.tasks.map((t) =>
              t.id === id && t.draft ? { ...t, draft: { ...t.draft, body } } : t
            ),
          }),
          undefined
        );
        setUi((u) => ({ ...u, editingTaskId: null }));
      },
      approveTask: (id) => {
        const task = model.tasks.find((t) => t.id === id);
        if (offline) {
          patch(
            (m) => ({
              ...m,
              tasks: m.tasks.map((t) => (t.id === id ? { ...t, queued: true } : t)),
            }),
            "Saved on this device. It'll sync when you're back online."
          );
          return;
        }
        if (task && (task.client || task.draft) && !clientReady(task.ownerId, model.training)) {
          showToast("Client email waits until training is signed off.");
          return;
        }
        const reminder = task ? completionReminder(task) : null;
        patch(
          (m) => ({
            ...m,
            tasks: m.tasks.map((t) =>
              t.id === id ? { ...t, status: "done", doneAt: "10:42 AM AZ", queued: false } : t
            ),
            messages: m.messages.map((msg) =>
              msg.taskId === id ? { ...msg, tab: "filed", summary: "Replied." } : msg
            ),
          }),
          reminder ? `Sent. ${reminder}` : `Sent to ${task?.recipient ?? "them"}. Undo`,
          true
        );
      },
      markDone: (id, proof) => {
        const task = model.tasks.find((t) => t.id === id);
        if (task?.proofRequired && !proof?.trim()) {
          setUi((u) => ({ ...u, sheet: "proof", sheetTaskId: id }));
          return;
        }
        const reminder = task ? completionReminder(task) : null;
        patch(
          (m) => ({
            ...m,
            tasks: m.tasks.map((t) =>
              t.id === id
                ? { ...t, status: "done", doneAt: "10:42 AM AZ", proof: proof || t.proof }
                : t
            ),
          }),
          offline
            ? "Saved on this device. It'll sync when you're back online."
            : reminder
              ? `Done. ${reminder}`
              : "Done. Nice work. Undo",
          !offline
        );
        setUi((u) => ({ ...u, sheet: null, proofText: "" }));
      },
      markBlocked: (id, reason) => {
        patch(
          (m) => ({
            ...m,
            blockedCount: m.blockedCount + 1,
            tasks: m.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    status: "blocked",
                    blockedReason: reason,
                    dueTone: "red",
                    dueLabel: "Blocked",
                    order: t.order + 20,
                    history: [
                      ...t.history,
                      { id: uid("h"), at: "10:42 AM AZ", actor: viewer.name, text: `Blocked: ${reason}` },
                    ],
                  }
                : t
            ),
          }),
          "Marked blocked. Your lead can see it."
        );
        setUi((u) => ({ ...u, sheet: null }));
      },
      needMoreTime: (id, when) => {
        patch(
          (m) => ({
            ...m,
            movedCount: m.movedCount + 1,
            tasks: m.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    currentDue: when,
                    dueLabel: when,
                    order: t.order + 10,
                    history: [
                      ...t.history,
                      {
                        id: uid("h"),
                        at: "10:42 AM AZ",
                        actor: viewer.name,
                        text: `Current due moved to ${when}. Original due kept.`,
                      },
                    ],
                  }
                : t
            ),
          }),
          `Moved to ${when}. Your lead can see the new date.`
        );
        setUi((u) => ({ ...u, sheet: null }));
      },
      skipTask: (id) => {
        const task = model.tasks.find((t) => t.id === id);
        if ((task?.skips ?? 0) >= 2) {
          setUi((u) => ({ ...u, sheet: "time", sheetTaskId: id }));
          return;
        }
        patch((m) => ({
          ...m,
          tasks: m.tasks.map((t) =>
            t.id === id ? { ...t, skips: t.skips + 1, order: t.order + 5 } : t
          ),
        }), "Skipped for now. It stays on your list.");
      },
      submitDay: () => {
        patch(
          (m) => ({ ...m, dayClosed: { ...m.dayClosed, [viewer.id]: true } }),
          "Day submitted. See you tomorrow."
        );
        setUi((u) => ({ ...u, sheet: null }));
      },
      reopenNotice: () => setModel((m) => ({ ...m, forceNotice: true, noticeAcked: false, noticeQuestioned: false })),
      acknowledge: () => {
        setModel((m) => ({ ...m, noticeAcked: true, forceNotice: false, noticeQuestioned: false }));
        showToast("Thanks. Noted.");
      },
      questionNotice: () => {
        setModel((m) => ({
          ...m,
          noticeQuestioned: true,
          forceNotice: false,
          chatContext: "About: New rule on client health information",
          chat: [
            ...m.chat,
            {
              id: uid("c"),
              kind: "user",
              text: "I have a question about the notice: no client health information in Slack or chat.",
            },
            {
              id: uid("c"),
              kind: "assistant",
              text: "Your question went to George. You can keep working. The notice will ask you to acknowledge it again after you get an answer.",
              routeNote: "Sent to George · question on a notice",
            },
          ],
        }));
        showToast("Your question went to George. You can keep working.");
      },
      sendChat: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const queued = uiRef.current.screenState === "offline";
        const paused = uiRef.current.screenState === "paused" || model.georgePaused;
        setModel((m) => ({
          ...m,
          chat: [...m.chat, { id: uid("c"), kind: "user", text: trimmed, queued }],
        }));
        if (queued) {
          showToast("I'll send this when you're back online.");
          return;
        }
        if (paused) {
          setModel((m) => ({
            ...m,
            chat: [
              ...m.chat,
              {
                id: uid("c"),
                kind: "fallback",
                text: "AI is paused. I've saved your request.",
              },
            ],
          }));
          return;
        }
        const result = routeText(trimmed, { role: ui.role, clarifyTurns: model.clarifyTurns });
        const taskType: ModelTaskType = result.items.some((item) => item.kind === "job")
          ? "background"
          : result.items.some((item) => item.kind === "approval")
            ? "drafts"
            : "router";
        const called = callModel({ routes: model.modelRoutes, taskType, prompt: trimmed });
        const stamped = result.items.map((item) =>
          item.kind === "assistant" || item.kind === "clarify"
            ? { ...item, routeNote: `${item.routeNote} · ${called.note}` }
            : item
        );
        setUi((u) => ({ ...u, pendingHint: result.hint ? `${result.hint} ${called.note}` : called.note }));
        window.setTimeout(() => {
          setUi((u) => ({ ...u, pendingHint: null }));
          setModel((m) => {
            let next: Model = {
              ...m,
              chat: [...m.chat, ...stamped],
              clarifyTurns: result.countClarify ? m.clarifyTurns + 1 : m.clarifyTurns,
            };
            if (result.effect?.type === "add-task") {
              next = addTask(next, result.effect.title, result.effect.why, VIEWER[ui.role]);
            }
            return next;
          });
        }, 350);
      },
      chooseOption: (messageId, optionId, label) => {
        if (optionId === "else") {
          showToast("Tell me a bit more in the box.");
          setModel((m) => ({
            ...m,
            chat: m.chat.map((item) =>
              item.kind === "clarify" && item.id === messageId ? { ...item, chosen: label } : item
            ),
          }));
          return;
        }
        const result = outcomeForOption(optionId);
        setModel((m) => {
          let next: Model = {
            ...m,
            chat: [
              ...m.chat.map((item) =>
                item.kind === "clarify" && item.id === messageId ? { ...item, chosen: label } : item
              ),
              ...result.items,
            ],
          };
          if (result.effect?.type === "add-task") {
            next = addTask(next, result.effect.title, result.effect.why, viewer.id);
          }
          return next;
        });
      },
      confirmMove: (messageId, yes) => {
        setModel((m) => ({
          ...m,
          chat: m.chat.map((item) =>
            item.kind === "confirm" && item.id === messageId
              ? { ...item, resolved: yes ? "yes" : "no" }
              : item
          ),
          tasks: yes
            ? m.tasks.map((t) =>
                t.id === "nadia-wait"
                  ? { ...t, currentDue: "Fri Oct 23", dueLabel: "Fri Oct 23" }
                  : t
              )
            : m.tasks,
        }));
        if (yes) showToast("Moved to Friday. Your lead can see the new date.");
      },
      resolveApproval: (messageId, action) => {
        setModel((m) => ({
          ...m,
          chat: m.chat.map((item) =>
            item.kind === "approval" && item.id === messageId
              ? { ...item, resolved: action === "send" ? "sent" : "cancelled" }
              : item
          ),
        }));
        showToast(action === "send" ? "Sent. Undo" : "Cancelled.");
      },
      newChat: () => setModel((m) => ({ ...m, chat: [], clarifyTurns: 0, chatContext: null })),
      setChatContext: (chatContext) => setModel((m) => ({ ...m, chatContext })),
      deliverJob: (title) => {
        setModel((m) => {
          const next = addTask(
            {
              ...m,
              chat: m.chat.map((item) =>
                item.kind === "job" && item.title === title ? { ...item, status: "ready" } : item
              ),
            },
            title,
            "Background job finished. Counts only, no patient detail.",
            viewer.id
          );
          return next;
        });
        showToast("It's on Today.");
      },
      cancelJob: (id) => {
        setModel((m) => ({
          ...m,
          chat: m.chat.map((item) =>
            item.kind === "job" && item.id === id ? { ...item, status: "failed" } : item
          ),
        }));
        showToast("Job cancelled.");
      },
      sendTicket: ({ kind, body, impact, screen }) => {
        const similar = /due date|phone card|progress/i.test(body);
        patch((m) => ({
          ...m,
          tickets: [
            {
              id: uid("ticket"),
              reporterId: viewer.id,
              kind,
              title: body.slice(0, 80),
              body,
              impact,
              status: similar ? "Grouped with others" : "Received",
              screen,
              duplicateCount: similar ? 4 : undefined,
            },
            ...m.tickets,
          ],
        }), similar
          ? "Added to an open ticket. We'll tell you when it's fixed."
          : "Thanks. We'll let you know when it's fixed.");
        setUi((u) => ({ ...u, feedbackOpen: false }));
      },
      fileMessage: (id) => {
        patch(
          (m) => ({
            ...m,
            messages: m.messages.map((msg) =>
              msg.id === id ? { ...msg, tab: "filed" } : msg
            ),
          }),
          "Filed. I'll file messages like this. Undo",
          true
        );
      },
      neededMe: (id) => {
        patch((m) => ({
          ...m,
          messages: m.messages.map((msg) =>
            msg.id === id ? { ...msg, tab: "reply", summary: "You said this needed you." } : msg
          ),
        }), "Moved to Needs reply and added to Today.");
      },
      releaseHeld: (id) => {
        patch((m) => ({
          ...m,
          messages: m.messages.map((msg) =>
            msg.id === id
              ? { ...msg, tab: "reply", summary: "You confirmed this has no patient information." }
              : msg
          ),
        }), "Released. It can be triaged now.");
      },
      chooseMessageOption: (id, option) => {
        patch((m) => ({
          ...m,
          messages: m.messages.map((msg) =>
            msg.id === id
              ? { ...msg, tab: "reply", summary: `You chose ${option}. Draft ready.`, draft: `Hi, thanks for the note. ${option}.` }
              : msg
          ),
        }), `${option} saved. A draft is ready.`);
      },
      reassign: (taskId, personId, reason) => {
        const person = PEOPLE.find((p) => p.id === personId);
        const task = model.tasks.find((t) => t.id === taskId);
        if (task && (task.client || task.draft) && !clientReady(personId, model.training)) {
          showToast(`${person?.firstName ?? "They"} ${person ? "is" : "are"} still in training. Client work waits for sign-off.`);
          return;
        }
        patch((m) => ({
          ...m,
          tasks: m.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  ownerId: personId,
                  history: [
                    ...t.history,
                    {
                      id: uid("h"),
                      at: "10:42 AM AZ",
                      actor: viewer.name,
                      text: `Reassigned to ${person?.name ?? "a teammate"}. ${reason}`,
                    },
                  ],
                }
              : t
          ),
          personPatch: {
            ...m.personPatch,
            imran: { status: "on_track", statusLabel: "On track", workingNow: "Next task" },
          },
        }), `Reassigned to ${person?.firstName}. They've been told.`);
        setUi((u) => ({ ...u, sheet: null }));
      },
      moveToTomorrow: (taskId) => {
        patch((m) => ({
          ...m,
          tasks: m.tasks.map((t) =>
            t.id === taskId
              ? { ...t, currentDue: "Wed Oct 21", dueLabel: "Wed Oct 21", status: "open", dueTone: "neutral" }
              : t
          ),
          personPatch: {
            ...m.personPatch,
            imran: {
              status: "on_track",
              statusLabel: "On track",
              workingNow: "Moved to tomorrow · Canyon View appeal",
            },
          },
        }), "Moved to tomorrow. The original due date is unchanged.");
      },
      messagePerson: (name) => {
        showToast(`Draft sent to ${name} in Slack.`);
        setUi((u) => ({ ...u, sheet: null }));
      },
      decide: (id, choice) => {
        const decision = model.decisions.find((d) => d.id === id);
        if (decision?.kind === "money" && choice === "Approve" && ui.confirmMoneyId !== id) {
          setUi((u) => ({ ...u, confirmMoneyId: id }));
          return;
        }
        patch((m) => ({
          ...m,
          decisions: m.decisions.map((d) =>
            d.id === id
              ? { ...d, status: choice === "Decline" || choice === "Send back" ? "declined" : "approved", choice }
              : d
          ),
          tasks: m.tasks.map((t) =>
            (id === "dec-deposit" && t.id === "george-deposit") ||
            (id === "dec-sku" && t.id === "george-sku") ||
            (id === "dec-offer" && t.id === "george-offer")
              ? { ...t, status: "done", doneAt: "10:42 AM AZ" }
              : t
          ),
        }), choice === "Approve" && decision?.amount
          ? `Approved ${decision.amount} to ${decision.payee}.`
          : `${choice} recorded.`);
        setUi((u) => ({ ...u, confirmMoneyId: null }));
      },
      setConfirmMoney: (confirmMoneyId) => setUi((u) => ({ ...u, confirmMoneyId })),
      pauseAi: (on) => {
        setModel((m) => ({ ...m, georgePaused: on }));
        showToast(on ? "AI is paused for everyone." : "AI is back.");
      },
      recheckConnectors: () => {
        setModel((m) => ({
          ...m,
          connectors: m.connectors.map((c) => ({ ...c, checkedAt: "10:42 AM AZ" })),
        }));
        showToast("Checked 10 connectors. 2 still need a fix.");
      },
      completeFinish: (id) => {
        setModel((m) => ({
          ...m,
          finishSteps: m.finishSteps.map((s) => (s.id === id ? { ...s, state: "done" } : s)),
        }));
      },
      stuckFinish: (id) => {
        setModel((m) => ({
          ...m,
          finishSteps: m.finishSteps.map((s) => (s.id === id ? { ...s, state: "stuck" } : s)),
        }));
        showToast("I told IT. You can keep going.");
      },
      requestTimeOff: () => {
        if (!viewer.backup1) {
          showToast("You don't have a backup yet.");
          return;
        }
        setModel((m) => ({ ...m, timeOffStatus: "pending" }));
        showToast("Sent to Omar for approval.");
      },
      advanceOnboarding: () => {
        setModel((m) => ({
          ...m,
          onboardingIndex: Math.min(m.onboardingIndex + 1, 6),
        }));
        showToast("That's how it works. Real ones go to the person in the thread.");
      },
      confirmMeeting: (id) => {
        setModel((m) => ({
          ...m,
          meetings: m.meetings.map((meeting) =>
            meeting.id === id
              ? {
                  ...meeting,
                  notes: "Confirmed",
                  actions: meeting.actions?.map((a) =>
                    a.owner ? { ...a, status: "Confirmed" } : a
                  ),
                }
              : meeting
          ),
        }));
        showToast("3 tasks created. One still needs an owner.");
      },
      addComment: (taskId, text) => {
        if (!text.trim()) return;
        setModel((m) => ({
          ...m,
          tasks: m.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [
                    ...t.comments,
                    { id: uid("c"), author: viewer.name, at: "10:42 AM AZ", text: text.trim() },
                  ],
                }
              : t
          ),
        }));
      },
      reconnectSlack: () => {
        setUi((u) => ({ ...u, slackReconnect: false }));
        showToast("Slack connected.");
      },
      taskById: (id) => model.tasks.find((t) => t.id === id),
      canViewTask: (task) => {
        if (ui.role === "george") return true;
        if (task.ownerId === viewer.id) return true;
        if (
          ui.role === "leader" &&
          model.memberships.some(
            (m) => m.personId === viewer.id && m.teamRole === "leader" && m.departmentId === task.departmentId
          )
        ) {
          return true;
        }
        return false;
      },
      isOwner: ui.role === "george",
      isAdmin: ui.role === "administrator",
      canEditAccess: ui.role === "administrator",
      canViewAccess: ui.role === "administrator" || ui.role === "george",
      myMemberships: model.memberships.filter((m) => m.personId === viewer.id),
      selectReview: (id) => setModel((m) => ({ ...m, selectedReviewId: id })),
      addReviewNote: (id, blockId, text) => {
        const note = text.trim();
        if (!note) return;
        setModel((m) => ({
          ...m,
          reviews: m.reviews.map((r) =>
            r.id === id
              ? {
                  ...r,
                  notes: [
                    ...r.notes,
                    { id: uid("n"), version: r.current, author: viewer.name, at: "10:42 AM AZ", blockId, text: note },
                  ],
                }
              : r
          ),
        }));
      },
      requestReviewChanges: (id) => {
        let started = false;
        setModel((m) => {
          const item = m.reviews.find((r) => r.id === id);
          if (!item || item.state === "revising" || item.state === "sent") return m;
          const hasNote = item.notes.some((n) => n.version === item.current);
          if (!hasNote) return m;
          started = true;
          return {
            ...m,
            reviews: m.reviews.map((r) => (r.id === id ? { ...r, state: "revising" } : r)),
          };
        });
        if (!started) return;
        window.setTimeout(() => {
          setModel((m) => {
            const item = m.reviews.find((r) => r.id === id);
            if (!item || item.state !== "revising") return m;
            const notes = item.notes.filter((n) => n.version === item.current);
            const base = item.queued ?? item.versions[item.versions.length - 1];
            const version = {
              ...base,
              number: item.current + 1,
              at: "10:43 AM AZ",
              summary: notes[0] ? `Revised from your note: “${notes[0].text}”` : base.summary,
              changes: base.changes.length
                ? base.changes.map((change, i) => ({ ...change, note: notes[i]?.text ?? notes[0]?.text ?? change.note }))
                : notes.map((n) => ({ note: n.text, before: "The previous draft", after: "Updated from your note." })),
            };
            return {
              ...m,
              reviews: m.reviews.map((r) =>
                r.id === id
                  ? { ...r, state: "ready_again", current: version.number, versions: [...r.versions, version], queued: undefined }
                  : r
              ),
            };
          });
          showToast("Ready for you again.");
        }, 900);
      },
      approveReview: (id) => {
        setModel((m) => {
          const review = m.reviews.find((r) => r.id === id);
          if (!review) return m;
          const body = review.versions[review.versions.length - 1]?.blocks.map((block) => block.text).join("\n\n") ?? "";
          return {
            ...m,
            reviews: m.reviews.map((r) =>
              r.id === id ? { ...r, state: "approved", approver: viewer.name, approvedAt: "10:42 AM AZ" } : r
            ),
            messages: [
              {
                id: uid("msg"),
                ownerId: viewer.id,
                tab: "reply",
                source: "Review",
                sourceKind: "gmail",
                from: "DPCP OS",
                org: review.forWhom,
                subject: `Send: ${review.title}`,
                summary: "Approved. The draft is ready when a send is needed.",
                time: "Just now",
                body,
                draft: body || `Sharing the finished ${review.title}.`,
                triage: "Queued from Review after you approved it.",
              },
              ...m.messages,
            ],
          };
        });
        showToast("Approved. The send is waiting in Communication.");
      },
      rejectReview: (id) => {
        setModel((m) => ({
          ...m,
          reviews: m.reviews.map((r) => (r.id === id ? { ...r, state: "rejected" } : r)),
        }));
        showToast("Set aside. It will not go out.");
      },
      sendReview: (id) => {
        setModel((m) => ({
          ...m,
          reviews: m.reviews.map((r) =>
            r.id === id && r.state === "approved" ? { ...r, state: "sent", sentAt: "10:42 AM AZ" } : r
          ),
        }));
        showToast("Sent. You approved it first.");
      },
      handToReview: (title, body) => {
        const id = uid("rev");
        setModel((m) => ({
          ...m,
          selectedReviewId: id,
          reviews: [
            {
              id,
              ownerId: viewer.id,
              departmentId: viewer.departmentId === "owner" ? "operations" : viewer.departmentId,
              kind: "document",
              title,
              forWhom: "You",
              whyNow: title.includes("monthly report") ? "Drafted by AI. It waits in Review and is not sent on its own." : "You asked for this. It waits until you say it's ready.",
              state: "needs_review",
              current: 1,
              versions: [{ number: 1, at: "10:42 AM AZ", summary: "Prepared from what you asked.", blocks: [{ id: "b1", text: body }], changes: [] }],
              notes: [],
            },
            ...m.reviews,
          ],
        }));
        showToast("It's in Review. Nothing goes out until you approve it.");
        return id;
      },
      setMembership: (personId, departmentId, teamRole) => {
        if (ui.role !== "administrator") return;
        setModel((m) => {
          const exists = m.memberships.some((row) => row.personId === personId && row.departmentId === departmentId);
          return {
            ...m,
            memberships: exists
              ? m.memberships.map((row) =>
                  row.personId === personId && row.departmentId === departmentId ? { ...row, teamRole } : row
                )
              : [...m.memberships, { personId, departmentId, teamRole }],
          };
        });
      },
      removeMembership: (personId, departmentId) => {
        if (ui.role !== "administrator") return;
        setModel((m) => ({
          ...m,
          memberships: m.memberships.filter((row) => !(row.personId === personId && row.departmentId === departmentId)),
        }));
      },
      completeCheckin: (slot, answers) => {
        const questions = CHECKIN_QUESTIONS[slot];
        const transcript = [
          { speaker: "ai" as const, text: "Same three questions as the team meeting. I'll keep this short." },
          ...questions.flatMap((question, i) => [
            { speaker: "ai" as const, text: question },
            { speaker: "person" as const, text: answers[i]?.trim() || "Nothing to add." },
          ]),
        ];
        setModel((m) => ({
          ...m,
          checkins: m.checkins.map((row) =>
            row.personId === viewer.id && row.slot === slot && row.status !== "excused"
              ? {
                  ...row,
                  status: "ai",
                  at: "10:48 AM",
                  summary: answers.map((a) => a.trim()).filter(Boolean),
                  transcript,
                }
              : row
          ),
        }));
        showToast("Check-in logged. Same record as the team meeting.");
      },
      setModelRoute: (taskType, field, modelId) => {
        if (ui.role !== "administrator" && ui.role !== "george") return;
        setModel((m) => ({
          ...m,
          modelRoutes: m.modelRoutes.map((route) =>
            route.taskType === taskType ? { ...route, [field]: modelId } : route
          ),
        }));
        showToast("Saved. The next call uses this model.");
      },
      advanceRollout: (personId) => {
        if (ui.role !== "administrator" && ui.role !== "george") return;
        setModel((m) => ({
          ...m,
          rollout: m.rollout.map((row) =>
            row.personId === personId ? withStage(row, nextStage(row.stage)) : row
          ),
        }));
        showToast("Stage updated. Nobody is blocked while they move.");
      },
      completeOrientation: () => {
        setModel((m) => ({
          ...m,
          rollout: m.rollout.map((row) => {
            if (row.personId !== viewer.id) return row;
            const stage = row.stage === "orientation" ? nextStage(row.stage) : row.stage;
            const next = withStage(row, stage);
            return {
              ...next,
              checks: next.checks.map((check) =>
                check.label === "First-login orientation" ? { ...check, done: true } : check
              ),
            };
          }),
        }));
        showToast("Orientation done. Your workday is open.");
      },
      approveGeorge: (id) => {
        const thread = model.georgeInbox.find((row) => row.id === id);
        setModel((m) => ({
          ...m,
          georgeInbox: m.georgeInbox.map((row) => (row.id === id ? { ...row, state: "sent" } : row)),
        }));
        showToast(thread ? `Sent. ${thread.inbox} never had to be opened.` : "Sent.");
      },
      fileGeorge: (id) => {
        setModel((m) => ({
          ...m,
          georgeInbox: m.georgeInbox.map((row) => (row.id === id ? { ...row, state: "filed" } : row)),
        }));
        showToast("Filed. No reply sent.");
      },
      askBot: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const result = routeText(trimmed, { role: "george", clarifyTurns: 0 });
        const called = callModel({
          routes: model.modelRoutes,
          taskType: result.items.some((item) => item.kind === "job") ? "background" : "router",
          prompt: trimmed,
        });
        const user = { id: uid("bot-u"), kind: "user" as const, text: trimmed };
        const replies = result.items.map((item) =>
          item.kind === "assistant" || item.kind === "clarify"
            ? { ...item, routeNote: `${item.routeNote} · ${called.note}` }
            : item
        );
        setModel((m) => ({ ...m, botChat: [...m.botChat, user, ...replies] }));
      },
      addFeedbackNote: (id, text) => {
        const note = text.trim();
        if (!note) return;
        setModel((m) => ({
          ...m,
          feedback: m.feedback.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: item.status === "new" ? "in_progress" : item.status,
                  notes: [...item.notes, { at: "10:48 AM", author: viewer.name, text: note }],
                  timeline: [...item.timeline, { at: "10:48 AM", text: `${viewer.name} added a note.` }],
                }
              : item
          ),
        }));
      },
      setFeedbackStatus: (id, status) => {
        setModel((m) => ({
          ...m,
          feedback: m.feedback.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  timeline: [...item.timeline, { at: "10:48 AM", text: `Status set to ${status.replaceAll("_", " ")}.` }],
                }
              : item
          ),
        }));
      },
      sendFeedbackFollowUp: (id) => {
        setModel((m) => ({
          ...m,
          feedback: m.feedback.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "follow_up",
                  timeline: [...item.timeline, { at: "10:48 AM", text: `Follow-up sent to ${item.clientName}. They stay in this thread.` }],
                }
              : item
          ),
        }));
        showToast("Follow-up sent. The client does not need a separate thread.");
      },
      submitFeedback: ({ practice, clientName, aboutId, stars, body }) => {
        const negative = stars <= 3;
        const ownerId = supervisorId(aboutId, PEOPLE, DEPARTMENTS);
        const chain = negative ? escalationChain(aboutId, PEOPLE, DEPARTMENTS) : [aboutId];
        const item: ClientFeedback = {
          id: uid("fb"),
          sentiment: negative ? "negative" : "positive",
          source: "form",
          practice: practice.trim() || "A client",
          clientName: clientName.trim() || "A client",
          aboutId,
          ownerId,
          chain,
          escalated: negative,
          status: negative ? "new" : "resolved",
          summary: body.trim().slice(0, 140) || "Submitted from the feedback form.",
          body: body.trim() || "No written comment.",
          detected: false,
          followUp: negative
            ? `Thank you for telling us. I own this until it's resolved.\n\nDental Practice Copilot`
            : "",
          notes: [],
          timeline: [
            { at: "10:48 AM", text: "Submitted on the branded feedback form." },
            {
              at: "10:48 AM",
              text: negative
                ? `Assigned to the direct supervisor and reported up to George.`
                : "Logged as positive. Not escalated.",
            },
          ],
        };
        const about = PEOPLE.find((p) => p.id === aboutId);
        const win = negative
          ? null
          : {
              id: uid("win"),
              kind: "win" as const,
              authorId: "ai",
              aboutId,
              title: `${clientName.trim() || "A client"} thanked ${about?.firstName ?? "a teammate"}`,
              body: body.trim() || "A client sent thanks through the feedback form.",
              at: "10:48 AM",
              pillar: "integrity" as const,
              reactions: [],
              comments: [],
            };
        setModel((m) => ({
          ...m,
          feedback: [item, ...m.feedback],
          culture: win ? [win, ...m.culture] : m.culture,
        }));
        showToast(
          negative
            ? "Sent to the supervisor and up to George."
            : "Thank you. That was logged, and it posted as a win."
        );
      },
      reactToCulture: (postId, kind) => {
        setModel((m) => ({
          ...m,
          culture: m.culture.map((post) => {
            if (post.id !== postId) return post;
            const has = post.reactions.some((r) => r.personId === viewer.id && r.kind === kind);
            return {
              ...post,
              reactions: has
                ? post.reactions.filter((r) => !(r.personId === viewer.id && r.kind === kind))
                : [...post.reactions, { personId: viewer.id, kind }],
            };
          }),
        }));
      },
      commentOnCulture: (postId, text) => {
        const note = text.trim();
        if (!note) return;
        setModel((m) => ({
          ...m,
          culture: m.culture.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    { id: uid("cc"), authorId: viewer.id, text: note, at: "10:48 AM" },
                  ],
                }
              : post
          ),
        }));
      },
      addShoutout: (aboutId, text, pillar) => {
        const note = text.trim();
        if (!note) return;
        const about = PEOPLE.find((p) => p.id === aboutId);
        setModel((m) => ({
          ...m,
          culture: [
            {
              id: uid("shout"),
              kind: "shout",
              authorId: viewer.id,
              aboutId,
              title: note,
              body: `For ${about?.name ?? "a teammate"}.`,
              at: "10:48 AM",
              pillar,
              reactions: [],
              comments: [],
            },
            ...m.culture,
          ],
        }));
        showToast("Posted to Wins & Culture.");
      },
      shareSuggestion: (id) => {
        setModel((m) => {
          const suggestion = m.cultureSuggestions.find((s) => s.id === id);
          if (!suggestion) return m;
          return {
            ...m,
            cultureSuggestions: m.cultureSuggestions.filter((s) => s.id !== id),
            culture: [
              {
                id: uid("win"),
                kind: "suggested",
                authorId: "ai",
                aboutId: suggestion.aboutId,
                title: suggestion.title,
                body: suggestion.body,
                at: "10:48 AM",
                pillar: suggestion.pillar,
                reactions: [],
                comments: [],
              },
              ...m.culture,
            ],
          };
        });
        showToast("Shared. That win is theirs, their team's, and the company's mission.");
      },
      addGrowthNote: (personId, pillar, text) => {
        const note = text.trim();
        if (!note) return;
        setModel((m) => ({
          ...m,
          growthNotes: [
            { id: uid("gn"), personId, fromId: viewer.id, pillar, text: note, at: "Oct 20" },
            ...m.growthNotes,
          ],
        }));
        showToast("Saved. They can see this on Growth.");
      },
      saveGrowthReview: (personId, summary, scores) => {
        setModel((m) => ({
          ...m,
          growthReviews: m.growthReviews.map((review) =>
            review.personId === personId && review.status === "draft" ? { ...review, summary, scores } : review
          ),
        }));
        showToast("Draft saved. It is not final until you say so.");
      },
      finalizeGrowthReview: (personId) => {
        setModel((m) => ({
          ...m,
          growthReviews: m.growthReviews.map((review) =>
            review.personId === personId ? { ...review, status: "final" } : review
          ),
        }));
        showToast("Final. This is the conversation, not a surprise.");
      },
      addSkill: (personId, name, pillar) => {
        const label = name.trim();
        if (!label) return;
        setModel((m) => ({
          ...m,
          skills: [
            { id: uid("sk"), personId, name: label, pillar, at: "Oct 20", how: "Named on Growth" },
            ...m.skills,
          ],
        }));
        showToast("That's a skill. It stays on your record.");
      },
      submitIdea: ({ body, mode, screen, screenTitle }) => {
        const text = body.trim();
        if (!text) return;
        const title = text.split("\n")[0].slice(0, 90);
        setModel((m) => ({
          ...m,
          ideas: [
            {
              id: uid("idea"),
              authorId: viewer.id,
              title,
              body: text,
              mode,
              screen,
              screenTitle,
              at: "Oct 20",
              status: "received",
              votes: [],
              themeId: themeFor(text),
              credited: false,
            },
            ...m.ideas,
          ],
        }));
        setUi((u) => ({ ...u, feedbackOpen: false, toast: { text: "It's on the board. People can vote." } }));
      },
      voteIdea: (id) => {
        setModel((m) => ({
          ...m,
          ideas: m.ideas.map((idea) => {
            if (idea.id !== id) return idea;
            const voted = idea.votes.includes(viewer.id);
            return {
              ...idea,
              votes: voted ? idea.votes.filter((personId) => personId !== viewer.id) : [...idea.votes, viewer.id],
            };
          }),
        }));
      },
      advanceIdea: (id) => {
        if (ui.role !== "george" && ui.role !== "administrator") return;
        setModel((m) => {
          const idea = m.ideas.find((row) => row.id === id);
          if (!idea) return m;
          const status = nextIdeaStatus(idea.status);
          if (!status) return m;
          const shipping = status === "shipped" && !idea.credited;
          const author = PEOPLE.find((p) => p.id === idea.authorId);
          return {
            ...m,
            ideas: m.ideas.map((row) => (row.id === id ? { ...row, status, credited: shipping ? true : row.credited } : row)),
            culture: shipping
              ? [
                  {
                    id: uid("built"),
                    kind: "built" as const,
                    authorId: "ai",
                    aboutId: idea.authorId,
                    title: `You asked, we built: ${idea.title}`,
                    body: `${author?.name ?? "A teammate"} asked for this from ${idea.screenTitle}. It shipped. Thank you, ${author?.firstName ?? "there"}.`,
                    at: "Oct 20",
                    pillar: "intelligence" as const,
                    reactions: [],
                    comments: [],
                  },
                  ...m.culture,
                ]
              : m.culture,
          };
        });
        showToast("Status updated.");
      },
      addAppreciation: (aboutId, text, pillar) => {
        const note = text.trim();
        if (!note) return;
        const about = PEOPLE.find((p) => p.id === aboutId);
        setModel((m) => ({
          ...m,
          culture: [
            {
              id: uid("fri"),
              kind: "appreciation",
              authorId: viewer.id,
              aboutId,
              title: note,
              body: `Friday appreciation for ${about?.name ?? "a teammate"}. It counts toward the monthly spotlight.`,
              at: "Oct 20",
              pillar,
              reactions: [],
              comments: [],
            },
            ...m.culture,
          ],
        }));
        showToast("Posted. It feeds the October spotlight.");
      },
      suggestCultureIdea: (text) => {
        const note = text.trim();
        if (!note) return;
        setModel((m) => ({
          ...m,
          cultureIdeas: [{ id: uid("ci"), authorId: viewer.id, text: note, at: "Oct 20" }, ...m.cultureIdeas],
        }));
        showToast("Sent. Your lead can read it in Wins & Culture.");
      },
      toggleTrainingStep: (personId, stepId) => {
        setModel((m) => ({
          ...m,
          training: m.training.map((track) =>
            track.personId === personId
              ? { ...track, steps: track.steps.map((step) => (step.id === stepId ? { ...step, done: !step.done } : step)) }
              : track
          ),
        }));
      },
      signOffTraining: (personId) => {
        const person = PEOPLE.find((p) => p.id === personId);
        setModel((m) => ({
          ...m,
          training: m.training.map((track) =>
            track.personId === personId
              ? {
                  ...track,
                  signedOff: true,
                  signedBy: viewer.name,
                  signedAt: "Oct 20",
                  steps: track.steps.map((step) => ({ ...step, done: true })),
                }
              : track
          ),
        }));
        showToast(`${person?.firstName ?? "They"} can take client work now.`);
      },
      savePulse: (id, answers) => {
        if (answers.every((line) => !line.trim())) return;
        setModel((m) => ({
          ...m,
          pulses: m.pulses.map((pulse) => (pulse.id === id ? { ...pulse, status: "done", answers } : pulse)),
        }));
        showToast("Pulse saved. The next one is on the calendar.");
      },
      postSendoff: (text) => {
        const note = text.trim();
        if (!note) return;
        setModel((m) => ({
          ...m,
          offboard: { ...m.offboard, sendoff: note, sendoffPosted: true },
          culture: [
            {
              id: uid("farewell"),
              kind: "farewell",
              authorId: viewer.id,
              title: `Send-off for ${m.offboard.personName}`,
              body: note,
              at: "Oct 20",
              pillar: "integrity",
              reactions: [],
              comments: [],
            },
            ...m.culture,
          ],
        }));
        showToast("The send-off is in Wins & Culture.");
      },
      saveExitFeedback: (text) => {
        setModel((m) => ({ ...m, offboard: { ...m.offboard, feedback: text.trim() } }));
        showToast("Saved with the lead and George.");
      },
      ackMessage: (id) => {
        setModel((m) => ({
          ...m,
          messages: m.messages.map((message) =>
            message.id === id ? { ...message, tab: "handled", summary: "Acknowledged." } : message
          ),
        }));
        showToast("Acknowledged.");
      },
      updateProjectPhase: (projectId, phaseId, patch) => {
        setModel((m) => ({
          ...m,
          projects: m.projects.map((project) =>
            project.id === projectId
              ? { ...project, phases: project.phases.map((phase) => (phase.id === phaseId ? { ...phase, ...patch } : phase)) }
              : project
          ),
        }));
      },
      updateTemplatePhase: (templateId, phaseId, name) => {
        const next = name.trim();
        if (!next) return;
        setModel((m) => ({
          ...m,
          projectTemplates: m.projectTemplates.map((template) =>
            template.id === templateId
              ? { ...template, phases: template.phases.map((phase) => (phase.id === phaseId ? { ...phase, name: next } : phase)) }
              : template
          ),
        }));
      },
      toggleOffboard: (list, id) => {
        setModel((m) => ({
          ...m,
          offboard: {
            ...m.offboard,
            [list]: m.offboard[list].map((row) => (row.id === id ? { ...row, done: !row.done } : row)),
          },
        }));
      },
    };
    // Derived values are listed. Actions close over the latest model via the memo deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui, model, viewer, myTasks, focus, peek, progress, aiPaused, offline, banner, noticeOpen]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppStoreProvider");
  return ctx;
}

export function personName(id: string) {
  return PEOPLE.find((p) => p.id === id)?.name ?? id;
}

export type { InboxItem, Decision };
