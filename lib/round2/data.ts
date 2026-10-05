/** Round 2 sample book. Fictional practices and staff only. No pay data. */

export type Book = "hdg" | "client";

export type CopilotId =
  | "insurance"
  | "equipment"
  | "supplies"
  | "staffing"
  | "it"
  | "accounting"
  | "marketing"
  | "construction";

export interface Practice {
  id: string;
  slug: string;
  name: string;
  kind: Book;
  town: string;
  ops: number;
  pms: string;
  note: string;
}

export const PRACTICES: Practice[] = [
  { id: "copper", slug: "copper-canyon", name: "Copper Canyon Dental", kind: "hdg", town: "Kingsford", ops: 12, pms: "Open Dental", note: "De novo, opened 6 weeks ago" },
  { id: "mesa", slug: "mesa-verde", name: "Mesa Verde Family Dental", kind: "hdg", town: "Sunvale", ops: 14, pms: "Open Dental", note: "In build-out" },
  { id: "ponderosa", slug: "ponderosa", name: "Ponderosa Smiles", kind: "hdg", town: "Pine Hollow", ops: 8, pms: "Dentrix", note: "Acquired, integration in progress" },
  { id: "saguaro", slug: "saguaro", name: "Saguaro Family Dental", kind: "client", town: "Desert Springs", ops: 6, pms: "Eaglesoft", note: "Insurance, marketing, and supplies" },
  { id: "lakeview", slug: "lakeview", name: "Lakeview Dental Arts", kind: "client", town: "Lakeview", ops: 9, pms: "Curve", note: "Insurance, accounting, and IT" },
  { id: "redrock", slug: "red-rock", name: "Red Rock Pediatric Dental", kind: "client", town: "Red Rock", ops: 5, pms: "Dentrix", note: "Staffing and equipment" },
];

export function practiceBySlug(slug: string) {
  return PRACTICES.find((p) => p.slug === slug);
}

export function practiceById(id: string) {
  return PRACTICES.find((p) => p.id === id);
}

export type FloorRole = "Front office" | "Hygiene" | "Assistants" | "Doctors" | "Office manager";

export interface FloorPerson {
  id: string;
  practiceId: string;
  name: string;
  first: string;
  role: FloorRole;
  initials: string;
}

export const FLOOR: FloorPerson[] = [
  { id: "casey", practiceId: "copper", name: "Casey Nguyen", first: "Casey", role: "Front office", initials: "CN" },
  { id: "luis", practiceId: "copper", name: "Luis Ortega", first: "Luis", role: "Front office", initials: "LO" },
  { id: "hannah", practiceId: "copper", name: "Hannah Brooks", first: "Hannah", role: "Hygiene", initials: "HB" },
  { id: "owen", practiceId: "copper", name: "Owen Blake", first: "Owen", role: "Hygiene", initials: "OB" },
  { id: "mia", practiceId: "copper", name: "Mia Santos", first: "Mia", role: "Assistants", initials: "MS" },
  { id: "andre", practiceId: "copper", name: "Andre Cole", first: "Andre", role: "Assistants", initials: "AC" },
  { id: "voss", practiceId: "copper", name: "Dr. Elena Voss", first: "Elena", role: "Doctors", initials: "EV" },
  { id: "adam", practiceId: "copper", name: "Dr. Adam Shah", first: "Adam", role: "Doctors", initials: "AS" },
  { id: "robin", practiceId: "copper", name: "Robin Hale", first: "Robin", role: "Office manager", initials: "RH" },
  { id: "maria", practiceId: "saguaro", name: "Maria Alvarez", first: "Maria", role: "Front office", initials: "MA" },
  { id: "chris", practiceId: "saguaro", name: "Chris Dunn", first: "Chris", role: "Front office", initials: "CD" },
  { id: "dana", practiceId: "saguaro", name: "Dana Kim", first: "Dana", role: "Hygiene", initials: "DK" },
  { id: "pete", practiceId: "saguaro", name: "Pete Nunez", first: "Pete", role: "Assistants", initials: "PN" },
  { id: "lila", practiceId: "saguaro", name: "Dr. Lila Okonkwo", first: "Lila", role: "Doctors", initials: "LO" },
  { id: "jordan", practiceId: "saguaro", name: "Jordan Ellis", first: "Jordan", role: "Office manager", initials: "JE" },
  { id: "nina", practiceId: "mesa", name: "Nina Patel", first: "Nina", role: "Front office", initials: "NP" },
  { id: "sam", practiceId: "mesa", name: "Sam Ibarra", first: "Sam", role: "Office manager", initials: "SI" },
  { id: "ruth", practiceId: "ponderosa", name: "Ruth Calder", first: "Ruth", role: "Front office", initials: "RC" },
  { id: "bea", practiceId: "ponderosa", name: "Bea Solomon", first: "Bea", role: "Office manager", initials: "BS" },
  { id: "kyle", practiceId: "lakeview", name: "Kyle Brennan", first: "Kyle", role: "Front office", initials: "KB" },
  { id: "tess", practiceId: "lakeview", name: "Tess Ward", first: "Tess", role: "Office manager", initials: "TW" },
  { id: "noor", practiceId: "redrock", name: "Noor Haddad", first: "Noor", role: "Front office", initials: "NH" },
  { id: "glen", practiceId: "redrock", name: "Glen Cho", first: "Glen", role: "Office manager", initials: "GC" },
];

export const FLOOR_ROLES: FloorRole[] = ["Front office", "Hygiene", "Assistants", "Doctors", "Office manager"];

export interface DeskList {
  id: string;
  name: string;
  due: string;
  items: string[];
}

export const DESK_LISTS: DeskList[] = [
  { id: "open", name: "Open the day", due: "Before 7:30 AM", items: ["Lights, music, and the scent on", "Phones off night mode", "Ops have the morning setup", "Huddle card on the counter", "Sterile packs staged"] },
  { id: "huddle", name: "Huddle card", due: "7:45 AM", items: ["Who is in today", "Lab cases due back", "Tight spots on the book", "Supplies that are short"] },
  { id: "sterile", name: "Sterile cycle", due: "Midday", items: ["Ultrasonic ran", "Autoclave cycle logged", "Pouches dated", "Tuesday spore test, if today is Tuesday"] },
  { id: "close", name: "Close the day", due: "After the last visit", items: ["Ops broken down", "Deposit bag sealed", "Note for tomorrow's opener", "Alarms set"] },
];

export interface Lesson {
  id: string;
  role: FloorRole | "Everyone";
  title: string;
  minutes: number;
  quiz: { q: string; choices: string[]; answer: number };
}

export const LESSONS: Lesson[] = [
  { id: "l1", role: "Front office", title: "How a new patient is welcomed", minutes: 8, quiz: { q: "Where do insurance details live?", choices: ["In this desk app", "In the practice system", "In a text to the biller"], answer: 1 } },
  { id: "l2", role: "Front office", title: "Marking a visit for marketing", minutes: 6, quiz: { q: "What do you mark?", choices: ["The clinical note", "Scheduled or seen, initials only", "The payer password"], answer: 1 } },
  { id: "l3", role: "Assistants", title: "Sterile cycle", minutes: 10, quiz: { q: "A pouch with no date is…", choices: ["Fine for today", "Not ready to use", "A front-desk task"], answer: 1 } },
  { id: "l4", role: "Hygiene", title: "Huddle card", minutes: 7, quiz: { q: "The huddle card includes patient names?", choices: ["Yes, full names", "No. Who is in, and tight spots only", "Only for new patients"], answer: 1 } },
  { id: "l5", role: "Doctors", title: "What you approve", minutes: 5, quiz: { q: "A supply swap the system suggests…", choices: ["Ships on its own", "Waits for you", "Goes to marketing"], answer: 1 } },
  { id: "l6", role: "Office manager", title: "Reading the day", minutes: 9, quiz: { q: "A red due badge means…", choices: ["Someone is late on that list", "The payer is down", "Payroll is open"], answer: 0 } },
  { id: "l7", role: "Everyone", title: "Asking DPCP for help", minutes: 4, quiz: { q: "A broken chair goes to…", choices: ["Insurance", "Equipment", "Marketing"], answer: 1 } },
  { id: "l8", role: "Assistants", title: "Room close", minutes: 6, quiz: { q: "End of day, the deposit bag is…", choices: ["Left on the counter", "Sealed and logged", "Texted to the owner"], answer: 1 } },
  { id: "l9", role: "Front office", title: "When a patient disputes a balance", minutes: 8, quiz: { q: "You type into the request…", choices: ["Full name, DOB, and member ID", "What they said, no chart detail", "The EOB scan"], answer: 1 } },
];

export interface Copilot {
  id: CopilotId;
  name: string;
  short: string;
  logo: string;
  leadId: string;
  members: string[];
  blurb: string;
  pulses: { label: string; score: string; goal: string; trend: "up" | "down" | "flat" }[];
  aiSince: string;
}

export const COPILOTS: Copilot[] = [
  {
    id: "insurance",
    name: "Dental Insurance Copilot",
    short: "Insurance",
    logo: "/brand/logos/dental-insurance-copilot_horizontal_color.png",
    leadId: "omar",
    members: ["nadia", "omar", "imran", "sana", "faisal", "hina", "jamie"],
    blurb: "Eligibility, claims, posting, AR, appeals, credentialing.",
    pulses: [
      { label: "Collection ratio", score: "91%", goal: "97%", trend: "up" },
      { label: "Clean-claim rate", score: "94%", goal: "98%", trend: "flat" },
      { label: "AR 90+", score: "$21.4k", goal: "Under $12k", trend: "down" },
      { label: "Tasks with AI", score: "54%", goal: "70%", trend: "up" },
    ],
    aiSince: "AI verified 46 visits, drafted 3 appeals, and matched 112 ERA lines.",
  },
  {
    id: "equipment",
    name: "Dental Equipment Copilot",
    short: "Equipment",
    logo: "/brand/logos/dental-equipment-copilot_horizontal_color.png",
    leadId: "theo",
    members: ["theo"],
    blurb: "Rooms, quotes, landed cost, service, and resale.",
    pulses: [
      { label: "Rooms specified", score: "14", goal: "14", trend: "flat" },
      { label: "FDA-ready SKUs", score: "14/16", goal: "16/16", trend: "up" },
      { label: "Open service", score: "3", goal: "0 urgent", trend: "down" },
      { label: "Quotes out", score: "2", goal: "Reply in 5d", trend: "flat" },
    ],
    aiSince: "AI compared two chair quotes and drafted a warranty check for Op 7.",
  },
  {
    id: "supplies",
    name: "Dental Supplies Copilot",
    short: "Supplies",
    logo: "/brand/logos/dental-supplies-copilot_horizontal_color.png",
    leadId: "jonas",
    members: ["jonas"],
    blurb: "Pars, carts, deliveries, catalog, and price checks.",
    pulses: [
      { label: "Lines under par", score: "6", goal: "0 critical", trend: "down" },
      { label: "Cart savings", score: "16%", goal: "10%", trend: "up" },
      { label: "On-time deliveries", score: "3 of 4", goal: "4 of 4", trend: "flat" },
      { label: "Catalog margin", score: "28%", goal: "25%", trend: "up" },
    ],
    aiSince: "AI built Saguaro's October cart and flagged a glove par at Copper Canyon.",
  },
  {
    id: "staffing",
    name: "Dental Staffing Copilot",
    short: "Staffing",
    logo: "/brand/logos/dental-staffing-copilot_horizontal_color.png",
    leadId: "amina",
    members: ["amina"],
    blurb: "Requisitions, candidates, bench, credentials, first 90 days.",
    pulses: [
      { label: "Open roles", score: "4", goal: "Fill in 30d", trend: "flat" },
      { label: "Bench depth", score: "65", goal: "50", trend: "up" },
      { label: "Credential holds", score: "1", goal: "0", trend: "down" },
      { label: "90-day on track", score: "6/9", goal: "9/9", trend: "up" },
    ],
    aiSince: "AI screened 12 candidates and drafted one associate requisition.",
  },
  {
    id: "it",
    name: "Dental IT Copilot",
    short: "IT",
    logo: "/brand/logos/copilot-mark_icon_color.png",
    leadId: "rowan",
    members: ["rowan"],
    blurb: "Help desk, devices, security, access, and new-site builds.",
    pulses: [
      { label: "Open tickets", score: "7", goal: "Under 5", trend: "down" },
      { label: "MFA coverage", score: "78%", goal: "100%", trend: "up" },
      { label: "Unpatched devices", score: "2", goal: "0", trend: "down" },
      { label: "Mesa drops live", score: "28/34", goal: "34/34", trend: "up" },
    ],
    aiSince: "AI walked the Lakeview front desk through three Curve steps before opening a ticket.",
  },
  {
    id: "accounting",
    name: "Dental Accounting Copilot",
    short: "Accounting",
    logo: "/brand/logos/dental-finance-copilot_horizontal_color.png",
    leadId: "elena",
    members: ["elena"],
    blurb: "Close, the five-section P&L, payments, KPIs, and client invoices.",
    pulses: [
      { label: "Close steps", score: "6/7", goal: "7/7", trend: "up" },
      { label: "4-wall profit", score: "36.3%", goal: "35%", trend: "up" },
      { label: "Bills waiting", score: "4", goal: "Same day", trend: "flat" },
      { label: "Client invoices", score: "5 sent", goal: "6", trend: "up" },
    ],
    aiSince: "AI drafted Saguaro's September P&L in the five-section frame and flagged a new payee.",
  },
  {
    id: "marketing",
    name: "Dental Marketing Copilot",
    short: "Marketing",
    logo: "/brand/logos/dental-marketing-copilot_horizontal_color.png",
    leadId: "priya",
    members: ["priya"],
    blurb: "Performance, snapshots, tracking, call match, weekboard, pages, reputation.",
    pulses: [
      { label: "New patients", score: "21", goal: "24", trend: "up" },
      { label: "Cost per new", score: "$96", goal: "Under $110", trend: "up" },
      { label: "Tracking health", score: "5/5", goal: "5/5", trend: "flat" },
      { label: "Calls matched", score: "31/47", goal: "90%", trend: "down" },
    ],
    aiSince: "AI drafted Lakeview's weekly snapshot and flagged a Copper Canyon tracking gap.",
  },
  {
    id: "construction",
    name: "Dental Construction Copilot",
    short: "Construction",
    logo: "/brand/logos/copilot-mark_square_color-on-white.png",
    leadId: "rowan",
    members: ["rowan"],
    blurb: "Sites, simulated bids, trades, barter, drawings, and facilities.",
    pulses: [
      { label: "Active sites", score: "2", goal: "Gates clear", trend: "flat" },
      { label: "Simulated bid", score: "$412k", goal: "Within 8%", trend: "flat" },
      { label: "Trades on time", score: "85%", goal: "90%", trend: "up" },
      { label: "Open work orders", score: "3", goal: "Same week", trend: "down" },
    ],
    aiSince: "AI priced a simulated GC bid for Mesa Verde and drafted tomorrow's trade order.",
  },
];

