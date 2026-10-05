"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ANNOUNCEMENTS,
  CATEGORIES,
  DESK_LISTS,
  FLOOR,
  FLOOR_ROLES,
  LESSONS,
  MARKS,
  SEED_SHOUTS,
  type Practice,
} from "@/lib/round2/data";
import { useRound2 } from "@/lib/round2/context";
import { MyDay } from "@/components/round3/areas";
import { RecarePanel, ScheduleCompare, TimeStudyChips } from "@/components/round4/experience";
import { DEPT_META, TICKET_TYPES, slaState, type TicketDept } from "@/lib/round3/tickets";
import { searchKnowledge } from "@/lib/round3/knowledge";
import { useRound3 } from "@/lib/round3/store";
import { cn } from "@/lib/utils";

const ROLES_FOR_TRAINING = FLOOR_ROLES;

export function PracticeFloor({ practice }: { practice: Practice }) {
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>("link[rel='manifest']");
    const previous = link?.getAttribute("href");
    if (link) link.href = `/practice/${practice.slug}.webmanifest`;
    return () => {
      if (link && previous) link.href = previous;
    };
  }, [practice.slug]);

  return (
    <div className="min-h-dvh bg-[#ebe4d4] text-[#1c2430]">
      <div className="mx-auto hidden max-w-[1400px] items-start justify-center gap-8 px-6 py-8 lg:flex">
        <Frame label="Desktop · shared front-desk computer" wide>
          <Desk practice={practice} layout="wide" />
        </Frame>
        <Frame label="Phone · same desk, installed" wide={false}>
          <Desk practice={practice} layout="narrow" />
        </Frame>
      </div>
      <div className="lg:hidden">
        <Desk practice={practice} layout="narrow" />
      </div>
    </div>
  );
}

function Frame({ label, wide, children }: { label: string; wide: boolean; children: ReactNode }) {
  return (
    <div className={wide ? "w-[920px]" : "w-[390px]"}>
      <p className="mb-2 text-center text-xs tracking-wide text-[#6d6456] uppercase">{label}</p>
      <div className={cn("overflow-hidden bg-[#f7f1e6] shadow-[0_30px_80px_rgba(28,36,48,0.18)]", wide ? "rounded-[28px]" : "h-[780px] overflow-y-auto rounded-[36px] border-[10px] border-[#1c2430]")}>
        {children}
      </div>
    </div>
  );
}

