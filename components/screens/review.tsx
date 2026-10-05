"use client";

import { useState } from "react";
import { AskBar } from "@/components/ask-bar";
import { DepartmentMark } from "@/components/brand";
import { PageFrame } from "@/components/app-shell";
import { AppealReview, OtherDrafts } from "@/components/round2/wired";
import { ReviewDeck } from "@/components/round4/experience";
import { OwnerReview } from "@/components/round7/client";
import { StatusTag, Surface } from "@/components/bits";
import { Button } from "@/components/ui/button";
import { runAsk, type AskHit } from "@/lib/ask";
import { reviewStateLabel } from "@/lib/reviews";
import { DEPARTMENTS } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { ReviewItem } from "@/lib/types";

function deptFor(id: string) {
  return DEPARTMENTS.find((d) => d.id === id);
}

export function ReviewPiece({ item, compact = false }: { item: ReviewItem; compact?: boolean }) {
  const app = useApp();
  const version = item.versions.find((v) => v.number === item.current) ?? item.versions[0];
  const [blockId, setBlockId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [overall, setOverall] = useState("");
  const changed = new Set(version.changes.map((c) => c.after));
  const dept = deptFor(item.departmentId);

  function save(target: string | null, text: string) {
    if (!text.trim()) return;
    app.addReviewNote(item.id, target, text);
    setNote("");
    setOverall("");
    setBlockId(null);
  }

  return (
    <Surface>
      <div className="flex flex-wrap items-center gap-2">
        {dept && <DepartmentMark departmentId={dept.id} family={dept.family} name={dept.name} className="h-7" />}
        <StatusTag tone={item.state === "ready_again" ? "blue" : item.state === "approved" || item.state === "sent" ? "green" : "amber"}>
          {reviewStateLabel(item.state)}
        </StatusTag>
        <span className="text-xs text-muted-foreground">Round {item.current}</span>
      </div>
      <h2 className="font-heading mt-3 text-xl text-dpcp-navy">{item.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{item.forWhom}</p>
      <p className="mt-2 text-sm">{item.whyNow}</p>
      {item.approver && (
        <p className="mt-2 text-sm text-status-green">
          Approved by {item.approver}
          {item.approvedAt ? ` · ${item.approvedAt}` : ""}
          {item.sentAt ? ` · Sent ${item.sentAt}` : ""}
        </p>
      )}

      {version.changes.length > 0 && (
        <div className="mt-4 rounded-xl bg-dpcp-wash p-3">
          <p className="text-[11px] font-medium tracking-wide text-dpcp-navy uppercase">What changed</p>
          <ul className="mt-2 space-y-2 text-sm">
            {version.changes.map((change) => (
              <li key={change.after}>
                <p className="text-dpcp-navy">You said: {change.note}</p>
                <p className="mt-1 text-muted-foreground line-through">{change.before}</p>
                <p className="mt-1">{change.after}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {version.blocks.map((block) => {
          const notes = item.notes.filter((n) => n.version === item.current && n.blockId === block.id);
          const marked = changed.has(block.text);
          return (
            <div key={block.id} className={marked ? "rounded-xl bg-dpcp-wash p-3" : "rounded-xl bg-muted p-3"}>
              {block.label && <p className="text-[11px] tracking-wide text-muted-foreground uppercase">{block.label}</p>}
              <p className="text-sm whitespace-pre-wrap">{block.text}</p>
              {marked && <p className="mt-1 text-[11px] text-dpcp-blue">Changed</p>}
              {notes.map((n) => (
                <p key={n.id} className="mt-2 text-xs text-dpcp-navy">
                  {n.author}: {n.text}
                </p>
              ))}
              {!compact && item.state !== "sent" && item.state !== "rejected" && item.state !== "revising" && (
                <button type="button" className="mt-2 text-xs text-dpcp-blue" onClick={() => setBlockId(block.id)}>
                  Comment on this
                </button>
              )}
              {blockId === block.id && (
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-11 flex-1 rounded-lg border border-border bg-white px-3 text-sm"
                    placeholder="What should change here?"
                  />
                  <Button type="button" onClick={() => save(block.id, note)}>
                    Save note
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {item.versions.length > 1 && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-dpcp-blue">Earlier rounds</summary>
          <ul className="mt-2 space-y-2">
            {item.versions
              .filter((v) => v.number !== item.current)
              .map((v) => (
                <li key={v.number}>
                  Round {v.number} · {v.at} · {v.summary}
                </li>
              ))}
          </ul>
        </details>
      )}

      {!compact && item.state !== "sent" && item.state !== "rejected" && item.state !== "revising" && (
        <div className="mt-4">
          <label className="text-sm">
            A note on the whole piece
            <textarea
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
              className="mt-1 min-h-20 w-full rounded-xl border border-border p-3 text-sm"
            />
          </label>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {overall.trim() || item.notes.some((n) => n.version === item.current) ? (
              <Button
                onClick={() => {
                  if (overall.trim()) save(null, overall);
                  app.requestReviewChanges(item.id);
                }}
              >
                Ask for this change
              </Button>
            ) : (
              <Button onClick={() => app.approveReview(item.id)}>Approve</Button>
            )}
            <Button variant="outline" onClick={() => app.rejectReview(item.id)}>
              Set aside
            </Button>
          </div>
        </div>
      )}

      {item.state === "revising" && <p className="mt-4 text-sm">Revising from your notes. You'll see it here when it's ready.</p>}

      {item.state === "approved" && (item.kind === "email" || item.kind === "social") && (
        <Button className="mt-4" onClick={() => app.sendReview(item.id)}>
          Send
        </Button>
      )}
    </Surface>
  );
}

export function ReviewScreen() {
  const app = useApp();
  if (app.ui.role === "owner") return <OwnerReview />;
  return <StaffReview />;
}

function StaffReview() {
  const app = useApp();
  const [index, setIndex] = useState(0);
  const [points, setPoints] = useState<string[]>([""]);
  const placeholder = /laura|canyon view|desert bloom|fall visit|october collections/i;
  const queue = app.model.reviews.filter(
    (review) =>
      !placeholder.test(review.title) &&
      (review.kind === "document" || review.kind === "spreadsheet") &&
      (review.ownerId === app.viewer.id || app.ui.role === "george") &&
      (review.state === "needs_review" || review.state === "ready_again" || review.state === "revising")
  );
  const feedbackStarted = points.some((point) => point.trim().length > 0);
  const item = queue[Math.min(index, Math.max(queue.length - 1, 0))];
  const version = item?.versions.find((row) => row.number === item.current) ?? item?.versions[0];

  return (
    <PageFrame title="Review" lede="Everything waiting, in a stack you can scroll.">
      <AppealReview />
      <ReviewDeck />
      {app.ui.screenState === "empty" || !item || !version ? null : (
        <Surface className="p-6 md:p-8">
          <h2 className="font-heading text-3xl tracking-tight text-dpcp-navy">{item.title}</h2>
          <p className="mt-2 text-base text-muted-foreground">{item.forWhom}</p>
          <p className="mt-4 text-base leading-relaxed">{item.whyNow}</p>
          <div className="mt-6 space-y-3">
            {version.blocks.map((block) => (
              <p key={block.id} className="text-base leading-relaxed whitespace-pre-wrap">
                {block.text}
              </p>
            ))}
          </div>
          <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-dpcp-blue">
            Open files in Google Drive
          </a>
          {item.state === "revising" ? (
            <p className="mt-6 text-sm">Revising from your notes. It comes back here.</p>
          ) : (
            <div className="mt-8 space-y-3">
              <p className="text-sm font-medium text-dpcp-navy">Your feedback, point by point</p>
              {points.map((point, i) => (
                <input
                  key={i}
                  value={point}
                  onChange={(e) => setPoints((rows) => rows.map((row, n) => (n === i ? e.target.value : row)))}
                  placeholder={`Point ${i + 1}`}
                  className="h-11 w-full rounded-2xl bg-[#f4f6f8] px-3 text-sm outline-none"
                />
              ))}
              <button type="button" className="text-sm text-dpcp-blue" onClick={() => setPoints((rows) => [...rows, ""])}>
                Add a point
              </button>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    points.filter((point) => point.trim()).forEach((point) => app.addReviewNote(item.id, null, point));
                    app.requestReviewChanges(item.id);
                    setPoints([""]);
                  }}
                >
                  Submit feedback
                </Button>
                <Button
                  disabled={feedbackStarted || (item.state !== "needs_review" && item.state !== "ready_again")}
                  onClick={() => {
                    app.approveReview(item.id);
                    setIndex(0);
                  }}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </Surface>
      )}
      <OtherDrafts />
    </PageFrame>
  );
}
