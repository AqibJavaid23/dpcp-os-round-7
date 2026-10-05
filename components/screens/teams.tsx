"use client";

import { useState } from "react";
import Link from "next/link";
import { ProjectBoard } from "@/components/project-board";
import { DepartmentMark } from "@/components/brand";
import { TeamCheckin } from "@/components/checkin-board";
import { TimeDoctorCard } from "@/components/time-doctor-card";
import { PageFrame } from "@/components/app-shell";
import { TeamLoad } from "@/components/round2/wired";
import { ProgressBar, StatusTag, Surface } from "@/components/bits";
import { Button } from "@/components/ui/button";
import { runAsk, type AskHit } from "@/lib/ask";
import { checkinLabel, checkinTone } from "@/lib/checkins";
import { COMMITMENTS } from "@/lib/round4/data";
import { DEPARTMENTS, PEOPLE } from "@/lib/seed";
import { TeamOps } from "@/components/round4/experience";
import { LeadProjects } from "@/components/round6/lead-projects";
import { useApp } from "@/lib/store";
import { reviewStateLabel } from "@/lib/reviews";
import type { Department, Membership, Person } from "@/lib/types";

const HELPS: Record<string, string> = {
  omar: "Decisions, blocked work, and client promises",
  nadia: "Collections replies and client questions",
  imran: "Appeals",
  sana: "Eligibility",
  faisal: "Payment posting, and covering when someone is out",
  hina: "AR follow-up",
  rowan: "How the week is run, and the Friday report",
  amina: "People, backups, and first-week setup",
  leila: "Coaching plans before they go to a client",
  priya: "Posts and campaigns before they publish",
  elena: "Money questions",
  jonas: "Supplies and vendor orders",
  theo: "Equipment and new locations",
  jamie: "Learning the queue",
};

function peopleIn(departmentId: string) {
  return PEOPLE.filter((p) => p.departmentId === departmentId || p.id === "omar");
}

function LeaderView({ dept, members }: { dept: Department; members: Person[] }) {
  const app = useApp();
  const waiting = app.model.reviews.filter(
    (r) => r.departmentId === dept.id && (r.state === "needs_review" || r.state === "ready_again")
  );
  const blocked = members.filter((p) => p.status === "blocked" || p.status === "behind");
  const out = members.filter((p) => p.timeOff || p.status === "time_off");
  return (
    <div className="space-y-3">
      <TeamCheckin departmentId={dept.id} />
      {dept.id === "insurance" && !app.model.training.find((row) => row.personId === "jamie")?.signedOff && (
        <Surface>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Training gate</p>
          <p className="mt-2 text-sm">
            Jamie is in the first-week track. Client tasks and client email stay off until you sign off.
          </p>
          <Button className="mt-3" variant="outline" render={<Link href="/people/jamie" />}>
            Open Jamie's training
          </Button>
        </Surface>
      )}
      <Surface>
        <p className="text-sm">
          {dept.todayDone} of {dept.todayTotal} done today · {dept.onTime}% on time this week. On-time is private. It is not a ranking.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Hours below are from Time Doctor. They are not a ranking.</p>
        <div className="mt-2">
          <ProgressBar value={dept.todayDone} max={dept.todayTotal} />
        </div>
      </Surface>
      {blocked.length > 0 && (
        <Surface>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Needs you</p>
          {blocked.map((p) => (
            <div key={p.id} className="mt-3">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">{p.workingNow}</p>
              <StatusTag tone={p.status === "blocked" ? "red" : "amber"}>{p.statusLabel}</StatusTag>
            </div>
          ))}
          {dept.id === "insurance" && (
            <Button className="mt-3" variant="outline" render={<Link href="/tasks/imran-appeal" />}>
              Step in on Imran's appeal
            </Button>
          )}
        </Surface>
      )}
      {waiting.length > 0 && (
        <Surface>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Waiting on your review</p>
          {waiting.map((r) => (
            <Link key={r.id} href="/review" className="mt-2 block text-sm text-dpcp-blue">
              {r.title} · {reviewStateLabel(r.state)}
            </Link>
          ))}
        </Surface>
      )}
      {out.length > 0 && (
        <Surface>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Out today</p>
          {out.map((p) => (
            <p key={p.id} className="mt-2 text-sm">
              {p.name} is out. {p.workingNow}
            </p>
          ))}
        </Surface>
      )}
      <div className="space-y-2">
        {members.map((p) => (
          <Surface key={p.id}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{p.name}</p>
              <StatusTag>{p.statusLabel}</StatusTag>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p.workingNow}</p>
            <TimeDoctorCard personId={p.id} compact />
            <p className="mt-1 text-xs text-muted-foreground">On time this week {p.execution}%</p>
          </Surface>
        ))}
      </div>
    </div>
  );
}

