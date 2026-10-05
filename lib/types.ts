/** Domain types for the prototype. A later Supabase layer should return these shapes. */

/** Prototype view, and the access a person is granted. Team leader vs member is separate. */
export type Role = "employee" | "leader" | "administrator" | "george" | "owner";

export type ScreenState =
  | "ready"
  | "empty"
  | "loading"
  | "error"
  | "offline"
  | "paused";

export type DepartmentId =
  | "insurance"
  | "marketing"
  | "staffing"
  | "finance"
  | "equipment"
  | "supplies"
  | "coaching"
  | "operations"
  | "owner";

export type FamilyId =
  | "insurance"
  | "marketing"
  | "staffing"
  | "finance"
  | "equipment"
  | "supplies"
  | "dpcp";

export type Tone = "green" | "amber" | "red" | "blue" | "neutral";

export interface Person {
  id: string;
  name: string;
  firstName: string;
  initials: string;
  role: Role;
  title: string;
  departmentId: DepartmentId;
  email: string;
  tz: "AZ" | "SAST" | "PKT";
  goal: number;
  execution: number;
  streak: number;
  savedToday: string;
  shift: string;
  backup1?: string;
  backup2?: string;
  timeOff?: boolean;
  todayDone: number;
  todayTotal: number;
  status: "on_track" | "behind" | "blocked" | "time_off" | "not_started";
  statusLabel: string;
  workingNow: string;
  loadNote?: string;
  /** Set by management. Not something the person toggles. */
  canManageTeams?: boolean;
  /** What teammates should come to this person for. */
  helpsWith?: string;
  /** Reserved for a future office layer. Empty for internal DPCP work. */
  officeId?: string;
}

export type TeamRole = "leader" | "member";

export interface Membership {
  personId: string;
  departmentId: DepartmentId;
  teamRole: TeamRole;
}

export interface Department {
  id: DepartmentId;
  name: string;
  family: FamilyId;
  leadId: string;
  onTime: number;
  overdue: number;
  blocked: number;
  todayDone: number;
  todayTotal: number;
}

export type TaskKind = "approval" | "human" | "meeting" | "decision" | "review";
export type TaskStatus = "open" | "blocked" | "waiting" | "done";

export interface TaskStep {
  id: string;
  label: string;
  state: "done" | "current" | "todo";
}

export interface TaskEvent {
  id: string;
  at: string;
  actor: string;
  text: string;
}

export interface TaskComment {
  id: string;
  author: string;
  at: string;
  text: string;
}

export interface Task {
  id: string;
  ownerId: string;
  departmentId: DepartmentId;
  title: string;
  why: string;
  kind: TaskKind;
  status: TaskStatus;
  sourceLabel: string;
  sourceKind: "email" | "slack" | "meeting" | "app";
  dueLabel: string;
  dueTone: Tone;
  originalDue: string;
  currentDue: string;
  estimateMin: number;
  spentMin: number;
  recipient?: string;
  draft?: { channel: "gmail" | "slack"; accountLabel: string; body: string };
  prepared: string[];
  doneDefinition: string;
  sop?: { name: string; section: string };
  proofRequired?: boolean;
  proof?: string;
  client?: string;
  blockedReason?: string;
  waitingNote?: string;
  steps: TaskStep[];
  history: TaskEvent[];
  comments: TaskComment[];
  related: { label: string; href: string }[];
  skips: number;
  order: number;
  doneAt?: string;
  queued?: boolean;
  unprepared?: boolean;
  options?: string[];
  money?: { amount: string; payee: string };
  /** Reserved for a future office layer. Empty for internal DPCP work. */
  officeId?: string;
}

export type InboxTab = "reply" | "decision" | "handled" | "filed" | "held";

export interface InboxItem {
  id: string;
  ownerId: string;
  tab: InboxTab;
  source: string;
  sourceKind: "gmail" | "slack";
  from: string;
  org: string;
  subject: string;
  summary: string;
  time: string;
  body: string;
  draft?: string;
  triage: string;
  taskId?: string;
  unread?: boolean;
  options?: string[];
  /** Client email. Internal threads do not carry a client SLA. */
  client?: boolean;
  slaLabel?: string;
  slaTone?: Tone;
}

