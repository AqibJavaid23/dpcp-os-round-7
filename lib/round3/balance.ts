/** Practice Balance Assessment. Bands and copy follow the Form and the Guide. Status is computed here, never by the model. */

export type Band = "green" | "amber" | "red" | "diagnostic" | "na";

export interface MetricDef {
  id: string;
  part: 1 | 2 | 3 | 4 | 5;
  name: string;
  perProvider: boolean;
  formula: string;
  intent: string;
  why: string;
  source: string;
  target: string;
  bands: string;
  ifRed: string;
  related: string[];
  substitute?: string;
}

export const PARTS = [
  { id: 1, name: "Patient flow", line: "The ceiling on everything else." },
  { id: 2, name: "Treatment conversion", line: "All per doctor." },
  { id: 3, name: "Schedule efficiency and provider capacity", line: "Assumes flow and conversion are healthy." },
  { id: 4, name: "Hygiene production quality", line: "Assumes flow is healthy." },
  { id: 5, name: "Accounts receivable", line: "Recovers existing revenue. It does not create new revenue." },
] as const;

export const METRICS: MetricDef[] = [
  { id: "1.1", part: 1, name: "New patients per doctor / month", perProvider: true, formula: "New patients seen ÷ full-time doctors. A full-time doctor works 4 days a week, about 16 days a month. Prorate part-time doctors.", intent: "Is the practice adding enough new patients for each doctor?", why: "Below 20 new patients per doctor, the practice is not generating enough volume to sustain growth. A blended average can hide one under-fed doctor.", source: "New Patient Report", target: "30–40", bands: "Green 30–40 or above · Amber 20–29 · Red below 20", ifRed: "Review marketing channel performance. Check whether the practice is accepting new patients on the insurance panels the market uses. Check whether new hygiene availability (1.6) is limiting bookings.", related: ["1.6", "1.4"], substitute: "New patient exams ÷ doctor days, prorated to a full-time month" },
  { id: "1.2", part: 1, name: "Exams per doctor / month", perProvider: true, formula: "Exams ÷ doctors, measured per doctor, not as a blended total.", intent: "Is each doctor examining enough patients to diagnose treatment?", why: "Exams are the gateway to doctor production. If one doctor does 140 exams and another does 60, the problem is allocation, not overall volume.", source: "Provider Production Detail", target: "120–150", bands: "Green 120–150 or above · Amber 90–119 · Red below 90", ifRed: "Check the doctor-to-hygiene days ratio (1.4). A doctor who is short on exams is usually not being fed by hygiene. Also check the exam split (1.3).", related: ["1.4", "1.3"] },
  { id: "1.3", part: 1, name: "Exam split between providers", perProvider: true, formula: "Exams by doctor A ÷ exams by doctor B, normalized for days worked.", intent: "Are exams shared fairly once days worked are equalized?", why: "If exams are not roughly equal, one doctor overproduces and the other underproduces. The cause is almost always scheduling.", source: "Provider Production Detail", target: "Within 15%", bands: "Green within 15% · Amber 15–25% · Red over 25%. One-doctor practices are not scored.", ifRed: "Look at how new patients and recall patients are assigned. If one doctor receives more flow, adjust the schedule so it is shared.", related: ["1.2"] },
  { id: "1.4", part: 1, name: "Doctor days : hygiene days", perProvider: false, formula: "Doctor days ÷ hygiene days. Shown as hygiene days per doctor day. A full-time doctor is about 16 days a month.", intent: "Does hygiene have enough days to feed the doctors?", why: "Hygiene is the engine that feeds the doctor. Below this ratio, the doctor will not have enough examined patients.", source: "Provider Production Detail", target: "1 : 2 or more hygiene", bands: "Green 2 or more hygiene days per doctor day · Amber 1.5–2 · Red below 1.5", ifRed: "Add hygiene days before adding marketing spend. The bottleneck is capacity to see patients, not awareness. Confirm with new hygiene availability (1.6).", related: ["1.6", "1.2"] },
  { id: "1.5", part: 1, name: "Active patients current on recare", perProvider: false, formula: "Active patients with a future hygiene appointment ÷ active patients.", intent: "Is the recall system keeping the active base scheduled?", why: "Unscheduled active patients drift away. This shows whether recall is a retention engine.", source: "Hygiene Reappointment Report", target: "70%+", bands: "Green 70% or more · Amber 60–69% · Red below 60%", ifRed: "Patients should leave every hygiene visit with the next visit already booked. If they do not, hygiene reappointment (1.7) will be failing too.", related: ["1.7", "1.8"] },
  { id: "1.6", part: 1, name: "New hygiene appointment availability", perProvider: false, formula: "Days until 3 hygiene openings can be offered to a new patient. Counted by checking the schedule.", intent: "Can a new patient be offered 3 hygiene times inside two weeks?", why: "If the first openings are four or five weeks out, prospective patients call the next practice.", source: "Schedule (counted by hand)", target: "Within 2 weeks", bands: "Green within 14 days · Amber 15–21 days · Red over 21 days", ifRed: "Add a hygiene day before spending more on new-patient marketing. Capacity is the constraint.", related: ["1.4", "1.1"] },
  { id: "1.7", part: 1, name: "Hygiene reappointment rate", perProvider: false, formula: "Patients leaving hygiene with a future appointment ÷ hygiene patients seen.", intent: "Do hygiene patients leave with the next visit booked?", why: "Every patient who leaves unscheduled has to be chased. Below 80%, hygiene is leaking its own base.", source: "Hygiene Reappointment Report", target: "90%+", bands: "Green 90% or more · Amber 80–89% · Red below 80%", ifRed: "Retrain the hygiene team on the pre-appointment conversation. Book at the chair, before checkout. Booking at the chair holds more often than booking at the front desk.", related: ["1.5"] },
  { id: "1.8", part: 1, name: "New patient reappointment rate", perProvider: false, formula: "New patients who book a second appointment before leaving ÷ new patients seen.", intent: "Do new patients leave with a second visit?", why: "The first visit starts the relationship. The second visit confirms it. Below 65%, new patients are not becoming long-term patients.", source: "New Patient Report", target: "75%+", bands: "Green 75% or more · Amber 65–74% · Red below 65%", ifRed: "Every new-patient exam should include a specific conversation about the next visit before checkout. The doctor and hygienist set the recall expectation during the visit.", related: ["1.7", "1.1"] },
  { id: "1.9", part: 1, name: "No-show and cancellation rate", perProvider: false, formula: "Appointments not kept ÷ appointments scheduled. Lower is better.", intent: "How much committed chair time goes unused?", why: "Above 15% means confirmation is failing, the wrong patients are being scheduled, or the book is managed after holes appear.", source: "Schedule / appointment report", target: "Below 10%", bands: "Green below 10% · Amber 10–15% · Red above 15%", ifRed: "Use a same-day confirmation protocol and a short-call list to fill cancellations. Review whether the confirmation cadence fits the patient mix.", related: ["1.7"] },
  { id: "2.1", part: 2, name: "Patient acceptance rate", perProvider: true, formula: "Patients accepting any treatment ÷ patients given a recommendation. Per doctor.", intent: "Did the patient say yes to anything?", why: "This is a trust and communication metric. Below 65% for one doctor means the presentation, not the whole practice, needs work.", source: "Provider Production Detail", target: "75–80%", bands: "Green 75% or more · Amber 65–74% · Red below 65%", ifRed: "Review that doctor's case presentation. The finding has to connect to a consequence the patient understands. Communication training usually moves this more than an operational change.", related: ["2.2", "2.4"] },
  { id: "2.2", part: 2, name: "Treatment dollar acceptance", perProvider: true, formula: "Dollars accepted ÷ dollars presented. Per doctor.", intent: "How much of the presented dollar value is accepted?", why: "A patient can accept a filling and decline a crown. This shows whether small cases or large cases are the leak.", source: "Provider Production Detail", target: "35–50%", bands: "Green 35% or more · Amber 25–34% · Red below 25%", ifRed: "If large cases are declined, offer financing on every case above the practice's dollar threshold. Patients who decline on cost often accept the same treatment on a monthly payment.", related: ["2.1", "2.4"], substitute: "Percent of presented procedures accepted" },
  { id: "2.3", part: 2, name: "Treatment accepted per exam", perProvider: true, formula: "Dollars accepted ÷ exams. Per doctor.", intent: "How much accepted treatment does each exam produce?", why: "This collapses diagnosis, presentation, and acceptance into one number. Compare it with 2.4 to see whether the gap is diagnosis or conversion.", source: "Provider Production Detail", target: "$300–500", bands: "Green $300 or more · Amber $200–299 · Red below $200", ifRed: "Compare with treatment presented per exam (2.4). If 2.4 is also low, the doctor is under-diagnosing or under-presenting. If 2.4 is healthy and 2.3 is low, patients hear the recommendation and do not accept it.", related: ["2.4"] },
  { id: "2.4", part: 2, name: "Treatment presented per exam", perProvider: true, formula: "Dollars presented ÷ exams. Per doctor.", intent: "How much treatment is found and presented at each exam?", why: "If this is low, the doctor is not finding treatment or is not presenting what they find.", source: "Provider Production Detail", target: "$400–600", bands: "Green $400 or more · Amber $250–399 · Red below $250", ifRed: "Review the examination protocol and clinical notes. A doctor who presents well below the band is not examining to a full standard of care.", related: ["2.3", "2.1"] },
  { id: "3.1", part: 3, name: "Doctor production per hour", perProvider: true, formula: "Doctor collections ÷ doctor chair hours. A full-time doctor is about 139 hours a month.", intent: "Is the doctor's hour filled with the right work?", why: "A doctor at a low hourly rate with a full book is doing low-value procedures or not scheduling accepted treatment. A high hourly rate with an empty book is a Part 1 problem.", source: "Production and Collections; Provider Production Detail", target: "$700+/hour", bands: "Green $700 or more · Amber $550–699 · Red below $550. Floor $550. Elite $1,000+.", ifRed: "Look at the procedure mix. Protect blocks for restorative work. Check whether accepted treatment is scheduled promptly or sitting unscheduled.", related: ["2.3", "3.2"] },
  { id: "3.2", part: 3, name: "Restorative appointment availability", perProvider: true, formula: "Days until 3 crown-level openings can be offered, per doctor. Counted by checking the schedule.", intent: "Can accepted crowns be scheduled inside two weeks?", why: "If a crown cannot be seen within two weeks, the practice is delaying accepted treatment and the patient may not return.", source: "Schedule (counted by hand)", target: "Within 2 weeks", bands: "Green within 14 days · Amber 15–21 days · Red over 21 days", ifRed: "Protect restorative blocks. Do not let recall or short procedures fill them. If a doctor is booked more than 3 weeks out for restorative work, consider a second provider.", related: ["3.1"] },
  { id: "3.3", part: 3, name: "Hygiene percent of total production", perProvider: false, formula: "Hygiene collections ÷ total collections.", intent: "Are the hygiene engine and the doctor engine in balance?", why: "Below 20%, hygiene is underdeveloped. Above 30%, the doctor is not converting what hygiene is feeding, which is a Part 2 problem.", source: "Production and Collections", target: "20–30%", bands: "Green 20–30% · Amber below 20% or 30–40% · Red below 15% or above 40%", ifRed: "If hygiene is far below the band, look at hygiene staffing and the schedule. If hygiene is far above the band, go back to Part 2 and read conversion per doctor. Do not read this metric alone.", related: ["1.4", "2.3"] },
  { id: "4.1", part: 4, name: "Perio percent", perProvider: false, formula: "Perio visits (scaling and root planing, perio maintenance, any non-prophy) ÷ hygiene visits.", intent: "Is hygiene diagnosing periodontal disease at a normal rate?", why: "In an established base, about one in five hygiene visits should be perio rather than a routine prophy. Below 10% is systematic under-diagnosis.", source: "Provider Production Detail", target: "17–20%", bands: "Green 17% or more · Amber 10–16% · Red below 10%", ifRed: "Audit hygiene charting and how perio findings are explained. Perio visits produce more care and more production than a prophy, and patients with disease are not being treated when this is low.", related: ["4.3"] },
  { id: "4.2", part: 4, name: "Fluoride percent", perProvider: true, formula: "Fluoride delivered ÷ hygiene visits. Also by hygienist.", intent: "Is fluoride attached on the visits where it belongs?", why: "Fluoride is a standard of care for most adults. Below 30%, it is being omitted, not sold.", source: "Provider Production Detail", target: "45–50%", bands: "Green 45% or more · Amber 30–44% · Red below 30%", ifRed: "Retrain hygienists and build fluoride into the standard visit. Track it by hygienist so you can see whether the gap is one person or the whole team.", related: ["4.3"] },
  { id: "4.3", part: 4, name: "Hygiene production per day", perProvider: true, formula: "Hygiene collections ÷ hygiene days.", intent: "Is a hygiene day producing at the clinical standard?", why: "This one number holds schedule density, procedure mix, and attachment. A thin schedule from weak patient flow is a Part 1 symptom, not a hygiene skill problem.", source: "Production and Collections", target: "$1,200–1,600 assisted / $800–1,000 unassisted", bands: "Green at or above the assisted or unassisted floor · Amber within 15% under that floor · Red below that", ifRed: "First ask whether the chairs are full. If the schedule is thin, this is a Part 1 problem. If the chairs are full, perio and fluoride (4.1 and 4.2) show whether the gap is clinical.", related: ["1.5", "4.1", "4.2"] },
  { id: "4.4", part: 4, name: "Hygiene production per hour", perProvider: true, formula: "Hygiene collections ÷ hygiene chair hours.", intent: "Is the hygiene hour efficient, not just the day?", why: "Per hour compares full-time and part-time hygienists fairly. A healthy day with a low hour can mean appointments are longer than they need to be.", source: "Production and Collections", target: "$200–250 assisted / $150–200 unassisted", bands: "Green at or above the floor · Amber within 15% under the floor · Red below that", ifRed: "Compare with production per day (4.3). If the day is healthy and the hour is low, review appointment length.", related: ["4.3"] },
  { id: "5.1", part: 5, name: "Collections rate", perProvider: false, formula: "Collections ÷ production, net of contractual write-offs.", intent: "What share of adjusted production is collected?", why: "Everything else in Part 5 explains this number. Below 88% is an active billing problem. The Guide marks red below 90%.", source: "Production and Collections", target: "95%+", bands: "Green 95% or more · Amber 90–94% · Red below 90%. Below 88% is an active billing problem.", ifRed: "Run a billing audit. Compare insurance aging with patient aging (5.5). Those are different problems.", related: ["5.5", "5.3"] },
  { id: "5.2", part: 5, name: "Total AR : monthly production", perProvider: false, formula: "Total AR ÷ average monthly production. Lower is better.", intent: "How many months of production are sitting uncollected?", why: "A healthy practice clears about one production cycle. Above 1:1, old claims or patient balances are not being worked.", source: "AR Aging; Production and Collections", target: "Below 1 : 1", bands: "Green below 1.0 · Amber 1.0–1.5 · Red above 1.5", ifRed: "Read the aging buckets. The problem is almost always in the 90+ bucket. Work that bucket first. Old AR recovers less often than current AR.", related: ["5.3"] },
  { id: "5.3", part: 5, name: "AR over 90 days", perProvider: false, formula: "AR 90+ ÷ total AR. Lower is better.", intent: "How much of AR is past the point where it still collects?", why: "Past 90 days, appeal windows close and patients are much less likely to pay on their own.", source: "AR Aging", target: "Below 10%", bands: "Green below 10% · Amber 10–15% · Red above 15%", ifRed: "Work the 60–90 day bucket every week, before claims age past 90. Set an escalation path for anything that reaches 90 days.", related: ["5.4", "5.1"] },
  { id: "5.4", part: 5, name: "Days in AR", perProvider: false, formula: "Total AR ÷ average daily production. Lower is better.", intent: "How many days of production are uncollected?", why: "Above 45 days, billing lag creates cash pressure even when production looks strong.", source: "AR Aging; Production and Collections", target: "Below 30", bands: "Green below 30 · Amber 30–45 · Red above 45", ifRed: "Claims should be submitted within 24–48 hours of the visit. Late submission is the most common cause of high days in AR.", related: ["5.1"] },
  { id: "5.5", part: 5, name: "Insurance vs patient AR split", perProvider: false, formula: "Insurance AR ÷ patient AR. Diagnostic only. There is no pass or fail.", intent: "Which side is aging, insurance or the patient?", why: "Insurance aging is a claims problem. Patient aging is a checkout conversation problem. They need different fixes.", source: "AR Aging", target: "Diagnostic", bands: "No pass or fail. Show which side is aging.", ifRed: "If insurance AR is aging, audit claim submission and denial response. If patient AR is aging, review the financial conversation at checkout.", related: ["5.1", "5.3"] },
];

