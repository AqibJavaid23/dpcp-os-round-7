/** Sample company knowledge. Labeled Sample. Real SOPs wait for Monday's handoff. */

export interface SopDoc {
  id: string;
  title: string;
  department: string;
  roles: string[];
  owner: string;
  reviewDue: string;
  version: number;
  sample: true;
  summary: string;
  steps: string[];
  checklist?: string;
  training?: string;
  video?: string;
  usedIn: string[];
  history: { version: number; note: string; at: string }[];
  status: "published" | "draft" | "missing";
}

export interface RoleDoc {
  id: string;
  title: string;
  purpose: string;
  responsibilities: string[];
  daily: string[];
  weekly: string[];
  kpis: string[];
  sops: string[];
  systems: string[];
  reportsTo: string;
}

export interface SystemDoc {
  id: string;
  name: string;
  purpose: string;
  owner: string;
  access: string;
}

export interface Duty {
  task: string;
  role: string;
  person: string;
  backup: string;
  department: string;
}

export const SOPS: SopDoc[] = [
  sop("eligibility", "Eligibility check before the visit", "Insurance", ["Insurance biller", "Front desk"], "Omar Hale", "Confirm the visit is eligible the day before. Counts and status only. Details stay in the PMS.", ["Open the morning schedule.", "Match each visit to a payer portal.", "Mark verified, issue, or needs a person.", "Send issues to the front desk before the huddle."], "Morning huddle", ["Insurance workbench", "Practice desk"]),
  sop("claim-48", "Submit a claim within 48 hours", "Insurance", ["Insurance biller"], "Nadia Reyes", "Claims go out within 24–48 hours of the visit so days in AR stay low.", ["Confirm the visit is posted.", "Attach the narrative the PMS already holds.", "Submit.", "Log the claim id and the day."], undefined, ["Claims workbench"]),
  sop("ar-60", "Work the 60–90 day AR bucket", "Insurance", ["Insurance biller"], "Imran Cole", "Touch claims before they age past 90 days.", ["Sort the bucket by dollars.", "Call or portal the oldest first.", "Record the next touch date.", "Escalate a denial that needs an appeal."], undefined, ["AR follow-up board"]),
  sop("appeal", "Draft a denial appeal", "Insurance", ["Insurance biller"], "Nadia Reyes", "The AI drafts. A person approves. Over $1,000 the lead signs.", ["Read the denial reason.", "Draft the appeal from the chart notes that stay in the PMS.", "Send the draft to Review.", "The lead signs anything over $1,000."], undefined, ["Review", "Today"]),
  sop("era", "Post an ERA", "Insurance", ["Insurance biller"], "Sana Brooks", "Match the payment to the claims. A person posts.", ["Import the file.", "Let the match run.", "Clear the exceptions.", "Post when the exceptions are explained."], undefined, ["Posting"]),
  sop("chair", "Chair will not move", "Equipment", ["Equipment specialist"], "Theo March", "Check history and warranty before anyone orders a part.", ["Read the last service note.", "Match the symptom to a known fault.", "Check the warranty date.", "Book a tech if it is not a setting."], undefined, ["Install and service desk"]),
  sop("warranty", "Warranty check before a part order", "Equipment", ["Equipment specialist"], "Theo March", "Do not buy a part the warranty still covers.", ["Find the install date.", "Read the warranty end.", "If it is covered, book the tech.", "If it is not, price the part and ask for approval."], undefined, ["Service desk"]),
  sop("tech-visit", "Set a tech visit", "Equipment", ["Equipment specialist"], "Theo March", "The office hears the day and the window.", ["Pick the next open window.", "Tell the office.", "Add the asset id to the ticket."], undefined, ["Practice desk", "Tickets"]),
  sop("par", "Par level and the supply cart", "Supplies", ["Supplies coordinator"], "Jonas Keller", "Build the cart from par, not from a panic order.", ["Read on-hand against par.", "Build the cart.", "Flag anything over the office limit.", "Wait for the office to approve the cart."], "Order cart", ["Supplies cart"]),
  sop("stockout", "Respond to a stockout", "Supplies", ["Supplies coordinator", "Office manager"], "Jonas Keller", "A stockout becomes a ticket the same day.", ["Confirm the op and the item.", "Ship a substitute if the office agrees.", "Reset par if the usage changed."], undefined, ["Tickets"]),
  sop("new-sku", "Approve a new product", "Supplies", ["Supplies coordinator"], "Jonas Keller", "A new item needs a person. The AI can only suggest.", ["Compare the item with the current one.", "Note the price difference.", "Ask the office manager to approve."], undefined, ["Supplies"]),
  sop("hyg-req", "Open a hygienist requisition", "Staffing", ["Recruiter"], "Amina Farouk", "Add hygiene days before spending more on new patients.", ["Confirm the days the practice needs.", "Open the requisition.", "Share candidates with the office manager."], undefined, ["Staffing", "Balance Assessment"]),
  sop("pulse", "Day 7, 30, and 90 check-in", "Staffing", ["Recruiter", "Office manager"], "Amina Farouk", "A new hire gets three check-ins. A person holds them.", ["Day 7: how the first week felt.", "Day 30: what is still unclear.", "Day 90: stay or support."], undefined, ["Training", "People"]),
  sop("first-week", "First week for a new hire", "Staffing", ["Office manager"], "Amina Farouk", "Training is signed off before client work.", ["Day 1 orientation.", "Shadow the role.", "Pass the role modules.", "Supervisor signs."], "First week", ["Training"]),
  sop("access", "Ask for access", "IT", ["IT specialist"], "Rowan Blake", "Access is requested, not shared.", ["Name the system.", "Name the person and the role.", "IT grants the least access.", "The grant is on the audit log."], undefined, ["IT access"]),
  sop("device", "Enroll or revoke a practice device", "IT", ["IT specialist"], "Rowan Blake", "A shared practice computer has an expiry. Revoke is immediate.", ["Enroll the device to one practice.", "Set the PIN rule.", "Revoke the same day someone leaves."], undefined, ["Admin devices"]),
  sop("backup", "Morning backup check", "IT", ["IT specialist"], "Rowan Blake", "Backups are either current or they are a ticket.", ["Read last night's result.", "If it failed, open a ticket.", "Tell the office only if the day is affected."], undefined, ["IT"]),
  sop("close", "Close the books by day 6", "Accounting", ["Accountant"], "Elena Voss", "The month closes on a date, not when someone remembers.", ["Lock the prior month.", "Clear uncategorized items.", "Send the P&L to Review."], undefined, ["Accounting"]),
  sop("invoice", "Build a client invoice from activity", "Accounting", ["Accountant"], "Elena Voss", "The invoice counts work. A person approves it. Sample pricing is not real pricing.", ["Count handled requests by service.", "Apply the sample tier.", "Send the draft to Review."], undefined, ["Client billing"]),
  sop("snapshot", "Weekly marketing snapshot", "Marketing", ["Marketing coordinator"], "Priya Shah", "Every practice gets a snapshot every week.", ["Pull leads, bookings, and patients seen.", "Draft the note.", "A person approves before it is sent."], undefined, ["Marketing studio"]),
  sop("match", "Match a call to a patient", "Marketing", ["Front desk", "Marketing coordinator"], "Priya Shah", "The front desk marks scheduled or seen. Initials only.", ["Export the week's calls.", "Mark each initials row.", "The match rate lands on the snapshot."], undefined, ["Practice desk Today"]),
  sop("reactivate", "Reactivation campaign", "Marketing", ["Marketing coordinator"], "Priya Shah", "Patients with no future hygiene visit get one campaign, then a person follows up.", ["Pull the unscheduled active list. No clinical detail.", "Draft the message.", "Approve in Review.", "Book replies at the desk."], "Overdue recare", ["Balance Assessment", "Marketing"]),
  sop("new-call", "New patient call", "Marketing", ["Front desk"], "Priya Shah", "Offer three hygiene times. If you cannot, tell staffing before you buy more ads.", ["Answer with the practice name.", "Offer three times inside two weeks.", "If you cannot, flag hygiene availability."], undefined, ["Practice desk"]),
  sop("work-order", "Close a facilities work order", "Construction", ["Project coordinator"], "Rowan Blake", "A work order is closed when the office says the room is usable.", ["Do the work.", "Photo the result. No people, no charts.", "Office confirms.", "Close the ticket."], undefined, ["Facilities"]),
  sop("gate", "Pass a build-stage gate", "Construction", ["Project coordinator"], "Rowan Blake", "A gate needs a person. The AI prepares the packet.", ["Assemble the packet.", "The lead signs the gate.", "The next trade can start."], undefined, ["Construction"]),
  sop("huddle", "Morning huddle", "Practice", ["Office manager", "Front desk"], "Robin Hale", "Ten minutes. Who is in, what is tight, no patient names on the card.", ["Who is in.", "Which ops are tight.", "Lab cases due.", "Open tickets that touch today."], "Huddle card", ["Practice desk"]),
  sop("book-chair", "Book at the chair", "Practice", ["Hygienist", "Assistant"], "Amina Farouk", "The next hygiene visit is booked before the patient stands up.", ["Tell the patient the month they are due.", "Offer two times.", "Book it in the chair.", "Walk them to checkout with it already set."], "Hygiene reappointment", ["Training"]),
  sop("recare", "Overdue recare protocol", "Practice", ["Front desk", "Office manager"], "Robin Hale", "The unscheduled active list is worked every week.", ["Pull patients with no future hygiene visit.", "Call the oldest first.", "Book or mark the outcome.", "Hand the rest to a reactivation campaign."], "Recare tracker", ["Balance Assessment"]),
  sop("script", "Patient reactivation script", "Practice", ["Front desk"], "Priya Shah", "A short, warm call. No clinical detail on the script card.", ["Say the practice name and your name.", "Offer two hygiene times.", "If they decline, ask what would help.", "Log the outcome."], undefined, ["Practice desk"]),
  sop("confirm", "Confirmation and the short-call list", "Practice", ["Front desk"], "Jordan Ellis", "Confirm same day. Keep a list of people who can come early.", ["Confirm today's book.", "When someone cancels, call the short list.", "Fill the chair before lunch."], undefined, ["Practice desk"]),
  sop("case", "Case acceptance conversation", "Coaching", ["Doctor", "Office manager"], "Leila Okonkwo", "Connect the finding to something the patient cares about. Offer financing above the practice threshold.", ["State the finding in plain words.", "Say what happens if it waits.", "Offer the fee and a monthly option.", "Book the treatment before they leave."], undefined, ["Balance Assessment"]),
  sop("sterile", "Weekly sterilizer check", "Practice", ["Assistant"], "Amina Farouk", "A person who passed Sterilization 101 signs the weekly check.", ["Run the test.", "Read the result.", "Sign only if you are certified.", "If it fails, stop and open an equipment ticket."], "Sterile cycle", ["Training", "Lists"]),
  sop("open-day", "Open the day", "Practice", ["Front desk"], "Casey Nguyen", "The room is ready before the first patient.", ["Lights, music, scent.", "Phones off night mode.", "Ops have the morning setup.", "Huddle card on the counter."], "Open the day", ["Practice desk"]),
  sop("close-day", "Close the day", "Practice", ["Front desk", "Office manager"], "Robin Hale", "Tomorrow is set before you leave.", ["Unfinished tickets are owned.", "The deposit is counted by two people. Amounts stay in the PMS.", "The night note is one line."], "Close the day", ["Practice desk"]),
  sop("checkout", "Checkout financial conversation", "Practice", ["Front desk"], "Elena Voss", "The patient hears what they owe before they reach the door.", ["Read the patient portion from the PMS. Do not copy it into DPCP.", "Offer the card or a plan.", "Note that the conversation happened, not the dollars."], undefined, ["Balance Assessment"]),
];

