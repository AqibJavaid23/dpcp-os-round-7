# DPCP OS – Detailed Screen Specs v2

**For:** George Hariri · **Status:** design draft, private. Nothing has been built, sent or shared.
**Builds on:** [DPCP OS Product Design v1](https://docs.google.com/document/d/1IVsoG8tYnPGYJ54ImFOfNqfPWF-yTBntem2bFXmO89s/edit) (principles, roles, architecture) and the Architect's technical design v1 (router, intake, reliability).
**How to use this doc:** one chapter per screen. Each chapter covers the layout, every interaction, every state, who sees what, the exact wording on screen, how the phone version differs, and a checklist a tester can tick off. Appendix A walks through a real workday for each department, and Appendix B lists every mockup. All names and practices in the mockups and examples are made up.

**New in v2 (beyond v1):**
- An **offline** state for every screen.
- A **"Held for review"** tab in Messages for anything that looks like patient information (the safety screen from the Architect's D1).
- A tighter router: at most **2** clarifying questions, then "make this a task for a person".
- An offline rule for sending: a queued reply is checked again before it goes out.
- 7 new mockups.

---

## 0. Rules that apply to every screen

### 0.1 Frame (desktop, ≥ 1024 px wide)
| Region | Contents |
|---|---|
| **Top bar** (56 px, white, thin bottom border) | "DPCP OS" wordmark · main tabs (by role, see 0.4) · current date and time in the user's zone with a zone tag (e.g. "10:42 AM AZ") · avatar menu (Settings, Help, Sign out) |
| **Status banner slot** (under the top bar; hidden when all is well) | One banner at a time, highest priority first: *Offline* › *AI paused* › *Connection needs you* (e.g. Slack re-connect) › *Planned maintenance* |
| **Main area** | The screen content. Max width 1200 px, generous margins (≥ 48 px) |
| **Chat side panel** (340 px, right) | Shown on Today and Task detail. Can be collapsed to a "Chat" tab and remembers the choice |
| **Request or Report button** | Small pill, bottom-right, on every screen (sits left of the chat panel when it's open) |

### 0.2 Visual rules
- White and light-grey surfaces, rounded cards (14 px), one dark primary button per area.
- **Color only for status:**
  - green = on track / done
  - amber = due soon / behind / needs care
  - red = blocked / overdue / failed
  - blue = needs you / informational
  - grey = neutral
- No decorative color, no charts with more than 2 colors.
- Type: one sans-serif family. Page title 24 px, card title 20 px, body 14 px, small 12 px, labels 11 px uppercase.
- One primary action per card. Destructive actions are never the primary button.
- Motion: next-task card fades in (200 ms). Nothing bounces.

### 0.3 Standard states (each chapter says what changes)
| State | When | Standard treatment |
|---|---|---|
| **Empty** | Nothing to show | Calm one-line message + what will appear here + at most one helpful action |
| **Loading** | Waiting on data | Grey placeholder shapes in the real layout. Cached data shows first with "Updating…" in small text. Never a spinner over a blank page. Over 8 s: "Still loading. Your work is saved." |
| **Error** | A request failed | Plain sentence of what failed + "Your work is saved" when true + **Try again** button. Auto-retry 3 times quietly first. Each error is logged and reported to the Architect Bot automatically |
| **Offline** | Device has no connection | Grey banner: "You're offline. You can keep working; changes will sync when you're back." Last-synced data is shown read-only where it can't be changed safely. Actions queue on the device, each with a small clock icon. **Nothing goes to a client or outside person while offline** (see 1.6) |
| **No AI (AI paused)** | xAI down, over budget, or George paused AI | Amber banner: "AI is paused. You can keep working; anything already prepared still works. New items will be prepared when it's back." Manual buttons stay. AI-only buttons are hidden, not greyed out |

### 0.4 Roles and what changes
| | Employee | Lead | George (owner) |
|---|---|---|---|
| Tabs | Today · Messages · Meetings · My week · Chat | + **My team** | + **Company** · **Decisions** · **System** |
| Sees | Own work only | Own work + their department | Everything (message bodies only with an audited "open"; see D3) |
| Approves | Own routine outbound | Team items above employee level | Money, legal, policy, anything escalated |
| Release owner (Aqib) | Employee tabs + **Releases** and **Needs attention** | — | — |

### 0.5 Microcopy rules
- Plain words and short sentences. Name the thing ("Reply to Mesa Ridge Dental"), never "item".
- Buttons start with a verb: "Approve & send", "Move to tomorrow", "Try again".
- Toasts last 5 s, appear bottom-center, and include **Undo** whenever undo is possible.
- Times always carry the zone tag.
- **Never** show the words "AI" or "bot" in anything a client could see. Inside the app, "AI" is fine.
- Errors never blame the user and never show codes (the code goes to the log).

### 0.6 Phone basics (< 768 px; tablet 768–1023 px uses the phone layout with two columns where noted)
- Installable web app ("Add to Home Screen"); full-screen; no browser bar.
- Bottom tab bar (64 px): **Today · Messages · Chat · Meetings · More**. Leads get **Team** in place of Meetings; Meetings moves to More.
- One column. Primary action is full-width at the bottom within thumb reach. Tap targets ≥ 44 px.
- Side panels become full screens. Pop-ups become full-screen sheets.
- Push notifications only for: must-acknowledge notices, urgent tasks (due < 2 h), and approvals waiting > 1 h. Everything else is in-app only.

### 0.7 Global acceptance criteria
1. Every screen passes all five states in 0.3 on desktop and phone.
2. No screen shows another person's data unless the role table in 0.4 allows it (test with 3 accounts: employee, lead, George).
3. Every user action is saved on the server before the success toast shows. With the network cut mid-action, nothing is lost and nothing is sent twice.
4. Every button label matches this doc exactly.
5. Color is used only for status (design review check).
6. Page is usable within 2 s on a normal connection, with cached content within 0.5 s.

---

## 1. Today (home) and the focus card

![Today – desktop](mockups/today-desktop.png)

**Purpose.** Do today's work one task at a time, prepared, in the right order, without sorting anything.

### 1.1 Layout regions and components
| Region | Components |
|---|---|
| **Header row** | Greeting ("Good morning, Nadia"; changes by time of day) · summary line "Task 4 of 9 today · about 3 h 40 m of work left · on track to finish by 4:30 PM" · **Today's progress** bar, right-aligned, with "3 of 9 done" |
| **Focus card** (full width of the main area) | Tag row: status tag (Needs your approval / Ready / Call / Meeting prep / Waiting), source tag ("From email · Mesa Ridge Dental"), due tag (amber within 2 h, red if overdue), estimate ("≈ 10 min", from Time Doctor history) · **Title** (≤ 2 lines) · **Why line** (1–2 sentences: what happened and what the AI found) · two panels side by side: **Draft** (when there is one; shows which account it sends from) and **What I prepared** (checklist of what the AI did, attachments, SOP step link, "Done = …") · **Action row** · **Next up** line (title only) |
| **Strip of three small cards** | **Messages** (counts: need reply · need decision · handled by AI; "All already queued in your Today list by priority") · **Wins** (on-time streak in days; hours AI saved today) · **My execution rate · private** (this week's on-time %, the person's goal, thin bar) |
| **Chat side panel** | See chapter 2 |
| **Request or Report** pill | See chapter 9 |

**Focus card types** (same frame, different action rows):
| Type | Primary | Secondary |
|---|---|---|
| Approve a draft (email/Slack to someone outside, or an internal reply) | **Approve & send** | Edit draft · I'm blocked · Need more time |
| Do a human step (call, sign, decide, check) | **Mark done** | I'm blocked · Need more time · Skip for now |
| Join/prep a meeting | **Open prep** (then **Join meeting** from 5 min before) | Need more time · Skip for now |
| Decide (lead/George) | **Approve** / **Choose option** | Ask a question · Send back |
| Review AI work (low confidence) | **Looks right** | Fix it · This needed me |

### 1.2 Interactions and results
| Action | Result |
|---|---|
| **Approve & send** | Saves the approval. The reply sends from the employee's own account in the same thread. Toast: "Sent to Laura. Undo (5 s)". Undo cancels the send within 5 s (send is delayed by 5 s). Card fades out, next card fades in, progress bar advances |
| **Edit draft** | Draft panel becomes an editor in place (formatting: bold, bullets, link). Buttons change to **Approve & send** · **Cancel edits**. The AI learns from the edit (diff stored) |
| **Mark done** | If the task needs proof (e.g. a sent-thread link or confirmation number), a small field appears: "Add proof: paste a link or number". Otherwise done right away. Toast: "Done. Nice work. Undo" |
| **I'm blocked** | Sheet with reasons (tap one): Waiting on a client · Waiting on a teammate · Missing access · Don't know how · Something else (text). Optional note. → Task goes to *Blocked*. The AI starts the matching help: drafts a nudge for approval, asks the teammate, or opens the SOP. The lead is alerted if it's still blocked after the threshold (default 2 h, or right away if due today). Next card appears |
| **Need more time** | Date picker with smart options: "Later today · Tomorrow · Friday · Pick a date". Required one-line reason. **Original due date is never changed** (on-time stays honest). Toast: "Moved to Friday. Your lead can see the new date." |
| **Skip for now** | Task goes back into the list. The AI re-slots it and shows why on return ("You skipped this at 10:42; it's due at 3 PM"). Max 2 skips per task, then the option is replaced by **Need more time** |
| **Next up** line (tap) | Shows the next 3 tasks read-only ("Peek"). It never lets the user reorder. Text: "Your AI orders these by due time, client impact and who's waiting." |
| **Messages card** (tap) | Opens Messages on the right tab |
| **Wins / execution rate** (tap) | Opens My week |
| **All done** | Card is replaced by "You're done for today 🎉" + **Close out my day** |
| **Close out my day** | Short sheet: auto-written summary ("Done 9 · moved 1 · blocked 0 · 6 h 20 m tracked"), one optional box "Anything to add?", and **Submit day**. Becomes the daily report (no separate form). Unfinished tasks roll over automatically |

### 1.3 What the AI does behind it
- Builds the list overnight and reorders it all day. Ordering factors: due time, client impact, people waiting, effort, calendar gaps.
- Preps each card. Watches Time Doctor against the estimate.
- New urgent items slot in. If the current card is replaced, a small note says why: "Moved up: client is waiting, due in 40 min."
- Rollovers at the person's shift end. Writes the close-out summary.

### 1.4 States
| State | What shows |
|---|---|
| Empty (start of day, nothing yet) | "Nothing on your list yet. New work will show up here as it comes in." + **Ask for something** (opens chat) |
| Empty (all done) | "You're done for today 🎉" + **Close out my day** |
| Loading | Grey shapes of the header, focus card and strip. Cached focus card shows within 0.5 s with "Updating…" |
| Error | Focus card area: "Couldn't load your next task. Your work is saved." **Try again** |
| Offline | Banner (0.3). The current focus card and next 3 tasks are cached. **Mark done / I'm blocked / Need more time** queue on the device (clock icon). **Approve & send** changes to **Approve: sends when you're back online**; on reconnect the thread is re-checked, and if a new message arrived, the card returns: "Laura wrote again. Please check before sending." |
| No AI | Banner (0.3). Cards already prepared work as normal. New tasks show as "Not prepared yet" with the raw source (email/Slack text) and manual actions only (Reply myself · Mark done · Blocked). Order falls back to due time |
| Waiting | When the task is waiting on someone: "Waiting on Laura since 1:00 PM. I'll nudge her at 3:00." Buttons: **Nudge now** (draft for approval) · **Move on** |

### 1.5 Permissions
| | Employee | Lead | George |
|---|---|---|---|
| Today shows | Own tasks | Own tasks + team decisions assigned to them | Own tasks + Decisions for George |
| Execution rate card | Own (private) | Own; team rates are in My team | Own; everyone's in Company |
| Can reorder | No | No (can re-date/reassign team tasks in My team) | No (same, company-wide) |

### 1.6 Microcopy
- Buttons: **Approve & send** · **Edit draft** · **Cancel edits** · **Mark done** · **I'm blocked** · **Need more time** · **Skip for now** · **Open prep** · **Join meeting** · **Nudge now** · **Move on** · **Close out my day** · **Submit day**
- Toasts: "Sent to {name}. Undo" · "Done. Nice work. Undo" · "Moved to {day}. Your lead can see the new date." · "Saved on this device. It'll sync when you're back online." · "Day submitted. See you tomorrow."
- Draft panel label: "Draft reply (sends from your Gmail, same thread)" / "(sends from your Slack, same thread)"
- Blocked reasons: "Waiting on a client · Waiting on a teammate · Missing access · Don't know how · Something else"

### 1.7 Phone vs desktop
- Phone: progress bar at the top. The focus card shows the draft collapsed to 3 lines ("Tap to read all"). The "What I prepared" panel moves under a "What I prepared ›" row. **Approve & send** is full-width with three equal buttons below (Edit · Blocked · More time).
- The strip becomes two thin rows (messages counts; wins). Execution rate moves to My week.
- Chat is a bottom tab, not a side panel. Swipe left on the focus card = Skip for now (with confirm the first time).

![Today – phone](mockups/today-phone.png)

### 1.8 Acceptance criteria
1. Only one task card is ever fully shown. The next 3 show only via Peek, read-only.
2. Approve & send delivers from the employee's own account in the original thread (check the Sent folder and thread headers). Undo within 5 s prevents delivery.
3. Need more time keeps `original_due` unchanged and records the reason.
4. Mark done on a proof-required task can't complete without proof.
5. Rollover at shift end moves every unfinished task to the next working day, with nothing lost and nothing duplicated.
6. Close-out creates the daily report record and the lead sees it in My team.
7. Offline: Mark done made offline syncs once on reconnect. A queued send re-checks the thread and doesn't send if a newer message arrived.
8. With AI paused, a newly arrived email still becomes a task (unprepared) within 5 min.
9. The execution-rate card is not visible to any other employee (test with a second employee account).

---

## 2. Chat and the router

![Chat – router asks a clarifying question](mockups/chat-router.png)

**Purpose.** One box for anything an employee needs. A router decides how to handle each request.

### 2.1 Layout regions and components
| Region | Components |
|---|---|
| **Panel header** | "Ask anything" · sub-line "Your AI routes it: answer, lookup, action or bigger job" · **New chat** · history icon (past chats, searchable) |
| **Conversation** | User bubbles (dark, right) · answer bubbles (light grey, left) · **route note** under each answer in small grey text: route + source + time, e.g. "SOP lookup · Client Onboarding SOP v3, §2 · 4 sec" · **clarifying card** (white card with up to 4 tap options + "Something else…") · **background job chip** (blue tag "Working in background", the request, start time, "will appear in Today when ready") · **approval card** (when an action would go outside the company) |
| **Context chip** (above the input, optional) | "About: Reply to Mesa Ridge Dental ✕" when opened from a task |
| **Input** | Text box "Type or speak a request…" · microphone · attach (file/screenshot) · send |

### 2.2 Router behavior (what the employee sees)
| Route | Trigger example | What happens | Time | Where the result goes |
|---|---|---|---|---|
| Quick answer | "How should I word a late-payment reminder?" | Answer from Grok | ≤ 10 s | In chat |
| SOP lookup | "How many days do clients get to sign?" | Answer **only** from SOP text, with the citation. No match → "I couldn't find this in our SOPs. Want me to ask your lead?" | ≤ 10 s | In chat |
| Data lookup | "What's overdue for me this week?" | Fixed safe queries inside the user's permissions | ≤ 10 s | In chat (table or list) |
| App action | "Move the Saguaro task to Friday" | Does it after a one-line confirm for anything that changes data: "Move 'AR report for Saguaro' to Fri Oct 23? **Yes** · **No**" | ≤ 5 s | In chat + Today |
| Outbound action | "Email Laura the batch list" | Never direct: creates a draft + approval card | ≤ 30 s | Approval card in chat and on Today |
| Real work | "Compare Q3 eligibility rejections across all 6 clients" | Sent to the HBS Grok Bot. Background chip appears | Minutes | **New task in Today** when ready, slotted by priority |
| Decision | "Can we give Desert Bloom a 10% discount?" | Sent to the right approver (lead or George) with context | — | Approver's Today. Asker sees "Waiting on Omar" |
| Unsure | "Get the denial numbers for Saguaro and send them" | **Clarifying card** with tap options | instant | In chat |
| Not allowed | "Show me Sana's messages" | "That's outside what you can see. Want me to ask your lead?" | instant | In chat |

**Clarifying rules.**
- At most **2** clarifying turns. After that: "I'm not sure I've got this right. Want me to make it a task for a person?" with **Yes, make a task** · **Let me rephrase**.
- Options are written as outcomes with time and approval stated, e.g. "Draft an email to the office manager with the numbers (you approve before it sends)".
- Ask whenever the target is outbound and unclear, or two clients/people match.

### 2.3 Interactions and results
| Action | Result |
|---|---|
| Send a message | User bubble appears instantly (saved first). A typing indicator shows the route as it's chosen: "Looking in SOPs…", "Checking your tasks…", "Sending to your AI for a bigger job…" |
| Tap a clarifying option | Option highlights; the card collapses to "You chose: {option}"; routing continues |
| **Something else…** | Input gets focus with the hint "Tell me a bit more" |
| **Insert into draft** (on any answer, when a task is in context) | Adds the text to the task's draft. Toast "Added to the draft. Undo" |
| **Make this a task** (on any answer) | Creates a task for the user, due "Today" by default (editable) |
| 👍 / 👎 on an answer | 👎 asks "What was wrong?" (Wrong · Not useful · Too slow · Something else). It's logged, and repeat issues feed Request or Report |
| Approval card **Approve & send** / **Edit** / **Cancel** | Same as the Today approval card |
| Background chip (tap) | Shows status (Queued · Working · Ready · Failed) and **Cancel job** |
| History | List of past chats by day, searchable. Background results link to their task |

### 2.4 States
| State | What shows |
|---|---|
| Empty | Three example prompts as tap chips: "What's overdue for me?" · "How do we handle a missing deposit?" · "Draft a follow-up to …" |
| Loading | User message shown. Answer placeholder with the route hint |
| Error | "I couldn't finish that. Your message is saved." **Try again** · **Make this a task** |
| Offline | Input still works. Messages are saved on the device with a clock icon: "I'll send this when you're back online." No answers |
| No AI | "AI is paused. I've saved your request." Options: **Search SOPs** (plain keyword search) · **Make this a task** · **Send to my lead** (if urgent). Data lookups via fixed buttons still work ("My overdue tasks", "My tasks today") |
| Over budget | Same as No AI, with the small note "Daily AI limit reached; back tomorrow or ask your lead." |
| Background job failed | The chip turns red: "That job didn't finish. I've made it a task for a person." The task goes to the user, and to Needs attention for Aqib if it's a system error |

### 2.5 Permissions
- Everyone gets the same routes. **Data lookups return only rows the user may see** (employee: own; lead: department; George: all).
- Decision routing: employees → lead; leads → George; George → decides inline.
- George's chat can also do "company" lookups ("on-time by department this week").

### 2.6 Microcopy
- Header: "Ask anything" · "Your AI routes it: answer, lookup, action or bigger job"
- Input: "Type or speak a request…"
- Clarify title: "Quick check so I do the right thing:"
- Route notes: "Quick answer · {sec} sec" · "SOP lookup · {doc}, {section}" · "From your tasks" · "Sent to your AI · will appear in Today" · "Sent to {name} for a decision"
- Not allowed: "That's outside what you can see. Want me to ask your lead?"
- Buttons: **Insert into draft** · **Make this a task** · **Yes, make a task** · **Let me rephrase** · **Cancel job** · **Search SOPs** · **Send to my lead**

### 2.7 Phone vs desktop
- Phone: Chat is a full-screen tab. Clarifying options are full-width stacked buttons. Hold the microphone to talk (voice-to-text). Background chips show as a thin row at the top: "1 job working".
- Desktop: side panel on Today and Task detail, full page under the Chat tab.

### 2.8 Acceptance criteria
1. Every message gets a route note naming the route (and source for SOP answers).
2. An SOP answer never states something not in the cited SOP (test with 10 questions that have no SOP match → each says it couldn't find it).
3. No outbound message is ever sent from chat without an approval card being approved (test: "email the client now").
4. A data lookup by an employee never returns another employee's tasks (test with a crafted request).
5. Ambiguous requests get a clarifying card. After 2 unclear turns, the "make it a task" offer appears.
6. A request expected to take > 30 s becomes a background job, and its result appears as a task in Today.
7. With AI paused, the request is saved and the three fallback buttons work.
8. Every request, route, cost and time is logged (check the log for 20 test requests).

---

## 3. Task detail

![Task detail – desktop](mockups/task-detail.png)

**Purpose.** Everything about one task in one place. Open it from the focus card ("Details"), from Peek, a lead's queue, chat, or a notification.

### 3.1 Layout regions and components
| Region | Components |
|---|---|
| **Back link** | "← Back to Today" (or to wherever it was opened from) |
| **Main card** | Tags (status, type, due) · title · meta line (owner · source with link · "Created by AI from {who}'s message, {when}") · **Definition of done** · **Steps** (from the SOP, with ✓ done / ● current / ○ to do, and inline waiting tags) · **Prepared by AI** (drafts, files, checks; what was sent and when) · action row |
| **History card** | Time-stamped list of every step by a person, the AI or a workflow (newest last). AI steps are labeled "AI" |
| **Right column** | **Dates** (original due · current due · estimate · Time Doctor time so far, with a bar; amber when over 80% of the estimate, red when over 150%) · **Waiting on** (who, what, since, next nudge) · **Related** (linked tasks, client record) · **Comments** (thread with @mentions; comment box) |

### 3.2 Interactions and results
| Action | Result |
|---|---|
| **Mark unblocked** (when blocked) | Status back to *Open*; the task returns to Today at its priority. Toast "Unblocked. It's back in your list." |
| **Open draft** | Opens the draft in an editor (same as Edit draft on Today) |
| **Need more time** | Same as Today 1.2 |
| **Ask AI about this task** | Opens chat with the task as context ("About: …") |
| **Done…** | Asks for proof if required, then completes. Returns to Today |
| Tap a step | Opens the SOP section for that step in a side sheet. **Mark step done** (if it's a human step) |
| Comment with @name | Mentioned person gets it on their Today as a low-priority item ("Omar mentioned you on …") unless they're the lead/owner |
| Source link | Opens the original email/Slack/meeting notes (only if the viewer may see it) |
| **Reassign** (lead/George only) | Pick a person in the department; the reason is required; the new owner is notified with context. History records it |
| **Change due date** (lead/George) | Same as Need more time, but on behalf of the owner; the owner is notified |
| **Drop task** (lead/George) | Requires a reason; excluded from on-time only after George's approval (per the data model) |

### 3.3 States
| State | What shows |
|---|---|
| Loading | Placeholder blocks in the same layout |
| Not found / no access | "This task isn't available. It may have been moved or you may not have access." **Back to Today** |
| Error | "Couldn't load this task. Your work is saved." **Try again** |
| Offline | Cached copy, read-only except **Mark done**, **I'm blocked**, comments (queued with a clock icon) |
| No AI | "Prepared by AI" shows what already exists. If nothing was prepared: "Not prepared yet. You can work it manually." The Ask AI button is hidden |
| Done | Green "Done {date} by {name}" banner, proof link, read-only. **Reopen** (owner within 24 h; lead/George any time) |

### 3.4 Permissions
| | Employee | Lead | George |
|---|---|---|---|
| View | Own tasks + tasks they're mentioned on (read-only) | Department tasks | All |
| Edit/complete | Own | Department (complete on behalf, with a note) | All |
| Reassign / change due / drop | No | Department | All (drop approval) |
| Source message body | Own messages | Department tasks show a summary; the full body only if D3 allows | Audited open |

### 3.5 Microcopy
- Labels: "Definition of done" · "Steps (SOP: {name})" · "Prepared by AI" · "History" · "Dates" · "Waiting on" · "Related" · "Comments"
- Buttons: **Mark unblocked** · **Open draft** · **Need more time** · **Ask AI about this task** · **Done…** · **Reassign** · **Change due date** · **Drop task** · **Reopen**
- Dates: "Original due {date}" · "Current due {date}" · "Estimate {n} min · Time Doctor so far {n} min"

### 3.6 Phone vs desktop
- Phone: single column in this order: tags, title, Waiting on, Done means, Steps, Comments, then "History (n) ›" and "Dates & time ›" collapsed. A sticky bottom bar holds the primary action plus three buttons.

![Task detail – phone](mockups/phone-task.png)

### 3.7 Acceptance criteria
1. Original due date is shown and can't be edited by anyone.
2. Every change appears in History with actor (person/AI/workflow) and time.
3. Reassign requires a reason and notifies the new owner within 1 min.
4. An employee opening another employee's task link sees "not available" (no data leaks in the page source).
5. Time Doctor time updates at least every 15 min while the task is in progress.
6. Steps link to the exact SOP section.

---

## 4. Messages (communications triage)

![Messages – intake triage](mockups/inbox-triage.png)

**Purpose.** Inbox zero across work email and Slack without reading everything. Every message is sorted, and the ones that need the person are already tasks.

### 4.1 Layout regions and components
| Region | Components |
|---|---|
| **Header** | "Messages" · connection status ("Gmail ✓ connected · Slack ✓ connected · last sync 1 min ago"; amber if a connection needs attention) · search |
| **Tabs** (with counts) | **Needs reply** · **Needs decision** · **Handled by AI** · **Filed** · **Held for review** (only shown when count > 0) |
| **List** (left, 420 px) | Rows: source tag (Gmail / Slack channel name / Slack DM / Mention) · due tag · sender (person + organisation) · subject or first line · one-line AI summary ("Asked why collections dropped 8%. Draft ready.") · unread dot |
| **Reading pane** (right) | Header (from, to, time) · subject · original message (quoted, collapsible thread) · **AI triage** (category tag, confidence, "on your Today list as task N") · **Draft reply** (states which account and thread it sends from) · action row |

**Categories.**
- **Needs reply:** a draft is ready. It's also a task on Today.
- **Needs decision:** a summary and options. It's also a task.
- **Handled by AI:** what the AI did. Only for internal or no-risk items, such as answering an internal question from the calendar or SOPs, attaching a receipt to a task, or updating a task. **Never** a reply to an outside person.
- **Filed:** newsletters, notifications, FYIs, labeled in Gmail. Never deleted.
- **Held for review:** the safety screen thinks it may contain patient information, or it's on the never-touch list. These messages **are not sent to the AI**. The owner sees the message and handles it manually. Never-touch items go to the restricted HR queue, never to this tab.

### 4.2 Interactions and results
| Action | Result |
|---|---|
| **Approve & send** | Sends from the owner's account in the original thread. Same undo as Today. The row moves to Filed with a "Replied" tag |
| **Edit** | Inline editor |
| **Reply myself** (when no draft or AI paused) | Empty editor in the reading pane |
| **Not a reply → file** | Moves to Filed. The AI learns ("Got it. I'll file messages like this.") **Undo** |
| **This needed me** (on a Handled-by-AI or Filed row) | Moves it to Needs reply and creates a task. The AI learns from it |
| **Undo** (on a Handled-by-AI row, within 24 h) | Reverts what the AI did where possible (e.g. detaches a file, reopens a task). Shows what can't be undone ("The calendar answer was already seen by Omar") |
| **Open in Gmail / Open in Slack** | Opens the original in a new tab |
| **Mark as private** (on any row) | Removes it from AI processing and hides the summary from leads. Logged |
| **Search** | Searches only messages the user may see |
| Tap a Needs-decision row | Shows the options as buttons (e.g. **Accept** · **Counter** · **Decline** · **Ask {lead}**). Choosing one creates the draft reply |

### 4.3 States
| State | What shows |
|---|---|
| Empty (Needs reply) | "Inbox zero ✓ Nothing needs a reply right now." |
| Loading | List placeholders. Cached list first |
| Error | "Couldn't load messages. Your messages are safe in Gmail and Slack." **Try again** |
| Connection needs you | Amber banner: "Slack needs you to reconnect (it happens every so often). Messages are waiting and nothing is lost." **Reconnect Slack** |
| Offline | Cached list and messages read-only. Approve queues with a re-check on reconnect (see 1.4) |
| No AI | New messages still arrive and are saved. They show in a temporary **Unsorted** tab with no summaries. **Reply myself** and **File** still work. When AI returns, Unsorted is triaged automatically |
| Held for review | Amber note on each row: "Held: may contain patient information. The AI didn't read this." Actions: **Reply myself** · **Release to AI** (only if the user confirms it doesn't contain patient information; logged) · **File** |

### 4.4 Permissions
| | Employee | Lead | George |
|---|---|---|---|
| Messages | Own mailbox + own Slack channels/DMs | Own. Team **counts** in My team ("Sana: 3 replies waiting > 4 h"); no team message text unless D3 allows | Own. Company counts; reading anyone's message is an audited "open" (D3) |
| Never-touch items | Not shown to the AI or to anyone but the owner and the restricted HR queue | — | Restricted HR queue (with Darin/HR) |

### 4.5 Microcopy
- Tabs: "Needs reply" · "Needs decision" · "Handled by AI" · "Filed" · "Held for review" · "Unsorted"
- Buttons: **Approve & send** · **Edit** · **Reply myself** · **Not a reply → file** · **This needed me** · **Undo** · **Open in Gmail** · **Open in Slack** · **Mark as private** · **Release to AI** · **Reconnect Slack**
- Triage line: "{Category} · {reason} · confidence {high/medium} · on your Today list as task {n}"
- Toasts: "Filed. I'll file messages like this. Undo" · "Moved to Needs reply and added to Today."

### 4.6 Phone vs desktop
- Phone: tabs become a horizontal scroll of chips. List full-screen; tapping a row opens the message full-screen with a sticky **Approve & send** bar. Swipe right = file (with undo); swipe left = "This needed me".

### 4.7 Acceptance criteria
1. Every inbound email and Slack message (channels, mentions, connected DMs) is stored once (dedupe test: a DM between two connected users appears once with both participants).
2. Reconciliation shows 0 missing messages across test mailboxes after a forced 1-hour n8n outage.
3. No message to an outside address is ever sent without a person's approval (test 20 outside messages; the AI can only draft).
4. Nothing is deleted from Gmail or Slack by DPCP OS (audit log check).
5. A message containing a test patient pattern (fake DOB + member ID) lands in Held for review and is never sent to xAI (check router/AI logs).
6. Never-touch test messages (e.g. "medical leave") never appear in summaries, chat answers or lead counts.
7. Client-facing drafts contain no mention of AI or bots (automated check on drafts).
8. With AI paused, new messages appear in Unsorted within 5 min.

---

## 5. Meetings

**Purpose.** Meetings arrive prepared and end as action: a recap, a plan, and tasks with owners and dates.

### 5.1 Layout regions and components
| Region | Components |
|---|---|
| **Meetings list** | Sections: **Today** · **Coming up** (7 days) · **Past** (needs confirming first). Row: time (zone tag) · title · type tag (Client / Internal) · prep status (Ready / Preparing / Not needed) · notes status after the meeting (Waiting for notes / Recap ready / Confirmed) |
| **Meeting page – before** | Title, time, attendees, Meet link · **Prep** (agenda, last meeting's open items with owners, relevant numbers, the client's recent messages, open promises) · **Join meeting** (active 5 min before) |
| **Meeting page – after** | **Recap** (5–8 bullets) · **Action items** table: item · owner · due · status (Proposed / Confirmed) · **Client follow-up draft** (client meetings; approval needed) · links to Gemini notes and transcript |

### 5.2 Interactions and results
| Action | Result |
|---|---|
| **Open prep** (from Today) | Opens the meeting page. Prep is a task due 15 min before the meeting |
| **Join meeting** | Opens Google Meet. Shows a reminder if Gemini notes isn't set to on for this meeting: "Turn on 'Take notes with Gemini' so I can do the recap." |
| **Confirm all** (meeting lead) | All proposed action items become tasks for their owners (on their Today by priority). Toast "7 tasks created." |
| Edit an action item (owner/date/text) | Inline; owner picker limited to HBS people |
| **Not an action** | Removes the item (kept in history) |
| Item with unclear owner or date | Shows an amber tag "Needs owner" / "Needs date". Only the meeting lead can confirm it, and **Confirm all** stays disabled until each one is set or removed |
| **Approve & send follow-up** (client meetings) | Sends from the organiser's account (coaching: per the coaching send rules) |
| **Add notes myself** (no Gemini notes) | Text box: "Add 3 bullets of what was decided." The AI turns them into items |

### 5.3 States
| State | What shows |
|---|---|
| Empty | "No meetings today." |
| Preparing | "Preparing your notes for 1:00 PM… usually ready an hour before." |
| Waiting for notes | "Waiting for Gemini notes. Usually 10–30 min after the meeting." After 2 h: the lead gets a task "Add notes or skip". |
| No notes recorded | "No notes were recorded." **Add notes myself** · **Skip, no actions** |
| Error | "Couldn't load this meeting. Your notes are safe in Drive." **Try again** |
| Offline | Cached prep readable; confirmations queue |
| No AI | Prep shows the raw facts only (attendees, last items, links). Notes are saved; the recap and items appear when AI returns. **Add notes myself** creates tasks manually (owner + date required) |

### 5.4 Permissions
- Attendees see the meeting page. Only the **meeting lead** (organiser, or the lead set in the event) confirms items.
- Leads see department meetings. George sees all.
- Transcripts follow Drive sharing; the app never widens it.
- Client meeting transcripts that may contain patient information follow the D1 rule (held from AI until BAAs).

### 5.5 Microcopy
- Buttons: **Open prep** · **Join meeting** · **Confirm all** · **Not an action** · **Add notes myself** · **Skip, no actions** · **Approve & send follow-up**
- Tags: "Needs owner" · "Needs date" · "Proposed" · "Confirmed"
- Reminder: "Turn on 'Take notes with Gemini' so I can do the recap."

### 5.6 Phone vs desktop
- Phone: the list is grouped by day. The meeting page is a single column; the action items are cards with owner/date chips; **Confirm all** is a sticky bottom button.

### 5.7 Acceptance criteria
1. A prep task appears on Today for every meeting the user attends that has prep (default: client meetings and recurring internal meetings).
2. Gemini notes in Drive are picked up within 30 min of appearing.
3. No task is created from a meeting without an owner and a due date.
4. Unclear items go to the meeting lead only.
5. Client follow-ups always need approval and contain no AI mention.
6. Internal meeting items show up on owners' Today lists and count in on-time.

---

## 6. Must-acknowledge pop-ups

![Must-acknowledge pop-up](mockups/ack-popup.png)

**Purpose.** Make sure essential information is actually read, with proof of who read it.

### 6.1 Layout regions and components
| Region | Components |
|---|---|
| **Overlay** | Page behind is dimmed and blurred; it can't be clicked |
| **Card** (560 px) | Tag "Must acknowledge" · sender + time tag · title (≤ 80 chars) · body (≤ 120 words; longer text goes to "Read the full policy ›") · **What changes for you** box · buttons **Acknowledged** (primary) and **I have a question** · small text "Required before your next task" |
| **Sender's compose screen** (George, HR, leads) | Audience picker (company / department / named people) · title · body · "What changes for you" · optional attachment/link · **Due by** (date) · preview · **Send notice** |
| **Status page for the sender** | Counts (Acknowledged / Has a question / Seen, not acknowledged / Not seen) · list of people with status and time · questions thread · **Remind now** |

### 6.2 Interactions and results
| Action | Result |
|---|---|
| **Acknowledged** | Records the person, time and the version of the text. Pop-up closes. Toast "Thanks. Noted." |
| **I have a question** | Opens chat with the notice as context and a question box. The question goes to the sender (or HR for policy notices). The notice stays "Has a question" until the sender answers. Then the person is asked to acknowledge again. They can keep working meanwhile (the pop-up returns at the next login) |
| Multiple notices | Shown one after another, oldest first, with "1 of 3" |
| Sender **Send notice** | Confirmation: "Send to 28 people? They'll see it before their next task." **Send** · **Back** |
| Sender edits a sent notice | Creates a new version. Everyone who acknowledged the old one is asked again; the status resets |
| **Remind now** | Sends an in-app reminder + phone push to those not acknowledged |
| Automatic follow-up | If unacknowledged: reminder at next login → Slack DM from the system after 1 working day → their lead after 2 working days |

### 6.3 States
- **Loading:** the pop-up waits until the text has loaded; no blank card.
- **Error on Acknowledged:** "Couldn't save that. Please try again." The pop-up stays.
- **Offline:** the notice still shows if cached. **Acknowledged** is queued and the pop-up closes with "Saved on this device".
- **No AI:** no change (notices don't need AI). Questions route straight to the sender.
- **Sender view, empty:** "No notices sent yet." **New notice**

### 6.4 Permissions
| | Employee | Lead | George / HR |
|---|---|---|---|
| Receive | Yes | Yes | Yes |
| Send | No | To own department | George: company-wide. HR: company-wide with George's OK (Q15) |
| See status | Own | Own department | All |

### 6.5 Microcopy
- Buttons: **Acknowledged** · **I have a question** · **Send notice** · **Remind now** · **New notice**
- Footer: "Required before your next task"
- Toasts: "Thanks. Noted." · "Your question went to {sender}. You can keep working."
- Slack follow-up (system DM): "Hi {first name}, there's an important notice waiting for you in DPCP OS: '{title}'. It takes about a minute."

### 6.6 Phone vs desktop
- Phone: full-screen sheet; buttons stacked full-width at the bottom; push notification "Important notice from {sender}". Leads/George see status as a list with filter chips.

### 6.7 Acceptance criteria
1. A user can't open their next task until each notice is acknowledged or questioned.
2. Every acknowledgement stores the person, time and text version.
3. Editing a sent notice forces re-acknowledgement.
4. The follow-up ladder fires at login → 1 working day → 2 working days (in each person's own working days).
5. Status counts match the per-person list exactly.

---

## 7. Leads view (My team)

![Leads view](mockups/leads-view.png)

**Purpose.** A department lead runs the team from one screen and steps in only where needed.

### 7.1 Layout regions and components
| Region | Components |
|---|---|
| **Summary cards** (4) | Team progress today (done/planned + bar) · On-time this week (vs goal) · **Needs you** (count + tags: blocked / behind / decisions) · Handled by AI today (count; "view log") |
| **Team queue table** | Person (avatar + name) · Today (bar + "4 of 9") · Working on now · Status (On track / Behind ~1 h / Blocked 1 h 20 m / Time off) · On-time (week) · action (Open / Step in / Reassign / Coverage) |
| **Detail card** (under the table, for the selected row) | Why they're blocked or behind (AI explanation with facts and times) · AI suggestion · actions |
| **Department panels** (below; per department, from Appendix A and design doc §14) | e.g. RCM: AR aging and posting backlog; Coaching: recap timeliness; Procurement: shipment board; New Locations: site pipeline; Staffing: open roles. Built from the shared **pipeline board** and **compliance grid** components |
| **Daily reports** | Each person's close-out for today, with the AI's team summary at the top |

### 7.2 Interactions and results
| Action | Result |
|---|---|
| **Step in** | Opens the person's current task with lead actions: complete on their behalf (note required), message them, unblock (e.g. call the client), reassign |
| **Reassign** | Pick a teammate. The AI shows each candidate's load ("Faisal: 2 h free today"). Reason required; both people are notified |
| **Move to tomorrow** (suggestion) | Changes the current due date (original kept); the owner is notified |
| **Message {name}** | Opens a Slack DM draft from the lead (internal, sends on the lead's click) |
| Approve a team decision | Same decision card as Today |
| **Coverage** (time-off row) | Shows which tasks were rerouted to whom |
| Tap a summary card | Filters the table (e.g. "Needs you" shows only blocked/behind/decision rows) |
| **View log** | Opens the AI activity log for the department (filterable) |

### 7.3 States
| State | What shows |
|---|---|
| Everyone on track | "Nothing needs you right now." The table still shows |
| Loading | Placeholder cards and rows |
| Error | "Couldn't load your team. Your team's work is saved." **Try again** |
| Offline | Cached snapshot with "As of {time}". Actions queue except reassign (which needs a live check of the other person's load) |
| No AI | Live data from the database still shows. Explanations and suggestions are hidden, and statuses are calculated by plain rules (due time, blocked flag, Time Doctor over estimate) |

### 7.4 Permissions
- **Lead:** own department only. On-time rate per person is visible (Q3 default). Message bodies are not visible (D3).
- **George:** can open any department's view from Company.
- **Employees:** no access.

### 7.5 Microcopy
- Statuses: "On track" · "Behind ~{n} h" · "Blocked {time}" · "Time off" · "Not started"
- Buttons: **Step in** · **Reassign** · **Move to tomorrow** · **Message {name}** · **Coverage** · **View log**
- Empty: "Nothing needs you right now."
- Suggestion style: "Suggestion: {action} ({reason})."

### 7.6 Phone vs desktop
- Phone (**Team** tab): "Needs you" list first (cards with one action each), then the team list as compact rows (name, bar, status). Department panels are behind "More for your team ›".

### 7.7 Acceptance criteria
1. A lead sees only their own department's people (test with two leads).
2. "Blocked" appears within 5 min of an employee marking blocked.
3. "Behind" is flagged when the planned finish passes shift end, or a task exceeds 150% of its estimate.
4. Reassign moves the task, keeps history and notifies both people.
5. The AI suggestion always states its reason.

---

## 8. George view (Company · Decisions · System)

![George company view](mockups/george-view.png)

**Purpose.** George sees the whole company without asking anyone, decides in one place, and knows the system is healthy.

### 8.1 Layout regions and components
| Tab | Regions |
|---|---|
| **Company** | Five summary cards (on-time this week vs 80% target and trend · Decisions for you · Overdue · stuck · AI saved this week · System status) · **Department table** (department, lead, on-time week, overdue, blocked, today bar; click → that department's lead view) · right column: **Decisions waiting for you** (top 4) · **Notices** status · **AI spend** this month vs budget |
| **Decisions** | Queue sorted by urgency: today / this week / later. Card: what, who's asking, context summary, options, amount (if money), deadline. Filters: Money · Legal/signature · Policy · Hiring · Escalation |
| **System** | Status of each part (app, email intake, Slack intake, triage backlog age, n8n, xAI, Grok Bot, Time Doctor) with last good run · **Needs attention** list (failed items after retries; owner Aqib/Architect) · uptime this week vs target · **AI pause** switch · releases waiting (approve big user-facing ones, Q1) · backups (last good backup, last tested restore) · costs breakdown · Request or Report pipeline (open / building / shipped) |

### 8.2 Interactions and results
| Action | Result |
|---|---|
| Click a department row | Opens that department's lead view, read/write as George |
| Click a person | Opens their Today read-only + their task list |
| Decision **Approve / Choose option / Decline / Ask a question** | Records the decision and notifies the asker; any follow-up draft goes through the normal approval. Money decisions show the amount and payee and need a second tap: "Approve $2,400 to {payee}?" |
| **Pause AI** | Confirm: "Pause AI for everyone? People can keep working manually." Shows the banner company-wide within 1 min. **Resume AI** reverses it |
| **Approve release** | Shows a plain summary of what changes for users + "Rollback is one step". Aqib/Architect have already approved |
| **Remind now** (notices) | As in chapter 6 |
| Needs-attention item | Shows what failed, retries, who owns it; **Reassign owner** |
| Spend card | Breakdown by area (chat, triage, bot jobs, Time Doctor) and by department; **Set budget** |

### 8.3 States
| State | What shows |
|---|---|
| Loading | Placeholder cards; cached numbers first with "As of {time}" |
| Error (one card) | That card only: "Couldn't load. Try again". Other cards keep working |
| Offline | Cached snapshot; decisions can't be approved offline ("Decisions need a connection so nothing is approved twice") |
| No AI | Numbers still show (database). AI summaries on decision cards are replaced by the raw request + links. The System tab shows why AI is paused and since when |
| All clear | Decisions: "No decisions waiting. 🎉" · Needs attention: "Nothing needs attention." |

### 8.4 Permissions
George only (admin role). Message bodies open only through an audited "Open message" (D3). The CFO/personal finance views are **not** in DPCP OS.

### 8.5 Microcopy
- Tabs: "Company" · "Decisions" · "System"
- Buttons: **Approve** · **Decline** · **Ask a question** · **Pause AI** · **Resume AI** · **Approve release** · **Set budget** · **Remind now** · **Reassign owner** · **Open message**
- Pause confirm: "Pause AI for everyone? People can keep working manually."
- Weekly brief title: "Your week at HBS: {date range}"

### 8.6 Phone vs desktop
- Phone: Decisions first (it's the main phone job: approve on the go), then the summary cards in a 2-column grid, then a department list. System shows only status + Needs attention + Pause AI.

### 8.7 Acceptance criteria
1. Every number on Company matches a database query (tester recomputes 5 numbers).
2. Money approvals require the second confirm and record amount, payee and time.
3. Pause AI shows the banner to all users within 1 min, and resume clears it.
4. Needs attention lists every item that failed after retries (inject 3 failures; all appear).
5. Weekly uptime vs target is shown and matches the monitoring tool.
6. No non-George account can open any George tab (direct-URL test).

---

## 9. Request or Report

![Request or Report form](mockups/request-report.png)

**Purpose.** Anyone can ask for an improvement or report a problem in one tap, from anywhere, and hear back when it's fixed.

### 9.1 Layout regions and components
| Region | Components |
|---|---|
| **Pill** | "⚑ Request or Report", bottom-right on every screen |
| **Side sheet** (470 px) | Title + one-line explanation · type toggle **🐞 Something's wrong** / **💡 I have an idea** · "What happened?" / "What would help?" box · impact chips (A little · I can work around it · I'm stuck) · **Attached automatically** (screenshot with remove link, screen + task, time, app version) · duplicate notice (blue) when it matches an open ticket · **Send** |
| **My requests** (in avatar menu) | List: title · status (Received · Grouped with others · Planned · Building · Shipped · Won't do) · last update |
| **Admin queue** (George/Architect) | Grouped tickets with count of people, impact, AI-proposed priority, linked GitHub issue |

### 9.2 Interactions and results
| Action | Result |
|---|---|
| Open the pill | The sheet slides in. The screenshot is taken *before* the sheet opens (so it shows the problem) |
| **Send** | Saved. Toast "Thanks! We'll let you know when it's fixed." The AI dedupes: it joins a matching ticket or creates a new one, then creates or links a GitHub issue |
| Remove screenshot | Removes it before sending (privacy) |
| "I'm stuck" impact | Also creates an urgent Needs-attention item for Aqib, and the user gets a workaround suggestion in chat if one exists |
| Status change | The user is notified on Today (small, low-priority): "You asked for '{title}'. It's live now." · "Won't do" includes the reason |

### 9.3 States
- **Offline:** the form works; it sends on reconnect ("Saved. It'll send when you're back online.").
- **No AI:** sends without dedupe or summarising; the Architect Bot dedupes later.
- **Error:** "Couldn't send. Your note is saved." **Try again**.
- **My requests empty:** "You haven't sent any requests yet."

### 9.4 Permissions
- Everyone can send and see their own requests.
- Leads see their department's requests.
- George and the Architect Bot see all of them and set priority (Q17: George approves the top 5 weekly).
- Screenshots are visible only to the sender, George and the build team. The PHI screen runs on the text, and screenshots get a warning: "Make sure no patient information is on screen."

### 9.5 Microcopy
- Title: "Request or Report"
- Explanation: "Tell us what's wrong or what would help. It goes straight to the team that builds DPCP OS."
- Toggle: "🐞 Something's wrong" · "💡 I have an idea"
- Impact: "A little" · "I can work around it" · "I'm stuck"
- Duplicate: "{n} people reported something similar this week. We'll add yours to that ticket and tell you when it's fixed."
- Footer: "You'll get a note in Today when it ships."

### 9.6 Phone vs desktop
- Phone: the pill lives in **More** and as a "shake to report" option (off by default). The sheet is full-screen.

### 9.7 Acceptance criteria
1. Sending takes ≤ 3 taps after opening (type, text, Send).
2. The screenshot shows the screen as it was before the sheet opened.
3. Duplicates are grouped (5 near-identical test reports → 1 ticket, count 5).
4. Each ticket links to a GitHub issue.
5. Shipping the fix notifies every reporter.

---

## 10. Onboarding (first week, owned by HR)

![Onboarding day 1](mockups/onboarding-day1.png)

**Purpose.** A new hire is productive in week one without someone sitting beside them. HR (People & Staffing) owns the content.

### 10.1 Layout regions and components
| Region | Components |
|---|---|
| **Header** | "Welcome to HBS, {first name} 👋" · "Day {n} of your first week · {done} of {total} steps done · about {h} hours today" |
| **Step card** (same frame as the focus card) | "Step 3 of 7" tag + estimate · title · short explanation · the practice or real task · actions |
| **Path panel** (right) | Day's steps with ✓ / ● / ○ · progress bar · "See the whole week ›" |
| **Your people** | Lead · buddy · HR contact (tap → message) |
| **HR builder** (HR only) | Paths by role (employee, biller, clinical, dentist) · steps (types: read, acknowledge, sign, practice task, real task, meeting, quiz, lead sign-off) · reorder · preview as new hire · progress of all new hires |

**Standard week (from People & Staffing's outline):**
- **Day 1:** sign in and set up the phone; acknowledge the work Slack & email policy; meet your Today screen (practice task); sign the confidentiality agreement; meet your lead; core values; a short quiz.
- **Days 2–3:** role SOPs built into the first real tasks.
- **Days 4–5:** supervised tasks, an AI tools check, PTO and conduct policy acknowledgements, and an end-of-week review with the lead.

### 10.2 Interactions and results
| Action | Result |
|---|---|
| **Approve & send (practice)** | Sends only to the buddy (internal). Toast "That's how it works! Real ones go to the person in the thread." Next step appears |
| **Sign** step | Opens the e-signature flow (Google Workspace eSignature or the agreed tool, [VERIFY]). Done when signed |
| **Quiz** | 3 questions; a wrong answer shows the right one with the SOP link; passing = 2/3 |
| **Lead sign-off** | Creates a task for the lead: "Sign off Jamie's day 3 checkpoint". The step stays ● until signed |
| **I have a question** | Opens chat with the step as context; HR or the buddy gets it if the AI can't answer |
| HR **Preview as new hire** | Walks the path without recording |

### 10.3 States
- **Empty (HR builder):** "No paths yet." **Create a path from template**
- **Loading / error:** standard
- **Offline:** read steps are cached; sign/quiz need a connection ("This step needs a connection.")
- **No AI:** all steps work (they're pre-written). Chat falls back to SOP search
- **Behind on the path:** after 1 working day behind, HR and the lead get a low-priority task

### 10.4 Permissions
- **New hire:** own path.
- **Lead:** their new hires' progress + sign-offs.
- **HR:** all paths, builder, all progress.
- **George:** all, read + edit.

### 10.5 Microcopy
- Buttons: **Approve & send (practice)** · **Edit first** · **I have a question** · **Sign now** · **Start quiz** · **Preview as new hire** · **Create a path from template**
- Practice note: "Try it: this practice task is safe. Nothing goes to a client."

### 10.6 Phone vs desktop
- Phone: path panel collapses to a progress row at the top ("Day 1 · 3 of 7 ›"). The step card is full width. Signing works on the phone.

### 10.7 Acceptance criteria
1. Practice tasks can never send outside the company.
2. A new hire can't see real client work until the day-1 acknowledgements and the agreement are complete.
3. HR sees each new hire's progress live.
4. Lead sign-off steps block the next day's checkpoint until signed.

---

## 11. Settings and time off

![Time off and backup](mockups/time-off.png)

**Purpose.** Each person sets how their day works and when they're out. The AI then makes sure nothing urgent waits for them.

### 11.1 Layout regions and components
| Section (left menu) | Contents |
|---|---|
| **Profile** | Name, photo, role, department, lead (read-only; HR changes them) |
| **Working hours** | Time zone · working days · shift start/end (sets "today", rollovers and close-out) |
| **Time off & backup** | **New time off** (dates, type PTO/Sick/Holiday, approver shown) · **My backups** (1st and 2nd, set by the lead) · **Preview** table: each task in the dates with its plan (Urgent → backup with context / Holding reply drafted / Waits for you) · holding-reply draft preview · **Request time off** · upcoming and past time off |
| **Notifications** | In-app (always) · phone push (on/off by type) · Slack DM backup (on/off) · quiet hours |
| **Connected accounts** | Gmail (connected via company setup; shows status) · Slack (**Connect Slack** / connected / reconnect) · Time Doctor (status) |
| **My goal** | Personal on-time goal (default 85%; can be raised, not lowered below the company default) |

### 11.2 Interactions and results
| Action | Result |
|---|---|
| **Request time off** | Goes to the approver (lead) as a decision. While pending, the preview shows "pending". When approved, the plan is locked in. Toast "Sent to Omar for approval." |
| Sick (same day) | No approval needed to record it. The lead is notified; urgent tasks reroute right away |
| During time off | Urgent tasks go to the 1st backup (or the 2nd if the 1st is also out) with context. Client messages get a **holding reply drafted for the backup to approve**. Non-urgent tasks wait |
| Return | First thing on Today: a **Catch-up brief** card (what happened, what was covered and by whom, what's waiting), then normal tasks |
| **Connect Slack** | Slack's own permission page opens (one time). Back in the app: "Slack connected. Your DMs now come into Messages." |
| Change working hours | Takes effect from the next day; the lead is notified |

### 11.3 States
- **No backup set:** red note "You don't have a backup yet. Your lead needs to set one before you can request time off." The lead gets a task.
- **Backup also out:** "Faisal is also out those days. Sana will cover."
- **Offline:** settings read-only; time-off request queues.
- **No AI:** a request still works. The preview shows "Plan will be prepared when AI is back", and the lead plans coverage manually.
- **Error:** standard.

### 11.4 Permissions
| | Employee | Lead | George / HR |
|---|---|---|---|
| Own settings | Edit (except profile fields) | Same | Same |
| Backups | View | Set for the team | Set for anyone |
| Approve time off | — | Team | All |
| See others' time off | Own team "out today" only (no reason/type shown) | Team with type | All with type |

Sick/health detail is never shown beyond "Out" to coworkers (never-touch rule).

### 11.5 Microcopy
- Page lead: "Tell us when you're out. Your AI makes sure nothing urgent waits for you."
- Plans: "Urgent → {backup}" · "Holding reply drafted" · "Waits for you"
- Holding reply template: "Hi, thanks for your message. {Name} is out until {day, date}. {Backup} is helping in the meantime and will follow up {today/tomorrow}."
- Buttons: **Request time off** · **Cancel** · **Connect Slack** · **Reconnect Slack** · **Save**

### 11.6 Phone vs desktop
- Phone: the left menu becomes a list; each section is its own screen. The time-off preview is a card list.

### 11.7 Acceptance criteria
1. Time off can't be requested without a backup on file.
2. During time off, a task marked urgent reaches the backup within 15 min with full context.
3. Holding replies to clients are never sent without the backup's approval.
4. The catch-up brief appears on the first return day.
5. Coworkers never see the type of absence.

---

## 12. Mobile layouts (phone app)

**Purpose.** Everything an employee needs during the day works on the phone from day one. It installs from the browser, with no app stores.

### 12.1 Layout regions and components
| Region | Components |
|---|---|
| **Install** | First visit on a phone: "Add DPCP OS to your home screen" card with 3 picture steps (iPhone / Android) |
| **Top** | Screen title · time · status banner slot |
| **Content** | One column; cards full width with 16 px margins |
| **Sticky action bar** | Primary action full width; up to 3 secondary buttons beneath |
| **Bottom tabs** | Today · Messages · Chat · Meetings (or Team for leads) · More (My week, Settings, Request or Report, Help) |

### 12.2 Phone-specific interactions
| Gesture / feature | Result |
|---|---|
| Swipe left on the focus card | Skip for now (asks once to confirm the first time) |
| Swipe right on a message row | File (with undo) |
| Pull down | Refresh |
| Hold microphone (Chat) | Voice to text |
| Push notification tap | Opens the exact item (notice, urgent task, approval) |
| Rotate | Same layout (portrait design; landscape gets more width) |

### 12.3 States
Same as 0.3. **Offline is more common on phones**, so Today keeps the current card + next 3, the last 50 messages and the meeting prep for the day on the device. Data on the device is wiped at sign-out and after 14 days without use.

### 12.4 Permissions
Same as desktop. George's phone Decisions screen requires a fresh sign-in (Face ID / fingerprint through the browser's passkey) for money approvals [VERIFY passkey support in the installed web app].

### 12.5 Microcopy
- Install: "Add DPCP OS to your home screen. It works like an app."
- Offline: "You're offline. Keep going; we'll sync when you're back."

### 12.6 Acceptance criteria
1. Installs and opens full-screen on current iPhone (Safari) and Android (Chrome).
2. Every screen in this doc is usable at 375 px wide with no sideways scrolling.
3. Tap targets ≥ 44 px.
4. Push arrives for notices and urgent tasks only.
5. Offline actions sync exactly once.
6. Device data is wiped at sign-out.

---

# Appendix A. A day in the life, by department

Each walkthrough is one realistic workday as it would run in DPCP OS after launch. Staff names are the real leads and roles from the department needs specs. **Client, practice and vendor names are made up.** "✋ Approval" marks every point where a person must approve before anything leaves the company or money moves. Times are each person's local time unless marked AZ.

## A1. Operations: Zaid (Operations Manager), Thursday

**Overnight, the AI:**
- pulled yesterday's close-outs and Time Doctor totals for all 28 people;
- recomputed on-time % (company 83%; 3 people under 80%);
- turned Wednesday's "George / Zaid / Dalisu" meeting notes into 11 proposed action items;
- pre-filled Friday's 7-pillar report with evidence links;
- checked #automation-team for this week's technical briefs (one missing);
- reconciled James Clinic's bank feed (2 unmatched payments).

| Time | Zaid does | The AI does |
|---|---|---|
| 8:00 | Opens Today. First card: "Confirm 11 action items from Wednesday's meeting with George." Fixes one owner, taps **Confirm all** | Creates 11 tasks on owners' Today lists; 2 had no date → Zaid set them |
| 8:20 | Card: "3 people under 80% this week." Reads the facts per person (overdue items, blocked time) | Drafted a short check-in message for each (internal; Zaid sends with one click) |
| 8:40 | Card: "Technical brief missing from Zain." Taps **Nudge now** | Sends Zain an internal Slack reminder from Zaid's account (internal; Zaid's click is the approval) |
| 9:00 | Daily meeting (Meet, Gemini notes on). Prep card had the open items | — |
| 9:45 | Confirms the meeting's 6 items | Tasks created; 1 unclear owner went to Zaid as meeting lead |
| 10:30 | Card: "James Clinic: 2 unmatched payments." Opens the exceptions; assigns one to Sameed | Matched 41 of 43 overnight; drafted the EOD summary |
| 11:00 | ✋ Approval: "Send James Clinic EOD report to the client." Edits one line, **Approve & send** | Sends from Zaid's Gmail in the usual thread |
| 1:00 | Card: "Signature needed: vendor agreement (Procurement)." Posts it for George | Routes to George's Decisions with the summary |
| 3:00 | Card: "Review pre-filled 7-pillar report (due Fri)." Adds judgment on 2 pillars, marks done | Formats; queues for Friday |
| 4:30 | **Close out my day** (adds one line) | Writes Zaid's daily report; updates the George weekly brief |

**Approvals today:** client EOD report (Zaid); signature (George). Everything internal went on Zaid's own click.
**What's different:** no hunting through Slack and sheets for status. The execution-rate report, pillar evidence and brief compliance arrive done.

## A2. Coaching and Client Success: George (coach) and Don (QA), Tuesday with two client calls

**Overnight, the AI:**
- built prep docs for today's 10:00 call (Dr. Rivera, Sunridge Dental) and 2:00 call (Dr. Patel, Lakeside Family Dental), using the latest transcripts, all emails since the last call, open items George owes, and team updates;
- auto-sent confirmations on George's approved template (the one standing auto-send exception);
- flagged an unanswered client email from Friday.

| Time | Who | What happens |
|---|---|---|
| 8:30 | Don | Today: "Check prep for Sunridge Dental 10:00." Reads it, adds one note, **Mark done** |
| 9:30 | George | Today: "Open prep: Sunridge Dental." Reads the one-page prep on his phone |
| 10:00 | George | Call on Meet with Gemini notes on (the Join button reminded him) |
| 10:50 | AI | Notes picked up. Drafts the Post-Call Action Plan in George's voice (exact spec), team loop-in drafts, and 4 HBS tasks with owners |
| 11:15 | Don | ✋ Approval (QA): "Action plan: Sunridge Dental." Fixes one date, **Looks right** |
| 11:20 | Don (or Zaid, early phase) | ✋ **Approve & send** from George's HBS Gmail per the coaching send rule |
| 11:30 | AI | Logs the client sheet update; files the transcript; loop-ins become tasks for Ahsam (P&L review) and the web team |
| 12:00 | George | Card: "Reply to Dr. Patel's question about hygiene staffing" (answers a client question). ✋ George approves himself |
| 2:00 | George | Second call. Same loop |
| 3:00 | Kaley | Card: "Review next month's coaching schedule (proposed 18 calls, max 5/day)." Approves |
| 5:00 | AI | Recap timeliness tracker: both recaps sent within 2 h ✓ |

**Approvals:** each action plan (Don QA + send), client replies that answer questions (George).
**What's different:** George's time is the two calls plus the approvals; no prep hunting, no late recaps.

## A3. Insurance and RCM: Sadaqat (lead) and an eligibility specialist, Monday (pre-BAA rules)

**Pre-BAA reality:** patient data stays in the practice systems and payer portals. DPCP OS holds only **work items, counts and status** (e.g. "Desert Bloom: 46 verifications for Tue–Wed, 31 done").

**Overnight, the AI:**
- created each biller's Today from the standing schedule (verification queues by client, posting batches, AR follow-up blocks, appeals due);
- pulled Friday's close-out counts;
- flagged one client whose deposit info is missing;
- drafted Adil's weekly AI-adoption report.

| Time (PKT) | Who | What happens |
|---|---|---|
| 7:00 | Amna (eligibility) | Today card 1: "Verify Desert Bloom Dental, Tue–Wed (46 patients) in the PMS and portals. SOP: Eligibility v4. Done = count + exceptions." She works **inside the PMS/portals**, then enters "46 done, 3 exceptions" |
| 9:30 | Amna | Card: "3 exceptions need calls." Makes the calls (human step), logs outcome codes |
| 10:00 | M. Waqas (claims/appeals) | Card: "Appeals due this week: 4 for Canyon View Smiles." The appeal letter is drafted **outside DPCP OS** in the approved tool once a BAA exists. Pre-BAA he writes it in the PMS/Google Doc per SOP; DPCP OS tracks status and the deadline |
| 11:00 | Zubair (posting) | Card: "Post ERA batch, Mesa Ridge Dental (count 112)." Posts in the PMS; enters totals; 2 mismatches → exceptions list |
| 12:00 | Sadaqat | My team: 1 blocked (missing deposit info, Saguaro). ✋ Approves the AI-drafted request to the practice (counts only, no patient detail), sent from Sadaqat's Gmail |
| 2:00 | Sadaqat | Client call with an office manager (prep attached: AR aging buckets, collections vs production) |
| 3:00 | Adil | ✋ Validates the weekly AI-adoption report and sends it to Sadaqat/George (internal) |
| 4:00 | Sadaqat | ✋ Approves the month-end HBS invoice to a client (built from activity counts) |
| 5:00 | All | Close-outs. The AI writes the team summary for Sadaqat |

**Approvals:** client requests and the invoice (Sadaqat). Appeals are senior-reviewed in the existing tools.
**What's different now vs after a BAA:** after BAAs, the AI fills benefits summaries, matches ERAs and drafts appeals inside DPCP OS; today it only routes and tracks. **Any patient detail typed into DPCP OS is held** (screen 4) and never reaches the AI.

## A4. People and Staffing: Darin (lead) and Hussain (doctor sourcing), Wednesday

**Overnight, the AI:**
- refreshed the HDG hiring tracker (6 open roles; the associate dentist role is at 34 days, flagged);
- screened 12 new hygienist applicants against the JD and ranked them;
- drafted outreach to 20 doctors from the sourcing list;
- noted a new hire (Jamie) starts Monday and her day-1 path isn't assigned yet.

| Time | Who | What happens |
|---|---|---|
| 8:00 | Darin | Card: "Associate dentist role open 34 days: pick next step." Options the AI prepared: widen radius / raise posting budget (✋ George, spend) / add a recruiter. Chooses "widen radius", sends the budget ask to George |
| 8:30 | Hussain | ✋ Card: "Approve 20 doctor outreach emails." Edits 2, **Approve & send** (from his Gmail) |
| 9:00 | AI | Logs to the CRM; schedules reminders |
| 10:00 | Nomi | ✋ Card: "Approve hygienist screening shortlist (top 4)." Approves; invites go out from her account after approval |
| 11:00 | Mishka | Doctor call (prep attached: CV summary, questions). Gemini notes on → recap + next step |
| 1:00 | Darin | Card: "Assign Jamie's first-week path (Biller)." Picks the template, sets the buddy (Faisal) |
| 2:00 | HR queue (Darin + George only) | A message about a medical leave was routed to the restricted HR queue by the never-touch rule; no AI read it. Darin handles it personally |
| 3:00 | Darin | ✋ Card: "Offer letter: hygienist, review before George signs." Checks the template fill, sends to George's Decisions for signature |
| 4:30 | Darin | Close-out |

**Approvals:** outreach (Hussain), shortlist invites (Nomi), offer + spend (George).
**What's different:** the tracker and screening run themselves; HR-sensitive items stay out of AI completely.

## A5. Finance: Ahsam (controller), payroll Friday

**Overnight, the AI:**
- pulled Time Doctor hours for the payroll period and built the period sheet;
- matched 22 of 24 staff invoices to the sheet (2 differ);
- categorized 140 card and bank transactions (6 flagged: 2 possible duplicates, 1 unknown vendor, 3 unused subscriptions);
- noticed a failed payment alert for a software subscription.

| Time | Who | What happens |
|---|---|---|
| 8:00 | Ahsam | Card: "2 invoices don't match hours." Opens both; one is a rounding issue, the other is missing a day. Sends an internal note to the person (his click) |
| 9:00 | Dalisu | ✋ Card: "Approve payroll period (24 people, total shown)." Reviews, **Approve** |
| 9:30 | Ahsam | ✋ Card: "Release payroll." **Payment happens in the bank/PayPal, by Ahsam.** He enters the confirmation. No AI ever releases money |
| 10:30 | Ahsam | Card: "6 flagged transactions." Confirms 4; marks 1 duplicate for refund; the unknown vendor goes to George |
| 11:00 | George | ✋ Decisions: "Unknown $389 charge from 'Cloudly Tools': keep or dispute?" Chooses dispute |
| 1:00 | Ahsam | ✋ Card: "Approve dunning note: Lakeside Family Dental, invoice 31 days late." Edits tone, **Approve & send** |
| 2:00 | Ahsam | Client P&L analysis (draft findings ready); QA's and marks ready for George's next coaching call |
| 4:00 | Ahsam | Close-out; month-end checklist shows 3 of 5 done |

**Approvals:** payroll (Dalisu → Ahsam), unknown charge (George), client dunning (Ahsam). Above the payment threshold (Q23) → George.
**What's different:** reconciliation and matching are pre-done; Ahsam only handles the exceptions and the money movement.

## A6. Marketing: Zain (interim marketer), Monday

**Overnight, the AI:**
- pulled last week's ad and call-tracking data for the 4 ad clients;
- drafted weekly snapshots (calls, cost per call, spend, verdict, 3–5 actions, budget recommendation);
- ran the conversion audit (one account counts page views as conversions);
- flagged one client whose Friday snapshot wasn't sent.

| Time | Who | What happens |
|---|---|---|
| 8:00 | Zain | ✋ Card: "Approve weekly snapshot: Hill Ridge Dental." Adjusts one recommendation, **Approve & send** |
| 8:30 | Zain | ✋ Same for the other 3 clients (≈ 5 min each) |
| 9:30 | Zain | Card: "Conversion setting wrong on Bayview Smiles (page views counted)." Fixes it in Google Ads (human step), marks done with a screenshot |
| 10:00 | Zain | Card: "Reply to Dr. Green's questions about call tracking." ✋ Approves the draft |
| 11:00 | Zain | Card: "Quote for website + social, Coastline Dental." AI supplied the scope inputs; Zain writes the price → ✋ George approves pricing |
| 1:00 | Shama | Card: "Referral sign design: proofs due Wed." Works in her design tools |
| 2:00 | AI | A client emailed a website login in plain text → the credential detector redacted it in DPCP OS and created "Move this login to the vault" for Zain |
| 3:00 | Zain | Campaign optimization: ✋ approves 12 negative keywords and a $200 budget shift (client-approved budget rules) |
| 4:30 | Zain | Close-out |

**Approvals:** each client snapshot and reply (Zain), pricing (George), budget moves (Zain within client-approved limits).
**What's different:** the reports write themselves; Zain spends the day on fixes and client judgment.

## A7. Procurement, Imports and Compliance: Junaid (lead), shipment week

**Overnight, the AI:**
- parsed a new proforma from a fictional supplier (Shenzhen BrightDent) into 38 SKUs;
- diffed it against the previous version (2 price changes, 1 new SKU);
- checked each SKU's FDA registration, listing, product code, clearance and GUDID (3 blanks);
- checked bond status (active) and document completeness for the next container (packing list missing 1 item).

| Time | Who | What happens |
|---|---|---|
| 8:00 | Junaid | Card: "3 SKUs missing FDA data: shipment can't be booked." Reads the compliance sheet the AI filled |
| 8:20 | Junaid | ✋ Approves the AI-drafted document request to the supplier (from his email) |
| 9:00 | Junaid | Must-acknowledge: "Supplier suggested declaring the compressor as 'industrial'." **Acknowledged.** The AI attached the SOP rule (devices never declared industrial) and drafted a refusal |
| 9:10 | Junaid | ✋ Approves the refusal email |
| 10:00 | George | ✋ Decisions: "Remove uncleared SKU X5 motor from this shipment, or hold the shipment?" Chooses remove |
| 11:00 | Zaid | Card: "Collect carton specs for design (Shama)." Done |
| 1:00 | Junaid | Card: "Landed cost: container 4." AI computed duties, freight, insured value; Junaid checks; ✋ George sets bond coverage |
| 3:00 | AI | Two sources show different sail dates (Oct 30 vs Nov 2) → conflict flag task for Junaid; Junaid calls the forwarder (human), enters the correct date |
| 4:30 | Junaid | Close-out |

**Approvals:** all vendor emails (Junaid), SKU removal + bond (George). WhatsApp vendor chats stay outside; Junaid forwards key ones to email (Q30).
**What's different:** compliance checks block booking automatically; there are no surprises at the port.

## A8. HDG New Locations and Construction: Shaldon (lead), Tuesday

**Overnight, the AI:**
- refreshed the site pipeline (2 sites on the 17-step pipeline);
- found the LOI due-diligence deadline for the fictional "Mesa Verde Plaza" site is in 6 days;
- logged 3 new contractor quotes and compared them to the budget and in-house cost;
- noted the equipment ETA slipped 4 days.

| Time | Who | What happens |
|---|---|---|
| 7:30 | Shaldon | Must-acknowledge: "Due diligence ends Mon. Lease draft not started." **Acknowledged.** Card: "Start lease review: AI compared the landlord's draft to the signed LOI (4 differences)." Reviews them |
| 8:30 | Shaldon | ✋ Approves the AI-drafted note to the landlord's agent listing the 4 differences |
| 9:00 | Team | Daily stand-up (Meet). Items confirmed by Shaldon; tasks go to Johannah (floor plan revision), Nosi (2 site visits), Junaid (equipment ETA) |
| 10:00 | Johannah | Card: "Revise blocking diagram: op width 8'4" (design standard)." Works in her tools; the AI checks the revision against the ADA/dental checklist |
| 11:00 | Shaldon | Card: "3 plumbing quotes: 1 over budget by 18%." Picks the barter-fit contractor; ✋ approves the barter offer message ($40/hr credit, labor only) |
| 1:00 | George | ✋ Decisions: "Approve design direction: reception finishes (2 options)." Picks one |
| 2:00 | Nosi | Site visit (human). Uploads photos; the AI logs them to the site |
| 4:00 | Shaldon | Lead view: gate status. Doctor gate (open, Staffing), FDA gate (open, 1 SKU), layout gate (on track) |
| 5:00 | Shaldon | Close-out |

**Approvals:** agent and contractor messages (Shaldon), design direction and any signature/spend (George).
**What's different:** deadlines can't slip silently (the tracker escalates), and procedures live in tasks instead of calls.

---

# Appendix B. Mockup index

All files are in `/workspace/org-design/design/mockups/` (source HTML in `src/`). Fake data only.

| Screen | File | New in v2 |
|---|---|---|
| Today, desktop | today-desktop.png | |
| Today, phone | today-phone.png | |
| Chat with router clarifying question | chat-router.png | |
| Leads view | leads-view.png | |
| Must-acknowledge pop-up | ack-popup.png | |
| Task detail, desktop | task-detail.png | ✓ |
| Task detail, phone | phone-task.png | ✓ |
| Messages / intake triage | inbox-triage.png | ✓ |
| Request or Report form | request-report.png | ✓ |
| George company view | george-view.png | ✓ |
| Time off and backup | time-off.png | ✓ |
| Onboarding day 1 | onboarding-day1.png | ✓ |

Not yet mocked (next round): Meetings page (before/after), notice compose/status, System tab, HR path builder, phone Messages and phone Leads view.
