"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AskInMessage } from "@/components/round4/experience";
import { useRound4 } from "@/lib/round4/store";
import { useApp } from "@/lib/store";
import type { InboxItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DetailFrame({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function close() {
    setShown(false);
    window.setTimeout(onClose, 240);
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0 hidden bg-black/30 lg:block" aria-label="Close" onClick={close} />
      <div
        className={cn(
          "absolute inset-0 flex flex-col bg-card shadow-2xl transition-transform duration-300 ease-out lg:inset-y-0 lg:left-auto lg:w-[440px]",
          shown ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <button type="button" className="text-sm text-dpcp-blue" onClick={close}>
            Back
          </button>
          <button type="button" className="text-sm text-dpcp-blue" onClick={close}>
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

function rewriteReply(current: string, instruction: string) {
  const change = instruction.trim().replace(/[.?!]$/, "");
  const lead = change.charAt(0).toUpperCase() + change.slice(1);
  const base = current.trim();
  if (!base) return `${lead}.`;
  const first = base.split(/(?<=[.?!])\s+/)[0] ?? base;
  return `${first} ${lead}.`;
}

export function MessageDetail({ message, onClose }: { message: InboxItem; onClose: () => void }) {
  const app = useApp();
  const [reply, setReply] = useState(message.draft ?? "");
  const [ask, setAsk] = useState("");
  const [sent, setSent] = useState(false);
  const involved = [message.from, message.org, app.viewer.name].filter(Boolean);
  return (
    <DetailFrame title={message.subject} onClose={onClose}>
      <p className="text-xs text-muted-foreground">{message.source} · {message.time}</p>
      <h2 className="font-heading mt-2 text-2xl text-dpcp-navy">{message.subject}</h2>
      <p className="mt-3 text-sm"><span className="font-medium text-dpcp-navy">AI summary. </span>{message.summary}</p>
      <p className="mt-3 text-sm"><span className="font-medium text-dpcp-navy">Who's involved. </span>{involved.join(" · ")}</p>
      <div className="mt-3">
        <p className="text-sm font-medium text-dpcp-navy">Thread</p>
        <ul className="mt-1 space-y-2 text-sm">
          <li className="rounded-2xl bg-muted px-3 py-2">{message.from}: {message.body}</li>
          <li className="rounded-2xl bg-muted px-3 py-2">AI: {message.summary}</li>
        </ul>
      </div>
      <p className="mt-3 text-sm"><span className="font-medium text-dpcp-navy">Status. </span>{message.triage}{message.slaLabel ? ` · ${message.slaLabel}` : ""}</p>
      <p className="mt-3 text-sm">
        <span className="font-medium text-dpcp-navy">Related. </span>
        {message.taskId ? <Link href={`/tasks/${message.taskId}`} className="text-dpcp-blue">Open the linked task</Link> : "No linked task yet."}
      </p>
      <p className="mt-3 text-sm"><span className="font-medium text-dpcp-navy">Suggested next action. </span>{message.draft ? "Read the draft, then send it or change the words." : "Acknowledge it, or write a short reply."}</p>
      <AskInMessage subject={`${message.subject} ${message.summary}`} />
      {sent ? (
        <p className="mt-4 text-sm text-status-green">Sent.</p>
      ) : (
        <>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!ask.trim()) return;
              setReply(rewriteReply(reply, ask));
              setAsk("");
              app.showToast("Rewritten. Read it, then send or change the words yourself.");
            }}
          >
            <input value={ask} onChange={(event) => setAsk(event.target.value)} placeholder="Edit with AI" aria-label="Edit with AI" className="h-11 flex-1 rounded-2xl bg-muted px-3 text-sm outline-none" />
            <Button type="submit" variant="outline">Edit with AI</Button>
          </form>
          {message.tab !== "held" && (
            <label className="mt-3 block text-sm text-muted-foreground">
              Reply
              <textarea value={reply} onChange={(event) => setReply(event.target.value)} className="mt-1 min-h-24 w-full rounded-2xl bg-muted px-3 py-2 text-sm outline-none" />
            </label>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {message.tab !== "held" && (
              <Button
                disabled={!reply.trim()}
                onClick={() => {
                  setSent(true);
                  app.showToast("Sent.");
                }}
              >
                Send
              </Button>
            )}
            <Button variant="outline" onClick={() => app.ackMessage(message.id)}>Acknowledge</Button>
          </div>
        </>
      )}
    </DetailFrame>
  );
}

export function MeetingAi({ meetingId, title, agenda }: { meetingId: string; title: string; agenda: string[] }) {
  const r4 = useRound4();
  const [phone, setPhone] = useState(false);
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState(r4.notes[meetingId] ?? "");
  const [lines, setLines] = useState<{ role: "you" | "ai"; text: string }[]>([]);

  function persist(nextNotes: string, nextLines: { role: "you" | "ai"; text: string }[]) {
    const chat = nextLines.map((line) => `${line.role === "you" ? "You" : "AI"}: ${line.text}`).join("\n");
    r4.saveNote(meetingId, `Typed notes:\n${nextNotes}\n\n${title}\n${chat}`.trim());
  }

  function answer(question: string) {
    const q = question.trim();
    if (!q) return;
    let text = `Noted on ${title}. Saved to this meeting.`;
    if (/action item/i.test(q)) text = `Added an action item on ${title}: ${q.replace(/.*action item for\s*/i, "")}`;
    else if (/summar/i.test(q)) text = `So far on ${title}: ${agenda.length ? agenda.join("; ") : "No agenda lines yet."}`;
    else if (/follow-?up/i.test(q)) text = `Draft follow-up for ${title}: Thanks for the time. We will pick up the open items next.`;
    const next = [...lines, { role: "you" as const, text: q }, { role: "ai" as const, text }];
    setLines(next);
    setDraft("");
    persist(notes, next);
  }

  const body = (
    <div className="flex h-full min-h-[320px] flex-col rounded-3xl bg-white p-4 shadow-sm lg:max-h-[calc(100dvh-8rem)] lg:sticky lg:top-4">
      <p className="text-xs text-muted-foreground">Meeting chat</p>
      <h2 className="font-heading text-lg text-dpcp-navy">{title}</h2>
      <p className="mt-1 text-xs text-muted-foreground">This chat knows this meeting. Notes stay on the meeting record.</p>
      <label className="mt-3 text-xs text-muted-foreground">
        Typed notes
        <textarea
          value={notes}
          aria-label="Typed notes"
          onChange={(event) => {
            setNotes(event.target.value);
            persist(event.target.value, lines);
          }}
          className="mt-1 min-h-16 w-full rounded-2xl bg-muted px-3 py-2 text-sm outline-none"
        />
      </label>
      <p className="mt-1 text-xs text-muted-foreground">Saved on this meeting.{notes ? ` Typed notes: ${notes}` : ""}</p>
      <div className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto">
        {lines.length === 0 && <p className="text-sm text-muted-foreground">Ask to add an action item, summarize so far, or draft the follow-up.</p>}
        {lines.map((line, index) => (
          <p key={`${line.role}-${index}`} className={cn("rounded-2xl px-3 py-2 text-sm", line.role === "you" ? "bg-dpcp-navy text-white" : "bg-muted")}>
            {line.text}
          </p>
        ))}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          answer(draft);
        }}
      >
        <input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Message this meeting" placeholder="Message this meeting" className="h-11 flex-1 rounded-2xl bg-muted px-3 text-sm outline-none" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">{body}</div>
      <div className="mt-4 lg:hidden">
        <Button onClick={() => setPhone(true)}>Meeting chat</Button>
        {phone && (
          <div className="fixed inset-0 z-50 flex items-end bg-black/30">
            <div className="max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl bg-card p-3">
              <div className="mb-2 flex justify-end">
                <button type="button" className="text-sm text-dpcp-blue" onClick={() => setPhone(false)}>Close</button>
              </div>
              {body}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const SUGGESTIONS = ["What's overdue for me?", "Summarize my open commitments", "Draft a follow-up for the Mesa Verde sync"];

interface ChatLine {
  role: "you" | "ai";
  text: string;
}

interface Thread {
  id: string;
  title: string;
  lines: ChatLine[];
}

function mockReply(prompt: string) {
  if (/overdue/i.test(prompt)) return "You have 12 overdue commitments, 5 with no proof. The next one is the Mesa Verde hood date.";
  if (/summar/i.test(prompt)) return "Open work: the launch lanes, the quote discrepancies, and the portal that is blocked from offshore.";
  if (/follow-up|mesa/i.test(prompt)) return "Draft: Mesa Verde is in build. The compressor window is the critical path. A person still sends this.";
  return "I can draft, summarize, or look up a step. Nothing goes out until you approve it.";
}

export function AiChat() {
  const [threads, setThreads] = useState<Thread[]>([{ id: "t1", title: "New chat", lines: [] }]);
  const [active, setActive] = useState("t1");
  const [text, setText] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [streaming, setStreaming] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const stopRef = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const thread = threads.find((item) => item.id === active) ?? threads[0];

  function stop() {
    if (stopRef.current) window.clearInterval(stopRef.current);
    stopRef.current = null;
    if (streaming) {
      setThreads((rows) => rows.map((row) => (row.id === active ? { ...row, lines: [...row.lines, { role: "ai", text: streaming }] } : row)));
      setStreaming("");
    }
  }

  function stream(full: string, threadId: string) {
    if (stopRef.current) window.clearInterval(stopRef.current);
    let index = 0;
    setStreaming("");
    stopRef.current = window.setInterval(() => {
      index += 4;
      const slice = full.slice(0, index);
      if (index >= full.length) {
        if (stopRef.current) window.clearInterval(stopRef.current);
        stopRef.current = null;
        setStreaming("");
        setThreads((rows) => rows.map((row) => (row.id === threadId ? { ...row, lines: [...row.lines, { role: "ai", text: full }] } : row)));
      } else {
        setStreaming(slice);
      }
    }, 28);
  }

  function send(value?: string) {
    const prompt = (value ?? text).trim();
    if (!prompt || streaming) return;
    const attachment = files.length ? ` Attached: ${files.join(", ")}.` : "";
    const full = mockReply(prompt) + (files.length ? " I can see the file name only. Nothing was uploaded." : "");
    setThreads((rows) =>
      rows.map((row) =>
        row.id === active
          ? { ...row, title: row.lines.length === 0 ? prompt.slice(0, 42) : row.title, lines: [...row.lines, { role: "you", text: prompt + attachment }] }
          : row
      )
    );
    setText("");
    setFiles([]);
    stream(full, active);
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((current) => [...current, ...Array.from(list).map((file) => file.name)]);
  }

  function regenerate() {
    const last = [...thread.lines].reverse().find((line) => line.role === "you");
    if (!last || streaming) return;
    setThreads((rows) =>
      rows.map((row) => {
        if (row.id !== active) return row;
        const lines = [...row.lines];
        if (lines[lines.length - 1]?.role === "ai") lines.pop();
        return { ...row, lines };
      })
    );
    stream(mockReply(last.text) + " Regenerated.", active);
  }

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] min-h-0">
      <aside className={cn("w-56 shrink-0 border-r border-border bg-white p-3", historyOpen ? "absolute inset-y-0 z-20 lg:static" : "hidden lg:block")}>
        <button
          type="button"
          className="h-10 w-full rounded-full bg-dpcp-navy text-sm text-white"
          onClick={() => {
            const id = `t-${Date.now()}`;
            setThreads((rows) => [{ id, title: "New chat", lines: [] }, ...rows]);
            setActive(id);
            setHistoryOpen(false);
          }}
        >
          New chat
        </button>
        <ul className="mt-3 space-y-1">
          {threads.map((item) => (
            <li key={item.id}>
              <button type="button" className={cn("w-full truncate rounded-xl px-2 py-2 text-left text-sm", item.id === active ? "bg-[#E7EEF6] text-dpcp-navy" : "text-muted-foreground")} onClick={() => { setActive(item.id); setHistoryOpen(false); }}>
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section
        className="flex min-w-0 flex-1 flex-col"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2 lg:hidden">
          <button type="button" className="text-sm text-dpcp-blue" onClick={() => setHistoryOpen(true)}>Chats</button>
          <button type="button" className="text-sm text-dpcp-blue" onClick={() => {
            const id = `t-${Date.now()}`;
            setThreads((rows) => [{ id, title: "New chat", lines: [] }, ...rows]);
            setActive(id);
          }}>New chat</button>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {thread.lines.length === 0 && !streaming && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try one of these.</p>
              {SUGGESTIONS.map((prompt) => (
                <button key={prompt} type="button" className="block w-full rounded-xl border border-border px-3 py-2 text-left text-sm" onClick={() => send(prompt)}>
                  {prompt}
                </button>
              ))}
            </div>
          )}
          {thread.lines.map((line, index) => (
            <div key={`${line.role}-${index}`} className={cn("flex", line.role === "you" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[90%] rounded-2xl px-3 py-2 text-sm", line.role === "you" ? "bg-dpcp-navy-deep text-white" : "bg-muted")}>
                {line.text}
                {line.role === "ai" && (
                  <span className="mt-2 flex gap-3 text-xs">
                    <button type="button" className="text-dpcp-blue" onClick={() => navigator.clipboard?.writeText(line.text)}>Copy</button>
                    <button type="button" className="text-dpcp-blue" onClick={regenerate}>Regenerate</button>
                  </span>
                )}
              </div>
            </div>
          ))}
          {streaming && <p className="max-w-[90%] rounded-2xl bg-muted px-3 py-2 text-sm">{streaming}</p>}
        </div>
        <form
          className="border-t border-border p-3"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          {files.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {files.map((name) => (
                <span key={name} className="rounded-full bg-[#E7EEF6] px-3 py-1 text-xs text-dpcp-navy">{name}</span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button type="button" aria-label="Attach a file" className="flex h-11 w-11 items-center justify-center rounded-xl border border-border" onClick={() => fileRef.current?.click()}>
              <Paperclip />
            </button>
            <input ref={fileRef} type="file" className="hidden" onChange={(event) => addFiles(event.target.files)} />
            <input value={text} onChange={(event) => setText(event.target.value)} aria-label="Message" placeholder="Message" className="h-11 flex-1 rounded-xl border border-border px-3 text-sm outline-none" />
            {streaming ? (
              <Button type="button" variant="outline" onClick={stop}>Stop</Button>
            ) : (
              <Button type="submit">Send</Button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

function Paperclip() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M8 12.5 14.5 6a3 3 0 0 1 4.2 4.2l-8.2 8.2a4.5 4.5 0 0 1-6.4-6.4l7.4-7.4" strokeLinecap="round" />
    </svg>
  );
}