function sop(id: string, title: string, department: string, roles: string[], owner: string, summary: string, steps: string[], checklist?: string, usedIn: string[] = []): SopDoc {
  return {
    id,
    title,
    department,
    roles,
    owner,
    reviewDue: "2026-12-01",
    version: 3,
    sample: true,
    summary,
    steps,
    checklist,
    training: department === "Practice" || department === "Coaching" ? id : undefined,
    video: "Sample video",
    usedIn,
    history: [
      { version: 1, note: "Sample draft.", at: "2026-06-02" },
      { version: 2, note: "Sample review. A lead approved the steps.", at: "2026-08-14" },
      { version: 3, note: "Sample. Current.", at: "2026-09-30" },
    ],
    status: "published",
  };
}

export const ROLES: RoleDoc[] = [
  { id: "front-desk", title: "Front desk", purpose: "Open the day, confirm the book, and get help when something breaks.", responsibilities: ["Confirmation", "New patient calls", "Checkout conversation", "Requests to DPCP"], daily: ["Open the day", "Huddle", "Confirmations", "Close the day"], weekly: ["Recare calls", "Short-call list review"], kpis: ["Confirmation complete", "Reappointment support"], sops: ["open-day", "confirm", "new-call", "checkout"], systems: ["PMS", "Practice desk"], reportsTo: "Office manager" },
  { id: "hygienist", title: "Hygienist", purpose: "See the hygiene day and book the next visit at the chair.", responsibilities: ["Book at the chair", "Perio and fluoride standards", "Room setup"], daily: ["Room setup", "Book next visit"], weekly: ["Sterilizer awareness"], kpis: ["Reappointment rate", "Fluoride percent"], sops: ["book-chair"], systems: ["PMS"], reportsTo: "Office manager" },
  { id: "assistant", title: "Assistant", purpose: "Turn the room and keep sterilization signed.", responsibilities: ["Sterile cycle", "Op turnover", "Cassette status"], daily: ["Turnover checklist"], weekly: ["Sterilizer check if certified"], kpis: ["Checklist completion"], sops: ["sterile"], systems: ["Practice desk"], reportsTo: "Office manager" },
  { id: "office-manager", title: "Office manager", purpose: "See the whole practice day and the one thing that needs a decision.", responsibilities: ["Coverage", "Cart approvals", "Training progress", "Monthly balance review"], daily: ["Huddle", "Approvals", "Coverage"], weekly: ["Checklist review", "Ticket review"], kpis: ["Checklist completion", "Open tickets"], sops: ["huddle", "recare", "close-day"], systems: ["PMS", "DPCP OS"], reportsTo: "Practice owner" },
  { id: "doctor", title: "Doctor", purpose: "The clinical day, and the decisions only a doctor can make.", responsibilities: ["Case acceptance", "Clinical substitutions", "Hire and equipment decisions"], daily: ["Day brief", "Decisions"], weekly: ["Part 2 review in the monthly meeting"], kpis: ["Presented per exam", "Accepted per exam"], sops: ["case"], systems: ["PMS"], reportsTo: "Practice owner" },
  { id: "biller", title: "Insurance biller", purpose: "Verify, submit, post, and follow up. A person approves anything that leaves the company.", responsibilities: ["Eligibility", "Claims", "AR", "Appeals"], daily: ["Eligibility", "Claim queue", "AR touches"], weekly: ["Aging review"], kpis: ["Clean claim rate", "Days in AR"], sops: ["eligibility", "claim-48", "ar-60", "appeal"], systems: ["PMS link-out", "Payer portals"], reportsTo: "Insurance lead" },
  { id: "equipment-spec", title: "Equipment specialist", purpose: "Keep rooms running and warranty honest.", responsibilities: ["Triage repairs", "Warranty", "Tech visits"], daily: ["Open repairs"], weekly: ["Warranty expirations"], kpis: ["Time to visit"], sops: ["chair", "warranty", "tech-visit"], systems: ["Asset list"], reportsTo: "Equipment lead" },
  { id: "supplies-coord", title: "Supplies coordinator", purpose: "Carts from par, no stockouts.", responsibilities: ["Par", "Carts", "Substitutions"], daily: ["Critical par"], weekly: ["Cart build"], kpis: ["Stockouts", "Savings vs last price"], sops: ["par", "stockout"], systems: ["Catalog"], reportsTo: "Supplies lead" },
  { id: "recruiter", title: "Recruiter", purpose: "Fill the seat the practice actually needs.", responsibilities: ["Requisitions", "Day 7/30/90"], daily: ["Open reqs"], weekly: ["Pipeline"], kpis: ["Days to placement"], sops: ["hyg-req", "pulse"], systems: ["Staffing board"], reportsTo: "Staffing lead" },
  { id: "it-spec", title: "IT specialist", purpose: "Access, devices, and backups.", responsibilities: ["Access grants", "Devices", "Backups"], daily: ["Backup check"], weekly: ["Access review"], kpis: ["Backup success"], sops: ["access", "device", "backup"], systems: ["Workspace", "Time Doctor"], reportsTo: "IT lead" },
  { id: "accountant", title: "Accountant", purpose: "Close on time and invoice from activity.", responsibilities: ["Close", "Invoices", "KPI pack"], daily: ["Exceptions"], weekly: ["Close calendar"], kpis: ["Close by day 6"], sops: ["close", "invoice"], systems: ["QuickBooks sample"], reportsTo: "Finance lead" },
  { id: "marketer", title: "Marketing coordinator", purpose: "Patients seen, not just leads.", responsibilities: ["Snapshots", "Call match", "Reactivation"], daily: ["Answer-rate watch"], weekly: ["Snapshot"], kpis: ["Cost per patient seen"], sops: ["snapshot", "match", "reactivate"], systems: ["Ads", "Call tracking"], reportsTo: "Marketing lead" },
];

