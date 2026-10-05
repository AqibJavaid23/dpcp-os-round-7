# DPCP OS Prototype, Round 3: Expansion Brief ("complete, not minimal")
**Status: APPROVED by George, Sun Oct 4, 2026 (AZ). Build it.**
For: the Cursor coordinator, after approval. It can run on the existing prototype agent (bc-bf295890) or a new agent on the same repo.
Written Sun Oct 4, 2026 (AZ) by Chief of Staff Bot from George's Oct 4 direction.
Builds on: Round 2, live at https://j68z8ckf.vibedrop.site (branch `round-2`, commit `a0e44b0`). Round 1 is at https://sqzxej84.vibedrop.site.
Required reading (attach with the brief): `prototype-round2-brief.md`, `copilot-module-specs.md`, `design/modules/equipment-copilot.md`, `design/modules/supplies-copilot.md`, `new-location/construction-copilot-module.md`, `billing-team/insurance-module-v1-brief.md`, `automation/technical-design-v1.md` (§3 data model, §7 Time Doctor, §8 security, §16 Copilots, §17 practice staff site).

---

## 0. Why round 3 exists: George's new direction (Oct 4, 2026)
1. **No MVP.** DPCP OS gets built robust and complete before release. Building with AI is cheap, and getting people to adopt new software is the hard part, so it launches once, with everything it needs. Treat every area in this brief as part of the real product, not a demo stub.
2. **Apple-like feel everywhere.** Shama refines the look and feel every day. Her changes update the design guidelines in §2, and every new screen follows them.
3. **The daily cycle the prototype has to support:**
   - **Night:** George reviews the prototype and new inputs and decides on changes. Cursor builds them overnight.
   - **Day (team starts 2-7 AM AZ, works until 4-6 PM AZ):** Manzoor reviews capabilities and how dental and DPCP team members use the software, then suggests changes. Shama reviews look and feel and gets her changes in before end of day. Aqib reviews technical design and how data flows.
   - **Next night:** George sees the prototype with Shama's polish already in, reads Manzoor's and Aqib's notes, and decides the next overnight changes.
4. **Monday (Oct 5) is collection day.** Zaid, Dalisu, Sadaqat, Adil and Manzoor hand off their docs and knowledge to Grok Bot. Anything below marked **[Needs Monday data]** gets filled with real structure (not real names or PHI) after that handoff.

## 1. Ground rules (same as round 2, plus additions)
1. **Do not break rounds 1 or 2.** Build on a new branch `round-3`, branched from `round-2`, and deploy to a **new public URL** that opens with no login on phone and desktop. Leave https://sqzxej84.vibedrop.site and https://j68z8ckf.vibedrop.site exactly as they are. Put the round-3 URL on line 1 of the report.
2. **Keep everything from round 2:** all 15 round-1 fixes and standing rules (round-2 brief §1); the no-login **"tap your name" practice staff site**; the department switcher with all 8 Copilots and every module in `copilot-module-specs.md`, Insurance deepest; both demo flows; the management view; the owner dashboard; and the HDG/Client toggle. Don't regress any of it. Round 3 extends these screens. It doesn't replace them.
3. **Mock data only. Never PHI.** Use the fictional practices in `copilot-module-specs.md` (Copper Canyon, Mesa Verde, Ponderosa = HDG; Saguaro, Lakeview, Red Rock = clients). Use no real client, patient, vendor or employee names, and no pay data. Patient identifiers are fake initials only, on Insurance screens only, with the "PHI stays in the PMS until BAA" badge. Insurance v1 is an execution layer: no RCM automation that touches patient data.
4. **Humans vs AI:** keep **Done by AI** and **Needs a human** visually distinct everywhere. AI work is always something a person directs and approves. Nothing outbound, no money and no commitments happen without a human approval.
5. **Mobile-first PWA:** every new screen gets a phone layout. §3.10 adds a dedicated mobile experience on top of that.
6. **One data layer.** Extend the existing typed mock layer so the new areas share entities (practice, person, role, department, request/ticket, task, checklist, SOP, metric). Don't build separate copies. Name the entities to match `technical-design-v1.md` §3 where they exist (`tasks`, `practice_actions`, `practice_checklists`, `sop_documents`, `time_entries`, `approvals_queue`, `audit_log`, `org_units`).
7. **Mint and NDA firewall.** Don't use, copy or describe MintChecklist's screens, flows, wording or features, and don't add any "modeled on Mint" language. §4 is an empty placeholder that George fills after the approved research. Nothing from a separate NDA-covered program George attended goes into the app, code, specs, prompts or repo. The practice staff site and checklists stay HDG's original design. **Note on the round-2 brief:** its §2.1 heading has been corrected (Oct 4) to "Practice Staff Site (new, separate surface; original design built from HDG's own workflows)." Treat the practice staff site as HDG's original design.
8. Record round-3 decisions in `docs/DECISIONS.md`, add a `docs/round-3.md` changelog, and add `docs/design-guidelines.md` (from §2).

