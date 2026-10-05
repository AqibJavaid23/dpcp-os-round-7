# DPCP OS Prototype, Round 2: Build Brief
For: the existing prototype Cursor cloud agent (bc-bf295890-ab48-5cea-a7e3-08ce57562475), or a new agent on the same repo.
Written Sat Oct 3, 2026 (AZ). George reviews the result **Sunday morning, Oct 4, 2026 (AZ)**.
Companion spec (required reading): `copilot-module-specs.md`. It holds the 8 Copilots' custom modules, sample data, the AI vs human split, and the request-routing table.

---

## 0. Ground rules
1. **Do not break round 1.** https://sqzxej84.vibedrop.site must keep serving the current round-1 build unchanged. Build round 2 on a new branch (`round-2`) and deploy it to a **new public URL** that opens with no login on phone and desktop. Put that URL on the first line of your final report.
2. **Fake data only.** No real client, patient, vendor or employee names, and no pay data. Use the fictional practices in the specs (Copper Canyon Dental, Mesa Verde Family Dental and Ponderosa Smiles are HDG; Saguaro Family Dental, Lakeview Dental Arts and Red Rock Pediatric Dental are clients). Mock everything behind the existing typed data layer.
3. **Keep the design language.** Apple HIG feel: calm, lots of whitespace, one focal point per screen, large clean type. Use DPCP navy/blue brand tokens and the plane mark. No embedded AI chat panels on regular pages; the only AI entry is the small floating ask icon. The mission line appears only in the footer.
4. **Core principle: Humans vs AI.** DPCP OS is where people do the work only people should do: judgment, relationships, review, decisions, signatures. Everywhere, make **Done by AI** and **Needs a human** visually distinct, with AI work shown as something a person directs and approves.
5. **Mobile-first installable PWA.** Every new screen needs a phone layout (4-5 primary tabs plus More).
6. Record round-2 decisions in `docs/DECISIONS.md` and add a `docs/round-2.md` changelog.

## 1. Keep all 15 of George's round-1 fixes (Oct 3 batch). Do not regress any of them.
1. Login screen with "Sign in with Google" (HBS Workspace), official DPCP OS branding and the mission line in the footer. Fake sign-in goes to a role picker, then lands on Today. Keep the small "Demo" tag.
2. Must-acknowledge announcements appear as items in Communication, sorted by priority, with "Acknowledged" and "I have a question." There is no blocking popup.
3. No "Make Up Stand-up" on Today. My Teams has two icons near the top: "Make-up daily stand-up" and "Make-up daily update" (only for people who missed the meeting).
4. Today shows "Communications that need you" and "ready to review."
5. Today's task checkmark starts dull or grey and fills in when the task is checked off.
6. Today has three sections in this order: Preview of the day (with the two count boxes), To-do list, Completed items.
7. Growth > Execution cards show only the score and the goal, with no bar graphs.
8. Growth areas are bigger-picture items set by the supervisor, never small tasks.
9. Growth has exactly three always-visible sections: Execution score, Growth areas, Organization map.
10. Communication uses "Edit with AI" (AI rewrites the reply), and the reply can also be edited directly and sent.
11. Communication lists client messages first, then internal ones.
12. Wins & Culture lives in My Teams.
13. Review holds only AI-made work products (documents, presentations, spreadsheets). Approve is disabled while a revision is pending. Point-by-point feedback stays.
14. The tab is named "AI" everywhere.
15. Calendar shows today's appointments as a list at the top, then the week as a grid (days across, times down).

Also keep the earlier standing rules: the meeting types and colors (Daily: Stand-up Meeting and Update Meeting; Team Meetings, labeled leader-led or George-led; Client Meetings; Internal Meetings), the Review loop (versions, diff against feedback, states), roles assigned by management (a person can lead one team and be a member of another), the Feedback on DPCP OS button and Ideas & Roadmap board, and the people directory and culture items.

**Naming note:** George's newest notes call the home tab "My Workday," but his round-1 fix renamed it **"Today."** Keep "Today" and flag this in DECISIONS.md as a question for George.

## 2. What round 2 adds (7 areas)

### 2.1 Practice Staff Site (new, separate surface; original design built from HDG's own workflows)
A practice-facing website, one per practice (e.g. `/practice/copper-canyon`), with **no login**. On office desktops it opens from a desktop icon, and there is also a mobile web view. Show both a desktop frame and a phone frame. The PWA manifest should make it installable as its own icon ("Copper Canyon Team").
- **Home: tap your name.** A grid of the office team's faces and names, grouped by role (Front Office, Hygiene, Assistants, Doctors, Office Manager). Tapping a name sets "who's using it" for the session and shows "Hi Maria" with a "Not you?" switch. It auto-resets after 5 minutes idle.
- **My checklists:** opening, closing, sterilization, and morning huddle prep, each with tick items, time-of-day due badges, and a completed-by stamp (name + time). A manager view shows completion % by checklist and person for the day and week.
- **Report an issue / Request support:** one big button with category chips (Equipment, Supplies, Insurance/billing, IT, Building, Staffing/HR, Accounting, Marketing, Other), a description, an optional photo, and urgency. A confirmation shows **which DPCP department it was routed to**, plus "AI is on it" or "A person will help."
- **Request tracker:** a live list of the practice's open items with statuses: Received → AI working → With a specialist → Waiting on you → Done. Each item shows its owner department, last update and timeline. Filter by "mine" and "all office."
- **Training:** assigned modules per role, progress, short quizzes, and sign-offs (e.g. "New DA: 6/9 modules").
- **Schedule:** today's huddle notes and who's in today (no patient data).
- **Announcements:** practice and company announcements, each with "Got it."
- **Shout-outs:** recognize a coworker with a pillar tag; they flow into a practice wins wall.
- **Quick marks:** for the Marketing call-to-patient match, the front desk marks "scheduled/seen" on a short list (see specs 7.4).
- Design it for shared computers: very large tap targets, no personal settings, and no private messages.