export const MONTHS = ["2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"] as const;
export const DEFAULT_MONTH = "2026-09";

export function monthLabel(id: string) {
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [year, month] = id.split("-");
  return `${names[Number(month) - 1]} ${year}`;
}

export function metricById(id: string) {
  return METRICS.find((metric) => metric.id === id)!;
}

type NumMap = Record<string, number>;

const CURRENT: Record<string, NumMap> = {
  copper: { "1.1": 32, "1.2": 132, "1.3": 11, "1.4": 2.1, "1.5": 58, "1.6": 11, "1.7": 82, "1.8": 77, "1.9": 8, "2.1": 78, "2.2": 41, "2.3": 360, "2.4": 510, "3.1": 760, "3.2": 9, "3.3": 24, "4.1": 18, "4.2": 48, "4.3": 1380, "4.4": 215, "5.1": 96, "5.2": 0.82, "5.3": 7, "5.4": 26, "5.5": 58 },
  saguaro: { "1.1": 36, "1.2": 141, "1.3": 0, "1.4": 2.2, "1.5": 73, "1.6": 8, "1.7": 91, "1.8": 79, "1.9": 7, "2.1": 68, "2.2": 29, "2.3": 248, "2.4": 230, "3.1": 510, "3.2": 18, "3.3": 34, "4.1": 16, "4.2": 41, "4.3": 1280, "4.4": 205, "5.1": 95, "5.2": 0.9, "5.3": 9, "5.4": 28, "5.5": 62 },
  lakeview: { "1.1": 33, "1.2": 126, "1.3": 14, "1.4": 2, "1.5": 71, "1.6": 12, "1.7": 90, "1.8": 76, "1.9": 9, "2.1": 77, "2.2": 40, "2.3": 340, "2.4": 480, "3.1": 820, "3.2": 11, "3.3": 22, "4.1": 18, "4.2": 46, "4.3": 1300, "4.4": 210, "5.1": 86, "5.2": 1.7, "5.3": 19, "5.4": 51, "5.5": 32 },
  mesa: { "1.1": 24, "1.2": 118, "1.3": 12, "1.4": 1.8, "1.5": 66, "1.6": 16, "1.7": 88, "1.8": 72, "1.9": 11, "2.1": 76, "2.2": 38, "2.3": 320, "2.4": 470, "3.1": 690, "3.2": 12, "3.3": 27, "4.1": 17, "4.2": 46, "4.3": 1240, "4.4": 205, "5.1": 95, "5.2": 0.95, "5.3": 9, "5.4": 29, "5.5": 55 },
  ponderosa: { "1.1": 31, "1.2": 124, "1.3": 0, "1.4": 2.3, "1.5": 72, "1.6": 10, "1.7": 92, "1.8": 78, "1.9": 8, "2.1": 79, "2.2": 44, "2.3": 410, "2.4": 540, "3.1": 730, "3.2": 13, "3.3": 26, "4.1": 8, "4.2": 28, "4.3": 740, "4.4": 132, "5.1": 96, "5.2": 0.8, "5.3": 6, "5.4": 24, "5.5": 60 },
  redrock: { "1.1": 34, "1.2": 128, "1.3": 0, "1.4": 2.1, "1.5": 74, "1.6": 9, "1.7": 93, "1.8": 80, "1.9": 6, "2.1": 81, "2.2": 46, "2.3": 390, "2.4": 520, "3.1": 740, "3.2": 8, "3.3": 25, "4.1": 18, "4.2": 47, "4.3": 920, "4.4": 168, "5.1": 97, "5.2": 0.7, "5.3": 5, "5.4": 22, "5.5": 57 },
};

