/** Performance, workforce, training, clients, admin, and value. Sample structure. Monday replaces the numbers. */

import { PRACTICES } from "@/lib/round2/data";

export interface MetricPoint {
  label: string;
  value: number;
}

export interface PracticeHealth {
  practiceId: string;
  score: number;
  collections: number;
  collectionsGoal: number;
  checklist: number;
  openIssues: number;
  slaBreaches: number;
  satisfaction: number;
  trend: MetricPoint[];
  note: string;
}

function wave(start: number, end: number): MetricPoint[] {
  return Array.from({ length: 12 }, (_, i) => ({
    label: `W${i + 1}`,
    value: Math.round(start + ((end - start) * i) / 11 + Math.sin(i) * 1.5),
  }));
}

export const HEALTH: PracticeHealth[] = [
  { practiceId: "copper", score: 74, collections: 71200, collectionsGoal: 80000, checklist: 86, openIssues: 6, slaBreaches: 0, satisfaction: 4.4, trend: wave(68, 74), note: "Collections are up. Recare is the weak link. Sample." },
  { practiceId: "mesa", score: 69, collections: 64000, collectionsGoal: 70000, checklist: 78, openIssues: 4, slaBreaches: 1, satisfaction: 4.1, trend: wave(64, 69), note: "Build-out is holding a layout signature. Sample." },
  { practiceId: "ponderosa", score: 77, collections: 88000, collectionsGoal: 90000, checklist: 91, openIssues: 2, slaBreaches: 0, satisfaction: 4.6, trend: wave(72, 77), note: "Hygiene perio percent is the watch item. Sample." },
  { practiceId: "saguaro", score: 71, collections: 118900, collectionsGoal: 130000, checklist: 96, openIssues: 5, slaBreaches: 1, satisfaction: 4.2, trend: wave(70, 71), note: "Collections down 6% mostly from 3 unposted ERA batches. Sample." },
  { practiceId: "lakeview", score: 66, collections: 142000, collectionsGoal: 150000, checklist: 84, openIssues: 7, slaBreaches: 2, satisfaction: 3.4, trend: wave(78, 66), note: "Production is strong. AR over 90 days has risen for 3 weeks. Sample." },
  { practiceId: "redrock", score: 82, collections: 54000, collectionsGoal: 56000, checklist: 93, openIssues: 2, slaBreaches: 0, satisfaction: 4.7, trend: wave(80, 82), note: "Quiet week. One coverage gap on Friday. Sample." },
];

export interface AlertItem {
  id: string;
  practiceId: string;
  rule: string;
  detail: string;
  owner: string;
  action: string;
  tone: "amber" | "red";
}

export const ALERTS: AlertItem[] = [
  { id: "al-1", practiceId: "mesa", rule: "Checklist completion under 80% two days running", detail: "Open-the-day finished at 74% yesterday and 78% today.", owner: "Sam Ibarra", action: "Walk the list with the opener tomorrow.", tone: "amber" },
  { id: "al-2", practiceId: "lakeview", rule: "AR 90+ up 3 weeks in a row", detail: "90+ moved from 11% to 19% across three weeks.", owner: "Omar Hale", action: "Open the 60–90 day board before Friday.", tone: "red" },
  { id: "al-3", practiceId: "copper", rule: "Equipment down over 24 h", detail: "Op 7 chair has been down since yesterday afternoon.", owner: "Theo March", action: "Confirm Thursday's tech window with the office.", tone: "red" },
  { id: "al-4", practiceId: "lakeview", rule: "Satisfaction under 3.5 this week", detail: "Two closed tickets scored 2.", owner: "Tess Ward", action: "Department lead calls the office manager.", tone: "amber" },
];

export const BENCHMARK = { checklist: 88, satisfaction: 4.3, sla: 6, label: "HDG offices, anonymized average. Sample." };

export interface WorkPerson {
  id: string;
  name: string;
  team: string;
  startedAt: string;
  activeHours: number;
  planned: number;
  done: number;
  onTime: number;
  blockers: string;
  idle: number;
  aiShare: number;
  hoursSaved: number;
  systemFailure?: string;
  metadataOnly?: boolean;
  apps: string;
}

