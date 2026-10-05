# DPCP OS Product Design v1

**For:** George Hariri (CEO) · design session Sat Oct 3, 2026 (AZ)
**Status:** Draft for discussion (v1.1: adds the Departments section, the PHI risk and questions 23–34). Nothing built, sent or shared. Captures every decision from today's brainstorm (Oct 3, 2026).
**Related:** [DPCP OS Program Roadmap](https://docs.google.com/document/d/1ihUTAHBHZ7NeRDStmkJopr0FUv_V3U4Y-N4dV0eE4eo/edit) · integration contract · MVP data model · TD V2 takeover note.

> **What changed from the roadmap.** (1) **One** HBS Grok Bot account does all background work, so there are no per-employee Grok seats. Employees use DPCP OS only. (2) Aqib is **release owner** and also answers simple quick-turn tasks in #automation-team. Bots and Cursor cloud agents build, and the Architect Bot reviews every change. (3) The DPCP OS program now owns **all** HBS tech and automation, including Time Doctor V2 and every n8n workflow. (4) Communications (email and Slack) and meetings are now in scope for Launch.

---

## 1. Principles

1. **Assume AI is better at everything.** People only do the steps that truly need a person. As much of each job as possible happens inside DPCP OS.
2. **A person is needed only for:**
   - anything **outbound** to clients or other outside people,
   - **money, signatures and legal** commitments,
   - **live human contact**: calls and meetings,
   - items where the AI is **not confident** or the case falls **outside its rules**.
   The AI does everything else and closes it out itself. You can see all of it in a log ("Handled by AI").
3. **The AI is each person's daily manager and thinking partner.** People aren't good at prioritizing, so the AI builds the priority list and keeps it in order. People don't sort their own lists.
4. **One day at a time, one task at a time.** Each task arrives prepared (context, draft, what "done" means). When you finish one, the next appears.
5. **One place to ask for anything.** A single chat box. Behind it, a "router" decides how to handle each request.
6. **Nothing is lost, nothing is deleted.** Every input is saved before anything acts on it. Messages are filed, never deleted.
7. **Costs grow with usage, not headcount.** Avoid tools priced per user. (Google Workspace is already per-user and stays.)
8. **Reliability first.** The core app keeps working when the AI or n8n is down. You get manual fallback, clear alerts and tested backups.
9. **Calm design.** Lots of white space and neutral colors. Color appears only for status: green = on track/done, amber = due soon/behind, red = blocked/overdue, blue = needs you.
10. **Privacy by role.** Each person sees only their own work. Department leads see their department. George sees everything.
11. **No PHI (patient health information) anywhere until a BAA is signed.** A BAA (Business Associate Agreement) is the HIPAA contract a vendor must sign before it may hold patient data.
12. **No raw product.** Every screen is designed to perfection and approved by George before the team sees it.

---

## 2. How it fits together (architecture in plain words)

| Layer | What it is | Who controls it |
|---|---|---|
| **Interface** | **DPCP OS**, a web app that also installs on phones. It is the *only* thing employees use. | Company (George) |
| **Orchestration (background work)** | **One HBS Grok Bot account** (likely SuperGrok Heavy, with an on-demand usage card so heavy days don't stop work). It runs every employee's "AI" as a separate bot setup on that one account. | George only |
| **Quick AI** | The **xAI API** (Grok) on the company account, pay-as-you-go. It handles fast answers, sorting messages and short drafts inside the app. | Company account |
| **Plumbing** | **n8n** workflows send messages between the app and the bot through **webhooks** (an instant, direct "doorbell" call between two systems). This is the most reliable path. **Slack** is the fallback. Email is not used for app↔bot traffic. | DPCP OS program |
| **Records** | The DPCP OS database (Supabase/Postgres) holds every task, message, decision and log line. | Company |
| **Core platforms** | **Google Workspace** (Gmail, Drive, Calendar, Meet; Meet's Gemini notes is the meeting recorder) and **Time Doctor** (time tracking, connected through its API). | Company |

**Employees are app users, not Grok Bot users.** They never log into Grok. "Your AI" in the app is their own bot setup, running in the background on the HBS account.

---

## 3. User roles and permissions

| Role | Who | Sees | Can do |
|---|---|---|---|
| **Employee** | All ~28 staff | Only their own Today, tasks, messages, meetings, wins and private execution rate | Work tasks; approve their own routine outbound drafts; ask the chat; Request or Report; acknowledge pop-ups; set time off |
| **Department lead** | One per department (coaching, insurance/RCM billing, marketing, People & Staffing, procurement, finance, ops, technology) | Everything above for their own department only (team queue, who is blocked or behind, progress) | Step in, reassign, re-date, answer team decisions, approve team items above employee level, send must-acknowledge notices to their team |
| **HR (People & Staffing)** | People & Staffing lead | Onboarding progress and training checkpoints for everyone; acknowledgement status | Own onboarding paths and training content; send company-wide notices (with George's OK) |
| **George (owner)** | George | Everything: all people, departments, logs, costs, system health | All of the above, plus final approvals (money, legal, policy), settings, AI pause, releases |
| **Release owner / automation responder** | Aqib | #automation-team tasks assigned to him; system status page; release queue | Approve releases staging→production; review sensitive changes; do quick-turn tasks; hold credentials (bots never touch logins or secrets) |
| **Bots** | HBS Grok Bot (each person's AI, department bots, Architect Bot) | Only what that person/department may see, through the app's rules | Prepare, draft, file, close internal items, create tasks. **Never** send outside messages without a person's approval |

**Hard walls:** finance and CFO-level data is limited to George (and the finance lead, for their own work). HR and health topics are on the "never touch" list (section 7). Bots see only data inside their person's or department's permission. The chat can't look up data the asker isn't allowed to see.

---

## 4. The employee day

| Time | What happens | Who does it |
|---|---|---|
| Before shift | AI gathers overnight email/Slack, meeting action items, rollovers from yesterday and due dates. It drafts replies, preps each task and builds a **realistic plan** sized to the person's real working hours (from Time Doctor). | AI |
| Start | Employee opens **Today**. Any must-acknowledge notice shows first. Then **one focus card**: the most important prepared task. | Employee |
| During the day | Do the human step (approve/edit a draft, make the call, sign, decide). Click done. The next task appears. Questions go to the chat. New urgent items slot into the list by priority, and the AI explains why when it moves things around. | Employee + AI |
| Meetings | Prep is attached as a task before each meeting. Afterward the Gemini notes are picked up, and the action items show up as tasks with owners and dates. | AI |
| Stuck | Time Doctor shows time on a task running far over its estimate, or the person says "I'm blocked". The AI offers help first. If that doesn't clear it, it alerts the lead. | AI → lead |
| End of day | Unfinished tasks **roll over automatically** to the right spot tomorrow (the original due date is kept, so on-time stays honest). A one-tap **close-out** ("anything to add?") **becomes the daily report**, with no separate form. | AI + employee (1 min) |

---

## 5. Screen specs

Every screen has the same four states, plus extras where noted:
- **Empty:** a calm message and what will show up here.
- **Loading:** grey placeholder shapes, never a blank page. Saved data shows first.
- **Error:** plain sentence ("Couldn't load messages. Your work is saved. Retrying…"), with a retry button and an automatic report to the Architect Bot.
- **AI paused:** a thin amber banner, *"AI is paused. You can keep working; tasks and drafts already prepared still work. New items will be prepped when it's back."* Manual buttons stay available.

### 5.1 Today (home) and the focus card

![Today – desktop](mockups/today-desktop.png)

**Purpose:** do today's work one task at a time, with no sorting or hunting.

**Contents**
- Greeting, "Task 4 of 9", hours of work left and expected finish time.
- **Today's progress bar** (done ÷ planned).
- **One big focus card:** status tags (needs approval / due time / source such as "from email · client"), title, one-line "why", **what the AI prepared** (checks done, attachments, the matching SOP step), the **draft** if there is one, the **definition of done**, an estimate (from Time Doctor history), and "Next up" as a single line.
- **Small messages strip:** counts for need reply / need decision / handled by AI. They're already in the task list, so this is just for awareness.
- **Wins:** on-time streak, hours AI saved today/this week.
- **My execution rate (private):** on-time % vs. the person's own goal. Only the person (plus their lead and George, see Q3) sees it. It is never ranked against coworkers.
- **Chat side panel** (5.2) and the **Request or Report** button.

**Actions:** Approve & send · Edit draft · Done (with proof where needed, e.g. sent-thread link) · I'm blocked (pick a reason) · Need more time (new date; original kept) · Skip for now (AI re-slots it and records why).

**States:** *Empty* = "You're done for today 🎉 Close out your day" (the close-out button). *All done but more arrived* = next card fades in. *Loading/error/AI paused* as above. *Waiting on others* = the card shows "waiting on Laura since 1:00 PM; I'll nudge at 3:00".

**What the AI does behind it:** builds and re-orders the priority list (due date, client impact, who's waiting, effort, meetings on the calendar). Preps each card (pulls data, drafts, finds the SOP). Handles rollovers. Watches Time Doctor time against the estimate. Writes the daily report from the close-out.

### 5.2 Chat and the router

![Chat – router asks a clarifying question](mockups/chat-router.png)

**Purpose:** one box for anything an employee needs. It's a side panel on every screen and a full page on its own.

**How the router decides (every message):**

| Route | When | What happens | Where the answer shows |
|---|---|---|---|
| **Quick answer** | General question, short draft, explain something | Grok via the xAI API | In chat, in seconds |
| **SOP / knowledge lookup** | "How do we…", policies, prices, steps | Searches SOPs and the company knowledge base, cites the source | In chat |
| **DPCP OS data query** | "How many…", "what's the status of…" | Reads the database **within the asker's permissions** | In chat |
| **App action** | "Move this to Friday", "remind me", "create a task for Sana" | Does it in the app. Anything **outbound** becomes an approval card | In chat + Today |
| **Real work** | Reports, research, multi-step jobs | Sent to the HBS Grok Bot by webhook (n8n) | Comes back **as a task in Today**, slotted by priority |
| **Decision** | Needs a call above the employee | Routed to the lead or George with the context attached | Their Today; asker sees "waiting on Omar" |
| **Unsure** | Could mean more than one thing | **Asks one short clarifying question with tap options** instead of guessing | In chat |

**Rules:** if it can be answered in about 30 seconds, it stays in chat. Anything longer, the employee moves on and the result comes back as a task. Each answer shows a small, plain "route" note (e.g. "SOP lookup · Client Onboarding SOP v3"). The router never sends anything outside the company without approval. It never shows data the person isn't allowed to see. Instead it says "That's outside what you can see; I've asked your lead."

**States:** *Empty* = example prompts ("Draft a follow-up to…", "What's our policy on…"). *Background job running* = a "Working in background" chip with the start time. *AI paused* = chat accepts and saves the message and says "I'll answer when AI is back; urgent? tap to send to your lead." *Error* = message kept, auto-retry.

**AI behind it:** a small, cheap classifier step picks the route. It logs route, cost and time for every message. Answers that get a thumbs-down feed the Request or Report queue.

### 5.3 Task detail

**Purpose:** everything about one task, opened from the focus card ("details") or from a list.

**Contents:** title, owner, status, original due + current due, source link (email thread, Slack message, meeting notes), prepared materials, draft(s), definition of done, SOP steps (training built in), Time Doctor time spent vs estimate, history (who/what did each step, including AI steps), related tasks, comments.

**Actions:** same as the focus card, plus reassign (leads), add a note, ask the AI about this task (opens chat with the task as context), attach proof.

**States:** *Blocked* (red, with reason and who it's waiting on). *Waiting on outside reply* (AI follows up on a schedule; follow-ups are drafts for approval). *Done* (read-only with proof). *AI paused* (draft area shows "prep pending").

**AI behind it:** keeps the context current (new replies in the thread update the card). Estimates effort. Suggests the next step when blocked.

### 5.4 Messages (communications triage)

**Purpose:** inbox zero for email and Slack without the employee reading every message.

**Contents:** four tabs with counts:
1. **Needs reply:** each with the AI's draft. These are also tasks on Today.
2. **Needs decision:** a short summary + options.
3. **Handled by AI:** what it did (filed, answered an internal question, updated a task) with an undo/"reopen".
4. **No action / filed:** newsletters, FYIs, receipts, automatically labeled.

Each item shows the source (Gmail / Slack channel / mention / DM), who it's from, and a one-line summary.

**Actions:** approve & send (goes out **from the employee's own account, in the same thread**), edit, re-classify ("this needed me" teaches the AI), open the original.

**Rules:** never delete (file/archive only). **Outside messages always need a person's approval.** Replies to clients never mention AI. Items on the never-touch list are left alone (7.4).

**States:** *Empty* = "Inbox zero ✓". *Connection lost* (e.g. Slack authorization expired) = amber note with a one-tap re-connect. *AI paused* = messages still arrive and are saved but sit in "Unsorted" until AI is back. Employees can read and reply manually.

### 5.5 Meetings

**Purpose:** meetings arrive prepared and turn into action.

**Contents:**
- **Before:** a prep task on Today (agenda, last meeting's open items, relevant numbers, the client's recent messages).
- **After:** recap, action-plan draft, and a task list with **owners and deadlines**, linked to the Gemini notes/transcript.

**Actions:** the meeting lead confirms or edits the action items (one screen, one tap per item). Anyone can open the recap.

**Rules:** applies to client and **internal** meetings (internal meetings also turn into tasks). If an owner or date is unclear, it goes to the **meeting lead** to fill in. Client-facing recaps are drafts for approval.

**States:** *Notes not found yet* ("Waiting for Gemini notes; usually 10–30 min after the meeting"). *No notes recorded* (lead gets a task: "add 3 bullet notes or skip"). *AI paused* (notes saved, processing waits).

**AI behind it:** reads calendar events. Picks up Gemini notes and transcripts from Drive automatically. Drafts the recap and plan, creates tasks, and follows up on them.

### 5.6 Must-acknowledge pop-ups

![Acknowledgement pop-up](mockups/ack-popup.png)

**Purpose:** make sure essential information is actually read (policy changes, schedule changes, safety/compliance rules).

**Contents:** title, who sent it and when, a short plain message, "what changes for you", and two buttons: **Acknowledged** and **I have a question**.

**Behavior:** shows before the next task (it can't be dismissed without one of the two buttons). "I have a question" opens chat with the notice as context and routes the question to the sender, so nobody gets stuck. George/leads see a status list: acknowledged / has a question / not yet seen. The **bot follows up** with anyone who hasn't acknowledged (reminder at next login, then a Slack DM, then the lead).

**States:** sent / partly acknowledged (e.g. 19 of 28) / all acknowledged / questions open.

### 5.7 Leads view

![Leads view](mockups/leads-view.png)

**Purpose:** a department lead runs their team from one screen.

**Contents:** team progress today, team on-time this week vs goal, "needs you" count (blocked / behind / decisions), handled-by-AI count with a link to the log. The **team queue** has one row per person: today's progress, what they're working on now, status (on track / behind / blocked / time off), on-time this week. Below it: why someone is blocked, with the AI's suggestion.

**Actions:** **Step in** (take over or help), **Reassign**, move date, message the person, open their task, approve team decisions.

**States:** *Everyone on track* = a calm "Nothing needs you". *Time off* rows show who is covering. *AI paused* = live data still shows from the database; suggestions pause.

**AI behind it:** spots blocked and behind work early (from Time Doctor and task timing). Suggests the fix (reassign, re-date, call). Writes the lead's end-of-day team summary.

### 5.8 George view

**Purpose:** see the whole company without asking anyone.

**Contents:**
- Company on-time execution rate vs target, by department and person.
- Overdue and stuck items (people and bots).
- **Decisions waiting for George** (one queue: money, legal, policy, escalations).
- Acknowledgement status of notices.
- Hours AI saved.
- **System health** (uptime, failed jobs, the "needs attention" list, AI paused or not).
- **Costs** (xAI API spend, Grok Bot usage card spend, against monthly budget).
- Request or Report pipeline (open → building → shipped).

**Actions:** drill into any department or person, approve/decide, reassign, send a must-acknowledge notice, **pause/resume AI**, approve releases.

**AI behind it:** a short morning brief and a weekly brief (uptime, cost, execution trends, top risks).

### 5.9 Request or Report

**Purpose:** anyone can ask for a feature or report a problem from any screen, in one tap.

**Flow:** button → a short form (what happened / what you want; screenshot attached automatically, plus the screen and task context) → **ticket** → AI **removes duplicates** and groups similar ones → becomes a **GitHub issue** (the to-do list for the build bots) → bots build → Architect Bot reviews → shipped → **the employee who asked is notified** ("You asked for X, it's live").

**States:** submitted / grouped with others (counts how many asked) / planned / building / shipped / won't do (with a reason).

### 5.10 Onboarding and training (owned by HR / People & Staffing)

**Purpose:** a new hire is productive in their first week without someone sitting next to them.

**Contents:** a guided **first-week path** inside Today (day 1: accounts, policies to acknowledge; days 2–5: real but low-risk tasks with extra guidance). **SOPs show up inside tasks** at the step where they're needed. **Checkpoints** (short quizzes or a lead sign-off) unlock the next stage. HR sees everyone's progress.

**Actions:** HR builds and edits paths. Leads sign off checkpoints. The new hire asks the chat anything.

**AI behind it:** turns SOPs into step-by-step guidance, answers questions, flags people falling behind on the path to HR.

### 5.11 Settings and time off

**Contents:** profile, working hours and time zone (sets the shape of their day), personal on-time goal, notification preferences (in-app first, then phone push, Slack DM as backup), connected accounts (Gmail, Slack, Time Doctor status), **time off** (dates + who backs them up).

**Time off and coverage behavior:**
- Before and during time off, the bot checks every due date.
- **Urgent items** go to the **named backup** with full context.
- **Non-urgent items wait.** The person gets a **catch-up brief** when they return.
- Clients who write in get **holding replies drafted for approval** (approved by the backup), e.g. "Nadia is out until Monday; Faisal is helping in the meantime."

### 5.12 Mobile (phone) layouts

![Today – phone](mockups/today-phone.png)

**Approach:** a phone-friendly web app that **installs to the home screen** (a "PWA": it looks and works like an app, with no App Store or Play Store). Available from day one.

**Layout:** one column. Progress at the top, the focus card, then "next up", the messages strip, wins, and the chat box. Bottom tabs: Today · Messages · Chat · Meetings · More. Big tap targets. Approve-and-send works with one thumb. Must-acknowledge pop-ups are full-screen on phones. Leads view on a phone shows the "needs you" list first, then the team list.

---

## 6. What the AI does vs what people do (summary)

| AI does and closes (logged) | Person does |
|---|---|
| Sort and file messages; answer internal questions it's sure of; update tasks; prep every task; build and reorder the priority list; roll over unfinished work; write daily/meeting/team reports; follow up on people inside the company; create tasks from meetings; detect stuck work; draft every reply | Approve any message to clients/outside people; money, signatures, legal; calls and meetings; items the AI marks low-confidence or outside its rules; decisions sent to them |

---

## 7. Communications intake

### 7.1 What comes in
All work **email** (Gmail) and all work **Slack** (channels, mentions **and direct messages**) flow into DPCP OS.

### 7.2 How it connects
- **Gmail:** Google Workspace **domain-wide delegation** (an admin setting that lets a company app read and send mail for company accounts without each person sharing a password) plus **push notifications** (Gmail tells the app the moment mail arrives, with no polling).
- **Slack:** one **custom company Slack app**. Each employee does a **one-time authorization** so the app can read their DMs and send in-thread replies as them. There's a **company policy that work Slack is managed** (the company may process work Slack messages). Stay on the **Slack free plan**: DPCP OS stores every message itself, so Slack's 90-day history limit doesn't matter, and the free plan's app limit is fine because we use **one** app slot.
- **WhatsApp:** skipped.

### 7.3 Triage (every message)
1. **No action:** filed.
2. **AI-handled:** done and logged.
3. **Needs reply:** draft prepared, becomes a task on Today.
4. **Needs decision:** summary + options, becomes a task for the right person.

Approved replies go out **from the employee's own account, in the original thread**.

### 7.4 Rules
- Inbox zero, but **never delete**.
- **Outside messages are always approved by a person.**
- **No mention of AI to clients.**
- **"Never touch" list:** HR matters, health, pay, personal/family topics and similar. The AI doesn't read, sort or draft these. They're left as-is for the person (see Q7).

---

## 8. Meetings (process)

1. Calendar event detected → prep task created (timed before the meeting).
2. Meeting held on **Google Meet with Gemini notes on** (Gemini is the recorder).
3. Notes/transcript land in Drive → **picked up automatically**.
4. AI writes the **recap**, an **action-plan draft** and **tasks with owners and deadlines**.
5. Unclear owner or date → goes to the **meeting lead** to fill in.
6. Internal meetings become execution too. Their tasks enter each owner's Today and are tracked like any other task.
7. Client recaps/follow-ups are drafts for approval.

---

## 9. Time Doctor

Connected through the **Time Doctor API**. It's used for:
- **Time per task:** actual minutes attach to each task, so estimates get better.
- **Stuck-work detection:** a task running well past its estimate, or long idle time during a task, triggers help and then a lead alert.
- **Realistic plans:** Today is sized to the hours each person actually works.
- **End-of-day reports:** combined with the close-out to make the daily report and the lead's team summary.

**Time Doctor V2** (the current screenshot-analysis automations and PDF report) moves under the DPCP OS program. The order is: reliability first (test copy, retries, alerts), then accuracy, then the per-supervisor report. That report becomes the **leads view** and end-of-day report inside DPCP OS. "Done" for V2 = 5 clean weekdays in a row.

---

## 10. Reliability (top priority)

| Safeguard | What it means |
|---|---|
| **Save first** | Every input (message, click, upload) is saved to the database *before* anything acts on it. Nothing is lost if a step fails. |
| **Retries** | Failed steps retry automatically, with a growing wait between tries. Steps are written so a retry never sends something twice. |
| **"Needs attention" list** | Anything that still fails lands on a visible list (George and Architect Bot), never a silent failure. |
| **Works without AI / n8n** | Core app (Today, tasks, messages, approvals) works with AI or n8n down. Manual buttons stay; an **"AI paused"** banner shows. |
| **Backup model** | If Grok/xAI is down, quick AI work switches to a backup model (default: Gemini, already in Workspace; ⚠ conflicts with retiring Gemini, see Q13). |
| **Monitoring and alerts** | Health checks on every workflow and connection. Alerts go to the **Architect Bot** and **Aqib** (#automation-team). |
| **Status page** | Simple page showing what's up/down and since when. |
| **Staging + one-step rollback** | All changes go to a test copy (staging) first. Any release can be undone in one step. |
| **Daily backups, tested restores** | Database backed up daily. A restore is actually tested on a schedule (default monthly). |
| **Uptime target** | Reported weekly to George (default target: 99.5% during working hours, see Q11). |

---

## 11. Cost model

**Principle:** costs scale with **usage**, not headcount. No new per-user tools.

| Item | How it's priced | Notes |
|---|---|---|
| HBS Grok Bot account (one) | Flat plan (likely SuperGrok Heavy) + **on-demand usage card** | Does all background "real work" for everyone. No per-employee Grok seats. |
| xAI API (company account) | Pay-as-you-go per use | Quick answers, triage, short drafts. Spend alerts. |
| n8n (self-hosted) | Server cost, not per user | All app↔bot webhooks and workflows |
| Database + hosting | Usage-based tiers | |
| Slack | **Free plan** | One company app; DPCP OS stores messages |
| Time Doctor | Existing | |
| Google Workspace | Per-user (already paid; stays) | Gmail, Drive, Meet + Gemini notes |

George view shows monthly spend vs budget. Alerts trigger at set thresholds (see Q10). Every AI call is logged with its cost, the person and the task.

---

## 12. Launch and the quality bar

1. **No raw product.** Every screen is designed to perfection first as **clickable mockups George approves**.
2. Build on staging with **realistic test data** (fake clients, fake people).
3. **Simulated workdays:** bots play a full day of real-shaped traffic (emails, Slack, meetings, Time Doctor) end to end.
4. **Quiet pilot:** George + 1–2 staff use it for real work.
5. **Launch quality bar** (must all pass): every screen matches its approved mockup; all states (empty/loading/error/AI paused) work; zero lost inputs in simulated days; outbound never sends without approval; permissions tests pass (nobody sees what they shouldn't); phone layout passes; restore test passed; uptime target met during the pilot; pilot users would not go back to the old way.
6. **Launch as an event:** a short live kickoff, a welcome must-acknowledge notice, and first-week onboarding paths ready.
7. **One cutover for the whole team** (no department-by-department rollout). Old trackers become read-only.

---

## 13. Program scope and the Aqib / #automation-team operating model

- **DPCP OS program takes over all HBS technical and automation infrastructure**, including **Time Doctor V2** and **all n8n** workflows.
- **Builders:** bots + Cursor cloud agents. **Reviewer:** Technology & DPCP OS Architect Bot reviews every change.
- **Aqib's role:** **release owner**: he approves what moves from staging to production and reviews sensitive changes (login, security, billing, anything near PHI). He also responds to **simple quick-turn tasks** posted in **#automation-team**, mostly things only a person can do: credentials, admin settings, exports, turning workflows on, quick checks.
- **#automation-team is the single coordination place:**
  - **Pinned priorities** (the current ordered list).
  - **One ask at a time** to Aqib, never a pile.
  - **Turnaround targets** (default: acknowledge within 1 working hour, simple tasks done same day, see Q14).
  - Each ask has a clear "done" and is tracked as a task in DPCP OS.

---

## 14. Departments

What each department needs from DPCP OS. This comes from each department's needs spec (written by that department's strategy bot). Items the bots marked as guesses are still unconfirmed. Every subsection covers people, recurring work (the AI step and the human step), the lead view, key SOPs and sensitive data.

### 14.1 Operations (Dental Practice Copilot core)
**People:** Zaid Singh (Operations Manager: execution, ticketing, weekly reports) · Dalisu Shange (Operations Manager: new verticals, hiring 5 roles, culture/core values, org chart) · Sameed Haider and Faheem Ullah Baig (James Clinic bookkeeping, 20% margin target). Lead view goes to Zaid and Dalisu.

| Recurring work | AI does | Human step |
|---|---|---|
| Execution-rate tracking (weekly) | Pull George-assigned tasks, compute on-time % by person and department, flag anyone under 80% | Zaid/Dalisu follow up; George decides on repeat misses |
| Friday 7-pillar report | Pre-fill status and evidence per pillar, draft next week's top 3 | Zaid/Dalisu add judgment, sign off |
| Follow-through on George's meeting asks | Extract action items, assign, track, nudge | Do the work; talk to George |
| Tech-brief compliance (#automation-team) | Check posts, table with links, flag misses | Address misses |
| Stand-up/EOD/Time Doctor coverage | List gaps (9 of 28 people have no stand-up/EOD presence today) | Talk to the person; decide coverage |
| Hiring 5 roles | Draft JDs/outreach, screen, schedule | Interviews, hire decision, any spend |
| Core values, org chart, RACI | Draft from transcripts; keep chart in sync | Dalisu/George decide |
| James Clinic bookkeeping (daily + monthly) | Match/categorize transactions, draft EOD and monthly reports, flag mismatches | Resolve exceptions; send reports to the client |

**Lead view:** execution rate vs 80% target (trend, names below); overdue George-assigned items (owner, days late, source); 7-pillar board; report-compliance grid; hiring pipeline; James Clinic EOD done / exceptions / margin; items waiting on George.
**Key SOPs:** 7-pillar report template · execution-rate report (not yet written) · meeting action-item capture · James Clinic EOD and month-end reconciliation (no written SOP yet) · technical-brief standard.
**Sensitive data:** pay columns in the HBS Team Redesign sheet (George only) · James Clinic client financial and patient-linked data (likely EU/Irish privacy law) · performance flags on named staff (Zaid, Dalisu, George only) · SP/SPG and CFO material walled off.

### 14.2 Coaching and Client Success
**People:** George (the coach; runs every call; approves any reply that answers a client question) · Don Hodzokoro (QA of action-plan emails, green check) · Zaid (early-phase final check/send, scheduling, signatures) · Muhammad Adil (email drafts, client tools) · Kaley Hariri (reviews monthly coaching schedule) · Ahsam (client P&L reviews) · Nomi and Sadaqat sit in on specific clients' calls. Supporting bots: Client Sheets, Call Prep, Coaching Coordinator, Inbox, Scheduling.

| Recurring work | AI does | Human step |
|---|---|---|
| Call prep | Builds per-client prep doc (latest transcripts, comms, open items George owes, team updates); posts by noon the day before | Don checks; George reads |
| Prep confirmation emails | Auto-sends on George's approved template (the one standing exception to "approve every outbound") | Only if unsure: Don/Zaid QA |
| Post-call action plans | Draft within 2 hours in George's voice; dedupe; team loop-ins; tasks logged | Don QA; Don or Zaid sends |
| 72-hour check-ins | Drafts with open next steps | Don QA and send |
| Client correspondence | Triage; draft in George's voice; route P&Ls to Ahsam, website asks to web team | George approves any reply that answers a client question |
| Scheduling | Proposes next month (max 5 calls/day) | Kaley reviews; Zaid coordinates |
| Client sheets, transcript filing | Fully automatic | Fix conflicts/misfiles |

**Lead view:** recap timeliness tracker (call ended → transcript found → draft → QA → sent, hours after call); today's and tomorrow's calls with prep/confirmation/Gemini-notes status; drafts waiting on Don or George (age); open client items by owner; unanswered client emails; missing transcripts; stale client sheets.
**Key SOPs:** Post-Call Action Plan spec (exact structure; AI note footer permanently dropped) · prep confirmation + 72-hour check-in specs · Call Prep format · File Organization SOP + Client Intelligence Sheet · George's voice guide.
**Sensitive data:** client P&Ls/financials · **patient information in call transcripts** · clients emailing passwords (never repeat) · never mention AI to clients · a named "not a client" list must never be treated as clients.

### 14.3 Insurance and RCM (Dental Insurance Copilot)
**People:** Sadaqat Ali (lead) · Adil (AI adoption lead, weekly AI report) · Khadim Hussain (credentialing) · eligibility team (Ahmad Hussain, M. Younus supervisor, Amna Qureshi, Athar, Basharat) · claims/posting/AR (M. Waqas also appeals, Zubair Asghar, M. Junaid Khan). Lower-cost hires planned under the current team.

**PHI rule for this department:** nearly every task touches PHI. Until a BAA is signed, DPCP OS can only **route and track** the work (task, client, count, status). The patient data stays in the practice management system and payer portals.

| Recurring work | AI does (pre-BAA: nothing that touches PHI) | Human step |
|---|---|---|
| Picking / eligibility and benefits | Build the verification queue; fill benefits summary; flag gaps (needs PMS access, after BAA) | Portal/phone checks; update PMS |
| Verification QA | Completeness checklist | Review flagged |
| Claims and rejections | Scrub before submission; classify rejection; propose fix | Submit/correct in PMS |
| Payment posting | Match ERA/EOB to claims; flag mismatches (biggest build) | Post exceptions; request missing deposit info |
| AR follow-up | Rank aging; next action; call script | Insurance calls; log outcome |
| Denials/appeals | Draft appeal | Senior review; submit |
| Month-end client reports | Compile; summary (aggregate totals may be PHI-free) | Check numbers; send |
| HBS invoicing | Build invoice from activity counts | Sadaqat approves |
| Credentialing | Status, document checklist, reminders | Payer calls, signatures |
| Weekly AI-adoption report | Per-biller % AI and hours saved | Adil validates |

**Lead view (Sadaqat):** per client: eligibility queue, claims submitted/rejected, posting backlog, AR aging (90+ highlighted), collections vs production · per biller: tasks done, % with AI, hours saved, flag no AI use 2 weeks running · blockers by client · appeals pipeline · credentialing status · stand-up/EOD submitted. **All as counts and status only before a BAA.**
**Key SOPs:** eligibility/benefits SOP + benefits template (client-specific rules) · appeal templates by denial reason and payer · claim scrubbing checklist per PMS · payment posting SOP + month-end report and invoice templates · AR follow-up playbook · Adil's weekly AI report template.
**Sensitive data:** PHI in almost everything · client system logins (remote access, payer portals) · client bank/deposit data · provider credentialing data · pay data.

### 14.4 People and Staffing (HR / Dental Staffing Copilot)
**People:** Darin Ungar (lead: staffing service + internal HR) · Hussain Ali (doctor sourcing, CRM) · Mishka Singh (Clinical Director, doctor calls) · Nomi Iselo (Hygiene Director; hygienist/DA recruiting) · interview partners Zaid, Ahsam (also payroll), Dalisu, Khadim. Serves ~30 HBS/HDG staff plus Arizona clinic hires and placed staff.

| Recurring work | AI does | Human step |
|---|---|---|
| HDG clinic hiring tracker (#1 priority) | Keep roles live (stage, candidates, days open, owner); flag >30 days | Darin sets priorities |
| Doctor sourcing | Draft outreach; log replies; schedule; chase no-shows | Hussain sends; Mishka holds calls; George decides |
| Hygienist/DA recruiting | Draft posts; screen applicants against JD | Nomi approves/sends; interviews |
| Internal role hiring | Scorecards; screening; scheduling; debrief notes | Interviewers; George decides |
| Offers and agreements | Fill templates | Attorney review where marked; George signs |
| Onboarding | Run the first-week path; track checkpoints | Buddy and lead sign-off |
| Policies (handbook, PTO) | Draft and redline | Attorney review; George approves |
| Client placements | Pipeline tracking, status drafts | Darin owns relationship; George sets pricing |

**Lead view (Darin):** open HDG roles with stage/candidates/days open/next step and a 30-day flag · doctor funnel by stage · onboarding progress per new hire · who is out today and their backup · missing documents per person.
**Key SOPs:** Training Guide for Copilots & VAs · role JDs · DA Onboarding Guide and Hygiene Training Curriculum · offer letter and contractor confidentiality templates · handbook outline (PTO placeholders).
**Monitoring policy points:** written and acknowledged at onboarding (work Slack incl. DMs and work email are system-managed; attorney review needed). The system never sends as a person without approval. The **never-touch list** (health/leave/accommodation, harassment or misconduct complaints, pay disputes, discipline/termination, legal claims, immigration/background checks, family matters, passwords) goes to a **restricted HR queue** (Darin + George).
**Time-off data needed:** per person: primary and secondary backup, time zone, country, working days · per absence: dates, type, approver, coverage notes · per task: urgency flag · holiday calendars for US, South Africa, Pakistan · PTO policy parameters (not yet decided).
**Sensitive data:** pay · worker classification (team labeled "freelancers", not confirmed; AZ W-2 hiring starting without a handbook or termination process) · health/complaint data · candidate personal data.
**Gap:** there's no HR system of record (classification, country, start date, signed agreements, onboarding status per person).

### 14.5 Finance (HBS Finance Controls)
**People:** Ahsam Ullah (controller: billing/collections, HBS accounting, client P&Ls, payroll, card reconciliation, vendor quotes) · Dalisu (approves weekly payroll period) · Financial Coordinator (to hire) · staff confirm their own hours and invoice · George (final approver on money). George's personal and CFO-private finances are excluded.

| Recurring work | AI does | Human step |
|---|---|---|
| Weekly payroll | Pull Time Doctor hours; build period sheet; draft review/invoice requests; match invoices | Dalisu approves; Ahsam releases payment |
| Card reconciliation, bank categorization (monthly) | Auto-categorize; flag duplicates, unknown vendors, unused subscriptions; require owner + reason per payment | Ahsam confirms flags |
| Monthly HBS reports | Consolidated and cost-centre P&Ls with variance notes | Ahsam reviews; sends to George |
| Client P&L analysis | Run the internal protocol; draft findings | Ahsam QA; George presents |
| Client invoicing/collections | Flag failed/late payments; draft dunning | Ahsam approves outreach |
| Subscriptions/vendor payments | Watch failed-payment and large-debit alerts | Fix payment methods; verify charges |
| Insurance/vendor quotes | Collect and compare | Choose and sign |

**Lead view (Ahsam; George read-only):** payment queue (pending/approved/paid, owner and reason per line) · exceptions (duplicates, unknown payees, unusual amounts, failed payments, unused subscriptions) · payroll status per person · client P&L requests with due dates · collections aging · month-end close checklist.
**Key SOPs:** Finance & KPIs Co-Pilot P&L SOP · payroll review and invoice templates · **payment approval matrix and separation of duties (not written yet; George's #1 finance priority)** · month-end close checklist (not found) · collections templates.
**Sensitive data:** pay rates (Ahsam, Dalisu, George, the payee only) · card/bank numbers and credentials (vault only; never in app text or sheets) · client P&Ls (Ahsam, assigned analyst, George) · HBS Financials and George's private finances (CFO Bot and George only, never in this view). **No AI can release a payment.**

### 14.6 Marketing (Dental Marketing Copilot)
**People:** Zain (interim marketer, default owner; also web/infra) · Shama (graphic design) · Marketing Coordinator (to hire) · outside execution partner (status unclear) · Zaid and Dalisu (coordination/escalation) · George (approves outbound, pricing, budgets). Four active ad clients plus several website-only jobs. The client list conflicts with the Client Tracker and needs George to confirm it.

| Recurring work | AI does | Human step |
|---|---|---|
| Weekly snapshot per client | Pull data; draft (calls, cost/call, spend, verdict, actions, budget rec) | Approve and send |
| Monthly report | Compile; max-budget analysis; dashboard update | Add nuance; approve budget rec; send |
| Conversion audit | Inventory conversions; flag non-booking primaries | Change settings in client account |
| Call-to-patient matching | Export calls; build match sheet | Front desk marks booked/seen (**PHI decision needed**) |
| Campaign optimization | Propose negatives, bids, tests; QA | Apply changes; approve budget moves |
| Landing pages | Draft copy per SOP | Compliance review; build on client-owned hosting |
| Social posts | Draft (workflow currently suspended) | Approve posting |
| Client emails | Draft from thread + client sheet | Approve and send |
| Quotes, website changes | Scope inputs; log hours | Zain authors; George prices |
| Client onboarding | 90-day plan, tracking checklist, discovery questions | Run the live call |
| Friday report check | Flag missing snapshots Monday | Send the missing report |

**Lead view:** per-client results (leads, booked new patients, cost per lead and per new patient, ROI, month-over-month, declining flagged) · report-compliance grid · conversion health per account (booking-based? call tracking? client-owned?) · open client promises with due dates · blocked items with reason.
**Key SOPs:** Weekly Snapshot Standard · Monthly Report · Weekboard (weekly/monthly rhythm) · Client Onboarding Standard · Landing Page SOP · target playbook and PPC QA guide (two source docs are empty on Drive).
**Sensitive data / risks:** logins posted in plain text in Slack (rotation pending) · misconfigured conversions make results untrustworthy · vendor-held vs client-owned assets · **patient data once call matching or PMS links start** · single-person dependency on Zain.

### 14.7 Procurement, Imports and Compliance
**People:** Junaid (logistics/procurement lead: shipments, landed cost, warehouse/3PL, broker data) · Zaid (vendor docs, signatures) · Nomi (support, at capacity) · Mishka (quote/catalog reviews) · Dalisu (bond docs) · Shama (carton artwork) · Shaldon (equipment assembly) · e-commerce lead (open seat) · George (money, legal, signatures, SKU removal, bond, artwork). Outside vendors, brokers and registrars are **never contacted by AI without approval**.

| Recurring work | AI does | Human step |
|---|---|---|
| Quote/proforma intake | Parse to SKUs/qty/prices; diff vs last version; flag missing FDA data | Mishka/Junaid review; George approves payment |
| Per-SKU FDA/UDI check | Look up registration, listing, product code, 510(k)/exempt, GUDID; fill compliance sheet | George removes/replaces uncleared SKUs |
| Vendor document collection | Draft requests; track returns | Approve and send |
| Shipment readiness | Check packing list/invoice/bill of lading vs PO; bond and importer status | Book or hold |
| Landed costing | Duties, freight, insured value; propose bond coverage | George sets bond; signs |
| Inventory and 3PL | Stock by location/condition; compare 3PLs | Choose; sign |
| Triage | Slack/email threads → tasks (WhatsApp vendor chats are outside triage) | Ambiguous vendor claims |

**Lead view (Junaid / Zaid):** shipment board (status, FDA/UDI readiness per SKU, document completeness, bond/registration, sail/ETA; hold reasons in red) · missing docs by vendor · George decision queue · inventory by location · landed cost vs PO · conflicting-date flags.
**Key SOPs:** per-shipment FDA/UDI check (no blank cells before booking) · bond and customs readiness · vendor doc request · landed costing · packing-document completeness (nothing undeclared, devices never declared "industrial").
**Risks:** misdeclaration (penalties/seizure) · missing UDI → detention · uncleared SKUs · no bond → demurrage · unverified vendor papers · bank-detail-change fraud · single points of failure (Junaid, Zaid) · WhatsApp outside the system.

### 14.8 HDG New Locations and Construction
**People:** Shaldon Thomas (lead; also Dental Construction Copilot consulting) · Johannah Mabunda (architect: plans, code/ADA) · Nosi (contractor sourcing, site visits) · Junaid (logistics/FDA/freight) · Mishka (procurement, doctor conversion) · Hussain (doctor sourcing) · Nomi (staffing) · Ahsam (entity/EIN/NPI/insurance) · Sadaqat and Khadim (credentialing, fee schedules) · Zaid (tracker, daily meeting, signatures) · Dalisu (transcript to workflow) · Adil (vendor escalation) · George (LOI/lease signing, design direction, money).

| Recurring work | AI does | Human step |
|---|---|---|
| Site screening (AZ, ~3,500 sq ft) | Market data, listings, TI comps, draft scorecard (1–10) | Shaldon visits/scores; George decides |
| LOI and lease | Draft from template; compare lease to LOI; track deadlines | George signs; Shaldon negotiates |
| Plans and code check | ADA/dental-standard checklists; revision tracking | Johannah draws; Shaldon reviews |
| Contractor quotes | Outreach drafts; quote log; budget compare; barter-fit flags | Nosi visits; Shaldon decides; approve outreach |
| Barter program | Script, candidates, credit ledger (doesn't exist yet) | Close the deal |
| Procurement/import | Landed cost, PO tracker, ETA alerts | Payment approval; FDA/customs signatures |
| Entity, credentialing, insurance | Checklist, status, chasing | Signatures, submissions |
| Daily stand-up/EOD/weekly call | Transcript → tasks, recap, open items | Attend; confirm |
| Opening readiness | Countdown on the 17-step pipeline; gate status | 30/60/90-day review |

**Lead view (Shaldon):** each site on the 17-step pipeline with the three gates (doctor, FDA clearance, layout sign-off) · lease/LOI deadlines · budget vs actual incl. TI asked vs received · open quotes by trade · barter deals · equipment ETAs · who's blocked · SOP coverage per step.
**Key SOPs:** New_Location_Workflow_v3 (17 steps, gates, owners) · rural TI playbook + LOI template (Kingman terms as benchmark) · dental design standards · barter workflow ($20/hr cash or $40/hr credit; labor only) · landed-cost/import checklist.
**Risks:** deadlines slipping silently (the Kingman LOI exclusivity lapsed ~Sep 28) · low or no landlord TI · one-person bottlenecks · import holds · credentialing waits on a doctor hire · procedures live in calls, not documents · barter credits not tracked financially.

### 14.9 Cross-department summary

**Common patterns**
1. **Meetings turn into work.** Every department runs on calls (stand-ups, client calls, weekly meetings) whose action items get lost today. Meeting → tasks (section 8) is needed everywhere.
2. **AI drafts, a person approves the outbound.** Client emails, vendor requests, recruiting outreach, reports: the same approve-and-send step in every department.
3. **Recurring reports with a compliance check.** Weekly snapshots, Friday pillar reports, EOD posts, AI-adoption reports, payroll periods. Each needs "was it done, on time, by whom".
4. **Pipelines with stages and gates.** Hiring, doctor funnel, shipments, new sites, appeals, client onboarding.
5. **Deadlines that slip silently.** LOI expiry, recap timing, roles open >30 days, payroll cut-off.
6. **Decisions pile up on George.** Every department has a George decision queue (money, signatures, SKUs, pricing, hires).
7. **One-person bottlenecks.** Zain (marketing), Junaid and Zaid (procurement), Mishka (procurement + doctors), Johannah, Nomi.
8. **Work lives in sheets, calls and personal tools**, not in a system of record.

**Shared components (build once, use everywhere)**
| Component | Used by |
|---|---|
| Task engine + Today (owners, original vs current due, proof) | All |
| Approval card for outbound (edit / approve / send from own account) | All |
| **Pipeline board** (stages, gates, aging flags, owner per step) | Staffing, Procurement, New Locations, RCM appeals, Coaching recaps, Marketing onboarding |
| **Deadline tracker** with escalating alerts | New Locations, Finance, Staffing, Coaching |
| **Report-compliance grid** (who submitted what, when) | Operations, Marketing, RCM, Coaching |
| **Exceptions queue** (items the AI couldn't match or close) | Finance, RCM, Procurement, James Clinic |
| **George decision queue** | All |
| **Client record** (one page per client: services, contacts, open promises, reports; no PHI) | Coaching, Marketing, RCM, Finance |
| **SOP library** linked into tasks | All |
| **Restricted fields and queues** (pay, HR, finance, PHI-flagged) | Finance, Staffing, Operations, RCM |
| **Credential detector** (spots passwords and logins in messages, redacts them, routes to the vault) | Marketing, Coaching, RCM, Operations |
| Must-acknowledge types per department | All |

**Consolidated risk list**
| # | Risk | Where | Mitigation in DPCP OS |
|---|---|---|---|
| R1 | **PHI exposure today and no PHI policy or BAA.** Nearly all RCM work touches PHI, as do parts of coaching (call transcripts), marketing (call-to-patient matching) and James Clinic bookkeeping (patient-linked invoices). Patient data is **already flowing** through personal Gmail accounts used in Slack, Claude, the Netlify daily-reports tool, and n8n workflows that send transcripts to Gemini/OpenAI. **No PHI policy exists and no BAA is signed with any vendor.** | RCM, Coaching, Marketing, Operations (James Clinic), Automation | Name a PHI owner; stop-gap rules now (Q27–Q28); DPCP OS rejects PHI at the database and flags it in intake; RCM is route-and-track only; BAA questionnaire with xAI and the other vendors in the path |
| R2 | Plain-text credentials in Slack, sheets and client emails | Marketing, Coaching, Ops, Automation | Rotate; vault; credential detector redacts on intake |
| R3 | Pay and HR data exposure | Finance, Staffing, Ops | Restricted fields; bots never repeat pay; never-touch list + restricted HR queue |
| R4 | Monitoring of Slack DMs and email without a reviewed policy | All (legal) | Attorney review (AZ, South Africa, Pakistan) before cutover; acknowledged policy (Q25) |
| R5 | Worker classification unconfirmed; AZ W-2 hiring without a handbook | Staffing | HR system of record (Q24); handbook before AZ hires |
| R6 | Payments without an approval matrix (fraud, duplicate payments, bank-detail changes) | Finance, Procurement | Payment threshold + separation of duties (Q23); bank-detail changes always must-acknowledge + call-back |
| R7 | Silent automation failures | All | Reliability section; workflow run-status view |
| R8 | Missed legal/commercial deadlines | New Locations, Procurement | Deadline tracker with escalation |
| R9 | Customs/FDA misdeclaration and holds | Procurement | Per-SKU check blocks booking; misdeclaration suggestions are must-acknowledge |
| R10 | Single-person dependencies | Marketing, Procurement, New Locations | Named backups (Q26); SOPs in tasks |
| R11 | Unreliable data (bad conversion tracking, wrong dates in EOD posts, conflicting client lists) | Marketing, Ops | AI flags conflicts rather than trusting them; one client record |
| R12 | EU/Irish privacy law on James Clinic data | Operations | Keep patient-linked detail out until a privacy review (Q31) |
| R13 | Channels outside the system (WhatsApp vendor chats) | Procurement | Forward or summarize into email for now (Q30) |


---

## 15. Data and privacy

- **Current PHI exposure (see R1):** patient data already flows through personal Gmail, Claude, the Netlify daily-reports tool, and n8n with Gemini/OpenAI. There is no PHI policy and no BAA. Fixing this is a pre-launch item, not a post-launch one.
- **No PHI until a BAA is signed** with every vendor in the path. The database rejects a "PHI" data class. Free-text fields warn and are scanned for patterns like dates of birth or member IDs.
- Every action by a person, bot or workflow is logged (append-only).
- Messages are kept, never deleted. Access follows the role rules in section 3.

---

## 16. Open questions for George (each with a recommended default)

1. **How releases are approved.** *Default:* the Architect Bot reviews every change. Aqib, as release owner, moves reviewed batches from staging to production. George's tap is also needed for big user-facing changes. Rollback is one step.
2. **Grok Bot plan:** buy SuperGrok Heavy for the single HBS account now, with the on-demand usage card? *Default:* yes, with "improve the model" turned off and a monthly cap (Q10). Drop the roadmap's per-employee Grok Business seats.
3. **Who can see a person's execution rate?** *Default:* the person, their lead and George. Never coworkers, and never shown as a ranking.
4. **Who approves an employee's outbound drafts?** *Default:* the employee approves routine replies themselves. Anything involving money, pricing, contracts, legal or a new commitment goes to the lead (or George above a set amount).
5. **Router "quick answer" limit:** *Default:* about 30 seconds. Anything longer becomes a background job that returns as a task.
6. **Slack DM authorization:** required for everyone at launch? *Default:* yes, required, backed by a written "work Slack is managed" policy everyone acknowledges in-app.
7. **"Never touch" list contents:** *Default:* People & Staffing's list: health/leave/accommodation, harassment or misconduct complaints, pay disputes, discipline/termination, legal claims, immigration/background checks, family matters, passwords. Plus anything between an employee and George marked private. Flagged items go to a restricted HR queue (Darin + George). HR owns the list.
8. **Default personal on-time goal:** *Default:* the company target stays 80% (Operations' existing standard). Each person's default goal is 85%; they may set it higher, not lower.
9. **Day boundaries for remote/shift staff:** *Default:* each person's own shift and time zone defines "today", rollovers and close-out.
10. **Monthly AI budget and alerts:** *Default:* alerts at 50%, 80% and 100% of a George-set monthly budget. At 100%, background jobs that aren't urgent pause. Quick answers keep running.
11. **Uptime target:** *Default:* 99.5% during working hours, reported weekly.
12. **Pilot users:** *Default:* George + Zaid + Don (from the roadmap). The pilot ends when George says the quality bar is met.
13. **Backup AI model.** *Default:* keep Gemini (already in Workspace) as the backup for quick tasks when xAI is down. ⚠ **Flag:** this conflicts with your direction that Grok **replaces** Gemini (the foundation checklist lists Gemini as legacy to retire). Options: (a) keep Gemini only as an emergency backup on a company key with no PHI, or (b) use a second xAI model as the backup and retire Gemini fully. The default stays (a) until you decide.
14. **#automation-team turnaround targets for Aqib:** *Default:* acknowledge within 1 working hour; simple tasks same working day; anything bigger gets split or reassigned.
15. **Who can send must-acknowledge notices?** *Default:* George (company-wide), HR (company-wide with George's OK), leads (own department).
16. **Meeting recording:** turn on Gemini notes by default for all HBS Meet meetings? *Default:* yes for internal meetings. For client meetings, on with the usual notice to attendees.
17. **Request or Report priorities:** who decides what gets built first? *Default:* the AI groups and ranks requests; George approves the top 5 weekly; bug fixes go ahead without waiting.
18. **"Hours AI saved" method:** *Default:* standard minutes per task type (from SOPs/Time Doctor history) minus the person's actual time, shown as an estimate.
19. **Time-off holding replies:** who approves them? *Default:* the named backup.
20. **xAI Zero Data Retention:** turn it on for the production API account? *Default:* yes, since xAI's terms require it for personal data. Keep requests stateless.
21. **Launch date and kickoff format:** *Default:* a Monday after the pilot passes; 30-minute live kickoff led by George; welcome notice and first-week paths ready that morning.
22. **Finance data visibility:** *Default:* finance numbers limited to George and the finance lead. Everyone else sees only their own tasks.
23. **Payment approval threshold.** *Default:* Ahsam may release payments up to $500 that match an approved payee and purpose. Above $500, or any new payee or bank-detail change, needs George plus a call-back check. Payroll stays Dalisu approve → Ahsam release. No AI ever releases money.
24. **HR system of record.** *Default:* a restricted employee record inside DPCP OS (classification, country, start date, signed agreements, onboarding status, backups). Only HR (Darin) and George see the sensitive fields. Signed documents live in a restricted Drive folder.
25. **Attorney review of the Slack/email monitoring policy.** *Default:* yes. Employment counsel for Arizona, South Africa and Pakistan reviews it before cutover. Launch waits on it, and everyone acknowledges the policy in-app.
26. **PTO and backups per person.** *Default:* every person has a primary and a secondary backup, set by their lead before launch (a launch gate). PTO accrual/carryover/notice is decided by you with HR before launch. Holiday calendars for the US, South Africa and Pakistan.
27. **PHI owner and policy.** *Default:* you name one PHI owner (suggest Sadaqat for operations, with you as final say) and approve a one-page stop-gap PHI policy before launch. RCM stays route-and-track (counts and status only) until BAAs are signed.
28. **Stop current PHI exposure now.** *Default:* yes, starting now rather than at launch. No patient data in personal Gmail, Claude, the Netlify tool, or n8n workflows that call Gemini/OpenAI. Transcripts that may contain patient names are paused from AI processing until there's a BAA, or patient names are stripped first.
29. **Coaching sends from your Gmail.** *Default:* drafts are made in your HBS Gmail, Don approves in DPCP OS, and Don or Zaid sends as you. You still personally approve any reply that answers a client question. The prep-confirmation auto-send stays the one standing exception.
30. **WhatsApp vendor chats (procurement).** *Default:* still skipped. Junaid forwards key vendor messages to email so they're captured. Revisit after launch.
31. **James Clinic data (EU/Irish privacy law).** *Default:* only status, counts and exceptions come into DPCP OS. Patient-linked bookkeeping detail stays in the clinic's own systems until a privacy review.
32. **Plain-text credentials.** *Default:* rotate every login posted in Slack or sheets before launch and move them to the vault. The credential detector redacts them on intake.
33. **Pay data visibility.** *Default:* only you, Ahsam, Dalisu and the individual payee. It's never shown by bots in app text, Slack or reports.
34. **Client list conflicts (marketing/coaching).** *Default:* one client record in DPCP OS becomes the source of truth. You confirm the active list once before launch.

---

## Appendix: mockup files
- `mockups/today-desktop.png`: Today (desktop) with focus card, progress, messages strip, wins, private execution rate, chat panel
- `mockups/today-phone.png`: Today (phone, installable web app)
- `mockups/chat-router.png`: Chat with an SOP answer and a router clarifying question
- `mockups/leads-view.png`: Leads view (team queue, blocked/behind, step in/reassign)
- `mockups/ack-popup.png`: Must-acknowledge pop-up

All mockup data is fake (fictional people and practices).
