import type { CulturePost, CultureSuggestion, Pillar } from "@/lib/types";

export const PILLARS: Record<
  Pillar,
  { label: string; line: string; definition: string; examples: string[]; color: string; soft: string }
> = {
  intelligence: {
    label: "Intelligence",
    line: "Problem solving",
    definition: "Placeholder: seeing the real problem and solving it, not only finishing the step in front of you.",
    examples: [
      "Traces a collections drop to the posting date before anyone asks.",
      "Asks one clarifying question instead of guessing.",
      "Leaves the next person a path, not a puzzle.",
    ],
    color: "#0081CE",
    soft: "#E5F4FC",
  },
  energy: {
    label: "Energy",
    line: "Persistence and output",
    definition: "Placeholder: staying with the work until it is actually done, including the unglamorous part.",
    examples: [
      "Keeps a reply moving until it is sent.",
      "Shows up for both daily check-ins.",
      "Finishes the count the same day it is due.",
    ],
    color: "#C56A1A",
    soft: "#FBF1E6",
  },
  integrity: {
    label: "Integrity",
    line: "Honest conversations and strong leadership",
    definition: "Placeholder: telling the truth early, including the hard conversation, and leading that way.",
    examples: [
      "Says a note was thin before the client finds it.",
      "Marks a task blocked instead of hiding it.",
      "Gives credit in the room, not only in private.",
    ],
    color: "#123B78",
    soft: "#E7EEF6",
  },
};

/** The AI's guess. A person can change it before the post goes up. */
export function suggestPillar(text: string): Pillar {
  const q = text.toLowerCase();
  if (/honest|difficult|hard conversation|lead|own it|standard|truth|integrity|sorry|late/.test(q)) return "integrity";
  if (/streak|persist|output|sla|on time|hours|ship|reply|energy|birthday|showed up/.test(q)) return "energy";
  return "intelligence";
}

export const REACTION_LABEL = {
  proud: "Proud",
  thanks: "Thank you",
  withyou: "With you",
} as const;

export function createCulture(): CulturePost[] {
  return [
    {
      id: "win-faisal",
      kind: "win",
      authorId: "ai",
      aboutId: "faisal",
      title: "Dr. Patel thanked Faisal",
      body: "A client wrote that Faisal's posting update was the clearest one they've had. It came in by email, and it belongs here.",
      at: "7:56 AM",
      pillar: "intelligence",
      featured: true,
      reactions: [
        { personId: "omar", kind: "proud" },
        { personId: "nadia", kind: "thanks" },
      ],
      comments: [
        { id: "cc1", authorId: "omar", text: "Faisal, that clarity is the standard. Thank you.", at: "8:05 AM" },
      ],
    },
    {
      id: "shout-nadia",
      kind: "shout",
      authorId: "omar",
      aboutId: "nadia",
      title: "Nadia had the Mesa Ridge draft ready before the client asked twice",
      body: "The batch timing was already in the draft. That's the work that keeps a client calm.",
      at: "9:15 AM",
      pillar: "intelligence",
      reactions: [{ personId: "faisal", kind: "withyou" }],
      comments: [],
    },
    {
      id: "mile-sana",
      kind: "milestone",
      authorId: "ai",
      aboutId: "sana",
      title: "Happy birthday, Sana",
      body: "Sana Brooks. Today. The team is glad you're here.",
      at: "8:00 AM",
      pillar: "energy",
      reactions: [{ personId: "nadia", kind: "withyou" }],
      comments: [],
    },
    {
      id: "mile-elena",
      kind: "milestone",
      authorId: "ai",
      aboutId: "elena",
      title: "Elena, two years with us",
      body: "Elena Voss started Oct 20, 2024. Finance still closes because she does.",
      at: "8:00 AM",
      pillar: "integrity",
      reactions: [],
      comments: [],
    },
    {
      id: "welcome-jamie",
      kind: "welcome",
      authorId: "ai",
      aboutId: "jamie",
      title: "Meet our new teammate, Jamie Okonkwo",
      body: "Jamie joined Insurance & Billing on Oct 13, in Arizona, learning the collections queue with Omar and Nadia. Say hello in the thread.",
      at: "Oct 13",
      pillar: "energy",
      reactions: [{ personId: "nadia", kind: "withyou" }, { personId: "omar", kind: "proud" }],
      comments: [],
    },
    {
      id: "built-checkin",
      kind: "built",
      authorId: "ai",
      aboutId: "omar",
      title: "You asked, we built: team check-ins on My Teams",
      body: "Omar asked to see who had checked in without opening each person. Morning and evening status is on My Teams now. Thank you, Omar.",
      at: "Oct 18",
      pillar: "intelligence",
      reactions: [{ personId: "george", kind: "thanks" }],
      comments: [],
    },
    {
      id: "fri-faisal",
      kind: "appreciation",
      authorId: "nadia",
      aboutId: "faisal",
      title: "Faisal covered Hina's urgent items without being asked twice",
      body: "Friday appreciation. It counts toward the October spotlight.",
      at: "Fri, Oct 17",
      pillar: "energy",
      reactions: [],
      comments: [],
    },
    {
      id: "fri-omar",
      kind: "appreciation",
      authorId: "imran",
      aboutId: "omar",
      title: "Omar stayed in the appeal conversation after I said I was stuck",
      body: "Friday appreciation. Honest, and it helped.",
      at: "Fri, Oct 17",
      pillar: "integrity",
      reactions: [],
      comments: [],
    },
  ];
}

export function createCultureSuggestions(): CultureSuggestion[] {
  return [
    {
      id: "sug-nadia",
      aboutId: "nadia",
      title: "Nadia is on a 6-day on-time streak",
      body: "Execution is 88%, and the Mesa Ridge draft is ready for her to send.",
      reason: "From her on-time streak",
      pillar: "energy",
    },
    {
      id: "sug-leila",
      aboutId: "leila",
      title: "Leila closed the Sunridge plan review",
      body: "The action plan is with the client. CSAT on coaching this month is 4.8.",
      reason: "From a closed client plan and CSAT",
      pillar: "intelligence",
    },
    {
      id: "sug-omar",
      aboutId: "omar",
      title: "Omar's team replied inside the SLA 22 times this week",
      body: "No misses on his own replies. Worth saying out loud.",
      reason: "From client response times",
      pillar: "energy",
    },
  ];
}

const KIND_LABEL: Record<CulturePost["kind"], string> = {
  win: "Client win",
  shout: "Shout-out",
  milestone: "Milestone",
  suggested: "Worth celebrating",
  welcome: "New teammate",
  farewell: "Send-off",
  appreciation: "Friday appreciation",
  built: "You asked, we built",
};

export function cultureKindLabel(kind: CulturePost["kind"]) {
  return KIND_LABEL[kind];
}