const START: Record<string, NumMap> = {
  copper: { ...CURRENT.copper, "1.1": 29, "1.7": 74, "1.5": 61 },
  saguaro: { ...CURRENT.saguaro, "2.4": 460, "2.3": 340, "2.2": 38, "3.1": 640 },
  lakeview: { ...CURRENT.lakeview, "5.1": 97, "5.2": 0.85, "5.3": 8, "5.4": 27 },
  mesa: { ...CURRENT.mesa, "1.1": 29 },
  ponderosa: { ...CURRENT.ponderosa, "4.1": 15, "4.2": 40, "4.3": 860, "4.4": 155 },
  redrock: { ...CURRENT.redrock },
};

const COPPER_17 = [74, 75, 75, 76, 76, 77, 77, 77, 78, 78, 78, 82];
const COPPER_15 = [61, 60, 59, 59, 58, 58, 57, 58, 58, 57, 58, 58];

export interface ProviderRow {
  name: string;
  role: "doctor" | "hygienist";
  ft: boolean;
  assisted: boolean;
  values: NumMap;
}

export interface PracticeMonth {
  practiceId: string;
  month: string;
  reviewer: string;
  doctors: number;
  hygienists: number;
  operatories: number;
  collections: number;
  activeBase: number;
  assisted: boolean;
  singleDoctor: boolean;
  values: NumMap;
  substitutes: string[];
  providers: ProviderRow[];
}