export const WORKFORCE: WorkPerson[] = [
  { id: "nadia", name: "Nadia Reyes", team: "Insurance", startedAt: "7:02 AM", activeHours: 3.4, planned: 8, done: 5, onTime: 4, blockers: "Appeal is with the lead", idle: 1, aiShare: 54, hoursSaved: 6.2, metadataOnly: true, apps: "PMS link-out, DPCP OS", systemFailure: "Oct 19 afternoon gap is a system failure. It is not counted against Nadia." },
  { id: "omar", name: "Omar Hale", team: "Insurance", startedAt: "7:10 AM", activeHours: 3.2, planned: 6, done: 4, onTime: 4, blockers: "None", idle: 0, aiShare: 41, hoursSaved: 3.1, apps: "DPCP OS, Drive" },
  { id: "theo", name: "Theo March", team: "Equipment", startedAt: "8:01 AM", activeHours: 2.6, planned: 5, done: 2, onTime: 2, blockers: "Waiting on a tech window", idle: 0, aiShare: 33, hoursSaved: 1.4, apps: "DPCP OS" },
  { id: "jonas", name: "Jonas Keller", team: "Supplies", startedAt: "6:40 AM", activeHours: 3.8, planned: 7, done: 5, onTime: 4, blockers: "Cart approval", idle: 1, aiShare: 48, hoursSaved: 2.2, apps: "Catalog, DPCP OS" },
  { id: "amina", name: "Amina Farouk", team: "Staffing", startedAt: "7:30 AM", activeHours: 3.1, planned: 6, done: 4, onTime: 4, blockers: "None", idle: 0, aiShare: 36, hoursSaved: 1.8, apps: "DPCP OS" },
  { id: "priya", name: "Priya Shah", team: "Marketing", startedAt: "8:15 AM", activeHours: 2.4, planned: 6, done: 2, onTime: 1, blockers: "Budget yes from Saguaro", idle: 0, aiShare: 62, hoursSaved: 4.0, apps: "Ads, DPCP OS" },
  { id: "elena", name: "Elena Voss", team: "Accounting", startedAt: "7:05 AM", activeHours: 3.5, planned: 5, done: 4, onTime: 4, blockers: "None", idle: 0, aiShare: 29, hoursSaved: 1.1, apps: "Books, DPCP OS" },
  { id: "rowan", name: "Rowan Blake", team: "IT", startedAt: "6:55 AM", activeHours: 3.6, planned: 7, done: 3, onTime: 3, blockers: "Lakeview backup", idle: 0, aiShare: 44, hoursSaved: 2.6, apps: "DPCP OS" },
];

export interface ShiftRow {
  practiceId: string;
  name: string;
  role: string;
  inToday: boolean;
  checklist: number;
  training: string;
}

export const SHIFTS: ShiftRow[] = [
  { practiceId: "copper", name: "Casey Nguyen", role: "Front desk", inToday: true, checklist: 80, training: "Confirmation module due" },
  { practiceId: "copper", name: "Hannah Brooks", role: "Hygiene", inToday: true, checklist: 100, training: "Book at the chair, in progress" },
  { practiceId: "copper", name: "Owen Blake", role: "Hygiene", inToday: false, checklist: 0, training: "Off today" },
  { practiceId: "copper", name: "Mia Santos", role: "Assistant", inToday: true, checklist: 90, training: "Sterilization 101 passed" },
  { practiceId: "saguaro", name: "Maria Alvarez", role: "Front desk", inToday: true, checklist: 100, training: "Current" },
  { practiceId: "saguaro", name: "Dana Kim", role: "Hygiene", inToday: true, checklist: 100, training: "Current" },
  { practiceId: "saguaro", name: "Pete Nunez", role: "Assistant", inToday: true, checklist: 70, training: "Sterilization retake" },
  { practiceId: "lakeview", name: "Kyle Brennan", role: "Front desk", inToday: true, checklist: 84, training: "Current" },
  { practiceId: "redrock", name: "Noor Haddad", role: "Front desk", inToday: true, checklist: 93, training: "Current" },
];

export interface LessonModule {
  id: string;
  path: string;
  title: string;
  minutes: number;
  sopId: string;
  captions: string;
  pass: number;
  questions: { q: string; choices: string[]; answer: number }[];
  unlocks?: string;
}

