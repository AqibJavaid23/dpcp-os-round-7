"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DepartmentMark } from "@/components/brand";
import { ErrorState, LoadingBlock, PanelLabel, ProgressBar, StatusTag, Surface } from "@/components/bits";
import { PageFrame } from "@/components/app-shell";
import { WhyThisMatters } from "@/components/chain";
import { DEPARTMENTS } from "@/lib/seed";
import { useApp } from "@/lib/store";

export function TaskDetailScreen({ id }: { id: string }) {
  const app = useApp();
  const task = app.taskById(id);
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");

  if (app.ui.screenState === "loading") {
    return (
      <PageFrame>
        <LoadingBlock />
      </PageFrame>
    );
  }
  if (app.ui.screenState === "error") {
    return (
      <PageFrame>
        <ErrorState message="Couldn't load this task. Your work is saved." />
      </PageFrame>
    );
  }
  if (!task || !app.canViewTask(task)) {
    return (
      <PageFrame>
        <Surface>
          <p className="text-sm">This task isn't available. It may have been moved or you may not have access.</p>
          <Button className="mt-4" render={<Link href="/today" />}>
            Back to Today
          </Button>
        </Surface>
      </PageFrame>
    );
  }

  const over = task.estimateMin > 0 ? task.spentMin / task.estimateMin : 0;

  return (
    <PageFrame>
      <Link href="/today" className="text-sm text-dpcp-blue">
        ← Back to Today
      </Link>
      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <Surface>
            <div className="flex flex-wrap gap-2">
              <StatusTag tone={task.dueTone}>{task.status === "done" ? "Done" : task.dueLabel}</StatusTag>
              <StatusTag>{task.sourceLabel}</StatusTag>
            </div>
            <h1 className="font-heading mt-3 text-2xl font-semibold text-dpcp-navy">{task.title}</h1>
            {(() => {
              const dept = DEPARTMENTS.find((d) => d.id === task.departmentId);
              return dept ? (
                <div className="mt-3">
                  <DepartmentMark departmentId={dept.id} family={dept.family} name={dept.name} />
                </div>
              ) : null;
            })()}
            <p className="mt-2 text-sm text-muted-foreground">
              {app.people.find((p) => p.id === task.ownerId)?.name} · {task.sourceLabel}
            </p>
            <WhyThisMatters task={task} />
            {task.status === "done" && (
              <p className="mt-3 rounded-lg bg-status-green-bg px-3 py-2 text-sm text-status-green">
                Done {task.doneAt} {task.proof ? `· ${task.proof}` : ""}
              </p>
            )}
            <div className="mt-4">
              <PanelLabel>Definition of done</PanelLabel>
              <p className="mt-1 text-sm">{task.doneDefinition}</p>
            </div>
            {task.steps.length > 0 && (
              <div className="mt-4">
                <PanelLabel>Steps {task.sop ? `(SOP: ${task.sop.name})` : ""}</PanelLabel>
                <ul className="mt-2 space-y-2 text-sm">
                  {task.steps.map((step) => (
                    <li key={step.id}>
                      {step.state === "done" ? "✓" : step.state === "current" ? "●" : "○"} {step.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-4">
              <PanelLabel>Prepared by AI</PanelLabel>
              {app.aiPaused && task.prepared.length === 0 ? (
                <p className="mt-1 text-sm">Not prepared yet. You can work it manually.</p>
              ) : (
                <ul className="mt-2 space-y-1 text-sm">
                  {task.prepared.map((line) => (
                    <li key={line}>✓ {line}</li>
                  ))}
                </ul>
              )}
              {task.draft && (
                <p className="mt-3 whitespace-pre-wrap rounded-xl bg-muted p-3 text-sm">{task.draft.body}</p>
              )}
            </div>
            {task.status !== "done" && (
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {task.kind === "approval" ? (
                  <Button onClick={() => app.approveTask(task.id)}>Approve & send</Button>
                ) : (
                  <Button onClick={() => app.markDone(task.id)}>Done…</Button>
                )}
                {task.status === "blocked" && (
                  <Button variant="outline" onClick={() => app.markDone(task.id)}>
                    Mark unblocked
                  </Button>
                )}
                <Button variant="outline" onClick={() => app.needMoreTime(task.id, "Tomorrow")}>
                  Need more time
                </Button>
                {!app.aiPaused && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      app.setChatContext(`About: ${task.title}`);
                      app.showToast("Chat is open with this task attached.");
                    }}
                  >
                    Ask AI about this task
                  </Button>
                )}
              </div>
            )}
            {(app.ui.role === "leader" || app.ui.role === "george") && task.ownerId !== app.viewer.id && (
              <form
                className="mt-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reason.trim()) return;
                  app.reassign(task.id, "faisal", reason);
                }}
              >
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason to reassign"
                  className="h-11 flex-1 rounded-xl border border-border px-3 text-sm"
                />
                <Button type="submit" variant="outline">
                  Reassign
                </Button>
              </form>
            )}
          </Surface>
          <Surface>
            <PanelLabel>History</PanelLabel>
            <ul className="mt-2 space-y-2 text-sm">
              {task.history.length === 0 && <li className="text-muted-foreground">No steps yet.</li>}
              {task.history.map((event) => (
                <li key={event.id}>
                  <span className="text-muted-foreground">{event.at}</span> · {event.actor}: {event.text}
                </li>
              ))}
            </ul>
          </Surface>
          <Surface className="lg:hidden">
            <PanelLabel>Comments</PanelLabel>
            <CommentBox taskId={task.id} note={note} setNote={setNote} />
          </Surface>
        </div>
        <div className="space-y-4">
          <Surface>
            <PanelLabel>Dates</PanelLabel>
            <p className="mt-2 text-sm">Original due {task.originalDue}</p>
            <p className="text-sm">Current due {task.currentDue}</p>
            <p className="mt-2 text-sm">
              Estimate {task.estimateMin} min · Time Doctor so far {task.spentMin} min
            </p>
            <div className="mt-2">
              <ProgressBar value={task.spentMin} max={task.estimateMin || 1} tone={over > 1.5 ? "amber" : "green"} />
            </div>
          </Surface>
          {task.waitingNote && (
            <Surface>
              <PanelLabel>Waiting on</PanelLabel>
              <p className="mt-2 text-sm">{task.waitingNote}</p>
            </Surface>
          )}
          {task.related.length > 0 && (
            <Surface>
              <PanelLabel>Related</PanelLabel>
              <ul className="mt-2 space-y-1 text-sm">
                {task.related.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-dpcp-blue">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Surface>
          )}
          <Surface className="hidden lg:block">
            <PanelLabel>Comments</PanelLabel>
            <CommentBox taskId={task.id} note={note} setNote={setNote} />
          </Surface>
        </div>
      </div>
    </PageFrame>
  );
}

function CommentBox({
  taskId,
  note,
  setNote,
}: {
  taskId: string;
  note: string;
  setNote: (v: string) => void;
}) {
  const app = useApp();
  const task = app.taskById(taskId);
  return (
    <div>
      <ul className="mt-2 space-y-2 text-sm">
        {task?.comments.map((c) => (
          <li key={c.id}>
            <span className="font-medium">{c.author}</span> · {c.text}
          </li>
        ))}
      </ul>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          app.addComment(taskId, note);
          setNote("");
        }}
      >
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note"
          className="h-11 flex-1 rounded-xl border border-border px-3 text-sm"
        />
        <Button type="submit" variant="outline">
          Add
        </Button>
      </form>
    </div>
  );
}
