"use client";

import { useState } from "react";
import { PageFrame } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/bits";
import { DEPT_META, type TicketDept, type TicketStatus } from "@/lib/round3/tickets";
import { useRound3 } from "@/lib/round3/store";

const STATUS: Record<TicketStatus, string> = {
  new: "New",
  triaged: "Triaged",
  progress: "In progress",
  waiting: "Waiting on you",
  resolved: "Ready for you",
  closed: "Closed",
};

const DEPTS = (Object.keys(DEPT_META) as TicketDept[]).filter((id) => !DEPT_META[id].restricted);

const SENT_BACK = [
  {
    id: "back-cart",
    title: "Smaller glove cart for Copper Canyon",
    from: "Jonas Keller · Supplies",
    body: "The cart you asked about is over the office limit. DPCP marked a smaller cart that stays inside the limit. Approve it, or send back what should change.",
  },
  {
    id: "back-hours",
    title: "Listing hours for the current season",
    from: "Priya Shah · Marketing",
    body: "The public listing still showed last season. The corrected hours card is ready. Nothing here is a patient list.",
  },
  {
    id: "back-chair",
    title: "Thursday tech window for Op 7",
    from: "Theo March · Equipment",
    body: "The chair that will not recline has a technician window on Thursday at 2:00 PM. Confirm the window, or ask for a different time.",
  },
  {
    id: "back-recare",
    title: "Reactivation list, counts only",
    from: "Omar Hale · Insurance",
    body: "184 people with no hygiene visit in 18 months. The list stays in the practice system. This note is the count and the ask to start the calls.",
  },
];

const APPTS = [
  {
    id: "own-review",
    when: "Thu 11:00 AM AZ",
    title: "Monthly review",
    with: "Omar Hale",
    agenda: ["September value line", "The one priority: recare", "What you are approving today"],
    pre: ["Balance note for September", "Open ticket counts"],
    prep: ["Read the recare count", "Name one thing the office will do"],
  },
  {
    id: "own-tech",
    when: "Thu 2:00 PM AZ",
    title: "Op 7 technician window",
    with: "Theo March",
    agenda: ["What failed", "Parts on hand", "When the room is back"],
    pre: ["Asset note for Op 7"],
    prep: ["Clear the room for 2:00"],
  },
  {
    id: "own-cart",
    when: "Fri 9:30 AM AZ",
    title: "Supplies cart review",
    with: "Jonas Keller",
    agenda: ["Lines over the limit", "What can wait", "What ships this week"],
    pre: ["Cart draft"],
    prep: ["Decide the glove line before the call"],
  },
];

