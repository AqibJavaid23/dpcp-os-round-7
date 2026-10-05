/** Round 4 sample data. Fictional practices and people only. */

export type CommitmentStatus = "Not started" | "In progress" | "Done" | "Dropped";

export interface Commitment {
  id: string;
  title: string;
  series: string;
  occurrence: number;
  owner: string;
  ownerId: string;
  department: string;
  originalDue: string;
  currentDue: string;
  status: CommitmentStatus;
  proof?: string;
  dropReason?: string;
  carried: number;
  overdue: boolean;
}

export const SERIES_NAME = "New Location Team (Wed/Fri)";

const PEOPLE_CYCLE = [
  { id: "leila", name: "Leila Okonkwo", department: "Operations" },
  { id: "theo", name: "Theo March", department: "Equipment" },
  { id: "jonas", name: "Jonas Keller", department: "Supplies" },
  { id: "amina", name: "Amina Farouk", department: "Staffing" },
  { id: "nadia", name: "Nadia Reyes", department: "Insurance" },
  { id: "priya", name: "Priya Shah", department: "Marketing" },
  { id: "rowan", name: "Rowan Blake", department: "IT" },
  { id: "elena", name: "Elena Voss", department: "Accounting" },
  { id: "omar", name: "Omar Hale", department: "Insurance" },
  { id: "imran", name: "Imran Cole", department: "Insurance" },
];

const COMMITMENT_TITLES = [
  "File the Mesa Verde entity packet",
  "Confirm the compressor ship window",
  "Book the cabinet kit for five offices",
  "Post the hygienist outreach step 1",
  "Match the payer portal for Lakeview",
  "Draft the Mesa Verde launch page",
  "Stage the practice domain on the company workspace",
  "Tie the early-pay discount to the kit invoice",
  "Send the layout sign-off to the New Location lead",
  "Log the spare parts list",
  "Confirm two care teams are hired",
  "Check the LOI entity name against the card",
  "Update the credentialing phone on the identity card",
  "Move the shipment tracker off the order sheet",
  "Record proof for the Wednesday action items",
  "Close the soft-opening checklist items that are done",
  "Note the FDA status on the import lane",
  "Share the weekly status with George",
  "Attach the lease exhibit",
  "Mark the IT build step that is live",
  "Chase the hood delivery date",
  "Rewrite the quote line that disagrees with the sheet",
  "Ask the lead before tagging George",
  "Confirm the bank asked for the insurance binder",
  "Hold the text until consent is on file",
  "Rebook the missed stand-up",
  "Update the as-built set",
  "Count the operatory kit lines",
  "Flag the hazmat line that has no MSDS",
  "Check the corridor width on the drawing",
  "Call the office about the lapsed exclusivity",
  "Reconcile the paid claims that have no follow-up",
  "Book the design review",
  "Name an owner for the open question",
  "Finish the make-up for Monday",
  "Collect proof on the carried item",
  "Move the facilities note to the New Location channel",
  "Drop the duplicate flooring barter",
  "Drop the personal-account automation",
  "Drop the closed workspace job",
];

function commitmentStatus(index: number): Pick<Commitment, "status" | "proof" | "dropReason" | "carried" | "overdue"> {
  if (index <= 19) {
    return { status: "Done", proof: `Slack · #new-location · note ${index + 1}`, carried: 0, overdue: false };
  }
  if (index <= 24) {
    return { status: "In progress", carried: index % 2 === 0 ? 2 : 3, overdue: false };
  }
  if (index <= 31) {
    return { status: "In progress", proof: `Email · mesa-verde-thread-${index}`, carried: index === 26 || index === 28 ? 2 : 0, overdue: true };
  }
  if (index <= 36) {
    return { status: index <= 34 ? "In progress" : "Not started", carried: index >= 35 ? 3 : 0, overdue: true };
  }
  const reasons = [
    "Superseded by the decision to keep two sheets.",
    "The personal-account job was cancelled.",
    "The flooring barter was rejected after it was aligned.",
  ];
  return { status: "Dropped", dropReason: reasons[index - 37], carried: 0, overdue: false };
}