const PROFILE: Record<string, Omit<PracticeMonth, "month" | "values" | "substitutes" | "providers">> = {
  copper: { practiceId: "copper", reviewer: "Robin Hale", doctors: 2, hygienists: 2, operatories: 12, collections: 71200, activeBase: 1840, assisted: true, singleDoctor: false },
  saguaro: { practiceId: "saguaro", reviewer: "Jordan Ellis", doctors: 1, hygienists: 1, operatories: 6, collections: 118900, activeBase: 2100, assisted: true, singleDoctor: true },
  lakeview: { practiceId: "lakeview", reviewer: "Tess Ward", doctors: 2, hygienists: 2, operatories: 9, collections: 142000, activeBase: 2400, assisted: true, singleDoctor: false },
  mesa: { practiceId: "mesa", reviewer: "Sam Ibarra", doctors: 2, hygienists: 3, operatories: 14, collections: 64000, activeBase: 900, assisted: true, singleDoctor: false },
  ponderosa: { practiceId: "ponderosa", reviewer: "Bea Solomon", doctors: 1, hygienists: 2, operatories: 8, collections: 88000, activeBase: 1600, assisted: false, singleDoctor: true },
  redrock: { practiceId: "redrock", reviewer: "Glen Cho", doctors: 1, hygienists: 1, operatories: 5, collections: 54000, activeBase: 980, assisted: false, singleDoctor: true },
};

