/** Placeholder copilot marks. Same shape, one color each. Real logos come later. */

export interface CopilotBrand {
  id: string;
  name: string;
  short: string;
  color: string;
  href: string;
  people: string[];
}

export const COPILOT_BRANDS: CopilotBrand[] = [
  { id: "insurance", name: "Dental Insurance Copilot", short: "Insurance", color: "#123B78", href: "/copilot/insurance", people: ["nadia", "omar", "imran", "sana", "faisal", "hina", "jamie"] },
  { id: "staffing", name: "Dental Staffing Copilot", short: "Staffing", color: "#0E6B5C", href: "/copilot/staffing", people: ["amina"] },
  { id: "equipment", name: "Dental Equipment Copilot", short: "Equipment", color: "#5C4B8A", href: "/copilot/equipment", people: ["theo"] },
  { id: "supplies", name: "Dental Supplies Copilot", short: "Supplies", color: "#C46B3A", href: "/copilot/supplies", people: ["jonas"] },
  { id: "it", name: "Dental IT Copilot", short: "IT", color: "#1B6CA8", href: "/copilot/it", people: ["rowan"] },
  { id: "accounting", name: "Dental Accounting Copilot", short: "Accounting", color: "#0B254B", href: "/copilot/accounting", people: ["elena"] },
  { id: "marketing", name: "Dental Marketing Copilot", short: "Marketing", color: "#0081CE", href: "/copilot/marketing", people: ["priya"] },
  { id: "construction", name: "Dental Construction Copilot", short: "Construction", color: "#8A5A2B", href: "/copilot/construction", people: ["leila"] },
  { id: "dpcp", name: "Dental Practice Copilot", short: "Practice", color: "#123B78", href: "/departments", people: ["george"] },
];

export function copilotById(id: string) {
  return COPILOT_BRANDS.find((item) => item.id === id) ?? COPILOT_BRANDS[8];
}

const DEPT_TO_COPILOT: Record<string, string> = {
  insurance: "insurance",
  staffing: "staffing",
  equipment: "equipment",
  supplies: "supplies",
  marketing: "marketing",
  finance: "accounting",
  operations: "it",
  coaching: "construction",
  owner: "dpcp",
};

export function copilotForDepartment(departmentId: string) {
  return copilotById(DEPT_TO_COPILOT[departmentId] ?? "dpcp");
}

export interface RaciRow {
  work: string;
  cells: { person: string; letter: "R" | "A" | "C" | "I" }[];
}

export const RACI: Record<string, RaciRow[]> = {
  insurance: [
    { work: "Credentialing", cells: [{ person: "Nadia Reyes", letter: "R" }, { person: "Omar Hale", letter: "A" }, { person: "Imran Cole", letter: "C" }] },
    { work: "Appeals", cells: [{ person: "Imran Cole", letter: "R" }, { person: "Omar Hale", letter: "A" }, { person: "Nadia Reyes", letter: "C" }] },
    { work: "Posting", cells: [{ person: "Faisal Adeyemi", letter: "R" }, { person: "Omar Hale", letter: "A" }, { person: "Sana Brooks", letter: "I" }] },
    { work: "Eligibility", cells: [{ person: "Sana Brooks", letter: "R" }, { person: "Omar Hale", letter: "A" }, { person: "Hina Moss", letter: "C" }] },
  ],
  staffing: [
    { work: "Requisitions", cells: [{ person: "Amina Farouk", letter: "R" }, { person: "Amina Farouk", letter: "A" }, { person: "George", letter: "I" }] },
    { work: "First week", cells: [{ person: "Amina Farouk", letter: "A" }, { person: "Omar Hale", letter: "C" }, { person: "Jamie Okonkwo", letter: "I" }] },
  ],
  equipment: [
    { work: "Room specs", cells: [{ person: "Theo March", letter: "R" }, { person: "Theo March", letter: "A" }, { person: "Leila Okonkwo", letter: "C" }] },
  ],
  supplies: [
    { work: "Standard kit", cells: [{ person: "Jonas Keller", letter: "R" }, { person: "Jonas Keller", letter: "A" }, { person: "Theo March", letter: "C" }] },
  ],
  it: [
    { work: "Access", cells: [{ person: "Rowan Blake", letter: "R" }, { person: "Rowan Blake", letter: "A" }, { person: "Amina Farouk", letter: "C" }] },
  ],
  accounting: [
    { work: "Monthly close", cells: [{ person: "Elena Voss", letter: "R" }, { person: "Elena Voss", letter: "A" }, { person: "George", letter: "I" }] },
  ],
  marketing: [
    { work: "Launch page", cells: [{ person: "Priya Shah", letter: "R" }, { person: "Priya Shah", letter: "A" }, { person: "Leila Okonkwo", letter: "C" }] },
  ],
  construction: [
    { work: "Opening gates", cells: [{ person: "Leila Okonkwo", letter: "R" }, { person: "Leila Okonkwo", letter: "A" }, { person: "Theo March", letter: "C" }] },
  ],
  dpcp: [
    { work: "Company direction", cells: [{ person: "George", letter: "A" }, { person: "Omar Hale", letter: "C" }, { person: "Amina Farouk", letter: "C" }] },
  ],
};
