/** One request object for the practice desk, the department queue, and the lifecycle. Sample SLAs. */

export type TicketDept =
  | "equipment"
  | "supplies"
  | "staffing"
  | "insurance"
  | "it"
  | "accounting"
  | "marketing"
  | "construction"
  | "hr"
  | "compliance"
  | "training"
  | "feedback"
  | "coaching"
  | "other";

export type TicketStatus = "new" | "triaged" | "progress" | "waiting" | "resolved" | "closed";
export type TicketPriority = "urgent" | "normal" | "low";

export interface TicketEvent {
  at: string;
  text: string;
  by: "practice" | "ai" | "human";
  internal?: boolean;
}

export interface Ticket {
  id: string;
  number: string;
  practiceId: string;
  requester: string;
  device: string;
  department: TicketDept;
  type: string;
  priority: TicketPriority;
  status: TicketStatus;
  owner: string;
  title: string;
  body: string;
  phi: boolean;
  aiFirst: boolean;
  aiDid: string;
  humanNeeded: string;
  openedAt: string;
  firstResponseAt: string | null;
  resolvedAt: string | null;
  slaPaused: boolean;
  escalation: 0 | 1 | 2 | 3;
  rating?: number;
  ratingNote?: string;
  duplicateOf?: string;
  tier: "Essentials" | "Growth" | "Full Partner";
  events: TicketEvent[];
  replies: { at: string; by: string; text: string; visibility: "practice" | "internal" }[];
  photo?: string;
}

export interface TicketType {
  department: TicketDept;
  type: string;
  standardMinutes: number;
  aiFirst: boolean;
}

export const DEPT_META: Record<TicketDept, { label: string; owner: string; lead: string; restricted?: boolean }> = {
  equipment: { label: "Equipment", owner: "Theo March", lead: "Theo March" },
  supplies: { label: "Supplies", owner: "Jonas Keller", lead: "Jonas Keller" },
  staffing: { label: "Staffing", owner: "Amina Farouk", lead: "Amina Farouk" },
  insurance: { label: "Insurance", owner: "Nadia Reyes", lead: "Omar Hale" },
  it: { label: "IT", owner: "Rowan Blake", lead: "Rowan Blake" },
  accounting: { label: "Accounting", owner: "Elena Voss", lead: "Elena Voss" },
  marketing: { label: "Marketing", owner: "Priya Shah", lead: "Priya Shah" },
  construction: { label: "Construction", owner: "Rowan Blake", lead: "Rowan Blake" },
  hr: { label: "HR / People", owner: "Amina Farouk", lead: "Amina Farouk", restricted: true },
  compliance: { label: "Compliance and safety", owner: "Leila Okonkwo", lead: "Leila Okonkwo" },
  training: { label: "Training", owner: "Amina Farouk", lead: "Amina Farouk" },
  feedback: { label: "DPCP OS feedback", owner: "Rowan Blake", lead: "George" },
  coaching: { label: "Coaching", owner: "Leila Okonkwo", lead: "Leila Okonkwo" },
  other: { label: "Other", owner: "Rowan Blake", lead: "George" },
};

export const TICKET_TYPES: TicketType[] = [
  { department: "equipment", type: "Repair", standardMinutes: 45, aiFirst: true },
  { department: "equipment", type: "Install", standardMinutes: 60, aiFirst: true },
  { department: "equipment", type: "Warranty", standardMinutes: 20, aiFirst: true },
  { department: "supplies", type: "Stockout", standardMinutes: 25, aiFirst: true },
  { department: "supplies", type: "Cart approval", standardMinutes: 15, aiFirst: true },
  { department: "supplies", type: "New item", standardMinutes: 30, aiFirst: false },
  { department: "staffing", type: "Requisition", standardMinutes: 40, aiFirst: true },
  { department: "staffing", type: "Coverage", standardMinutes: 20, aiFirst: true },
  { department: "insurance", type: "Verification question", standardMinutes: 15, aiFirst: true },
  { department: "insurance", type: "Claim question", standardMinutes: 30, aiFirst: true },
  { department: "insurance", type: "Appeal", standardMinutes: 45, aiFirst: true },
  { department: "it", type: "Access", standardMinutes: 20, aiFirst: true },
  { department: "it", type: "Device", standardMinutes: 25, aiFirst: true },
  { department: "it", type: "Backup", standardMinutes: 30, aiFirst: true },
  { department: "accounting", type: "Books question", standardMinutes: 30, aiFirst: true },
  { department: "accounting", type: "Invoice", standardMinutes: 25, aiFirst: true },
  { department: "marketing", type: "Campaign", standardMinutes: 35, aiFirst: true },
  { department: "marketing", type: "Listing", standardMinutes: 20, aiFirst: true },
  { department: "construction", type: "Work order", standardMinutes: 40, aiFirst: true },
  { department: "construction", type: "Build gate", standardMinutes: 30, aiFirst: false },
  { department: "hr", type: "Sensitive matter", standardMinutes: 30, aiFirst: false },
  { department: "compliance", type: "Safety question", standardMinutes: 25, aiFirst: true },
  { department: "training", type: "Module request", standardMinutes: 20, aiFirst: true },
  { department: "feedback", type: "Bug", standardMinutes: 20, aiFirst: true },
  { department: "feedback", type: "Idea", standardMinutes: 15, aiFirst: true },
  { department: "coaching", type: "Case acceptance", standardMinutes: 40, aiFirst: true },
  { department: "other", type: "Not sure", standardMinutes: 20, aiFirst: true },
];

