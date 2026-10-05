"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageFrame } from "@/components/app-shell";
import { PRACTICES, practiceById } from "@/lib/round2/data";
import { useRound2 } from "@/lib/round2/context";
import { useApp } from "@/lib/store";
import { liveDeskTickets } from "@/lib/round3/bridge";
import { relatedSop } from "@/lib/round3/knowledge";
import { CANNED, DEPT_META, QUEUE_COLUMNS, TICKET_TYPES, lifecycle, slaFor, slaState, type Ticket, type TicketDept, type TicketStatus } from "@/lib/round3/tickets";
import { useRound3 } from "@/lib/round3/store";
import { AiHuman, DraftLabel, Gate, SampleBanner, Segmented, Sheet, SopChip, UndoToast } from "@/components/round3/ui";
import { cn } from "@/lib/utils";

const DEPTS = Object.keys(DEPT_META) as TicketDept[];

export function TicketsScreen() {
  const r3 = useRound3();
  const r2 = useRound2();
  const [view, setView] = useState("queues");
  const [dept, setDept] = useState<TicketDept | "all">("all");
  const [practice, setPractice] = useState("all");
  const [priority, setPriority] = useState("all");
  const [book, setBook] = useState("all");
  const [slaOnly, setSla] = useState("all");
  const [saved, setSaved] = useState("none");
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [undo, setUndo] = useState<{ text: string; run: () => void } | null>(null);
  const allTickets = useMemo(() => [...liveDeskTickets(r2.requests), ...r3.tickets], [r2.requests, r3.tickets]);
  const rows = allTickets.filter((ticket) => {
    if (dept !== "all" && ticket.department !== dept) return false;
    if (practice !== "all" && ticket.practiceId !== practice) return false;
    if (priority !== "all" && ticket.priority !== priority) return false;
    if (book !== "all") {
      const kind = practiceById(ticket.practiceId)?.kind;
      if (kind !== book) return false;
    }
    if ((slaOnly === "breach" || saved === "breaches") && !slaState(ticket).breach) return false;
    if (saved === "escalations" && ticket.escalation === 0) return false;
    if (saved === "waiting" && ticket.status !== "waiting") return false;
    return true;
  });
  const breaches = allTickets.filter((ticket) => slaState(ticket).breach).length;
  const escalated = allTickets.filter((ticket) => ticket.escalation > 0).length;
  const lane = rows.filter((ticket) => ticket.escalation > 0);

  return (
    <PageFrame title="Tickets" lede="One request, from the practice desk to the department queue.">
      <Gate>
        <SampleBanner />
        <p className="mt-2 text-sm text-muted-foreground">
          {allTickets.length} tickets, including live desk requests · {breaches} SLA breaches · {escalated} escalations. Sample SLAs, for example urgent equipment: 15 min to first response, 1 business day to resolve.
        </p>
        <div className="mt-4">
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { id: "queues", label: "Queues" },
              { id: "all", label: "All tickets" },
              { id: "analytics", label: "Analytics" },
              { id: "help", label: "Get help" },
            ]}
          />
        </div>
        {view === "help" && <HelpForm />}
        {view === "analytics" && <Analytics rows={allTickets} />}
        {(view === "queues" || view === "all") && (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              <Select label="Department" value={dept} onChange={(value) => setDept(value as TicketDept | "all")} options={[["all", "All"], ...DEPTS.map((id) => [id, DEPT_META[id].label] as [string, string])]} />
              <Select label="Practice" value={practice} onChange={setPractice} options={[["all", "All"], ...PRACTICES.map((item) => [item.id, item.name] as [string, string])]} />
              <Select label="Priority" value={priority} onChange={setPriority} options={[["all", "All"], ["urgent", "Urgent"], ["normal", "Normal"], ["low", "Low"]]} />
              <Select label="Book" value={book} onChange={setBook} options={[["all", "All"], ["hdg", "HDG"], ["client", "Client"]]} />
              <Select label="SLA" value={slaOnly} onChange={setSla} options={[["all", "All"], ["breach", "Breaches"]]} />
              <Select label="Saved view" value={saved} onChange={setSaved} options={[["none", "None"], ["breaches", "SLA breaches"], ["escalations", "Escalations"], ["waiting", "Waiting on practice"]]} />
            </div>
            {Object.values(picked).some(Boolean) && (
              <button
                type="button"
                className="mt-3 min-h-11 rounded-full bg-dpcp-navy px-4 text-sm text-white"
                onClick={() => {
                  const ids = Object.keys(picked).filter((id) => picked[id] && !id.startsWith("req-"));
                  const previous = allTickets.filter((ticket) => ids.includes(ticket.id)).map((ticket) => ({ id: ticket.id, status: ticket.status }));
                  ids.forEach((id) => r3.setTicketStatus(id, "waiting"));
                  setPicked({});
                  setUndo({ text: "Marked waiting on the practice", run: () => previous.forEach((item) => r3.setTicketStatus(item.id, item.status)) });
                }}
              >
                Mark selected waiting
              </button>
            )}
            {lane.length > 0 && view === "queues" && (
              <section className="mt-4">
                <h2 className="font-heading text-lg text-dpcp-navy">Escalation lane</h2>
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {lane.map((ticket) => (
                    <div key={ticket.id} className="min-w-[220px]">
                      <TicketCard ticket={ticket} onOpen={setOpenId} picked={Boolean(picked[ticket.id])} onPick={(on) => setPicked((current) => ({ ...current, [ticket.id]: on }))} />
                    </div>
                  ))}
                </div>
              </section>
            )}
            {view === "queues" ? (
              <Board rows={rows} dept={dept} onOpen={setOpenId} picked={picked} onPick={(id, on) => setPicked((current) => ({ ...current, [id]: on }))} />
            ) : (
              <List rows={rows} onOpen={setOpenId} picked={picked} onPick={(id, on) => setPicked((current) => ({ ...current, [id]: on }))} />
            )}
          </>
        )}
        <Detail id={openId} tickets={allTickets} onClose={() => setOpenId(null)} />
        {undo && <UndoToast text={undo.text} onUndo={undo.run} />}
      </Gate>
    </PageFrame>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  return (
    <label className="text-xs text-muted-foreground">
      {label}
      <select className="mt-1 block min-h-11 rounded-xl bg-white px-2 text-sm text-foreground" value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {options.map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

function Board({ rows, dept, onOpen, picked, onPick }: { rows: Ticket[]; dept: TicketDept | "all"; onOpen: (id: string) => void; picked: Record<string, boolean>; onPick: (id: string, on: boolean) => void }) {
  const departments = dept === "all" ? DEPTS : [dept];
  return (
    <div className="mt-4 space-y-6">
      {departments.map((id) => (
        <section key={id}>
          <h2 className="font-heading text-lg text-dpcp-navy">
            {DEPT_META[id].label}
            {DEPT_META[id].restricted ? " · restricted" : ""}
          </h2>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {QUEUE_COLUMNS.map((column) => {
              const items = rows.filter((ticket) => ticket.department === id && ticket.status === column.id);
              return (
                <div key={column.id} className="min-w-[220px] flex-1 rounded-2xl bg-muted p-2">
                  <p className="px-1 text-xs text-muted-foreground">
                    {column.label} · {items.length}
                  </p>
                  <div className="mt-2 space-y-2">
                    {items.map((ticket) => (
                      <TicketCard key={ticket.id} ticket={ticket} onOpen={onOpen} picked={Boolean(picked[ticket.id])} onPick={(on) => onPick(ticket.id, on)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function List({ rows, onOpen, picked, onPick }: { rows: Ticket[]; onOpen: (id: string) => void; picked: Record<string, boolean>; onPick: (id: string, on: boolean) => void }) {
  return (
    <div className="mt-4 space-y-2">
      {rows.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} onOpen={onOpen} picked={Boolean(picked[ticket.id])} onPick={(on) => onPick(ticket.id, on)} />
      ))}
    </div>
  );
}

function TicketCard({ ticket, onOpen, picked, onPick }: { ticket: Ticket; onOpen: (id: string) => void; picked: boolean; onPick: (on: boolean) => void }) {
  const sla = slaState(ticket);
  return (
    <div className={cn("flex gap-2 rounded-2xl bg-white p-3 text-left shadow-sm", picked && "ring-2 ring-dpcp-blue")}>
      <input type="checkbox" className="mt-1 size-5" checked={picked} aria-label={`Select ${ticket.number}`} onChange={(event) => onPick(event.target.checked)} />
      <button type="button" onClick={() => onOpen(ticket.id)} className="min-w-0 flex-1 text-left">
      <p className="text-xs text-muted-foreground">
        {ticket.number} · {practiceById(ticket.practiceId)?.name} · {ticket.priority}
      </p>
      <p className="mt-1 text-sm">{ticket.title}</p>
      <p className={cn("mt-1 text-xs", sla.breach ? "text-status-red" : sla.paused ? "text-status-amber" : "text-status-green")}>
        {sla.paused ? "SLA paused · waiting on the practice" : sla.breach ? "SLA breach" : `${Math.max(sla.firstLeft, 0)} min to first response`}
        {ticket.escalation > 0 ? ` · escalation ${ticket.escalation}` : ""}
      </p>
      </button>
    </div>
  );
}

function Detail({ id, tickets, onClose }: { id: string | null; tickets: Ticket[]; onClose: () => void }) {
  const r3 = useRound3();
  const r2 = useRound2();
  const app = useApp();
  const ticket = tickets.find((item) => item.id === id) ?? null;
  const live = Boolean(ticket?.id.startsWith("req-"));
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [dept, setDept] = useState<TicketDept>("other");
  const [draft, setDraft] = useState("");
  const life = ticket ? lifecycle(ticket) : null;
  const sla = ticket ? slaState(ticket) : null;
  const canned = ticket ? CANNED[ticket.department] ?? CANNED.default : [];
  const duplicate = ticket?.duplicateOf ? r3.tickets.find((item) => item.id === ticket.duplicateOf) : null;
  const possible = ticket ? r3.tickets.find((item) => item.id !== ticket.id && item.practiceId === ticket.practiceId && item.department === ticket.department && item.type === ticket.type && item.id === "eq-1" && ticket.id === "eq-2") : null;
  return (
    <Sheet open={Boolean(ticket)} title={ticket ? ticket.number : ""} onClose={onClose}>
      {ticket && life && sla && (
        <div className="space-y-3 text-sm">
          {ticket.phi && <p className="rounded-full bg-[#E7EEF6] px-3 py-1 text-xs text-dpcp-navy">PHI stays in the PMS until BAA. Initials only.</p>}
          <p>{ticket.title}</p>
          <p className="text-muted-foreground">
            {DEPT_META[ticket.department].label} · {ticket.type} · {ticket.requester} · {practiceById(ticket.practiceId)?.name}
          </p>
          <AiHuman ai={ticket.aiFirst} />
          <p>{ticket.aiDid}</p>
          <p>{ticket.humanNeeded}</p>
          <SopChip text={ticket.title} />
          <ol className="flex flex-wrap gap-1">
            {life.steps.map((step, index) => (
              <li key={step} className={cn("rounded-full px-2 py-1 text-[11px]", index <= life.index ? "bg-dpcp-navy text-white" : "bg-muted")}>
                {step}
              </li>
            ))}
          </ol>
          <p>
            {sla.policy.label}: first response {sla.policy.firstMin} min · resolve {Math.round(sla.policy.resolveMin / 60)} h · tier {ticket.tier}
          </p>
          <p>Escalation: {sla.policy.ladder.join(" → ")}. Trigger now: {sla.policy.triggers[ticket.escalation] ?? "None"}.</p>
          {duplicate && <p>Added to {duplicate.number}, reported earlier by {duplicate.requester}.</p>}
          {possible && !ticket.duplicateOf && (
            <button type="button" className="text-dpcp-blue" onClick={() => r3.linkDuplicate(ticket.id, possible.id)}>
              Op 7 chair was reported earlier by {possible.requester}: add to it?
            </button>
          )}
          <label className="block">
            Move to another department
            <span className="mt-1 flex gap-2">
              <select className="min-h-11 flex-1 rounded-xl bg-muted px-2" value={dept} onChange={(event) => setDept(event.target.value as TicketDept)} aria-label="Department">
                {DEPTS.map((item) => (
                  <option key={item} value={item}>
                    {DEPT_META[item].label}
                  </option>
                ))}
              </select>
              <input className="min-h-11 flex-1 rounded-xl bg-muted px-2" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason" aria-label="Reason" />
              <button type="button" className="min-h-11 rounded-full bg-white px-3" onClick={() => reason && !live && r3.reassignTicket(ticket.id, dept, reason)}>
                Move
              </button>
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {QUEUE_COLUMNS.map((column) => (
              <button key={column.id} type="button" className="min-h-11 rounded-full bg-muted px-3 text-xs" onClick={() => { if (live) { if (column.id === "resolved" || column.id === "closed") r2.completeGeneral(ticket.id); return; } r3.setTicketStatus(ticket.id, column.id as TicketStatus); }}>
                {column.label}
              </button>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Canned replies</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {canned.map((line) => (
                <button key={line} type="button" className="rounded-full bg-muted px-3 py-2 text-left text-xs" onClick={() => setDraft(line)}>
                  {line}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            Reply
            <textarea className="mt-1 w-full rounded-2xl bg-muted p-3" rows={3} value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Reply" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="min-h-11 text-sm text-dpcp-blue"
              onClick={() => {
                const sop = relatedSop(ticket.title);
                setDraft(`Draft: we have this. ${sop ? `The next step is in ${sop.title}.` : ""} A person still sends it.`);
              }}
            >
              Draft with AI
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full bg-dpcp-blue px-3 text-white"
              onClick={() => {
                if (!draft.trim()) return;
                app.handToReview(`Reply on ${ticket.number}`, draft);
                r3.addApproval({ title: `Reply on ${ticket.number}`, risk: "outbound", department: DEPT_META[ticket.department].label, why: "A reply to a practice waits for a person." });
                setDraft("");
              }}
            >
              Send to Review
            </button>
            <button type="button" className="min-h-11 rounded-full bg-white px-3" onClick={() => note && r3.replyTicket(ticket.id, note, "internal")}>
              Save internal note
            </button>
          </div>
          {draft && <DraftLabel />}
          <input className="min-h-11 w-full rounded-xl bg-muted px-3" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Internal note" aria-label="Internal note" />
          <ol className="space-y-1 text-xs text-muted-foreground">
            {ticket.events.map((event) => (
              <li key={event.at + event.text}>
                {event.text} · {event.by}
              </li>
            ))}
            {ticket.replies.map((reply) => (
              <li key={reply.at + reply.text}>
                {reply.visibility === "internal" ? "Internal" : "Practice-visible"} · {reply.text}
              </li>
            ))}
          </ol>
          {ticket.photo && <p>Photo: {ticket.photo}</p>}
          {(ticket.status === "resolved" || ticket.status === "closed") && <Rate ticketId={ticket.id} live={live} />}
          {ticket.status === "closed" && !live && (
            <button type="button" className="text-dpcp-blue" onClick={() => r3.reopenTicket(ticket.id)}>
              Reopen within 7 days
            </button>
          )}
        </div>
      )}
    </Sheet>
  );
}

function Rate({ ticketId, live }: { ticketId: string; live?: boolean }) {
  const r3 = useRound3();
  const r2 = useRound2();
  const ticket = live ? null : r3.tickets.find((item) => item.id === ticketId);
  const desk = r2.requests.find((item) => item.id === ticketId);
  const rating = live ? desk?.rating : ticket?.rating;
  const note = live ? desk?.ratingNote : ticket?.ratingNote;
  if (rating) return <p>Rated {rating} of 5. {note}</p>;
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          className="min-h-11 min-w-11 rounded-full bg-muted"
          onClick={() => {
            if (live) {
              r2.rateRequest(ticketId, score, "");
              if (score <= 2 && desk) {
                r3.addTicket({
                  practiceId: desk.practiceId,
                  requester: "Department lead",
                  department: desk.copilot === "operations" ? "other" : (desk.copilot as TicketDept),
                  type: "Not sure",
                  priority: "urgent",
                  title: `Low score from ${desk.authorName}`,
                  body: "A 1 or 2 opens a follow-up for the department lead.",
                });
              }
              return;
            }
            r3.rateTicket(ticketId, score, "");
            if (score <= 2 && ticket) {
              r3.addTicket({
                practiceId: ticket.practiceId,
                requester: "Department lead",
                department: ticket.department,
                type: ticket.type,
                priority: "urgent",
                title: `Low score on ${ticket.number}`,
                body: "A 1 or 2 opens a follow-up for the department lead.",
              });
            }
          }}
        >
          {score}
        </button>
      ))}
    </div>
  );
}

function Analytics({ rows }: { rows: Ticket[] }) {
  const byDept = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((ticket) => map.set(ticket.department, (map.get(ticket.department) ?? 0) + 1));
    return [...map.entries()];
  }, [rows]);
  const rated = rows.filter((ticket) => ticket.rating);
  const avg = rated.length ? (rated.reduce((sum, ticket) => sum + (ticket.rating ?? 0), 0) / rated.length).toFixed(1) : "—";
  const ai = rows.length ? Math.round((rows.filter((ticket) => ticket.aiFirst && (ticket.status === "resolved" || ticket.status === "closed")).length / rows.length) * 100) : 0;
  const breaches = rows.filter((ticket) => slaState(ticket).breach).length;
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <article className="rounded-2xl bg-white p-4">
        <p className="text-xs text-muted-foreground">Volume by department</p>
        <ul className="mt-2 text-sm">
          {byDept.map(([id, count]) => (
            <li key={id} className="flex justify-between">
              <span>{DEPT_META[id as TicketDept].label}</span>
              <span>{count}</span>
            </li>
          ))}
        </ul>
      </article>
      <article className="rounded-2xl bg-white p-4 text-sm">
        <p>Median first response: sample, under 2 hours on answered tickets.</p>
        <p className="mt-2">SLA breach {rows.length ? Math.round((breaches / rows.length) * 100) : 0}%.</p>
        <p className="mt-2">Satisfaction {avg}. Goal 4.5.</p>
        <p className="mt-2">AI-resolved share {ai}%.</p>
        <p className="mt-2">Reopened: use Reopen on a closed ticket. The event stays on the timeline.</p>
      </article>
      <p className="text-xs text-muted-foreground sm:col-span-2">
        Real SLA targets wait for Monday. <Link href="/performance/" className="text-dpcp-blue">Performance</Link> reads these same tickets.
      </p>
    </div>
  );
}

function HelpForm() {
  const r3 = useRound3();
  const [dept, setDept] = useState<TicketDept>("equipment");
  const types = TICKET_TYPES.filter((item) => item.department === dept);
  const [type, setType] = useState(types[0]?.type ?? "Repair");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState<"urgent" | "normal" | "low">("normal");
  const [practice, setPractice] = useState("copper");
  const [photo, setPhoto] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const policy = slaFor(dept, priority, practice === "saguaro" ? "Growth" : practice === "lakeview" || practice === "redrock" ? "Essentials" : "Full Partner");
  return (
    <form
      className="mt-4 max-w-xl space-y-3 rounded-2xl bg-white p-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!body.trim()) return;
        const id = r3.addTicket({ practiceId: practice, requester: "Office manager", department: dept, type, priority, title: body.trim(), body: body.trim(), phi: dept === "insurance", photo: photo || undefined });
        setSent(id);
        setBody("");
      }}
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {DEPTS.map((id) => (
          <button key={id} type="button" className={cn("min-h-16 rounded-2xl px-2 text-sm", dept === id ? "bg-dpcp-navy text-white" : "bg-muted")} onClick={() => { setDept(id); const next = TICKET_TYPES.find((item) => item.department === id); setType(next?.type ?? ""); }}>
            {DEPT_META[id].label}
          </button>
        ))}
      </div>
      <select className="min-h-11 w-full rounded-xl bg-muted px-2" value={type} onChange={(event) => setType(event.target.value)} aria-label="Ticket type">
        {types.map((item) => (
          <option key={item.type}>{item.type}</option>
        ))}
      </select>
      <select className="min-h-11 w-full rounded-xl bg-muted px-2" value={practice} onChange={(event) => setPractice(event.target.value)} aria-label="Practice">
        {PRACTICES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <textarea className="w-full rounded-2xl bg-muted p-3" rows={3} value={body} onChange={(event) => setBody(event.target.value)} placeholder="What happened? No patient names." aria-label="Description" />
      <label className="block text-xs text-muted-foreground">
        Optional photo
        <input className="mt-1 block w-full text-sm" type="file" accept="image/*" aria-label="Optional photo" onChange={(event) => setPhoto(event.target.files?.[0]?.name ?? "")} />
      </label>
      <div className="flex gap-2">
        {(["urgent", "normal", "low"] as const).map((item) => (
          <button key={item} type="button" className={cn("min-h-11 rounded-full px-3", priority === item ? "bg-dpcp-blue text-white" : "bg-muted")} onClick={() => setPriority(item)}>
            {item}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Expected first response {policy.firstMin} minutes. {dept === "hr" ? "A person will help. This queue is restricted." : "AI is on it, then a person."}
      </p>
      <button type="submit" className="min-h-12 w-full rounded-full bg-dpcp-blue text-white">
        Submit
      </button>
      {sent && <p className="text-sm text-status-green">Ticket {r3.tickets.find((ticket) => ticket.id === sent)?.number} is with {DEPT_META[dept].label}.</p>}
    </form>
  );
}