export const PATHS = [
  { id: "front-desk", title: "Front desk", audience: "Practice" },
  { id: "hygienist", title: "Hygienist", audience: "Practice" },
  { id: "assistant", title: "Assistant", audience: "Practice" },
  { id: "office-manager", title: "Office manager", audience: "Practice" },
  { id: "doctor", title: "Doctor", audience: "Practice" },
  { id: "biller", title: "Insurance biller", audience: "DPCP team" },
  { id: "equipment", title: "Equipment specialist", audience: "DPCP team" },
  { id: "supplies", title: "Supplies coordinator", audience: "DPCP team" },
];

export const MODULES_TRAIN: LessonModule[] = [
  { id: "fd-1", path: "front-desk", title: "Open the day", minutes: 4, sopId: "open-day", captions: "Lights, phones, huddle card. Sample captions.", pass: 2, questions: [{ q: "Where does the huddle card go?", choices: ["In a drawer", "On the counter", "In the group chat"], answer: 1 }, { q: "Patient names on the huddle card?", choices: ["Yes, first names", "No"], answer: 1 }, { q: "Who owns the card?", choices: ["Anyone passing", "The office manager", "The courier"], answer: 1 }] },
  { id: "fd-2", path: "front-desk", title: "Confirmation and the short-call list", minutes: 4, sopId: "confirm", captions: "Same-day confirmation. Sample captions.", pass: 2, questions: [{ q: "When do you confirm?", choices: ["Next week", "Same day", "Only if they call"], answer: 1 }, { q: "A cancellation is filled from?", choices: ["The short-call list", "A walk-in ad", "Nothing"], answer: 0 }, { q: "Do you type a member id here?", choices: ["Yes", "No. It stays in the PMS."], answer: 1 }] },
  { id: "hy-1", path: "hygienist", title: "Book at the chair", minutes: 5, sopId: "book-chair", captions: "Offer two times before the patient stands up.", pass: 2, unlocks: "Hygiene reappointment list", questions: [{ q: "Where is the next visit booked?", choices: ["At checkout only", "At the chair", "By text the next day"], answer: 1 }, { q: "How many times do you offer?", choices: ["One", "Two", "Whatever is open in six weeks"], answer: 1 }, { q: "This module certifies you to sign?", choices: ["The weekly sterilizer log", "The reappointment step", "A payroll change"], answer: 1 }] },
  { id: "as-1", path: "assistant", title: "Sterilization 101", minutes: 5, sopId: "sterile", captions: "Read the test. Sign only if you passed.", pass: 2, unlocks: "Weekly sterilizer check", questions: [{ q: "A failed test means?", choices: ["Keep going", "Stop and open an equipment ticket", "Wipe the machine"], answer: 1 }, { q: "Who signs the weekly check?", choices: ["Anyone", "Someone who passed this module", "The courier"], answer: 1 }, { q: "How long is this lesson?", choices: ["Under 5 minutes", "A full afternoon", "A week"], answer: 0 }] },
  { id: "om-1", path: "office-manager", title: "Monthly balance review", minutes: 5, sopId: "recare", captions: "One priority. A review date. Sample captions.", pass: 2, questions: [{ q: "How many priorities in a month?", choices: ["One", "All 25", "Whatever is red"], answer: 0 }, { q: "Who owns the data pull?", choices: ["The doctors", "The office manager", "The lab"], answer: 1 }, { q: "The review date default is?", choices: ["7 days", "30 days", "A year"], answer: 1 }] },
  { id: "dr-1", path: "doctor", title: "Case acceptance conversation", minutes: 5, sopId: "case", captions: "Finding, consequence, fee, next visit.", pass: 2, questions: [{ q: "Financing is offered?", choices: ["Never", "Above the practice threshold", "Only if they ask twice"], answer: 1 }, { q: "Who owns Part 2?", choices: ["The front desk", "The doctors", "Accounting"], answer: 1 }, { q: "Does this lesson send a message to a patient?", choices: ["Yes", "No. A person still talks to the patient."], answer: 1 }] },
  { id: "bi-1", path: "biller", title: "Claims within 48 hours", minutes: 4, sopId: "claim-48", captions: "Submit, then log the id.", pass: 2, questions: [{ q: "Claims go out within?", choices: ["24–48 hours", "30 days", "When the month closes"], answer: 0 }, { q: "Where do member ids live?", choices: ["In this app", "In the PMS"], answer: 1 }, { q: "An appeal over $1,000 needs?", choices: ["No one", "The lead", "The patient"], answer: 1 }] },
  { id: "eq-1", path: "equipment", title: "Warranty before a part", minutes: 3, sopId: "warranty", captions: "Check the date before you buy.", pass: 1, questions: [{ q: "First check?", choices: ["The catalog price", "The warranty date", "A new chair"], answer: 1 }, { q: "Who sets the tech visit?", choices: ["Theo March", "The patient", "Marketing"], answer: 0 }] },
  { id: "sp-1", path: "supplies", title: "Build the cart from par", minutes: 4, sopId: "par", captions: "Par, then the cart, then the office approves.", pass: 2, questions: [{ q: "A cart over the limit?", choices: ["Ships anyway", "Waits for the office", "Is deleted"], answer: 1 }, { q: "Who approves a new item?", choices: ["The AI", "A person", "The courier"], answer: 1 }, { q: "Savings are counted against?", choices: ["A guess", "The last price you paid", "A competitor ad"], answer: 1 }] },
];

