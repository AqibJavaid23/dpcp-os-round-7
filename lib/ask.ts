export type AskArea =
  | "workday"
  | "communication"
  | "review"
  | "calendar"
  | "meetings"
  | "teams";

export interface AskHit {
  id: string;
  title: string;
  detail: string;
}

export interface AskResult {
  answer: string;
  hits: AskHit[];
}

function has(q: string, ...words: string[]) {
  return words.some((word) => q.includes(word));
}

export function runAsk(area: AskArea, raw: string, hits: AskHit[]): AskResult {
  const q = raw.trim().toLowerCase();
  if (!q) {
    return { answer: "", hits: [] };
  }

  const match = (pred: (hit: AskHit) => boolean) => hits.filter(pred);
  const textOf = (hit: AskHit) => `${hit.title} ${hit.detail}`.toLowerCase();

  if (area === "workday") {
    if (has(q, "next", "should i", "what now", "focus")) {
      const first = hits[0];
      return {
        answer: first
          ? `Do this next: ${first.title}. ${first.detail}`
          : "Nothing needs you right now.",
        hits: first ? [first] : [],
      };
    }
    if (has(q, "approval", "approve", "waiting")) {
      const found = match((h) => has(textOf(h), "approv", "review", "draft"));
      return {
        answer: found.length
          ? `${found.length} thing${found.length === 1 ? "" : "s"} waiting on your yes.`
          : "Nothing is waiting on your approval.",
        hits: found,
      };
    }
    if (has(q, "prepar", "ai ")) {
      const found = match((h) => has(textOf(h), "prepar"));
      return {
        answer: found.length
          ? "Prepared for you. You still decide what goes out."
          : "Nothing new has been prepared.",
        hits: found,
      };
    }
  }

  if (area === "communication") {
    if (has(q, "patel")) {
      const found = match((h) => textOf(h).includes("patel"));
      return {
        answer: found.length
          ? "One email from Dr. Patel this week. It needs a person, not a template."
          : "No email from Dr. Patel this week.",
        hits: found,
      };
    }
    if (has(q, "reply", "need me", "waiting")) {
      const found = match((h) => has(textOf(h), "needs you", "reply", "decision"));
      return {
        answer: found.length ? "These still need you." : "Nobody is waiting on a reply from you.",
        hits: found,
      };
    }
    if (has(q, "draft")) {
      const found = match((h) => textOf(h).includes("draft"));
      return {
        answer: found.length ? "Drafts are ready. Nothing sends until you say so." : "No drafts waiting.",
        hits: found,
      };
    }
    if (has(q, "email", "gmail", "week")) {
      const found = match((h) => textOf(h).includes("gmail") || textOf(h).includes("email"));
      return { answer: "Emails in front of you this week.", hits: found };
    }
  }

  if (area === "review") {
    if (has(q, "changed", "comment", "again", "round")) {
      const found = match((h) => textOf(h).includes("ready again") || textOf(h).includes("changed"));
      return {
        answer: found.length
          ? "This one changed from your notes. The new lines are marked."
          : "Nothing has come back from your notes yet.",
        hits: found,
      };
    }
    if (has(q, "send", "approved")) {
      const found = match((h) => has(textOf(h), "approved", "sent"));
      return {
        answer: found.length ? "Approved, and still not sent until you send it." : "Nothing is approved and waiting to send.",
        hits: found,
      };
    }
    if (has(q, "draft", "waiting", "review")) {
      const found = match((h) => has(textOf(h), "needs your review", "ready for you"));
      return { answer: "Drafts waiting on you.", hits: found };
    }
  }

  if (area === "calendar") {
    if (has(q, "free", "afternoon", "open")) {
      return {
        answer: "You have a gap after 2:30 PM AZ today. The 1:00 with Canyon View is the only fixed meeting.",
        hits: match((h) => textOf(h).includes("1:00") || textOf(h).includes("canyon")),
      };
    }
    if (has(q, "out", "off", "cover")) {
      const found = match((h) => has(textOf(h), "out", "cover", "off"));
      return { answer: "Who is out, and who is covering.", hits: found };
    }
    if (has(q, "today", "on ")) {
      const found = match((h) => textOf(h).includes("today") || textOf(h).includes("tue"));
      return { answer: "Today, in order.", hits: found.length ? found : hits.slice(0, 2) };
    }
  }

  if (area === "meetings") {
    if (has(q, "prep", "prepare")) {
      const found = match((h) => has(textOf(h), "prep", "ready", "upcoming"));
      return { answer: "Prep that's worth your time before you join.", hits: found };
    }
    if (has(q, "owner", "recap")) {
      const found = match((h) => has(textOf(h), "owner", "recap"));
      return { answer: "The recap still needs a person to own one item.", hits: found };
    }
    if (has(q, "canyon")) {
      const found = match((h) => textOf(h).includes("canyon"));
      return { answer: "Canyon View is at 1:00 PM AZ. Prep is ready.", hits: found };
    }
  }

  if (area === "teams") {
    if (has(q, "overdue", "behind")) {
      const found = match((h) => has(textOf(h), "behind", "overdue", "blocked"));
      return { answer: "Who needs a person, not a reminder.", hits: found };
    }
    if (has(q, "block")) {
      const found = match((h) => textOf(h).includes("block"));
      return { answer: found.length ? "Blocked, and why." : "Nobody on this team is blocked.", hits: found };
    }
    if (has(q, "cover", "out", "off")) {
      const found = match((h) => has(textOf(h), "out", "cover", "off"));
      return { answer: "Who is out, and who has their urgent work.", hits: found };
    }
  }

  const words = q.split(/\s+/).filter((w) => w.length > 3);
  const found = hits.filter((hit) => words.some((word) => textOf(hit).includes(word)));
  if (found.length) {
    return { answer: `Showing what matches “${raw.trim()}”.`, hits: found };
  }
  return {
    answer: `Nothing matches “${raw.trim()}”. The next thing is still at the top.`,
    hits: [],
  };
}
