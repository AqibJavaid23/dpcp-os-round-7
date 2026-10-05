import type { IdeaStatus, ProductIdea } from "@/lib/types";

export const IDEA_FLOW: IdeaStatus[] = ["received", "planned", "building", "shipped"];

export const IDEA_LABEL: Record<IdeaStatus, string> = {
  received: "Received",
  planned: "Planned",
  building: "Building",
  shipped: "Shipped",
};

export const THEMES: Record<string, { title: string; summary: string }> = {
  workday: {
    title: "A clearer workday",
    summary: "People want the phone and the day list to show the real date, the Monday three, and what is actually next.",
  },
  connection: {
    title: "Seeing the team",
    summary: "Check-ins, appreciations, and who is new. People want connection without opening five screens.",
  },
  client: {
    title: "Client-facing craft",
    summary: "Drafts, logos, and the send button. The notes are about looking like one company to a practice.",
  },
  voice: {
    title: "Saying it out loud",
    summary: "People would rather talk than type when the thought is short. Voice notes on feedback and check-ins.",
  },
  other: {
    title: "Other",
    summary: "Not enough of a pattern yet. The Architect can still read each one.",
  },
};

export function themeFor(text: string): string {
  const q = text.toLowerCase();
  if (/due date|phone|workday|priority|monday|list/.test(q)) return "workday";
  if (/check-in|team|culture|shout|birthday|new hire|appreciation/.test(q)) return "connection";
  if (/client|email|logo|brand|draft|signature/.test(q)) return "client";
  if (/voice|speak|talk|mic|feedback/.test(q)) return "voice";
  return "other";
}

export function nextIdeaStatus(status: IdeaStatus): IdeaStatus | null {
  const i = IDEA_FLOW.indexOf(status);
  return i < 0 || i >= IDEA_FLOW.length - 1 ? null : IDEA_FLOW[i + 1];
}

export function createIdeas(): ProductIdea[] {
  return [
    {
      id: "idea-omar-checkin",
      authorId: "omar",
      title: "Show check-in status on My Teams",
      body: "I want to see who attended, who used the AI call, and who is missing without opening each person.",
      mode: "text",
      screen: "/teams",
      screenTitle: "My Teams",
      at: "Oct 16",
      status: "shipped",
      votes: ["nadia", "faisal", "imran", "george"],
      themeId: "connection",
      credited: true,
    },
    {
      id: "idea-faisal-due",
      authorId: "faisal",
      title: "Show the original due date on the phone card",
      body: "I keep missing that the original date is different from today. Put both on the card.",
      mode: "text",
      screen: "/workday",
      screenTitle: "My Workday",
      at: "Oct 18",
      status: "planned",
      votes: ["sana", "nadia", "hina"],
      themeId: "workday",
      credited: false,
    },
    {
      id: "idea-priya-logo",
      authorId: "priya",
      title: "Department logo on the email draft",
      body: "The draft should already wear the Marketing copilot logo, not a blank header I fix by hand.",
      mode: "text",
      screen: "/review",
      screenTitle: "Review",
      at: "Oct 19",
      status: "building",
      votes: ["leila", "george"],
      themeId: "client",
      credited: false,
    },
    {
      id: "idea-sana-voice",
      authorId: "sana",
      title: "Let me leave a voice note instead of typing",
      body: "When something is stuck I can say it faster than I can write it. A short voice note on feedback would help.",
      mode: "voice",
      screen: "/workday",
      screenTitle: "My Workday",
      at: "Oct 19",
      status: "received",
      votes: ["imran"],
      themeId: "voice",
      credited: false,
    },
    {
      id: "idea-rowan-monday",
      authorId: "rowan",
      title: "Monday's three should open the week",
      body: "We say our three priorities on Monday and then the workday ignores them. The list should start there.",
      mode: "text",
      screen: "/meetings",
      screenTitle: "Meetings",
      at: "Oct 13",
      status: "building",
      votes: ["omar", "leila", "amina"],
      themeId: "workday",
      credited: false,
    },
  ];
}

export function screenTitleFor(pathname: string): string {
  if (pathname.startsWith("/tasks")) return "Task";
  if (pathname.startsWith("/meetings")) return "Meeting";
  if (pathname.startsWith("/check-in")) return "Check-in";
  if (pathname.startsWith("/people")) return "People";
  if (pathname.startsWith("/ideas")) return "Ideas & Roadmap";
  const known: Record<string, string> = {
    "/": "Home",
    "/workday": "My Workday",
    "/today": "My Workday",
    "/growth": "Growth",
    "/communication": "Communication",
    "/messages": "Communication",
    "/review": "Review",
    "/use-ai": "AI",
    "/chat": "AI",
    "/calendar": "Calendar",
    "/teams": "My Teams",
    "/team": "My Teams",
    "/company": "Company",
    "/system": "System",
    "/usage": "AI usage vs output",
    "/orientation": "Orientation",
    "/onboarding": "First week",
    "/offboard": "Ideas",
  };
  return known[pathname] ?? "DPCP OS";
}