### 2.2 DPCP team app tabs (existing, extended)
Today, Communication (client first, then internal), Review, AI, Calendar, Meetings, and My Teams (Leader and Member views per team assignment; Wins & Culture lives here). Wire the new practice requests into them:
- A routed request that needs a person becomes a task on **Today**, showing "AI already did: ..."
- AI-made deliverables from department work (appeal letter, P&L analysis, weekly marketing snapshot, landed-cost sheet, simulated GC bid) appear in **Review**.
- Client and practice replies appear in **Communication**.

### 2.3 Department switcher with the 8 Copilots in depth (the main focus)
- Add a **department switcher** at the top of the left rail (and on phone under More → Departments). It lists the 8 Copilots with their family logos from `public/brand/`: Insurance, Equipment, Supplies, Staffing, IT, Accounting, Marketing, Construction. A user only sees departments they belong to. The George and owner roles see all 8.
- Picking a department swaps the left rail to **that department's custom modules**, exactly as listed in `copilot-module-specs.md`. Every department opens on the shared **Department Home** (spec §0): Needs a human today, Done by AI since yesterday, Practice requests (with SLA timers), and Department pulse (4 numbers, each with score and goal and no bar graphs). Include an **HDG / Client** filter.
- Build **every module listed in the specs** as a real clickable screen with the sample data given (extend it realistically, at least 8-15 rows per list). Each module shows its AI-done vs needs-a-human split.
- **Insurance (DICP) gets the deepest build:** all 9 modules (RCM Command Center, Eligibility & Verification Queue, Claims Workbench, Payment Posting Desk, AR Follow-up Board with Call mode, Denials & Appeals Studio linked to Review, Credentialing Tracker, Client Month-End Report Builder, Biller Scorecard & AI Adoption). Include a drill-down from a client card into that client's workspace, and the "PHI stays in the PMS until BAA" badge. Patient identifiers are initials only.
- Other departments: build all listed modules at a solid but lighter depth (list + detail + key actions).

### 2.4 End-to-end request flow (clickable demo path)
Script one walk-through that George can click from start to finish, and add a "Play the demo" link on the role picker:
1. On the **practice staff site** (Saguaro Family Dental, a client), front desk "Maria" taps her name and submits "Patient says insurance denied her crown, can you check?"
2. The request is **routed to Insurance**. The tracker shows "AI working."
3. The **AI drafts the work**: it finds the denial (frequency limitation) and drafts an appeal plus a patient-friendly status note.
4. A **human task appears on Today** for the assigned biller: "Review appeal draft for Saguaro claim 88-1042 · AI already did: pulled denial, drafted appeal v1."
5. The biller opens it in **Review**, leaves a comment, the AI revises (v2 with the diff shown), and the biller approves. The lead's approval is shown if the amount is over the threshold.
6. The **practice tracker** moves to "Done: appeal submitted, we'll update you when the payer responds," and Maria sees it.
Add a second, shorter flow for a non-Insurance department: Copper Canyon (HDG) "Op 7 chair won't recline" → Equipment Install & Service Desk → AI troubleshooting → tech visit task → Done.

### 2.5 Management view (department leads and the team leader)
In My Teams (Leader view) and the department home for leads, show per person: workload (open tasks, due today, overdue), blockers with their reasons, resolution times (median time to first response and to done, by department and request type), SLA breaches, Review queue waiting on the leader, who's out and who covers, and execution/on-time scores (score + goal). Add a team-leader roll-up across departments that shows which department is slowest this week and why (an AI one-liner).

### 2.6 Owner dashboard (practice owner)
A simple view for a practice owner dentist (a new role in the role picker: "Practice Owner"):
- Practice health: collections vs goal, AR 90+, new patients and cost per new patient, staffing (open roles), checklist completion, and open building/equipment issues, each as score + goal + trend arrow.
- **What DPCP is handling for you:** counts by department this month ("Insurance: 412 verifications, 9 appeals, $18,400 recovered · Supplies: saved $460 · IT: 11 tickets resolved") and anything that **needs the owner** (approvals, signatures) at the top.
- A daily update card ("Nothing needs you today" or the 1-3 decisions).

### 2.7 HDG vs Client toggle
A global toggle (in the prototype bar and the owner view) that switches the sample practice between an HDG practice (Copper Canyon) and a client practice (Saguaro). **The experience is identical**; only the data and the small "HDG" or "Client" tag change. Department modules filter by it too.

## 3. Acceptance checklist (verify on the deployed URL before reporting)
- [ ] The round-1 URL is unchanged and still live. The round-2 URL is new, public, and opens on phone and desktop.
- [ ] All 15 round-1 fixes are still true.
- [ ] The practice staff site works without login: tap your name, checklists, issue/support with routing confirmation, live tracker, training, schedule, announcements, and shout-outs, on both desktop and phone frames.
- [ ] The department switcher shows all 8 Copilots. Every module in the specs exists, with sample data and the AI vs human split.
- [ ] Insurance has all 9 modules, including the client drill-down and AR Call mode.
- [ ] Both demo flows click through from start to finish.
- [ ] The management view, owner dashboard and HDG/Client toggle work.
- [ ] No real names, no pay data, and no PHI beyond fake initials.

## 4. Final report format
Line 1: the round-2 public URL. Line 2: confirmation that the round-1 URL is untouched. Then a 10-line summary: one line per area (2.1-2.7), plus anything cut or stubbed and why. Also include the branch name and the commit SHA.