export const COMMITMENTS: Commitment[] = COMMITMENT_TITLES.map((title, index) => {
  const person = PEOPLE_CYCLE[index % PEOPLE_CYCLE.length];
  const flags = commitmentStatus(index);
  return {
    id: `c-${index + 1}`,
    title,
    series: SERIES_NAME,
    occurrence: (index % 6) + 1,
    owner: person.name,
    ownerId: person.id,
    department: person.department,
    originalDue: "Oct 8",
    currentDue: flags.overdue ? "Oct 16" : "Oct 22",
    ...flags,
  };
});

export const OVERDUE_COUNT = COMMITMENTS.filter((row) => row.overdue).length;
export const OVERDUE_NO_PROOF = COMMITMENTS.filter((row) => row.overdue && !row.proof && row.status !== "Dropped").length;

export const REVIEW_EXAMPLES = [
  {
    id: "rv-mesa",
    title: "Mesa Verde opening program: weekly status for George",
    forWhom: "George",
    why: "The New Location lead asked for a status before Friday's sync. Lanes, gates, and the critical path are filled in.",
    body: "Mesa Verde is in build. Doctor signed is green. FDA import clearance is amber. Layout sign-off is green. The critical path runs through the compressor ship window.",
  },
  {
    id: "rv-follow",
    title: "New Location Team follow-through: 12 items overdue, 5 with no proof",
    forWhom: "George",
    why: "The Wednesday/Friday series carried items that are still open. Done needs a link, or a lead's explanation.",
    body: "Forty items across six occurrences. About half are done with a Slack or file link. Twelve are overdue. Five of those have no proof.",
  },
  {
    id: "rv-loi",
    title: "LOI for Ponderosa blocked: entity name mismatch",
    forWhom: "Leila Okonkwo",
    why: "The filing was compared to the practice identity card before anyone could approve it.",
    body: "Entity name on this LOI doesn't match the registered name. The card says Ponderosa Dental LLC. The letter says Ponderosa Family Dental.",
  },
  {
    id: "rv-quote",
    title: "Quote vs order sheet: 7 discrepancies on the operatory kit",
    forWhom: "Jonas Keller",
    why: "Payment stays in Review until a person clears the lines that don't match.",
    body: "Qty 30 on the quote vs 50 on the sheet, plus six more lines. Theo March owns the equipment lines. Jonas Keller owns the supplies lines.",
  },
  {
    id: "rv-code",
    title: "Plan check: drawing uses 2017 code, jurisdiction is on 2023",
    forWhom: "Construction",
    why: "The AI pre-filled the check. A person still signs off.",
    body: "Corridor, doors, and operatory width are filled. The code edition fails. Sample, not real pricing, if this becomes a design-service request.",
  },
  {
    id: "rv-study",
    title: "Two-clinic client time study results",
    forWhom: "Office manager",
    why: "Counts only. No screenshots and no wage dollars. Ready to attach to a Balance resolution plan.",
    body: "Posting took more of the week than follow-up. The suggestion is three front desk for a 12-operatory clinic. Suggested by AI.",
  },
  {
    id: "rv-balance",
    title: "Monthly Balance Assessment PDF for Saguaro",
    forWhom: "Dr. Mara Ellison",
    why: "The September packet is in Review before it goes to the practice.",
    body: "Value, the one priority, and the resolution plan. The PDF stays here until someone approves it.",
  },
  {
    id: "rv-sheets",
    title: "Decision: keep ordering and shipment tracking on separate sheets",
    forWhom: "Supplies",
    why: "Logged so the next meeting does not reopen it.",
    body: "Ordering stays on one sheet. Shipment tracking stays on another. This supersedes the idea of a single combined sheet.",
  },
];

export const APPOINTMENTS = [
  { id: "ap-1", time: "9:00 AM", title: "Insurance stand-up", type: "Stand-up", color: "#123B78", join: "/meetings/standup" },
  { id: "ap-2", time: "10:30 AM", title: "Mesa Verde opening sync", type: "Team", color: "#0081CE", join: "/launch" },
  { id: "ap-3", time: "1:30 PM", title: "Canyon View visit moved", type: "Client", color: "#0B254B", join: "/calendar" },
  { id: "ap-4", time: "3:00 PM", title: "New Location Team", type: "Internal", color: "#157a45", join: "/meetings" },
];

export const WEEK_DAYS = ["Mon 19", "Tue 20", "Wed 21", "Thu 22", "Fri 23"];

