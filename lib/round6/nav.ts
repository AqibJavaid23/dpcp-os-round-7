import type { DepartmentId, Role } from "@/lib/types";
import { copilotForDepartment } from "@/lib/round6/copilots";

export const ROLE_META: Record<Role, { label: string; line: string; accent: string; hero: string }> = {
  employee: { label: "DPCP Employee", line: "One day on the central team, already prepared.", accent: "#123B78", hero: "Your day" },
  leader: { label: "DPCP Lead", line: "Your team, what is late, and what needs you.", accent: "#0E6B5C", hero: "Your team today" },
  administrator: { label: "DPCP Admin", line: "People, access, and how the company is set up.", accent: "#3E4C6B", hero: "Company setup" },
  george: { label: "George", line: "Your day as CEO. The company, and what only you can move.", accent: "#0B254B", hero: "The company" },
  owner: { label: "Practice Owner", line: "Your office, in one picture.", accent: "#1F4D3A", hero: "Your office" },
};

export function departmentTab(departmentId: DepartmentId): [string, string] {
  const copilot = copilotForDepartment(departmentId);
  if (departmentId === "owner") return ["/departments", "Copilots"];
  return [copilot.href, copilot.short];
}

export function mainTabsFor(role: Role, departmentId: DepartmentId): [string, string][] {
  const today: [string, string] = [role === "owner" ? "/owner" : "/workday", role === "owner" ? "Home" : "Today"];
  const dept = departmentTab(departmentId);
  const communication: [string, string] = ["/communication", "Communication"];
  const review: [string, string] = ["/review", "Review"];
  const ai: [string, string] = ["/use-ai", "AI"];
  const teams: [string, string] = ["/teams", "My Teams"];
  const meetings: [string, string] = ["/meetings", "Meetings"];
  const more: [string, string] = ["/more", "More"];
  if (role === "owner") {
    return [
      ["/owner", "Home"],
      ["/owner-tickets", "Tickets"],
      review,
      meetings,
      ["/departments", "Copilots"],
      ai,
      more,
    ];
  }
  if (role === "employee" || role === "leader") return [today, communication, review, ai, teams, meetings, dept, more];
  if (role === "administrator") return [today, dept, communication, teams, meetings, review, ai, more];
  if (role === "george") return [today, review, meetings, dept, communication, teams, ai, more];
  return [today, communication, review, ai, teams, meetings, dept, more];
}