export const SYSTEMS: SystemDoc[] = [
  { id: "opendental", name: "Open Dental", purpose: "PMS for Copper Canyon and Mesa Verde. Clinical detail stays there.", owner: "Rowan Blake", access: "Ask IT. The access SOP opens a ticket." },
  { id: "dentrix", name: "Dentrix", purpose: "PMS for Ponderosa and Red Rock.", owner: "Rowan Blake", access: "Ask IT." },
  { id: "eaglesoft", name: "Eaglesoft", purpose: "PMS for Saguaro.", owner: "Rowan Blake", access: "Ask IT." },
  { id: "curve", name: "Curve", purpose: "PMS for Lakeview.", owner: "Rowan Blake", access: "Ask IT." },
  { id: "portals", name: "Payer portals", purpose: "Eligibility and claim status. Link out. Do not copy member ids here.", owner: "Omar Hale", access: "Insurance lead grants a named login." },
  { id: "slack", name: "Slack", purpose: "Team messages. The app reads what the person is allowed to see.", owner: "Rowan Blake", access: "Granted with the role." },
  { id: "drive", name: "Drive", purpose: "Files that Review points at.", owner: "Rowan Blake", access: "Granted with the role." },
  { id: "td", name: "Time Doctor", purpose: "Hours and activity for the DPCP team. Counts and descriptions only in this app.", owner: "Rowan Blake", access: "IT creates the user before day 1." },
  { id: "n8n", name: "n8n", purpose: "Background jobs. A production change waits for George.", owner: "Rowan Blake", access: "Release only." },
  { id: "grok", name: "Grok", purpose: "Primary model. Calls go through the provider switch.", owner: "George", access: "Company account. No personal seats." },
  { id: "gemini", name: "Gemini", purpose: "Backup model.", owner: "George", access: "Company account." },
  { id: "qbo", name: "QuickBooks", purpose: "Sample books connection for Accounting.", owner: "Elena Voss", access: "Finance lead." },
  { id: "stripe", name: "Stripe", purpose: "Sample client payment status. No card numbers in the app.", owner: "Elena Voss", access: "Finance lead." },
];