export const NOTES_QUALITY: Record<string, { label: string; tone: "green" | "amber" | "neutral" }> = {
  standup: { label: "Gemini notes found", tone: "green" },
  "daily-insurance-morning": { label: "Summary only, no transcript", tone: "amber" },
  "daily-insurance-evening": { label: "Host hasn't shared notes", tone: "amber" },
  "team-insurance": { label: "No notes recorded", tone: "neutral" },
};

export const DECISION_LOG = [
  {
    id: "log-sheets",
    title: "Keep ordering and shipment tracking on separate sheets",
    rule: "Do not merge the order sheet and the shipment sheet.",
    department: "Supplies",
    source: "New Location Team · Wed",
    who: "Jonas Keller",
    date: "Oct 15",
    supersedes: "",
    supersededBy: "",
  },
  {
    id: "log-barter",
    title: "Flooring labor barter",
    rule: "Labor could be traded against the flooring package.",
    department: "Construction",
    source: "New Location Team · Fri",
    who: "Leila Okonkwo",
    date: "Oct 10",
    supersedes: "",
    supersededBy: "Barter rejected",
  },
  {
    id: "log-barter-no",
    title: "Barter rejected",
    rule: "Flooring labor is paid, not traded.",
    department: "Construction",
    source: "New Location Team · Wed",
    who: "George",
    date: "Oct 17",
    supersedes: "Flooring labor barter",
    supersededBy: "",
  },
];

export const OPEN_QUESTIONS = [
  { id: "q-hood", title: "When does the Mesa Verde hood ship?", owner: "Theo March", parked: "", age: "6 days" },
  { id: "q-phone", title: "Which state is the Ponderosa main phone registered in?", owner: "Elena Voss", parked: "Entity lane", age: "3 days" },
  { id: "q-text", title: "Can recruiting text before a reply?", owner: "Amina Farouk", parked: "", age: "1 day" },
];

export const DEADLINES = [
  { id: "dl-kit", date: "Oct 24", stake: "$ discount", detail: "Mesa Verde kit 15% early-pay discount", owner: "Jonas Keller", days: 4, practice: "Mesa Verde" },
  { id: "dl-freight", date: "Oct 21", stake: "$ fee per day", detail: "Compressor dead-freight if it misses the window", owner: "Theo March", days: 1, practice: "Mesa Verde" },
  { id: "dl-book", date: "Oct 18", stake: "exclusivity lost", detail: "Shipment booking past Oct 18", owner: "Jonas Keller", days: 0, practice: "Mesa Verde" },
  { id: "dl-claims", date: "Oct 22", stake: "claim becomes unrecoverable", detail: "Two-clinic client, 8–10 claims past timely filing", owner: "Nadia Reyes", days: 2, practice: "Lakeview" },
  { id: "dl-loi", date: "Oct 19", stake: "exclusivity lost", detail: "Ponderosa LOI exclusivity lapsed", owner: "Leila Okonkwo", days: 0, practice: "Ponderosa" },
];

export const LAUNCH_LANES = [
  "Entity & registrations",
  "Lease & site",
  "Design & permits",
  "Construction",
  "Equipment & import",
  "Supplies",
  "IT build",
  "Credentialing & fee schedules",
  "Staffing",
  "Marketing launch",
  "Soft opening (2 weeks)",
  "Go-live",
] as const;

export const LANE_LINKS: Record<string, string> = {
  Construction: "/copilot/construction",
  "Equipment & import": "/copilot/equipment",
  Supplies: "/copilot/supplies",
  "Credentialing & fee schedules": "/copilot/insurance",
  Staffing: "/copilot/staffing",
  "IT build": "/copilot/it",
  "Marketing launch": "/copilot/marketing",
  "Entity & registrations": "/launch",
};

export const DEPENDENCIES = [
  { id: "dep-loan", later: "Bank loan closing", earlier: "business insurance bound" },
  { id: "dep-web", later: "Website live", earlier: "lease signed" },
  { id: "dep-cred", later: "Credentialing submitted", earlier: "NPI + practice phone and email" },
  { id: "dep-soft", later: "Soft opening", earlier: "2 care teams hired" },
];

export interface LaunchProgram {
  id: string;
  location: string;
  book: string;
  phase: string;
  target: string;
  countdown: string;
  gates: { label: string; tone: "green" | "amber" | "red" }[];
  lanes: { name: string; owner: string; pct: number; next: string; blocker: string }[];
}

const LANE_OWNERS = ["Leila Okonkwo", "Elena Voss", "Theo March", "Jonas Keller", "Rowan Blake", "Nadia Reyes", "Amina Farouk", "Priya Shah"];

