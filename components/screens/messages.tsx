"use client";

import { useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { FloorReplies } from "@/components/round2/wired";
import { Surface } from "@/components/bits";
import { Button } from "@/components/ui/button";
import { AskInMessage, GeorgeTime, WinsCulture } from "@/components/round4/experience";
import { NOTICE } from "@/lib/seed";
import { useApp } from "@/lib/store";
import type { InboxItem } from "@/lib/types";

type Channel = "client" | "internal" | "slack";

function channelOf(message: InboxItem): Channel {
  if (message.sourceKind === "slack") return "slack";
  if (message.client) return "client";
  return "internal";
}

function needsAction(message: InboxItem, cleared: Set<string>) {
  if (cleared.has(message.id)) return false;
  return message.tab === "reply" || message.tab === "decision" || message.tab === "held";
}

function samples(ownerId: string): InboxItem[] {
  return [
    {
      id: "r5-elena",
      ownerId,
      tab: "reply",
      source: "Gmail",
      sourceKind: "gmail",
      from: "Elena Voss",
      org: "Dental Practice Copilot",
      subject: "Kit invoice coding",
      summary: "Elena asked which department code the Mesa Verde kit invoice should use.",
      time: "9:20 AM AZ",
      body: "Can you confirm the department code before I post the kit invoice?",
      draft: "Use the supplies code. I'll confirm the early-pay line separately.",
      triage: "Needs reply · internal email",
      client: false,
    },
    {
      id: "r5-rowan",
      ownerId,
      tab: "reply",
      source: "Gmail",
      sourceKind: "gmail",
      from: "Rowan Blake",
      org: "Dental Practice Copilot",
      subject: "Domain renewal",
      summary: "The company workspace domain renews in March. No personal account.",
      time: "Yesterday",
      body: "The renewal sits on the company workspace. I need a yes before I extend it.",
      draft: "Yes. Keep it on the company workspace.",
      triage: "Needs reply · internal email",
      client: false,
    },
    {
      id: "r5-priya",
      ownerId,
      tab: "reply",
      source: "Slack · #marketing",
      sourceKind: "slack",
      from: "Priya Shah",
      org: "Dental Practice Copilot",
      subject: "Mesa Verde launch page",
      summary: "Priya wants a look at the launch page before it is promoted.",
      time: "10:05 AM AZ",
      body: "The staging page is ready for a read. Production waits on George.",
      draft: "I'll read it today and leave notes on the page.",
      triage: "Needs reply · internal Slack",
    },
  ];
}

function rewriteReply(current: string, instruction: string) {
  const change = instruction.trim().replace(/[.?!]$/, "");
  const lead = change.charAt(0).toUpperCase() + change.slice(1);
  const base = current.trim();
  if (!base) return `${lead}.`;
  const first = base.split(/(?<=[.?!])\s+/)[0] ?? base;
  return `${first} ${lead}.`;
}

export function MessagesScreen() {
  const app = useApp();
  const [openId, setOpenId] = useState<string | null>(null);
  const [cleared, setCleared] = useState<Set<string>>(() => new Set());
  const mine = [...app.model.messages.filter((message) => message.ownerId === app.viewer.id), ...samples(app.viewer.id)];
  const open = mine.find((message) => message.id === openId) ?? null;

  function clear(id: string) {
    setCleared((current) => new Set(current).add(id));
    app.ackMessage(id);
  }

  if (open) {
    return (
      <PageFrame>
        <ThreadReader message={open} onBack={() => setOpenId(null)} onClear={() => clear(open.id)} />
      </PageFrame>
    );
  }

  const sections: { id: Channel; label: string }[] = [
    { id: "client", label: "Client email" },
    { id: "internal", label: "Internal email" },
    { id: "slack", label: "Internal Slack" },
  ];
  const counts = Object.fromEntries(sections.map((section) => [section.id, mine.filter((message) => channelOf(message) === section.id && needsAction(message, cleared)).length])) as Record<Channel, number>;
  const total = counts.client + counts.internal + counts.slack;

  return (
    <PageFrame title="Communication" lede="One page. Client email, internal email, and internal Slack, each in its own stack.">
      {app.noticeOpen && (
        <section className="mb-8">
          <h2 className="font-heading text-xl text-dpcp-navy">Announcements</h2>
          <Surface className="mt-3">
            <p className="text-sm text-muted-foreground">Announcement · {NOTICE.from} · {NOTICE.when}</p>
            <h3 className="mt-1 text-lg font-medium text-dpcp-navy">{NOTICE.title}</h3>
            <p className="mt-2 text-sm leading-relaxed">{NOTICE.body}</p>
            <p className="mt-3 text-sm text-muted-foreground">{NOTICE.changes}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button onClick={app.acknowledge}>Acknowledge</Button>
              <Button variant="outline" onClick={app.questionNotice}>I have a question</Button>
            </div>
          </Surface>
        </section>
      )}
      <GeorgeTime />
      <FloorReplies />
      {total === 0 ? (
        <p className="mb-6 rounded-3xl bg-status-green-bg px-4 py-4 text-sm text-status-green">All caught up</p>
      ) : (
        <p className="mb-6 text-sm text-muted-foreground">{total} need you across the three inboxes.</p>
      )}
      <div className="space-y-10">
        {sections.map((section) => {
          const rows = mine.filter((message) => channelOf(message) === section.id);
          const count = counts[section.id];
          return (
            <section key={section.id}>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-heading text-2xl text-dpcp-navy">{section.label}</h2>
                <p className={count === 0 ? "text-sm text-status-green" : "text-sm text-status-blue"}>{count === 0 ? "All caught up" : `${count} need you`}</p>
              </div>
              <div className="mt-3 space-y-2">
                {rows.length === 0 && <Surface><p className="text-sm">All caught up</p></Surface>}
                {rows.map((message) => {
                  const openItem = needsAction(message, cleared);
                  return (
                    <button key={message.id} type="button" className="flex w-full items-start gap-3 rounded-2xl bg-white px-3 py-3 text-left shadow-sm" onClick={() => setOpenId(message.id)}>
                      <span className={openItem ? "mt-1 h-2 w-2 shrink-0 rounded-full bg-dpcp-blue" : "mt-1 h-2 w-2 shrink-0 rounded-full bg-border"} aria-hidden />
                      <span className="min-w-0">
                        <span className="block text-xs text-muted-foreground">{message.source} · {message.from}</span>
                        <span className="block truncate text-sm font-medium text-dpcp-navy">{message.subject}</span>
                        <span className="block truncate text-sm text-muted-foreground">{message.summary}</span>
                      </span>
                      <span className={openItem ? "rounded-full bg-status-blue-bg px-2 py-0.5 text-[11px] text-status-blue" : "rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"}>
                        {openItem ? "Needs you" : "Filed"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">WhatsApp and texts are still later. They are not one of these three.</p>
      <WinsCulture />
    </PageFrame>
  );
}

function ThreadReader({ message, onBack, onClear }: { message: InboxItem; onBack: () => void; onClear: () => void }) {
  const app = useApp();
  const [reply, setReply] = useState(message.draft ?? "");
  const [ask, setAsk] = useState("");
  const [sent, setSent] = useState(false);
  const involved = [message.from, message.org, app.viewer.name].filter(Boolean);
  const thread = [
    { who: message.from, when: message.time, text: message.body },
    { who: "Earlier in the thread", when: "Before today", text: "The first note asked for a status. This page keeps that history with the latest ask." },
    { who: "AI", when: "10:42 AM", text: message.summary },
  ];

  return (
    <article className="mx-auto max-w-3xl">
      <button type="button" className="text-sm text-dpcp-blue" onClick={onBack}>
        Back to Communication
      </button>
      <p className="mt-6 text-xs text-muted-foreground">{message.source} · {message.time}</p>
      <h1 className="font-heading mt-2 text-3xl tracking-tight text-dpcp-navy md:text-4xl">{message.subject}</h1>
      <p className="mt-4 text-base leading-relaxed"><span className="font-medium text-dpcp-navy">AI summary. </span>{message.summary}</p>
      <p className="mt-3 text-sm"><span className="font-medium text-dpcp-navy">Who is involved. </span>{involved.join(" · ")}</p>
      <section className="mt-8">
        <h2 className="font-heading text-xl text-dpcp-navy">Thread</h2>
        <ol className="mt-3 space-y-3">
          {thread.map((line) => (
            <li key={line.who} className="rounded-3xl bg-white px-4 py-4">
              <p className="text-xs text-muted-foreground">{line.who} · {line.when}</p>
              <p className="mt-1 text-sm leading-relaxed">{line.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <p className="mt-6 text-sm"><span className="font-medium text-dpcp-navy">Status. </span>{message.triage}{message.slaLabel ? ` · ${message.slaLabel}` : ""}</p>
      <p className="mt-3 text-sm">
        <span className="font-medium text-dpcp-navy">Related. </span>
        {message.taskId ? <Link href={`/tasks/${message.taskId}`} className="text-dpcp-blue">Open the linked task</Link> : "No linked task yet."}
      </p>
      <p className="mt-3 text-sm"><span className="font-medium text-dpcp-navy">Suggested next action. </span>{message.draft ? "Read the draft, then send it or change the words." : "Acknowledge it, or write a short reply."}</p>
      <AskInMessage subject={`${message.subject} ${message.summary}`} />
      {sent ? (
        <p className="mt-6 text-sm text-status-green">Sent. This inbox count is one lower.</p>
      ) : (
        <>
          <form
            className="mt-6 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (!ask.trim()) return;
              setReply(rewriteReply(reply, ask));
              setAsk("");
              app.showToast("Rewritten. Read it, then send or change the words yourself.");
            }}
          >
            <input value={ask} onChange={(event) => setAsk(event.target.value)} placeholder="Edit with AI" aria-label="Edit with AI" className="h-11 flex-1 rounded-2xl bg-white px-3 text-sm outline-none" />
            <Button type="submit" variant="outline">Edit with AI</Button>
          </form>
          {message.tab !== "held" && (
            <label className="mt-3 block text-sm text-muted-foreground">
              Reply
              <textarea value={reply} onChange={(event) => setReply(event.target.value)} className="mt-1 min-h-28 w-full rounded-2xl bg-white px-3 py-2 text-sm outline-none" />
            </label>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {message.tab !== "held" && (
              <Button
                disabled={!reply.trim()}
                onClick={() => {
                  setSent(true);
                  onClear();
                  app.showToast("Sent.");
                }}
              >
                Send
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                onClear();
                onBack();
              }}
            >
              Acknowledge
            </Button>
          </div>
        </>
      )}
    </article>
  );
}