function roundMetric(id: string, value: number) {
  if (id === "1.4" || id === "5.2") return Math.round(value * 100) / 100;
  return Math.round(value);
}

function valueAt(practiceId: string, id: string, index: number) {
  if (practiceId === "copper" && id === "1.7") return COPPER_17[index];
  if (practiceId === "copper" && id === "1.5") return COPPER_15[index];
  const end = CURRENT[practiceId][id];
  const start = START[practiceId][id] ?? end;
  return roundMetric(id, start + ((end - start) * index) / 11);
}

function providersFor(practiceId: string, values: NumMap): ProviderRow[] {
  const bump = (base: NumMap, delta: NumMap) => {
    const next: NumMap = {};
    for (const key of Object.keys(base)) next[key] = roundMetric(key, base[key] + (delta[key] ?? 0));
    return next;
  };
  if (practiceId === "copper") {
    return [
      { name: "Dr. Elena Voss", role: "doctor", ft: true, assisted: true, values: bump(values, { "1.1": 3, "1.2": 10, "2.1": 4, "2.2": 3, "2.3": 40, "2.4": 30, "3.1": 40, "3.2": -2 }) },
      { name: "Dr. Adam Shah", role: "doctor", ft: true, assisted: true, values: bump(values, { "1.1": -3, "1.2": -10, "2.1": -4, "2.2": -3, "2.3": -40, "2.4": -30, "3.1": -40, "3.2": 2 }) },
      { name: "Hannah Brooks", role: "hygienist", ft: true, assisted: true, values: bump(values, { "4.2": 6, "4.3": 80, "4.4": 15 }) },
      { name: "Owen Blake", role: "hygienist", ft: false, assisted: true, values: bump(values, { "4.2": -6, "4.3": -80, "4.4": -15 }) },
    ];
  }
  if (practiceId === "saguaro") {
    return [
      { name: "Dr. Lila Okonkwo", role: "doctor", ft: true, assisted: true, values },
      { name: "Dana Kim", role: "hygienist", ft: true, assisted: true, values },
    ];
  }
  if (practiceId === "lakeview") {
    return [
      { name: "Dr. Wren Adler", role: "doctor", ft: true, assisted: true, values: bump(values, { "1.2": 8, "2.1": 3, "3.1": 30 }) },
      { name: "Dr. Hugo Stein", role: "doctor", ft: false, assisted: true, values: bump(values, { "1.2": -12, "2.1": -3, "3.1": -40 }) },
      { name: "Nell Park", role: "hygienist", ft: true, assisted: true, values },
      { name: "Ida Cho", role: "hygienist", ft: true, assisted: true, values: bump(values, { "4.2": -4 }) },
    ];
  }
  if (practiceId === "mesa") {
    return [
      { name: "Dr. Noah Pell", role: "doctor", ft: true, assisted: true, values: bump(values, { "1.1": 2, "1.2": 6 }) },
      { name: "Dr. Iris Lang", role: "doctor", ft: true, assisted: true, values: bump(values, { "1.1": -2, "1.2": -6 }) },
    ];
  }
  if (practiceId === "ponderosa") {
    return [
      { name: "Dr. Caleb Moss", role: "doctor", ft: true, assisted: false, values },
      { name: "Willa Grant", role: "hygienist", ft: true, assisted: false, values: bump(values, { "4.2": -4, "4.3": -40 }) },
    ];
  }
  return [
    { name: "Dr. Paul Ibarra", role: "doctor", ft: true, assisted: false, values },
    { name: "Sable Ortiz", role: "hygienist", ft: true, assisted: false, values },
  ];
}