export const HIRES = [
  { name: "Jamie Okonkwo", role: "Insurance biller", day: 6, modules: "2 of 4", checkins: "Day 7 is tomorrow", signed: false },
  { name: "Chris Dunn", role: "Front desk", day: 22, modules: "3 of 3", checkins: "Day 30 is next week", signed: true },
];

export const TIERS = [
  { id: "essentials", name: "Essentials", price: "Sample, not real pricing", includes: ["Insurance", "IT"] },
  { id: "growth", name: "Growth", price: "Sample, not real pricing", includes: ["Insurance", "Marketing", "Supplies"] },
  { id: "partner", name: "Full Partner", price: "Sample, not real pricing", includes: ["All 8 copilots"] },
];

export interface ClientAccount {
  practiceId: string;
  tier: string;
  services: string[];
  renewal: string;
  health: number;
  satisfaction: number;
  contact: string;
  onboard: { step: string; done: boolean }[];
  invoices: { id: string; month: string; amount: string; status: string }[];
  cross: string;
}

export const CLIENTS: ClientAccount[] = [
  {
    practiceId: "saguaro",
    tier: "Growth",
    services: ["Insurance", "Marketing", "Supplies"],
    renewal: "Mar 2027",
    health: 71,
    satisfaction: 4.2,
    contact: "Jordan Ellis, office manager",
    onboard: [
      { step: "Services chosen", done: true },
      { step: "PMS type connected (Eaglesoft)", done: true },
      { step: "Devices enrolled", done: true },
      { step: "Roster imported", done: true },
      { step: "Agreements: signed", done: true },
    ],
    invoices: [
      { id: "inv-s-9", month: "Sep 2026", amount: "Sample $4,800", status: "Paid" },
      { id: "inv-s-10", month: "Oct 2026", amount: "Sample $4,800", status: "Open" },
    ],
    cross: "Staffing is the natural next service. A hygienist req is already open.",
  },
  {
    practiceId: "lakeview",
    tier: "Essentials",
    services: ["Insurance", "Accounting", "IT"],
    renewal: "Jan 2027",
    health: 66,
    satisfaction: 3.4,
    contact: "Tess Ward, office manager",
    onboard: [
      { step: "Services chosen", done: true },
      { step: "PMS type connected (Curve)", done: true },
      { step: "Devices enrolled", done: false },
      { step: "Roster imported", done: true },
      { step: "Agreements: signed", done: true },
    ],
    invoices: [
      { id: "inv-l-9", month: "Sep 2026", amount: "Sample $3,200", status: "Failed" },
      { id: "inv-l-8", month: "Aug 2026", amount: "Sample $3,200", status: "Paid" },
    ],
    cross: "Marketing would match the new-patient goal. Sample suggestion.",
  },
  {
    practiceId: "redrock",
    tier: "Essentials",
    services: ["Staffing", "Equipment"],
    renewal: "Jun 2027",
    health: 82,
    satisfaction: 4.7,
    contact: "Glen Cho, office manager",
    onboard: [
      { step: "Services chosen", done: true },
      { step: "PMS type connected (Dentrix)", done: true },
      { step: "Devices enrolled", done: true },
      { step: "Roster imported", done: true },
      { step: "Agreements: signed", done: true },
    ],
    invoices: [{ id: "inv-r-9", month: "Sep 2026", amount: "Sample $2,400", status: "Paid" }],
    cross: "Insurance is the next fit once the Friday coverage is filled.",
  },
];

export const OWNED_SERVICES = ["Insurance", "Equipment", "Supplies", "Staffing", "IT", "Accounting", "Marketing", "Construction"];

