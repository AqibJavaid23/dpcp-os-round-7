import type { CheckinLine, CheckinSlot, CheckinStatus, DailyCheckin, DepartmentId } from "@/lib/types";

export const CHECKIN_QUESTIONS: Record<CheckinSlot, string[]> = {
  morning: ["What did you finish yesterday?", "What are you taking today?", "What's blocking you?"],
  evening: ["What got done today?", "What didn't get done?", "What are you handing off?"],
};

export const CHECKIN_SUGGESTIONS: Record<CheckinSlot, string[]> = {
  morning: [
    "I closed yesterday's counts and filed the exceptions.",
    "Today I'm sending the reply that is ready and prepping the 1:00 meeting.",
    "Nothing is blocking me.",
  ],
  evening: [
    "The reply went out and the queue is entered.",
    "The meeting prep is still open.",
    "Urgent items are with my backup. I'll pick up the rest tomorrow.",
  ],
};

const MORNING: Record<string, CheckinStatus> = {
  nadia: "missing",
  omar: "attended",
  imran: "ai",
  sana: "attended",
  faisal: "missing",
  hina: "excused",
  jamie: "missing",
  leila: "attended",
  rowan: "ai",
  amina: "attended",
  priya: "missing",
  elena: "attended",
  jonas: "attended",
  theo: "missing",
  george: "attended",
};

const AI_ANSWERS: Record<string, string[]> = {
  imran: [
    "I finished two appeal statuses yesterday.",
    "Today is the Canyon View appeal.",
    "I'm blocked. The practice has not sent the copy I need.",
  ],
  rowan: [
    "I sent yesterday's vendor handoffs.",
    "Today is the Friday pillar report.",
    "No blocker. I'm waiting on one number from supplies.",
  ],
};

export function checkinLabel(status: CheckinStatus): string {
  switch (status) {
    case "attended":
      return "Attended team";
    case "ai":
      return "Done with AI";
    case "missing":
      return "Missing";
    case "upcoming":
      return "Later today";
    case "excused":
      return "Out today";
  }
}

export function checkinTone(status: CheckinStatus): "green" | "blue" | "amber" | "neutral" {
  if (status === "attended" || status === "ai") return "green";
  if (status === "missing") return "amber";
  if (status === "excused") return "neutral";
  return "blue";
}

function aiRecord(name: string, slot: CheckinSlot): { transcript: CheckinLine[]; summary: string[]; at: string } {
  const answers = AI_ANSWERS[name] ?? CHECKIN_SUGGESTIONS[slot];
  const questions = CHECKIN_QUESTIONS[slot];
  const transcript: CheckinLine[] = [
    { speaker: "ai", text: "Same three questions as the team meeting. I'll keep this short." },
    ...questions.flatMap((question, i) => [
      { speaker: "ai" as const, text: question },
      { speaker: "person" as const, text: answers[i] ?? "" },
    ]),
  ];
  return { transcript, summary: answers, at: "8:22 AM" };
}

export function createCheckins(people: { id: string; departmentId: DepartmentId; timeOff?: boolean }[]): DailyCheckin[] {
  const rows: DailyCheckin[] = [];
  for (const person of people) {
    const departmentId = person.departmentId === "owner" ? "operations" : person.departmentId;
    const morning = person.timeOff ? "excused" : (MORNING[person.id] ?? "attended");
    const evening: CheckinStatus = person.timeOff ? "excused" : "upcoming";
    const morningLog = morning === "ai" ? aiRecord(person.id, "morning") : undefined;
    rows.push({
      id: `${person.id}-morning`,
      personId: person.id,
      departmentId,
      slot: "morning",
      status: morning,
      at: morning === "attended" ? "8:15 AM" : morningLog?.at,
      summary:
        morning === "attended"
          ? ["In the start-of-day meeting."]
          : morningLog?.summary,
      transcript: morningLog?.transcript,
    });
    rows.push({
      id: `${person.id}-evening`,
      personId: person.id,
      departmentId,
      slot: "evening",
      status: evening,
      summary: evening === "excused" ? ["Out today. No evening check-in owed."] : undefined,
    });
  }
  return rows;
}

export function slotTitle(slot: CheckinSlot) {
  return slot === "morning" ? "Start of day" : "End of day";
}