export function copilotById(id: string) {
  return COPILOTS.find((c) => c.id === id);
}

/** George sees every copilot. Everyone else sees the ones they belong to. */
export function copilotsFor(personId: string, role: string): Copilot[] {
  if (role === "george") return COPILOTS;
  return COPILOTS.filter((c) => c.members.includes(personId) || c.leadId === personId);
}

export interface ModuleDef {
  id: string;
  name: string;
  purpose: string;
  special?: "rcm" | "eligibility" | "claims" | "posting" | "ar" | "denials" | "credentialing" | "monthend" | "scorecard" | "pnl" | "callmatch" | "service" | "landed" | "inventory" | "pipeline" | "bid";
}

export const MODULES: Record<CopilotId, ModuleDef[]> = {
  insurance: [
    { id: "rcm", name: "RCM Command Center", purpose: "Every client's revenue health, and where people are stuck.", special: "rcm" },
    { id: "eligibility", name: "Eligibility & Verification", purpose: "Verify every scheduled visit before the day.", special: "eligibility" },
    { id: "claims", name: "Claims Workbench", purpose: "Clean claims out the same day. Rejections fixed fast.", special: "claims" },
    { id: "posting", name: "Payment Posting Desk", purpose: "Match every payment and catch underpayments.", special: "posting" },
    { id: "ar", name: "AR Follow-up Board", purpose: "Work aging in the order that recovers the most.", special: "ar" },
    { id: "denials", name: "Denials & Appeals Studio", purpose: "Turn denials into appeals a person approves.", special: "denials" },
    { id: "credentialing", name: "Credentialing Tracker", purpose: "Enroll providers and watch fee schedules.", special: "credentialing" },
    { id: "month-end", name: "Month-end Report Builder", purpose: "A clean monthly report for each practice.", special: "monthend" },
    { id: "scorecard", name: "Biller Scorecard", purpose: "Share of work done with AI, and hours saved.", special: "scorecard" },
  ],
  equipment: [
    { id: "planner", name: "Location Equipment Planner", purpose: "What a room set needs, by operatory." },
    { id: "quotes", name: "Vendor & Quote Comparison", purpose: "Side-by-side quotes with the gaps called out." },
    { id: "landed", name: "Landed Cost & Import Tracker", purpose: "Product cost through freight, duty, and bond.", special: "landed" },
    { id: "service", name: "Install & Service Desk", purpose: "Breakdowns, warranty, and the visit.", special: "service" },
    { id: "sales", name: "Equipment Sales", purpose: "What we can resell, and who asked." },
  ],
  supplies: [
    { id: "inventory", name: "Practice Inventory & Par Levels", purpose: "What is short, and what is about to be.", special: "inventory" },
    { id: "cart", name: "Reorder & Cart Builder", purpose: "A cart the practice can approve." },
    { id: "orders", name: "Orders & Deliveries", purpose: "What shipped, what is backordered, what arrived." },
    { id: "catalog", name: "Catalog & Store Manager", purpose: "SKUs, lots, and what may be sold." },
    { id: "benchmark", name: "Supplier Price Benchmark", purpose: "Where a practice is overpaying." },
  ],
  staffing: [
    { id: "reqs", name: "Requisitions Board", purpose: "Open seats and how long they have been open." },
    { id: "pipeline", name: "Candidate Pipeline", purpose: "Who is in process, and the screen notes.", special: "pipeline" },
    { id: "bench", name: "Talent Bench", purpose: "People we can call before we post." },
    { id: "credentials", name: "Credential & Compliance", purpose: "License, DEA, and the documents still out." },
    { id: "ninety", name: "Onboarding & 90-day", purpose: "The first 90 days, module by module." },
    { id: "offers", name: "Offers & Agreements", purpose: "Offers waiting on a signature." },
  ],
  it: [
    { id: "help", name: "Help Desk", purpose: "What is broken, what AI already tried, who owns it." },
    { id: "assets", name: "Asset & Device Inventory", purpose: "Workstations, patches, and who holds them." },
    { id: "security", name: "Security & HIPAA Center", purpose: "MFA, findings, and what is still open." },
    { id: "access", name: "User Access", purpose: "Who can sign in, and what to remove." },
    { id: "build", name: "New Location IT Build", purpose: "Drops, ISP, and the go-live list." },
  ],
  accounting: [
    { id: "close", name: "Month-end Close Board", purpose: "Which close steps are still open." },
    { id: "pnl", name: "P&L Analyzer", purpose: "George's five sections. No personal pay.", special: "pnl" },
    { id: "payments", name: "Payments & Approvals", purpose: "Bills a person must release." },
    { id: "kpi", name: "KPI & Benchmark", purpose: "Practice ratios against the book." },
    { id: "collections", name: "Collections & AR", purpose: "What we invoice practices. Not patient AR." },
  ],
  marketing: [
    { id: "performance", name: "Client Performance Board", purpose: "Leads, booked, seen, and cost per new patient." },
    { id: "snapshots", name: "Snapshot & Report Studio", purpose: "The weekly note and the monthly report." },
    { id: "tracking", name: "Tracking & Attribution", purpose: "Is the pixel, the call, and the form healthy?" },
    { id: "match", name: "Call-to-Patient Match", purpose: "Calls beside the front desk marks.", special: "callmatch" },
    { id: "weekboard", name: "Weekboard", purpose: "The weekly optimization ritual for each practice." },
    { id: "pages", name: "Landing Page & Content", purpose: "Pages and posts waiting on approval." },
    { id: "reputation", name: "Reputation", purpose: "New public reviews. We flag them. We do not reply on Google." },
  ],
  construction: [
    { id: "pipeline", name: "Site Pipeline", purpose: "Every site, its stage, and the three gates.", special: "pipeline" },
    { id: "bid", name: "Simulated GC Bid & Budget", purpose: "A bid the team can compare to cash and barter.", special: "bid" },
    { id: "trades", name: "Build Schedule & Trades", purpose: "Who is on site, and which inspection is next." },
    { id: "barter", name: "Barter Program", purpose: "Credits in, work out, ceiling in view." },
    { id: "drawings", name: "Design & Drawings", purpose: "Layout, sign-off, and what changed." },
    { id: "facilities", name: "Facilities Work Orders", purpose: "Something in a live building needs a person." },
  ],
};

export interface WorkRow {
  id: string;
  practiceId?: string;
  title: string;
  detail: string;
  lane: "ai" | "human";
  status: string;
  meta?: string;
}

