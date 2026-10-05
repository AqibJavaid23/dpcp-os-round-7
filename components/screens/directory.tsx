"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectionChain } from "@/components/chain";
import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";
import { Button } from "@/components/ui/button";
import { CopilotLogo } from "@/components/round6/marks";
import { PeopleOrg } from "@/components/round6/people-org";
import { copilotForDepartment } from "@/lib/round6/copilots";
import { clientReady, profileFor } from "@/lib/life";
import { DEPARTMENTS, PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";

export function DirectoryScreen({ personId }: { personId?: string }) {
  const app = useApp();
  const selected = personId && PEOPLE.some((p) => p.id === personId) ? personId : null;

  if (!selected) return <PeopleOrg />;

  const person = PEOPLE.find((p) => p.id === selected)!;
  const profile = profileFor(person);
  const dept = DEPARTMENTS.find((d) => d.id === person.departmentId);
  const track = app.model.training.find((row) => row.personId === person.id);
  const pulses = app.model.pulses.filter((row) => row.personId === person.id);
  const canSign =
    !!track &&
    !track.signedOff &&
    (app.ui.role === "george" ||
      app.model.memberships.some(
        (m) => m.personId === app.viewer.id && m.teamRole === "leader" && m.departmentId === person.departmentId
      ));
  const ready = clientReady(person.id, app.model.training);

  return (
    <PageFrame title={person.name} lede={person.title}>
      <Link href="/people" className="text-sm text-dpcp-blue">
        All people
      </Link>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <Surface>
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-dpcp-navy text-lg text-white">
                {person.initials}
              </span>
              <div>
                <p className="font-heading text-2xl text-dpcp-navy">{person.name}</p>
                <p className="text-sm text-muted-foreground">{person.title}</p>
              </div>
            </div>
            {dept && (
              <div className="mt-3">
                <CopilotLogo id={copilotForDepartment(dept.id).id} labeled />
              </div>
            )}
            <p className="mt-3 text-sm leading-relaxed">{profile.about}</p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Works from</dt>
                <dd>{profile.place} · {person.tz}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Started</dt>
                <dd>{profile.started}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Enjoys</dt>
                <dd>{profile.enjoys}</dd>
              </div>
              {profile.birthday && (
                <div>
                  <dt className="text-xs text-muted-foreground">Birthday</dt>
                  <dd>{profile.birthday}</dd>
                </div>
              )}
            </dl>
          </Surface>
          <ConnectionChain personId={person.id} />
          {profile.newHire && (
            <Surface>
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Welcome</p>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Account and first-week setup are in progress.</li>
                <li>Buddy: Nadia Reyes.</li>
                <li>Meet our new teammate is already in Wins & Culture.</li>
              </ul>
              <Link href="/communication" className="mt-2 inline-block text-sm text-dpcp-blue">
                See the welcome post
              </Link>
            </Surface>
          )}
          {track && <TrainingBlock personId={person.id} canSign={canSign} ready={ready} />}
          {pulses.length > 0 && <PulseBlock personId={person.id} />}
        </div>
        <Surface>
          <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Also</p>
          <Link href="/growth" className="mt-2 block text-sm text-dpcp-blue">
            Professional Growth
          </Link>
        </Surface>
      </div>
    </PageFrame>
  );
}

function TrainingBlock({ personId, canSign, ready }: { personId: string; canSign: boolean; ready: boolean }) {
  const app = useApp();
  const track = app.model.training.find((row) => row.personId === personId);
  if (!track) return null;
  return (
    <Surface>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Training · {track.window}</p>
      <p className="mt-1 text-sm">
        Started {track.started}. {ready ? "Signed off. Client work is open." : "Client tasks and client email stay off until the supervisor signs."}
      </p>
      <ul className="mt-3 space-y-2">
        {track.steps.map((step) => (
          <li key={step.id} className="flex items-start justify-between gap-3 text-sm">
            <span>
              <span className="text-xs text-muted-foreground">{step.day}</span>
              <span className="mt-0.5 block font-medium text-dpcp-navy">{step.title}</span>
              <span className="text-muted-foreground">{step.detail}</span>
            </span>
            <button
              type="button"
              className="shrink-0 text-xs text-dpcp-blue"
              onClick={() => app.toggleTrainingStep(personId, step.id)}
            >
              {step.done ? "Done" : "Mark done"}
            </button>
          </li>
        ))}
      </ul>
      {canSign && (
        <Button className="mt-4" onClick={() => app.signOffTraining(personId)}>
          Sign off training
        </Button>
      )}
      {track.signedOff && (
        <p className="mt-3 text-sm">Signed by {track.signedBy} · {track.signedAt}</p>
      )}
    </Surface>
  );
}

function PulseBlock({ personId }: { personId: string }) {
  const app = useApp();
  const pulses = app.model.pulses.filter((row) => row.personId === personId);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const canAnswer = app.viewer.id === personId || app.ui.role === "leader" || app.ui.role === "george" || app.ui.role === "administrator";
  return (
    <Surface>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">New-hire pulse · day 7, 30, and 90</p>
      <div className="mt-3 space-y-4">
        {pulses.map((pulse) => (
          <div key={pulse.id}>
            <p className="text-sm font-medium text-dpcp-navy">
              Day {pulse.day} · {pulse.due} · {pulse.status === "done" ? "Done" : pulse.status === "due" ? "Due" : "Coming up"}
            </p>
            {pulse.status === "done" ? (
              <ul className="mt-1 space-y-1 text-sm">
                {pulse.questions.map((q, i) => (
                  <li key={q}>
                    {q} {pulse.answers[i]}
                  </li>
                ))}
              </ul>
            ) : pulse.status === "due" && canAnswer ? (
              <form
                className="mt-2 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const answers = pulse.questions.map((_, i) => drafts[`${pulse.id}-${i}`] ?? "");
                  app.savePulse(pulse.id, answers);
                }}
              >
                {pulse.questions.map((q, i) => (
                  <label key={q} className="block text-sm">
                    {q}
                    <input
                      value={drafts[`${pulse.id}-${i}`] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [`${pulse.id}-${i}`]: e.target.value }))}
                      className="mt-1 h-10 w-full rounded-xl border border-border px-3 text-sm"
                    />
                  </label>
                ))}
                <Button type="submit" variant="outline">
                  Save the day {pulse.day} pulse
                </Button>
              </form>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">{pulse.questions.join(" · ")}</p>
            )}
          </div>
        ))}
      </div>
    </Surface>
  );
}
