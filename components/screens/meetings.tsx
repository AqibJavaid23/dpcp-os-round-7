"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MeetingBadge } from "@/components/meeting-badge";
import { MEETING_STYLE, meetingCategory, meetingVisibleTo, type MeetingCategory } from "@/lib/meeting-style";
import { personCheckins } from "@/components/checkin-board";
import { TodaysWin } from "@/components/culture-feed";
import { checkinLabel, checkinTone } from "@/lib/checkins";
import { ErrorState, LoadingBlock, StatusTag, Surface } from "@/components/bits";
import { PageFrame } from "@/components/app-shell";
import { runAsk, type AskHit } from "@/lib/ask";
import { AbsentButton, Ledger, MeetingsTools, notesLabel, StillOpen, TakeNotes } from "@/components/round4/experience";
import { MeetingAi } from "@/components/round5/surfaces";
import { OwnerAppointments } from "@/components/round7/client";
import { useRound4 } from "@/lib/round4/store";
import { useApp } from "@/lib/store";
import type { Meeting } from "@/lib/types";

export function MeetingsScreen() {
  const app = useApp();
  if (app.ui.role === "owner") return <OwnerAppointments />;
  return <StaffMeetings />;
}

function StaffMeetings() {
  const app = useApp();
  const r4 = useRound4();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MeetingCategory | "all">("all");
  const hits: AskHit[] = app.model.meetings.map((m) => ({
    id: m.id,
    title: m.title,
    detail: `${m.when} ${m.prep} ${m.notes} ${m.dayGroup} prep recap owner`,
  }));
  const asked = runAsk("meetings", query, hits);
  const groups = ["Today", "Coming up", "Past"] as const;
  return (
    <PageFrame title="Meetings" lede="Stand-up, update, team, client, and internal. Each has its own mark.">
      <MeetingsTools />
      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip label="All" on={filter === "all"} onClick={() => setFilter("all")} />
        {(Object.keys(MEETING_STYLE) as MeetingCategory[]).map((key) => (
          <FilterChip
            key={key}
            label={MEETING_STYLE[key].label}
            on={filter === key}
            color={MEETING_STYLE[key].color}
            soft={MEETING_STYLE[key].soft}
            onClick={() => setFilter(key)}
          />
        ))}
      </div>
      {(filter === "all" || filter === "daily") && <RequiredMeetings />}
      {query && <p className="mb-3 text-sm">{asked.answer}</p>}
      {app.ui.screenState === "loading" ? (
        <LoadingBlock />
      ) : app.ui.screenState === "error" ? (
        <ErrorState message="Couldn't load this meeting. Your notes are safe in Drive." />
      ) : app.ui.screenState === "empty" ? (
        <Surface>
          <p>No meetings today.</p>
        </Surface>
      ) : (
        (() => {
          const departments = app.myMemberships.map((membership) => membership.departmentId);
          const visible = app.model.meetings.filter(
            (meeting) =>
              (filter === "all" || meetingCategory(meeting) === filter) &&
              (!query || asked.hits.some((hit) => hit.id === meeting.id)) &&
              meetingVisibleTo(meeting, { departmentId: app.viewer.departmentId, role: app.ui.role }, departments)
          );
          if (visible.length === 0) {
            return (
              <Surface>
                <p className="text-sm">No meetings of this type.</p>
              </Surface>
            );
          }
          return groups.map((group) => {
            const rows = visible.filter((meeting) => meeting.dayGroup === group);
            if (rows.length === 0) return null;
            return (
              <div key={group} className="mb-5">
                <h2 className="mb-2 text-[11px] tracking-wide text-muted-foreground uppercase">{group}</h2>
                <div className="space-y-2">
                  {rows.map((m) => (
                    <MeetingRow key={m.id} meeting={m} note={notesLabel(m.id, r4.notes[m.id])} />
                  ))}
                </div>
              </div>
            );
          });
        })()
      )}
      <div className="mt-8">
        <Ledger />
      </div>
    </PageFrame>
  );
}

