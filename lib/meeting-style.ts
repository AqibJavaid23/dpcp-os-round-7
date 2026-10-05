import type { Meeting } from "@/lib/types";

export type MeetingCategory = "daily" | "team" | "client" | "internal";

export const MEETING_STYLE: Record<MeetingCategory, { label: string; color: string; soft: string }> = {
  daily: { label: "Daily", color: "#123B78", soft: "#E7EEF6" },
  team: { label: "Team Meeting", color: "#0081CE", soft: "#E5F4FC" },
  client: { label: "Client Meeting", color: "#0E6B4F", soft: "#E6F5EE" },
  internal: { label: "Internal Meeting", color: "#5E6570", soft: "#F2F3F5" },
};

export function meetingCategory(meeting: Meeting): MeetingCategory {
  if (meeting.category) return meeting.category;
  if (meeting.kind === "daily") return "daily";
  if (meeting.type === "Client") return "client";
  return "internal";
}

export function meetingTypeLabel(meeting: Meeting): string {
  const category = meetingCategory(meeting);
  if (category === "daily") return meeting.slot === "evening" ? "Update Meeting" : "Stand-up Meeting";
  if (category === "team") return meeting.ledBy === "george" ? "Team Meeting · George-led" : "Team Meeting · leader-led";
  return MEETING_STYLE[category].label;
}

/** George sees every meeting. Everyone else sees their departments, plus client and company-wide meetings. */
export function meetingVisibleTo(
  meeting: Meeting,
  viewer: { departmentId: string; role: string },
  departmentIds: string[]
): boolean {
  if (viewer.role === "george" || viewer.departmentId === "owner") return true;
  if (!meeting.departmentId || meetingCategory(meeting) === "client") return true;
  return departmentIds.includes(meeting.departmentId);
}

