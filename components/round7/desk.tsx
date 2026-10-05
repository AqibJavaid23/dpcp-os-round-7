"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FLOOR, type FloorRole } from "@/lib/round2/data";
import { DEPT_META, type TicketDept } from "@/lib/round3/tickets";
import { useRound3 } from "@/lib/round3/store";

const PEOPLE = FLOOR.filter((person) => person.practiceId === "copper");

const LISTS: Record<FloorRole, { id: string; when: string; name: string; items: string[] }[]> = {
  "Front office": [
    { id: "fo-open", when: "Open", name: "Open the day", items: ["Lights, music, and the scent on", "Phones off night mode", "Huddle card on the counter", "Confirmation counts printed"] },
    { id: "fo-mid", when: "Midday", name: "Keep the book moving", items: ["Afternoon unconfirmed visits called", "Lab cases logged as a count", "New questions sent to DPCP"] },
    { id: "fo-close", when: "Close", name: "Close the day", items: ["Deposit bag sealed", "Note for tomorrow's opener", "Alarms set"] },
  ],
  Hygiene: [
    { id: "hy-open", when: "Open", name: "Rooms ready", items: ["Chairs and trays set", "Huddle card read", "Supplies that are short named"] },
    { id: "hy-mid", when: "Midday", name: "At the chair", items: ["Next hygiene visit booked before checkout", "Sterile packs still dated"] },
    { id: "hy-close", when: "Close", name: "Hand off", items: ["Instruments to sterile", "Open questions on the huddle card"] },
  ],
  Assistants: [
    { id: "as-open", when: "Open", name: "Sterile packs staged", items: ["Pouches dated", "Ops have the morning setup", "Emergency kit in place"] },
    { id: "as-mid", when: "Midday", name: "Sterile cycle", items: ["Ultrasonic ran", "Autoclave cycle logged", "Tuesday spore test, if today is Tuesday"] },
    { id: "as-close", when: "Close", name: "Break down", items: ["Ops broken down", "Sharps sealed", "Tomorrow's packs staged"] },
  ],
  Doctors: [
    { id: "dr-open", when: "Open", name: "The day in counts", items: ["Who is in today", "Tight spots on the book", "Approvals waiting"] },
    { id: "dr-mid", when: "Midday", name: "What needs you", items: ["Supply swap waiting on you", "Lab cases due back"] },
    { id: "dr-close", when: "Close", name: "Leave a note", items: ["Note for the office manager", "No chart detail in the note"] },
  ],
  "Office manager": [
    { id: "om-open", when: "Open", name: "Open the office", items: ["Who is in", "Lists that are still red", "Supplies that are short"] },
    { id: "om-mid", when: "Midday", name: "Tickets and the book", items: ["Open tickets reviewed", "Huddle follow-through"] },
    { id: "om-close", when: "Close", name: "Close the office", items: ["Deposit bag sealed", "Tomorrow's opener has a note", "Alarms set"] },
  ],
};

const DEPTS = (Object.keys(DEPT_META) as TicketDept[]).filter((id) => !DEPT_META[id].restricted);

