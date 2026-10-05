"use client";

import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { Surface } from "@/components/bits";
import { MakeupLauncher } from "@/components/round4/experience";
import type { CheckinSlot } from "@/lib/types";

export function CheckinScreen({ slot }: { slot: CheckinSlot }) {
  return (
    <PageFrame title="Meetings" lede={slot === "morning" ? "Make up the stand-up from Meetings." : "Make up the update from Meetings."}>
      <Surface>
        <p className="text-sm">The make-up chat is on Meetings. It walks the agenda, records your answers, and posts a short summary for the lead to confirm.</p>
        <MakeupLauncher />
        <Link href="/meetings" className="text-sm text-dpcp-blue">Open Meetings</Link>
      </Surface>
    </PageFrame>
  );
}