## 2. Starting design guidelines (v0; Shama updates these daily)
Write these into `docs/design-guidelines.md` and a single tokens file (`design/tokens`), so one change to the guidelines updates every screen. Shama's daily changes get recorded there with a date and a one-line reason.
**Feel:** calm, fast and obvious, like a well-made Apple app. Every screen answers "what do I do next?" within 2 seconds.
1. **Layout:** one focal point per screen, generous whitespace, an 8-pt spacing grid, and content max width about 1,100 px on desktop. Cards have soft corners (12-16 px radius), very light shadows and no heavy borders.
2. **Type:** system font stack (SF Pro / Inter fallback). Clear sizes: Large title, Title, Headline, Body, Caption. Never more than 3 sizes on one card. Sentence case everywhere.
3. **Color:** DPCP navy/blue brand tokens, with plenty of neutral grays. Status colors are the same everywhere: green = done/on track, amber = needs attention, red = blocked/overdue/breach, blue = AI working, gray = not started. Full light and dark mode.
4. **Motion:** short and physical, 150-300 ms with ease-out or spring. Sheets slide up from the bottom, and on desktop dialogs scale in slightly from where they were tapped. Respect "reduce motion."
5. **Pop-ups and sheets:** prefer **sheets and inline expansion** to modal pop-ups. Never put a blocking pop-up in front of work (round-1 rule). Confirmation for anything destructive or outbound gets one clear primary button and a quiet Cancel. Toasts include an **Undo** for 5 seconds wherever undo is possible.
6. **Controls:** tap targets at least 44 pt (at least 64 pt on the shared practice site). One primary button per view. Use segmented controls for 2-4 views, swipe actions on list rows (phone), and long-press or right-click for secondary actions.
7. **Navigation:** left rail on desktop, 4-5 bottom tabs plus More on phone, and breadcrumbs only in deep drill-downs. Back always returns to the exact scroll position.
8. **Empty, loading and error states:** every list has a friendly empty state with one next action, skeleton loading (no spinners over 300 ms), and plain-English errors that say what to do.
9. **AI presence:** AI is quiet. It uses the small floating ask icon (round-1 rule), inline "Suggested" chips, and a subtle blue "AI working" shimmer, never a chat panel embedded in a regular page. AI output always carries a small "Drafted by AI" label until a person approves it.
10. **Writing:** short, warm and plain. Use verbs on buttons ("Approve," "Send to Supplies"), never "Submit." No jargon on practice-facing screens.
11. **Accessibility:** WCAG AA contrast, full keyboard navigation, visible focus, screen-reader labels and Dynamic Type-style scaling.
12. **Consistency check:** each round adds a hidden `/design` page (component gallery: buttons, cards, sheets, chips, status pills, tables, empty states) so Shama can review every component in one place.

## 3. The 12 expansions (3.12, the Practice Owner page, added Oct 4)
Each item lists screens, key features, data, who uses it and how it connects. **Build tags:** **[Tonight]** = buildable now with mock data. **[Needs Monday data]** = build the structure tonight with labeled placeholders, then fill it from the Monday handoffs (real structure, still fake names, no PHI).

### 3.1 Company knowledge layer **[Tonight: structure + mock content] [Needs Monday data: real SOPs, roles, systems]**
- **Screens:**
  - **Knowledge home:** one big search box and browse tiles for SOPs, Roles, Who does what, Systems, Departments, Policies and Templates.
  - **SOP page:** steps, owner, last reviewed, linked checklist, linked training module, linked video, "Used in" (which screens and requests use it), version history.
  - **Role page:** purpose, responsibilities, daily/weekly rhythms, KPIs, SOPs, systems used, reports to.
  - **Who does what directory:** search a task ("who approves a lab invoice?") and get the person, role, department and backup.
  - **Systems catalog:** each tool (PMS types, payer portals, Slack, Drive, Time Doctor, n8n and so on), what it's for, who owns it, how to get access (links to the IT Copilot's access request).
  - **Coverage view:** SOP coverage by department and role (has SOP / draft / missing), with "No SOP yet" gaps feeding a task list.
