import type { Tone } from "@/lib/types";

export interface PolishRow {
  label: string;
  ok: boolean;
  detail: string;
}

const POLISH: Record<string, PolishRow[]> = {
  "msg-mesa": [
    { label: "Subject line", ok: false, detail: "Use “Mesa Ridge Dental — September collections”. The practice name comes first." },
    { label: "Tone", ok: true, detail: "Warm, short, and specific. No stiff opener." },
    { label: "Signature", ok: false, detail: "Sign with your name, role, and Dental Practice Copilot." },
    { label: "Branding", ok: true, detail: "The DPCP header is on this thread." },
    { label: "Attachments", ok: true, detail: "The batch list is attached. No patient file." },
  ],
  "msg-patel": [
    { label: "Subject line", ok: true, detail: "Saguaro Family Dental — Eligibility for the new associate." },
    { label: "Tone", ok: true, detail: "Direct answer first." },
    { label: "Signature", ok: true, detail: "Name, role, and Dental Practice Copilot." },
    { label: "Branding", ok: true, detail: "Header artwork is the DPCP lockup." },
    { label: "Attachments", ok: true, detail: "Payer list attached. Counts only." },
  ],
};

export function polishFor(id: string): PolishRow[] {
  return (
    POLISH[id] ?? [
      { label: "Subject line", ok: true, detail: "Practice name, then the topic." },
      { label: "Tone", ok: true, detail: "Sounds like a person at Dental Practice Copilot." },
      { label: "Signature", ok: true, detail: "Name, role, Dental Practice Copilot." },
      { label: "Branding", ok: true, detail: "DPCP header is applied." },
      { label: "Attachments", ok: true, detail: "Only the file the client asked for." },
    ]
  );
}

export const POLISHED_DRAFT: Record<string, { subject: string; body: string }> = {
  "msg-mesa": {
    subject: "Mesa Ridge Dental — September collections",
    body: `Hi Laura, good question. Two payer batches ($14,210 total) were posted on Oct 2, so they'll show in October. Adjusted for timing, September is in line with August. I've attached the batch list. Happy to walk through it on a quick call.

Nadia Reyes
Insurance specialist
Dental Practice Copilot`,
  },
};

export interface PersonExperience {
  personId: string;
  reply: string;
  replyMin: number;
  slaHit: number;
  slaMiss: number;
  csat: number;
}

export const EXPERIENCE: PersonExperience[] = [
  { personId: "nadia", reply: "52m", replyMin: 52, slaHit: 18, slaMiss: 1, csat: 4.7 },
  { personId: "omar", reply: "41m", replyMin: 41, slaHit: 22, slaMiss: 0, csat: 4.9 },
  { personId: "imran", reply: "3h 10m", replyMin: 190, slaHit: 9, slaMiss: 4, csat: 4.2 },
  { personId: "sana", reply: "1h 05m", replyMin: 65, slaHit: 14, slaMiss: 1, csat: 4.6 },
  { personId: "faisal", reply: "38m", replyMin: 38, slaHit: 16, slaMiss: 0, csat: 4.8 },
  { personId: "hina", reply: "—", replyMin: 0, slaHit: 11, slaMiss: 0, csat: 4.5 },
  { personId: "leila", reply: "1h 20m", replyMin: 80, slaHit: 8, slaMiss: 1, csat: 4.8 },
  { personId: "priya", reply: "4h 05m", replyMin: 245, slaHit: 6, slaMiss: 3, csat: 4.1 },
  { personId: "amina", reply: "2h", replyMin: 120, slaHit: 4, slaMiss: 0, csat: 4.6 },
  { personId: "elena", reply: "1h 12m", replyMin: 72, slaHit: 5, slaMiss: 0, csat: 4.7 },
  { personId: "jonas", reply: "2h 40m", replyMin: 160, slaHit: 7, slaMiss: 2, csat: 4.3 },
  { personId: "theo", reply: "5h", replyMin: 300, slaHit: 3, slaMiss: 3, csat: 3.9 },
  { personId: "rowan", reply: "1h 30m", replyMin: 90, slaHit: 6, slaMiss: 1, csat: 4.4 },
  { personId: "george", reply: "35m", replyMin: 35, slaHit: 9, slaMiss: 0, csat: 4.9 },
  { personId: "jamie", reply: "—", replyMin: 0, slaHit: 0, slaMiss: 0, csat: 0 },
];

export function experienceFor(personId: string) {
  return EXPERIENCE.find((row) => row.personId === personId);
}

export const DEPT_REPLY: Record<string, string> = {
  insurance: "1h 12m",
  coaching: "1h 20m",
  operations: "1h 30m",
  staffing: "2h",
  marketing: "4h 05m",
  finance: "1h 12m",
  supplies: "2h 40m",
  equipment: "5h",
};

export function slaTone(tone: Tone | undefined): Tone {
  return tone ?? "neutral";
}