export function monthsFor(practiceId: string): PracticeMonth[] {
  const profile = PROFILE[practiceId];
  if (!profile) return [];
  return MONTHS.map((month, index) => {
    const values: NumMap = {};
    for (const metric of METRICS) values[metric.id] = valueAt(practiceId, metric.id, index);
    return {
      ...profile,
      month,
      values,
      substitutes: practiceId === "lakeview" ? ["2.2"] : [],
      providers: providersFor(practiceId, values),
    };
  });
}

export function statusOf(id: string, value: number, opts?: { assisted?: boolean; singleDoctor?: boolean }): Band {
  if (id === "5.5") return "diagnostic";
  if (id === "1.3" && opts?.singleDoctor) return "na";
  const assisted = opts?.assisted !== false;
  switch (id) {
    case "1.1":
      return value >= 30 ? "green" : value >= 20 ? "amber" : "red";
    case "1.2":
      return value >= 120 ? "green" : value >= 90 ? "amber" : "red";
    case "1.3":
      return value <= 15 ? "green" : value <= 25 ? "amber" : "red";
    case "1.4":
      return value >= 2 ? "green" : value >= 1.5 ? "amber" : "red";
    case "1.5":
      return value >= 70 ? "green" : value >= 60 ? "amber" : "red";
    case "1.6":
    case "3.2":
      return value <= 14 ? "green" : value <= 21 ? "amber" : "red";
    case "1.7":
      return value >= 90 ? "green" : value >= 80 ? "amber" : "red";
    case "1.8":
      return value >= 75 ? "green" : value >= 65 ? "amber" : "red";
    case "1.9":
      return value < 10 ? "green" : value <= 15 ? "amber" : "red";
    case "2.1":
      return value >= 75 ? "green" : value >= 65 ? "amber" : "red";
    case "2.2":
      return value >= 35 ? "green" : value >= 25 ? "amber" : "red";
    case "2.3":
      return value >= 300 ? "green" : value >= 200 ? "amber" : "red";
    case "2.4":
      return value >= 400 ? "green" : value >= 250 ? "amber" : "red";
    case "3.1":
      return value >= 700 ? "green" : value >= 550 ? "amber" : "red";
    case "3.3":
      if (value >= 20 && value <= 30) return "green";
      if (value < 15 || value > 40) return "red";
      return "amber";
    case "4.1":
      return value >= 17 ? "green" : value >= 10 ? "amber" : "red";
    case "4.2":
      return value >= 45 ? "green" : value >= 30 ? "amber" : "red";
    case "4.3": {
      const floor = assisted ? 1200 : 800;
      if (value >= floor) return "green";
      if (value >= floor * 0.85) return "amber";
      return "red";
    }
    case "4.4": {
      const floor = assisted ? 200 : 150;
      if (value >= floor) return "green";
      if (value >= floor * 0.85) return "amber";
      return "red";
    }
    case "5.1":
      return value >= 95 ? "green" : value >= 90 ? "amber" : "red";
    case "5.2":
      return value < 1 ? "green" : value <= 1.5 ? "amber" : "red";
    case "5.3":
      return value < 10 ? "green" : value <= 15 ? "amber" : "red";
    case "5.4":
      return value < 30 ? "green" : value <= 45 ? "amber" : "red";
    default:
      return "na";
  }
}

