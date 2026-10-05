import { PEOPLE } from "@/lib/seed";
import type { Person, Pillar, Task } from "@/lib/types";

export interface ChainStep {
  level: "You" | "Team" | "Department" | "Company" | "Mission";
  label: string;
  detail: string;
}

const DEPT: Record<string, { name: string; aim: string; company: string }> = {
  insurance: { name: "DICP", aim: "DICP department revenue", company: "company growth" },
  marketing: { name: "Dental Marketing Copilot", aim: "the marketing pipeline", company: "company growth" },
  staffing: { name: "Dental Staffing Copilot", aim: "coverage for every practice", company: "company capacity" },
  equipment: { name: "Equipment", aim: "equipment uptime", company: "company operations" },
  supplies: { name: "Supplies", aim: "supplies on the shelf", company: "company operations" },
  coaching: { name: "Coaching", aim: "coaching outcomes", company: "the company standard" },
  finance: { name: "Finance", aim: "clean books", company: "company growth" },
  operations: { name: "Operations", aim: "a week that runs clean", company: "company operations" },
  owner: { name: "the company", aim: "the company", company: "the mission" },
};

const TEAM: Record<string, { name: string; goal: string }> = {
  nadia: { name: "RCM team", goal: "RCM team's collections goal" },
  hina: { name: "RCM team", goal: "RCM team's collections goal" },
  jamie: { name: "RCM team", goal: "RCM team's collections goal" },
  faisal: { name: "Posting team", goal: "Posting team's same-day goal" },
  imran: { name: "Appeals team", goal: "Appeals team's close-out goal" },
  sana: { name: "Eligibility team", goal: "Eligibility team's same-week goal" },
  omar: { name: "Insurance leads", goal: "the lead's client-promise goal" },
  priya: { name: "Campaign team", goal: "the campaign team's reply goal" },
  leila: { name: "Coaching team", goal: "the coaching team's plan goal" },
  elena: { name: "Finance team", goal: "Finance's close goal" },
  jonas: { name: "Supplies team", goal: "the supplies team's fill goal" },
  theo: { name: "Equipment team", goal: "the equipment team's uptime goal" },
  amina: { name: "Staffing team", goal: "the staffing team's coverage goal" },
  rowan: { name: "Operations team", goal: "Operations' weekly rhythm" },
  george: { name: "the company", goal: "the company's commitments" },
};

function personOf(id: string): Person | undefined {
  return PEOPLE.find((p) => p.id === id);
}

function teamOf(person?: Person) {
  if (!person) return { name: "the team", goal: "the team's goal" };
  return TEAM[person.id] ?? { name: `${person.title} team`, goal: `${person.title}'s goal` };
}

function deptOf(person?: Person) {
  return DEPT[person?.departmentId ?? "operations"] ?? DEPT.operations;
}

export function chainFor(personId: string): ChainStep[] {
  const person = personOf(personId);
  const team = teamOf(person);
  const dept = deptOf(person);
  return [
    {
      level: "You",
      label: person?.name ?? "You",
      detail: person ? `${person.title}. The work in front of you today.` : "The work in front of you.",
    },
    { level: "Team", label: team.name, detail: team.goal },
    { level: "Department", label: dept.name, detail: dept.aim },
    { level: "Company", label: "Dental Practice Copilot", detail: dept.company },
  ];
}

function opening(task: Task): string {
  const q = `${task.title} ${task.why}`.toLowerCase();
  if (/collection|claim|ar follow|receipt/.test(q)) return "This claim follow-up";
  if (/appeal/.test(q)) return "This appeal";
  if (/eligib/.test(q)) return "This eligibility check";
  if (/posting|payment/.test(q)) return "This posting pass";
  if (/call|meeting|prep/.test(q)) return "This client conversation";
  if (/campaign|post|marketing/.test(q)) return "This campaign step";
  if (/deposit|pay|invoice|book/.test(q)) return "This money decision";
  if (task.client) return `This work for ${task.client}`;
  return "This task";
}

/** Situational line. The first link changes with the task. The rest is the chain. */
export function whyThisMatters(task: Task): string {
  const person = personOf(task.ownerId);
  const team = teamOf(person);
  const dept = deptOf(person);
  return `${opening(task)} → ${team.goal} → ${dept.aim} → ${dept.company}`;
}

export function isMeaningful(task: Task): boolean {
  const q = task.title.toLowerCase();
  return Boolean(
    task.client ||
      task.money ||
      task.kind === "approval" ||
      task.kind === "decision" ||
      /claim|collection|appeal|client|reply|campaign|deposit/.test(q)
  );
}

export function completionReminder(task: Task): string | null {
  if (!isMeaningful(task)) return null;
  const person = personOf(task.ownerId);
  const team = teamOf(person);
  const dept = deptOf(person);
  return `${opening(task)} is how the ${team.name} moves, and how ${dept.name} moves the company.`;
}

export function feedbackTemplates(personId: string): { pillar: Pillar; label: string; text: string }[] {
  const steps = chainFor(personId);
  const team = steps[1];
  const dept = steps[2];
  return [
    {
      pillar: "intelligence",
      label: "Name the chain",
      text: `You solved this at your level, and it moved ${team.detail}. That is how ${dept.label} gets better.`,
    },
    {
      pillar: "energy",
      label: "Stay with it",
      text: `You stayed with the work until it was done. ${steps[0].label} is what ${team.label} counted on, and ${dept.detail} depends on that.`,
    },
    {
      pillar: "integrity",
      label: "Tell the truth up the chain",
      text: `You told the truth early. The chain from you to ${team.label} to ${dept.label} to the company only holds if the hard part is said out loud.`,
    },
  ];
}