function lanesFor(seed: number): LaunchProgram["lanes"] {
  return LAUNCH_LANES.map((name, index) => ({
    name,
    owner: LANE_OWNERS[(index + seed) % LANE_OWNERS.length],
    pct: Math.max(8, 90 - index * 6 - seed * 4),
    next: index === 0 ? "Match the legal name on the card" : `Next step on ${name.toLowerCase()}`,
    blocker: index === 4 ? "Compressor ship window" : index === 2 ? "Code edition" : "None",
  }));
}

export const PROGRAMS: LaunchProgram[] = [
  {
    id: "mesa",
    location: "Mesa Verde",
    book: "HDG",
    phase: "In build",
    target: "Jan 12, 2027",
    countdown: "84 days",
    gates: [
      { label: "Doctor signed", tone: "green" },
      { label: "FDA/import clearance", tone: "amber" },
      { label: "Layout sign-off", tone: "green" },
    ],
    lanes: lanesFor(0),
  },
  {
    id: "ponderosa",
    location: "Ponderosa",
    book: "HDG",
    phase: "LOI",
    target: "Apr 6, 2027",
    countdown: "168 days",
    gates: [
      { label: "Doctor signed", tone: "amber" },
      { label: "FDA/import clearance", tone: "red" },
      { label: "Layout sign-off", tone: "amber" },
    ],
    lanes: lanesFor(2),
  },
  {
    id: "redrock",
    location: "Red Rock",
    book: "Client",
    phase: "Client buildout",
    target: "Mar 2, 2027",
    countdown: "133 days",
    gates: [
      { label: "Doctor signed", tone: "green" },
      { label: "FDA/import clearance", tone: "green" },
      { label: "Layout sign-off", tone: "amber" },
    ],
    lanes: lanesFor(1),
  },
];

export const LAUNCH_STEPS = [
  "Entity formed",
  "EIN and NPI status checked",
  "Lease signed",
  "Insurance bound",
  "Bank loan closing",
  "Design and permits",
  "Construction start",
  "Equipment ordered",
  "Import clearance",
  "Supplies kit",
  "IT build",
  "Credentialing submitted",
  "Fee schedules",
  "Staffing two care teams",
  "Marketing site live",
  "Soft opening",
  "Go-live",
];

export const IDENTITY = {
  practice: "Ponderosa",
  legalName: "Ponderosa Dental LLC",
  dba: "Ponderosa Dental",
  entityType: "LLC",
  registered: "Phoenix, AZ",
  physical: "1840 Desert Rim Rd, Mesa",
  mailing: "PO Box 440, Mesa",
  ein: "On file · ends 42",
  npi1: "Pending",
  npi2: "On file · ends 18",
  phone: "Main phone · registered AZ",
  domain: "ponderosa.example",
  email: "front@ponderosa.example",
  texting: "Rejected · name mismatch",
  mismatch: "Entity name on this LOI doesn't match the registered name.",
  usages: [
    { where: "LOI", ok: false, note: "Letter says Ponderosa Family Dental" },
    { where: "Texting registration", ok: false, note: "Name on the filing does not match the card" },
    { where: "Main phone", ok: false, note: "Phone record state does not match the physical address state" },
    { where: "NPI-2 application", ok: true, note: "Matches the card" },
  ],
};

export const OUTREACH_STEPS = [
  { n: 1, label: "Message asking for a good time to call", kind: "message" },
  { n: 2, label: "Call in the 4–5 PM local window", kind: "call" },
  { n: 3, label: "Voicemail", kind: "call" },
  { n: 4, label: "Text only after consent", kind: "text" },
];

export const CONSENT_ROWS = [
  { id: "p-1", name: "Profile A · hygienist", state: "Consent to text ✓" },
  { id: "p-2", name: "Profile B · associate", state: "Messaged" },
  { id: "p-3", name: "Profile C · assistant", state: "Not contacted" },
  { id: "p-4", name: "Profile D · office lead", state: "Opted out" },
];

export const TEMPLATES = [
  { id: "v2", name: "Recruiting v2", approver: "Amina Farouk", sends: 40, replies: 9, calls: 4, rate: "22%" },
  { id: "v3", name: "Recruiting v3", approver: "Amina Farouk", sends: 28, replies: 11, calls: 7, rate: "39%" },
];