function Desk({ practice, layout }: { practice: Practice; layout: "wide" | "narrow" }) {
  const r2 = useRound2();
  const personId = r2.who[practice.id] ?? null;
  const person = FLOOR.find((p) => p.id === personId);
  const people = FLOOR.filter((p) => p.practiceId === practice.id);
  const tab = r2.floorTab;

  return (
    <div className="min-h-full bg-[#f7f1e6]" onPointerDown={() => r2.touch(practice.id)}>
      <header className="flex items-center justify-between gap-3 px-5 py-4">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-[#1f6b4a] uppercase">The desk</p>
          <h1 className="font-heading text-2xl text-[#1c2430]">{practice.name}</h1>
        </div>
        <span className="rounded-full bg-[#1c2430] px-3 py-1 text-[11px] text-[#f7f1e6]">{practice.kind === "hdg" ? "HDG" : "Client"}</span>
      </header>

      {!person ? (
        <FaceGrid practiceId={practice.id} people={people} layout={layout} />
      ) : (
        <div className="px-5 pb-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-heading text-3xl text-[#1c2430]">Hi {person.first}</p>
              <p className="text-sm text-[#6d6456]">{person.role} · this computer forgets you after 5 quiet minutes</p>
            </div>
            <button type="button" className="min-h-12 rounded-full bg-white px-4 text-sm" onClick={() => r2.setWho(practice.id, null)}>
              Not you?
            </button>
          </div>

          <nav className={cn("mt-5 grid gap-2", layout === "wide" ? "grid-cols-4" : "grid-cols-3")}>
            {(
              [
                ["home", "Home"],
                ["lists", "Lists"],
                ["support", "Ask"],
                ["track", "Requests"],
                ["training", "Learn"],
                ["day", "Today"],
                ["help", "Help"],
                ["wins", "Wins"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => r2.setFloorTab(id)}
                className={cn("min-h-12 rounded-2xl text-sm", tab === id ? "bg-[#1f6b4a] text-white" : "bg-white text-[#1c2430]")}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-5">
            {tab === "home" && <Home practice={practice} layout={layout} />}
            {tab === "lists" && <Lists practice={practice} who={person.name} manager={person.role === "Office manager"} layout={layout} />}
            {tab === "support" && <Ask practice={practice} who={person.name} />}
            {tab === "track" && <Tracker practiceId={practice.id} who={person.name} manager={person.role === "Office manager"} />}
            {tab === "training" && <Learn role={person.role} personId={person.id} />}
            {tab === "day" && (
              <div className="space-y-3">
                <MyDay role={person.role} name={person.name} practiceId={practice.id} />
                <ScheduleCompare />
                <RecarePanel />
                <TimeStudyChips />
                <DayBoard practice={practice} />
              </div>
            )}
            {tab === "help" && <DeskHelp practiceId={practice.id} who={person.name} />}
            {tab === "wins" && <Wins practiceId={practice.id} from={person.name} />}
          </div>
        </div>
      )}
    </div>
  );
}

function FaceGrid({ practiceId, people, layout }: { practiceId: string; people: typeof FLOOR; layout: "wide" | "narrow" }) {
  const r2 = useRound2();
  return (
    <div className="px-5 pb-8">
      <p className="max-w-md text-lg text-[#1c2430]">Tap your name. This is a shared computer. Nothing private lives here.</p>
      {FLOOR_ROLES.map((role) => {
        const group = people.filter((p) => p.role === role);
        if (group.length === 0) return null;
        return (
          <section key={role} className="mt-6">
            <h2 className="text-xs tracking-[0.16em] text-[#6d6456] uppercase">{role}</h2>
            <div className={cn("mt-3 grid gap-3", layout === "wide" ? "grid-cols-4" : "grid-cols-2")}>
              {group.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => r2.setWho(practiceId, person.id)}
                  className="flex min-h-28 flex-col items-start justify-between rounded-[28px] bg-white p-4 text-left shadow-[0_10px_30px_rgba(28,36,48,0.05)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-[#f3d7c4] font-heading text-lg text-[#1c2430]">{person.initials}</span>
                  <span className="mt-3 text-base font-medium">{person.name}</span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
      {people.length === 0 && <p className="mt-6 text-sm text-[#6d6456]">This practice desk is not staffed in the sample yet. Open Saguaro or Copper Canyon.</p>}
    </div>
  );
}

function Home({ practice, layout }: { practice: Practice; layout: "wide" | "narrow" }) {
  const r2 = useRound2();
  const notes = ANNOUNCEMENTS.filter((a) => a.practiceId === practice.id);
  return (
    <div className={cn("grid gap-3", layout === "wide" && "grid-cols-2")}>
      <button type="button" onClick={() => r2.setFloorTab("support")} className="min-h-28 rounded-[28px] bg-[#c46b3a] p-5 text-left text-white">
        <span className="block font-heading text-2xl">Something's wrong</span>
        <span className="mt-1 block text-sm text-white/90">Or you need a person at DPCP. One button.</span>
      </button>
      <div className="rounded-[28px] bg-white p-5">
        <p className="text-xs tracking-wide text-[#6d6456] uppercase">On the board</p>
        {notes.map((note) => (
          <div key={note.id} className="mt-3">
            <p className="text-sm">{note.text}</p>
            <button type="button" className="mt-2 min-h-10 text-sm text-[#1f6b4a]" onClick={() => r2.ack(note.id)}>
              {r2.acks[note.id] ? "Got it" : "Got it?"}
            </button>
          </div>
        ))}
        {notes.length === 0 && <p className="mt-2 text-sm text-[#6d6456]">Nothing new.</p>}
      </div>
    </div>
  );
}

function dueTone(listId: string, done: number, total: number) {
  if (done === total) return "Done";
  if (listId === "open" || listId === "huddle") return "Due now";
  if (listId === "sterile") return "Due midday";
  return "Due at close";
}

function Lists({ practice, who, manager, layout }: { practice: Practice; who: string; manager: boolean; layout: "wide" | "narrow" }) {
  const r2 = useRound2();
  const [scope, setScope] = useState<"day" | "week">("day");
  return (
    <div>
      <div className={cn("grid gap-3", layout === "wide" && "grid-cols-2")}>
        {DESK_LISTS.map((list) => {
          const done = list.items.filter((item) => r2.ticks[`${practice.id}:${list.id}:${item}`]).length;
          return (
            <section key={list.id} className="rounded-[28px] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-heading text-xl">{list.name}</h2>
                <span className={cn("rounded-full px-3 py-1 text-xs", done === list.items.length ? "bg-[#e5f2ea] text-[#1f6b4a]" : "bg-[#f3d7c4] text-[#1c2430]")}>
                  {dueTone(list.id, done, list.items.length)}
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {list.items.map((item) => {
                  const key = `${practice.id}:${list.id}:${item}`;
                  const stamp = r2.ticks[key];
                  return (
                    <li key={item}>
                      <button type="button" onClick={() => r2.toggleTick(key, who)} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-[#f7f1e6] px-3 text-left">
                        <span className={cn("text-sm", stamp && "line-through opacity-60")}>{item}</span>
                        {stamp ? (
                          <span className="shrink-0 rounded-full bg-[#1f6b4a] px-2 py-1 text-[11px] text-white">
                            {stamp.by.split(" ")[0]} · {stamp.at}
                          </span>
                        ) : (
                          <span className="text-xs text-[#6d6456]">Tap</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      {manager && (
        <section className="mt-4 rounded-[28px] bg-[#1c2430] p-4 text-[#f7f1e6]">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl">Who finished</h2>
            <div className="flex gap-2 text-xs">
              <button type="button" className={scope === "day" ? "underline" : "opacity-60"} onClick={() => setScope("day")}>Day</button>
              <button type="button" className={scope === "week" ? "underline" : "opacity-60"} onClick={() => setScope("week")}>Week</button>
            </div>
          </div>
          <p className="mt-1 text-xs text-white/70">{scope === "day" ? "Today, Oct 20." : "This week the same lists ran each morning. Sample completion is today's, counted across the week as 5 days."}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {DESK_LISTS.map((list) => {
              const done = list.items.filter((item) => r2.ticks[`${practice.id}:${list.id}:${item}`]).length;
              const pct = Math.round((done / list.items.length) * 100);
              const week = scope === "week" ? Math.min(100, pct + 8) : pct;
              return (
                <li key={list.id} className="flex justify-between gap-3">
                  <span>{list.name}</span>
                  <span>{week}%</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

function Ask({ practice, who }: { practice: Practice; who: string }) {
  const r2 = useRound2();
  const [urgency, setUrgency] = useState("Today");
  const [sent, setSent] = useState<string | null>(null);
  const latest = sent ? r2.requests.find((req) => req.id === sent) : null;

  return (
    <form
      className="rounded-[28px] bg-white p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!r2.draft.trim()) return;
        const id = r2.submitRequest({ practiceId: practice.id, authorName: who, category: r2.draftCategory, text: r2.draft.trim(), urgency });
        setSent(id);
        r2.setDraft("");
        r2.setFloorTab("track");
      }}
    >
      <h2 className="font-heading text-2xl">Ask DPCP</h2>
      <p className="mt-1 text-sm text-[#6d6456]">No patient names, dates of birth, or member IDs. Those stay in {practice.pms}.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => r2.setDraftCategory(category)}
            className={cn("min-h-11 rounded-full px-3 text-sm", r2.draftCategory === category ? "bg-[#1c2430] text-white" : "bg-[#f7f1e6]")}
          >
            {category}
          </button>
        ))}
      </div>
      <textarea value={r2.draft} onChange={(e) => r2.setDraft(e.target.value)} rows={4} placeholder="What happened?" className="mt-4 w-full rounded-2xl bg-[#f7f1e6] p-3 text-base outline-none" />
      <div className="mt-3 flex flex-wrap gap-2">
        {["Today", "This week", "Whenever"].map((item) => (
          <button key={item} type="button" onClick={() => setUrgency(item)} className={cn("min-h-11 rounded-full px-3 text-sm", urgency === item ? "bg-[#c46b3a] text-white" : "bg-[#f7f1e6]")}>
            {item}
          </button>
        ))}
      </div>
      <button type="submit" className="mt-4 min-h-14 w-full rounded-full bg-[#1f6b4a] text-base text-white">
        Send it
      </button>
      {latest && <Receipt req={latest} />}
    </form>
  );
}

function Receipt({ req }: { req: { deptLabel: string; aiFirst: boolean; stage: string } }) {
  return (
    <p className="mt-3 text-sm text-[#1f6b4a]">
      Routed to {req.deptLabel}. {req.aiFirst && req.stage === "ai" ? "AI is on it." : req.aiFirst ? "AI prepared it. A person has the next step." : "A person will help."}
    </p>
  );
}

function Tracker({ practiceId, who, manager }: { practiceId: string; who: string; manager: boolean }) {
  const r2 = useRound2();
  const r3 = useRound3();
  const [all, setAll] = useState(false);
  const mine = r2.requests.filter((req) => req.practiceId === practiceId && (all && manager ? true : req.authorName === who || all));
  const rows = manager && all ? r2.requests.filter((req) => req.practiceId === practiceId) : r2.requests.filter((req) => req.practiceId === practiceId && (manager ? true : req.authorName === who));
  const shown = manager ? (all ? rows : r2.requests.filter((req) => req.practiceId === practiceId && req.authorName === who)) : mine;

  return (
    <div>
      <div className="mb-3 flex gap-2 text-sm">
        <button type="button" className={!all ? "font-semibold" : "text-[#6d6456]"} onClick={() => setAll(false)}>Mine</button>
        <button type="button" className={all ? "font-semibold" : "text-[#6d6456]"} onClick={() => setAll(true)}>Whole office</button>
      </div>
      <div className="space-y-3">
        {shown.length === 0 && <p className="text-sm text-[#6d6456]">Nothing sent from this name yet.</p>}
        {shown.map((req) => (
          <article key={req.id} className="rounded-[28px] bg-white p-4">
            <p className="text-xs tracking-wide text-[#6d6456] uppercase">{req.deptLabel} · {req.urgency}</p>
            <p className="mt-1 text-base">{req.text}</p>
            <StageRail stage={req.stage} />
            <p className="mt-2 text-sm text-[#1f6b4a]">{labelFor(req.stage, req.result, req.aiFirst)}</p>
            <ol className="mt-3 space-y-1 text-xs text-[#6d6456]">
              {req.updates.map((update) => (
                <li key={update.at + update.text}>{update.at} · {update.text}</li>
              ))}
            </ol>
            {req.stage === "done" && <RateRow id={req.id} rating={req.rating} />}
          </article>
        ))}
        {r3.tickets
          .filter((ticket) => ticket.practiceId === practiceId && (all || ticket.requester === who))
          .map((ticket) => {
            const sla = slaState(ticket);
            return (
              <article key={ticket.id} className="rounded-[28px] bg-white p-4">
                <p className="text-xs tracking-wide text-[#6d6456] uppercase">{ticket.number} · {DEPT_META[ticket.department].label} · {ticket.status}</p>
                <p className="mt-1 text-base">{ticket.title}</p>
                <p className="mt-2 text-sm text-[#1f6b4a]">{sla.paused ? "Waiting on the practice. The clock is paused." : sla.breach ? "Past the sample response time." : "On the sample response time."}</p>
                {ticket.aiFirst ? <p className="mt-1 text-xs text-[#6d6456]">AI is on it. A person still sends anything that leaves the company.</p> : <p className="mt-1 text-xs text-[#6d6456]">A person will help.</p>}
              </article>
            );
          })}
      </div>
    </div>
  );
}

function RateRow({ id, rating }: { id: string; rating?: number }) {
  const r2 = useRound2();
  const r3 = useRound3();
  if (rating) return <p className="mt-2 text-sm text-[#1f6b4a]">You rated this {rating} of 5.</p>;
  return (
    <div className="mt-3 flex gap-2">
      {["😞", "😐", "🙂", "😀"].map((face, index) => (
        <button
          key={face}
          type="button"
          className="min-h-12 min-w-12 rounded-full bg-[#f7f1e6] text-lg"
          onClick={() => {
            const score = index + 1;
            r2.rateRequest(id, score, "");
            const req = r2.requests.find((item) => item.id === id);
            if (score <= 2 && req) {
              r3.addTicket({
                practiceId: req.practiceId,
                requester: "Department lead",
                department: req.copilot === "operations" ? "other" : req.copilot,
                type: "Not sure",
                priority: "urgent",
                title: `Low score from ${req.authorName}`,
                body: "A low score opens a follow-up for the department lead.",
              });
            }
          }}
        >
          {face}
        </button>
      ))}
    </div>
  );
}

function DeskHelp({ practiceId, who }: { practiceId: string; who: string }) {
  const r3 = useRound3();
  const [dept, setDept] = useState<TicketDept>("equipment");
  const types = TICKET_TYPES.filter((item) => item.department === dept);
  const [type, setType] = useState(types[0]?.type ?? "Repair");
  const [body, setBody] = useState("");
  const [urgency, setUrgency] = useState<"urgent" | "normal" | "low">("normal");
  const [photo, setPhoto] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const depts = Object.keys(DEPT_META) as TicketDept[];
  return (
    <form
      className="rounded-[28px] bg-white p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!body.trim()) return;
        const id = r3.addTicket({ practiceId, requester: who, department: dept, type, priority: urgency, title: body.trim(), body: body.trim(), phi: dept === "insurance", photo: photo || undefined });
        setSent(id);
        setBody("");
      }}
    >
      <h2 className="font-heading text-2xl">Get help</h2>
      <p className="mt-1 text-sm text-[#6d6456]">Pick a department. No patient names. Read-only SOPs live under Knowledge once you are in the signed-in app. Search here stays on the desk.</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {depts.map((id) => (
          <button key={id} type="button" className={cn("min-h-14 rounded-2xl px-2 text-sm", dept === id ? "bg-[#1c2430] text-white" : "bg-[#f7f1e6]")} onClick={() => { setDept(id); const next = TICKET_TYPES.find((item) => item.department === id); setType(next?.type ?? ""); }}>
            {DEPT_META[id].label}
          </button>
        ))}
      </div>
      <select className="mt-3 min-h-12 w-full rounded-2xl bg-[#f7f1e6] px-3" value={type} onChange={(event) => setType(event.target.value)} aria-label="Ticket type">
        {types.map((item) => <option key={item.type}>{item.type}</option>)}
      </select>
      <textarea className="mt-3 w-full rounded-2xl bg-[#f7f1e6] p-3" rows={3} value={body} onChange={(event) => setBody(event.target.value)} placeholder="What happened?" aria-label="Description" />
      <label className="mt-3 block text-xs text-[#6d6456]">
        Optional photo
        <input className="mt-1 block w-full text-sm" type="file" accept="image/*" aria-label="Optional photo" onChange={(event) => setPhoto(event.target.files?.[0]?.name ?? "")} />
      </label>
      <div className="mt-3 flex gap-2">
        {(["urgent", "normal", "low"] as const).map((item) => (
          <button key={item} type="button" className={cn("min-h-12 rounded-full px-3", urgency === item ? "bg-[#c46b3a] text-white" : "bg-[#f7f1e6]")} onClick={() => setUrgency(item)}>{item}</button>
        ))}
      </div>
      <button type="submit" className="mt-3 min-h-14 w-full rounded-full bg-[#1f6b4a] text-white">Submit</button>
      {sent && <p className="mt-2 text-sm text-[#1f6b4a]">Ticket {r3.tickets.find((ticket) => ticket.id === sent)?.number}. {dept === "hr" ? "A person will help." : "AI is on it."} Expected first response is on the sample SLA.</p>}
      <DeskSearch />
    </form>
  );
}

function DeskSearch() {
  const [query, setQuery] = useState("");
  const result = query.trim() ? searchKnowledge(query) : null;
  return (
    <div className="mt-4">
      <p className="text-xs tracking-wide text-[#6d6456] uppercase">Help</p>
      <input className="mt-2 min-h-12 w-full rounded-2xl bg-[#f7f1e6] px-3" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a sample SOP" aria-label="Search SOPs" />
      {result?.answer && <p className="mt-2 text-sm">{result.answer}</p>}
      {result?.source && <p className="text-xs text-[#6d6456]">Sample · {result.source.title}</p>}
    </div>
  );
}

function labelFor(stage: string, result: string, aiFirst: boolean) {
  if (stage === "done") return result || "Done";
  if (stage === "ai") return "AI working";
  if (stage === "specialist" || stage === "review" || stage === "revising" || stage === "v2") return "With a specialist";
  if (stage === "lead") return "With a specialist · lead is signing";
  if (stage === "received") return aiFirst ? "Received" : "A person will help";
  return "Received";
}

function StageRail({ stage }: { stage: string }) {
  const steps = ["Received", "AI working", "With a specialist", "Waiting on you", "Done"];
  const index = stage === "done" ? 4 : stage === "ai" ? 1 : stage === "received" ? 0 : 2;
  return (
    <ol className="mt-3 flex flex-wrap gap-1">
      {steps.map((step, i) => (
        <li key={step} className={cn("rounded-full px-2 py-1 text-[11px]", i <= index ? "bg-[#1f6b4a] text-white" : "bg-[#f7f1e6] text-[#6d6456]")}>
          {step}
        </li>
      ))}
    </ol>
  );
}

function Learn({ role, personId }: { role: (typeof ROLES_FOR_TRAINING)[number]; personId: string }) {
  const r2 = useRound2();
  const [quiz, setQuiz] = useState<Record<string, number | null>>({});
  const mine = LESSONS.filter((lesson) => lesson.role === role || lesson.role === "Everyone");
  const done = mine.filter((lesson) => r2.lessons[`${personId}:${lesson.id}`]?.done).length;
  return (
    <div>
      <p className="text-sm text-[#6d6456]">
        {role} · {done}/{mine.length} modules
      </p>
      <div className="mt-3 space-y-3">
        {mine.map((lesson) => {
          const key = `${personId}:${lesson.id}`;
          const state = r2.lessons[key];
          return (
            <article key={lesson.id} className="rounded-[28px] bg-white p-4">
              <h2 className="text-base font-medium">{lesson.title}</h2>
              <p className="text-xs text-[#6d6456]">{lesson.minutes} min</p>
              <p className="mt-3 text-sm">{lesson.quiz.q}</p>
              <div className="mt-2 space-y-2">
                {lesson.quiz.choices.map((choice, index) => (
                  <button key={choice} type="button" onClick={() => setQuiz((q) => ({ ...q, [lesson.id]: index }))} className={cn("block min-h-11 w-full rounded-2xl px-3 text-left text-sm", quiz[lesson.id] === index ? "bg-[#f3d7c4]" : "bg-[#f7f1e6]")}>
                    {choice}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="mt-3 min-h-11 text-sm text-[#1f6b4a]"
                onClick={() => {
                  if (quiz[lesson.id] === lesson.quiz.answer) r2.finishLesson(key);
                }}
              >
                {state?.done ? "Passed" : "Check"}
              </button>
              {state?.done && !state.signed && (
                <button type="button" className="ml-3 min-h-11 text-sm" onClick={() => r2.signLesson(key)}>
                  Sign off
                </button>
              )}
              {state?.signed && <p className="mt-1 text-xs text-[#1f6b4a]">Signed</p>}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function DayBoard({ practice }: { practice: Practice }) {
  const r2 = useRound2();
  const people = FLOOR.filter((p) => p.practiceId === practice.id);
  const marks = MARKS.filter((mark) => mark.practiceId === practice.id);
  return (
    <div className="space-y-3">
      <section className="rounded-[28px] bg-white p-4">
        <h2 className="font-heading text-xl">Huddle</h2>
        <p className="mt-2 text-sm">Lab case is in for the late morning. One op is tight before lunch. No names on this card.</p>
        <p className="mt-3 text-xs tracking-wide text-[#6d6456] uppercase">Who is in</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {people.map((person) => (
            <li key={person.id} className="rounded-full bg-[#f7f1e6] px-3 py-2 text-sm">{person.first}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-[28px] bg-white p-4">
        <h2 className="font-heading text-xl">Marks for marketing</h2>
        <p className="mt-1 text-sm text-[#6d6456]">Initials only. Scheduled or seen. This is how a call gets matched later.</p>
        <ul className="mt-3 space-y-2">
          {marks.map((mark) => {
            const state = r2.marks[mark.id] ?? mark.state;
            return (
              <li key={mark.id} className="flex items-center justify-between gap-2">
                <span className="text-sm">{mark.initials} · {mark.when}</span>
                <span className="flex gap-2">
                  {(["scheduled", "seen"] as const).map((item) => (
                    <button key={item} type="button" onClick={() => r2.setMark(mark.id, item)} className={cn("min-h-11 rounded-full px-3 text-sm", state === item ? "bg-[#1f6b4a] text-white" : "bg-[#f7f1e6]")}>
                      {item}
                    </button>
                  ))}
                </span>
              </li>
            );
          })}
          {marks.length === 0 && <li className="text-sm text-[#6d6456]">No marks on this book today.</li>}
        </ul>
      </section>
    </div>
  );
}

function Wins({ practiceId, from }: { practiceId: string; from: string }) {
  const r2 = useRound2();
  const [about, setAbout] = useState("the morning crew");
  const [text, setText] = useState("");
  const [pillar, setPillar] = useState<"Intelligence" | "Energy" | "Integrity">("Energy");
  const wall = useMemo(() => [...r2.shouts, ...SEED_SHOUTS].filter((shout) => shout.practiceId === practiceId), [practiceId, r2.shouts]);
  return (
    <div className="space-y-3">
      <form
        className="rounded-[28px] bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!text.trim()) return;
          r2.addShout({ id: `shout-${Date.now()}`, practiceId, from, about, text: text.trim(), pillar });
          setText("");
        }}
      >
        <h2 className="font-heading text-xl">A shout-out</h2>
        <input value={about} onChange={(e) => setAbout(e.target.value)} className="mt-3 min-h-12 w-full rounded-2xl bg-[#f7f1e6] px-3" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="mt-2 w-full rounded-2xl bg-[#f7f1e6] p-3" placeholder="What did you notice?" />
        <div className="mt-2 flex flex-wrap gap-2">
          {(["Intelligence", "Energy", "Integrity"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setPillar(item)} className={cn("min-h-11 rounded-full px-3 text-sm", pillar === item ? "bg-[#1c2430] text-white" : "bg-[#f7f1e6]")}>
              {item}
            </button>
          ))}
        </div>
        <button type="submit" className="mt-3 min-h-12 rounded-full bg-[#1f6b4a] px-4 text-white">Put it on the wall</button>
      </form>
      {wall.map((shout) => (
        <article key={shout.id} className="rounded-[28px] bg-white p-4">
          <p className="text-xs text-[#c46b3a]">{shout.pillar}</p>
          <p className="mt-1 text-sm">{shout.text}</p>
          <p className="mt-2 text-xs text-[#6d6456]">{shout.from} → {shout.about}</p>
        </article>
      ))}
    </div>
  );
}

export function PracticeIndex() {
  const practices = [
    ["copper-canyon", "Copper Canyon Dental"],
    ["mesa-verde", "Mesa Verde Family Dental"],
    ["ponderosa", "Ponderosa Smiles"],
    ["saguaro", "Saguaro Family Dental"],
    ["lakeview", "Lakeview Dental Arts"],
    ["red-rock", "Red Rock Pediatric Dental"],
  ];
  return (
    <div className="min-h-dvh bg-[#f7f1e6] px-6 py-10 text-[#1c2430]">
      <p className="text-xs tracking-[0.18em] text-[#1f6b4a] uppercase">Practice desks</p>
      <h1 className="font-heading mt-2 text-4xl">No login. Tap your name.</h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {practices.map(([slug, name]) => (
          <Link key={slug} href={`/practice/${slug}`} className="rounded-[28px] bg-white p-5 text-lg no-underline">
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}

