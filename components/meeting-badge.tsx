import { MEETING_STYLE, meetingCategory, meetingTypeLabel } from "@/lib/meeting-style";
import type { Meeting } from "@/lib/types";

export function MeetingBadge({ meeting }: { meeting: Meeting }) {
  const style = MEETING_STYLE[meetingCategory(meeting)];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: style.soft, color: style.color }}
    >
      {meetingTypeLabel(meeting)}
    </span>
  );
}
