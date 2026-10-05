"use client";

import { Surface } from "@/components/bits";
import { formatMinutes } from "@/lib/format";
import { timeDoctorFor } from "@/lib/insights";

export function TimeDoctorCard({ personId, compact = false }: { personId: string; compact?: boolean }) {
  const day = timeDoctorFor(personId);
  if (compact) {
    return (
      <p className="mt-1 text-xs text-muted-foreground">
        Time Doctor · {formatMinutes(day.trackedMin)} · {day.activity}% activity · {formatMinutes(day.idleMin)} idle · {day.task}
      </p>
    );
  }
  return (
    <Surface className="mb-4">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Time Doctor · today</p>
      <p className="mt-1 text-sm">Hours, activity, and a screenshot summary. The image itself stays in Time Doctor.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="font-heading text-2xl text-dpcp-navy">{formatMinutes(day.trackedMin)}</p>
          <p className="text-xs text-muted-foreground">tracked</p>
        </div>
        <div>
          <p className="font-heading text-2xl text-dpcp-navy">{day.activity}%</p>
          <p className="text-xs text-muted-foreground">activity</p>
        </div>
        <div>
          <p className="font-heading text-2xl text-dpcp-navy">{formatMinutes(day.idleMin)}</p>
          <p className="text-xs text-muted-foreground">idle</p>
        </div>
      </div>
      <p className="mt-3 text-sm">
        {day.project} · {day.task}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{day.screenshot}</p>
    </Surface>
  );
}