export const PAYERS = ["Canyon Mutual", "Desert PPO", "Ridge Dental Plan"];
export const PORTAL_PRACTICES = ["Saguaro", "Lakeview", "Copper Canyon"];

export type PortalCell = "Access ✓" | "Pending reinstatement" | "Blocked from offshore" | "MFA held by the practice" | "None";

export const PORTAL_MATRIX: Record<string, Record<string, PortalCell>> = {
  Saguaro: { "Canyon Mutual": "Access ✓", "Desert PPO": "Blocked from offshore", "Ridge Dental Plan": "MFA held by the practice" },
  Lakeview: { "Canyon Mutual": "Pending reinstatement", "Desert PPO": "None", "Ridge Dental Plan": "Access ✓" },
  "Copper Canyon": { "Canyon Mutual": "Access ✓", "Desert PPO": "Access ✓", "Ridge Dental Plan": "Pending reinstatement" },
};

export const KIT_LINES = [
  { id: "k1", section: "Per operatory", item: "High-speed handpiece", qty: 2, flag: "" },
  { id: "k2", section: "Per operatory", item: "Curing light", qty: 1, flag: "" },
  { id: "k3", section: "Per office", item: "Compressor", qty: 1, flag: "FDA status · pending" },
  { id: "k4", section: "Shared", item: "Sterilizer", qty: 1, flag: "" },
  { id: "k5", section: "Spare parts", item: "Handpiece turbine", qty: 4, flag: "Buy local" },
  { id: "k6", section: "Cabinet · General", item: "General cassette", qty: 8, flag: "" },
  { id: "k7", section: "Cabinet · Endo", item: "Endo kit", qty: 2, flag: "" },
  { id: "k8", section: "Cabinet · Surgery", item: "Surgery pack", qty: 2, flag: "Hazmat → MSDS missing" },
  { id: "k9", section: "Per operatory", item: "Nitrile gloves", qty: 10, flag: "Tariff-origin risk" },
  { id: "k10", section: "Shared", item: "Special-order alloy", qty: 1, flag: "Not supplied by primary vendors" },
];

export const QUOTE_DIFFS = [
  "Qty 30 on the quote vs 50 on the sheet",
  "Curing light missing on the quote",
  "Compressor listed twice on the sheet",
  "Spare turbines say 4 on the sheet and 1 on the quote",
  "Endo kit price line is blank on the quote",
  "Surgery pack marked hazmat on the sheet only",
  "Glove case count is a dozen on the quote and a ten-box on the sheet",
];

export const ASSETS = [
  { id: "a1", kind: "Domain", name: "dpcp.example", owner: "Rowan Blake", account: "Company workspace", personal: false, clientOwned: false, renewal: "Mar 2027", cost: 18, healthy: "Oct 20", vault: true },
  { id: "a2", kind: "Website", name: "Mesa Verde launch site", owner: "Priya Shah", account: "Company workspace", personal: false, clientOwned: false, renewal: "Jan 2027", cost: 42, healthy: "Oct 19", vault: true },
  { id: "a3", kind: "Hosting", name: "Staging site", owner: "Rowan Blake", account: "Company workspace", personal: false, clientOwned: false, renewal: "Dec 2026", cost: 24, healthy: "Oct 20", vault: true, stage: "Staging" },
  { id: "a4", kind: "Hosting", name: "Production site", owner: "Rowan Blake", account: "Company workspace", personal: false, clientOwned: false, renewal: "Dec 2026", cost: 64, healthy: "Oct 18", vault: true, stage: "Production" },
  { id: "a5", kind: "Automation", name: "Nightly status job", owner: "Rowan Blake", account: "Closed workspace", personal: true, clientOwned: false, renewal: "Expired", cost: 0, healthy: "Sep 2", vault: true, failures: 14 },
  { id: "a6", kind: "SaaS", name: "Shared inbox tool", owner: "Priya Shah", account: "Personal", personal: true, clientOwned: false, renewal: "Nov 2026", cost: 12, healthy: "Oct 1", vault: true, idle: true },
];

