"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

type ProjectItem = {
  id: string;
  title: string;
  forWhom: string;
  why: string;
  body: string;
};

const CRITERIA = [
  "The names and the numbers match the source note.",
  "A person, not the AI, is named where a send or a signature is required.",
  "Nothing here is a patient chart, a member ID, or a wage.",
];

export function ProjectReader({ item, onBack }: { item: ProjectItem; onBack: () => void }) {
  const app = useApp();
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState<"approved" | "back" | null>(null);
  const done = CRITERIA.every((_, index) => checks[index]);

  return (
    <article className="mx-auto max-w-3xl">
      <button type="button" className="text-sm text-dpcp-blue" onClick={onBack}>
        Back to Review
      </button>
      <p className="mt-4 text-xs tracking-wide text-muted-foreground uppercase">Project</p>
      <h2 className="font-heading mt-2 text-3xl tracking-tight text-dpcp-navy md:text-4xl">{item.title}</h2>
      <p className="mt-3 text-base text-muted-foreground">{item.forWhom}</p>

      <section className="mt-8">
        <h3 className="font-heading text-xl text-dpcp-navy">Overview</h3>
        <p className="mt-2 text-base leading-relaxed">{item.why}</p>
        <p className="mt-3 text-base leading-relaxed">{item.body}</p>
      </section>

      <section className="mt-8">
        <h3 className="font-heading text-xl text-dpcp-navy">Deliverables</h3>
        <ul className="mt-3 space-y-2">
          {["Summary for the meeting", "Source note", "Marked-up draft"].map((file) => (
            <li key={file} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm">
              <span className="text-dpcp-navy">{file}</span>
              <span className="text-muted-foreground">Sample file</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h3 className="font-heading text-xl text-dpcp-navy">History</h3>
        <ol className="mt-3 space-y-3 border-l border-dpcp-tint pl-4 text-sm">
          <li><span className="text-muted-foreground">Oct 16</span> · Drafted from the meeting note.</li>
          <li><span className="text-muted-foreground">Oct 18</span> · A lead asked for the entity name to be checked.</li>
          <li><span className="text-muted-foreground">Oct 20</span> · Ready for you.</li>
        </ol>
      </section>

      <section className="mt-8">
        <h3 className="font-heading text-xl text-dpcp-navy">Comments</h3>
        <p className="mt-2 rounded-2xl bg-white px-4 py-3 text-sm">Omar Hale · The blocker is named. The next step is a person, not another draft.</p>
        <label className="mt-3 block text-sm">
          Add a comment
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} className="mt-1 min-h-20 w-full rounded-2xl bg-white px-3 py-2 text-sm" />
        </label>
      </section>

      <section className="mt-8">
        <h3 className="font-heading text-xl text-dpcp-navy">Acceptance</h3>
        <ul className="mt-3 space-y-2">
          {CRITERIA.map((line, index) => (
            <li key={line}>
              <button type="button" className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-white px-4 text-left text-sm" onClick={() => setChecks((current) => ({ ...current, [index]: !current[index] }))}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E7EEF6] text-dpcp-navy">{checks[index] ? "✓" : ""}</span>
                {line}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        {sent === "approved" && <p className="text-sm text-status-green">Approved. It can go out.</p>}
        {sent === "back" && <p className="text-sm text-status-amber">Sent back with your note.</p>}
        {sent === null && (
          <>
            <Button disabled={!done} onClick={() => { setSent("approved"); app.showToast("Approved."); }}>Approve</Button>
            <Button variant="outline" onClick={() => { setSent("back"); app.showToast("Sent back."); }}>Send back</Button>
          </>
        )}
      </div>
    </article>
  );
}
