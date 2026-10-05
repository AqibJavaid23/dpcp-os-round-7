import type { ClientFeedback, Department, Person } from "@/lib/types";

export const FEEDBACK_LINK = "/feedback/form";

export function createFeedback(): ClientFeedback[] {
  return [
    {
      id: "fb-mesa",
      sentiment: "negative",
      source: "form",
      practice: "Mesa Ridge Dental",
      clientName: "Laura Chen",
      aboutId: "nadia",
      ownerId: "omar",
      chain: ["nadia", "omar", "george"],
      escalated: true,
      status: "in_progress",
      summary: "The September reply took too long, and the first note didn't explain the drop.",
      body: "We asked on Monday and didn't get a clear answer until late Tuesday. Please have someone own this.",
      detected: false,
      followUp:
        "Laura, I'm Omar, Nadia's lead. You're right that the first note was late. The short version: two payer batches posted on Oct 2, so they show in October. I'll stay on this until you're satisfied.\n\nOmar Hale\nDental Practice Copilot",
      notes: [{ at: "9:40 AM", author: "Omar Hale", text: "Calling Laura today. Nadia has the batch list ready." }],
      timeline: [
        { at: "9:12 AM", text: "Laura submitted the branded feedback form." },
        { at: "9:12 AM", text: "Assigned to Omar Hale, Nadia's direct supervisor." },
        { at: "9:12 AM", text: "Reported up to George." },
        { at: "9:40 AM", text: "Omar added a note and started the resolution." },
      ],
    },
    {
      id: "fb-canyon",
      sentiment: "negative",
      source: "email",
      practice: "Canyon View Smiles",
      clientName: "Office manager",
      aboutId: "imran",
      ownerId: "omar",
      chain: ["imran", "omar", "george"],
      escalated: true,
      status: "new",
      summary: "No one has said where the appeal stands.",
      body: "We emailed about the appeal and the reply we got didn't say who owns it or when we'll hear back.",
      detected: true,
      followUp:
        "Thanks for telling us. I'm Omar, and I own this until it's clear. Imran is blocked on a copy from your office. I'll send the status today and a date for the next update.\n\nOmar Hale\nDental Practice Copilot",
      notes: [],
      timeline: [
        { at: "8:50 AM", text: "Arrived as email. AI recognized it as client feedback." },
        { at: "8:50 AM", text: "Routed into this inbox. Assigned to Omar Hale." },
        { at: "8:50 AM", text: "Reported up to George." },
      ],
    },
    {
      id: "fb-hill",
      sentiment: "negative",
      source: "text",
      practice: "Hill Ridge Dental",
      clientName: "Dr. Shah",
      aboutId: "priya",
      ownerId: "george",
      chain: ["priya", "george"],
      escalated: true,
      status: "new",
      summary: "The social draft didn't sound like their practice.",
      body: "The post you sent for approval doesn't sound like us. Please don't publish it.",
      detected: true,
      followUp:
        "Dr. Shah, thank you. I'm George, and I have this. We will not publish that draft. Priya will send a revised post that matches your voice, and I'll look at it before it comes back to you.\n\nGeorge\nDental Practice Copilot",
      notes: [],
      timeline: [
        { at: "10:02 AM", text: "Arrived as a text. AI routed it in as negative feedback." },
        { at: "10:02 AM", text: "Priya leads Marketing, so George is the owner." },
        { at: "10:02 AM", text: "George was notified. There is no layer above him." },
      ],
    },
    {
      id: "fb-saguaro",
      sentiment: "positive",
      source: "email",
      practice: "Saguaro Family Dental",
      clientName: "Dr. Patel",
      aboutId: "faisal",
      ownerId: "omar",
      chain: ["faisal"],
      escalated: false,
      status: "resolved",
      summary: "Thanked Faisal for a clear posting update.",
      body: "Faisal's note on the posting was the clearest update we've had. Please pass that on.",
      detected: true,
      followUp: "",
      notes: [],
      timeline: [
        { at: "7:55 AM", text: "Arrived as email. AI filed it as positive feedback." },
        { at: "7:55 AM", text: "Logged for Faisal's lead. Not escalated." },
      ],
    },
  ];
}

export function supervisorId(aboutId: string, people: Person[], departments: Department[]) {
  const person = people.find((p) => p.id === aboutId);
  if (!person || person.id === "george") return "george";
  const dept = departments.find((d) => d.id === person.departmentId);
  if (!dept || dept.leadId === person.id) return "george";
  return dept.leadId;
}

export function escalationChain(aboutId: string, people: Person[], departments: Department[]) {
  const chain = [aboutId];
  let current = aboutId;
  const seen = new Set<string>();
  while (current !== "george" && !seen.has(current)) {
    seen.add(current);
    const next = supervisorId(current, people, departments);
    if (!chain.includes(next)) chain.push(next);
    current = next;
  }
  if (!chain.includes("george")) chain.push("george");
  return chain;
}

export function feedbackStatusLabel(status: ClientFeedback["status"]) {
  switch (status) {
    case "new":
      return "New";
    case "in_progress":
      return "In progress";
    case "follow_up":
      return "Client follow-up sent";
    case "resolved":
      return "Resolved";
  }
}