export const PLAN_RULES = [
  { id: "code", label: "Code edition vs jurisdiction", result: "Fail" as const, comment: "Drawing uses 2017. Jurisdiction is on 2023." },
  { id: "corridor", label: "Corridor ≥ 44 in", result: "Pass" as const, comment: "48 in on the current sheet." },
  { id: "doors", label: "Doors ≥ 36 in", result: "Pass" as const, comment: "36 in clear." },
  { id: "op", label: "Operatory width ≥ 8 ft 4 in", result: "Pass" as const, comment: "Editable standard. This sheet clears it." },
  { id: "ada", label: "ADA restroom", result: "Pass" as const, comment: "Turning space shown." },
  { id: "sterile", label: "Sterilization, lab, and storage", result: "Pass" as const, comment: "All three rooms are on the plan." },
  { id: "water", label: "Rough water / PEX per operatory", result: "NA" as const, comment: "Waiting on the plumbing sheet." },
  { id: "asbuilt", label: "As-builts", result: "Fail" as const, comment: "Set is incomplete." },
];

export const STUDY_FUNCTIONS = ["Check-in", "Phones", "Scheduling", "Verification", "Posting", "AR follow-up", "Treatment coordination", "Recare calls", "Downtime"];

export const RECARE_BUCKETS = [
  { id: "b1", label: "6–12 months", count: 42 },
  { id: "b2", label: "1–2 years", count: 27 },
  { id: "b3", label: "2–4 years", count: 11 },
];

export const ORIENTATION_STEPS = [
  { id: "welcome", label: "Welcome" },
  { id: "profile", label: "Profile" },
  { id: "tools", label: "Tools access checklist (status only)" },
  { id: "values", label: "Values acknowledgement" },
  { id: "role", label: "Role page review" },
  { id: "week", label: "First-week plan" },
  { id: "train", label: "Training before client work (3 days to 1 week)" },
];

export const RINGS = [
  { id: "you", label: "You", mission: "Insurance specialist. Prepare the reply. A person sends it." },
  { id: "dept", label: "Department", mission: "Insurance & Billing keeps claims moving and portals usable." },
  { id: "unit", label: "Business unit", mission: "Practice operations. Open locations, staff them, and keep the books honest." },
  { id: "company", label: "Dental Practice Copilot", mission: "People and AI, operating dental practices with a calm daily system." },
];

export const ORG_TREE = [
  {
    team: "New Location",
    lead: "Leila Okonkwo",
    mission: "Open the next location without dropping a gate.",
    pods: [
      { name: "Site and design", people: ["Leila Okonkwo", "Theo March"] },
      { name: "Supplies and kit", people: ["Jonas Keller"] },
    ],
  },
  {
    team: "Insurance & Billing",
    lead: "Omar Hale",
    mission: "Work what the portals allow. Flag what they block.",
    pods: [
      { name: "AR follow-up", people: ["Nadia Reyes", "Imran Cole", "Sana Brooks"] },
      { name: "Coverage", people: ["Faisal Adeyemi", "Hina Moss"] },
    ],
  },
  {
    team: "People & Staffing",
    lead: "Amina Farouk",
    mission: "Hire the care teams before soft opening.",
    pods: [{ name: "Recruiting", people: ["Amina Farouk"] }],
  },
  {
    team: "Marketing",
    lead: "Priya Shah",
    mission: "One site, one domain, one launch page.",
    pods: [{ name: "Launch sites", people: ["Priya Shah"] }],
  },
  {
    team: "IT",
    lead: "Rowan Blake",
    mission: "Company workspace only. No personal accounts.",
    pods: [{ name: "Build", people: ["Rowan Blake"] }],
  },
];

export const TEAM_PROJECTS = [
  { id: "p-lanes", team: "New Location", name: "Mesa Verde opening lanes", owner: "Leila Okonkwo", status: "In progress", next: "Clear the compressor window", blocker: "Ship date", due: "Oct 24" },
  { id: "p-barter", team: "Construction", name: "Barter and Painting task forces", owner: "Leila Okonkwo", status: "Blocked", next: "Use the logged decision", blocker: "Barter rejected", due: "Oct 28" },
  { id: "p-kit", team: "Supplies", name: "Procurement kit", owner: "Jonas Keller", status: "Needs you", next: "Clear 7 quote lines", blocker: "Quote vs sheet", due: "Oct 24" },
  { id: "p-hire", team: "Staffing", name: "Hygienist and doctor recruiting", owner: "Amina Farouk", status: "In progress", next: "Call window 4–5 PM", blocker: "Consent on two profiles", due: "Nov 6" },
  { id: "p-portal", team: "Insurance", name: "Portal-access cleanup", owner: "Omar Hale", status: "Blocked", next: "Reinstatement for Lakeview", blocker: "Blocked from offshore", due: "Oct 22" },
  { id: "p-site", team: "Marketing", name: "Site and domain consolidation", owner: "Priya Shah", status: "In progress", next: "Promote staging after George approves", blocker: "None", due: "Nov 2" },
];