export function PracticeDesk() {
  const r3 = useRound3();
  const [personId, setPersonId] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<string, boolean>>({ "fo-open-0": true, "hy-open-0": true, "as-open-0": true });
  const [mode, setMode] = useState<"list" | "issue" | "support" | "feedback" | "sent">("list");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [dept, setDept] = useState<TicketDept>("equipment");
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const person = PEOPLE.find((row) => row.id === personId) ?? null;
  const receipt = r3.tickets.find((row) => row.id === receiptId)?.number ?? "Your request";

  function submit(kind: string) {
    if (!person || !title.trim()) return;
    const id = r3.addTicket({
      practiceId: "copper",
      requester: person.name,
      department: kind === "feedback" ? "feedback" : dept,
      type: kind === "support" ? "Support" : kind === "feedback" ? "Idea" : "Request",
      priority: kind === "issue" ? "urgent" : "normal",
      title: title.trim(),
      body: body.trim() || title.trim(),
    });
    setReceiptId(id);
    setTitle("");
    setBody("");
    setMode("sent");
  }

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-wide text-muted-foreground uppercase">Copper Canyon</p>
          <h1 className="font-heading text-2xl text-dpcp-navy">Practice desk</h1>
        </div>
        <Link href="/switch" className="text-sm text-dpcp-blue">
          Switch view
        </Link>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Shared computer. Tap your name. No login.</p>

      {!person && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {PEOPLE.map((row) => (
            <button key={row.id} type="button" className="min-h-24 rounded-3xl bg-white px-4 py-4 text-left shadow-sm" onClick={() => setPersonId(row.id)}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-dpcp-navy text-sm text-white">{row.initials}</span>
              <span className="mt-3 block font-heading text-lg text-dpcp-navy">{row.first}</span>
              <span className="block text-sm text-muted-foreground">{row.role}</span>
            </button>
          ))}
        </div>
      )}

      {person && mode === "sent" && (
        <section className="mt-8 rounded-3xl bg-status-green-bg px-5 py-8 text-center">
          <p className="font-heading text-2xl text-status-green">Sent</p>
          <p className="mt-2 text-sm text-dpcp-navy">{receipt} is on the office list.</p>
          <Button className="mt-6" onClick={() => setMode("list")}>
            Back to today
          </Button>
        </section>
      )}

      {person && mode === "list" && (
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading text-xl text-dpcp-navy">{person.name}</p>
              <p className="text-sm text-muted-foreground">{person.role} · Tue Oct 20 · 10:42 AM</p>
            </div>
            <button type="button" className="text-sm text-dpcp-blue" onClick={() => setPersonId(null)}>
              Not you
            </button>
          </div>
          <div className="mt-5 space-y-4">
            {LISTS[person.role].map((list) => {
              const done = list.items.filter((_, index) => checks[`${list.id}-${index}`]).length;
              const now = list.when === "Midday";
              return (
                <article key={list.id} className={now ? "rounded-3xl bg-white px-4 py-4 shadow-sm ring-2 ring-dpcp-blue" : "rounded-3xl bg-white px-4 py-4 shadow-sm"}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-heading text-lg text-dpcp-navy">{list.name}</p>
                    <p className="text-xs text-muted-foreground">{list.when}{now ? " · now" : ""} · {done}/{list.items.length}</p>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {list.items.map((item, index) => {
                      const key = `${list.id}-${index}`;
                      const on = Boolean(checks[key]);
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            className="flex min-h-14 w-full items-center gap-3 rounded-2xl bg-[#f4f6f8] px-3 text-left text-base"
                            onClick={() => setChecks((current) => ({ ...current, [key]: !current[key] }))}
                          >
                            <span className={on ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-status-green text-white" : "h-7 w-7 shrink-0 rounded-full border border-border bg-white"}>{on ? "✓" : ""}</span>
                            <span className={on ? "text-muted-foreground line-through" : "text-dpcp-navy"}>{item}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              );
            })}
          </div>
          <div className="mt-6 grid gap-2">
            <Button className="h-14 text-base" onClick={() => setMode("issue")}>Report an issue</Button>
            <Button className="h-14 text-base" variant="outline" onClick={() => setMode("support")}>Request support</Button>
            <Button className="h-14 text-base" variant="outline" onClick={() => setMode("feedback")}>Quick feedback</Button>
          </div>
        </section>
      )}

      {person && (mode === "issue" || mode === "support" || mode === "feedback") && (
        <form
          className="mt-6 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit(mode);
          }}
        >
          <button type="button" className="text-sm text-dpcp-blue" onClick={() => setMode("list")}>
            Back
          </button>
          <h2 className="font-heading text-2xl text-dpcp-navy">
            {mode === "issue" ? "Report an issue" : mode === "support" ? "Request support" : "Quick feedback"}
          </h2>
          <p className="text-sm text-muted-foreground">Counts and what is wrong. No chart, no member ID, no date of birth.</p>
          {mode !== "feedback" && (
            <label className="block text-sm">
              Department
              <select value={dept} onChange={(event) => setDept(event.target.value as TicketDept)} className="mt-1 h-14 w-full rounded-2xl bg-white px-3 text-base">
                {DEPTS.map((id) => (
                  <option key={id} value={id}>{DEPT_META[id].label}</option>
                ))}
              </select>
            </label>
          )}
          <label className="block text-sm">
            What is it
            <input value={title} onChange={(event) => setTitle(event.target.value)} className="mt-1 h-14 w-full rounded-2xl bg-white px-3 text-base" required />
          </label>
          <label className="block text-sm">
            Detail
            <textarea value={body} onChange={(event) => setBody(event.target.value)} className="mt-1 min-h-28 w-full rounded-2xl bg-white px-3 py-3 text-base" />
          </label>
          <Button type="submit" className="h-14 w-full text-base">Submit</Button>
        </form>
      )}
    </main>
  );
}
