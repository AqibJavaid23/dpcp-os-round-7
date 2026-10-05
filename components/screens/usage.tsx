"use client";

import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";
import { formatMinutes } from "@/lib/format";
import { createUsage, efficiencyTrend, timeDoctorFor } from "@/lib/insights";
import { UsageComparisons } from "@/components/round4/experience";
import { PEOPLE } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Person } from "@/lib/types";

function visiblePeople(role: string, viewerId: string, memberships: { personId: string; departmentId: string; teamRole: string }[]): Person[] {
  if (role === "george" || role === "administrator") return PEOPLE;
  if (role === "leader") {
    const led = new Set(
      memberships.filter((m) => m.personId === viewerId && m.teamRole === "leader").map((m) => m.departmentId)
    );
    const ids = new Set(
      memberships.filter((m) => led.has(m.departmentId)).map((m) => m.personId)
    );
    ids.add(viewerId);
    return PEOPLE.filter((p) => ids.has(p.id));
  }
  return PEOPLE.filter((p) => p.id === viewerId);
}

export function UsageScreen() {
  const app = useApp();
  const people = visiblePeople(app.ui.role, app.viewer.id, app.model.memberships);
  const usage = createUsage(people.map((p) => p.id));
  const scope =
    app.ui.role === "george" || app.ui.role === "administrator"
      ? "Everyone."
      : app.ui.role === "leader"
        ? "Your team."
        : "Just you. Your lead sees the team.";

  return (
    <PageFrame
      title="AI usage vs output"
      lede="What the AI spent, next to what got done. There is no spend cap. This is not a ranking."
    >
      <p className="mb-4 text-sm text-muted-foreground">{scope} Time Doctor hours sit beside the AI numbers.</p>
      <div className="space-y-3">
        {people.map((person) => {
          const row = usage.find((u) => u.personId === person.id);
          if (!row) return null;
          const trend = efficiencyTrend(row.weeks);
          const week = row.weeks[row.weeks.length - 1];
          const td = timeDoctorFor(person.id);
          const maxTasks = Math.max(...row.weeks.map((w) => w.tasksDone), 1);
          return (
            <Surface key={person.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-lg text-dpcp-navy">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.title}</p>
                </div>
                <p className="text-sm text-dpcp-navy">
                  {trend.direction === "up" ? "Efficiency up" : trend.direction === "down" ? "Efficiency down" : "Efficiency flat"}
                  {" · "}
                  {trend.current.toFixed(1)} tasks per dollar
                </p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="AI this week" value={`$${week.cost.toFixed(2)}`} detail={`${week.tokens.toLocaleString()} tokens`} />
                <Metric label="Tasks completed" value={String(week.tasksDone)} detail={`On time ${week.execution}%`} />
                <Metric label="Time Doctor" value={formatMinutes(td.trackedMin)} detail={`${td.activity}% activity · ${formatMinutes(td.idleMin)} idle`} />
                <Metric label="On the clock" value={td.task} detail={`${td.project}. ${td.screenshot}`} />
              </div>
              <div className="mt-4 flex items-end gap-2" aria-hidden>
                {row.weeks.map((point) => (
                  <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-16 w-full items-end gap-0.5">
                      <span
                        className="w-1/2 rounded-sm bg-dpcp-navy"
                        style={{ height: `${Math.max(8, (point.tasksDone / maxTasks) * 100)}%` }}
                      />
                      <span
                        className="w-1/2 rounded-sm bg-dpcp-blue"
                        style={{ height: `${Math.max(8, (point.cost / 12) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{point.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Navy is tasks completed. Blue is AI cost. Four weeks.</p>
            </Surface>
          );
        })}
      </div>
      <UsageComparisons />
    </PageFrame>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-sm font-medium text-dpcp-navy">{value}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