export const DUTIES: Duty[] = [
  { task: "Who approves a lab invoice?", role: "Accountant", person: "Elena Voss", backup: "George", department: "Accounting" },
  { task: "Who approves an appeal over $1,000?", role: "Insurance lead", person: "Omar Hale", backup: "Nadia Reyes", department: "Insurance" },
  { task: "Who sets a tech visit?", role: "Equipment specialist", person: "Theo March", backup: "Rowan Blake", department: "Equipment" },
  { task: "Who approves a supply cart over the office limit?", role: "Office manager", person: "Robin Hale", backup: "Jordan Ellis", department: "Supplies" },
  { task: "Who grants a system login?", role: "IT specialist", person: "Rowan Blake", backup: "George", department: "IT" },
  { task: "Who signs a build-stage gate?", role: "Project coordinator", person: "Rowan Blake", backup: "George", department: "Construction" },
  { task: "Who places a hygienist?", role: "Recruiter", person: "Amina Farouk", backup: "Leila Okonkwo", department: "Staffing" },
  { task: "Who sends the weekly snapshot?", role: "Marketing coordinator", person: "Priya Shah", backup: "Omar Hale", department: "Marketing" },
  { task: "Who owns the morning huddle card?", role: "Office manager", person: "Robin Hale", backup: "Casey Nguyen", department: "Practice" },
  { task: "Who reviews the monthly balance assessment?", role: "Office manager", person: "Robin Hale", backup: "Practice owner", department: "Coaching" },
];