export type GeorgeChannel = "email" | "slack" | "whatsapp" | "text";

export type FeedbackSource = "form" | "email" | "slack" | "text";
export type FeedbackSentiment = "negative" | "positive";
export type FeedbackStatus = "new" | "in_progress" | "follow_up" | "resolved";

export interface FeedbackNote {
  at: string;
  author: string;
  text: string;
}

export interface FeedbackEvent {
  at: string;
  text: string;
}

export interface ClientFeedback {
  id: string;
  sentiment: FeedbackSentiment;
  source: FeedbackSource;
  practice: string;
  clientName: string;
  aboutId: string;
  ownerId: string;
  /** Person, then each manager up to George. */
  chain: string[];
  escalated: boolean;
  status: FeedbackStatus;
  summary: string;
  body: string;
  detected: boolean;
  followUp: string;
  notes: FeedbackNote[];
  timeline: FeedbackEvent[];
}

export interface GeorgeThread {
  id: string;
  channel: GeorgeChannel;
  inbox: string;
  from: string;
  org: string;
  subject: string;
  summary: string;
  draft: string;
  why: string;
  waiting: string;
  state: "needs_you" | "sent" | "filed";
}

export interface MeetingAction {
  id: string;
  text: string;
  owner: string;
  due: string;
  status: "Proposed" | "Confirmed" | "Needs owner" | "Needs date";
}

export interface Meeting {
  id: string;
  title: string;
  when: string;
  zone: string;
  dayGroup: "Today" | "Coming up" | "Past";
  type: "Client" | "Internal";
  /** Daily, team, client, or internal. Inferred from kind and type when omitted. */
  category?: "daily" | "team" | "client" | "internal";
  ledBy?: "leader" | "george";
  prep: "Ready" | "Preparing" | "Not needed";
  notes: "Upcoming" | "Waiting for notes" | "Recap ready" | "Confirmed";
  attendees: string[];
  leadId: string;
  meetLabel: string;
  agenda: string[];
  openItems: string[];
  recap?: string[];
  actions?: MeetingAction[];
  followUp?: string;
  /** Daily start-of-day or end-of-day team check-in. */
  kind?: "daily";
  slot?: CheckinSlot;
  departmentId?: DepartmentId;
}

export interface Decision {
  id: string;
  title: string;
  asker: string;
  context: string;
  kind: "money" | "legal" | "policy" | "hiring" | "escalation";
  amount?: string;
  payee?: string;
  deadline: string;
  urgency: "today" | "week" | "later";
  options: string[];
  status: "open" | "approved" | "declined";
  choice?: string;
}

export interface Notice {
  id: string;
  title: string;
  from: string;
  when: string;
  body: string;
  changes: string;
  audience: string;
  ack: number;
  question: number;
  seen: number;
  unseen: number;
  total: number;
}

export interface Ticket {
  id: string;
  reporterId: string;
  kind: "bug" | "idea";
  title: string;
  body: string;
  impact: "little" | "workaround" | "stuck";
  status: "Received" | "Grouped with others" | "Planned" | "Building" | "Shipped" | "Won't do";
  screen: string;
  duplicateCount?: number;
}

export interface Connector {
  id: string;
  name: string;
  state: "green" | "red" | "pending_employee" | "not_required";
  detail: string;
  checkedAt: string;
}

export interface FinishStep {
  id: string;
  title: string;
  detail: string;
  state: "todo" | "done" | "stuck";
}

export interface OnboardingStep {
  id: string;
  title: string;
  detail: string;
  estimate: string;
  kind: "practice" | "read" | "quiz";
}

export type ChatItem =
  | { id: string; kind: "user"; text: string; queued?: boolean }
  | { id: string; kind: "assistant"; text: string; routeNote: string }
  | {
      id: string;
      kind: "clarify";
      prompt: string;
      question: string;
      options: { id: string; label: string }[];
      chosen?: string;
      routeNote: string;
    }
  | {
      id: string;
      kind: "confirm";
      prompt: string;
      yes: string;
      no: string;
      resolved?: "yes" | "no";
    }
  | {
      id: string;
      kind: "approval";
      title: string;
      body: string;
      to: string;
      resolved?: "sent" | "cancelled";
    }
  | {
      id: string;
      kind: "job";
      title: string;
      started: string;
      status: "working" | "ready" | "failed";
    }
  | { id: string; kind: "fallback"; text: string };

