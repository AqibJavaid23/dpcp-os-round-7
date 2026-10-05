import type { ChatItem, Role } from "@/lib/types";

export interface RouteResult {
  hint: string;
  items: ChatItem[];
  effect?:
    | { type: "move-friday" }
    | { type: "add-task"; title: string; why: string }
    | { type: "decision"; title: string };
  countClarify?: boolean;
}

function id() {
  return `c-${Math.random().toString(36).slice(2, 8)}`;
}

export function routeText(
  text: string,
  ctx: { role: Role; clarifyTurns: number }
): RouteResult {
  const q = text.toLowerCase();

  if (
    /(sana|imran|hina|faisal|omar|priya|elena)/.test(q) &&
    /(message|execution|rate|inbox|salary|pay)/.test(q) &&
    ctx.role === "employee"
  ) {
    return {
      hint: "Checking what you can see…",
      items: [
        {
          id: id(),
          kind: "assistant",
          text: "That's outside what you can see. Want me to ask your lead?",
          routeNote: "Not allowed · instant",
        },
      ],
    };
  }

  if (/(discount|10%|can we give)/.test(q)) {
    return {
      hint: "Sending to your lead…",
      effect: { type: "decision", title: text },
      items: [
        {
          id: id(),
          kind: "assistant",
          text: "That needs a decision above you. I sent it to Omar Hale with this chat attached.",
          routeNote: "Sent to Omar Hale for a decision",
        },
      ],
    };
  }

  if (/(compare|across all|research|full report|q3)/.test(q)) {
    return {
      hint: "Sending to your AI for a bigger job…",
      effect: {
        type: "add-task",
        title: text.length > 80 ? `${text.slice(0, 76)}…` : text,
        why: "This was more than a quick answer, so it came back as a task.",
      },
      items: [
        {
          id: id(),
          kind: "job",
          title: text,
          started: "10:42 AM AZ",
          status: "working",
        },
      ],
    };
  }

  if (/(email|draft an email|send this to|send them)/.test(q) && !/(don't|do not)/.test(q)) {
    return {
      hint: "Drafting for your approval…",
      items: [
        {
          id: id(),
          kind: "approval",
          title: "Email the office manager",
          to: "Laura",
          body: "Hi Laura, here is the count you asked for. Happy to walk through it. Nadia",
        },
      ],
    };
  }

  if (/(move|friday|remind me|create a task)/.test(q)) {
    return {
      hint: "Checking your tasks…",
      items: [
        {
          id: id(),
          kind: "confirm",
          prompt: "Move “Deposit info from Saguaro Family Dental” to Fri Oct 23?",
          yes: "Yes",
          no: "No",
        },
      ],
    };
  }

  if (/(how many days|fee agreement|policy|how do we|sop|missing deposit)/.test(q)) {
    if (/(missing deposit)/.test(q)) {
      return {
        hint: "Looking in SOPs…",
        items: [
          {
            id: id(),
            kind: "assistant",
            text: "Ask the practice for the deposit date only, then log it on the task. Do not ask them to paste patient or member details into email.",
            routeNote: "SOP lookup · Payment posting SOP, section 4 · 3 sec",
          },
        ],
      };
    }
    return {
      hint: "Looking in SOPs…",
      items: [
        {
          id: id(),
          kind: "assistant",
          text: "10 business days from when it's sent. After that a reminder is flagged to the lead.",
          routeNote: "SOP lookup · Client Onboarding SOP v3, section 2 · 4 sec",
        },
      ],
    };
  }

  if (/(overdue|my tasks|on track|what's overdue|how many)/.test(q)) {
    const answer =
      ctx.role === "george"
        ? "Company on-time this week is 84% against an 80% target. Marketing is at 76%. Equipment is at 71%."
        : ctx.role === "leader"
          ? "Your team has 2 overdue items and 1 blocked person (Imran Cole)."
          : ctx.role === "administrator"
            ? "Access changes are on Manage access. Your own work is on My Workday."
          : "You have 1 item due at 12:00 PM AZ (Mesa Ridge reply) and 1 waiting on Laura.";
    return {
      hint: "Checking your tasks…",
      items: [
        {
          id: id(),
          kind: "assistant",
          text: answer,
          routeNote: "From your tasks · 2 sec",
        },
      ],
    };
  }

  if (/(denial|saguaro|send them)/.test(q) || ctx.clarifyTurns >= 1 && q.length < 8) {
    if (ctx.clarifyTurns >= 2) {
      return {
        hint: "Checking…",
        items: [
          {
            id: id(),
            kind: "assistant",
            text: "I'm not sure I've got this right. Want me to make it a task for a person?",
            routeNote: "Unsure · 2 questions asked",
          },
        ],
      };
    }
    return {
      hint: "Checking…",
      countClarify: true,
      items: [
        {
          id: id(),
          kind: "clarify",
          prompt: "Quick check so I do the right thing:",
          question: "Which result do you want?",
          options: [
            { id: "count", label: "Just show me this month's denial count here (instant)" },
            { id: "email", label: "Draft an email to the office manager with the numbers (you approve before it sends)" },
            { id: "report", label: "Build the full monthly denial report (~25 min, comes back as a task)" },
            { id: "else", label: "Something else…" },
          ],
          routeNote: "Router: not sure which route · asking 1 question instead of guessing",
        },
      ],
    };
  }

  return {
    hint: "Answering…",
    items: [
      {
        id: id(),
        kind: "assistant",
        text: "Keep it short and specific. Name the practice, the month, and the one fact they need. Offer a call only if they asked for one. I can drop that into the open draft if you want.",
        routeNote: "Quick answer · 3 sec",
      },
    ],
  };
}

export function outcomeForOption(optionId: string): RouteResult {
  if (optionId === "count") {
    return {
      hint: "Checking your tasks…",
      items: [
        {
          id: id(),
          kind: "assistant",
          text: "Saguaro Family Dental: 14 denials this month. That is a count only. Patient detail stays in the practice system.",
          routeNote: "From your tasks · 1 sec",
        },
      ],
    };
  }
  if (optionId === "email") {
    return {
      hint: "Drafting for your approval…",
      items: [
        {
          id: id(),
          kind: "approval",
          title: "Email the Saguaro office manager",
          to: "the office manager",
          body: "Hi, there are 14 denials on the October count. I can send the list of claim numbers from the practice system. Nadia",
        },
      ],
    };
  }
  if (optionId === "report") {
    return {
      hint: "Sending to your AI for a bigger job…",
      effect: {
        type: "add-task",
        title: "Monthly denial report · Saguaro Family Dental",
        why: "You asked for the full report. It will land on Today with counts and next steps only.",
      },
      items: [
        {
          id: id(),
          kind: "job",
          title: "Monthly denial report · Saguaro Family Dental",
          started: "10:42 AM AZ",
          status: "working",
        },
      ],
    };
  }
  return {
    hint: "",
    items: [],
  };
}