const HERO: Record<string, WorkRow[]> = {
  "insurance:rcm": [
    { id: "rcm-sag", practiceId: "saguaro", title: "Saguaro Family Dental", detail: "Production $142,300 · collections $118,900 (83.6%). AR 90+ $21,400, up 9%. Clean-claim 94%. 31 ERA lines unposted.", lane: "human", status: "Blocker", meta: "No deposit info for 3 checks since Sep 24" },
    { id: "rcm-lake", practiceId: "lakeview", title: "Lakeview Dental Arts", detail: "Collection ratio 97%. AR 90+ $4,100. No blockers.", lane: "ai", status: "Quiet", meta: "AI compiled overnight" },
    { id: "rcm-cop", practiceId: "copper", title: "Copper Canyon Dental", detail: "Production $86,400 · collections $71,200 (82.4%). AR 90+ $6,200. Clean-claim 96%.", lane: "ai", status: "Watch", meta: "New site, thin history" },
    { id: "rcm-pon", practiceId: "ponderosa", title: "Ponderosa Smiles", detail: "Dentrix sync is 2 days behind. Collections shown as preliminary.", lane: "human", status: "Needs a human", meta: "Integration" },
    { id: "rcm-red", practiceId: "redrock", title: "Red Rock Pediatric Dental", detail: "Production $54,100 · collections $49,800 (92%). AR 90+ $1,900.", lane: "ai", status: "On track", meta: "" },
    { id: "rcm-mesa", practiceId: "mesa", title: "Mesa Verde Family Dental", detail: "Not billing yet. Build-out. Credentialing is the open work.", lane: "human", status: "Not live", meta: "Opens after the gates" },
  ],
  "insurance:eligibility": [
    { id: "el-1", practiceId: "copper", title: "J.R. · 8:00 AM · MetLife PPO", detail: "Deductible $25 of $50 left. Max $1,140 of $1,500. BWX due. AOB yes.", lane: "ai", status: "AI verified", meta: "Tue Oct 6" },
    { id: "el-2", practiceId: "copper", title: "C.D. · 8:40 AM · Delta", detail: "Portal timed out twice. Needs a call.", lane: "human", status: "Needs a call", meta: "Tue Oct 6" },
    { id: "el-3", practiceId: "copper", title: "M.L. · 9:20 AM · BCBS", detail: "Pays the patient, not the practice. Flagged.", lane: "human", status: "Needs a call", meta: "Tue Oct 6" },
    { id: "el-4", practiceId: "copper", title: "A.S. · 10:00 AM · plan missing", detail: "No plan on the PMS record.", lane: "human", status: "Missing plan", meta: "Tue Oct 6" },
    { id: "el-5", practiceId: "saguaro", title: "P.N. · 11:10 AM · Aetna PPO", detail: "Frequency for crowns is the open question on 88-1042.", lane: "ai", status: "AI partial", meta: "Wed Oct 7" },
    { id: "el-6", practiceId: "lakeview", title: "T.W. · 1:00 PM · Cigna", detail: "Verified. Annual max $800 left.", lane: "ai", status: "AI verified", meta: "Wed Oct 7" },
    { id: "el-7", practiceId: "ponderosa", title: "R.C. · 2:30 PM · Guardian", detail: "Waiting period still open on major.", lane: "human", status: "Needs a call", meta: "Thu Oct 8" },
    { id: "el-8", practiceId: "redrock", title: "N.H. · 9:00 AM · Medicaid stand-in", detail: "Benefits summary filled. A person confirms the state rules.", lane: "human", status: "Needs a human", meta: "Thu Oct 8" },
  ],
  "insurance:claims": [
    { id: "cl-1", practiceId: "saguaro", title: "31 claims ready", detail: "Yesterday's batch, scrubbed. Waiting on a person to submit in Eaglesoft.", lane: "human", status: "Ready to submit", meta: "Saguaro · 37 in the batch" },
    { id: "cl-2", practiceId: "saguaro", title: "D4341 ×4", detail: "Perio charting not attached.", lane: "human", status: "Needs a fix", meta: "4 claims" },
    { id: "cl-3", practiceId: "saguaro", title: "Subscriber ID mismatch", detail: "AI proposes the ID from the Sep 30 eligibility check.", lane: "human", status: "Rejected", meta: "2 claims" },
    { id: "cl-4", practiceId: "copper", title: "18 claims ready", detail: "Open Dental batch. Narratives drafted.", lane: "ai", status: "Ready", meta: "Copper Canyon" },
    { id: "cl-5", practiceId: "lakeview", title: "D1110 narrative", detail: "Draft attached. Confidence high.", lane: "ai", status: "Drafted", meta: "Lakeview" },
    { id: "cl-6", practiceId: "ponderosa", title: "Attachment failed", detail: "X-ray did not cross from Dentrix.", lane: "human", status: "Needs a fix", meta: "Ponderosa" },
    { id: "cl-7", practiceId: "redrock", title: "9 pediatric claims", detail: "Scrubbed. Age-based codes checked.", lane: "ai", status: "Ready", meta: "Red Rock" },
    { id: "cl-8", practiceId: "copper", title: "D2740 frequency", detail: "Held. Same pattern as Saguaro 88-1042.", lane: "human", status: "Needs a human", meta: "Copper Canyon" },
  ],
  "insurance:posting": [
    { id: "po-1", practiceId: "lakeview", title: "Oct 2 batch · 112 ERA lines", detail: "104 auto-matched. 6 underpaid (Delta paid $78 vs $96 on D1110). 2 no match.", lane: "human", status: "Exceptions", meta: "Lakeview" },
    { id: "po-2", practiceId: "lakeview", title: "Check #20418 · $1,240.50", detail: "Cigna, received Sep 28. Practice has not confirmed the deposit.", lane: "human", status: "Missing deposit", meta: "Lakeview" },
    { id: "po-3", practiceId: "saguaro", title: "3 checks since Sep 24", detail: "No deposit info. This is the command-center blocker.", lane: "human", status: "Missing deposit", meta: "Saguaro" },
    { id: "po-4", practiceId: "copper", title: "EFT $6,410", detail: "Matched to 22 lines.", lane: "ai", status: "Auto-matched", meta: "Copper Canyon" },
    { id: "po-5", practiceId: "ponderosa", title: "Scanned EOB", detail: "Read. Two lines need a person.", lane: "human", status: "Partial", meta: "Ponderosa" },
    { id: "po-6", practiceId: "redrock", title: "ERA $2,180", detail: "Fully matched.", lane: "ai", status: "Auto-matched", meta: "Red Rock" },
    { id: "po-7", practiceId: "saguaro", title: "Desk payment $180", detail: "Front desk marked it. Not posted yet.", lane: "human", status: "Needs a human", meta: "Saguaro" },
    { id: "po-8", practiceId: "lakeview", title: "Underpay appeal draft", detail: "Delta D1110. Draft is in Review.", lane: "ai", status: "Drafted", meta: "Lakeview" },
  ],
  "insurance:ar": [
    { id: "ar-1042", practiceId: "saguaro", title: "Claim 88-1042 · Aetna · $2,860", detail: "D2740 ×2. 74 days. 2 touches. Last outcome: in review. Next: call for the reprocessing reference.", lane: "human", status: "Call next", meta: "Saguaro" },
    { id: "ar-2", practiceId: "saguaro", title: "Claim 88-0991 · Delta · $640", detail: "41 days. AI says one more portal check, then a call.", lane: "ai", status: "Portal check", meta: "Saguaro" },
    { id: "ar-3", practiceId: "lakeview", title: "Claim 77-2201 · Cigna · $1,120", detail: "96 days. Script ready.", lane: "human", status: "Call next", meta: "Lakeview" },
    { id: "ar-4", practiceId: "copper", title: "Claim 12-4410 · MetLife · $890", detail: "28 days. On track.", lane: "ai", status: "Watching", meta: "Copper Canyon" },
    { id: "ar-5", practiceId: "ponderosa", title: "Claim 55-1008 · Guardian · $2,040", detail: "120 days. Write-off needs the lead.", lane: "human", status: "Lead", meta: "Ponderosa" },
    { id: "ar-6", practiceId: "redrock", title: "Claim 33-088 · $210", detail: "18 days. AI will touch on Friday.", lane: "ai", status: "Scheduled", meta: "Red Rock" },
    { id: "ar-7", practiceId: "saguaro", title: "Claim 88-1100 · Aetna · $430", detail: "Denied. Moved to appeals.", lane: "ai", status: "In appeals", meta: "Saguaro" },
    { id: "ar-8", practiceId: "lakeview", title: "Claim 77-2188 · $760", detail: "Paid last night. AI will close it after posting confirms.", lane: "ai", status: "Closing", meta: "Lakeview" },
  ],
  "insurance:denials": [
    { id: "dn-1", practiceId: "saguaro", title: "Frequency limitation · 12", detail: "Largest pile this month. 88-1042 is the live one.", lane: "human", status: "In review", meta: "All practices" },
    { id: "dn-2", practiceId: "copper", title: "Copper Canyon · Delta · D4910", detail: "Draft v2. Reviewer asked to cite perio history.", lane: "human", status: "In review", meta: "Appeals pipeline" },
    { id: "dn-3", practiceId: "lakeview", title: "Missing narrative · 7", detail: "AI drafted five. Two need a chart the PMS still holds.", lane: "human", status: "Needs a human", meta: "" },
    { id: "dn-4", practiceId: "ponderosa", title: "Downgrade · 5", detail: "Not covered as billed. Templates ready.", lane: "ai", status: "Drafted", meta: "" },
    { id: "dn-5", practiceId: "saguaro", title: "Appeal sent · won", detail: "D2950, $186, paid Oct 9.", lane: "ai", status: "Won", meta: "Saguaro" },
    { id: "dn-6", practiceId: "redrock", title: "Appeal sent · waiting", detail: "Day 11 of a 30-day window.", lane: "ai", status: "Sent", meta: "Red Rock" },
    { id: "dn-7", practiceId: "copper", title: "Deadline Thursday", detail: "One appeal expires Oct 22.", lane: "human", status: "Needs a human", meta: "Copper Canyon" },
    { id: "dn-8", practiceId: "lakeview", title: "Lost · do not resend", detail: "Timely filing. AI closed it.", lane: "ai", status: "Lost", meta: "Lakeview" },
  ],
  "insurance:credentialing": [
    { id: "cr-1", practiceId: "copper", title: "Dr. A. Mendez · Delta PPO", detail: "Submitted Sep 18. Typical 45–60 days.", lane: "ai", status: "In review", meta: "Copper Canyon" },
    { id: "cr-2", practiceId: "copper", title: "Dr. A. Mendez · MetLife", detail: "Malpractice COI is missing.", lane: "human", status: "Docs gathering", meta: "Copper Canyon" },
    { id: "cr-3", practiceId: "copper", title: "CAQH re-attestation", detail: "Due Oct 22.", lane: "human", status: "Due", meta: "Copper Canyon" },
    { id: "cr-4", practiceId: "mesa", title: "New site packet", detail: "Not started. Waiting on layout sign-off.", lane: "human", status: "Not started", meta: "Mesa Verde" },
    { id: "cr-5", practiceId: "ponderosa", title: "Fee schedule vs UCR", detail: "AI compared 40 codes. Three are under.", lane: "human", status: "Negotiate", meta: "Ponderosa" },
    { id: "cr-6", practiceId: "saguaro", title: "Dr. L. Okonkwo · Aetna", detail: "Effective Nov 1.", lane: "ai", status: "Approved", meta: "Saguaro" },
    { id: "cr-7", practiceId: "lakeview", title: "W-9 on file", detail: "Chased and received.", lane: "ai", status: "Done", meta: "Lakeview" },
    { id: "cr-8", practiceId: "redrock", title: "Pediatric rider", detail: "Payer call still needed.", lane: "human", status: "Needs a human", meta: "Red Rock" },
  ],
  "insurance:month-end": [
    { id: "me-1", practiceId: "saguaro", title: "Saguaro · September", detail: "AI draft ready. AR 90+ moved $3,900 after a late posting. Check those two numbers.", lane: "human", status: "Needs a check", meta: "Opens in Review" },
    { id: "me-2", practiceId: "lakeview", title: "Lakeview · September", detail: "Numbers checked. Waiting on the lead to send.", lane: "human", status: "Approved to send", meta: "" },
    { id: "me-3", practiceId: "copper", title: "Copper Canyon · September", detail: "First full month. Draft is thin on trend.", lane: "ai", status: "Drafted", meta: "" },
    { id: "me-4", practiceId: "ponderosa", title: "Ponderosa · September", detail: "Blocked on the Dentrix lag.", lane: "human", status: "Blocked", meta: "" },
    { id: "me-5", practiceId: "redrock", title: "Red Rock · September", detail: "Sent Oct 6.", lane: "ai", status: "Sent", meta: "" },
    { id: "me-6", practiceId: "mesa", title: "Mesa Verde", detail: "No report until the practice is open.", lane: "ai", status: "Not due", meta: "" },
    { id: "me-7", practiceId: "saguaro", title: "Wins paragraph", detail: "AI wrote the patient-free summary.", lane: "ai", status: "Drafted", meta: "" },
    { id: "me-8", practiceId: "lakeview", title: "Next month focus", detail: "Posting speed. A person will say if that is the right focus.", lane: "human", status: "Needs a human", meta: "" },
  ],
  "insurance:scorecard": [
    { id: "sc-a", title: "Biller A", detail: "212 tasks. 68% with AI. 9.5 hours saved.", lane: "ai", status: "On pace", meta: "This week" },
    { id: "sc-b", title: "Biller B", detail: "188 tasks. 61% with AI. 7.2 hours saved.", lane: "ai", status: "On pace", meta: "" },
    { id: "sc-c", title: "Biller C", detail: "164 tasks. 44% with AI. 4.1 hours saved.", lane: "human", status: "Coach", meta: "" },
    { id: "sc-d", title: "Biller D", detail: "151 tasks. 52% with AI. 5.0 hours saved.", lane: "ai", status: "On pace", meta: "" },
    { id: "sc-e", title: "Biller E", detail: "133 tasks. 39% with AI. 3.4 hours saved.", lane: "human", status: "Coach", meta: "" },
    { id: "sc-f", title: "Biller F", detail: "140 tasks. 12% with AI. Second week under 20%.", lane: "human", status: "Flag", meta: "AI-adoption lead" },
    { id: "sc-g", title: "Biller G", detail: "96 tasks. 71% with AI. 6.6 hours saved.", lane: "ai", status: "On pace", meta: "" },
    { id: "sc-h", title: "Verifier team", detail: "46 verifications overnight. 5 still need a call.", lane: "ai", status: "Reported", meta: "" },
  ],
  "equipment:planner": [
    { id: "pl-1", practiceId: "mesa", title: "Mesa Verde · 14 ops", detail: "Chairs 14. Handpieces 34. Autoclaves 2. Scalable to 20 rooms.", lane: "human", status: "Needs a sign-off", meta: "Planner" },
    { id: "pl-2", practiceId: "copper", title: "Copper Canyon · as built", detail: "12 ops. One chair (Op 7) is in service.", lane: "ai", status: "Catalogued", meta: "" },
    { id: "pl-3", practiceId: "ponderosa", title: "Ponderosa · gap list", detail: "Compressor is undersized for 8 ops.", lane: "human", status: "Needs a human", meta: "" },
    { id: "pl-4", practiceId: "redrock", title: "Red Rock · 2 chairs asked", detail: "Pediatric package. Quote started.", lane: "ai", status: "Drafted", meta: "" },
    { id: "pl-5", practiceId: "mesa", title: "Sterilization room", detail: "Two autoclaves specified. Utility check open.", lane: "human", status: "Needs a human", meta: "" },
    { id: "pl-6", practiceId: "saguaro", title: "No project", detail: "Service only.", lane: "ai", status: "Quiet", meta: "" },
    { id: "pl-7", practiceId: "lakeview", title: "Sensor replacement", detail: "One sensor on the planner, not a room set.", lane: "ai", status: "Noted", meta: "" },
    { id: "pl-8", practiceId: "mesa", title: "UDI placeholders", detail: "14 of 16 SKUs have a GUDID match. Two held.", lane: "human", status: "Compliance hold", meta: "FDA before PO" },
  ],
  "equipment:quotes": [
    { id: "qu-1", practiceId: "redrock", title: "Vendor A · 2 chairs", detail: "Product $18,400. Transport $2,400. Install included.", lane: "human", status: "Compare", meta: "Red Rock" },
    { id: "qu-2", practiceId: "redrock", title: "Vendor B · 2 chairs", detail: "Product $17,100. Transport $3,050. Install extra.", lane: "ai", status: "Compared", meta: "Red Rock" },
    { id: "qu-3", practiceId: "mesa", title: "Vendor C · compressors", detail: "Listed as industrial. Held. A compressor for a dental site needs a device declaration.", lane: "human", status: "Compliance hold", meta: "Mesa Verde" },
    { id: "qu-4", practiceId: "mesa", title: "Vendor A · autoclaves", detail: "K-number on file. Ready to price.", lane: "ai", status: "Ready", meta: "" },
    { id: "qu-5", practiceId: "ponderosa", title: "Compressor upsize", detail: "Two quotes in. Waiting on a third.", lane: "human", status: "Needs a human", meta: "" },
    { id: "qu-6", practiceId: "copper", title: "Handpiece set", detail: "Quote expired Oct 1. AI asked for a refresh.", lane: "ai", status: "Refresh sent", meta: "" },
    { id: "qu-7", practiceId: "lakeview", title: "No open quote", detail: "Service contract only.", lane: "ai", status: "Quiet", meta: "" },
    { id: "qu-8", practiceId: "saguaro", title: "Curing light", detail: "Under the small-buy line. AI can place it after a person nods.", lane: "human", status: "Needs a nod", meta: "" },
  ],
  "equipment:landed": [
    { id: "ld-1", practiceId: "mesa", title: "Shipment EQ-0412", detail: "6 chairs and 2 compressors. Sailed Sep 22. ETA Oct 19. Product $28,000 → landed $46,100.", lane: "human", status: "China hold cleared", meta: "14/16 SKUs FDA-ready" },
    { id: "ld-2", practiceId: "mesa", title: "Bond", detail: "Entry bond open. Broker has the packet.", lane: "ai", status: "Filed", meta: "Sample broker: Northline Freight" },
    { id: "ld-3", practiceId: "mesa", title: "PL / CI / BL", detail: "Packing list and commercial invoice match. Bill of lading is in.", lane: "ai", status: "Matched", meta: "" },
    { id: "ld-4", practiceId: "redrock", title: "No import", detail: "Domestic quote only.", lane: "ai", status: "Domestic", meta: "" },
    { id: "ld-5", practiceId: "ponderosa", title: "Radiation packet", detail: "Form 2877 draft for the new sensor. A person signs.", lane: "human", status: "Needs a signature", meta: "" },
    { id: "ld-6", practiceId: "copper", title: "Registration renewal", detail: "Facility registration due Nov 2.", lane: "human", status: "Due", meta: "" },
    { id: "ld-7", practiceId: "mesa", title: "Maker vs trader", detail: "Vendor A is the maker of record. FEI on the quote.", lane: "ai", status: "Checked", meta: "" },
    { id: "ld-8", practiceId: "mesa", title: "Two SKUs missing GUDID", detail: "PO is blocked until the DI is on the line.", lane: "human", status: "Hold", meta: "" },
  ],
  "equipment:service": [
    { id: "sv-1", practiceId: "copper", title: "Op 7 chair will not recline", detail: "Reported from the desk. Warranty through Aug 2027. Fault looks like the recline motor, not a setting.", lane: "human", status: "Tech visit", meta: "Copper Canyon" },
    { id: "sv-2", practiceId: "saguaro", title: "Autoclave gasket", detail: "Parts shipped. Install is the practice's.", lane: "ai", status: "Parts sent", meta: "" },
    { id: "sv-3", practiceId: "lakeview", title: "Compressor service due", detail: "PM window Oct 24.", lane: "ai", status: "Scheduled", meta: "" },
    { id: "sv-4", practiceId: "redrock", title: "Install · 2 chairs", detail: "Waiting on the quote decision.", lane: "human", status: "Needs a human", meta: "" },
    { id: "sv-5", practiceId: "ponderosa", title: "Suction weak in Op 2", detail: "AI sent the trap-clean steps. Still open.", lane: "human", status: "Needs a visit", meta: "" },
    { id: "sv-6", practiceId: "copper", title: "Handpiece noise", detail: "Not urgent. Next PM.", lane: "ai", status: "Queued", meta: "" },
    { id: "sv-7", practiceId: "mesa", title: "Install crew hold", detail: "No install until the FDA lines clear.", lane: "human", status: "Hold", meta: "" },
    { id: "sv-8", practiceId: "lakeview", title: "Warranty lookup", detail: "Sensor, in warranty to Jan 2027.", lane: "ai", status: "Done by AI", meta: "" },
  ],
  "equipment:sales": [
    { id: "sa-1", practiceId: "ponderosa", title: "Used compressor", detail: "Taken on trade. Asking price set by a person.", lane: "human", status: "Needs a price", meta: "" },
    { id: "sa-2", practiceId: "redrock", title: "Inquiry · 2 chairs", detail: "Same thread as the quote.", lane: "ai", status: "Linked", meta: "" },
    { id: "sa-3", practiceId: "copper", title: "No resale", detail: "New site. Nothing to sell.", lane: "ai", status: "Quiet", meta: "" },
    { id: "sa-4", practiceId: "mesa", title: "No resale", detail: "Build-out.", lane: "ai", status: "Quiet", meta: "" },
    { id: "sa-5", practiceId: "saguaro", title: "Old curing light", detail: "Practice asked what it is worth.", lane: "human", status: "Needs a human", meta: "" },
    { id: "sa-6", practiceId: "lakeview", title: "Nothing listed", detail: "AI checked the register.", lane: "ai", status: "Clear", meta: "" },
    { id: "sa-7", practiceId: "redrock", title: "Lead note", detail: "Pediatric package, not a single chair.", lane: "ai", status: "Noted", meta: "" },
    { id: "sa-8", practiceId: "ponderosa", title: "Buyer intro", detail: "A person makes the introduction.", lane: "human", status: "Needs a human", meta: "" },
  ],
  "supplies:inventory": [
    { id: "in-1", practiceId: "copper", title: "Nitrile gloves, M", detail: "4 boxes on hand. Par 12. About 3 days left.", lane: "human", status: "Critical", meta: "Copper Canyon" },
    { id: "in-2", practiceId: "saguaro", title: "Saliva ejectors", detail: "Under par. On the October cart.", lane: "ai", status: "On the cart", meta: "" },
    { id: "in-3", practiceId: "lakeview", title: "Composite A2", detail: "At par.", lane: "ai", status: "Ok", meta: "" },
    { id: "in-4", practiceId: "redrock", title: "Kid bibs", detail: "2 days. AI added them to a draft cart.", lane: "ai", status: "Drafted", meta: "" },
    { id: "in-5", practiceId: "ponderosa", title: "Anesthetic", detail: "Count is from last week. Needs a fresh count.", lane: "human", status: "Needs a count", meta: "" },
    { id: "in-6", practiceId: "mesa", title: "Opening order", detail: "Not a par yet. First fill is with the build.", lane: "human", status: "Needs a human", meta: "" },
    { id: "in-7", practiceId: "copper", title: "Sterilization pouches", detail: "At par.", lane: "ai", status: "Ok", meta: "" },
    { id: "in-8", practiceId: "saguaro", title: "Whitening gel", detail: "Not a device. Domestic only. Stock is fine.", lane: "ai", status: "Ok", meta: "Not a device" },
  ],
  "supplies:cart": [
    { id: "ca-1", practiceId: "saguaro", title: "October cart · 18 lines", detail: "$2,184 versus $2,610 last month. Saves 16%. One substitution needs the dentist.", lane: "human", status: "Dentist approval", meta: "Saguaro" },
    { id: "ca-2", practiceId: "copper", title: "Glove emergency", detail: "AI built a 2-day cart. A person releases it.", lane: "human", status: "Needs a release", meta: "" },
    { id: "ca-3", practiceId: "lakeview", title: "Standing cart", detail: "Ready Friday.", lane: "ai", status: "Ready", meta: "" },
    { id: "ca-4", practiceId: "redrock", title: "Bibs + fluoride", detail: "Draft.", lane: "ai", status: "Drafted", meta: "" },
    { id: "ca-5", practiceId: "ponderosa", title: "Held for the count", detail: "Do not order anesthetic until the count lands.", lane: "human", status: "Waiting", meta: "" },
    { id: "ca-6", practiceId: "mesa", title: "Opening pallet", detail: "List is long. Lead reviews before anyone pays.", lane: "human", status: "Needs a human", meta: "" },
    { id: "ca-7", practiceId: "saguaro", title: "Substitution note", detail: "Same glove, different maker. Dentist has to say yes.", lane: "human", status: "Needs a human", meta: "" },
    { id: "ca-8", practiceId: "copper", title: "Auto par suggestion", detail: "AI would raise the glove par from 12 to 16.", lane: "human", status: "Needs a nod", meta: "" },
  ],
  "supplies:orders": [
    { id: "or-1", practiceId: "lakeview", title: "SO-1088", detail: "3 of 4 boxes arrived. Saliva ejectors backordered. ETA Oct 9.", lane: "ai", status: "Partial", meta: "Lakeview" },
    { id: "or-2", practiceId: "saguaro", title: "SO-1092", detail: "Out for delivery today.", lane: "ai", status: "Today", meta: "" },
    { id: "or-3", practiceId: "copper", title: "SO-1077", detail: "Delivered Oct 16. Count matches.", lane: "ai", status: "Delivered", meta: "" },
    { id: "or-4", practiceId: "redrock", title: "SO-1101", detail: "Held at the warehouse. Address needs a person.", lane: "human", status: "Needs a human", meta: "" },
    { id: "or-5", practiceId: "ponderosa", title: "SO-1060", detail: "Delivered. One damaged box. Credit drafted.", lane: "human", status: "Credit", meta: "" },
    { id: "or-6", practiceId: "mesa", title: "No open order", detail: "Opening pallet is not placed.", lane: "ai", status: "Clear", meta: "" },
    { id: "or-7", practiceId: "saguaro", title: "Cold pack", detail: "Temp logger in range.", lane: "ai", status: "Ok", meta: "" },
    { id: "or-8", practiceId: "lakeview", title: "Backorder note", detail: "AI told the office manager. No patient detail.", lane: "ai", status: "Sent", meta: "" },
  ],
  "supplies:catalog": [
    { id: "cat-1", title: "Glove case", detail: "Margin 28%. 3PL stock 140 cases. Lot and expiry on the record.", lane: "ai", status: "Stocked", meta: "Catalog" },
    { id: "cat-2", title: "Mask case", detail: "Fictional maker: Pinyon. FDA device listing on file.", lane: "ai", status: "Listed", meta: "" },
    { id: "cat-3", title: "Bur pack", detail: "Fictional maker: Mesa Bur Works. UDI on the inner pack.", lane: "ai", status: "Listed", meta: "" },
    { id: "cat-4", title: "Whitening gel", detail: "Not sold as a device. Domestic ship only.", lane: "human", status: "Rule", meta: "" },
    { id: "cat-5", title: "Glove, size S", detail: "Expiry inside 90 days. AI marked it do-not-pick.", lane: "ai", status: "Short-dated", meta: "" },
    { id: "cat-6", title: "Missing lot", detail: "One receipt has no lot. Receiving is blocked.", lane: "human", status: "Needs a human", meta: "" },
    { id: "cat-7", title: "Temp storage", detail: "Cold cage is at 3°C. In range.", lane: "ai", status: "Ok", meta: "" },
    { id: "cat-8", title: "New SKU request", detail: "Saguaro asked for a child-size bib. A person adds it.", lane: "human", status: "Needs a human", meta: "" },
  ],
  "supplies:benchmark": [
    { id: "bn-1", practiceId: "saguaro", title: "Saguaro · 42 SKUs", detail: "About $5,400 a year if they move to the catalog price.", lane: "human", status: "Show the owner", meta: "" },
    { id: "bn-2", practiceId: "copper", title: "Gloves", detail: "Paying above the catalog. The emergency cart uses the catalog price.", lane: "ai", status: "Flagged", meta: "" },
    { id: "bn-3", practiceId: "lakeview", title: "Close to catalog", detail: "Within 4%.", lane: "ai", status: "Ok", meta: "" },
    { id: "bn-4", practiceId: "redrock", title: "Fluoride", detail: "12% over. Alternative on the draft cart.", lane: "ai", status: "Flagged", meta: "" },
    { id: "bn-5", practiceId: "ponderosa", title: "Not enough history", detail: "Need one more month of invoices.", lane: "human", status: "Waiting", meta: "" },
    { id: "bn-6", practiceId: "mesa", title: "No spend yet", detail: "Build-out.", lane: "ai", status: "n/a", meta: "" },
    { id: "bn-7", practiceId: "saguaro", title: "Anesthetic", detail: "At the catalog price.", lane: "ai", status: "Ok", meta: "" },
    { id: "bn-8", practiceId: "copper", title: "Practice note", detail: "A person should walk the owner through the glove line, not email a dump.", lane: "human", status: "Needs a human", meta: "" },
  ],
  "staffing:reqs": [
    { id: "rq-1", practiceId: "copper", title: "Associate dentist", detail: "Open 41 days. 12 people sourced. Post drafted by AI.", lane: "human", status: "Interviewing", meta: "Copper Canyon" },
    { id: "rq-2", practiceId: "saguaro", title: "RDH", detail: "Open 9 days. Two screens this week.", lane: "ai", status: "Sourcing", meta: "Saguaro" },
    { id: "rq-3", practiceId: "redrock", title: "Dental assistant", detail: "Temp cover while a hire is found.", lane: "human", status: "Temp", meta: "" },
    { id: "rq-4", practiceId: "lakeview", title: "Front office", detail: "Req approved. Not posted.", lane: "human", status: "Needs a post", meta: "" },
    { id: "rq-5", practiceId: "ponderosa", title: "Office manager", detail: "Quiet search. A person owns the conversations.", lane: "human", status: "Needs a human", meta: "" },
    { id: "rq-6", practiceId: "mesa", title: "Opening team", detail: "Four seats sketched. Not approved.", lane: "human", status: "Needs approval", meta: "" },
    { id: "rq-7", practiceId: "copper", title: "Hygienist, Fridays", detail: "AI matched three bench profiles.", lane: "ai", status: "Matched", meta: "" },
    { id: "rq-8", practiceId: "saguaro", title: "No other seats", detail: "RDH is the only open req.", lane: "ai", status: "Clear", meta: "" },
  ],
  "staffing:pipeline": [
    { id: "pi-1", practiceId: "saguaro", title: "R. Patel · RDH", detail: "AI screen 86/100. License looks current. A person runs the conversation.", lane: "human", status: "Screen", meta: "Initials only" },
    { id: "pi-2", practiceId: "copper", title: "A. Nguyen · associate", detail: "Second conversation Thursday.", lane: "human", status: "Interview", meta: "" },
    { id: "pi-3", practiceId: "copper", title: "J. Cole · associate", detail: "Withdrew.", lane: "ai", status: "Closed", meta: "" },
    { id: "pi-4", practiceId: "redrock", title: "M. Lopez · DA", detail: "Offer drafted. See offers.", lane: "human", status: "Offer", meta: "" },
    { id: "pi-5", practiceId: "lakeview", title: "S. Brennan · front office", detail: "New. AI has not screened yet.", lane: "ai", status: "Inbox", meta: "" },
    { id: "pi-6", practiceId: "ponderosa", title: "Three quiet names", detail: "Lead has not shared them with the practice.", lane: "human", status: "Hold", meta: "" },
    { id: "pi-7", practiceId: "saguaro", title: "K. Diaz · RDH", detail: "Screen 71. Missing a reference.", lane: "human", status: "Needs a human", meta: "" },
    { id: "pi-8", practiceId: "mesa", title: "Pipeline empty", detail: "Reqs are not approved.", lane: "ai", status: "Empty", meta: "" },
  ],
  "staffing:bench": [
    { id: "be-1", title: "RDH bench", detail: "23 people. 6 can start inside two weeks.", lane: "ai", status: "Warm", meta: "Bench" },
    { id: "be-2", title: "DA bench", detail: "31 people.", lane: "ai", status: "Warm", meta: "" },
    { id: "be-3", title: "Front office bench", detail: "7 people.", lane: "ai", status: "Thin", meta: "" },
    { id: "be-4", title: "Dentist bench", detail: "4 people. All need a credential check before a name is shared.", lane: "human", status: "Check first", meta: "" },
    { id: "be-5", title: "Temp DA · Red Rock", detail: "One person can cover next week.", lane: "human", status: "Call", meta: "" },
    { id: "be-6", title: "Stale profiles", detail: "11 profiles older than 6 months. AI queued a refresh note.", lane: "ai", status: "Refresh", meta: "" },
    { id: "be-7", title: "Do not contact", detail: "2 people asked to be left off lists.", lane: "human", status: "Honored", meta: "" },
    { id: "be-8", title: "City match", detail: "Desert Springs has 4 RDH profiles.", lane: "ai", status: "Matched", meta: "" },
  ],
  "staffing:credentials": [
    { id: "cd-1", practiceId: "copper", title: "Dr. L. Okafor", detail: "AZ license on file. DEA still pending.", lane: "human", status: "Pending", meta: "Copper Canyon" },
    { id: "cd-2", practiceId: "saguaro", title: "R. Patel", detail: "License image is readable. Expiry next year.", lane: "ai", status: "Read", meta: "" },
    { id: "cd-3", practiceId: "redrock", title: "M. Lopez", detail: "BLS card expires Nov 30.", lane: "ai", status: "Flagged", meta: "" },
    { id: "cd-4", practiceId: "lakeview", title: "Radiation cert", detail: "Missing for one DA already on staff.", lane: "human", status: "Needs a human", meta: "" },
    { id: "cd-5", practiceId: "ponderosa", title: "All current", detail: "AI rechecked this morning.", lane: "ai", status: "Clear", meta: "" },
    { id: "cd-6", practiceId: "mesa", title: "Nothing to check", detail: "No hires yet.", lane: "ai", status: "n/a", meta: "" },
    { id: "cd-7", practiceId: "copper", title: "Malpractice question", detail: "A person asks the carrier. AI does not.", lane: "human", status: "Needs a human", meta: "" },
    { id: "cd-8", practiceId: "saguaro", title: "I-9 packet", detail: "Practice holds it. We only track that it exists.", lane: "ai", status: "Tracked", meta: "" },
  ],
  "staffing:ninety": [
    { id: "ny-1", practiceId: "copper", title: "M. Lopez · DA", detail: "Day 23 of 90. Training 6 of 9 modules. Sign-off still open.", lane: "human", status: "In progress", meta: "Copper Canyon" },
    { id: "ny-2", practiceId: "saguaro", title: "No one in the first 90", detail: "The RDH seat is still open.", lane: "ai", status: "Clear", meta: "" },
    { id: "ny-3", practiceId: "lakeview", title: "Front office hire", detail: "Day 61. Pulse was warm. One module left.", lane: "human", status: "Almost", meta: "" },
    { id: "ny-4", practiceId: "redrock", title: "Temp is not on a 90-day", detail: "Tracked on the req instead.", lane: "ai", status: "n/a", meta: "" },
    { id: "ny-5", practiceId: "ponderosa", title: "Hygienist day 88", detail: "Ready for the closing conversation.", lane: "human", status: "Needs a human", meta: "" },
    { id: "ny-6", practiceId: "copper", title: "Buddy assigned", detail: "Mia Santos on the practice side. Noted, not a DPCP employee.", lane: "ai", status: "Noted", meta: "" },
    { id: "ny-7", practiceId: "lakeview", title: "Day 30 pulse", detail: "Answered. No flag.", lane: "ai", status: "Done", meta: "" },
    { id: "ny-8", practiceId: "mesa", title: "Opening hires", detail: "90-day plans will start when seats are approved.", lane: "human", status: "Waiting", meta: "" },
  ],
  "staffing:offers": [
    { id: "of-1", practiceId: "redrock", title: "DA offer", detail: "Draft is in Review. A person sends it.", lane: "human", status: "Needs a signature path", meta: "" },
    { id: "of-2", practiceId: "copper", title: "Associate range", detail: "The practice owner has not picked a band. No pay figure is stored here.", lane: "human", status: "Waiting on owner", meta: "No pay data" },
    { id: "of-3", practiceId: "saguaro", title: "No offer out", detail: "Still screening.", lane: "ai", status: "Clear", meta: "" },
    { id: "of-4", practiceId: "lakeview", title: "Declined", detail: "Candidate said no. AI closed the letter.", lane: "ai", status: "Closed", meta: "" },
    { id: "of-5", practiceId: "ponderosa", title: "Agreement redline", detail: "Counsel language. A person reads it.", lane: "human", status: "Needs a human", meta: "" },
    { id: "of-6", practiceId: "mesa", title: "Nothing to offer", detail: "Reqs are drafts.", lane: "ai", status: "Clear", meta: "" },
    { id: "of-7", practiceId: "copper", title: "Start date hold", detail: "License timing.", lane: "human", status: "Hold", meta: "" },
    { id: "of-8", practiceId: "redrock", title: "Welcome note", detail: "AI drafted it. Sends after the offer is signed.", lane: "ai", status: "Drafted", meta: "" },
  ],
  "it:help": [
    { id: "hp-1", practiceId: "lakeview", title: "Front desk PC cannot open Curve", detail: "Priority 1. AI tried three steps. Remote session is the next move.", lane: "human", status: "Needs a person", meta: "Lakeview" },
    { id: "hp-2", practiceId: "copper", title: "Printer jam, Op corridor", detail: "AI sent the tray steps. Practice said it is clear.", lane: "ai", status: "Done", meta: "" },
    { id: "hp-3", practiceId: "saguaro", title: "Phone dropped two calls", detail: "Carrier test scheduled.", lane: "human", status: "Vendor", meta: "" },
    { id: "hp-4", practiceId: "redrock", title: "Wi-Fi in Op 3", detail: "AI saw one access point offline.", lane: "human", status: "Needs a visit", meta: "" },
    { id: "hp-5", practiceId: "ponderosa", title: "Dentrix slow at 8 AM", detail: "AI checked the server. Not a full disk. Watching.", lane: "ai", status: "Watching", meta: "" },
    { id: "hp-6", practiceId: "mesa", title: "No tickets", detail: "Site is not live.", lane: "ai", status: "Clear", meta: "" },
    { id: "hp-7", practiceId: "lakeview", title: "Scanner driver", detail: "Updated overnight.", lane: "ai", status: "Done by AI", meta: "" },
    { id: "hp-8", practiceId: "copper", title: "New user cannot sign in", detail: "Access request, not a break-fix. Moved to User Access.", lane: "ai", status: "Routed", meta: "" },
  ],
  "it:assets": [
    { id: "as-1", practiceId: "copper", title: "22 workstations", detail: "2 unpatched. Both are in the back office.", lane: "human", status: "Patch", meta: "Copper Canyon" },
    { id: "as-2", practiceId: "lakeview", title: "14 workstations", detail: "Current.", lane: "ai", status: "Ok", meta: "" },
    { id: "as-3", practiceId: "saguaro", title: "9 workstations", detail: "One laptop is personal. Flagged.", lane: "human", status: "Needs a human", meta: "" },
    { id: "as-4", practiceId: "redrock", title: "7 workstations", detail: "Inventory is a month old.", lane: "ai", status: "Refresh due", meta: "" },
    { id: "as-5", practiceId: "ponderosa", title: "Server", detail: "Backup succeeded last night.", lane: "ai", status: "Ok", meta: "" },
    { id: "as-6", practiceId: "mesa", title: "Nothing racked", detail: "Build list is on New Location.", lane: "ai", status: "n/a", meta: "" },
    { id: "as-7", practiceId: "copper", title: "Label printer", detail: "Serial on file.", lane: "ai", status: "Tagged", meta: "" },
    { id: "as-8", practiceId: "lakeview", title: "Spare laptop", detail: "Ready for the front desk if the Curve PC stays down.", lane: "human", status: "Offer it", meta: "" },
  ],
  "it:security": [
    { id: "se-1", title: "MFA coverage", detail: "78% against a goal of 100%. Three findings open.", lane: "human", status: "Findings", meta: "Book" },
    { id: "se-2", practiceId: "copper", title: "Shared front-desk login", detail: "The desk app is replacing it. Old login still exists.", lane: "human", status: "Needs a human", meta: "" },
    { id: "se-3", practiceId: "lakeview", title: "MFA on", detail: "Practice side is covered.", lane: "ai", status: "Ok", meta: "" },
    { id: "se-4", practiceId: "saguaro", title: "One stale admin", detail: "A person removes it.", lane: "human", status: "Remove", meta: "" },
    { id: "se-5", practiceId: "ponderosa", title: "Backup test", detail: "Restore test passed Oct 12.", lane: "ai", status: "Passed", meta: "" },
    { id: "se-6", practiceId: "redrock", title: "Finding: open share", detail: "AI drafted the close steps.", lane: "human", status: "Needs a human", meta: "" },
    { id: "se-7", title: "No PHI in this queue", detail: "Tickets stay on devices and access. Chart data stays in the PMS.", lane: "ai", status: "Rule", meta: "" },
    { id: "se-8", practiceId: "mesa", title: "Security design", detail: "Part of the IT build.", lane: "human", status: "In design", meta: "" },
  ],
  "it:access": [
    { id: "ac-1", practiceId: "copper", title: "New DA", detail: "PMS user requested. A person creates it in Open Dental.", lane: "human", status: "Needs a human", meta: "" },
    { id: "ac-2", practiceId: "lakeview", title: "Leaver", detail: "Access list drafted. Waiting on the office manager to confirm the last day.", lane: "human", status: "Confirm", meta: "" },
    { id: "ac-3", practiceId: "saguaro", title: "Vendor remote", detail: "Window closed last night.", lane: "ai", status: "Closed", meta: "" },
    { id: "ac-4", practiceId: "redrock", title: "Shared kiosk", detail: "The desk app is the sign-in. No personal settings.", lane: "ai", status: "By design", meta: "" },
    { id: "ac-5", practiceId: "ponderosa", title: "Dentrix users", detail: "8 active. Matches the staff list.", lane: "ai", status: "Matched", meta: "" },
    { id: "ac-6", practiceId: "mesa", title: "No users yet", detail: "Build.", lane: "ai", status: "n/a", meta: "" },
    { id: "ac-7", practiceId: "copper", title: "Owner mailbox", detail: "Separate from the desk. Not stored here.", lane: "human", status: "Out of band", meta: "" },
    { id: "ac-8", practiceId: "lakeview", title: "MFA reset", detail: "AI sent the reset. The person finishes it.", lane: "human", status: "With the user", meta: "" },
  ],
  "it:build": [
    { id: "bu-1", practiceId: "mesa", title: "ISP · Oct 21", detail: "28 of 34 drops are live.", lane: "human", status: "In progress", meta: "Mesa Verde" },
    { id: "bu-2", practiceId: "mesa", title: "Server room", detail: "Cooling is a facilities item.", lane: "human", status: "Linked", meta: "" },
    { id: "bu-3", practiceId: "mesa", title: "PMS choice", detail: "Open Dental. License not ordered.", lane: "human", status: "Needs a human", meta: "" },
    { id: "bu-4", practiceId: "mesa", title: "Phone draft", detail: "AI drafted the extension list.", lane: "ai", status: "Drafted", meta: "" },
    { id: "bu-5", practiceId: "copper", title: "Build closed", detail: "Opened 6 weeks ago.", lane: "ai", status: "Done", meta: "" },
    { id: "bu-6", practiceId: "ponderosa", title: "No build", detail: "Integration only.", lane: "ai", status: "n/a", meta: "" },
    { id: "bu-7", practiceId: "mesa", title: "Camera plan", detail: "A person walks the layout before anyone orders.", lane: "human", status: "Site walk", meta: "" },
    { id: "bu-8", practiceId: "mesa", title: "Go-live list", detail: "34 lines. 19 done.", lane: "ai", status: "19/34", meta: "" },
  ],
  "accounting:close": [
    { id: "mc-1", practiceId: "copper", title: "Copper Canyon · September", detail: "6 of 7 steps. Bank rec is the one still open.", lane: "human", status: "6/7", meta: "" },
    { id: "mc-2", practiceId: "saguaro", title: "Saguaro · September", detail: "4 of 7. Waiting on two practice statements.", lane: "human", status: "4/7", meta: "" },
    { id: "mc-3", practiceId: "lakeview", title: "Lakeview · September", detail: "Closed.", lane: "ai", status: "Closed", meta: "" },
    { id: "mc-4", practiceId: "ponderosa", title: "Ponderosa · September", detail: "Books are on the acquired entity. Mapping is open.", lane: "human", status: "Mapping", meta: "" },
    { id: "mc-5", practiceId: "redrock", title: "Red Rock · September", detail: "5 of 7.", lane: "human", status: "5/7", meta: "" },
    { id: "mc-6", practiceId: "mesa", title: "Mesa Verde", detail: "No close. Not operating.", lane: "ai", status: "n/a", meta: "" },
    { id: "mc-7", practiceId: "saguaro", title: "Late posting", detail: "Same $3,900 the insurance report flagged.", lane: "ai", status: "Linked", meta: "" },
    { id: "mc-8", practiceId: "copper", title: "Audit badge", detail: "Read-only. The independent check has not flagged this close.", lane: "ai", status: "Audit clear", meta: "Not a screen of its own" },
  ],
  "accounting:pnl": [
    { id: "pnl-1", practiceId: "saguaro", title: "Saguaro · September", detail: "Collections $310,000. Cost of producing dentistry 23.7%. Operating 33.5%. Growth 6.5%. 4-wall 36.3%.", lane: "human", status: "In Review", meta: "Five sections" },
    { id: "pnl-2", practiceId: "copper", title: "Copper Canyon · September", detail: "First month. 4-wall is not stable yet. AI will not call it a trend.", lane: "ai", status: "Drafted", meta: "" },
    { id: "pnl-3", practiceId: "lakeview", title: "Lakeview · September", detail: "4-wall 31%. Growth spend is the question for the owner.", lane: "human", status: "Needs a human", meta: "" },
    { id: "pnl-4", practiceId: "ponderosa", title: "Preliminary", detail: "Do not send. Mapping is open.", lane: "human", status: "Hold", meta: "" },
    { id: "pnl-5", practiceId: "redrock", title: "Red Rock · September", detail: "Drafted. No personal pay lines. Associate cost is a ratio only.", lane: "ai", status: "Drafted", meta: "No pay data" },
    { id: "pnl-6", practiceId: "mesa", title: "No P&L", detail: "Pre-open.", lane: "ai", status: "n/a", meta: "" },
    { id: "pnl-7", practiceId: "saguaro", title: "Summary paragraph", detail: "AI wrote it. Elena approves before it goes to the owner.", lane: "human", status: "Needs a human", meta: "" },
    { id: "pnl-8", practiceId: "copper", title: "Owner pack", detail: "Not sent. The practice is still in its first quarter.", lane: "ai", status: "Held", meta: "" },
  ],
  "accounting:payments": [
    { id: "pay-1", practiceId: "saguaro", title: "Lab invoice $4,820", detail: "New payee bank details. Needs a call-back. AI will not release it.", lane: "human", status: "New payee", meta: "" },
    { id: "pay-2", practiceId: "copper", title: "Waste pickup $186", detail: "Known payee. Under the line a lead can release.", lane: "human", status: "Lead can release", meta: "" },
    { id: "pay-3", practiceId: "lakeview", title: "Software renewal", detail: "On the approved list.", lane: "ai", status: "Queued", meta: "" },
    { id: "pay-4", practiceId: "ponderosa", title: "Rent", detail: "Recurring. A person still confirms the month.", lane: "human", status: "Confirm", meta: "" },
    { id: "pay-5", practiceId: "redrock", title: "Supplies transfer", detail: "Internal. No bank change.", lane: "ai", status: "Matched", meta: "" },
    { id: "pay-6", practiceId: "mesa", title: "Deposit question", detail: "Lives on George's decision list, not here as a private balance.", lane: "human", status: "Owner of the company", meta: "" },
    { id: "pay-7", practiceId: "saguaro", title: "Duplicate check", detail: "AI caught a second copy of the lab bill.", lane: "ai", status: "Caught", meta: "" },
    { id: "pay-8", practiceId: "copper", title: "Utility", detail: "Amount matches last month within 4%.", lane: "ai", status: "Matched", meta: "" },
  ],
  "accounting:kpi": [
    { id: "kp-1", practiceId: "saguaro", title: "Overhead ratio", detail: "33.5% operating. Goal under 35%.", lane: "ai", status: "Inside goal", meta: "" },
    { id: "kp-2", practiceId: "copper", title: "New practice", detail: "Do not benchmark a 6-week site against a mature one.", lane: "human", status: "Judgment", meta: "" },
    { id: "kp-3", practiceId: "lakeview", title: "Lab ratio", detail: "A point over the book. Worth a look, not an alarm.", lane: "ai", status: "Watch", meta: "" },
    { id: "kp-4", practiceId: "redrock", title: "Hygiene mix", detail: "Healthy for a pediatric book.", lane: "ai", status: "Ok", meta: "" },
    { id: "kp-5", practiceId: "ponderosa", title: "Incomplete", detail: "Waiting on the map.", lane: "human", status: "Blocked", meta: "" },
    { id: "kp-6", practiceId: "saguaro", title: "Growth spend", detail: "6.5%. Marketing will recognize the number.", lane: "ai", status: "Shared", meta: "" },
    { id: "kp-7", practiceId: "lakeview", title: "4-wall", detail: "31% versus a 35% goal.", lane: "human", status: "Needs a human", meta: "" },
    { id: "kp-8", practiceId: "copper", title: "Staffing ratio", detail: "Shown as a percent of collections. No salaries.", lane: "ai", status: "Ratio only", meta: "" },
  ],
  "accounting:collections": [
    { id: "co-1", practiceId: "saguaro", title: "October invoice", detail: "Drafted. Insurance + supplies lines.", lane: "human", status: "Needs a send", meta: "What we bill the practice" },
    { id: "co-2", practiceId: "lakeview", title: "October invoice", detail: "Sent. Not past due.", lane: "ai", status: "Sent", meta: "" },
    { id: "co-3", practiceId: "redrock", title: "September", detail: "Paid.", lane: "ai", status: "Paid", meta: "" },
    { id: "co-4", practiceId: "ponderosa", title: "Hold", detail: "Integration month. Lead decides whether to bill.", lane: "human", status: "Needs a human", meta: "" },
    { id: "co-5", practiceId: "copper", title: "HDG", detail: "Not a client invoice. Internal.", lane: "ai", status: "Internal", meta: "" },
    { id: "co-6", practiceId: "mesa", title: "Not billing", detail: "Pre-open.", lane: "ai", status: "n/a", meta: "" },
    { id: "co-7", practiceId: "saguaro", title: "Dispute note", detail: "None.", lane: "ai", status: "Clear", meta: "" },
    { id: "co-8", practiceId: "lakeview", title: "Past due watch", detail: "Nothing over 30.", lane: "ai", status: "Clear", meta: "" },
  ],
  "marketing:performance": [
    { id: "pf-1", practiceId: "saguaro", title: "Saguaro", detail: "64 leads. 29 booked. 21 seen. $96 per new patient. Call: scale.", lane: "human", status: "Scale", meta: "" },
    { id: "pf-2", practiceId: "copper", title: "Copper Canyon", detail: "Tracking gap. Do not scale spend until the pixel is trusted.", lane: "human", status: "Fix first", meta: "" },
    { id: "pf-3", practiceId: "lakeview", title: "Lakeview", detail: "Steady. Hold spend.", lane: "ai", status: "Hold", meta: "" },
    { id: "pf-4", practiceId: "redrock", title: "Red Rock", detail: "Pediatric searches are working. Cost is inside the goal.", lane: "ai", status: "Hold", meta: "" },
    { id: "pf-5", practiceId: "ponderosa", title: "Ponderosa", detail: "Campaigns paused for the integration.", lane: "human", status: "Paused", meta: "" },
    { id: "pf-6", practiceId: "mesa", title: "Mesa Verde", detail: "No public page until the open date is real.", lane: "human", status: "Hold", meta: "" },
    { id: "pf-7", practiceId: "saguaro", title: "Source mix", detail: "AI grouped calls, forms, and walk-ins.", lane: "ai", status: "Grouped", meta: "" },
    { id: "pf-8", practiceId: "copper", title: "New site burst", detail: "Awareness only. A person approves any offer.", lane: "human", status: "Needs a human", meta: "" },
  ],
  "marketing:snapshots": [
    { id: "sn-1", practiceId: "lakeview", title: "Week of Sep 28", detail: "Draft ready. 3 of 4 practices were sent. Lakeview is the one still here.", lane: "human", status: "In Review", meta: "" },
    { id: "sn-2", practiceId: "saguaro", title: "September monthly", detail: "Sent.", lane: "ai", status: "Sent", meta: "" },
    { id: "sn-3", practiceId: "copper", title: "Week of Sep 28", detail: "Sent, with the tracking caveat in the first line.", lane: "ai", status: "Sent", meta: "" },
    { id: "sn-4", practiceId: "redrock", title: "Week of Sep 28", detail: "Sent.", lane: "ai", status: "Sent", meta: "" },
    { id: "sn-5", practiceId: "ponderosa", title: "Skipped", detail: "Paused account. A person told the practice.", lane: "human", status: "Told them", meta: "" },
    { id: "sn-6", practiceId: "saguaro", title: "This week", detail: "AI is assembling it. Not ready.", lane: "ai", status: "Working", meta: "" },
    { id: "sn-7", practiceId: "lakeview", title: "Owner questions", detail: "Two questions from last month are still open.", lane: "human", status: "Needs a human", meta: "" },
    { id: "sn-8", practiceId: "mesa", title: "No snapshot", detail: "Pre-open.", lane: "ai", status: "n/a", meta: "" },
  ],
  "marketing:tracking": [
    { id: "tr-1", practiceId: "saguaro", title: "Saguaro · 5/5", detail: "Call, form, pixel, landing, CRM match. All green.", lane: "ai", status: "Green", meta: "" },
    { id: "tr-2", practiceId: "copper", title: "Copper Canyon · gap", detail: "Form lands. The visit is not marked back. Fix before spend.", lane: "human", status: "Fix", meta: "" },
    { id: "tr-3", practiceId: "lakeview", title: "Lakeview · 4/5", detail: "Call recording disclaimer is the missing piece.", lane: "human", status: "Needs a human", meta: "" },
    { id: "tr-4", practiceId: "redrock", title: "Red Rock · 5/5", detail: "Green.", lane: "ai", status: "Green", meta: "" },
    { id: "tr-5", practiceId: "ponderosa", title: "Off", detail: "Paused.", lane: "ai", status: "Off", meta: "" },
    { id: "tr-6", practiceId: "mesa", title: "Not installed", detail: "Waiting on the page.", lane: "ai", status: "n/a", meta: "" },
    { id: "tr-7", practiceId: "saguaro", title: "Duplicate pixel", detail: "AI found one and drafted the removal.", lane: "human", status: "Approve removal", meta: "" },
    { id: "tr-8", practiceId: "copper", title: "Desk marks", detail: "Front desk is marking scheduled and seen. That feed is new.", lane: "ai", status: "Connected", meta: "" },
  ],
  "marketing:match": [
    { id: "ma-1", practiceId: "saguaro", title: "Week 40", detail: "47 calls. 31 marked. 19 scheduled. 12 seen.", lane: "human", status: "Gap of 16", meta: "Saguaro" },
    { id: "ma-2", practiceId: "copper", title: "Week 40", detail: "22 calls. 9 marked. Tracking gap explains the rest.", lane: "human", status: "Fix", meta: "" },
    { id: "ma-3", practiceId: "lakeview", title: "Week 40", detail: "30 calls. 27 marked.", lane: "ai", status: "Close", meta: "" },
    { id: "ma-4", practiceId: "redrock", title: "Week 40", detail: "18 calls. 16 marked. 11 seen.", lane: "ai", status: "Close", meta: "" },
    { id: "ma-5", practiceId: "saguaro", title: "J.R. · marked seen", detail: "Initials only. Matched to a Tuesday call.", lane: "ai", status: "Matched", meta: "" },
    { id: "ma-6", practiceId: "saguaro", title: "Unmatched call · 4:10 PM", detail: "No desk mark. A person can ask the front desk, not the patient record.", lane: "human", status: "Ask the desk", meta: "" },
    { id: "ma-7", practiceId: "ponderosa", title: "No calls", detail: "Paused.", lane: "ai", status: "Off", meta: "" },
    { id: "ma-8", practiceId: "mesa", title: "No calls", detail: "Pre-open.", lane: "ai", status: "n/a", meta: "" },
  ],
  "marketing:weekboard": [
    { id: "wb-1", practiceId: "saguaro", title: "Offers", detail: "This week's check: offer still matches the page.", lane: "ai", status: "Checked", meta: "Weekboard" },
    { id: "wb-2", practiceId: "saguaro", title: "Search terms", detail: "Three terms wasted spend. A person pauses them.", lane: "human", status: "Needs a human", meta: "" },
    { id: "wb-3", practiceId: "lakeview", title: "Creative", detail: "Refresh is due. Draft is in the page builder.", lane: "human", status: "Draft", meta: "" },
    { id: "wb-4", practiceId: "copper", title: "Pixel", detail: "Blocked on the tracking fix.", lane: "human", status: "Blocked", meta: "" },
    { id: "wb-5", practiceId: "redrock", title: "Budget", detail: "Inside the band. No change.", lane: "ai", status: "Hold", meta: "" },
    { id: "wb-6", practiceId: "ponderosa", title: "Paused", detail: "Weekboard is off.", lane: "ai", status: "Off", meta: "" },
    { id: "wb-7", practiceId: "saguaro", title: "Landing speed", detail: "AI measured 2.1s. Fine.", lane: "ai", status: "Ok", meta: "" },
    { id: "wb-8", practiceId: "lakeview", title: "Call answer rate", detail: "Missed 4 calls at lunch. A person tells the office.", lane: "human", status: "Tell them", meta: "" },
  ],
  "marketing:pages": [
    { id: "pg-1", practiceId: "lakeview", title: "Implant page", detail: "Draft. A person approves the clinical wording.", lane: "human", status: "Needs a human", meta: "" },
    { id: "pg-2", practiceId: "saguaro", title: "New patient page", detail: "Live. No change this week.", lane: "ai", status: "Live", meta: "" },
    { id: "pg-3", practiceId: "copper", title: "Grand opening", detail: "Copy is ready. Photo still needed from the practice.", lane: "human", status: "Waiting on you", meta: "" },
    { id: "pg-4", practiceId: "redrock", title: "Kids' visit", detail: "Live.", lane: "ai", status: "Live", meta: "" },
    { id: "pg-5", practiceId: "mesa", title: "Coming soon", detail: "Not published. Open date is not final.", lane: "human", status: "Hold", meta: "" },
    { id: "pg-6", practiceId: "ponderosa", title: "Name change", detail: "Old name still on one heading. AI marked it.", lane: "human", status: "Fix", meta: "" },
    { id: "pg-7", practiceId: "saguaro", title: "Blog draft", detail: "Insurance myths. No patient stories.", lane: "ai", status: "Drafted", meta: "" },
    { id: "pg-8", practiceId: "lakeview", title: "Form test", detail: "AI submitted a test lead and deleted it.", lane: "ai", status: "Passed", meta: "" },
  ],
  "marketing:reputation": [
    { id: "rp-1", practiceId: "saguaro", title: "New 5-star", detail: "Flagged. We do not reply on Google.", lane: "ai", status: "Flagged", meta: "" },
    { id: "rp-2", practiceId: "lakeview", title: "New 2-star", detail: "Wait time. A person may call the office. No public reply from us.", lane: "human", status: "Needs a human", meta: "" },
    { id: "rp-3", practiceId: "copper", title: "No new reviews", detail: "AI checked this morning.", lane: "ai", status: "Clear", meta: "" },
    { id: "rp-4", practiceId: "redrock", title: "New 5-star", detail: "Flagged for the owner.", lane: "ai", status: "Flagged", meta: "" },
    { id: "rp-5", practiceId: "ponderosa", title: "Old name in a review", detail: "Noted. We do not edit public reviews.", lane: "human", status: "Noted", meta: "" },
    { id: "rp-6", practiceId: "saguaro", title: "Ask-for-review card", detail: "Front desk has it. Not automated to patients.", lane: "ai", status: "In the office", meta: "" },
    { id: "rp-7", practiceId: "lakeview", title: "Response draft", detail: "Kept internal. Not posted.", lane: "human", status: "Do not post", meta: "" },
    { id: "rp-8", practiceId: "mesa", title: "No profile yet", detail: "Create it when the open date is real.", lane: "human", status: "Later", meta: "" },
  ],
  "construction:pipeline": [
    { id: "sp-1", practiceId: "mesa", title: "Mesa Verde · Sunvale", detail: "15 rooms, scalable to 20. Stage: layout. Three gates: doctor fit, FDA room clearance, layout sign-off. Landlord TI asked at $10/sf, offer on the table is $0. Gate is not met.", lane: "human", status: "Gate open", meta: "Portfolio" },
    { id: "sp-2", practiceId: "copper", title: "Copper Canyon", detail: "Open. Warranty and facilities only.", lane: "ai", status: "Live", meta: "" },
    { id: "sp-3", practiceId: "ponderosa", title: "Small remodel", detail: "Sterilization closet. Stage: quotes.", lane: "human", status: "Quotes", meta: "" },
    { id: "sp-4", practiceId: "saguaro", title: "No project", detail: "Facilities only.", lane: "ai", status: "Quiet", meta: "" },
    { id: "sp-5", practiceId: "lakeview", title: "No project", detail: "Facilities only.", lane: "ai", status: "Quiet", meta: "" },
    { id: "sp-6", practiceId: "redrock", title: "Two-chair add", detail: "Waiting on the equipment quote.", lane: "human", status: "Linked", meta: "" },
    { id: "sp-7", practiceId: "mesa", title: "Doctor fit", detail: "Not signed. A person walks it with the owner.", lane: "human", status: "Gate", meta: "" },
    { id: "sp-8", practiceId: "mesa", title: "FDA clearance", detail: "Room uses are listed. Sign-off is a person.", lane: "human", status: "Gate", meta: "" },
  ],
  "construction:bid": [
    { id: "bd-1", practiceId: "mesa", title: "Simulated GC bid", detail: "$412,000. Actual cash so far $96,400. Barter $38,200.", lane: "human", status: "In Review", meta: "Mesa Verde" },
    { id: "bd-2", practiceId: "mesa", title: "Painting", detail: "Market $31,000. Actual $5,800 with barter labor.", lane: "ai", status: "Compared", meta: "" },
    { id: "bd-3", practiceId: "mesa", title: "Electrical", detail: "85% complete against the simulated bid.", lane: "ai", status: "85%", meta: "" },
    { id: "bd-4", practiceId: "ponderosa", title: "Closet", detail: "Three small bids. A person picks.", lane: "human", status: "Pick", meta: "" },
    { id: "bd-5", practiceId: "redrock", title: "Not a GC bid", detail: "Equipment only.", lane: "ai", status: "n/a", meta: "" },
    { id: "bd-6", practiceId: "mesa", title: "Contingency", detail: "8% left. AI will not move it.", lane: "human", status: "Needs a human", meta: "" },
    { id: "bd-7", practiceId: "copper", title: "Closed", detail: "Final cost is in the archive.", lane: "ai", status: "Closed", meta: "" },
    { id: "bd-8", practiceId: "mesa", title: "Landlord TI", detail: "$0 on offer versus $10/sf asked. Negotiation stays with a person.", lane: "human", status: "Negotiate", meta: "" },
  ],
  "construction:trades": [
    { id: "td-1", practiceId: "mesa", title: "Electrical", detail: "85%. Crew on site tomorrow.", lane: "ai", status: "On site", meta: "" },
    { id: "td-2", practiceId: "mesa", title: "Plumbing", detail: "Quotes 2 of 3. Rough-in inspection Oct 14.", lane: "human", status: "Inspection", meta: "" },
    { id: "td-3", practiceId: "mesa", title: "Painting", detail: "Barter crew. Start after drywall.", lane: "ai", status: "Scheduled", meta: "" },
    { id: "td-4", practiceId: "ponderosa", title: "Closet demo", detail: "After hours. A person confirms the night.", lane: "human", status: "Confirm", meta: "" },
    { id: "td-5", practiceId: "mesa", title: "Inspection risk", detail: "14-day alert is quiet. 7-day alert fires Oct 7.", lane: "ai", status: "Watching", meta: "" },
    { id: "td-6", practiceId: "copper", title: "No trades", detail: "Open site.", lane: "ai", status: "Clear", meta: "" },
    { id: "td-7", practiceId: "mesa", title: "Flooring", detail: "Not started. Blocked on the layout gate.", lane: "human", status: "Blocked", meta: "" },
    { id: "td-8", practiceId: "redrock", title: "No trades", detail: "Waiting on chairs.", lane: "ai", status: "Waiting", meta: "" },
  ],
  "construction:barter": [
    { id: "ba-1", title: "Participants", detail: "14 practices in the program.", lane: "ai", status: "14", meta: "Ledger" },
    { id: "ba-2", practiceId: "mesa", title: "Credits used", detail: "$38,200 against a $60,000 ceiling.", lane: "ai", status: "Under ceiling", meta: "" },
    { id: "ba-3", practiceId: "mesa", title: "Painting credit", detail: "A person commits the next block. AI does not.", lane: "human", status: "Needs a commitment", meta: "" },
    { id: "ba-4", practiceId: "copper", title: "No barter", detail: "De novo was paid work.", lane: "ai", status: "n/a", meta: "" },
    { id: "ba-5", practiceId: "ponderosa", title: "Small credit", detail: "$1,200 available. Not assigned.", lane: "human", status: "Open", meta: "" },
    { id: "ba-6", title: "Accounting question", detail: "How to book the credit is not decided. Nothing here posts a journal entry.", lane: "human", status: "Open question", meta: "" },
    { id: "ba-7", practiceId: "saguaro", title: "Not in the program", detail: "Client sites can see the idea. They do not see HDG terms.", lane: "ai", status: "Hidden terms", meta: "" },
    { id: "ba-8", practiceId: "mesa", title: "Next work", detail: "Ceiling tile. Estimate drafted.", lane: "ai", status: "Drafted", meta: "" },
  ],
  "construction:drawings": [
    { id: "dr-1", practiceId: "mesa", title: "Layout v3", detail: "Sign-off gate is open. Owner has not initialed.", lane: "human", status: "Sign-off", meta: "" },
    { id: "dr-2", practiceId: "mesa", title: "Sterile flow", detail: "AI marked a cross from dirty to clean. A designer answers.", lane: "human", status: "Question", meta: "" },
    { id: "dr-3", practiceId: "ponderosa", title: "Closet sketch", detail: "Enough for quotes. Not a permit set.", lane: "ai", status: "Sketch", meta: "" },
    { id: "dr-4", practiceId: "copper", title: "As-built", detail: "Filed.", lane: "ai", status: "Filed", meta: "" },
    { id: "dr-5", practiceId: "mesa", title: "Change", detail: "Op count 15, shell can take 20. Noted on the sheet.", lane: "ai", status: "Noted", meta: "" },
    { id: "dr-6", practiceId: "redrock", title: "No drawings", detail: "Equipment placement only.", lane: "ai", status: "n/a", meta: "" },
    { id: "dr-7", practiceId: "mesa", title: "Aesthetic", detail: "Finish board waits on George or the practice owner.", lane: "human", status: "Needs a human", meta: "" },
    { id: "dr-8", practiceId: "mesa", title: "PDF set", detail: "Stored. No PHI.", lane: "ai", status: "Stored", meta: "" },
  ],
  "construction:facilities": [
    { id: "fa-1", practiceId: "copper", title: "Water under the sterilization sink", detail: "Plumber at 2:00 PM. Photo is on the request.", lane: "human", status: "Today", meta: "Copper Canyon" },
    { id: "fa-2", practiceId: "copper", title: "HVAC filter", detail: "Due Oct 15. AI put it on the list.", lane: "ai", status: "Due", meta: "" },
    { id: "fa-3", practiceId: "saguaro", title: "Door closer", detail: "Not urgent. This week.", lane: "ai", status: "Queued", meta: "" },
    { id: "fa-4", practiceId: "lakeview", title: "Light ballast, Op 4", detail: "Parts ordered.", lane: "ai", status: "Parts", meta: "" },
    { id: "fa-5", practiceId: "redrock", title: "Waiting room chair", detail: "Loose leg. A person tightens or replaces.", lane: "human", status: "Needs a human", meta: "" },
    { id: "fa-6", practiceId: "ponderosa", title: "No open orders", detail: "AI checked.", lane: "ai", status: "Clear", meta: "" },
    { id: "fa-7", practiceId: "mesa", title: "Site, not facilities", detail: "Lives on the pipeline.", lane: "ai", status: "Routed", meta: "" },
    { id: "fa-8", practiceId: "copper", title: "After-hours alarm", detail: "False trip yesterday. Company called. A person should still hear why.", lane: "human", status: "Follow up", meta: "" },
  ],
};

