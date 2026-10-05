"use client";

import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";
import { MEETING_STYLE, meetingCategory, meetingTypeLabel, meetingVisibleTo } from "@/lib/meeting-style";
import { useApp } from "@/lib/store";
import type { Meeting } from "@/lib/types";

const WEEK = [
  { id: "mon", label: "Mon 19" },
  { id: "tue", label: "Tue 20" },
  { id: "wed", label: "Wed 21" },
  { id: "thu", label: "Thu 22" },
  { id: "fri", label: "Fri 23" },
];

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];

function hourLabel(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const face = hour > 12 ? hour - 12 : hour;
  return `${face} ${suffix}`;
}

function place(meeting: Meeting): { day: string; hour: number } | null {
  const when = meeting.when;
  let day = "";
  if (meeting.dayGroup === "Today") day = "tue";
  else if (/Mon/i.test(when) || /Yesterday/i.test(when)) day = "mon";
  else if (/Tue/i.test(when)) day = "tue";
  else if (/Wed/i.test(when)) day = "wed";
  else if (/Thu/i.test(when)) day = "thu";
  else if (/Fri/i.test(when)) day = "fri";
  if (!day) return null;
  const match = when.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return { day, hour };
}

export function CalendarScreen() {
  const app = useApp();
  const departments = app.myMemberships.map((membership) => membership.departmentId);
  const visible = app.model.meetings.filter((meeting) =>
    meetingVisibleTo(meeting, { departmentId: app.viewer.departmentId, role: app.ui.role }, departments)
  );
  const todayMeetings = visible.filter((meeting) => meeting.dayGroup === "Today");
  const placed = visible
    .map((meeting) => ({ meeting, slot: place(meeting) }))
    .filter((row): row is { meeting: Meeting; slot: { day: string; hour: number } } => row.slot !== null);

  return (
    <PageFrame title="Calendar" lede="When you need to be with people.">
      <section>
        <h2 className="font-heading text-2xl text-dpcp-navy">Today</h2>
        <div className="mt-4 space-y-3">
          {todayMeetings.map((meeting) => (
            <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="block no-underline">
              <Surface>
                <p className="text-sm text-muted-foreground">{meeting.when} {meeting.zone}</p>
                <p className="mt-1 text-lg font-medium text-dpcp-navy">{meeting.title}</p>
                <p className="mt-1 text-sm" style={{ color: MEETING_STYLE[meetingCategory(meeting)].color }}>
                  {meetingTypeLabel(meeting)}
                </p>
              </Surface>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl text-dpcp-navy">This week</h2>
        <div className="mt-4 overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-[4.5rem_repeat(5,minmax(0,1fr))]">
            <div />
            {WEEK.map((day) => (
              <div key={day.id} className={`px-2 pb-2 text-sm font-medium ${day.id === "tue" ? "text-dpcp-navy" : "text-muted-foreground"}`}>
                {day.label}
              </div>
            ))}
            {HOURS.map((hour) => (
              <div key={hour} className="contents">
                <div className="border-t border-[#eceef2] py-2 pr-2 text-xs text-muted-foreground">{hourLabel(hour)}</div>
                {WEEK.map((day) => {
                  const items = placed.filter((row) => row.slot.day === day.id && row.slot.hour === hour);
                  return (
                    <div key={`${day.id}-${hour}`} className="min-h-16 border-t border-[#eceef2] p-1">
                      {items.map(({ meeting }) => {
                        const style = MEETING_STYLE[meetingCategory(meeting)];
                        return (
                          <Link
                            key={meeting.id}
                            href={`/meetings/${meeting.id}`}
                            className="mb-1 block rounded-xl px-2 py-1 text-xs no-underline"
                            style={{ background: style.soft, color: style.color }}
                          >
                            <span className="font-medium">{meeting.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