export const CANNED: Record<string, string[]> = {
  equipment: ["A tech window is held for you.", "The warranty covers this. No part order yet.", "We need one photo of the screen, not of a person."],
  supplies: ["The cart is ready for your approval.", "A substitute is in the draft. You decide.", "Par was raised so this does not repeat next week."],
  insurance: ["We are on the claim. No member id is stored here.", "The appeal draft is in Review.", "This one is waiting on a document from the office."],
  it: ["Access is granted for the role, nothing extra.", "The device is revoked.", "Last night's backup succeeded."],
  default: ["We have it.", "A person will take the next step.", "Tell us if this can wait until tomorrow."],
};

/** Sample SLA minutes. Labeled sample until Monday's real targets. */
export function slaFor(department: TicketDept, priority: TicketPriority, tier: Ticket["tier"]) {
  const first = priority === "urgent" ? 15 : priority === "normal" ? 120 : 480;
  const resolve = priority === "urgent" ? 8 * 60 : priority === "normal" ? 24 * 60 : 72 * 60;
  const tierBoost = tier === "Full Partner" ? 0.75 : tier === "Growth" ? 1 : 1.25;
  return {
    label: "Sample SLA",
    firstMin: Math.round(first * tierBoost),
    resolveMin: Math.round(resolve * tierBoost),
    ladder: ["Owner", "Department lead", "Team leader", "George"] as const,
    triggers: ["First response missed", "Resolve time missed", "Second miss", "Still open the next morning"],
  };
}

const NOW = Date.parse("2026-10-20T17:42:00Z");

export function minutesAgo(iso: string) {
  return Math.round((NOW - Date.parse(iso)) / 60000);
}

export function slaState(ticket: Ticket) {
  const policy = slaFor(ticket.department, ticket.priority, ticket.tier);
  const age = minutesAgo(ticket.openedAt);
  const paused = ticket.slaPaused || ticket.status === "waiting";
  const responded = ticket.firstResponseAt != null;
  const firstLeft = policy.firstMin - (responded ? 0 : age);
  const resolveAge = ticket.resolvedAt ? minutesAgo(ticket.openedAt) - minutesAgo(ticket.resolvedAt) : age;
  const resolveLeft = policy.resolveMin - resolveAge;
  const firstBreach = !responded && !paused && age > policy.firstMin;
  const resolveBreach = !paused && ticket.status !== "resolved" && ticket.status !== "closed" && age > policy.resolveMin;
  return { policy, age, paused, firstLeft, resolveLeft, firstBreach, resolveBreach, breach: firstBreach || resolveBreach };
}

function iso(hoursAgo: number) {
  return new Date(NOW - hoursAgo * 3600 * 1000).toISOString();
}

type Seed = [string, string, TicketDept, string, TicketPriority, TicketStatus, string, string, number, number?];

