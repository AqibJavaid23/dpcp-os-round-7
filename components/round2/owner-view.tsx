"use client";

import { PageFrame } from "@/components/app-shell";
import { BookToggle } from "@/components/round2/rail";
import { OWNER_SNAPS, practiceById } from "@/lib/round2/data";
import { useRound2 } from "@/lib/round2/context";

export function OwnerScreen() {
  const r2 = useRound2();
  const practiceId = r2.book === "hdg" ? "copper" : "saguaro";
  const snap = OWNER_SNAPS.find((row) => row.practiceId === practiceId)!;
  const practice = practiceById(practiceId)!;
  const cards = [
    ["Collections", snap.collections, snap.collectionsGoal, snap.collectionsTrend],
    ["AR 90+", snap.ar, snap.arGoal, snap.arTrend],
    ["New patients", snap.newPatients, snap.npGoal, snap.npTrend],
    ["Cost per new patient", snap.cost, snap.costGoal, snap.costTrend],
    ["Open roles", snap.roles, "Fill the seat", "flat" as const],
    ["Lists finished", snap.lists, "Every opener", "flat" as const],
    ["Building and equipment", snap.building, "Nothing urgent", snap.building.includes("chair") ? "down" as const : "flat" as const],
  ];

  return (
    <PageFrame title="Practice health" lede={`${practice.name} · ${practice.town}. You see your practice. The work itself looks the same for an HDG office and a client.`}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <BookToggle />
        <span className="rounded-full bg-[#E7EEF6] px-3 py-1 text-xs text-dpcp-navy">{practice.kind === "hdg" ? "HDG" : "Client"}</span>
      </div>
      <section className="rounded-3xl bg-dpcp-navy px-5 py-5 text-white">
        <p className="text-xs tracking-wide text-white/70 uppercase">Today</p>
        <p className="font-heading mt-2 text-2xl">{snap.needs.length === 0 ? "Nothing needs you today." : snap.needs.slice(0, 3).join(" · ")}</p>
      </section>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map(([label, score, goal, trend]) => (
          <article key={String(label)} className="rounded-3xl bg-white px-4 py-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-heading mt-1 text-2xl text-dpcp-navy">
              {score} <span className="text-base">{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
            </p>
            <p className="text-xs text-muted-foreground">Goal {goal}</p>
          </article>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="font-heading text-2xl text-dpcp-navy">What DPCP is handling</h2>
        <ul className="mt-3 space-y-2">
          {snap.handling.map((line) => (
            <li key={line} className="rounded-3xl bg-white px-4 py-3 text-sm">{line}</li>
          ))}
        </ul>
      </section>
    </PageFrame>
  );
}