export interface EvalResult {
  byMetric: Record<string, Band>;
  byPart: Record<number, Band>;
  counts: Record<number, { green: number; amber: number; red: number }>;
  worst: Record<number, string>;
  priority: { mode: "priority" | "watch" | "clear"; part: number | null; metric: string | null };
  patterns: { id: number; text: string }[];
  symptoms: Record<string, string>;
}

const RANK: Record<Band, number> = { red: 3, amber: 2, green: 1, diagnostic: 0, na: 0 };

export function evaluate(month: PracticeMonth): EvalResult {
  const opts = { assisted: month.assisted, singleDoctor: month.singleDoctor };
  const byMetric: Record<string, Band> = {};
  for (const metric of METRICS) byMetric[metric.id] = statusOf(metric.id, month.values[metric.id], opts);
  const byPart: Record<number, Band> = { 1: "green", 2: "green", 3: "green", 4: "green", 5: "green" };
  const counts: EvalResult["counts"] = { 1: { green: 0, amber: 0, red: 0 }, 2: { green: 0, amber: 0, red: 0 }, 3: { green: 0, amber: 0, red: 0 }, 4: { green: 0, amber: 0, red: 0 }, 5: { green: 0, amber: 0, red: 0 } };
  const worst: Record<number, string> = {};
  for (const metric of METRICS) {
    const band = byMetric[metric.id];
    if (band === "green" || band === "amber" || band === "red") counts[metric.part][band] += 1;
    if (band === "diagnostic" || band === "na") continue;
    const current = worst[metric.part] ? byMetric[worst[metric.part]] : "green";
    if (!worst[metric.part] || RANK[band] > RANK[current]) worst[metric.part] = metric.id;
    if (RANK[band] > RANK[byPart[metric.part]]) byPart[metric.part] = band;
  }
  let priority: EvalResult["priority"] = { mode: "clear", part: null, metric: null };
  for (const part of [1, 2, 3, 4, 5]) {
    if (byPart[part] === "red") {
      const metric = METRICS.find((item) => item.part === part && byMetric[item.id] === "red")!;
      priority = { mode: "priority", part, metric: metric.id };
      break;
    }
  }
  if (priority.mode === "clear") {
    for (const part of [1, 2, 3, 4, 5]) {
      if (byPart[part] === "amber") {
        const metric = METRICS.find((item) => item.part === part && byMetric[item.id] === "amber")!;
        priority = { mode: "watch", part, metric: metric.id };
        break;
      }
    }
  }
  const symptoms: Record<string, string> = {};
  if (priority.mode === "priority" && priority.part) {
    for (const metric of METRICS) {
      if (metric.part > priority.part && byMetric[metric.id] === "red") {
        symptoms[metric.id] = `Likely a symptom of Part ${priority.part}`;
      }
    }
  }
  const patterns: EvalResult["patterns"] = [];
  if (byMetric["3.1"] === "green" && month.values["3.1"] >= 700 && byPart[5] === "red") {
    patterns.push({ id: 1, text: "Strong production, weak collections. The schedule is earning it. Part 5 is where the cash is stuck. Suggested by AI: a billing audit, not a production push." });
  }
  if ((byMetric["2.4"] === "red" || byMetric["2.2"] === "red") && byMetric["3.1"] === "red") {
    patterns.push({ id: 2, text: "Full-looking book, low production per hour. Suggested by AI: the root is in Part 2, treatment presented and accepted, not in adding hours." });
  }
  if (byMetric["1.1"] === "red" && byMetric["1.5"] === "green" && byMetric["1.7"] !== "red") {
    patterns.push({ id: 3, text: "Low new patients, retention is holding. Suggested by AI: check hygiene availability (1.6) before spending more on marketing." });
  }
  const doctors = month.providers.filter((provider) => provider.role === "doctor" && provider.values["2.1"] != null);
  const spread = doctors.length >= 2 ? Math.abs(doctors[0].values["2.1"] - doctors[1].values["2.1"]) : 0;
  if (byMetric["1.3"] === "red" || spread >= 15) {
    patterns.push({ id: 4, text: "Multi-doctor imbalance. Suggested by AI: coach or reschedule the doctor who is off, not the practice average." });
  }
  if (byMetric["1.9"] === "red" && byMetric["1.7"] === "red") {
    patterns.push({ id: 5, text: "High cancellations and low reappointment. Suggested by AI: book the next visit at the chair and keep a short-call list." });
  }
  return { byMetric, byPart, counts, worst, priority, patterns, symptoms };
}