export function servicesFor(practiceId: string) {
  const client = CLIENTS.find((item) => item.practiceId === practiceId);
  if (client) return client.services;
  const practice = PRACTICES.find((item) => item.id === practiceId);
  if (practice?.kind === "hdg") return OWNED_SERVICES;
  return [];
}

export interface AuditRow {
  id: string;
  at: string;
  who: string;
  where: string;
  action: string;
  flagged?: boolean;
}

export const AUDIT: AuditRow[] = [
  { id: "au-1", at: "Oct 20, 7:14 AM", who: "Rowan Blake", where: "IT", action: "Granted PMS link-out to Jamie Okonkwo." },
  { id: "au-2", at: "Oct 20, 8:02 AM", who: "George", where: "Admin", action: "Opened a message body on the insurance queue.", flagged: true },
  { id: "au-3", at: "Oct 19, 4:40 PM", who: "Elena Voss", where: "Accounting", action: "Approved a sample invoice draft. It stayed in Review." },
  { id: "au-4", at: "Oct 19, 11:12 AM", who: "Bot", where: "Insurance", action: "Drafted an appeal. Inputs were claim ids only." },
  { id: "au-5", at: "Oct 18, 9:20 AM", who: "Amina Farouk", where: "People", action: "Read a restricted HR ticket. Logged." },
];

export const BAAS = [
  { vendor: "Sample imaging vendor", status: "Signed", date: "2026-04-02" },
  { vendor: "Sample payroll tool", status: "In review", date: "2026-09-12" },
  { vendor: "PMS host (link-out only)", status: "Not required until data is copied", date: "—" },
];

export const DEVICES = [
  { id: "dev-copper-1", practiceId: "copper", name: "Front desk", lastSeen: "Oct 20, 10:40 AM", expires: "2027-01-20", pin: "4 digits, 5 minute lock" },
  { id: "dev-saguaro-1", practiceId: "saguaro", name: "Front desk", lastSeen: "Oct 20, 10:31 AM", expires: "2027-02-01", pin: "4 digits, 5 minute lock" },
  { id: "dev-lake-1", practiceId: "lakeview", name: "Consult room", lastSeen: "Oct 18, 3:12 PM", expires: "2026-11-01", pin: "6 digits, 5 minute lock" },
];

export const INTEGRATIONS = [
  { id: "workspace", name: "Google Workspace", health: "green", sync: "6:02 AM", owner: "Rowan Blake" },
  { id: "slack", name: "Slack", health: "green", sync: "6:03 AM", owner: "Rowan Blake" },
  { id: "td", name: "Time Doctor", health: "amber", sync: "6:04 AM", owner: "Rowan Blake" },
  { id: "n8n", name: "n8n", health: "green", sync: "5:40 AM", owner: "Rowan Blake", gate: true },
  { id: "grok", name: "Grok (primary)", health: "green", sync: "10:40 AM", owner: "George" },
  { id: "gemini", name: "Gemini (backup)", health: "green", sync: "10:40 AM", owner: "George" },
  { id: "pms", name: "PMS link-outs", health: "green", sync: "Link only", owner: "Omar Hale" },
  { id: "books", name: "QuickBooks and Stripe", health: "green", sync: "Yesterday", owner: "Elena Voss" },
];

export const FINDINGS = [
  { id: "sf-1", title: "Lakeview device expires in November", owner: "Rowan Blake", due: "Nov 1, 2026" },
  { id: "sf-2", title: "Two people have not acknowledged the privacy notice", owner: "Amina Farouk", due: "Oct 24, 2026" },
  { id: "sf-3", title: "Backup model has not been failed over this quarter", owner: "Rowan Blake", due: "Nov 15, 2026" },
];