function RequiredMeetings() {
  const app = useApp();
  if (app.ui.role === "george") {
    return (
      <Surface className="mb-4">
        <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Required today</p>
        <p className="mt-1 text-sm">Every team has a start-of-day and an end-of-day check-in. Company completion is on Company.</p>
        <Link href="/company" className="mt-2 inline-block text-sm text-dpcp-blue">
          See company check-ins
        </Link>
      </Surface>
    );
  }
  const mine = new Set(app.myMemberships.map((m) => m.departmentId));
  const shown = app.model.meetings.filter((m) => m.kind === "daily" && m.departmentId && mine.has(m.departmentId));
  const { morning, evening } = personCheckins(app.model.checkins, app.viewer.id);
  if (shown.length === 0) return null;
  return (
    <div className="mb-5">
      <h2 className="mb-2 text-[11px] tracking-wide text-muted-foreground uppercase">Required today</h2>
      <div className="space-y-2">
        {shown.map((m) => {
          const mineRow = m.slot === "morning" ? morning : evening;
          return (
            <Surface key={m.id}>
              <div className="flex items-start justify-between gap-3">
                <Link href={`/meetings/${m.id}`} className="min-w-0 flex-1 no-underline">
                  <div className="flex flex-wrap items-center gap-2">
                    <MeetingBadge meeting={m} />
                    <span className="text-sm font-medium">{m.when} {m.zone}</span>
                    <StatusTag tone="blue">Mandatory</StatusTag>
                    {mineRow && <StatusTag tone={checkinTone(mineRow.status)}>{checkinLabel(mineRow.status)}</StatusTag>}
                  </div>
                  <p className="font-heading mt-1 text-lg text-dpcp-navy">{m.title}</p>
                </Link>
                <JoinLink id={m.id} />
              </div>
            </Surface>
          );
        })}
      </div>
    </div>
  );
}

function JoinLink({ id }: { id: string }) {
  return (
    <Link href={`/meetings/${id}?join=1`} aria-label="Join meeting" className="inline-flex h-11 shrink-0 items-center rounded-lg bg-dpcp-blue px-3 text-sm font-medium text-white no-underline">
      Join
    </Link>
  );
}

function MeetingRow({ meeting, note }: { meeting: Meeting; note: ReturnType<typeof notesLabel> }) {
  return (
    <Surface>
      <div className="flex items-start justify-between gap-3">
        <Link href={`/meetings/${meeting.id}`} className="min-w-0 flex-1 no-underline">
          <div className="flex flex-wrap items-center gap-2">
            <MeetingBadge meeting={meeting} />
            <span className="text-sm font-medium">{meeting.when} {meeting.zone}</span>
            <StatusTag tone={meeting.prep === "Ready" ? "green" : "neutral"}>{meeting.prep}</StatusTag>
            <StatusTag tone={meeting.notes === "Recap ready" ? "blue" : "neutral"}>{meeting.notes}</StatusTag>
            {note && <StatusTag tone={note.tone}>{note.label}</StatusTag>}
          </div>
          <p className="font-heading mt-1 text-lg text-dpcp-navy">{meeting.title}</p>
        </Link>
        <JoinLink id={meeting.id} />
      </div>
    </Surface>
  );
}

export function MeetingDetailScreen({ id }: { id: string }) {
  const app = useApp();
  const meeting = app.model.meetings.find((m) => m.id === id);
  if (!meeting) {
    return (
      <PageFrame>
        <Surface>
          <p>This meeting isn't available.</p>
          <Button className="mt-3" render={<Link href="/meetings" />}>
            Back
          </Button>
        </Surface>
      </PageFrame>
    );
  }
  return <MeetingBody meeting={meeting} />;
}