const SEEDS: Seed[] = [
  ["eq-1", "copper", "equipment", "Repair", "urgent", "progress", "Op 7 chair will not recline", "Casey Nguyen", 3],
  ["eq-2", "copper", "equipment", "Repair", "urgent", "new", "Op 7 chair still stuck", "Luis Ortega", 0.3],
  ["eq-3", "saguaro", "equipment", "Warranty", "normal", "resolved", "Autoclave gasket looks flat", "Pete Nunez", 140],
  ["eq-4", "mesa", "equipment", "Install", "normal", "waiting", "Delivery dock needs a morning window", "Nina Patel", 30],
  ["eq-5", "redrock", "equipment", "Repair", "urgent", "progress", "Compressor is short-cycling", "Noor Haddad", 6],
  ["eq-6", "ponderosa", "equipment", "Warranty", "low", "closed", "Curing light under warranty", "Ruth Calder", 400],
  ["su-1", "copper", "supplies", "Cart approval", "normal", "waiting", "Glove cart is over the office limit", "Robin Hale", 20],
  ["su-2", "saguaro", "supplies", "Stockout", "urgent", "progress", "Large gloves are out in op 2", "Maria Alvarez", 5],
  ["su-3", "copper", "supplies", "New item", "low", "triaged", "Ask on a different bonding agent", "Mia Santos", 50],
  ["su-4", "lakeview", "supplies", "Stockout", "normal", "new", "Patient bibs below par", "Kyle Brennan", 2],
  ["st-1", "copper", "staffing", "Requisition", "normal", "progress", "Associate doctor seat is still open", "Robin Hale", 80],
  ["st-2", "saguaro", "staffing", "Requisition", "normal", "triaged", "Hygienist two days a week", "Jordan Ellis", 26],
  ["st-3", "redrock", "staffing", "Coverage", "urgent", "progress", "Friday hygiene has no coverage", "Glen Cho", 8],
  ["st-4", "mesa", "staffing", "Coverage", "low", "resolved", "Front desk swap for Thursday", "Sam Ibarra", 200],
  ["in-1", "saguaro", "insurance", "Appeal", "urgent", "progress", "Crown denial for J.R. Claim 88-1042", "Maria Alvarez", 4],
  ["in-2", "copper", "insurance", "Verification question", "normal", "resolved", "Morning verifications for Thursday", "Casey Nguyen", 60],
  ["in-3", "lakeview", "insurance", "Claim question", "urgent", "progress", "Three claims stuck for A.P.", "Tess Ward", 30, 2],
  ["in-4", "saguaro", "insurance", "Claim question", "normal", "waiting", "Need the narrative from the office for M.K.", "Chris Dunn", 18],
  ["in-5", "ponderosa", "insurance", "Verification question", "low", "closed", "New group number confirmed", "Bea Solomon", 300],
  ["in-6", "copper", "insurance", "Appeal", "normal", "triaged", "Frequency question on a bridge for L.S.", "Luis Ortega", 10],
  ["it-1", "lakeview", "it", "Backup", "urgent", "progress", "Last night's backup failed", "Tess Ward", 12],
  ["it-2", "copper", "it", "Device", "normal", "new", "Front desk iPad needs a new PIN rule", "Robin Hale", 1],
  ["it-3", "saguaro", "it", "Access", "normal", "resolved", "New hire needs the PMS link-out", "Jordan Ellis", 90],
  ["it-4", "redrock", "it", "Device", "low", "waiting", "Shared computer certificate expired", "Glen Cho", 40],
  ["ac-1", "lakeview", "accounting", "Books question", "normal", "progress", "September close is waiting on one deposit", "Tess Ward", 48],
  ["ac-2", "saguaro", "accounting", "Invoice", "low", "triaged", "Question on the sample October invoice", "Jordan Ellis", 15],
  ["ac-3", "copper", "accounting", "Books question", "normal", "resolved", "Day-6 close packet received", "Robin Hale", 220],
  ["mk-1", "saguaro", "marketing", "Campaign", "normal", "progress", "Implant campaign needs a budget yes", "Jordan Ellis", 22],
  ["mk-2", "copper", "marketing", "Listing", "urgent", "new", "Hours on the listing are last season's", "Casey Nguyen", 3],
  ["mk-3", "copper", "marketing", "Campaign", "normal", "progress", "Reactivation list for patients with no hygiene visit", "Robin Hale", 16],
  ["mk-4", "mesa", "marketing", "Listing", "low", "closed", "New address is live", "Sam Ibarra", 500],
  ["co-1", "mesa", "construction", "Build gate", "normal", "waiting", "Layout signature is holding the next trade", "Sam Ibarra", 70, 2],
  ["co-2", "copper", "construction", "Work order", "normal", "resolved", "Op 3 sink drip", "Andre Cole", 100],
  ["co-3", "ponderosa", "construction", "Work order", "low", "new", "Lobby light buzzes", "Ruth Calder", 6],
  ["co-4", "lakeview", "construction", "Work order", "normal", "progress", "Operatory door closer", "Kyle Brennan", 28],
  ["hr-1", "copper", "hr", "Sensitive matter", "normal", "progress", "A private note for People. Body stays in this queue.", "Robin Hale", 9],
  ["cp-1", "saguaro", "compliance", "Safety question", "normal", "triaged", "Where do we log the sterilizer spore test?", "Pete Nunez", 7],
  ["cp-2", "copper", "compliance", "Safety question", "urgent", "new", "Eyewash check is overdue", "Mia Santos", 2],
  ["tr-1", "copper", "training", "Module request", "normal", "progress", "Book at the chair for hygiene", "Robin Hale", 14],
  ["tr-2", "saguaro", "training", "Module request", "low", "resolved", "Sterilization 101 retake", "Pete Nunez", 180],
  ["fb-1", "lakeview", "feedback", "Bug", "normal", "new", "The desk forgot me before five minutes", "Kyle Brennan", 4],
  ["fb-2", "copper", "feedback", "Idea", "low", "triaged", "A bigger check on the open-the-day list", "Casey Nguyen", 36],
  ["ch-1", "saguaro", "coaching", "Case acceptance", "normal", "progress", "Presented dollars per exam are under the band", "Jordan Ellis", 20],
  ["ot-1", "redrock", "other", "Not sure", "normal", "triaged", "The lab courier did not come", "Noor Haddad", 5],
  ["ot-2", "mesa", "other", "Not sure", "low", "new", "We need a person and we are not sure who", "Nina Patel", 1],
];

