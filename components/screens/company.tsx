"use client";

import { PageFrame } from "@/components/app-shell";
import { ErrorState, LoadingBlock, StatusTag, Surface } from "@/components/bits";
import { ModelsPanel } from "@/components/models-panel";
import { Button } from "@/components/ui/button";
import { DecisionsLog } from "@/components/round4/modules";
import { MakeupCompliance } from "@/components/round4/experience";
import { DEPARTMENTS } from "@/lib/seed";
import { useApp } from "@/lib/store";

export function CompanyScreen() {
  const app = useApp();
  if (app.ui.role !== "george") {
    return (
      <PageFrame title="Company">
        <Surface>
          <p className="text-sm">This view is George's. Open Demo and choose George.</p>
        </Surface>
      </PageFrame>
    );
  }
  const needs = [
    ...app.model.decisions.filter((item) => item.status === "open").map((item) => ({
      id: item.id,
      title: item.title,
      detail: `${item.asker} · ${item.deadline}`,
      action: () => app.decide(item.id, item.options[0] ?? "Approve"),
    })),
  ];
  const exceptions = DEPARTMENTS.filter((dept) => dept.overdue > 0 || dept.onTime < 85 || dept.blocked > 0);

  return (
    <PageFrame title="Company" lede="What is waiting on you, then only what is off.">
      <section>
        <h2 className="font-heading text-2xl text-dpcp-navy">What your team needs from you</h2>
        <div className="mt-4 space-y-3">
          {needs.length === 0 && <Surface><p className="text-sm">Nobody is blocked on you.</p></Surface>}
          {needs.map((item) => (
            <Surface key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-medium text-dpcp-navy">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
              <Button onClick={item.action}>Approve</Button>
            </Surface>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <MakeupCompliance />
        <h2 className="font-heading text-2xl text-dpcp-navy">Progress</h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">Only the departments that need a look.</p>
        {exceptions.length === 0 ? (
          <Surface><p className="text-sm">Every department is inside its range.</p></Surface>
        ) : (
          <div className="space-y-3">
            {exceptions.map((dept) => (
              <Surface key={dept.id}>
                <p className="font-medium text-dpcp-navy">{dept.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {dept.onTime}% on time · {dept.overdue} overdue · {dept.blocked} blocked · replies slowing where the queue is late
                </p>
              </Surface>
            ))}
          </div>
        )}
      </section>
    </PageFrame>
  );
}

export function DecisionsScreen() {
  const app = useApp();
  const canQueue = app.ui.role === "george" || app.ui.role === "leader";
  const open = app.model.decisions.filter((d) => d.status === "open");
  return (
    <PageFrame title="Decisions" lede="The log is for everyone. The queue is for a lead or George.">
      <DecisionsLog showQueue={canQueue} />
      {canQueue && (app.ui.screenState === "empty" || open.length === 0 ? (
        <Surface>
          <p>No decisions waiting.</p>
        </Surface>
      ) : app.ui.screenState === "loading" ? (
        <LoadingBlock />
      ) : app.ui.screenState === "error" ? (
        <ErrorState message="Couldn't load. Try again." />
      ) : (
        <div className="space-y-3">
          {app.offline && (
            <p className="text-sm">Decisions need a connection so nothing is approved twice.</p>
          )}
          {app.model.decisions.map((d) => (
            <Surface key={d.id}>
              <div className="flex flex-wrap gap-2">
                <StatusTag tone={d.urgency === "today" ? "amber" : "neutral"}>{d.kind}</StatusTag>
                <StatusTag>{d.deadline}</StatusTag>
                {d.status !== "open" && <StatusTag tone="green">{d.status}</StatusTag>}
              </div>
              <h2 className="font-heading mt-2 text-lg text-dpcp-navy">{d.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {d.asker} · {d.context}
              </p>
              {d.status === "open" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.options.map((option) => (
                    <Button
                      key={option}
                      variant={option === d.options[0] ? "default" : "outline"}
                      disabled={app.offline}
                      onClick={() => app.decide(d.id, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
              {app.ui.confirmMoneyId === d.id && d.amount && (
                <div className="mt-3 rounded-xl bg-dpcp-wash p-3 text-sm text-dpcp-navy">
                  <p>
                    Approve {d.amount} to {d.payee}?
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button onClick={() => app.decide(d.id, "Approve")}>Approve {d.amount}</Button>
                    <Button variant="outline" onClick={() => app.setConfirmMoney(null)}>
                      Back
                    </Button>
                  </div>
                </div>
              )}
              {d.choice && <p className="mt-2 text-sm">Recorded: {d.choice}</p>}
            </Surface>
          ))}
        </div>
      ))}
    </PageFrame>
  );
}

export function SystemScreen() {
  const app = useApp();
  if (app.ui.role !== "george") {
    return (
      <PageFrame title="System">
        <Surface>
          <p className="text-sm">System health is for George. Open Demo and choose George.</p>
        </Surface>
      </PageFrame>
    );
  }
  const rows = [
    ["App", "Up", "green"],
    ["Email intake", "Up · last message 1 min ago", "green"],
    ["Slack intake", app.ui.slackReconnect ? "Needs reconnect" : "Up", app.ui.slackReconnect ? "amber" : "green"],
    ["Triage backlog", "4 min", "green"],
    ["n8n", "Up", "green"],
    ["Grok", app.aiPaused ? "Paused" : "Primary · up", app.aiPaused ? "amber" : "green"],
    ["Grok Bot", "Up", "green"],
    ["Time Doctor", "Highest tier · API connected", "green"],
    ["Gemini", "Backup · ready", "green"],
  ] as const;
  return (
    <PageFrame title="System" lede="Uptime this week 99.8% · target 99.5%.">
      {app.ui.screenState === "loading" ? (
        <LoadingBlock />
      ) : app.ui.screenState === "error" ? (
        <ErrorState message="Couldn't load. Try again." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <Surface>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Status</p>
            <ul className="mt-3 divide-y divide-border text-sm">
              {rows.map(([name, detail, tone]) => (
                <li key={name} className="flex items-center justify-between gap-3 py-2">
                  <span>{name}</span>
                  <StatusTag tone={tone}>{detail}</StatusTag>
                </li>
              ))}
            </ul>
          </Surface>
          <div className="space-y-3">
            <Surface>
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Needs attention</p>
              {app.ui.screenState === "empty" ? (
                <p className="mt-2 text-sm">Nothing needs attention.</p>
              ) : (
                <>
                  <p className="mt-2 text-sm">Time Doctor has no user for Jamie Okonkwo. The release owner owns this.</p>
                  <Button className="mt-3" variant="outline" onClick={() => app.showToast("Owner updated.")}>
                    Reassign owner
                  </Button>
                </>
              )}
            </Surface>
            <Surface>
              <p className="text-sm">{app.model.georgePaused ? "AI is paused." : "AI is running."}</p>
              <Button className="mt-3" onClick={() => app.pauseAi(!app.model.georgePaused)}>
                {app.model.georgePaused ? "Resume AI" : "Pause AI"}
              </Button>
              {!app.model.georgePaused && (
                <p className="mt-2 text-xs text-muted-foreground">Pause AI for everyone? People can keep working manually.</p>
              )}
            </Surface>
            <ModelsPanel />
            <Surface>
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Backups</p>
              <p className="mt-2 text-sm">Last good backup: today 2:10 AM AZ. Last tested restore: Oct 1.</p>
            </Surface>
            <Surface>
              <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Ideas from the team</p>
              <p className="mt-2 text-sm">
                {app.model.ideas.filter((idea) => idea.status === "received").length} received ·{" "}
                {app.model.ideas.filter((idea) => idea.status === "building").length} building ·{" "}
                {app.model.ideas.filter((idea) => idea.status === "shipped").length} shipped
              </p>
              <a href="/ideas" className="mt-2 inline-block text-sm text-dpcp-blue">
                Ideas & Roadmap
              </a>
            </Surface>
          </div>
        </div>
      )}
    </PageFrame>
  );
}