export const WINS = [
  { id: "w1", kind: "Shout-out", title: "Nadia closed the Lakeview filing list", pillar: "Integrity" },
  { id: "w2", kind: "Friday appreciation", title: "Theo stayed on the compressor window", pillar: "Energy" },
  { id: "w3", kind: "Birthday", title: "Priya Shah · Oct 22", pillar: "" },
  { id: "w4", kind: "Work anniversary", title: "Omar Hale · 3 years · Oct 28", pillar: "" },
  { id: "w5", kind: "New hire", title: "Welcome Jamie Okonkwo", pillar: "Intelligence" },
];

export const VALUES = [
  { name: "Intelligence", definition: "Solve the problem in front of you." },
  { name: "Energy", definition: "Finish the day you were given." },
  { name: "Integrity", definition: "Say what is true, including what is late." },
];

export const USAGE_COMPARE = {
  selfWeek: [18, 22, 21, 27],
  selfMonth: [70, 82, 76, 88],
  departments: [
    { name: "Insurance", tasks: 24 },
    { name: "Equipment", tasks: 16 },
    { name: "Staffing", tasks: 14 },
    { name: "Marketing", tasks: 19 },
  ],
  companyAvg: 18,
  percentile: 72,
};

export const MORE_MOVES: { from: string; to: string }[] = [
  { from: "Growth (top bar)", to: "More · Professional Growth" },
  { from: "Calendar (top bar)", to: "More · Calendar" },
  { from: "Continue as / role screen", to: "More · Switch view" },
  { from: "People", to: "More · People & Org" },
  { from: "Orientation", to: "Professional Growth · Orientation → Training" },
  { from: "AI usage vs output", to: "Professional Growth · comparisons" },
  { from: "My week", to: "Professional Growth" },
  { from: "First week, finish setup, new employee setup", to: "Professional Growth · Orientation" },
  { from: "Training paths", to: "Professional Growth · Training" },
  { from: "Company exceptions", to: "People & Org" },
  { from: "Workforce and permissions", to: "People & Org" },
  { from: "Manage access", to: "People & Org · Permissions" },
  { from: "Department homes and copilots", to: "More · Departments & Copilots" },
  { from: "Tickets, performance, clients", to: "Departments & Copilots" },
  { from: "Location launch, deadlines, identity, kit, assets", to: "Departments & Copilots" },
  { from: "Decisions queue", to: "More · Decisions" },
  { from: "Decision log and open questions", to: "Decisions" },
  { from: "Knowledge", to: "More · Knowledge" },
  { from: "Ideas & Roadmap", to: "More · Ideas & Roadmap" },
  { from: "Farewell", to: "Removed from Ideas & Roadmap and More" },
  { from: "Morning check-in", to: "Removed. Make-up lives on Meetings" },
  { from: "Wins & Culture on My Teams", to: "Bottom of Communication" },
  { from: "Settings, time off, system, admin, activity, mobile, design gallery", to: "More · Settings & Admin" },
  { from: "Feedback on DPCP OS", to: "Ideas & Roadmap" },
  { from: "All screens", to: "Settings & Admin" },
];

export const DEPT_TILES = [
  { href: "/copilot/insurance", label: "Insurance" },
  { href: "/copilot/equipment", label: "Equipment" },
  { href: "/copilot/supplies", label: "Supplies" },
  { href: "/copilot/staffing", label: "Staffing" },
  { href: "/copilot/it", label: "IT" },
  { href: "/copilot/accounting", label: "Accounting" },
  { href: "/copilot/marketing", label: "Marketing" },
  { href: "/copilot/construction", label: "Construction" },
  { href: "/people", label: "HR/People" },
  { href: "/admin", label: "Compliance" },
  { href: "/training", label: "Training" },
  { href: "/launch", label: "Location Launch Program" },
  { href: "/launch#deadlines", label: "Deadlines · Money at stake this week" },
  { href: "/launch#identity", label: "Practice identity" },
  { href: "/assets", label: "Asset register" },
];