function statusEvents(row: Seed): TicketEvent[] {
  const opened = iso(row[8]);
  const events: TicketEvent[] = [{ at: opened, text: "Submitted from the practice.", by: "practice" }];
  if (row[5] !== "new") events.push({ at: iso(row[8] - 0.2), text: "AI picked the department.", by: "ai" });
  if (row[5] === "progress" || row[5] === "waiting" || row[5] === "resolved" || row[5] === "closed") {
    events.push({ at: iso(Math.max(row[8] - 0.5, 0.1)), text: "A specialist has it.", by: "human" });
  }
  if (row[5] === "waiting") events.push({ at: iso(Math.max(row[8] - 1, 0.1)), text: "Waiting on the practice. The SLA clock is paused.", by: "human" });
  if (row[5] === "resolved" || row[5] === "closed") events.push({ at: iso(1), text: "Resolved.", by: "human" });
  if (row[5] === "closed") events.push({ at: iso(0.5), text: "The office rated it.", by: "practice" });
  return events;
}

export function seedTickets(): Ticket[] {
  return SEEDS.map((row, index) => {
    const department = row[2];
    const meta = DEPT_META[department];
    const type = TICKET_TYPES.find((item) => item.department === department && item.type === row[3]);
    const tier: Ticket["tier"] = row[1] === "saguaro" ? "Growth" : row[1] === "lakeview" || row[1] === "redrock" ? "Essentials" : "Full Partner";
    const status = row[5];
    const breachOnPurpose = row[0] === "in-3" || row[0] === "it-1" || row[0] === "ac-1" || row[0] === "co-1";
    const hours = breachOnPurpose || status === "resolved" || status === "closed" ? row[8] : status === "new" ? 0.05 : 1;
    const openedAt = iso(hours);
    const responded = status !== "new";
    return {
      id: row[0],
      number: `DP-${2400 + index}`,
      practiceId: row[1],
      requester: row[7],
      device: "Front desk",
      department,
      type: row[3],
      priority: row[4],
      status,
      owner: meta.owner,
      title: row[6],
      body: row[6],
      phi: department === "insurance",
      aiFirst: type?.aiFirst ?? true,
      aiDid: type?.aiFirst === false ? "This one needs a person from the start." : "AI sorted the department and drafted the next step.",
      humanNeeded: type?.aiFirst === false ? "A person owns this from the start." : "A person still approves anything that leaves the company.",
      openedAt,
      firstResponseAt: responded && !breachOnPurpose ? iso(Math.max(hours - 0.2, 0.02)) : null,
      resolvedAt: status === "resolved" || status === "closed" ? iso(1) : null,
      slaPaused: status === "waiting",
      escalation: (row[9] ?? 0) as 0 | 1 | 2 | 3,
      rating: status === "closed" ? 4 : undefined,
      duplicateOf: row[0] === "eq-2" ? "eq-1" : undefined,
      tier,
      events: statusEvents(row),
      replies: status === "waiting" ? [{ at: iso(1), by: meta.owner, text: "We need one more detail from the office.", visibility: "practice" }] : [],
    };
  });
}

export const QUEUE_COLUMNS: { id: TicketStatus; label: string }[] = [
  { id: "new", label: "New" },
  { id: "triaged", label: "Triaged" },
  { id: "progress", label: "In progress" },
  { id: "waiting", label: "Waiting on practice" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
];

export function lifecycle(ticket: Ticket) {
  const steps = ["Submitted", "Triaged", "AI working", "With a specialist", "Waiting on practice", "Done", "Rated"];
  const index =
    ticket.status === "closed" ? 6 : ticket.status === "resolved" ? 5 : ticket.status === "waiting" ? 4 : ticket.status === "progress" ? 3 : ticket.status === "triaged" ? 1 : 0;
  return { steps, index };
}
