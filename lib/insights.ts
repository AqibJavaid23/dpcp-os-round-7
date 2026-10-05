import type { PersonUsage, TimeDoctorDay, UsageWeek } from "@/lib/types";

const WEEK_LABELS = ["Sep 29", "Oct 6", "Oct 13", "Oct 20"];

/** This week is the last point. Earlier weeks are a steady trend, not a ranking. */
const USAGE_SEED: Record<string, { tokens: number; cost: number; tasks: number; execution: number }> = {
  nadia: { tokens: 184000, cost: 6.4, tasks: 22, execution: 88 },
  omar: { tokens: 142000, cost: 5.1, tasks: 16, execution: 91 },
  george: { tokens: 96000, cost: 4.2, tasks: 11, execution: 90 },
  imran: { tokens: 210000, cost: 8.8, tasks: 14, execution: 79 },
  sana: { tokens: 121000, cost: 4.4, tasks: 18, execution: 81 },
  faisal: { tokens: 99000, cost: 3.2, tasks: 20, execution: 92 },
  hina: { tokens: 12000, cost: 0.4, tasks: 0, execution: 86 },
  leila: { tokens: 156000, cost: 5.6, tasks: 15, execution: 93 },
  rowan: { tokens: 88000, cost: 3.1, tasks: 12, execution: 83 },
  amina: { tokens: 74000, cost: 2.6, tasks: 13, execution: 88 },
  priya: { tokens: 248000, cost: 9.4, tasks: 9, execution: 76 },
  elena: { tokens: 67000, cost: 2.2, tasks: 14, execution: 94 },
  jonas: { tokens: 81000, cost: 2.9, tasks: 11, execution: 80 },
  theo: { tokens: 133000, cost: 5.8, tasks: 7, execution: 71 },
  jamie: { tokens: 22000, cost: 0.8, tasks: 3, execution: 0 },
};

function weeksFor(seed: { tokens: number; cost: number; tasks: number; execution: number }): UsageWeek[] {
  const factors = [0.7, 0.82, 0.91, 1];
  return WEEK_LABELS.map((label, i) => ({
    label,
    tokens: Math.round(seed.tokens * factors[i]),
    cost: Math.round(seed.cost * factors[i] * 100) / 100,
    tasksDone: Math.max(0, Math.round(seed.tasks * factors[i])),
    execution: Math.min(100, Math.round(seed.execution * (0.94 + i * 0.02))),
  }));
}

export function createUsage(personIds: string[]): PersonUsage[] {
  return personIds.map((personId) => ({
    personId,
    weeks: weeksFor(USAGE_SEED[personId] ?? { tokens: 50000, cost: 2, tasks: 8, execution: 80 }),
  }));
}

export function efficiency(week: UsageWeek) {
  if (week.cost <= 0) return 0;
  return week.tasksDone / week.cost;
}

export function efficiencyTrend(weeks: UsageWeek[]) {
  const current = efficiency(weeks[weeks.length - 1]);
  const previous = efficiency(weeks[weeks.length - 2] ?? weeks[weeks.length - 1]);
  const delta = current - previous;
  const direction = Math.abs(delta) < 0.15 ? "flat" : delta > 0 ? "up" : "down";
  return { current, previous, delta, direction };
}

/** Frozen at 10:42 AM. Hours are since the person's shift started. */
const TIME_DOCTOR: TimeDoctorDay[] = [
  { personId: "nadia", trackedMin: 162, activity: 74, idleMin: 18, project: "Insurance & Billing", task: "Mesa Ridge reply", screenshot: "An email draft and a collections sheet. No patient chart." },
  { personId: "omar", trackedMin: 148, activity: 81, idleMin: 11, project: "Insurance & Billing", task: "Unblock Canyon View", screenshot: "The team task list and a Meet tab." },
  { personId: "george", trackedMin: 171, activity: 69, idleMin: 22, project: "Owner", task: "BrightDent deposit", screenshot: "A decision card and a calendar. No payroll figures." },
  { personId: "imran", trackedMin: 196, activity: 61, idleMin: 44, project: "Insurance & Billing", task: "Canyon View appeal", screenshot: "A practice portal list. Member IDs are not in the summary." },
  { personId: "sana", trackedMin: 188, activity: 77, idleMin: 16, project: "Insurance & Billing", task: "Eligibility checks", screenshot: "A count sheet. No chart." },
  { personId: "faisal", trackedMin: 204, activity: 86, idleMin: 9, project: "Insurance & Billing", task: "Payment posting", screenshot: "A posting queue. Amounts are totals only." },
  { personId: "hina", trackedMin: 0, activity: 0, idleMin: 0, project: "Out", task: "Time off", screenshot: "No screenshots. Out today." },
  { personId: "leila", trackedMin: 155, activity: 83, idleMin: 12, project: "Coaching", task: "Sunridge action plan", screenshot: "A plan draft. No clinical notes." },
  { personId: "rowan", trackedMin: 140, activity: 72, idleMin: 20, project: "Operations", task: "Friday pillar report", screenshot: "A report outline and Slack." },
  { personId: "amina", trackedMin: 136, activity: 78, idleMin: 14, project: "People & Staffing", task: "Jamie's first week", screenshot: "An onboarding checklist." },
  { personId: "priya", trackedMin: 151, activity: 64, idleMin: 31, project: "Marketing", task: "Hill Ridge snapshot", screenshot: "A social draft. No patient photos." },
  { personId: "elena", trackedMin: 158, activity: 88, idleMin: 8, project: "Finance", task: "Payroll exceptions", screenshot: "An exception list. Pay figures are not in the summary." },
  { personId: "jonas", trackedMin: 144, activity: 75, idleMin: 17, project: "Supplies", task: "FDA blanks", screenshot: "A shipment sheet." },
  { personId: "theo", trackedMin: 132, activity: 58, idleMin: 36, project: "Equipment", task: "Mesa Verde lease", screenshot: "A lease comparison." },
  { personId: "jamie", trackedMin: 48, activity: 41, idleMin: 19, project: "Insurance & Billing", task: "Day 1 setup", screenshot: "The finish-setup screen." },
];

export function timeDoctorFor(personId: string): TimeDoctorDay {
  return (
    TIME_DOCTOR.find((row) => row.personId === personId) ?? {
      personId,
      trackedMin: 0,
      activity: 0,
      idleMin: 0,
      project: "—",
      task: "—",
      screenshot: "No Time Doctor row yet.",
    }
  );
}
