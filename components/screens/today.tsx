"use client";

import { useState } from "react";
import Link from "next/link";
import { MeetingBadge } from "@/components/meeting-badge";
import { PageFrame } from "@/components/app-shell";
import { TodayFloorTasks } from "@/components/round2/wired";
import { AppointmentsToday, CatchUpCard } from "@/components/round4/experience";
import { meetingCategory } from "@/lib/meeting-style";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

function isWorkProduct(kind: string) {
  return kind === "document" || kind === "spreadsheet" || kind === "presentation";
}

export function TodayScreen() {
  const app = useApp();
  const [banner, setBanner] = useState(true);
  const [justDone, setJustDone] = useState<string | null>(null);
  const dept = app.viewer.departmentId === "owner" ? "operations" : app.viewer.departmentId;
  const openTasks = app.myTasks.filter((task) => task.status !== "done");
  const doneTasks = app.model.tasks.filter((task) => task.ownerId === app.viewer.id && task.status === "done");
  const meetings = app.model.meetings.filter(
    (meeting) => meeting.dayGroup === "Today" && (meeting.departmentId === dept || meetingCategory(meeting) === "client")
  );
  const replies = app.model.messages.filter((message) => message.ownerId === app.viewer.id && (message.tab === "reply" || message.tab === "decision" || message.tab === "held"));
  const reviews = app.model.reviews.filter(
    (review) =>
      isWorkProduct(review.kind) &&
      (review.ownerId === app.viewer.id || app.ui.role === "george") &&
      (review.state === "needs_review" || review.state === "ready_again")
  );

  return (
    <PageFrame title="Today" lede="What a successful day looks like. Start at the top.">
      <section>
        <h2 className="font-heading text-2xl text-dpcp-navy">Preview of the day</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link href="/communication" className="rounded-3xl bg-white px-5 py-5 no-underline shadow-[0_8px_30px_rgba(18,59,120,0.06)]">
            <p className="font-heading text-3xl text-dpcp-navy">{replies.length + (app.noticeOpen ? 1 : 0)}</p>
            <p className="mt-1 text-sm text-muted-foreground">Communications that need you</p>
          </Link>
          <Link href="/review" className="rounded-3xl bg-white px-5 py-5 no-underline shadow-[0_8px_30px_rgba(18,59,120,0.06)]">
            <p className="font-heading text-3xl text-dpcp-navy">{reviews.length}</p>
            <p className="mt-1 text-sm text-muted-foreground">{reviews.length === 1 ? "ready to review" : "ready to review"}</p>
          </Link>
        </div>
        {banner && (
          <div className="mt-4 flex items-start justify-between gap-4 rounded-3xl bg-[#E7EEF6] px-5 py-4 text-dpcp-navy">
            <p className="text-sm leading-relaxed">
              Canyon View moved from 1:00 to 1:30. The office manager asked for thirty more minutes. Your prep stays on the list.
            </p>
            <button type="button" className="text-sm" onClick={() => setBanner(false)} aria-label="Dismiss">
              Close
            </button>
          </div>
        )}
        <AppointmentsToday />
        <CatchUpCard />
        <div className="mt-4 space-y-3">
          {meetings.map((meeting) => (
            <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="block rounded-3xl bg-white px-4 py-4 no-underline shadow-[0_8px_30px_rgba(18,59,120,0.06)]">
              <MeetingBadge meeting={meeting} />
              <p className="mt-2 text-base font-medium text-dpcp-navy">{meeting.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{meeting.when} {meeting.zone}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl text-dpcp-navy">To-do</h2>
        <TodayFloorTasks />
        <ol className="mt-4 space-y-3">
          {openTasks.length === 0 && <li className="text-sm text-muted-foreground">Nothing open.</li>}
          {openTasks.map((task) => (
            <li key={task.id}>
              <div className="flex items-start gap-4 rounded-3xl bg-white px-4 py-4 shadow-[0_8px_30px_rgba(18,59,120,0.06)]">
                <CheckControl
                  done={justDone === task.id}
                  label="Mark done"
                  onClick={() => {
                    app.markDone(task.id);
                    setJustDone(task.id);
                  }}
                />
                <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1 no-underline">
                  <p className="text-base font-medium text-dpcp-navy">{task.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{task.client ? task.client : task.dueLabel}</p>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-2xl text-dpcp-navy">Completed</h2>
        <ol className="mt-4 space-y-3">
          {doneTasks.length === 0 && <li className="text-sm text-muted-foreground">Finished work lands here.</li>}
          {doneTasks.map((task) => (
            <li key={task.id}>
              <div className="flex items-start gap-4 rounded-3xl bg-white px-4 py-4 shadow-[0_8px_30px_rgba(18,59,120,0.06)]">
                <CheckControl done label="Finished" />
                <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1 no-underline">
                  <p className="text-base font-medium text-muted-foreground line-through">{task.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Finished</p>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </PageFrame>
  );
}

function CheckControl({ done, label, onClick }: { done: boolean; label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!onClick}
      className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center", done && "day-check")}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" className={cn("h-6 w-6", done ? "text-dpcp-blue" : "text-[#c5c9d1]")} aria-hidden>
        <circle cx="12" cy="12" r="10" fill={done ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" />
        <path d="M7.5 12.5 10.5 15.5 16.5 8.5" fill="none" stroke={done ? "white" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
