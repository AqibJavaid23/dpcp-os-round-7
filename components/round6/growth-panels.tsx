"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/bits";
import { Ring, Bars } from "@/components/round6/charts";
import { ORIENTATION_STEPS } from "@/lib/round4/data";
import { orientationProgress, useRound4 } from "@/lib/round4/store";
import { copilotForDepartment } from "@/lib/round6/copilots";
import { DEPARTMENTS } from "@/lib/seed";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const TRAIN = [
  { id: "flow", title: "Care team flow", progress: 40, href: "/schedule" },
  { id: "portals", title: "Portal access", progress: 70, href: "/portals" },
  { id: "appeals", title: "Appeals", progress: 25, href: "/training" },
  { id: "recare", title: "Recare calls", progress: 10, href: "/recare" },
  { id: "kit", title: "Standard kit", progress: 55, href: "/kit" },
];

export function FitRings() {
  const app = useApp();
  const copilot = copilotForDepartment(app.viewer.departmentId);
  const dept = DEPARTMENTS.find((item) => item.id === app.viewer.departmentId);
  const rings = [
    { id: "you", label: app.viewer.name, mission: app.viewer.title, fill: "#BFD0E8", ink: "#123B78" },
    { id: "dept", label: dept && dept.id !== "owner" ? dept.name : "Company leadership", mission: "The team you work inside.", fill: "#0081CE", ink: "#ffffff" },
    { id: "unit", label: copilot.name, mission: "The business unit that owns this work.", fill: "#123B78", ink: "#ffffff" },
    { id: "company", label: "Dental Practice Copilot", mission: "People and AI, operating dental practices with a calm daily system.", fill: "#0B254B", ink: "#ffffff" },
  ];
  const [open, setOpen] = useState(rings[0].id);
  const ring = rings.find((item) => item.id === open) ?? rings[0];
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl text-dpcp-navy">Where you fit</h2>
      <div className="mt-4 flex flex-col items-center">
        {rings.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpen(item.id)}
            className="flex items-center justify-center rounded-full px-4 text-center text-xs font-medium sm:text-sm"
            style={{ width: 320 - index * 36, height: 68, marginTop: index === 0 ? 0 : -10, background: item.fill, color: item.ink }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <Surface className="mt-4">
        <p className="font-medium text-dpcp-navy">{ring.label}</p>
        <p className="mt-1 text-sm">{ring.mission}</p>
      </Surface>
    </section>
  );
}

export function TrainingPath() {
  const r4 = useRound4();
  const progress = orientationProgress(r4.orientationDone);
  const done = progress === 100 && r4.leadConfirmed;
  const [open, setOpen] = useState(!done);
  const [library, setLibrary] = useState<Record<string, number>>(() => Object.fromEntries(TRAIN.map((item) => [item.id, item.progress])));
  return (
    <section className="mb-10">
      {done && !open ? (
        <button type="button" className="flex w-full items-center justify-between rounded-3xl bg-white px-4 py-4 text-left" onClick={() => setOpen(true)}>
          <span>
            <span className="block font-heading text-xl text-dpcp-navy">Orientation complete</span>
            <span className="text-sm text-muted-foreground">It stays on your record. It is not part of the ongoing path.</span>
          </span>
          <span className="text-sm text-dpcp-blue">Show</span>
        </button>
      ) : (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-2xl text-dpcp-navy">Orientation</h2>
            <Ring value={progress} center={`${progress}%`} color="#0081CE" size={72} />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ORIENTATION_STEPS.map((step) => {
              const on = !!r4.orientationDone[step.id];
              return (
                <button key={step.id} type="button" onClick={() => r4.toggleStep(step.id)} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left text-sm">
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", on ? "bg-[#157a45] text-white" : "bg-[#E7EEF6] text-dpcp-navy")}>{on ? "✓" : ""}</span>
                  {step.label}
                </button>
              );
            })}
          </div>
          <Button className="mt-3" variant="outline" onClick={r4.confirmLead}>
            {r4.leadConfirmed ? "Lead confirmed" : "Lead confirms"}
          </Button>
          {done && (
            <button type="button" className="mt-3 block text-sm text-dpcp-blue" onClick={() => setOpen(false)}>
              Collapse orientation
            </button>
          )}
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-heading text-2xl text-dpcp-navy">Professional training</h2>
        <p className="mt-1 text-sm text-muted-foreground">{done ? "Ongoing modules. Progress is yours." : "These open after orientation is complete."}</p>
        <div className={cn("mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3", !done && "opacity-50")}>
          {TRAIN.map((item) => (
            <article key={item.id} className="rounded-3xl bg-white p-4">
              <Ring value={library[item.id] ?? 0} center={`${library[item.id] ?? 0}%`} caption={item.title} color="#123B78" />
              <div className="mt-2 flex justify-center gap-3 text-sm">
                <button type="button" className="text-dpcp-blue" disabled={!done} onClick={() => setLibrary((current) => ({ ...current, [item.id]: Math.min(100, (current[item.id] ?? 0) + 10) }))}>
                  Advance
                </button>
                <Link href={item.href} className="text-dpcp-blue">
                  Open
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UsagePicture() {
  const app = useApp();
  return (
    <section className="mt-2">
      <h2 className="font-heading text-2xl text-dpcp-navy">AI usage and output</h2>
      <p className="mt-1 text-sm text-muted-foreground">You, your department, and the company. Tasks only.</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <Surface>
          <p className="text-sm font-medium text-dpcp-navy">Tasks closed this month</p>
          <div className="mt-3">
            <Bars
              rows={[
                { label: "You", value: 88, color: "#123B78" },
                { label: "Department", value: 76, color: "#0081CE" },
                { label: "Company", value: 72, color: "#BFD0E8" },
              ]}
            />
          </div>
        </Surface>
        <Surface>
          <p className="text-sm font-medium text-dpcp-navy">Share handled with AI first</p>
          <div className="mt-3 flex justify-around">
            <Ring value={54} center="54%" caption="You" color="#123B78" size={84} />
            <Ring value={48} center="48%" caption="Department" color="#0081CE" size={84} />
            <Ring value={41} center="41%" caption="Company" color="#0B254B" size={84} />
          </div>
        </Surface>
        <Surface>
          <p className="text-sm font-medium text-dpcp-navy">On time · private</p>
          <div className="mt-3 flex justify-center">
            <Ring value={app.viewer.execution} center={`${app.viewer.execution}%`} caption="Not a ranking" color="#157a45" />
          </div>
        </Surface>
      </div>
    </section>
  );
}