export type ReviewState =
  | "needs_review"
  | "revising"
  | "ready_again"
  | "approved"
  | "sent"
  | "rejected";

export type ReviewKind = "email" | "document" | "spreadsheet" | "social";

export interface ReviewBlock {
  id: string;
  label?: string;
  text: string;
}

export interface ReviewChange {
  note: string;
  before: string;
  after: string;
}

export interface ReviewVersion {
  number: number;
  at: string;
  summary: string;
  blocks: ReviewBlock[];
  changes: ReviewChange[];
}

export interface ReviewNote {
  id: string;
  version: number;
  author: string;
  at: string;
  blockId: string | null;
  text: string;
}

export interface ReviewItem {
  id: string;
  ownerId: string;
  departmentId: DepartmentId;
  kind: ReviewKind;
  title: string;
  forWhom: string;
  whyNow: string;
  state: ReviewState;
  current: number;
  versions: ReviewVersion[];
  queued?: ReviewVersion;
  notes: ReviewNote[];
  approver?: string;
  approvedAt?: string;
  sentAt?: string;
}

export type CheckinSlot = "morning" | "evening";

/** Attended the team meeting, finished the same questions with AI, or has not checked in. */
export type CheckinStatus = "attended" | "ai" | "missing" | "upcoming" | "excused";

export interface CheckinLine {
  speaker: "ai" | "person";
  text: string;
}

export interface DailyCheckin {
  id: string;
  personId: string;
  departmentId: DepartmentId;
  slot: CheckinSlot;
  status: CheckinStatus;
  at?: string;
  summary?: string[];
  transcript?: CheckinLine[];
}

/** One row in the model catalog. Screens never call a vendor SDK. */
export type ModelTaskType = "drafts" | "review" | "checkin" | "background" | "router" | "summaries";

export interface ModelRoute {
  taskType: ModelTaskType;
  label: string;
  primary: string;
  backup: string;
}

/** Time Doctor, highest tier. Text only. No screenshot image and no patient detail. */
export interface TimeDoctorDay {
  personId: string;
  trackedMin: number;
  activity: number;
  idleMin: number;
  project: string;
  task: string;
  screenshot: string;
}

export interface UsageWeek {
  label: string;
  tokens: number;
  cost: number;
  tasksDone: number;
  execution: number;
}

export interface PersonUsage {
  personId: string;
  weeks: UsageWeek[];
}

export type RolloutStage = "orientation" | "onboarding" | "soft" | "switched";

export interface RolloutCheck {
  label: string;
  done: boolean;
}

export interface RolloutRow {
  personId: string;
  stage: RolloutStage;
  checks: RolloutCheck[];
}

export interface Model {
  tasks: Task[];
  messages: InboxItem[];
  meetings: Meeting[];
  decisions: Decision[];
  tickets: Ticket[];
  memberships: Membership[];
  reviews: ReviewItem[];
  selectedReviewId: string | null;
  chat: ChatItem[];
  clarifyTurns: number;
  chatContext: string | null;
  noticeAcked: boolean;
  noticeQuestioned: boolean;
  forceNotice: boolean;
  connectors: Connector[];
  finishSteps: FinishStep[];
  timeOffStatus: "none" | "pending" | "approved";
  onboardingIndex: number;
  dayClosed: Record<string, boolean>;
  movedCount: number;
  blockedCount: number;
  personPatch: Record<string, Partial<Person>>;
  georgePaused: boolean;
  selectedDept: DepartmentId;
  jobDelivered: boolean;
  checkins: DailyCheckin[];
  modelRoutes: ModelRoute[];
  rollout: RolloutRow[];
  georgeInbox: GeorgeThread[];
  botChat: ChatItem[];
  feedback: ClientFeedback[];
  culture: CulturePost[];
  cultureSuggestions: CultureSuggestion[];
  growthNotes: GrowthNote[];
  growthReviews: GrowthReview[];
  growthPlans: GrowthPlan[];
  skills: SkillGain[];
  ideas: ProductIdea[];
  monday: MondayThree[];
  training: TrainingTrack[];
  pulses: PulseCheck[];
  offboard: OffboardCase;
  cultureIdeas: CultureIdea[];
  projects: Project[];
  projectTemplates: ProjectTemplate[];
}