export const GAPS = [
  { id: "gap-osha", department: "Compliance", role: "Office manager", title: "OSHA walkthrough", status: "missing" as const },
  { id: "gap-hipaa-q", department: "Compliance", role: "Front desk", title: "What to do with a records question", status: "missing" as const },
  { id: "gap-barter", department: "Accounting", role: "Accountant", title: "How a barter credit is booked", status: "draft" as const },
];

function editDistance(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const temp = row[j];
      row[j] = a[i - 1] === b[j - 1] ? prev : Math.min(prev, row[j], row[j - 1]) + 1;
      prev = temp;
    }
  }
  return row[b.length];
}

function hit(query: string, text: string) {
  const tokens = query.toLowerCase().split(/\s+/).filter((token) => token.length > 1);
  if (tokens.length === 0) return true;
  const words = text.toLowerCase().split(/\W+/).filter(Boolean);
  return tokens.every((token) => words.some((word) => word.includes(token) || editDistance(word, token) <= 1));
}

export function searchKnowledge(query: string, filter?: { department?: string }) {
  const q = query.trim();
  const sops = SOPS.filter((item) => item.status !== "missing" && (!filter?.department || item.department === filter.department) && (!q || hit(q, `${item.title} ${item.summary} ${item.steps.join(" ")} ${item.department}`)));
  const roles = ROLES.filter((item) => !q || hit(q, `${item.title} ${item.purpose} ${item.responsibilities.join(" ")}`));
  const systems = SYSTEMS.filter((item) => !q || hit(q, `${item.name} ${item.purpose}`));
  const duties = DUTIES.filter((item) => !q || hit(q, `${item.task} ${item.person} ${item.role}`));
  const top = sops[0];
  const answer = top && q ? `Here's how, from ${top.title}, step ${Math.min(4, top.steps.length)}: ${top.steps[Math.min(3, top.steps.length - 1)]}` : "";
  return { sops, roles, systems, duties, answer, source: top };
}

export function relatedSop(text: string) {
  const found = searchKnowledge(text).sops[0];
  return found ?? null;
}