function MemberView({ dept, members }: { dept: Department; members: Person[] }) {
  const out = members.filter((p) => p.timeOff || p.status === "time_off");
  return (
    <div className="space-y-3">
      <Surface>
        <p className="text-sm">Go to the person who does that work. You don't need a menu of filters.</p>
      </Surface>
      {members.map((p) => (
        <Surface key={p.id}>
          <p className="font-medium">{p.name}</p>
          <p className="text-sm text-muted-foreground">{p.title}</p>
          <p className="mt-1 text-sm">Go to {p.firstName} for {HELPS[p.id] ?? p.title}.</p>
          <p className="mt-1 text-xs text-muted-foreground">{p.workingNow}</p>
        </Surface>
      ))}
      {out.map((p) => (
        <Surface key={`${p.id}-out`}>
          <p className="text-sm">
            {p.name} is out. {p.workingNow}
          </p>
        </Surface>
      ))}
      {dept.id === "insurance" && (
        <Surface>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Shared right now</p>
          <p className="mt-2 text-sm">Hina's urgent AR notes are with Faisal today.</p>
          <p className="mt-1 text-sm">The Canyon View appeal is with Imran. He's blocked on a copy from the practice.</p>
          <p className="mt-1 text-sm">The Mesa Ridge reply is with Nadia.</p>
        </Surface>
      )}
      {dept.id === "operations" && (
        <Surface>
          <p className="text-sm">The Friday report is with Rowan. Vendor handoffs sit with the operations team.</p>
        </Surface>
      )}
    </div>
  );
}