function MeetingBody({ meeting }: { meeting: Meeting }) {
  const app = useApp();
  const r4 = useRound4();
  const [phase, setPhase] = useState<"before" | "during" | "after">(meeting.notes === "Upcoming" ? "before" : "after");
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("join") === "1") setPhase("during");
  }, []);
  const isLead = meeting.leadId === app.viewer.id || app.ui.role === "george";
  const needsOwner = meeting.actions?.some((action) => action.status === "Needs owner" || action.status === "Needs date");
  const myCheckin = meeting.slot ? app.model.checkins.find((row) => row.personId === app.viewer.id && row.slot === meeting.slot) : undefined;
  const saved = r4.notes[meeting.id];
  const phases = ["before", "during", "after"] as const;

  return (
    <PageFrame>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-4">
        <div>
          <Link href="/meetings" className="text-sm text-dpcp-blue">← Meetings</Link>
          <div className="mt-2"><MeetingBadge meeting={meeting} /></div>
          <h1 className="font-heading mt-2 text-3xl text-dpcp-navy">{meeting.title}</h1>
          <p className="text-sm text-muted-foreground">{meeting.when} {meeting.zone} · {meeting.attendees.join(", ")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {phases.map((key) => (
              <button key={key} type="button" className={phase === key ? "rounded-full bg-dpcp-navy px-3 py-2 text-sm text-white" : "rounded-full bg-white px-3 py-2 text-sm"} onClick={() => setPhase(key)}>
                {key === "before" ? "Before" : key === "during" ? "During" : "After"}
              </button>
            ))}
            <JoinLink id={meeting.id} />
          </div>
          {phase === "before" && (
            <div className="mt-6 space-y-4">
              <Surface>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Agenda</p>
                <ul className="mt-2 list-disc pl-5 text-sm">{(meeting.agenda.length ? meeting.agenda : ["The questions for this meeting"]).map((item) => <li key={item}>{item}</li>)}</ul>
              </Surface>
              <Surface>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Pre-reads</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  <li>Last recap, if one exists</li>
                  {(meeting.openItems.length ? meeting.openItems : ["No open item on this meeting"]).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </Surface>
              <Surface>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Prep tasks</p>
                <p className="mt-2 text-sm">{meeting.prep === "Preparing" ? "Preparing your notes. Usually ready an hour before." : meeting.prep === "Ready" ? "The prep packet is ready. Read it before you join." : "No prep packet. The agenda is enough."}</p>
              </Surface>
              <StillOpen />
            </div>
          )}
          {phase === "during" && (
            <div className="mt-6 space-y-4">
              <section className="rounded-3xl bg-dpcp-navy-deep p-5 text-white">
                <p className="text-xs tracking-wide text-white/70 uppercase">During</p>
                <p className="font-heading mt-2 text-2xl">You are in {meeting.title}</p>
                <p className="mt-2 text-sm text-white/80">Live notes, decisions, and action items stay on this meeting.</p>
                <Button className="mt-4" onClick={() => app.showToast("The recap will be logged with the meeting.")}>Join meeting</Button>
              </section>
              {meeting.kind === "daily" && <TodaysWin inMeeting />}
              <div className="flex flex-wrap gap-2">
                <TakeNotes meetingId={meeting.id} />
                {meeting.kind === "daily" && <AbsentButton kind={meeting.slot === "evening" ? "Make-up update" : "Make-up stand-up"} />}
              </div>
              {saved && <p className="text-sm">Saved on this meeting. Typed notes: {saved}</p>}
              {myCheckin?.status === "missing" && meeting.slot && (
                <Button variant="outline" onClick={() => app.showToast("Open Make-up meeting at the top of Meetings.")}>I missed it. Make it up</Button>
              )}
              <Surface>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Decisions forming</p>
                <ul className="mt-2 list-disc pl-5 text-sm">{(meeting.openItems.length ? meeting.openItems : ["Nothing decided yet."]).map((item) => <li key={item}>{item}</li>)}</ul>
              </Surface>
            </div>
          )}
          {phase === "after" && (
            <div className="mt-6 space-y-4">
              <Surface>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">AI summary</p>
                {meeting.recap ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{meeting.recap.map((line) => <li key={line}>{line}</li>)}</ul>
                ) : (
                  <p className="mt-2 text-sm">The summary appears after the meeting. Join writes it here.</p>
                )}
                {saved && <p className="mt-3 text-sm">Saved on this meeting. Typed notes: {saved}</p>}
              </Surface>
              {meeting.actions && (
                <Surface>
                  <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Action items</p>
                  <ul className="mt-2 space-y-2">
                    {meeting.actions.map((action) => (
                      <li key={action.id} className="rounded-xl bg-[#f4f6f8] p-3 text-sm">
                        <p>{action.text}</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <StatusTag tone={action.owner ? "neutral" : "amber"}>{action.owner || "Needs owner"}</StatusTag>
                          <StatusTag tone={action.due ? "neutral" : "amber"}>{action.due || "Needs date"}</StatusTag>
                          <StatusTag tone={action.status === "Confirmed" ? "green" : "blue"}>{action.status}</StatusTag>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {isLead && (
                    <Button className="mt-4" disabled={Boolean(needsOwner) && meeting.notes !== "Confirmed"} onClick={() => app.confirmMeeting(meeting.id)}>Confirm all</Button>
                  )}
                  {needsOwner && <p className="mt-2 text-xs text-muted-foreground">Confirm all stays off until each item has an owner and a date, or you remove it.</p>}
                </Surface>
              )}
              <p className="text-sm text-dpcp-blue">Recording and transcript · sample link on this meeting</p>
            </div>
          )}
          {phase !== "during" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <TakeNotes meetingId={meeting.id} />
              {meeting.kind === "daily" && <AbsentButton kind={meeting.slot === "evening" ? "Make-up update" : "Make-up stand-up"} />}
            </div>
          )}
          {phase !== "before" && <StillOpen />}
        </div>
        <MeetingAi meetingId={meeting.id} title={meeting.title} agenda={meeting.agenda} />
      </div>
    </PageFrame>
  );
}

function FilterChip({
  label,
  on,
  onClick,
  color,
  soft,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
  color?: string;
  soft?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={color ? "rounded-full px-3 py-1.5 text-sm" : on ? "rounded-full bg-dpcp-navy px-3 py-1.5 text-sm text-white" : "rounded-full bg-white px-3 py-1.5 text-sm text-dpcp-navy shadow-sm"}
      style={color ? { background: on ? color : soft, color: on ? "#fff" : color } : undefined}
    >
      {label}
    </button>
  );
}
