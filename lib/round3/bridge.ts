/** Desk requests and department tickets are one record. Live desk items project into the queue. */

import type { FloorRequest } from "@/lib/round2/context";
import type { Ticket, TicketDept, TicketPriority, TicketStatus } from "@/lib/round3/tickets";

const DEPT: Record<string, TicketDept> = {
  insurance: "insurance",
  equipment: "equipment",
  supplies: "supplies",
  staffing: "staffing",
  it: "it",
  accounting: "accounting",
  marketing: "marketing",
  construction: "construction",
  operations: "other",
};

function statusFor(req: FloorRequest): TicketStatus {
  if (req.rating) return "closed";
  if (req.stage === "done") return "resolved";
  if (req.stage === "received") return "new";
  if (req.stage === "ai") return "progress";
  return "progress";
}

export function floorToTicket(req: FloorRequest): Ticket {
  const department = DEPT[req.copilot] ?? "other";
  const priority: TicketPriority = req.urgency === "Today" ? "urgent" : req.urgency === "Whenever" ? "low" : "normal";
  const tier: Ticket["tier"] = req.practiceId === "saguaro" ? "Growth" : req.practiceId === "lakeview" || req.practiceId === "redrock" ? "Essentials" : "Full Partner";
  const status = statusFor(req);
  const openedAt = "2026-10-20T17:30:00Z";
  const specialist = req.stage !== "received" && req.stage !== "ai";
  return {
    id: req.id,
    number: `DP-${req.id.replace(/[^a-z0-9]/gi, "").slice(-4).toUpperCase()}`,
    practiceId: req.practiceId,
    requester: req.authorName,
    device: "Practice desk",
    department,
    type: req.kind === "appeal" ? "Appeal" : req.kind === "repair" ? "Repair" : req.category,
    priority,
    status,
    owner: specialist ? req.deptLabel : "AI triage",
    title: req.text,
    body: req.text,
    phi: department === "insurance",
    aiFirst: req.aiFirst,
    aiDid: req.aiDid || "AI is sorting this from the practice desk.",
    humanNeeded: req.humanTitle || "A person still approves anything that leaves the company.",
    openedAt,
    firstResponseAt: specialist ? "2026-10-20T17:36:00Z" : null,
    resolvedAt: status === "resolved" || status === "closed" ? "2026-10-20T17:40:00Z" : null,
    slaPaused: false,
    escalation: 0,
    rating: req.rating,
    ratingNote: req.ratingNote,
    tier,
    events: req.updates.map((update) => ({ at: update.at, text: update.text, by: update.text.toLowerCase().includes("ai") ? "ai" as const : "practice" as const })),
    replies: [],
  };
}

/** The gasket sample already lives in the ticket seed. Skip that one copy. */
export function liveDeskTickets(requests: FloorRequest[]) {
  return requests.filter((req) => req.id !== "req-gasket").map(floorToTicket);
}