export function rowsFor(copilot: CopilotId, moduleId: string): WorkRow[] {
  const key = `${copilot}:${moduleId}`;
  const hero = HERO[key] ?? [];
  const rows = [...hero];
  let n = 0;
  while (rows.length < 10) {
    const practice = PRACTICES[n % PRACTICES.length];
    rows.push({
      id: `${key}-pad-${n}`,
      practiceId: practice.id,
      title: `${practice.name} · follow-up ${n + 1}`,
      detail: "Sample line so the queue can be scanned. A person still owns the judgment.",
      lane: n % 3 === 0 ? "human" : "ai",
      status: n % 3 === 0 ? "Needs a human" : "Done by AI",
    });
    n += 1;
  }
  return rows;
}

export const CATEGORIES = [
  "Equipment",
  "Supplies",
  "Insurance/billing",
  "IT",
  "Building",
  "Staffing/HR",
  "Accounting",
  "Marketing",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function routeCategory(category: Category, text: string): { copilot: CopilotId | "operations"; aiFirst: boolean; label: string } {
  const t = text.toLowerCase();
  if (category === "Equipment" || t.includes("recline") || t.includes("chair")) return { copilot: "equipment", aiFirst: true, label: "Equipment" };
  if (category === "Supplies" || t.includes("glove") || t.includes("order")) return { copilot: "supplies", aiFirst: true, label: "Supplies" };
  if (category === "Insurance/billing" || t.includes("denied") || t.includes("crown") || t.includes("insurance")) return { copilot: "insurance", aiFirst: true, label: "Insurance" };
  if (category === "IT") return { copilot: "it", aiFirst: true, label: "IT" };
  if (category === "Building") return { copilot: "construction", aiFirst: true, label: "Construction" };
  if (category === "Staffing/HR") return { copilot: "staffing", aiFirst: false, label: "Staffing" };
  if (category === "Accounting") return { copilot: "accounting", aiFirst: true, label: "Accounting" };
  if (category === "Marketing") return { copilot: "marketing", aiFirst: true, label: "Marketing" };
  return { copilot: "operations", aiFirst: false, label: "Operations" };
}

export const APPEAL_V1 = `Aetna appeals
Claim 88-1042 · D2740 ×2 · $2,860
Practice: Saguaro Family Dental

We are asking Aetna to look again. The denial cites a frequency limitation. The prior crown on this tooth sits outside that window. Please reprocess and send the reference number.

Prepared from the denial reason. Chart detail stays in Eaglesoft.`;

export const APPEAL_V2 = `Aetna appeals
Claim 88-1042 · D2740 ×2 · $2,860
Practice: Saguaro Family Dental

We are asking Aetna to look again. The denial cites a frequency limitation. The prior crown was placed in March 2014, outside Aetna's 5-year window. Perio notes in the practice system (initials J.R.) show the tooth still needs full coverage. Please reprocess and send the reference number.

Prepared from the denial reason and the reviewer's note. Chart detail stays in Eaglesoft.`;

export const PATIENT_NOTE = "We found the denial and sent an appeal. We'll update you when the payer responds.";

export const CHAIR_AI = "Checked the chair history for Op 7. The recline fault matches a motor code, not a setting someone can toggle. Warranty runs through Aug 2027. A tech visit is the right next step. No part order yet.";

export interface LoadStat {
  personId: string;
  open: number;
  due: number;
  overdue: number;
  blocker?: string;
  first: string;
  done: string;
  sla: string;
  out?: string;
  cover?: string;
  onTime: string;
}

export const LOADS: LoadStat[] = [
  { personId: "nadia", open: 6, due: 2, overdue: 0, first: "18 min", done: "6 h", sla: "0", onTime: "88%" },
  { personId: "omar", open: 4, due: 1, overdue: 0, blocker: "Imran is waiting on a practice document", first: "22 min", done: "9 h", sla: "0", onTime: "91%" },
  { personId: "imran", open: 5, due: 2, overdue: 1, blocker: "Practice has not sent the EOB copy", first: "40 min", done: "1.5 d", sla: "1", onTime: "74%" },
  { personId: "sana", open: 3, due: 1, overdue: 0, first: "15 min", done: "5 h", sla: "0", onTime: "90%" },
  { personId: "faisal", open: 4, due: 3, overdue: 0, first: "25 min", done: "7 h", sla: "0", out: "Covers Hina's urgent AR", onTime: "86%" },
  { personId: "hina", open: 2, due: 0, overdue: 0, first: "—", done: "—", sla: "0", out: "Out today", cover: "Faisal Adeyemi", onTime: "84%" },
  { personId: "theo", open: 5, due: 2, overdue: 1, blocker: "Two SKUs still missing a GUDID", first: "2 h", done: "2 d", sla: "1", onTime: "71%" },
  { personId: "jonas", open: 4, due: 1, overdue: 0, first: "30 min", done: "8 h", sla: "0", onTime: "80%" },
  { personId: "amina", open: 3, due: 1, overdue: 0, blocker: "Associate offer is waiting on the practice owner", first: "1 h", done: "3 d", sla: "1", onTime: "88%" },
  { personId: "priya", open: 6, due: 2, overdue: 1, blocker: "Copper Canyon tracking gap", first: "35 min", done: "1 d", sla: "1", onTime: "76%" },
  { personId: "elena", open: 3, due: 2, overdue: 0, first: "20 min", done: "5 h", sla: "0", onTime: "94%" },
  { personId: "rowan", open: 7, due: 3, overdue: 1, blocker: "Mesa Verde layout is unsigned", first: "45 min", done: "2 d", sla: "1", onTime: "83%" },
];

export const SLOW_LINE = "Construction is the slowest department this week. Mesa Verde is waiting on a layout signature, so trades cannot start the next phase.";

export interface OwnerSnap {
  practiceId: string;
  collections: string;
  collectionsGoal: string;
  collectionsTrend: "up" | "down" | "flat";
  ar: string;
  arGoal: string;
  arTrend: "up" | "down" | "flat";
  newPatients: string;
  npGoal: string;
  npTrend: "up" | "down" | "flat";
  cost: string;
  costGoal: string;
  costTrend: "up" | "down" | "flat";
  roles: string;
  lists: string;
  building: string;
  handling: string[];
  needs: string[];
}

export const OWNER_SNAPS: OwnerSnap[] = [
  {
    practiceId: "copper",
    collections: "$71,200",
    collectionsGoal: "$80,000",
    collectionsTrend: "up",
    ar: "$6,200",
    arGoal: "Under $8,000",
    arTrend: "down",
    newPatients: "18",
    npGoal: "20",
    npTrend: "up",
    cost: "Tracking gap",
    costGoal: "Trusted pixel",
    costTrend: "flat",
    roles: "1 associate open",
    lists: "Open-the-day 80% this week",
    building: "Op 7 chair · sink drip",
    handling: [
      "Insurance: 186 verifications, 2 appeals, $4,200 recovered",
      "Supplies: glove par is critical · a cart is waiting on you",
      "Equipment: Op 7 diagnosed, visit not set yet",
      "IT: 4 tickets resolved",
    ],
    needs: ["Approve the glove substitution", "MetLife is missing a malpractice COI for Dr. A. Mendez"],
  },
  {
    practiceId: "saguaro",
    collections: "$118,900",
    collectionsGoal: "$130,000",
    collectionsTrend: "up",
    ar: "$21,400",
    arGoal: "Under $12,000",
    arTrend: "down",
    newPatients: "21",
    npGoal: "24",
    npTrend: "up",
    cost: "$96",
    costGoal: "Under $110",
    costTrend: "up",
    roles: "1 RDH open",
    lists: "Open-the-day 100% today",
    building: "Door closer, not urgent",
    handling: [
      "Insurance: 412 verifications, 9 appeals, $18,400 recovered",
      "Supplies: saved $460 on the October cart",
      "Marketing: 21 new patients seen",
      "IT: 11 tickets resolved",
    ],
    needs: ["Approve one supply substitution on the October cart"],
  },
];

export const BUILD_STAGES = [
  "Lead",
  "Shortlist",
  "Doctor fit",
  "Lease",
  "LOI",
  "Layout",
  "FDA rooms",
  "Design sign-off",
  "Simulated bid",
  "Permits",
  "Demo",
  "Rough-in",
  "Inspections",
  "Finishes",
  "Equipment",
  "Punch",
  "Open",
];

export const MARKS = [
  { id: "m1", practiceId: "saguaro", initials: "J.R.", when: "9:10 AM", state: "seen" as const },
  { id: "m2", practiceId: "saguaro", initials: "C.D.", when: "9:40 AM", state: "scheduled" as const },
  { id: "m3", practiceId: "saguaro", initials: "A.S.", when: "10:20 AM", state: "scheduled" as const },
  { id: "m4", practiceId: "copper", initials: "M.L.", when: "8:30 AM", state: "seen" as const },
  { id: "m5", practiceId: "copper", initials: "P.N.", when: "11:00 AM", state: "scheduled" as const },
  { id: "m6", practiceId: "lakeview", initials: "T.W.", when: "1:00 PM", state: "scheduled" as const },
];

export interface Announcement {
  id: string;
  practiceId: string;
  text: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", practiceId: "saguaro", text: "Thursday huddle starts at 7:40. The lab case for Op 2 is in." },
  { id: "a2", practiceId: "copper", text: "Op 7 is down until the tech visit. Do not seat anyone there." },
  { id: "a3", practiceId: "mesa", text: "No patients. Crew is on site tomorrow for electrical." },
  { id: "a4", practiceId: "lakeview", text: "Front desk PC is in a remote session. Use the spare laptop." },
  { id: "a5", practiceId: "redrock", text: "Fluoride is on the draft cart. Do not borrow from the next room." },
  { id: "a6", practiceId: "ponderosa", text: "Dentrix was slow at 8. If it happens again, tell IT from this desk." },
];

export interface Shout {
  id: string;
  practiceId: string;
  from: string;
  about: string;
  text: string;
  pillar: "Intelligence" | "Energy" | "Integrity";
}

export const SEED_SHOUTS: Shout[] = [
  { id: "s1", practiceId: "saguaro", from: "Jordan Ellis", about: "Maria Alvarez", text: "Caught a denial question and sent it to Insurance before the patient left the desk.", pillar: "Integrity" },
  { id: "s2", practiceId: "copper", from: "Robin Hale", about: "Mia Santos", text: "Reset the sterile cycle when the morning pouch count was short.", pillar: "Energy" },
];
