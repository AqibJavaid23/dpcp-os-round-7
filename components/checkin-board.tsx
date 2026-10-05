"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusTag, Surface } from "@/components/bits";
import { checkinLabel, checkinTone, slotTitle } from "@/lib/checkins";
import { useApp } from "@/lib/store";
import type { CheckinSlot, DailyCheckin } from "@/lib/types";

export function personCheckins(rows: DailyCheckin[], personId: string) {
  return {
    morning: rows.find((r) => r.personId === personId && r.slot === "morning"),
    evening: rows.find((r) => r.personId === personId && r.slot === "evening"),
  };
}

function SlotLine({ row }: { row: DailyCheckin | undefined }) {
  if (!row) return null;
  const when = row.slot === "morning" ? "8:15 AM" : "4:15 PM";
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <p className="text-sm font-medium text-dpcp-navy">
          {slotTitle(row.slot)} · {when}
        </p>
        <p className="text-xs text-muted-foreground">
          {row.slot === "morning" ? "Yesterday, today, blockers" : "Done, not done, handoffs"}
        </p>
      </div>
      <StatusTag tone={checkinTone(row.status)}>{checkinLabel(row.status)}</StatusTag>
    </div>
  );
}

export function WorkdayCheckin() {
  const app = useApp();
  const { morning, evening } = personCheckins(app.model.checkins, app.viewer.id);
  const missing = [morning, evening].filter((row) => row?.status === "missing");
  return (
    <Surface className="mb-4">
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Daily check-in · required</p>
      <p className="mt-1 text-sm">Two team meetings. If you miss one, do the same questions with AI.</p>
      <div className="mt-3 space-y-3">
        <SlotLine row={morning} />
        <SlotLine row={evening} />
      </div>
      {missing.map((row) => (
        <div key={row!.slot} className="mt-3">
          <Button render={<Link href="/meetings" />}>
            Make it up in Meetings
          </Button>
        </div>
      ))}
    </Surface>
  );
}

export function TeamCheckin({ departmentId }: { departmentId: string }) {
  const app = useApp();
  const people = app.people.filter((p) =>
    app.model.memberships.some((m) => m.personId === p.id && m.departmentId === departmentId)
  );
  return <CheckinRollup title="Check-ins" people={people} note="Required. Out today is not missing." />;
}

export function CompanyCheckin() {
  const app = useApp();
  const people = app.people.filter((p) => p.id !== "george");
  return <CheckinRollup title="Company check-ins" people={people} note="Every team, this morning and this evening." />;
}

function CheckinRollup({
  title,
  people,
  note,
}: {
  title: string;
  people: { id: string; name: string }[];
  note: string;
}) {
  const app = useApp();
  const slots: CheckinSlot[] = ["morning", "evening"];
  return (
    <Surface>
      <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{note}</p>
      <div className="mt-3 space-y-3">
        {slots.map((slot) => {
          const rows = people
            .map((p) => app.model.checkins.find((c) => c.personId === p.id && c.slot === slot))
            .filter((row): row is DailyCheckin => Boolean(row));
          const owed = rows.filter((r) => r.status !== "excused" && r.status !== "upcoming");
          const done = owed.filter((r) => r.status === "attended" || r.status === "ai");
          const missing = rows.filter((r) => r.status === "missing");
          return (
            <div key={slot}>
              <p className="text-sm font-medium text-dpcp-navy">
                {slotTitle(slot)} · {slot === "evening" ? "Meeting at 4:15 PM" : `${done.length} of ${owed.length || rows.length} done`}
              </p>
              {slot === "morning" && (
                <ul className="mt-1 space-y-1 text-sm">
                  {rows.map((row) => {
                    const person = people.find((p) => p.id === row.personId);
                    return (
                      <li key={row.id} className="flex items-center justify-between gap-2">
                        <span>{person?.name}</span>
                        <StatusTag tone={checkinTone(row.status)}>{checkinLabel(row.status)}</StatusTag>
                      </li>
                    );
                  })}
                </ul>
              )}
              {slot === "evening" && missing.length === 0 && (
                <p className="mt-1 text-sm text-muted-foreground">Nobody is missing yet. The meeting has not started.</p>
              )}
            </div>
          );
        })}
      </div>
    </Surface>
  );
}
