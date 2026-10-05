"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CopilotMark } from "@/components/brand";
import { runAsk, type AskHit } from "@/lib/ask";
import { searchKnowledge } from "@/lib/round3/knowledge";
import { useApp } from "@/lib/store";

export function PageAsk() {
  const pathname = usePathname();
  const app = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  if (pathname.startsWith("/use-ai") || pathname.startsWith("/chat")) return null;

  const hits: AskHit[] = [
    ...app.myTasks.map((task) => ({ id: task.id, title: task.title, detail: task.why })),
    ...app.model.meetings.slice(0, 8).map((meeting) => ({ id: meeting.id, title: meeting.title, detail: meeting.when })),
    ...app.model.messages.slice(0, 6).map((message) => ({ id: message.id, title: message.subject, detail: message.summary })),
  ];
  const route = pathname.includes("meeting") ? "meetings" : pathname.includes("message") || pathname.includes("communication") ? "communication" : "workday";
  const asked = query.trim() ? runAsk(route, query, hits) : null;
  const knowledge = query.trim() ? searchKnowledge(query) : null;
  const where = pathname.startsWith("/owner") ? "the practice owner page" : pathname.startsWith("/tickets") ? "the ticket queues" : pathname.startsWith("/copilot") ? "a department" : "this page";

  return (
    <div className="fixed right-4 bottom-20 z-30 lg:bottom-6">
      {open && (
        <form
          className="r3-motion mb-3 w-[min(100vw-2rem,24rem)] rounded-t-3xl bg-white p-4 shadow-[0_16px_50px_rgba(18,59,120,0.16)]"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <p className="text-sm font-medium text-dpcp-navy">Ask about this page</p>
          <p className="mt-1 text-xs text-muted-foreground">You're looking at {where}.</p>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What should I do next?"
            className="mt-3 h-11 w-full rounded-2xl bg-[#f4f6f8] px-3 text-sm outline-none"
            aria-label="Ask about this page"
            autoFocus
          />
          {knowledge?.answer && (
            <div className="mt-3 text-sm leading-relaxed">
              <p className="text-[11px] text-status-blue">Drafted by AI</p>
              <p>{knowledge.answer}</p>
              {knowledge.source && <p className="mt-1 text-xs text-muted-foreground">Source: {knowledge.source.title}. Sample SOP.</p>}
            </div>
          )}
          {asked && !knowledge?.answer && <p className="mt-3 text-sm leading-relaxed text-foreground">{asked.answer}</p>}
        </form>
      )}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_8px_24px_rgba(18,59,120,0.18)]"
        aria-label="Ask about this page"
      >
        <CopilotMark className="h-7 w-7" />
      </button>
    </div>
  );
}
