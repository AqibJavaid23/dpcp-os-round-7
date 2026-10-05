"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const prompts = [
  "What's overdue for me?",
  "How do we handle a missing deposit?",
  "Draft a follow-up to Laura",
];

export function ChatPanel({ full = false, workspace = false, immersive = false }: { full?: boolean; workspace?: boolean; immersive?: boolean }) {
  const app = useApp();
  const [text, setText] = useState("");
  const paused = app.aiPaused;
  const empty = app.model.chat.length === 0;

  function send(value?: string) {
    const next = (value ?? text).trim();
    if (!next) return;
    app.sendChat(next);
    setText("");
  }

  return (
    <section
      className={cn(
        "flex min-h-0 flex-col bg-card",
        full ? "h-[calc(100dvh-8rem)]" : "h-full"
      )}
    >
      {!immersive && <header className="border-b border-border px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="font-heading text-base font-semibold text-dpcp-navy">{workspace ? "AI" : "Ask anything"}</h2>
            <p className="text-xs text-muted-foreground">
              {workspace
                ? "Use this when it isn't already a task. Nothing goes out until you approve it."
                : "Prepared for you. You still decide."}
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-dpcp-blue"
            onClick={app.newChat}
          >
            New chat
          </button>
        </div>
        {app.model.chatContext && (
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-dpcp-wash px-2.5 py-1 text-xs text-dpcp-navy">
            {app.model.chatContext}
            <button type="button" onClick={() => app.setChatContext(null)} aria-label="Clear context">
              ✕
            </button>
          </p>
        )}
      </header>}

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {empty && !immersive && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try one of these.</p>
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="block w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => send(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {app.model.chat.map((item) => {
          if (item.kind === "user") {
            return (
              <div key={item.id} className="flex justify-end">
                <div className="max-w-[90%] rounded-2xl rounded-br-md bg-dpcp-navy-deep px-3 py-2 text-sm text-white">
                  {item.text}
                  {item.queued && (
                    <span className="mt-1 block text-[11px] text-dpcp-tint">Saved on this device</span>
                  )}
                </div>
              </div>
            );
          }
          if (item.kind === "assistant") {
            return (
              <div key={item.id}>
                <div className="max-w-[95%] rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-sm">
                  {item.text}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{item.routeNote}</p>
                {app.model.chatContext && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-dpcp-blue"
                    onClick={() => app.showToast("Added to the draft. Undo")}
                  >
                    Insert into draft
                  </button>
                )}
              </div>
            );
          }
          if (item.kind === "clarify") {
            return (
              <div key={item.id} className="rounded-[14px] border border-border bg-card p-3">
                <p className="text-sm font-medium">{item.prompt}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.question}</p>
                {item.chosen ? (
                  <p className="mt-3 text-sm">You chose: {item.chosen}</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {item.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="w-full rounded-xl border border-border px-3 py-2.5 text-left text-sm hover:bg-muted"
                        onClick={() => app.chooseOption(item.id, option.id, option.label)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">{item.routeNote}</p>
              </div>
            );
          }
          if (item.kind === "confirm") {
            return (
              <div key={item.id} className="rounded-[14px] border border-border p-3 text-sm">
                <p>{item.prompt}</p>
                {item.resolved ? (
                  <p className="mt-2 text-muted-foreground">You chose {item.resolved === "yes" ? "Yes" : "No"}.</p>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => app.confirmMove(item.id, true)}>{item.yes}</Button>
                    <Button variant="outline" onClick={() => app.confirmMove(item.id, false)}>
                      {item.no}
                    </Button>
                  </div>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">App action · confirm before it changes</p>
              </div>
            );
          }
          if (item.kind === "approval") {
            return (
              <div key={item.id} className="rounded-[14px] border border-border p-3">
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">Approval · sends to {item.to}</p>
                <p className="mt-1 text-sm font-medium">{item.title}</p>
                <p className="mt-2 whitespace-pre-wrap rounded-lg bg-muted p-2 text-sm">{item.body}</p>
                {item.resolved ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.resolved === "sent" ? "Sent." : "Cancelled."}
                  </p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button onClick={() => app.handToReview(item.title, item.body)}>Hand to Review</Button>
                    <Button variant="outline" onClick={() => app.deliverJob(item.title)}>
                      Add to my workday
                    </Button>
                  </div>
                )}
              </div>
            );
          }
          if (item.kind === "job") {
            return (
              <div key={item.id} className="rounded-xl bg-dpcp-wash px-3 py-2 text-sm text-dpcp-navy">
                <p className="text-[11px] font-medium tracking-wide uppercase">
                  {item.status === "working" ? "Working in background" : item.status === "ready" ? "Ready" : "Didn't finish"}
                </p>
                <p className="mt-1">{item.title}</p>
                <p className="mt-1 text-xs">Sent to your AI at {item.started} · will appear in Today when ready</p>
                {!immersive && <div className="mt-2 flex gap-3 text-xs">
                  {item.status === "working" && (
                    <>
                      <button type="button" className="text-dpcp-blue" onClick={() => app.deliverJob(item.title)}>
                        Add to my workday
                      </button>
                      <button type="button" onClick={() => app.cancelJob(item.id)}>
                        Cancel job
                      </button>
                    </>
                  )}
                  {item.status === "ready" && (
                    <Link href="/workday" className="text-dpcp-blue">
                      Open Today
                    </Link>
                  )}
                </div>}
                <p className="mt-1 text-[11px] text-dpcp-navy/70">Sent to your AI · will appear in Today</p>
              </div>
            );
          }
          return (
            <div key={item.id} className="rounded-xl border border-status-amber-bg bg-status-amber-bg/40 p-3 text-sm">
              <p>{item.text}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => app.showToast("Searching SOPs… nothing new yet.")}>
                  Search SOPs
                </Button>
                <Button variant="outline" onClick={() => app.deliverJob("Saved request")}>
                  Make this a task
                </Button>
                <Button variant="outline" onClick={() => app.showToast("Sent to Omar Hale.")}>
                  Send to my lead
                </Button>
              </div>
            </div>
          );
        })}

        {app.ui.pendingHint && (
          <p className="text-xs text-muted-foreground">{app.ui.pendingHint}</p>
        )}
      </div>

      <form
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or speak a request…"
            className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-dpcp-blue"
            aria-label="Type or speak a request"
          />
          <Button type="submit">Send</Button>
        </div>
        {paused && (
          <p className="mt-2 text-[11px] text-status-amber">
            AI is paused. Your message is saved. Quick lookups still work from the buttons above.
          </p>
        )}
      </form>
    </section>
  );
}
