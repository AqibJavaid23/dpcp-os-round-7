"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingBlock, ProgressBar, StatusTag, Surface } from "@/components/bits";
import { PageFrame } from "@/components/app-shell";
import { SettingsConsole } from "@/components/round6/settings-console";
import { ONBOARDING } from "@/lib/seed";
import { useApp } from "@/lib/store";

export function WeekScreen() {
  const app = useApp();
  const v = app.viewer;
  return (
    <PageFrame title="My week" lede="Your on-time rate is private. It is never a ranking.">
      {app.ui.screenState === "empty" ? (
        <Surface>
          <p>Nothing closed this week yet.</p>
        </Surface>
      ) : app.ui.screenState === "loading" ? (
        <LoadingBlock />
      ) : app.ui.screenState === "error" ? (
        <ErrorState message="Couldn't load your week. Your work is saved." />
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          <Surface>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">On-time · private</p>
            <p className="font-heading text-4xl text-dpcp-navy">{v.execution}%</p>
            <p className="text-sm text-muted-foreground">Goal {v.goal}%. Company target is 80%.</p>
            <div className="mt-3">
              <ProgressBar value={v.execution} max={100} />
            </div>
          </Surface>
          <Surface>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Streak</p>
            <p className="font-heading text-4xl text-dpcp-navy">{v.streak}</p>
            <p className="text-sm text-muted-foreground">days on time</p>
          </Surface>
          <Surface>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Hours saved</p>
            <p className="mt-2 text-sm">Today {v.savedToday}</p>
            <p className="text-sm text-muted-foreground">Estimate, from standard minutes minus your time.</p>
          </Surface>
        </div>
      )}
    </PageFrame>
  );
}

export function SettingsScreen() {
  return <SettingsConsole />;
}

export function TimeOffScreen() {
  const app = useApp();
  const v = app.viewer;
  const backup = app.people.find((p) => p.id === v.backup1);
  const second = app.people.find((p) => p.id === v.backup2);
  const noBackup = app.ui.screenState === "empty";
  return (
    <PageFrame title="Time off & backup" lede="Tell us when you're out. Your AI makes sure nothing urgent waits for you.">
      {app.ui.screenState === "loading" ? (
        <LoadingBlock />
      ) : app.ui.screenState === "error" ? (
        <ErrorState message="Couldn't load time off. Your request is saved." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-3">
            {noBackup ? (
              <Surface>
                <p className="text-sm text-status-red">You don't have a backup yet. Your lead needs to set one before you can request time off.</p>
              </Surface>
            ) : (
              <Surface>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">My backups</p>
                <p className="mt-2 text-sm">1st {backup?.name}</p>
                <p className="text-sm">2nd {second?.name}</p>
                <p className="mt-2 text-xs text-muted-foreground">Set by your lead. Coworkers only see “Out”, never the reason.</p>
              </Surface>
            )}
            <Surface>
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Thu Oct 22 – Fri Oct 23 · PTO</p>
              <p className="mt-1 text-sm">Approver: Omar Hale</p>
              {app.model.timeOffStatus !== "none" && (
                <p className="mt-2 text-sm">
                  <StatusTag tone="amber">{app.model.timeOffStatus === "pending" ? "Pending" : "Approved"}</StatusTag>
                </p>
              )}
              <div className="mt-3 space-y-2 text-sm">
                <p>Mesa Ridge reply · Urgent → {backup?.firstName}</p>
                <p>Canyon View call · Holding reply drafted</p>
                <p>Desert Bloom count · Waits for you</p>
              </div>
              <div className="mt-3 rounded-xl bg-muted p-3 text-sm">
                Hi, thanks for your message. {v.firstName} is out until Monday, Oct 26. {backup?.firstName} is helping in the meantime and will follow up today.
              </div>
              <Button className="mt-4" disabled={noBackup || app.model.timeOffStatus !== "none"} onClick={app.requestTimeOff}>
                Request time off
              </Button>
            </Surface>
          </div>
          <Surface>
            <p className="text-sm">While you're out, urgent work goes to {backup?.firstName}. Client notes wait for {backup?.firstName} to approve. Everything else waits for you, with a catch-up brief on Monday.</p>
          </Surface>
        </div>
      )}
    </PageFrame>
  );
}

export function SetupScreen() {
  const app = useApp();
  const allowed = app.ui.role === "george" || app.ui.role === "leader" || app.ui.role === "administrator";
  if (!allowed) {
    return (
      <PageFrame title="New employee setup">
        <Surface>
          <p className="text-sm">A leader, an administrator, or George uses this screen. Jamie doesn't see the checks.</p>
        </Surface>
      </PageFrame>
    );
  }
  const ready = app.model.connectors.every((c) => c.state === "green" || c.state === "pending_employee" || c.state === "not_required");
  return (
    <PageFrame title="New employee setup" lede="Jamie Okonkwo · Insurance · starts Mon Oct 26 · core profile. IT finishes the red rows before day 1.">
      <Surface className="mb-3">
        <p className="text-sm">
          {ready ? "Ready for day 1." : "Not ready. Two checks are still red."} Amber rows are waiting on Jamie, and that's expected.
        </p>
        <Button className="mt-3" variant="outline" onClick={app.recheckConnectors}>
          Re-check
        </Button>
      </Surface>
      <div className="space-y-2">
        {app.model.connectors.map((c) => (
          <Surface key={c.id} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-sm text-muted-foreground">{c.detail}</p>
              <p className="text-[11px] text-muted-foreground">Checked {c.checkedAt}</p>
            </div>
            <StatusTag
              tone={c.state === "green" ? "green" : c.state === "red" ? "red" : c.state === "pending_employee" ? "amber" : "neutral"}
            >
              {c.state === "green" ? "Verified" : c.state === "red" ? "Fix" : c.state === "pending_employee" ? "Waiting on Jamie" : "Not required"}
            </StatusTag>
          </Surface>
        ))}
      </div>
    </PageFrame>
  );
}