export function OwnerTickets() {
  const r3 = useRound3();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dept, setDept] = useState<TicketDept>("equipment");
  const mine = r3.tickets.filter((ticket) => ticket.practiceId === "copper" && !DEPT_META[ticket.department].restricted);

  return (
    <PageFrame title="Tickets" lede="Ask Dental Practice Copilot for something, and see where each request stands.">
      <form
        className="mb-8 space-y-3 rounded-3xl bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim()) return;
          r3.addTicket({
            practiceId: "copper",
            requester: "Dr. Mara Ellison",
            department: dept,
            type: "Request",
            priority: "normal",
            title: title.trim(),
            body: body.trim() || title.trim(),
          });
          setTitle("");
          setBody("");
        }}
      >
        <h2 className="font-heading text-xl text-dpcp-navy">New ticket</h2>
        <label className="block text-sm">
          Department
          <select value={dept} onChange={(event) => setDept(event.target.value as TicketDept)} className="mt-1 h-11 w-full rounded-2xl bg-[#f4f6f8] px-3 text-sm">
            {DEPTS.map((id) => (
              <option key={id} value={id}>{DEPT_META[id].label}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          What you need
          <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 h-11 w-full rounded-2xl bg-[#f4f6f8] px-3 text-sm" required />
        </label>
        <label className="block text-sm">
          Detail
          <textarea value={body} onChange={(event) => setBody(event.target.value)} className="mt-1 min-h-20 w-full rounded-2xl bg-[#f4f6f8] px-3 py-2 text-sm" />
        </label>
        <Button type="submit">Submit ticket</Button>
      </form>
      <h2 className="font-heading text-xl text-dpcp-navy">Your tickets</h2>
      <div className="mt-3 space-y-2">
        {mine.map((ticket) => (
          <article key={ticket.id} className="rounded-3xl bg-white px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs text-muted-foreground">{ticket.number}</p>
              <StatusTag tone={ticket.status === "resolved" || ticket.status === "closed" ? "green" : ticket.status === "waiting" ? "amber" : "blue"}>
                {STATUS[ticket.status]}
              </StatusTag>
            </div>
            <p className="mt-1 font-medium text-dpcp-navy">{ticket.title}</p>
            <p className="text-sm text-muted-foreground">{DEPT_META[ticket.department].label} · {ticket.owner}</p>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}

export function OwnerReview() {
  const [note, setNote] = useState("");
  const [state, setState] = useState<Record<string, "approved" | "changes">>({});
  return (
    <PageFrame title="Review" lede="Work Dental Practice Copilot sent back on tickets you asked for.">
      <div className="space-y-4">
        {SENT_BACK.map((item) => (
          <article key={item.id} className="rounded-3xl bg-white px-5 py-5">
            <p className="text-xs text-muted-foreground">{item.from}</p>
            <h2 className="font-heading mt-1 text-2xl text-dpcp-navy">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed">{item.body}</p>
            {state[item.id] ? (
              <p className="mt-4 text-sm text-status-green">{state[item.id] === "approved" ? "Approved." : "Sent back with your note."}</p>
            ) : (
              <div className="mt-4 space-y-2">
                <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What should change?" className="min-h-20 w-full rounded-2xl bg-[#f4f6f8] px-3 py-2 text-sm" />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setState((current) => ({ ...current, [item.id]: "approved" }))}>Approve</Button>
                  <Button variant="outline" onClick={() => setState((current) => ({ ...current, [item.id]: "changes" }))}>Request changes</Button>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </PageFrame>
  );
}

export function OwnerAppointments() {
  const [open, setOpen] = useState<string | null>(null);
  const [phase, setPhase] = useState<"before" | "during" | "after">("before");
  const item = APPTS.find((row) => row.id === open);

  if (item) {
    return (
      <PageFrame title="Meetings">
        <button type="button" className="text-sm text-dpcp-blue" onClick={() => setOpen(null)}>
          Back to Meetings
        </button>
        <p className="mt-4 text-sm text-muted-foreground">{item.when} · with {item.with}</p>
        <h1 className="font-heading mt-1 text-3xl text-dpcp-navy">{item.title}</h1>
        <div className="mt-4 flex gap-2">
          {(["before", "during", "after"] as const).map((key) => (
            <button key={key} type="button" className={phase === key ? "rounded-full bg-dpcp-navy px-3 py-2 text-sm text-white" : "rounded-full bg-white px-3 py-2 text-sm"} onClick={() => setPhase(key)}>
              {key === "before" ? "Before" : key === "during" ? "During" : "After"}
            </button>
          ))}
        </div>
        {phase === "before" && (
          <div className="mt-6 space-y-4">
            <section>
              <h2 className="font-heading text-xl text-dpcp-navy">Agenda</h2>
              <ul className="mt-2 list-disc pl-5 text-sm">{item.agenda.map((line) => <li key={line}>{line}</li>)}</ul>
            </section>
            <section>
              <h2 className="font-heading text-xl text-dpcp-navy">Pre-reads</h2>
              <ul className="mt-2 list-disc pl-5 text-sm">{item.pre.map((line) => <li key={line}>{line}</li>)}</ul>
            </section>
            <section>
              <h2 className="font-heading text-xl text-dpcp-navy">Prep</h2>
              <ul className="mt-2 list-disc pl-5 text-sm">{item.prep.map((line) => <li key={line}>{line}</li>)}</ul>
            </section>
          </div>
        )}
        {phase === "during" && (
          <section className="mt-6 rounded-3xl bg-dpcp-navy-deep px-5 py-6 text-white">
            <p className="text-xs tracking-wide text-white/70 uppercase">In the meeting</p>
            <p className="font-heading mt-2 text-2xl">With {item.with}</p>
            <p className="mt-2 text-sm text-white/80">Decisions and action items land on this appointment when you leave.</p>
            <Button className="mt-4" onClick={() => setPhase("after")}>Leave and write the summary</Button>
          </section>
        )}
        {phase === "after" && (
          <div className="mt-6 space-y-3 text-sm">
            <p className="font-medium text-dpcp-navy">Summary</p>
            <p>You met with {item.with}. The agenda was covered. One follow-up sits with the office.</p>
            <p className="font-medium text-dpcp-navy">Decision</p>
            <p>The office keeps the Thursday window unless you send a change today.</p>
            <p className="font-medium text-dpcp-navy">Action</p>
            <p>{item.with} · due Friday · confirm the note in Review.</p>
            <p className="text-dpcp-blue">Recording and transcript · sample link</p>
          </div>
        )}
      </PageFrame>
    );
  }

  return (
    <PageFrame title="Meetings" lede="Appointments with the Dental Practice Copilot team.">
      <div className="space-y-2">
        {APPTS.map((row) => (
          <article key={row.id} className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-4">
            <button type="button" className="min-w-0 flex-1 text-left" onClick={() => { setPhase("before"); setOpen(row.id); }}>
              <p className="text-sm text-muted-foreground">{row.when}</p>
              <p className="font-heading text-lg text-dpcp-navy">{row.title}</p>
              <p className="text-sm text-muted-foreground">with {row.with}</p>
            </button>
            <button type="button" className="inline-flex h-11 shrink-0 items-center rounded-lg bg-dpcp-blue px-3 text-sm font-medium text-white" onClick={() => { setPhase("during"); setOpen(row.id); }}>
              Join
            </button>
          </article>
        ))}
      </div>
    </PageFrame>
  );
}