export function formatValue(id: string, value: number) {
  if (id === "5.5") return `Insurance ${value}% · patient ${100 - value}%`;
  if (id === "1.4") return `1 : ${value.toFixed(1)}`;
  if (id === "5.2") return `${value.toFixed(2)} : 1`;
  if (["1.5", "1.7", "1.8", "1.9", "2.1", "2.2", "3.3", "4.1", "4.2", "5.1", "5.3", "1.3"].includes(id)) return `${value}%`;
  if (["2.3", "2.4", "3.1", "4.3", "4.4"].includes(id)) return `$${value.toLocaleString("en-US")}`;
  if (id === "1.6" || id === "3.2" || id === "5.4") return `${value} days`;
  return String(value);
}

export interface HelpSuggestion {
  queue: string;
  queueLabel: string;
  text: string;
}

export function helpFor(metricId: string, byMetric: Record<string, Band>): HelpSuggestion[] {
  const part = metricById(metricId).part;
  if (metricId === "1.1" || metricId === "1.6") {
    if (byMetric["1.6"] === "red" || byMetric["1.4"] === "red") {
      return [{ queue: "staffing", queueLabel: "Staffing", text: "Add hygiene days before marketing spend. Open a hygienist requisition." }];
    }
    return [{ queue: "marketing", queueLabel: "Marketing", text: "Campaigns, call answer rate, and call-to-patient match." }];
  }
  if (metricId === "1.4") return [{ queue: "staffing", queueLabel: "Staffing", text: "Hygienist requisition. Add hygiene days." }];
  if (metricId === "1.5" || metricId === "1.7" || metricId === "1.8") {
    return [
      { queue: "training", queueLabel: "Training", text: "Book at the chair. Overdue recare protocol and the reactivation script." },
      { queue: "marketing", queueLabel: "Marketing", text: "Reactivation campaign for patients with no future hygiene visit." },
    ];
  }
  if (metricId === "1.9") return [{ queue: "training", queueLabel: "Training", text: "Front desk confirmation protocol and the short-call list." }];
  if (metricId === "1.2" || metricId === "1.3") return [{ queue: "coaching", queueLabel: "Coaching", text: "Scheduling allocation between doctors." }];
  if (part === 2) return [{ queue: "coaching", queueLabel: "Coaching", text: "Case acceptance conversation and financing above the practice threshold." }];
  if (part === 3) {
    const items: HelpSuggestion[] = [{ queue: "coaching", queueLabel: "Coaching", text: "Protect restorative blocks on the doctor schedule." }];
    if (byMetric["3.2"] === "red") items.push({ queue: "staffing", queueLabel: "Staffing", text: "A second provider may be needed if restorative stays booked out." });
    return items;
  }
  if (part === 4) return [{ queue: "training", queueLabel: "Training", text: "Hygiene clinical standards: perio, fluoride, and production per day." }];
  if (part === 5) {
    return [
      { queue: "insurance", queueLabel: "Insurance", text: "Claims within 24–48 hours, the 60–90 day AR board, and denials." },
      { queue: "accounting", queueLabel: "Accounting", text: "KPI view of collections and days in AR." },
      { queue: "training", queueLabel: "Training", text: "Checkout financial conversation for patient balances." },
    ];
  }
  return [{ queue: "other", queueLabel: "Other", text: "Ask DPCP to look at this metric." }];
}

export const EXPLAINER = "A practice earns money through a chain: patients arrive, get examined, accept treatment, get scheduled, and pay. The Balance Assessment uses ratios to find the weakest link in your own practice, so you fix one thing at a time, in the right order.";

export const SEQUENCE_COPY = "A practice can't convert its way out of a patient-flow problem, or collect its way out of a conversion problem. Start at the highest imbalance.";