export const PERMISSIONS = ["Today", "Review", "Tickets", "Knowledge", "Training", "Performance", "Workforce", "Clients", "Admin", "Balance Assessment", "Money"];
export const ACTIONS = ["view", "edit", "approve", "admin"] as const;
export const ROLE_PRESET: Record<string, Record<string, string[]>> = {
  employee: { Today: ["view", "edit"], Review: ["view", "edit"], Tickets: ["view", "edit"], Knowledge: ["view"], Training: ["view", "edit"], Performance: ["view"], Workforce: ["view"], Clients: [], Admin: [], "Balance Assessment": [], Money: [] },
  lead: { Today: ["view", "edit"], Review: ["view", "approve"], Tickets: ["view", "edit", "approve"], Knowledge: ["view", "edit"], Training: ["view", "approve"], Performance: ["view"], Workforce: ["view"], Clients: ["view"], Admin: ["view"], "Balance Assessment": ["view"], Money: [] },
  admin: { Today: ["view"], Review: ["view"], Tickets: ["view"], Knowledge: ["view", "admin"], Training: ["view"], Performance: ["view"], Workforce: ["view"], Clients: ["view", "edit"], Admin: ["view", "edit", "admin"], "Balance Assessment": ["view"], Money: [] },
  release: { Today: ["view"], Review: ["view"], Tickets: ["view"], Knowledge: ["view"], Training: ["view"], Performance: ["view"], Workforce: ["view"], Clients: ["view"], Admin: ["view", "approve"], "Balance Assessment": [], Money: [] },
  "practice owner": { Today: ["view"], Review: ["view", "approve"], Tickets: ["view"], Knowledge: ["view"], Training: ["view"], Performance: ["view"], Workforce: [], Clients: ["view"], Admin: [], "Balance Assessment": ["view", "edit"], Money: ["approve"] },
  "practice staff": { Today: ["view", "edit"], Review: [], Tickets: ["view", "edit"], Knowledge: ["view"], Training: ["view", "edit"], Performance: [], Workforce: [], Clients: [], Admin: [], "Balance Assessment": [], Money: [] },
};

export interface ValueEvent {
  id: string;
  practiceId: string;
  month: string;
  department: string;
  type: "recovered" | "saved" | "time";
  amount: number;
  unit: "$" | "hours" | "count";
  method: string;
  source: string;
  estimate?: boolean;
}

export const VALUE_EVENTS: ValueEvent[] = [
  { id: "v1", practiceId: "copper", month: "2026-09", department: "Insurance", type: "recovered", amount: 4200, unit: "$", method: "Appeals posted", source: "Appeal log" },
  { id: "v2", practiceId: "copper", month: "2026-09", department: "Supplies", type: "saved", amount: 460, unit: "$", method: "Verified against the prior distributor price", source: "October cart" },
  { id: "v3", practiceId: "copper", month: "2026-09", department: "Equipment", type: "saved", amount: 1250, unit: "$", method: "Warranty covered a part that would have been bought", source: "Op 7 warranty note" },
  { id: "v4", practiceId: "copper", month: "2026-09", department: "All", type: "time", amount: 42, unit: "hours", method: "Handled requests × sample minutes per ticket type", source: "Ticket types", estimate: true },
  { id: "v5", practiceId: "saguaro", month: "2026-09", department: "Insurance", type: "recovered", amount: 18400, unit: "$", method: "Appeals and posted claims", source: "Appeal log" },
  { id: "v6", practiceId: "saguaro", month: "2026-09", department: "Supplies", type: "saved", amount: 460, unit: "$", method: "Verified against the prior price", source: "October cart" },
  { id: "v7", practiceId: "saguaro", month: "2026-09", department: "All", type: "time", amount: 61, unit: "hours", method: "Handled requests × sample minutes per ticket type", source: "Ticket types", estimate: true },
  { id: "v8", practiceId: "lakeview", month: "2026-09", department: "Insurance", type: "recovered", amount: 2100, unit: "$", method: "Posted after follow-up", source: "AR board" },
  { id: "v9", practiceId: "lakeview", month: "2026-09", department: "All", type: "time", amount: 28, unit: "hours", method: "Handled requests × sample minutes", source: "Ticket types", estimate: true },
];

export const BASELINES = [
  { practiceId: "copper", joined: "Aug 2026", ar90: "14%", days: "44", supply: "7.1% of collections", patients: "14 / doctor" },
  { practiceId: "saguaro", joined: "Jan 2026", ar90: "18%", days: "41", supply: "6.4% of collections", patients: "28 / doctor" },
  { practiceId: "lakeview", joined: "Mar 2026", ar90: "11%", days: "33", supply: "5.8% of collections", patients: "30 / doctor" },
];