- **Key features:** instant search with typo tolerance and filters (department, role, practice type HDG/Client); an AI answer card on top of results ("Here's how, from SOP X, step 4") with sources; "Suggest an edit" (goes to Review); review-due reminders; ownership and version history.
- **Feeds suggestions everywhere:** every task, ticket, checklist and request screen shows a small "Related SOP" chip and AI suggestions grounded in the library. A step with no SOP shows "No SOP yet. Create one?"
- **Data:** `sop_documents` (title, body, steps, department, roles, owner, review_due, version, linked_checklist_ids, linked_training_ids), `roles`, `systems`, `responsibilities` (task → role → person + backup).
- **Who uses it:** everyone. HBS team, practice staff (read-only, from the staff site's Help tile), leads (owners of SOPs), George.
- **Connects to:** AI everywhere (3.8, grounding), Training (3.6, modules are built from SOPs), Checklists (staff site), Tickets and requests (3.3/3.11, related SOP), Admin (3.9, who can edit).
- **Monday handoff fills it:** Zaid's and Dalisu's management files and trackers, Sadaqat's RCM department docs, Adil's billing workflow walkthroughs, Manzoor's AI-adoption and security work. Tonight, seed it with 25-40 realistic fake SOPs across all 8 departments plus practice roles, clearly labeled "Sample."

### 3.2 A daily view for every practice role **[Tonight]**
- **Screens:** a role-specific **"My Day"** on the practice staff site after tapping your name, plus a fuller signed-in version for office managers and doctors in the app:
  - **Front desk:** today's huddle notes, check-in/confirmation tasks (counts only, no patient data), call-to-patient quick marks (Marketing 7.4), insurance verification status counts from Insurance, open requests, opening/closing checklists.
  - **Hygienist:** room setup and sterilization checklists, supply low-stock flags for their op, equipment issues for their room, training due, shout-outs.
  - **Assistant:** sterilization and op turnover checklists, instrument cassette status, lab case reminders (counts only), supply requests, training sign-offs.
  - **Office manager:** the practice's checklist completion, who's in today and coverage gaps, open tickets by department, approvals waiting (orders over limit, cart approvals), staff training progress, today's numbers.
  - **Doctor:** a short day brief: production goal vs scheduled (mock), decisions needing them (clinical substitutions, hires, equipment), open issues in their ops, team wins.
- **Key features:** the same three-part structure as Today (Preview of the day, To-do, Completed) so every role feels the same; items come from checklists, tickets, Copilot tasks and announcements; the dull-to-filled checkmark (round-1 fix 5); "Not you?" switch and 5-minute idle reset kept.
- **Data:** `practice_roster` (display name + role only), `practice_checklists`, role → default daily template mapping, tasks and tickets filtered by practice and role.
- **Who uses it:** practice staff at HDG and client practices (identical experience).
- **Connects to:** checklists, tickets (3.11), training (3.6), performance (3.4 rolls up completion), mobile (3.10, doctor and manager on phone).
- **[Needs Monday data]:** real role checklists and huddle formats from the ops managers' handoff replace the samples.

### 3.3 Full request lifecycle **[Tonight]**
- **Screens:**
  - **Request timeline (one per request):** every step from submission to done. Submitted (who, where, when) → Triaged (AI picks department and type, with confidence) → AI working (what AI did) → With a specialist (named owner) → Waiting on practice → Done → Rated.
  - **SLA and escalation panel:** time to first response and time to resolve, each with a countdown and color. Escalation ladder: owner → department lead → team leader → George, each with its trigger time.
  - **Satisfaction prompt:** when a request is done, the requester gets a 1-tap rating (😞 😐 🙂 😀, or 1-5) plus an optional comment. A low score automatically opens a follow-up task for the department lead.
  - **Request analytics (leads and George):** volume by department and type, median response/resolve time, SLA breach %, satisfaction average, AI-resolved %, re-opened %.
- **Key features:** the routing table from `copilot-module-specs.md` §0; reassign to another department with a reason; "Waiting on you" pauses the SLA clock; reopen within 7 days; every status change notifies the requester on the staff site; and "AI already did" context on every human task (round 2 §2.2).
- **Data:** `requests` (id, practice, requester staff, device, department, type, priority, status, owner, sla_policy_id, timestamps per stage, rating, comment), `sla_policies` (per department × type × priority), `escalations`, `request_events` (timeline).
- **Who uses it:** practice staff (submit, track, rate), HBS department staff (work it), leads (SLAs, escalations), owners and George (analytics).
- **Connects to:** the ticketing page (3.11) is the department-sorted view of this same request object (one record, not two systems). Also Today (human tasks), Review (AI deliverables), Communication (replies), performance (3.4), workforce (3.5 execution rate).
- **Keep both round-2 demo flows** and extend demo flow 1 to end with Maria rating the request.
- **[Needs Monday data]:** real SLA targets per department and the escalation contacts. Tonight, use labeled sample SLAs (for example, urgent equipment: first response 15 min, resolve 1 business day).

### 3.4 Practice performance dashboards **[Tonight]**
- **Screens:**
  - **Portfolio view (George, leads):** every practice as a card with HDG/Client tag and a health score made of collections vs goal, checklist completion, open issues, SLA breaches and satisfaction. Cards are sortable and filterable.
  - **Practice detail:** number tiles (score + goal + trend arrow, no bar graphs, per round-1 rule 7), checklist completion by checklist and by person, open issues by department, 12-week trend lines for the key numbers, and recent alerts.
  - **Alerts center:** rules such as "checklist completion under 80% two days running," "AR 90+ up 3 weeks in a row," "equipment down over 24 h," "satisfaction under 3.5 this week." Each alert has an owner, acknowledge and a suggested action.
- **Key features:** compare practices side by side; HDG benchmarks shown to client practices (anonymized averages); AI one-line explanations ("Collections down 6% mostly from 3 unposted ERA batches"); and exporting a monthly practice report into Review.
- **Data:** `practice_metrics` (daily snapshots), `alert_rules`, `alerts`, and roll-ups from checklists, requests, Insurance, Accounting and Marketing modules (all mock).
- **Who uses it:** George, department leads, practice owners (own practice only, extends the round-2 owner dashboard), office managers.
- **Connects to:** owner dashboard (2.6), each Copilot's pulse, requests (3.3), mobile (3.10).
- **[Needs Monday data]:** which numbers each practice actually tracks (from the ops managers' trackers) and the alert thresholds.

### 3.5 Workforce management **[Tonight: structure + mock] [Needs Monday data: real tracker structure from Zaid and Dalisu]**
- **Screens:**
  - **My work (each person):** today's task list (the daily list, which replaces "one task at a time"), time tracked today, start-of-day "I'm starting" button, end-of-day summary.
  - **Team board (leads):** per person: started at, active time, tasks planned vs done, execution rate (done on time ÷ planned), blockers, idle incidents (count only).
  - **Daily report:** the end-of-day report per team. One page per person: first/last activity, time by task/project, top apps, idle incidents, comparison to yesterday, AI-written description, plus the pre-send checks ("no Invalid Date, every person accounted for"). This matches `technical-design-v1.md` §7.
  - **Execution trends:** 4-week execution score vs goal per person and team (score + goal format).
  - **Practice staff version:** shifts, who's in, coverage gaps, checklist completion per person and training progress. This is not Time Doctor; practice staff are tracked by checklist and task completion only.
- **Key features:** time computed in code and AI describes only (George's TD rule); "Done by AI vs done by a human" share and hours saved per person (George's AI-use metric); "system failure" labels never blamed on the employee; daily report preview in Review before it goes out.
- **Data:** `time_entries` (mock Time Doctor worklogs, idle incidents), `tasks`, `daily_plans`, `execution_scores`, `shifts` (practice staff).
- **Who uses it:** HBS team members (own view), leads, ops managers (Zaid, Dalisu), George (all teams). Practice office managers see the practice-staff version.
- **Connects to:** Growth > Execution (round 1), My Teams Leader view (round 2 §2.5), Insurance Biller Scorecard (1.9), the HBS bots' daily cycle (start-of-day check-in, end-of-day update to George's bot, nightly report).
- **Privacy:** screenshots aren't shown in the prototype; the app shows counts and descriptions only. RCM staff get metadata only (D13).

### 3.6 Training and onboarding **[Tonight]**
- **Screens:**
  - **Paths by role:** front desk, hygienist, assistant, office manager, doctor (practice side), and each HBS department role. Each path has modules in order, due dates and sign-offs.
  - **Module player:** short SOP video (placeholder player with captions), the SOP text beside it, then a 3-5 question quiz. Pass mark shown; retake allowed.
  - **Checklist tie-in:** a module unlocks or certifies a checklist ("Passed Sterilization 101 → can sign off the weekly sterilizer check"). A failed or expired certification flags the checklist.
  - **New-hire tracker:** first-week checklist, 30-day modules, day 7/30/90 check-ins (reuses Staffing 4.5).
  - **Manager view:** completion by person, overdue modules, quiz scores, who's certified for what.
- **Key features:** micro-lessons (under 5 minutes), progress rings, "Ask about this SOP" (AI answers from the knowledge layer), and supervisor sign-off for skills that need a human check.
- **Data:** `training_paths`, `training_modules` (linked sop_id, video_ref, quiz), `quiz_attempts`, `certifications` (person, module, expires_at), `checklist_requirements`.
- **Who uses it:** new hires and existing staff at practices; HBS team; office managers and leads (assign and sign off); Staffing Copilot (placement onboarding).
- **Connects to:** knowledge layer (3.1), practice role daily view (3.2, "training due"), checklists, Staffing 4.5, performance (3.4, training completion).
- **[Needs Monday data]:** HDG's real DA Development Program and skill sign-off checklists (Staffing folder) and the HBS role training from the ops managers.

### 3.7 Client practices **[Tonight]**
- **Screens:**
  - **Client onboarding:** pick services (any of the 8 Copilots), connect systems (PMS type, portals, etc. as a checklist), enroll practice devices, import the roster, sign agreements (status only).
  - **Service tiers:** a plan page per client showing which Copilots and tier they're on (labeled sample tiers, for example Essentials / Growth / Full Partner), what's included and an upgrade request.
  - **Client billing:** invoices from HBS/DPCP (activity counts by client and service), payment status, failed payments, statement history (reuses Accounting 6.5).
  - **Client account view (HBS side):** contacts, services, SLA tier, satisfaction, health, renewals and cross-sell suggestions (for example, Staffing → Insurance).
- **Key features:** the **same experience** as HDG practices (round-2 rule), with only data and the HDG/Client tag changing; tier-based SLAs flow into requests (3.3) and tickets (3.11); a client owner sees only their own practice.
- **Data:** `organizations` (kind = owned / client), `client_services`, `service_tiers` (mock), `invoices`, `client_contacts`.
- **Who uses it:** client practice owners and office managers, HBS account owners and department leads, Accounting, George.
- **Connects to:** HDG/Client toggle, owner dashboard, Accounting, every Copilot (service entitlement), admin (3.9 tenancy).
- **[Needs Monday data]:** the real list of client services (Sadaqat's client systems list) and George's pricing decisions. Pricing in the prototype is labeled "Sample, not real pricing."

### 3.8 AI in every screen **[Tonight]**
- **Screens and patterns:**
  - **Ask anything:** the floating ask icon (kept) opens a sheet that knows the current screen ("You're looking at Saguaro's AR board"). Answers cite sources (SOP, record, report).
  - **Draft anything:** a "Draft with AI" action on every text field that leaves the company (replies, letters, posts, reports) and "Edit with AI" (round-1 fix 10). Drafts always go to Review or an approval step before sending.
  - **Suggested next steps:** 1-3 quiet chips at the top of each work screen ("3 claims ready to submit," "Gloves at Copper Canyon will run out Thursday: build the cart?").
  - **Bot work, visible:** an **AI Activity** page (and a small counter on each department home) showing what the bots did, are doing and want approved, with status, time, inputs (IDs only) and outputs. Each item can be approved, sent back with feedback or undone where possible.
  - **Approvals inbox:** one place for every AI action waiting on a person, grouped by risk (outbound, money, commitment, data change), with approve / edit / reject and a required reason on reject.
- **Key features:** every AI action is logged; "Done by AI / Needs a human" labels; per-user AI usage-versus-output (no spend cap, per technical design); and George's AI-use % metric per person.
- **Data:** `bot_jobs`, `router_requests`, `approvals_queue`, `ai_activity` (mock feed).
- **Who uses it:** everyone; leads and George own approvals for their areas.
- **Connects to:** knowledge layer (grounding), Review, every Copilot module, workforce (AI-use metric), admin (audit, permissions on who can approve what).

### 3.9 Admin and security **[Tonight: screens with mock data] [Needs Monday data: real role list from the ops managers, Manzoor's security work]**
- **Screens:**
  - **People and roles:** users, roles (employee, lead, admin, release, practice owner, practice staff), team assignments (a person can lead one team and belong to another).
  - **Permissions matrix:** role × area × action (view / edit / approve / admin), with presets and a "what can this person see?" preview.
  - **Audit log:** searchable record of who did what, when, from where (user, practice device or bot), with filters and export. Admin reads of message bodies are flagged.
  - **HIPAA and data controls:** the PHI rule (no PHI until BAA, Insurance link-outs only), BAA register (vendor, status, date), PHI screen hits (count only), data retention settings, access reviews due, MFA coverage, and the privacy notice employees acknowledge.
  - **Practice devices:** enrolled devices per practice, last seen, expiry, revoke now, PIN rules per practice (from technical design §17).
  - **Integrations:** status cards for Google Workspace, Slack, Time Doctor, n8n, the AI provider (Grok primary, Gemini backup), PMS link-outs and Stripe/QuickBooks, each with health, last sync, owner and connect/disconnect (mock). Changes to production automations show the "George approves" gate (technical design §7b).
  - **Kill switches:** feature flags per module and per automation.
- **Key features:** least privilege by default, separation of duties for money (requester / approver / releaser), one-step rollback for automation changes, and security findings with owner and due date.
- **Data:** `employees`, `roles`, `permissions`, `audit_log`, `baa_register`, `practice_devices`, `connected_accounts`, `app_flags`, `security_findings`.
- **Who uses it:** George (admin), Ahsam (access and connectors), Aqib (release, technical), IT Copilot, leads (read-only for their teams).
- **Connects to:** everything; IT Copilot 5.3/5.4 (security and access); AI approvals (3.8); client tenancy (3.7).

### 3.10 Mobile version for doctors and managers **[Tonight]**
- **Screens (phone-first, installable PWA, separate "DPCP OS Mobile" home):**
  - **Brief:** a morning card with today's 1-3 decisions, practice health tiles, alerts.
  - **Approvals:** swipe right to approve and left to send back with a note (with a confirm sheet for money and outbound).
  - **Practices:** portfolio list and practice detail (from 3.4) in a compact layout.
  - **Tickets:** open tickets for their practice or department, quick reply, escalate.
  - **Team:** who's in, coverage gaps, wins, quick shout-out.
- **Key features:** push notifications (mock) for alerts, escalations and approvals; Face ID-style quick unlock look (mock); big thumb-reach controls; offline read of the last brief; and voice-to-text for quick notes.
- **Who uses it:** practice doctors and owners, office managers, HBS department leads, George.
- **Connects to:** performance (3.4), approvals (3.8), tickets (3.11), practice role views (3.2).

### 3.11 Ticketing page by department **[Tonight]**
- **Screens:**
  - **Practice side ("Get help" on the staff site and app):** pick a department tile, choose a ticket type for that department, add description, optional photo and urgency, and submit. The confirmation shows the department, the ticket number, the expected first-response time and "AI is on it" or "A person will help." **My tickets / All office tickets** show status, owner department, last update, SLA and the timeline. The practice can reply, add info, and rate when closed.
  - **Department queues (HBS side):** one queue per department with its own columns (New → Triaged → In progress → Waiting on practice → Resolved → Closed), SLA timers, priority, assignee, bulk actions, saved views and an escalation lane.
  - **All tickets (leads, George):** every department's queue in one view, with filters by practice, department, priority, SLA status and HDG/Client.
- **Departments:** Equipment, Supplies, Staffing, Insurance (incl. billing and RCM questions), IT, Accounting, Marketing, Construction (incl. Facilities), plus **HR/People** (sensitive matters go to a restricted queue), **Compliance and Safety** (OSHA, infection control, HIPAA questions), **Training**, **DPCP OS Feedback** (bugs and ideas about the software, feeding the existing Ideas & Roadmap board), and **Other** (AI triages to the right place).
- **Key features:** each department gets its own ticket types, SLA policy (by priority and client tier), escalation ladder, canned replies and AI first step (from the routing table); auto-routing with confidence, plus a "wrong department" move with a reason; duplicate detection ("Op 7 chair was reported 20 min ago by Ana: add to it?"); internal notes kept separate from practice-visible replies; and satisfaction rating on close.
- **Data:** this uses the same `requests` object as 3.3, with `department`, `ticket_type`, `visibility` (practice-visible vs internal), `sla_policy_id`, `escalation_level`, `duplicate_of`. Also `ticket_types` per department and `canned_replies`.
- **Who uses it:** practice staff and managers (submit and track), HBS department staff (work queues), department leads (SLAs and escalations), George (all).
- **Connects to:** the request lifecycle (3.3, same record), each Copilot's module screens (for example an Equipment ticket links to the asset in 2.4 Install & Service Desk), Today (human tasks), knowledge layer (related SOP and suggested fix), performance (3.4 open issues), mobile (3.10).
- **Sample data:** at least 40 mock tickets across all departments and the 6 fictional practices, with a realistic mix of statuses, 3-4 SLA breaches and 2 escalations.
- **[Needs Monday data]:** real ticket types and SLA targets per department, and who owns each queue.

### 3.12 Practice Owner page: DPCP value on top, Balance Assessment below **[Tonight: full page with mock data] [Needs George: answers to the open questions at the end]**
*Added Oct 4 at George's request. This redesigns the round-2 **Owner dashboard (2.6)** in place, on the same "Practice Owner" role, URL and HDG/Client toggle. It replaces 2.6's layout but keeps every 2.6 element (practice health, What DPCP is handling, needs-the-owner, daily update card). Source for the Balance Assessment: George's own framework, the two documents he sent a coaching client on Jun 28, 2026, and his Sep 22 call about putting it on a practice dashboard. Full write-up: `docs/balance-assessment/balance-assessment-understanding.md` (names anonymized); the framework itself is in `docs/balance-assessment/practice-balance-assessment-form.md` and `...-guide.md`. Mock data only. No real client names, and nothing from the Mint/NDA firewall (§1.7).*

**What the page is for.** A practice owner opens one page and sees two things in order: (1) **proof of what DPCP is doing for their practice** (work handled, money recovered and saved, time given back, wins, progress since joining), then (2) **where the practice is weakest relative to itself** (the Balance Assessment) and the **one priority** to work on this month, with DPCP services linked to fix it. The top builds trust. The bottom tells the owner what to do next, and shows that DPCP is already on it.

#### A. Layout, top to bottom (desktop; phone stacks the same order)
0. **Header:** practice name, HDG/Client tag, month picker (default: last full month), "Export monthly report" (goes to Review, see F). A slim **"Needs you"** strip shows 0-3 approvals or signatures from 2.6. If there are none: "Nothing needs you today."
1. **Value hero:** one sentence and three big tiles. Sample: "In September, DPCP handled **186 items** for Copper Canyon." Tiles: **Recovered** ($), **Saved** ($), **Time given back** (hours). Each tile has a small "How we counted" link that opens a sheet with the line items.
2. **By department:** one card per DPCP department the practice uses (the 8 Copilots: Insurance, Equipment, Supplies, Staffing, IT, Accounting, Marketing, Construction/Facilities). Each card shows 2-3 counts for the month and one outcome number with goal and trend arrow, using that Copilot's key metrics from `copilot-module-specs.md`. Samples: Insurance "412 verifications before the visit · 9 appeals · $18,400 recovered · days in AR 41 → 33"; Supplies "3 carts · $460 saved vs your old distributor · 0 stockouts"; IT "11 tickets resolved · median fix 3 h · backups 100%"; Marketing "38 new patients seen from campaigns · $142 per new patient"; Staffing "1 hygienist placed in 19 days"; Equipment "2 repairs · warranty covered $1,250"; Accounting "Books closed by day 6 · P&L review delivered"; Facilities "4 work orders closed". Departments the practice isn't on show one quiet "Available: see what Staffing can do" card at the end (client tiers, 3.7), not an empty card per department.
3. **Service quality strip:** requests handled, median first response, % resolved by AI, satisfaction average (from 3.3/3.11). Score + goal format.
4. **Progress since joining DPCP:** 4 tiles with the baseline (onboarding month) vs now and a trend arrow. Samples: AR 90+ %, days in AR, supply cost % of collections, new patients per month. Tap a tile for a 12-month trend.
5. **Wins:** a short feed of 3-5 plain-English wins: DPCP's ("Appeal won: $2,340 crown claim"), and the practice team's from shout-outs ("Hygiene reappointment hit 91%, a new high"). Marked "Done by AI" or "By your DPCP team" where relevant.
6. **Bridge card** (between value and assessment): "**Your top opportunity this month:** Part 1, Patient flow. Active patients on recare is 58% (target 70%+). **DPCP is on it:** reactivation campaign (Marketing), 'Book at the chair' training for hygiene (Training). Review on Nov 3." This connects the two halves.
7. **Balance Assessment** (section B below): summary table first, then the five parts in detail.

#### B. Balance Assessment section: reproduce the framework faithfully
**What it is (show a one-line explainer at the top of the section):** "A practice earns money through a chain: patients arrive, get examined, accept treatment, get scheduled, and pay. The Balance Assessment uses ratios to find the weakest link in your own practice, so you fix one thing at a time, in the right order." It compares the **practice against itself over time, never against other practices.** No ranking or peer comparison appears in this section. (3.4 benchmarks stay on the performance pages.)

**B1. Practice profile row** (the form's header): # of doctors, # of hygienists, # of operatories, monthly collections, active patient base, period (one full calendar month), reviewer (coach or office manager), date.

**B2. Status key** (the form's own key): ✓ green = at or above target · ! amber = close to target, monitor · ✗ red = below target, action required. Use the per-metric bands in the table below (from the Guide). Where the Guide doesn't give a band, the default is the form's "within 10% of target = amber" rule. 5.5 is diagnostic only and shows a gray "Diagnostic" pill, never a pass or fail.

**B3. Summary table (color-coded, the first thing in the section):** 5 rows (Parts 1-5), each with a part status (worst metric in the part), the count of ✓/!/✗, and the worst metric named. Under it, the **Highest Priority Imbalance** box (from the form): Part · Metric · Value · Target · Resolution plan · Review date. Show a 6-month strip of part status per month (colored dots), so the owner sees the trend against themselves.

**B4. The sequence rule (core logic, show it visually as a left-to-right pipeline: Part 1 → 5, "highest priority" to "lowest priority"):** the **first part (in order 1→5) with a ✗ metric is the only priority this month.** Everything to its right is grayed and labeled "secondary until Part N has a plan." The UI shows **one priority per month**, never a list of 20 fixes. Copy on screen: "A practice can't convert its way out of a patient-flow problem, or collect its way out of a conversion problem. Start at the highest imbalance." If no part has a ✗, the first part with a ! shows as "Watch" (see open question 4).

**B5. The five parts and 25 metrics.** Each row shows: metric name, the practice value, the target, a status pill, a 12-month sparkline, and a per-provider breakdown where marked (P). Formulas and bands come from the Guide:

| # | Metric | How it's calculated | Target (✓) | Amber (!) | Red (✗) |
|---|---|---|---|---|---|
| **Part 1, Patient flow** | *"The ceiling on everything else."* | | | | |
| 1.1 (P) | New patients per doctor / month | New patients seen ÷ FT doctors (FT = 4 days/wk ≈ 16 days/mo, prorate part-time) | 30-40 | 20-29 | < 20 |
| 1.2 (P) | Exams per doctor / month | Exams ÷ doctors, per doctor | 120-150 | 90-119 | < 90 |
| 1.3 (P) | Exam split between providers | Exams Dr A ÷ Dr B, normalized for days worked | within 15% | 15-25% | > 25% |
| 1.4 | Doctor days : hygiene days | Doctor days ÷ hygiene days per month | 1 : 2 or more hygiene | 1 : 1.5-2 | below 1 : 1.5 |
| 1.5 | Active patients current on recare | Active pts with a future hygiene appt ÷ active pts | 70%+ | 60-69% | < 60% |
| 1.6 | New hygiene appt availability | Days until 3 hygiene openings can be offered to a new patient | within 2 wks | 2-3 wks | > 3 wks |
| 1.7 | Hygiene reappointment rate | Pts leaving hygiene with a future appt ÷ hygiene pts seen | 90%+ | 80-89% | < 80% |
| 1.8 | New patient reappointment rate | New pts booking a 2nd appt before leaving ÷ new pts seen | 75%+ | 65-74% | < 65% |
| 1.9 | No-show & cancellation rate | Appts not kept ÷ appts scheduled (lower is better) | < 10% | 10-15% | > 15% |
| **Part 2, Treatment conversion** | *All per doctor (P).* | | | | |
| 2.1 (P) | Patient acceptance rate | Pts accepting any tx ÷ pts given a recommendation | 75-80% | 65-74% | < 65% |
| 2.2 (P) | Treatment dollar acceptance | $ accepted ÷ $ presented | 35-50% | 25-34% | < 25% |
| 2.3 (P) | Treatment accepted per exam | $ accepted ÷ exams | $300-500 | $200-299 | < $200 |
| 2.4 (P) | Treatment presented per exam | $ presented ÷ exams | $400-600 | $250-399 | < $250 |
| **Part 3, Schedule efficiency & provider capacity** | | | | | |
| 3.1 (P) | Doctor production per hour | Doctor collections ÷ doctor chair hours (FT ≈ 139 h/mo) | $700+/h (floor $550, elite $1,000+) | $550-699 | < $550 |
| 3.2 (P) | Restorative appt availability | Days until 3 crown-level openings, per doctor | within 2 wks | 2-3 wks | > 3 wks |
| 3.3 | Hygiene % of total production | Hygiene collections ÷ total collections | 20-30% | below 20% (hygiene underdeveloped) or above 30% (doctor underproducing) | extreme variance from the band |
| **Part 4, Hygiene production quality** | | | | | |
| 4.1 | Perio % | Perio visits (SRP, perio maintenance, any non-prophy) ÷ hygiene visits | 17-20% | 10-16% | < 10% |
| 4.2 | Fluoride % (by hygienist too) | Fluoride delivered ÷ hygiene visits | 45-50% | 30-44% | < 30% |
| 4.3 | Hygiene production per day | Hygiene collections ÷ hygiene days | $1,200-1,600 assisted / $800-1,000 unassisted | within 15% of target | below that |
| 4.4 | Hygiene production per hour | Hygiene collections ÷ hygiene chair hours | $200-250 assisted / $150-200 unassisted | within 15% of target | below that |
| **Part 5, Accounts receivable** | *"Recovers existing revenue; doesn't create new revenue."* | | | | |
| 5.1 | Collections rate | Collections ÷ production net of contractual write-offs | 95%+ | 90-94% | < 90% (form: < 88% = active billing problem) |
| 5.2 | Total AR : monthly production | Total AR ÷ avg monthly production (lower is better) | < 1 : 1 | 1-1.5 : 1 | > 1.5 : 1 |
| 5.3 | AR over 90 days | AR 90+ ÷ total AR (lower is better) | < 10% | 10-15% | > 15% |
| 5.4 | Days in AR | Total AR ÷ avg daily production (lower is better) | < 30 | 30-45 | > 45 |
| 5.5 | Insurance vs patient AR split | Insurance AR ÷ patient AR | Diagnostic: show which side is aging | one side disproportionately high | patient side aging badly |

(The Guide's 5.1 red line is "below 90%" and the form says "below 88% = active billing problem." Show red below 90% and add the 88% note in the detail sheet.)

**B6. Metric detail sheet (tap any row; a sheet slides up, per §2.5):** the Guide's text for that metric: what it measures and why it matters, how to calculate it, the source report (Production & Collections, AR Aging, Hygiene Reappointment, New Patient, Provider Production Detail), the three bands, **"If red, what to do"** (the Guide's text, in plain words), related metrics ("check 1.4 and 1.6 first"), the 12-month trend, and the per-provider split. A small "Measured as" line shows the substitute metric when the PMS doesn't have the exact one (see D3).

**B7. Pattern detection (AI, labeled "Suggested by AI"):** when the numbers match one of the Guide's 5 common patterns, show one chip on the summary: (1) strong production, weak collections → Part 5 billing audit; (2) full schedule, low production per hour → root cause in Part 2, not Part 3; (3) low new patients, good retention → check 1.6 first, then marketing reach; (4) multi-doctor imbalance → per-doctor intervention; (5) high cancellations + low reappointment → commitment at the chair and short-call list. The AI explains and never changes a status. Status is computed in code from the bands.

**B8. Symptom vs cause:** if a lower-part metric is red but a higher part is also failing, tag it "Likely a symptom of Part N" (the Guide's example: low hygiene production per day caused by thin patient flow is a Part 1 problem, not a Part 4 problem).

**B9. Notes per part:** the form's "Notes & Observations" box under each part, editable by the coach or owner, kept per month.

#### C. How owners act on results (the monthly loop, from the Guide's "running it as a team")
1. **Monthly review mode** (one button, "Start monthly review"): walks the summary → the highest priority → a resolution plan → a review date. The practice manager owns the data. The doctors own the clinical metrics (Part 2, by provider).
2. **Resolution plan** (one per month, only for the priority metric): what we'll do, owner, DPCP help requested, **review date (default 30 days)**, status. Lower parts can't get a plan until the higher imbalance has one ("documented resolution plan and measurable progress").
3. **"Get DPCP help"** on the priority (and on any red metric's sheet): opens a prefilled request (the 3.3/3.11 request object) to the mapped department, with the metric, value and target attached. That request then shows on the bridge card ("DPCP is on it") and in the value section next month when it's done.
4. **Review date:** on the date, the page shows "Did it work?" with the metric's before and now. Then: resolved → move to the next imbalance, or keep the plan.
5. **History:** the past plans and results stay on the page ("what worked, what didn't"). The Guide calls this the practice's operating intelligence.

**Map from weak area to DPCP help** (label these "Suggested," editable by George; the source SOPs are HBS's own Coaching Clients Docs in Drive):
| Weak area | DPCP help to suggest |
|---|---|
| 1.1 / 1.6 new patients, availability | Marketing Copilot (campaigns, call answer rate, call-to-patient match); if 1.6 or 1.4 is red, **Staffing Copilot first** (add hygiene days before marketing spend, per the Guide) |
| 1.4 doctor:hygiene ratio | Staffing Copilot (hygienist requisition) |
| 1.5 / 1.7 / 1.8 recare and reappointment | Training (3.6) "book at the chair" module; SOPs: Overdue Recare Protocol + Tracker, Patient Reactivation Script + CRM Tracker, Morning Huddle SOP; Marketing reactivation campaign |
| 1.9 no-shows | Front desk training: confirmation protocol and short-call list; New Patient Call SOP |
| 1.2 / 1.3 exams and split | Coaching: scheduling allocation between doctors |
| Part 2 conversion | Coaching: Case Acceptance SOP, Treatment Coordinator / Patient Care Coordinator role; financing offered above a set dollar threshold |
| Part 3 production per hour, restorative availability | Coaching: protect restorative blocks; Staffing Copilot if a second provider is needed |
| Part 4 perio, fluoride, hygiene production | Training: hygiene clinical standards modules; Incentive-Based Hygiene Compensation Model (SOP) |
| Part 5 AR | **Insurance Copilot (DICP):** Claims Workbench (submit within 24-48 h), AR Follow-up Board (60-90 day bucket), Denials & Appeals; patient AR → checkout financial conversation training; Accounting KPI view |

#### D. Data needs
1. **Value section:** from existing objects, not new copies: `requests` (handled, by department, SLA, rating), `ai_activity`/`bot_jobs` (Done by AI), `practice_metrics` (snapshots), each Copilot's mock module data. New: `value_events` (practice, month, department, type = recovered / saved / time, amount, method, source record id). Every dollar or hour links to its records, and **estimates are labeled "Estimate"** (for example, hours given back = handled requests × `ticket_types.standard_minutes`, sample values, George to confirm). A `practice_baselines` record is captured at onboarding for the "Progress since joining" tiles.
2. **Balance Assessment:** `balance_metric_definitions` (id 1.1-5.5, part, name, formula, inputs, unit, direction higher/lower/band, bands green/amber/red, per_provider flag, intent text, if-red text, related metrics, source report); `balance_assessments` (practice, month, reviewer, profile fields, status per part, priority part/metric); `balance_values` (assessment, metric, provider_id nullable, value, status, substitute_used); `resolution_plans` (practice, month, part, metric, plan text, owner, linked request ids, review_date, outcome); `assessment_notes` (per part per month); `providers` (fake names, doctor or hygienist, FT/PT, assisted or unassisted).
3. **Inputs, one full calendar month** (from the Guide): new patients; exams by doctor; hygiene visits; doctor days per doctor; hygiene days; active patients; active patients with a future hygiene appt; hygiene reappointment; production and collections (total, by doctor, hygiene); tx presented and accepted by doctor; AR total and aging buckets; insurance vs patient AR; appointments scheduled vs kept; perio and fluoride visit counts; chair hours; openings for 1.6 and 3.2.
4. **Metric substitution ("intent over label"):** each definition has an `intent` field and can map to an equivalent PMS metric (for example dollar acceptance ↔ % acceptance). The detail sheet shows "Measured as: ___." George was explicit on this.
5. **Prototype:** seed 12 months of mock assessments for the 6 fictional practices, using fake provider names. Copper Canyon (HDG): Part 1 priority (1.5 recare 58% ✗, 1.7 82% !), showing a plan from last month that moved 1.7 from 78% to 82%. Saguaro (client): Part 1 healthy, Part 2 red (2.4 $230 per exam), with the Pattern 2 chip. Lakeview: Part 5 only (Pattern 1). Aggregates only, no PHI. Real PMS feeds come later, and the page says "Sample data" until they do.
6. **Manual entry mode:** a form view that mirrors the fillable form, for practices without a PMS feed and for 1.6/3.2 (counted by checking the schedule). The coach or office manager fills it in, and it saves as that month's assessment.

#### E. Visual and interaction rules
Follow §2: score + goal + trend arrow tiles, status colors (green/amber/red, gray for diagnostic), sheets not pop-ups, one primary button ("Start monthly review"), sentence case, warm plain words. Use no peer ranking in the Balance section. The value section never claims money without a "How we counted" trail. Phone layout: value hero tiles in a swipe row, department cards as a list, summary table as 5 stacked part rows with dots, the metric table collapsed per part. The same page appears in Mobile (3.10 → Practices → practice → Owner).

#### F. Monthly report (PDF)
"Export monthly report" builds a PDF of the whole page (value section + Balance summary + the five parts + the plan). It lands in **Review** first ("Drafted by AI" until a person approves) and is never sent automatically. On approval it goes to the practice's DPCP coach and owner (per George on Sep 22: "send that as a PDF once a month to each coach").

#### G. Open questions for George
1. Does this **replace** 2.6's layout (my assumption) or sit as a new tab next to it?
2. **Who is the "coach"** in DPCP OS: the client's HBS coach (Zaid/Dalisu's team), a new "Practice Coach" role, or the office manager? This decides who reviews and receives the monthly PDF.
3. **Practice basics:** on Sep 22 you put the assessment under collections, new patients and provider production (with collections by month as a **bar graph**). Round-1 rule 7 bans bar graphs on score cards. Do you want a "Practice numbers" block between the value section and the assessment, and is a bar chart OK there?
4. **Priority logic:** the first part with a red (✗) is the priority. If nothing is red, should an amber in a higher part outrank everything (my default: show it as "Watch," not "Priority")?
5. **Targets:** fixed to the Guide's targets for every practice, or can a coach adjust them per market (the Guide hints the practice learns its "natural ceiling")?
6. **Value math:** OK to show "Time given back" as an estimate from standard minutes per ticket type? And should "Saved" count only verified savings vs a prior price, or also avoided costs?
7. **Name on screen:** "Balance Assessment" as-is for owners, or something friendlier ("Practice balance")?
8. **Client visibility:** same page for client practices (round-2 rule: identical experience), including the Balance Assessment for every tier, or only on certain service tiers (3.7)?
9. Should the **department help map** above stand, especially Coaching as its own area (it isn't one of the 8 Copilots today)?

## 4. MintChecklist research: PLACEHOLDER (no content yet)
- **Status:** separate research, pending George's review. Nothing from it goes into this round.
- **Process:** findings go to **George first** as a high-level overview. George decides what changes, and only his decisions (written as HDG's own requirements, in our own words) go into a later overnight build. Manzoor then reviews capabilities, and Shama reviews look and feel.
- **This round:** **build nothing from Mint.** Leave this section empty in `docs/round-3.md` with the heading "MintChecklist research: pending George's review."
- **Firewall (always applies):** nothing from a separate NDA-covered program George attended or its follow-up conversations (the NDA scope) goes into the app, specs, prompts or repo. No Mint screenshots, copied wording or copied layouts go in the repo. HDG's own checklist content (which HDG wrote) is fine to use.

## 5. Build plan for tonight (in priority order)
1. **Shared foundations:** extend the data layer (§1.6), add design tokens and `docs/design-guidelines.md` (§2), and the `/design` gallery page.
2. **Ticketing (3.11) + request lifecycle (3.3)** on one request object, with both demo flows extended to rating.
3. **AI in every screen (3.8):** ask sheet with context, suggested steps, AI Activity page, approvals inbox.
4. **Knowledge layer (3.1)** with sample SOPs wired into suggestions.
5. **Practice role daily views (3.2)** and **Training (3.6)**.
6. **Performance dashboards (3.4)**, the **Practice Owner page (3.12)** and **Workforce (3.5)**.
7. **Client practices (3.7)**, **Admin and security (3.9)** and **Mobile (3.10)**.
If time runs out, keep the order above. Anything stubbed must be listed in the report with the reason.

**What waits for Monday's handoff (filled Monday night):** real SOPs, roles and systems (3.1); real role checklists (3.2); SLA targets and escalation contacts (3.3, 3.11); tracked numbers and alert thresholds (3.4); real tracker structure (3.5); HDG training programs (3.6); client service list and pricing (3.7); real role list and security work (3.9). It all stays fake names and no PHI.

## 6. Acceptance checklist (verify on the deployed URL before reporting)
- [ ] Round-1 and round-2 URLs are unchanged and still live. The round-3 URL is new, public, and opens with no login on phone and desktop.
- [ ] Everything in the round-2 acceptance checklist is still true (all 15 round-1 fixes, the tap-your-name staff site, all 8 Copilots and their modules, both demo flows, management view, owner dashboard, HDG/Client toggle).
- [ ] All 12 expansions exist as clickable screens with mock data, and each shows Done by AI vs Needs a human where AI is involved.
- [ ] Ticketing: every department listed in 3.11 has its own queue, SLA timers, escalation and practice-visible status. Tickets and requests are the same record.
- [ ] Design guidelines file and `/design` gallery exist, and every new screen uses the tokens.
- [ ] Practice Owner page (3.12): the value section is on top (hero tiles with "How we counted," department cards, progress since joining, wins, bridge card), and the Balance Assessment is below it (summary table, sequence-rule priority, all 25 metrics with bands, detail sheets, resolution plan with a review date, "Get DPCP help" creating a real request, and the monthly PDF going to Review). No peer comparison appears in the Balance section.
- [ ] Section 4 is an empty placeholder; no Mint content or "modeled on Mint" language anywhere in the build or docs.
- [ ] No real names, no pay data, and no PHI beyond fake initials on Insurance screens.

## 7. Final report format
Line 1: the round-3 public URL. Line 2: confirmation that the round-1 and round-2 URLs are untouched. Then one line per expansion (3.1-3.12) saying built / partly built / stubbed, plus anything cut and why. Then the branch name and commit SHA, and the list of placeholders waiting for Monday's handoff data.
