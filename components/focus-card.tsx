"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DepartmentMark } from "@/components/brand";
import { PanelLabel, StatusTag, Surface } from "@/components/bits";
import { WhyThisMatters } from "@/components/chain";
import { DEPARTMENTS } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { Task } from "@/lib/types";

const BLOCKS = [
  "Waiting on a client",
  "Waiting on a teammate",
  "Missing access",
  "Don't know how",
  "Something else",
];

const TIMES = ["Later today", "Tomorrow", "Friday", "Oct 24"];

export function FocusCard({ task }: { task: Task }) {
  const app = useApp();
  const editing = app.ui.editingTaskId === task.id;
  const offline = app.offline;

  return (
    <Surface className="p-4 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusTag tone={task.kind === "approval" ? "blue" : task.dueTone}>
          {task.kind === "approval"
            ? "Needs your approval"
            : task.kind === "meeting"
              ? "Meeting prep"
              : task.kind === "decision"
                ? "Needs you"
                : task.status === "waiting"
                  ? "Waiting"
                  : task.status === "blocked"
                    ? "Blocked"
                    : "Ready"}
        </StatusTag>
        <StatusTag>{task.sourceLabel}</StatusTag>
        <StatusTag tone={task.dueTone}>{task.dueLabel}</StatusTag>
        <span className="text-xs text-muted-foreground">≈ {task.estimateMin} min</span>
        {task.queued && <StatusTag tone="amber">Sends when you're back</StatusTag>}
      </div>

      <h2 className="font-heading mt-3 text-xl font-semibold text-dpcp-navy md:text-[22px]">
        {task.title}
      </h2>
      {(() => {
        const dept = DEPARTMENTS.find((d) => d.id === task.departmentId);
        return dept ? <div className="mt-2"><DepartmentMark departmentId={dept.id} family={dept.family} name={dept.name} className="h-7" /></div> : null;
      })()}
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/80">{task.why}</p>
      <WhyThisMatters task={task} />

      {task.waitingNote && (
        <p className="mt-3 text-sm text-status-amber">{task.waitingNote}</p>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {task.draft && (
          <div className="rounded-xl bg-muted p-4">
            <PanelLabel>
              {editing ? "Editing draft" : task.draft.accountLabel}
            </PanelLabel>
            {editing ? (
              <textarea
                className="mt-2 min-h-36 w-full rounded-lg border border-border bg-card p-2 text-sm"
                value={app.ui.draftBuffer}
                onChange={(e) => app.startEdit({ ...task, draft: { ...task.draft!, body: e.target.value } })}
              />
            ) : (
              <p className="mt-2 line-clamp-3 text-sm whitespace-pre-wrap md:line-clamp-none">
                {task.draft.body}
              </p>
            )}
            <p className="mt-2 text-xs text-dpcp-blue md:hidden">Tap the task to read all</p>
          </div>
        )}
        <div className="rounded-xl bg-muted p-4">
          <PanelLabel>Prepared for you</PanelLabel>
          <ul className="mt-2 space-y-1.5 text-sm">
            {(task.unprepared ? ["Not prepared yet. You can work it manually."] : task.prepared).map((line) => (
              <li key={line} className="flex gap-2">
                <span className="text-status-green">✓</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">{task.doneDefinition}</p>
          {task.sop && (
            <p className="mt-1 text-xs text-dpcp-blue">
              SOP: {task.sop.name}, {task.sop.section}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 md:flex-row md:flex-wrap">
        {editing ? (
          <>
            <Button onClick={() => app.approveTask(task.id)}>Approve & send</Button>
            <Button variant="outline" onClick={app.cancelEdit}>
              Cancel edits
            </Button>
          </>
        ) : task.kind === "approval" ? (
          <>
            <Button className="w-full md:w-auto" onClick={() => app.approveTask(task.id)}>
              {offline ? "Approve: sends when you're back online" : "Approve & send"}
            </Button>
            <div className="grid grid-cols-3 gap-2 md:flex">
              <Button variant="outline" onClick={() => app.startEdit(task)}>
                <span className="md:hidden">Edit</span>
                <span className="hidden md:inline">Edit draft</span>
              </Button>
              <Button variant="outline" onClick={() => app.openSheet("blocked", task.id)}>
                <span className="md:hidden">Blocked</span>
                <span className="hidden md:inline">I'm blocked</span>
              </Button>
              <Button variant="outline" onClick={() => app.openSheet("time", task.id)}>
                <span className="md:hidden">More time</span>
                <span className="hidden md:inline">Need more time</span>
              </Button>
            </div>
          </>
        ) : task.kind === "meeting" ? (
          <>
            <Button render={<Link href="/meetings/canyon" />}>Open prep</Button>
            <Button variant="outline" onClick={() => app.openSheet("time", task.id)}>
              Need more time
            </Button>
            {task.skips < 2 && (
              <Button variant="outline" onClick={() => app.skipTask(task.id)}>
                Skip for now
              </Button>
            )}
          </>
        ) : task.kind === "decision" ? (
          <>
            {(task.options ?? ["Approve"]).map((option) => (
              <Button
                key={option}
                variant={option === (task.options ?? ["Approve"])[0] ? "default" : "outline"}
                onClick={() => {
                  if (option === "Move to tomorrow") {
                    app.moveToTomorrow("imran-appeal");
                    app.markDone(task.id);
                  } else if (option === "Reassign") {
                    app.reassign("imran-appeal", "faisal", "Faisal has 2 hours free today.");
                    app.markDone(task.id);
                  } else if (option === "Message Imran") {
                    app.messagePerson("Imran");
                  } else if (task.money && option === "Approve") app.decide("dec-deposit", "Approve");
                  else if (option === "Decline") app.decide("dec-deposit", "Decline");
                  else app.markDone(task.id);
                }}
              >
                {option}
              </Button>
            ))}
          </>
        ) : task.status === "waiting" ? (
          <>
            <Button onClick={() => app.openSheet("nudge", task.id)}>Nudge now</Button>
            <Button variant="outline" onClick={() => app.skipTask(task.id)}>
              Move on
            </Button>
          </>
        ) : (
          <>
            <Button className="w-full md:w-auto" onClick={() => app.markDone(task.id)}>
              Mark done
            </Button>
            <div className="grid grid-cols-3 gap-2 md:flex">
              <Button variant="outline" onClick={() => app.openSheet("blocked", task.id)}>
                I'm blocked
              </Button>
              <Button variant="outline" onClick={() => app.openSheet("time", task.id)}>
                Need more time
              </Button>
              {task.skips < 2 ? (
                <Button variant="outline" onClick={() => app.skipTask(task.id)}>
                  Skip for now
                </Button>
              ) : (
                <Button variant="outline" onClick={() => app.openSheet("time", task.id)}>
                  Need more time
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {app.ui.confirmMoneyId === "dec-deposit" && task.money && (
        <div className="mt-4 rounded-xl border border-dpcp-tint bg-dpcp-wash p-3 text-sm">
          <p>Approve {task.money.amount} to {task.money.payee}?</p>
          <div className="mt-2 flex gap-2">
            <Button onClick={() => app.decide("dec-deposit", "Approve")}>Approve {task.money.amount}</Button>
            <Button variant="outline" onClick={() => app.setConfirmMoney(null)}>
              Back
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3 text-sm">
        <button type="button" className="text-left text-muted-foreground" onClick={() => app.setPeekOpen(true)}>
          Next up: {app.peek[0]?.title ?? "Nothing else queued"}
        </button>
        <Link href={`/tasks/${task.id}`} className="shrink-0 text-dpcp-blue">
          Details
        </Link>
      </div>

      <ActionSheets task={task} />
    </Surface>
  );
}

function ActionSheets({ task }: { task: Task }) {
  const app = useApp();
  const open = app.ui.sheet;
  const active = app.ui.sheetTaskId === task.id || app.ui.sheetTaskId === "imran-appeal";

  return (
    <>
      <Sheet open={open === "blocked" && active} onOpenChange={(v) => !v && app.closeSheet()}>
        <SheetContent side="bottom" className="max-h-[80dvh]">
          <SheetHeader>
            <SheetTitle>I'm blocked</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 px-4 pb-6">
            {BLOCKS.map((reason) => (
              <Button key={reason} variant="outline" className="w-full justify-start" onClick={() => app.markBlocked(task.id, reason)}>
                {reason}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={open === "time" && active} onOpenChange={(v) => !v && app.closeSheet()}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Need more time</SheetTitle>
          </SheetHeader>
          <p className="px-4 text-sm text-muted-foreground">The original due date stays. Your lead sees the new date.</p>
          <div className="space-y-2 px-4 pt-3 pb-6">
            {TIMES.map((when) => (
              <Button key={when} variant="outline" className="w-full justify-start" onClick={() => app.needMoreTime(task.id, when)}>
                {when}
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={open === "proof"} onOpenChange={(v) => !v && app.closeSheet()}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Add proof</SheetTitle>
          </SheetHeader>
          <form
            className="space-y-3 px-4 pb-6"
            onSubmit={(e) => {
              e.preventDefault();
              app.markDone(app.ui.sheetTaskId ?? task.id, app.ui.proofText);
            }}
          >
            <p className="text-sm">Add proof: paste a link or number.</p>
            <input
              className="h-11 w-full rounded-xl border border-border px-3 text-sm"
              value={app.ui.proofText}
              onChange={(e) => app.setProofText(e.target.value)}
              placeholder="46 done, 3 exceptions"
            />
            <Button type="submit">Mark done</Button>
          </form>
        </SheetContent>
      </Sheet>
      <Sheet open={open === "nudge" && active} onOpenChange={(v) => !v && app.closeSheet()}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Nudge now</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-6 text-sm">
            <p className="rounded-xl bg-muted p-3">Hi Laura, just checking on the deposit date when you have a minute.</p>
            <Button
              onClick={() => {
                app.closeSheet();
                app.showToast("Sent to Laura. Undo");
              }}
            >
              Approve & send
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={app.ui.peekOpen} onOpenChange={app.setPeekOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Next up</SheetTitle>
          </SheetHeader>
          <p className="px-4 text-sm text-muted-foreground">
            Your AI orders these by due time, client impact and who's waiting.
          </p>
          <ul className="space-y-2 px-4 py-3 pb-6">
            {app.peek.map((item) => (
              <li key={item.id} className="rounded-xl border border-border px-3 py-2 text-sm">
                {item.title}
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