export type Pillar = "intelligence" | "energy" | "integrity";

export type CultureKind = "win" | "shout" | "milestone" | "suggested" | "welcome" | "farewell" | "appreciation" | "built";

export interface CultureReaction {
  personId: string;
  kind: "proud" | "thanks" | "withyou";
}

export interface CultureComment {
  id: string;
  authorId: string;
  text: string;
  at: string;
}

export interface CulturePost {
  id: string;
  kind: CultureKind;
  authorId: string;
  aboutId?: string;
  title: string;
  body: string;
  at: string;
  pillar: Pillar;
  featured?: boolean;
  reactions: CultureReaction[];
  comments: CultureComment[];
}

export interface CultureSuggestion {
  id: string;
  aboutId: string;
  title: string;
  body: string;
  reason: string;
  pillar: Pillar;
}

export interface GrowthNote {
  id: string;
  personId: string;
  fromId: string;
  pillar: Pillar;
  text: string;
  at: string;
}

export interface GrowthScore {
  pillar: Pillar;
  score: number;
  note: string;
}

export interface GrowthReview {
  personId: string;
  period: string;
  status: "draft" | "final";
  summary: string;
  scores: GrowthScore[];
  sources: string[];
}

export interface GrowthNeed {
  pillar: Pillar;
  text: string;
  ready: boolean;
}

export interface GrowthGoal {
  id: string;
  pillar: Pillar;
  text: string;
  thisWeek: boolean;
}

export interface GrowthPlan {
  personId: string;
  level: string;
  nextLevel: string;
  needs: GrowthNeed[];
  goals: GrowthGoal[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  detail: string;
  ownerId: string;
  due: string;
  status: "done" | "now" | "waiting" | "blocked";
  dependsOn?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  phases: { id: string; name: string; detail: string }[];
}

export interface Project {
  id: string;
  name: string;
  templateId: string;
  departmentId: DepartmentId;
  phases: ProjectPhase[];
}

export interface SkillGain {
  id: string;
  personId: string;
  name: string;
  pillar: Pillar;
  at: string;
  how: string;
}

export type IdeaStatus = "received" | "planned" | "building" | "shipped";

export interface ProductIdea {
  id: string;
  authorId: string;
  title: string;
  body: string;
  mode: "text" | "voice";
  screen: string;
  screenTitle: string;
  at: string;
  status: IdeaStatus;
  votes: string[];
  themeId: string;
  credited: boolean;
}

export interface MondayItem {
  text: string;
  taskId?: string;
}

export interface MondayThree {
  personId: string;
  setOn: string;
  items: MondayItem[];
}

export interface TrainingStep {
  id: string;
  day: string;
  title: string;
  detail: string;
  done: boolean;
}

export interface TrainingTrack {
  personId: string;
  started: string;
  window: string;
  steps: TrainingStep[];
  signedOff: boolean;
  signedBy?: string;
  signedAt?: string;
}

export interface PulseCheck {
  id: string;
  personId: string;
  day: 7 | 30 | 90;
  due: string;
  status: "upcoming" | "due" | "done";
  questions: string[];
  answers: string[];
}

export interface OffboardCheck {
  id: string;
  label: string;
  owner: string;
  done: boolean;
}

export interface OffboardCase {
  personName: string;
  role: string;
  department: string;
  lastDay: string;
  leadId: string;
  sendoff: string;
  sendoffPosted: boolean;
  feedback: string;
  handover: OffboardCheck[];
  access: OffboardCheck[];
}

export interface CultureIdea {
  id: string;
  authorId: string;
  text: string;
  at: string;
}
