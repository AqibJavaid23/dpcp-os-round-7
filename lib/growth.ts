import type { GrowthNote, GrowthPlan, GrowthReview, SkillGain } from "@/lib/types";

export const LEVELS = ["Foundation", "Practitioner", "Senior", "Lead"] as const;

export function createGrowthNotes(): GrowthNote[] {
  return [
    {
      id: "gn1",
      personId: "nadia",
      fromId: "omar",
      pillar: "intelligence",
      text: "You found the batch timing before anyone asked. That is the problem-solving we want seniors to do without a prompt.",
      at: "Oct 17",
    },
    {
      id: "gn2",
      personId: "nadia",
      fromId: "faisal",
      pillar: "energy",
      text: "You stayed with the Mesa Ridge thread until the draft was actually ready. I felt that.",
      at: "Oct 18",
    },
    {
      id: "gn3",
      personId: "nadia",
      fromId: "omar",
      pillar: "integrity",
      text: "When the first note to Laura was thin, you said so. Keep having that conversation early.",
      at: "Oct 19",
    },
    {
      id: "gn4",
      personId: "imran",
      fromId: "omar",
      pillar: "integrity",
      text: "You marked the appeal blocked instead of hiding it. That honesty lets me help.",
      at: "Oct 16",
    },
    {
      id: "gn5",
      personId: "omar",
      fromId: "george",
      pillar: "integrity",
      text: "You told Imran the truth about the appeal and stayed in it with him. That is leadership.",
      at: "Oct 15",
    },
    {
      id: "gn6",
      personId: "priya",
      fromId: "george",
      pillar: "intelligence",
      text: "The Hill Ridge draft solved the brief and missed their voice. Sit with them before the next one.",
      at: "Oct 18",
    },
  ];
}

export function createGrowthReviews(): GrowthReview[] {
  return [
    {
      personId: "nadia",
      period: "October 2026",
      status: "draft",
      summary:
        "Nadia is ready to be trusted with the hard client question, not only the prepared draft. She is on time, her clients score her well, and she still skips the morning check-in. The next step is Senior: own the conversation, including the one that says we were late.",
      scores: [
        { pillar: "intelligence", score: 4, note: "She traced the collections drop to posting dates without being handed the answer." },
        { pillar: "energy", score: 4, note: "88% on time, six-day streak, 74% activity. The morning check-in is still missing." },
        { pillar: "integrity", score: 3, note: "She can say when a note was thin. She does not yet lead that conversation with the client." },
      ],
      sources: [
        "On-time rate 88%",
        "Time Doctor: 2h 42m tracked, 74% activity",
        "Client score 4.7, one SLA miss",
        "Pillar recognitions this month",
        "Morning check-in missing, evening still ahead",
      ],
    },
    {
      personId: "imran",
      period: "October 2026",
      status: "draft",
      summary:
        "Imran tells the truth when he is stuck. The appeal is blocked on a copy from the practice, and he said so. Output is behind the SLA. Senior is later. This month is Energy: fewer silent hours, same honesty.",
      scores: [
        { pillar: "intelligence", score: 3, note: "He knows the appeal path. The missing copy is not a thinking problem." },
        { pillar: "energy", score: 2, note: "61% activity, 44 minutes idle, replies outside the SLA." },
        { pillar: "integrity", score: 4, note: "He marked the block instead of pretending it was moving." },
      ],
      sources: ["On-time rate 79%", "Time Doctor idle 44m", "Client score 4.2, four SLA misses", "Check-in done with AI"],
    },
    {
      personId: "omar",
      period: "October 2026",
      status: "final",
      summary:
        "Omar leads Insurance without making it a ranking. His own replies hit the SLA, and he is in the hard conversations. Keep the team’s check-ins honest, including his own.",
      scores: [
        { pillar: "intelligence", score: 4, note: "He sees the blocked appeal as a client promise, not a status." },
        { pillar: "energy", score: 4, note: "91% on time. 22 SLA hits, no misses on his replies." },
        { pillar: "integrity", score: 5, note: "He owns the Canyon View silence and Nadia’s thin first note." },
      ],
      sources: ["On-time rate 91%", "Client score 4.9", "Team check-ins", "George’s note on Oct 15"],
    },
  ];
}