export const DEPT_CARDS: Record<string, { department: string; lines: string[]; outcome: string; goal: string; trend: "up" | "down" | "flat" }[]> = {
  copper: [
    { department: "Insurance", lines: ["186 verifications before the visit", "2 appeals"], outcome: "Days in AR 38 → 33", goal: "Under 30", trend: "up" },
    { department: "Supplies", lines: ["3 carts", "0 stockouts"], outcome: "$460 saved vs the prior price", goal: "No stockouts", trend: "up" },
    { department: "IT", lines: ["4 tickets resolved", "Backups 100%"], outcome: "Median fix 6 h", goal: "Under 8 h", trend: "flat" },
    { department: "Marketing", lines: ["18 new patients seen", "Tracking gap on cost"], outcome: "Listing hours corrected", goal: "20 new patients", trend: "up" },
    { department: "Staffing", lines: ["1 associate seat open"], outcome: "Pipeline has 2 conversations", goal: "Seat filled", trend: "flat" },
    { department: "Equipment", lines: ["2 repairs"], outcome: "Warranty covered $1,250", goal: "Visit set", trend: "flat" },
    { department: "Accounting", lines: ["P&L review delivered"], outcome: "Books closed by day 6", goal: "Day 6", trend: "up" },
    { department: "Construction", lines: ["4 work orders closed"], outcome: "Op 3 sink is done", goal: "None urgent", trend: "up" },
  ],
  saguaro: [
    { department: "Insurance", lines: ["412 verifications before the visit", "9 appeals"], outcome: "$18,400 recovered · days in AR 41 → 33", goal: "Under 30", trend: "up" },
    { department: "Supplies", lines: ["3 carts", "0 stockouts"], outcome: "$460 saved vs the prior price", goal: "No stockouts", trend: "up" },
    { department: "Marketing", lines: ["21 new patients seen from campaigns"], outcome: "$96 per new patient", goal: "Under $110", trend: "up" },
  ],
  lakeview: [
    { department: "Insurance", lines: ["220 verifications", "4 appeals"], outcome: "Days in AR 51", goal: "Under 30", trend: "down" },
    { department: "Accounting", lines: ["Close in progress"], outcome: "One deposit still open", goal: "Day 6", trend: "down" },
    { department: "IT", lines: ["Backup failed last night"], outcome: "Median fix 9 h", goal: "Under 8 h", trend: "down" },
  ],
};

export const WINS: Record<string, { text: string; by: string }[]> = {
  copper: [
    { text: "Warranty covered the Op 7 part, $1,250.", by: "Done by AI" },
    { text: "Hygiene reappointment moved from 78% to 82%.", by: "By your DPCP team" },
    { text: "Books closed on day 6.", by: "By your DPCP team" },
  ],
  saguaro: [
    { text: "Appeal won: $2,340 crown claim.", by: "By your DPCP team" },
    { text: "Hygiene reappointment hit 91%, a new high.", by: "By your team" },
    { text: "October cart saved $460 against the prior price.", by: "Done by AI" },
  ],
  lakeview: [
    { text: "Two claims moved out of the 60-day bucket.", by: "By your DPCP team" },
    { text: "The listing hours were corrected the same day.", by: "Done by AI" },
  ],
};

export const AI_ACTIVITY = [
  { id: "job-1", department: "Insurance", status: "Needs approval", time: "10:38 AM", input: "Claim 88-1042", output: "Appeal draft v2", risk: "outbound" },
  { id: "job-2", department: "Supplies", status: "Working", time: "10:36 AM", input: "Cart copper-oct", output: "Cart draft", risk: "money" },
  { id: "job-3", department: "Marketing", status: "Done", time: "9:12 AM", input: "Saguaro week 42", output: "Snapshot draft", risk: "outbound" },
  { id: "job-4", department: "IT", status: "Done", time: "6:05 AM", input: "Backup lakeview", output: "Failure ticket it-1", risk: "data" },
  { id: "job-5", department: "Equipment", status: "Needs approval", time: "10:20 AM", input: "Asset op-7", output: "Tech visit Thursday", risk: "commitment" },
];

export const APPROVALS = [
  { id: "ap-1", title: "Send the Saguaro appeal", risk: "outbound", department: "Insurance", why: "It leaves the company. Omar still signs because it is $2,860." },
  { id: "ap-2", title: "Approve the glove substitution", risk: "money", department: "Supplies", why: "The cart is over the office limit." },
  { id: "ap-3", title: "Hold Thursday for the Op 7 tech", risk: "commitment", department: "Equipment", why: "A visit is a promise to the office." },
  { id: "ap-4", title: "Raise par on large gloves", risk: "data", department: "Supplies", why: "It changes the catalog the office orders from." },
];