function TeamToday() {
  const app = useApp();
  const lead = app.ui.role === "leader" || app.ui.role === "george";
  const company = ["omar", "nadia", "imran", "sana", "faisal", "amina", "theo"];
  const deptIds = new Set(app.myMemberships.map((row) => row.departmentId));
  const people = app.ui.role === "george"
    ? PEOPLE.filter((person) => company.includes(person.id))
    : PEOPLE.filter((person) => deptIds.has(person.departmentId));
  const mornings = people.map((person) => app.model.checkins.find((row) => row.personId === person.id && row.slot === "morning"));
  const checked = mornings.filter((row) => row && (row.status === "attended" || row.status === "ai" || row.status === "excused")).length;
  const standups = mornings.filter((row) => row && (row.status === "attended" || row.status === "ai")).length;
  const blockers = people.filter((person) => person.status === "blocked").length;
  const overdue = people.reduce((sum, person) => sum + COMMITMENTS.filter((row) => row.overdue && row.owner === person.name).length, 0);

  return (
    <section className="mb-8">
      <h2 className="font-heading text-2xl text-dpcp-navy">Today</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ["Checked in", String(checked)],
          ["Stand-up done", String(standups)],
          ["Blockers", String(blockers)],
          ["Overdue", String(overdue)],
        ].map(([label, value]) => (
          <article key={label} className="rounded-3xl bg-white px-4 py-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-heading mt-1 text-3xl text-dpcp-navy">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-3 space-y-2">
        {people.map((person) => {
          const morning = app.model.checkins.find((row) => row.personId === person.id && row.slot === "morning");
          const late = COMMITMENTS.filter((row) => row.overdue && row.owner === person.name).length;
          return (
            <article key={person.id} className="rounded-3xl bg-white px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-lg text-dpcp-navy">{person.name}</p>
                  <p className="text-sm text-muted-foreground">{person.title}</p>
                </div>
                {morning && <StatusTag tone={checkinTone(morning.status)}>{checkinLabel(morning.status)}</StatusTag>}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted-foreground">Stand-up</dt>
                  <dd>{morning && (morning.status === "attended" || morning.status === "ai") ? "Done" : "Not yet"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Blocker</dt>
                  <dd>{person.status === "blocked" ? person.workingNow : "Clear"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Workload</dt>
                  <dd>{person.todayDone} of {person.todayTotal}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Overdue</dt>
                  <dd>{late}</dd>
                </div>
              </dl>
              {lead && person.status === "blocked" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {person.id === "imran" && <Button variant="outline" render={<Link href="/tasks/imran-appeal" />}>Step in</Button>}
                  <Button variant="outline" onClick={() => app.showToast(`Nudge drafted for ${person.firstName}. Approve and send.`)}>Nudge</Button>
                </div>
              )}
              {!lead && <p className="mt-3 text-sm text-muted-foreground">Go to {person.firstName} for {HELPS[person.id] ?? person.title}.</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function TeamsScreen() {
  const app = useApp();
  const [query, setQuery] = useState("");
  const memberships = app.myMemberships;
  const hits: AskHit[] = memberships.flatMap((m) => {
    const dept = DEPARTMENTS.find((d) => d.id === m.departmentId);
    const members = peopleIn(m.departmentId).filter((p) => p.departmentId === m.departmentId || (m.departmentId === "operations" && p.id === "omar"));
    return members.map((p) => ({
      id: `${m.departmentId}-${p.id}`,
      title: `${p.name} · ${dept?.name ?? ""}`,
      detail: `${p.statusLabel} ${p.workingNow} ${p.status}`,
    }));
  });
  const asked = runAsk("teams", query, hits);

  return (
    <PageFrame title="My Teams" lede="Who is in, what is blocked, and what is late.">
      <TeamOps />
      <TeamToday />
      {app.ui.role === "leader" && <LeadProjects />}
      {(app.ui.role === "leader" || app.ui.role === "george") && (
        <TeamLoad personIds={["nadia", "omar", "imran", "theo", "amina", "priya", "rowan"]} showRollup />
      )}
      <ProjectBoard />
      {query && <p className="mb-3 text-sm">{asked.answer}</p>}
      {memberships.length === 0 ? (
        <Surface>
          <p className="text-sm">You aren't on a team yet. An administrator assigns teams.</p>
        </Surface>
      ) : (
        memberships.map((m: Membership) => {
          const dept = DEPARTMENTS.find((d) => d.id === m.departmentId);
          if (!dept) return null;
          const members = PEOPLE.filter((p) => app.model.memberships.some((row) => row.personId === p.id && row.departmentId === dept.id));
          const visible = query ? members.filter((p) => asked.hits.some((h) => h.id === `${dept.id}-${p.id}`)) : members;
          if (query && visible.length === 0) return null;
          return (
            <section key={`${m.departmentId}-${m.teamRole}`} className="mb-8">
              <DepartmentMark departmentId={dept.id} family={dept.family} name={dept.name} className="h-10" />
              <h2 className="font-heading mt-2 text-xl text-dpcp-navy">{dept.name}</h2>
              <p className="mb-3 text-sm text-muted-foreground">
                {m.teamRole === "leader" ? "You lead this team." : "You are on this team."}
              </p>
              {m.teamRole === "leader" ? <LeaderView dept={dept} members={visible} /> : <MemberView dept={dept} members={visible} />}
            </section>
          );
        })
      )}
    </PageFrame>
  );
}

export function TeamScreen() {
  return <TeamsScreen />;
}
