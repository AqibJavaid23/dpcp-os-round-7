"use client";

import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { PillarTrio } from "@/components/pillars";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

const STEPS = [
  "You work from home. The app is the office.",
  "Today shows the day in one short list. You do not sort a pile.",
  "Check in with your team twice a day. Wins & Culture is how you stay close.",
  "The AI does the repetitive work so you can grow. Growth is a tab, not a side quest.",
];

export default function Page() {
  const app = useApp();
  return (
    <PageFrame title="Orientation" lede="A short start. Then the work.">
      <ol className="space-y-2">
        {STEPS.map((step, i) => (
          <li key={step} className="rounded-[18px] border border-[#d5e4f2] bg-white px-4 py-3 text-sm">
            <span className="font-medium text-dpcp-navy">{i + 1}. </span>
            {step}
          </li>
        ))}
      </ol>
      <div className="mt-4">
        <PillarTrio />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={() => app.completeOrientation()} render={<Link href="/workday" />}>
          Open Today
        </Button>
        <Button variant="outline" render={<Link href="/growth" />}>
          See Growth
        </Button>
      </div>
    </PageFrame>
  );
}
