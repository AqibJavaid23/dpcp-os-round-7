"use client";

import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { PillarTag } from "@/components/pillars";
import { Surface } from "@/components/bits";
import { PILLARS } from "@/lib/culture";
import { FitRings, TrainingPath, UsagePicture } from "@/components/round6/growth-panels";
import { Ring } from "@/components/round6/charts";
import { planFor } from "@/lib/growth";
import { DEPARTMENTS, PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Pillar } from "@/lib/types";

export function GrowthNudge() {
  const app = useApp();
  const plan = planFor(app.model.growthPlans, app.viewer.id);
  const goal = plan.goals.find((item) => item.thisWeek) ?? plan.goals[0];
  const note = app.model.growthNotes.find((item) => item.personId === app.viewer.id);
  const from = PEOPLE.find((p) => p.id === note?.fromId);
  if (!goal) return null;
  return (
    <Link href="/growth" className="mb-4 block no-underline">
      <Surface className="border-[#d5e4f2] bg-[#f7fbfe]">
        <p className="text-[11px] tracking-wide text-dpcp-blue uppercase">Grow this week</p>
        <p className="mt-1 text-sm font-medium text-dpcp-navy">{goal.text}</p>
        {note && (
          <p className="mt-2 text-sm text-muted-foreground">
            {from?.firstName ?? "Someone"} · {PILLARS[note.pillar].label}: {note.text}
          </p>
        )}
      </Surface>
    </Link>
  );
}

function supervisorName(personId: string) {
  const person = PEOPLE.find((p) => p.id === personId);
  if (!person || person.id === "george") return "George";
  const dept = DEPARTMENTS.find((d) => d.id === person.departmentId);
  if (!dept || dept.leadId === person.id) return "George";
  return PEOPLE.find((p) => p.id === dept.leadId)?.name ?? "their lead";
}

export function GrowthScreen() {
  const app = useApp();
  return (
    <PageFrame title="Professional Growth" lede="Where you fit, how you start, and what the work produced.">
      <FitRings />
      <TrainingPath />
      <ExecutionLayer personId={app.viewer.id} />
      <GrowthAreas personId={app.viewer.id} />
      <UsagePicture />
    </PageFrame>
  );
}

function ExecutionLayer({ personId }: { personId: string }) {
  const person = PEOPLE.find((p) => p.id === personId);
  const scores = [
    { label: "Professionalism", value: "4.6", goal: "Goal 5", ring: 92 },
    { label: "Responsiveness", value: "4.2", goal: "Goal 5", ring: 84 },
    { label: "On track", value: `${person?.execution ?? 0}%`, goal: "Goal 85%", ring: person?.execution ?? 0 },
    { label: "Speed of execution", value: "4.1", goal: "Goal 5", ring: 82 },
  ];
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl text-dpcp-navy">Execution score</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {scores.map((score) => (
          <Surface key={score.label} className="flex flex-col items-center px-5 py-6">
            <Ring value={score.ring} center={score.value} caption={score.label} color="#123B78" />
            <p className="mt-2 text-sm text-muted-foreground">{score.goal}</p>
          </Surface>
        ))}
      </div>
    </section>
  );
}

function GrowthAreas({ personId }: { personId: string }) {
  const app = useApp();
  const plan = planFor(app.model.growthPlans, personId);
  const areas = plan.needs.map((need) => ({ pillar: need.pillar as Pillar, title: need.text }));
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl text-dpcp-navy">Growth areas</h2>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">Set by {supervisorName(personId)}. Projects and longer focus, not the tasks on Today.</p>
      <div className="grid gap-3 lg:grid-cols-2">
        {areas.map((area) => (
          <Surface key={area.title} className="px-5 py-6">
            <PillarTag pillar={area.pillar} />
            <p className="mt-3 text-lg font-medium text-dpcp-navy">{area.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{PILLARS[area.pillar].definition}</p>
          </Surface>
        ))}
        {app.model.projects
          .filter((project) => project.phases.some((phase) => phase.ownerId === personId))
          .map((project) => (
            <Surface key={project.id} className="px-5 py-6">
              <p className="text-sm text-dpcp-blue">Project</p>
              <p className="mt-3 text-lg font-medium text-dpcp-navy">{project.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">A longer piece of work, set with the people who own the phases.</p>
            </Surface>
          ))}
      </div>
    </section>
  );
}