export function createGrowthPlans(): GrowthPlan[] {
  return [
    {
      personId: "nadia",
      level: "Practitioner",
      nextLevel: "Senior",
      needs: [
        { pillar: "intelligence", text: "Solve a client question that was not already drafted for you.", ready: true },
        { pillar: "energy", text: "Both daily check-ins, for two weeks running.", ready: false },
        { pillar: "integrity", text: "Have one difficult client conversation yourself, then tell your lead how it went.", ready: false },
      ],
      goals: [
        { id: "g-nadia", pillar: "integrity", text: "Call Laura and say the first note was late, then give the batch timing.", thisWeek: true },
        { id: "g-nadia-2", pillar: "energy", text: "Do the morning check-in with the team or with AI before the first task.", thisWeek: false },
      ],
    },
    {
      personId: "imran",
      level: "Practitioner",
      nextLevel: "Senior",
      needs: [
        { pillar: "energy", text: "Bring client replies back inside the SLA for a month.", ready: false },
        { pillar: "intelligence", text: "Write the appeal path so someone else could finish it.", ready: false },
        { pillar: "integrity", text: "Keep marking blocks the hour they happen.", ready: true },
      ],
      goals: [
        { id: "g-imran", pillar: "energy", text: "Send Canyon View a dated status before the end of today.", thisWeek: true },
      ],
    },
    {
      personId: "omar",
      level: "Lead",
      nextLevel: "Lead, with a wider span",
      needs: [
        { pillar: "integrity", text: "Keep finalizing reviews in the person’s voice, not a score.", ready: true },
        { pillar: "energy", text: "The team’s morning check-in is complete without you chasing.", ready: false },
        { pillar: "intelligence", text: "One client problem a week that you hand back solved, not only unblocked.", ready: true },
      ],
      goals: [
        { id: "g-omar", pillar: "integrity", text: "Finalize Nadia’s October review after you talk with her.", thisWeek: true },
      ],
    },
    {
      personId: "jamie",
      level: "Foundation",
      nextLevel: "Practitioner",
      needs: [
        { pillar: "energy", text: "Finish orientation and a full week of both check-ins.", ready: false },
        { pillar: "intelligence", text: "Close one practice task with the definition of done.", ready: false },
        { pillar: "integrity", text: "Ask for help the same day you are stuck.", ready: false },
      ],
      goals: [
        { id: "g-jamie", pillar: "energy", text: "Finish the first-login orientation.", thisWeek: true },
      ],
    },
    {
      personId: "george",
      level: "Owner",
      nextLevel: "The company grows without you in every thread",
      needs: [
        { pillar: "integrity", text: "Hard news reaches you through the chain, and you stay out of the first reply.", ready: false },
        { pillar: "intelligence", text: "Decisions wait in DPCP OS, not in a mailbox you still open.", ready: false },
        { pillar: "energy", text: "You still do your own check-in.", ready: true },
      ],
      goals: [
        { id: "g-george", pillar: "integrity", text: "Finalize one review this week and leave the client reply to the lead.", thisWeek: true },
      ],
    },
  ];
}

export function createSkills(): SkillGain[] {
  return [
    { id: "sk1", personId: "nadia", name: "Explain a collections swing without a spreadsheet", pillar: "intelligence", at: "Oct 2", how: "Mesa Ridge, from the prepared draft" },
    { id: "sk2", personId: "nadia", name: "Say when a note was too thin", pillar: "integrity", at: "Oct 19", how: "Told Omar before the client had to" },
    { id: "sk3", personId: "omar", name: "Hold a blocked appeal without taking it over", pillar: "integrity", at: "Oct 16", how: "Stayed with Imran and the client" },
    { id: "sk4", personId: "faisal", name: "Write a posting update a client can use", pillar: "intelligence", at: "Oct 20", how: "Dr. Patel wrote back to say so" },
    { id: "sk5", personId: "imran", name: "Mark a block the hour it happens", pillar: "integrity", at: "Oct 16", how: "Canyon View appeal" },
  ];
}

export function planFor(plans: GrowthPlan[], personId: string): GrowthPlan {
  return (
    plans.find((plan) => plan.personId === personId) ?? {
      personId,
      level: "Practitioner",
      nextLevel: "Senior",
      needs: [
        { pillar: "intelligence", text: "Bring one unsolved client problem to a clear next step.", ready: false },
        { pillar: "energy", text: "Stay inside your on-time goal for the month.", ready: false },
        { pillar: "integrity", text: "Have one honest conversation you have been postponing.", ready: false },
      ],
      goals: [{ id: `${personId}-goal`, pillar: "integrity", text: "Name one hard conversation and have it this week.", thisWeek: true }],
    }
  );
}
