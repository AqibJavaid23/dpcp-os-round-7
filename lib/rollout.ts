import type { RolloutCheck, RolloutRow, RolloutStage } from "@/lib/types";

export const SWITCH_DATE = "Mon Nov 2, 2026";

export const STAGE_LABEL: Record<RolloutStage, string> = {
  orientation: "Orientation",
  onboarding: "Onboarding complete",
  soft: "Soft launch",
  switched: "Switched",
};

const ORDER: RolloutStage[] = ["orientation", "onboarding", "soft", "switched"];

const STAGE: Record<string, RolloutStage> = {
  jamie: "orientation",
  theo: "orientation",
  priya: "onboarding",
  jonas: "onboarding",
  hina: "onboarding",
  nadia: "soft",
  imran: "soft",
  sana: "soft",
  faisal: "soft",
  rowan: "soft",
  omar: "switched",
  leila: "switched",
  amina: "switched",
  elena: "switched",
  george: "switched",
};

function checksFor(stage: RolloutStage, personId: string): RolloutCheck[] {
  const at = ORDER.indexOf(stage);
  return [
    { label: "First-login orientation", done: at >= 1 || personId === "nadia" },
    { label: "Connectors and Time Doctor", done: at >= 1 },
    { label: "Onboarding finished", done: at >= 2 },
    { label: "Working in the soft launch", done: at >= 2 },
    { label: "Whole job in DPCP OS", done: at >= 3 },
  ];
}

export function createRollout(people: { id: string }[]): RolloutRow[] {
  return people.map((person) => {
    const stage = STAGE[person.id] ?? "soft";
    const checks = checksFor(stage, person.id);
    if (stage === "orientation") checks[0] = { ...checks[0], done: false };
    return { personId: person.id, stage, checks };
  });
}

export function withStage(row: RolloutRow, stage: RolloutStage): RolloutRow {
  const checks = checksFor(stage, row.personId).map((check) =>
    check.label === "First-login orientation" && row.checks.find((c) => c.label === check.label)?.done
      ? { ...check, done: true }
      : check
  );
  return { ...row, stage, checks };
}

export function nextStage(stage: RolloutStage): RolloutStage {
  const i = ORDER.indexOf(stage);
  return ORDER[Math.min(ORDER.length - 1, i + 1)];
}

export function stageRank(stage: RolloutStage) {
  return ORDER.indexOf(stage);
}

export interface OffAppItem {
  tool: string;
  minutes: number;
  what: string;
  tip: string;
  inApp: string;
}

const OFF_APP: Record<string, OffAppItem[]> = {
  nadia: [
    {
      tool: "Gmail in the browser",
      minutes: 38,
      what: "Wrote the Mesa Ridge reply outside DPCP OS.",
      tip: "Open the prepared draft on My Workday and approve it. The batch list is already attached.",
      inApp: "My Workday",
    },
    {
      tool: "A spreadsheet",
      minutes: 27,
      what: "Retyped Desert Bloom counts into a sheet.",
      tip: "Enter the count on the verification task. That task is the record.",
      inApp: "The verification task",
    },
    {
      tool: "Slack",
      minutes: 14,
      what: "Asked who is covering Hina.",
      tip: "The morning check-in already names the backup. Look there before you ask.",
      inApp: "Start-of-day check-in",
    },
  ],
  imran: [
    {
      tool: "The practice portal",
      minutes: 52,
      what: "Waited in the portal for a copy, then noted it in Slack.",
      tip: "Mark the task blocked in DPCP OS. Your lead sees it without a second message.",
      inApp: "The appeal task",
    },
  ],
  priya: [
    {
      tool: "A design file",
      minutes: 44,
      what: "Edited the Hill Ridge post outside Review.",
      tip: "Hand the post to Review. The comments and the version stay together.",
      inApp: "Review",
    },
  ],
  george: [
    {
      tool: "Email",
      minutes: 22,
      what: "Answered a pricing question from the inbox.",
      tip: "That question is already a Decision. Approve it there so the answer is logged.",
      inApp: "Decisions",
    },
  ],
};

export function offAppFor(personId: string): OffAppItem[] {
  return OFF_APP[personId] ?? [
    {
      tool: "A browser tab",
      minutes: 18,
      what: "Finished a small update outside DPCP OS.",
      tip: "Start that update from the task. The AI already has the last version.",
      inApp: "AI",
    },
  ];
}

export function offAppMinutes(items: OffAppItem[]) {
  return items.reduce((sum, item) => sum + item.minutes, 0);
}

export interface BuildNext {
  pattern: string;
  people: number;
  minutes: number;
  build: string;
}

export const BUILD_NEXT: BuildNext[] = [
  {
    pattern: "Client replies typed in Gmail",
    people: 6,
    minutes: 220,
    build: "One-tap send from the prepared draft, so the reply never starts in the browser.",
  },
  {
    pattern: "Counts retyped into a sheet",
    people: 4,
    minutes: 130,
    build: "The count on the task is the record. Stop the second copy.",
  },
  {
    pattern: "Coverage questions in Slack",
    people: 5,
    minutes: 85,
    build: "Post the day's backup from the morning check-in, where people already look.",
  },
  {
    pattern: "Meeting notes in a separate doc",
    people: 3,
    minutes: 65,
    build: "The meeting recap in DPCP OS is the note. Don't ask anyone to paste it elsewhere.",
  },
];

export const ADOPTION = {
  insideShare: 71,
  offAppMinutes: 560,
  pastOrientation: 13,
  inOrPastSoft: 10,
  people: 15,
};