export function FinishSetupScreen() {
  const app = useApp();
  const done = app.model.finishSteps.filter((s) => s.state === "done").length;
  return (
    <PageFrame title="Finish setup" lede="Jamie Okonkwo · day 1. Target is under 5 minutes. Your first task opens after the notice and Slack.">
      <div className="mb-3">
        <p className="text-sm">
          {done} of {app.model.finishSteps.length}
        </p>
        <div className="mt-2">
          <ProgressBar value={done} max={app.model.finishSteps.length} />
        </div>
      </div>
      <div className="space-y-2">
        {app.model.finishSteps.map((step, index) => (
          <Surface key={step.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  {index + 1}. {step.title}
                </p>
                <p className="text-sm text-muted-foreground">{step.detail}</p>
              </div>
              <StatusTag tone={step.state === "done" ? "green" : step.state === "stuck" ? "amber" : "neutral"}>
                {step.state === "done" ? "Done" : step.state === "stuck" ? "IT has it" : "To do"}
              </StatusTag>
            </div>
            {step.state === "todo" && (
              <div className="mt-3 flex gap-2">
                <Button onClick={() => app.completeFinish(step.id)}>
                  {step.id === "ack" ? "Acknowledged" : "I've done this"}
                </Button>
                <Button variant="outline" onClick={() => app.stuckFinish(step.id)}>
                  I'm stuck
                </Button>
              </div>
            )}
          </Surface>
        ))}
      </div>
    </PageFrame>
  );
}

export function OnboardingScreen() {
  const app = useApp();
  const index = app.model.onboardingIndex;
  const step = ONBOARDING[index];
  return (
    <PageFrame>
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl text-dpcp-navy">Welcome to Dental Practice Copilot, Jamie</h1>
          <p className="text-sm text-muted-foreground">
            Day 1 of your first week · {index} of {ONBOARDING.length} steps done · about 2 hours today
          </p>
        </div>
        <div className="w-full lg:w-48">
          <ProgressBar value={index} max={ONBOARDING.length} />
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <Surface>
          <StatusTag tone="blue">Step {index + 1} of {ONBOARDING.length}</StatusTag>
          <span className="ml-2 text-xs text-muted-foreground">{step.estimate}</span>
          <h2 className="font-heading mt-3 text-xl text-dpcp-navy">{step.title}</h2>
          <p className="mt-2 text-sm">{step.detail}</p>
          {step.kind === "practice" && (
            <div className="mt-4 rounded-xl bg-muted p-3 text-sm">
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Practice reply · sends to your buddy only</p>
              <p className="mt-2 whitespace-pre-wrap">Hi Faisal, this is my practice reply. Jamie</p>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {step.kind === "practice" ? (
              <Button onClick={app.advanceOnboarding}>Approve & send (practice)</Button>
            ) : step.kind === "quiz" ? (
              <Button onClick={app.advanceOnboarding}>Start quiz</Button>
            ) : (
              <Button onClick={app.advanceOnboarding}>Mark done</Button>
            )}
            <Button variant="outline" onClick={() => app.showToast("Opened chat with this step attached.")}>
              I have a question
            </Button>
          </div>
        </Surface>
        <div className="space-y-3">
          <Surface>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Today</p>
            <ul className="mt-2 space-y-1 text-sm">
              {ONBOARDING.map((item, i) => (
                <li key={item.id}>
                  {i < index ? "✓" : i === index ? "●" : "○"} {item.title}
                </li>
              ))}
            </ul>
          </Surface>
          <Surface>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Your people</p>
            <p className="mt-2 text-sm">Lead · Omar Hale</p>
            <p className="text-sm">Buddy · Faisal Adeyemi</p>
            <p className="text-sm">People & Staffing · Amina Farouk</p>
          </Surface>
        </div>
      </div>
    </PageFrame>
  );
}

const MORE = [
  ["/switch", "Switch view"],
  ["/calendar", "Calendar"],
  ["/growth", "Professional Growth"],
  ["/people", "People & Org"],
  ["/departments", "Departments & Copilots"],
  ["/knowledge", "Knowledge"],
  ["/ideas", "Ideas & Roadmap"],
  ["/settings", "Settings & Admin"],
];

export function MoreScreen() {
  const app = useApp();
  const items = app.ui.role === "owner" ? [["/switch", "Switch view"]] : MORE;
  return (
    <PageFrame title="More" lede={app.ui.role === "owner" ? "Switch view is the only item here." : "Everything that is not on the bar."}>
      <div className="space-y-2">
        {items.map(([href, label]) => (
          <Link key={href} href={href} className="block no-underline">
            <Surface>
              <span className="text-sm text-dpcp-navy">{label}</span>
            </Surface>
          </Link>
        ))}
      </div>
    </PageFrame>
  );
}
