# DPCP OS Prototype, Round 4 (combined): transcript edits E1-E14 + George's Loom feedback L1-L23
**Status: APPROVED by George Hariri, Sun Oct 4, 2026, 4:35 PM AZ. Build now.**
For: the Cursor cloud agent building the prototype (repo `george-hariri/dpcp-os`).
Builds on: Round 3, live at https://u7hf3v7d.vibedrop.site (branch `round-3`, commit `d261d5bf`). Rounds 1 and 2 are at https://sqzxej84.vibedrop.site and https://j68z8ckf.vibedrop.site.

**How to read this brief.** Part A (this part) is George's direct feedback from two Loom videos of the round-3 prototype, written as build instructions (L1-L23), plus the conflict resolutions. Part B (below, §0-§6) is the round-4 transcript brief (E1-E14), unchanged except where Part A says otherwise. **Order of precedence: Part A beats Part B wherever they conflict. Within Part A, Loom 2 items (L12-L23) beat Loom 1 items (L1-L11).** §A5 is the final report format and replaces Part B's old §7.

---

## A0. Hard rules (carry over, non-negotiable)
1. **New branch `round-4`, created from `round-3` (commit `d261d5bf`).** Commit and push only to `round-4`. Do not merge into main, do not open a PR into main, and do not touch `round-1`/`round-2`/`round-3`, `main` or `staging`.
2. **Deploy to a NEW public URL** with the same method as rounds 1-3: static export (`next build`, `output: 'export'`) and `npx @vibedrop/cli deploy <out dir>`. It must open with no login on phone and desktop. **Do NOT redeploy or change** https://sqzxej84.vibedrop.site, https://j68z8ckf.vibedrop.site or https://u7hf3v7d.vibedrop.site. Keep any vibedrop key/token file gitignored.
3. **Mock data only. Never PHI. No secrets.** No patient names or lists (counts and slots only), no pay/compensation amounts, no credentials on screen (status + "stored in the team vault" only). No real client, patient, vendor or employee names in the UI; use the fictional practices and people from `copilot-module-specs.md`. No Mint content or "modeled on Mint" language. No "Hariri Business Services"/"HBS" in the UI.
4. **"Real examples" (L8, L15) means real *situations*, not real names.** Use the transcript-derived projects, problems and numbers already in Part B (e.g., the new-location opening program, the barter and painting task forces, the 147-next-steps follow-through gap, the Twilio name-mismatch rejection, the quote-vs-order-sheet discrepancies, the 2017-vs-2023 code plan-check, the two-clinic time study, the recare call board). Re-tell them with the fictional practices (Copper Canyon, Mesa Verde, Ponderosa, Saguaro, Lakeview, Red Rock) and fictional people. No placeholder "Lorem/Sample Project A" content anywhere.
5. Keep every round-1/2/3 feature that Part A doesn't explicitly remove or move. Record every round-4 decision in `docs/DECISIONS.md`, write `docs/round-4.md` (changelog) and `docs/round-4/evidence.md`, and put this combined brief at `docs/round-4/prototype-round4-combined-brief.md` in the first commit on `round-4`.

## A1. Design direction from George (applies to every screen)
- **Simulate the real daily employee experience:** no extra login or role-picking steps, realistic data.
- **Dense pages use small tiles; focused pages use big tiles.**
- **Prefer pop-ups (modals/sheets) so people stay on the page** instead of navigating away.
- **Keep (George liked these, don't regress):** the Today page overall, AI chat, the depth of the Dental Insurance Copilot screens, acknowledgements first, big Review tiles, Calendar, Ideas & Roadmap, AI usage vs output.

## A2. Final navigation and information architecture (resolves L2, L4, L5, L18, L19, L21, L23 and Part B placements)
**Top navigation bar (desktop, left to right, exactly this order):** `Today · Communication · Review · AI · My Teams · Meetings · More`.
- **Meetings stays on the bar** (George first said move it to More, then reversed at 4:30 in Loom 1; final = on the bar).
- **Growth and Calendar are NOT on the bar;** they live in More.
- **Phone:** the same 7 items in the same order as a horizontally scrollable top tab strip (or a bottom bar that shows all 7 with icons). Do not hide Meetings or My Teams behind More on phone.

**Left department sidebar: removed everywhere** (every role, every page, desktop and phone). Department homes and Copilot modules are reached from **More > Departments & Copilots** (a tile grid), from links inside records, and from search. Remove the round-3 "left rail" guideline in favor of the top bar; record that in DECISIONS.md.

**No role screen.** Remove the "Continue as" screen. The app opens on the sign-in page (L1), and one tap on "Sign in" (no real credentials, nothing to type) lands directly on **Employee > Today**. Deep links work without signing in. **Role switching (Employee, Lead, George, Practice Owner, and any other existing roles such as practice staff/admin) moves to More > Switch view**, with the current view shown as a small chip in the top bar.

**More menu, condensed (L23): nothing that is already a main tab, no duplicates, fewer screens with several functions each.** Final More contents (each is ONE screen with sections/tabs inside):
1. **Switch view** — role switcher (L2).
2. **Calendar** — the full calendar (kept as-is; also opened as a pop-up from Today, L10).
3. **Professional Growth** — renamed from Growth (L19). Sections: *Where you fit* (concentric circles, L19), *Orientation → Training* (L20), *AI usage vs output* with comparisons (L22), and any other round-3 Growth content except the Organization map (which is replaced) and Morning check-in (removed, L21).
4. **People & Org** — People organized Teams > Sub-teams > Individuals (L17), plus E8's living org chart, RACI, escalation paths and channel rules, and Permissions (3.9) for admins.
5. **Departments & Copilots** — tile grid of every department home and Copilot module (Insurance, Equipment, Supplies, Staffing, IT, Accounting, Marketing, Construction, HR/People, Compliance, Training), plus cross-department programs: **E2 Location Launch Program**, **E4 Deadlines (George: "Money at stake this week")**, **E5 Practice identity**, **E11 Asset register**.
6. **Decisions** — George's approval queue + E3 Log + Open questions (George/lead views; employees see the Log read-only).
7. **Knowledge** — SOPs, role pages (3.1).
8. **Ideas & Roadmap** — kept (L18). **Remove the Farewell option** from it.
9. **Settings & Admin** — profile, theme, integration health, kill switches (3.9), `/design` gallery link.
Anything else that lived in More in round 3 must be folded into one of these nine screens or onto a main tab; list every move in `docs/round-4.md`. **Removed entirely:** Morning check-in (L21), the Farewell option (L18), the "Continue as" screen (L2), the left sidebar (L5).

## A3. Loom changes L1-L23 as build instructions
Format: **instruction** — *(Loom timestamp)* — **Modifies Part B:** which E items it changes or removes.

### Loom 1 (https://www.loom.com/share/d920e3b36360424c9c89166782159e54)
**L1. Sign-in page redesign.** Make the sign-in page visually polished: DPCP navy/blue brand, a strong product mark and tagline, a soft gradient or subtle illustration, generous spacing, light/dark mode, phone-first. One prominent "Sign in" button (demo: no typing required) that goes straight to Employee > Today. No role picker on or after this page. *(0:00)* — **Modifies Part B:** none.

**L2. Drop the "Continue as" role screen; land in Employee view; role switching under More.** See §A2. The default view after sign-in and for any deep link is Employee. Lead, George, Practice Owner (and other existing roles) are reached via More > Switch view; switching keeps you on the equivalent page where one exists. *(0:11)* — **Modifies Part B:** E1/E2/E3/E4/E8 George and lead views are reached via Switch view (not a separate entry screen).

**L3. Today > Meetings block: redesign assigned to Shama (a person), not to Cursor.** Do not redesign it this round. Keep it working, make sure it reflects L11-L13 (make-up meeting entry point, absence status), and record in DECISIONS.md "Today > Meetings block redesign pending Shama." Report this line as "deferred (assigned to Shama)." *(0:36)* — **Modifies Part B:** E1's Today roll-ups still show, inside the existing block.

**L4. Top nav order: Today, Communication, Review, AI, My Teams, Meetings, More.** Growth and Calendar move into More. Meetings stays on the bar (final call at 4:30). See §A2. *(0:52, 4:30)* — **Modifies Part B:** none directly; E3 Decisions sits in More.

**L5. Remove the left department sidebar everywhere.** See §A2; departments move to More > Departments & Copilots. *(1:36, 3:22)* — **Modifies Part B:** every E item that "lives on a department home" (E4 strip, E6, E7, E9-E14) is reached through More > Departments & Copilots instead of the sidebar. Breadcrumbs inside department pages stay.

**L6. Communication restructure.** Top of the page: **Announcements** = the acknowledgements (must-read/ack items), first, with "Acknowledge" buttons. Below that: **messages as small tiles** in a dense grid (sender/channel, subject, one-line preview, unread dot, status chip). Tapping a tile opens a **pop-up** where you can read the thread, edit an AI draft and send (approve-and-send rules unchanged). Goal: far less scrolling; no full-page navigation for a message. *(1:54)* — **Modifies Part B:** E8 "Ask the right person" and "Move to the Staffing channel?" suggestions appear inside the message pop-up.

**L7 (merged with L16). Wins & Culture lives in Communication, at the bottom.** See L16. *(2:27)*

**L8. Review: replace placeholder samples with real examples.** Every Review item uses transcript-derived situations from Part B (rule A0.4), e.g.: "Mesa Verde opening program: weekly status for George" (E2), "New Location Team follow-through: 12 items overdue, 5 with no proof" (E1), "LOI for Ponderosa blocked: entity name mismatch" (E5), "Quote vs order sheet: 7 discrepancies on the operatory kit" (E10), "Plan check: drawing uses 2017 code, jurisdiction is on 2023" (E12), "Two-clinic client time study results" (E13), "Monthly Balance Assessment PDF for Saguaro" (3.12), "Decision: keep ordering and shipment tracking on separate sheets" (E3). Fictional names only. *(2:35)* — **Modifies Part B:** E13 "export to Review" and 3.12 monthly PDF land here as real-looking items.

**L9. Review keeps the big full-width tiles.** Do not convert Review to small tiles (it's a focused page). *(3:04)* — **Modifies Part B:** none.

**L10. Today > Preview of the Day: add "Appointments today."** A list of the employee's own appointments/meetings for today (time, title, type color, join link). A calendar icon opens the Calendar in a **pop-up** (day/week). The full Calendar remains at More > Calendar. Appointments are calendar events, never patient appointments. *(3:35)* — **Modifies Part B:** none.

**L11. Meetings: live note-taking pop-up + quick actions.** On any meeting (live or upcoming), a "Take notes" button opens a pop-up note pad that autosaves into the meeting record (it becomes part of the recap/action-item source for E1, labeled "Typed notes" vs "Gemini notes"). Add quick-action icons on the Meetings page header (see L12). *(4:09)* — **Modifies Part B:** E1 notes-quality states gain "Typed notes + Gemini notes" / "Typed notes only (attach Gemini notes)" states.

### Loom 2 (https://www.loom.com/share/a4e14a4f539247589e963222b59d055c) — overrides Loom 1 on conflict
**L12. "Make-up meeting" button at the top of Meetings.** Next to the Meetings title: a "Make-up meeting" button with two options, **Make-up stand-up** and **Make-up update**. Either opens a chat (pop-up or full-height sheet) where an AI bot runs the missed meeting: it walks the person through the meeting's agenda and the questions the team answered, shows the recap and their action items, records their answers, and posts a short summary to the meeting record and the lead. Mark it "Done by AI" with "Needs a human" for the lead's confirmation. This replaces the round-3 "AI check-in for a missed daily meeting" (keep its logic, rename and move it here). — **Modifies Part B:** E1 "Absent attendees / Catch up card" now links to the make-up meeting instead of just a read receipt.

**L13. Mark yourself absent → required AI make-up meeting → compliance.** On each upcoming meeting: "I'll be absent" (with optional reason). That creates a required task "Complete make-up meeting" due by end of the next business day. Not completing it is a **compliance failure** that shows as red in the Lead view (My Teams) and George's view (team report and E1 ledger), with counts per person and per team. Completing it clears it. — **Modifies Part B:** E1 roll-ups include "make-up meetings overdue."

**L14. My Teams: small "Make-up daily stand-up" and "Make-up daily update" buttons at the top; remove the explanatory text under them.** Compact buttons, no paragraph underneath. They open the same AI make-up chat as L12. — **Modifies Part B:** none.

**L15. My Teams: rebuild the whole section from the internal transcripts, with an operations lens (treat round 3 as far from done).** For the employee and lead views, My Teams shows, per team the person belongs to: the team's mission line; members (fictional) with their roles; **the team's active projects** taken from Part B (New Location opening program lanes from E2, Barter and Painting task forces, Procurement/Orders kit work from E10, Hygienist and doctor recruiting outreach from E6, Insurance portal-access cleanup from E7, Marketing site/domain consolidation from E11); each project with owner, status, next step, blocker, due date; the team's **open commitments** from the E1 ledger (overdue, no proof); the team's **open questions and recent decisions** (E3); **meeting attendance and make-up compliance** (L13); **escalation path** for the team (E8: ask the lead first, then operations, then George); and a weekly operations scorecard (items done with proof %, make-ups completed %, deadlines at risk from E4). The lead view adds "Confirm all," reassign, and nudge (draft only, approve-and-send). Lean on the operations manager's inputs in Part B (the Zaid lines in E1, E2, E8, E11 evidence) for structure, but use fictional names in the UI. — **Modifies Part B:** E1, E2, E3, E4, E8 each get a team-scoped panel inside My Teams (links, not copies).

**L16. Wins & Culture at the bottom of Communication** (combines L7). A section at the bottom of the Communication page: wins shout-outs, Friday appreciations, birthdays/work anniversaries (dates only, no personal details), new-hire welcomes, and the company values with short definitions. Small tiles, pop-up to post (posting is approve-and-send in the demo). If Wins & Culture existed elsewhere (e.g., More or Growth), remove it from there so there's one home. — **Modifies Part B:** none.

**L17. More > People: Teams > Sub-teams > Individuals.** Replace the flat list with an expandable tree (and a card view on phone): Teams (department level) → Sub-teams/pods → Individuals (fictional names, role, lead badge, dotted-line memberships for people on two teams). Search and filter stay. — **Modifies Part B:** **E8's living org chart is built here** (People & Org), not in Growth > Organization map; RACI and escalation tabs sit beside the tree.

**L18. More > Ideas & Roadmap: keep it in More; remove the Farewell option.** — **Modifies Part B:** none.

**L19. Rename Growth to "Professional Growth"; replace the Organization section with concentric circles.** New "Where you fit" visual: concentric rings expanding outward from the person: **You (role) → Department + department mission → Business unit + its mission → Company vision/mission.** Each ring is labeled; tapping a ring shows its mission text and the people/teams in it. Use the company name as it appears elsewhere in the prototype (no "HBS"/"Hariri Business Services"). — **Modifies Part B:** **E8 "Living org chart" moves out of Growth > Organization map** to More > People & Org (L17). The Organization map in Growth is removed and replaced by the circles.

**L20. Orientation becomes a standardized onboarding form; once complete, the tab becomes "Training."** In Professional Growth: a step-by-step onboarding form (welcome, profile, tools access checklist with status only, values acknowledgement, role page review, first-week plan, 3-day to 1-week training period before client work). Progress bar; when 100% complete and the lead confirms, the section title changes from "Orientation" to "Training" and shows the training modules (3.6, incl. E9's "Care team flow"). Provide a toggle in the demo to view both states. — **Modifies Part B:** E9's training tie-in appears under Training.

**L21. Remove Morning check-in.** Delete it from navigation and pages; the make-up stand-up (L12/L14) covers it. Remove any links to it. — **Modifies Part B:** none.

**L22. AI usage vs output: keep; add comparisons.** Add three comparison views: **the employee vs their own history** (trend by week/month), **vs other departments** (department averages), and **vs the whole company** (company average and percentile). Usage and output metrics only, no pay or cost-per-person. — **Modifies Part B:** none.

**L23. More menu: remove anything that is already a main tab; condense into fewer multi-function screens.** Implement §A2's nine-screen More. Keep every feature; just consolidate. — **Modifies Part B:** E2, E3, E4, E5, E11 entry points move under More > Departments & Copilots / Decisions as listed in §A2.

## A4. Conflict resolutions (Part A vs Part B, and Loom 1 vs Loom 2)
| Topic | Resolution |
|---|---|
| Nav order | `Today · Communication · Review · AI · My Teams · Meetings · More` on desktop and phone. |
| Meetings placement | Stays on the bar (Loom 1 at 4:30 reverses the earlier "move to More"). |
| Left sidebar / round-3 left rail | Removed globally; departments via More > Departments & Copilots. |
| Role screen | Removed; sign-in → Employee Today; role switching in More > Switch view. |
| Wins & Culture | Bottom of Communication (L16 places L7). Single home. |
| More menu | Nine screens in §A2, no duplicates of main tabs. Growth and Calendar live there. |
| E8 org chart (Part B: Growth > Organization map) | Moves to More > People & Org (L17). Growth's Organization section becomes concentric circles (L19). |
| E1 absent attendees "Catch up" card | Kept, but now requires the AI make-up meeting (L12/L13); non-completion is a compliance flag. |
| Round-3 AI check-in for a missed daily meeting / Morning check-in | Replaced by Make-up stand-up / Make-up update (L12, L14); Morning check-in removed (L21). |
| E1 notes states | Add typed-notes states from L11's live note pop-up. |
| Today > Meetings block | Not redesigned (Shama); only functional updates for L11-L13. |
| Review content | Real transcript-derived situations with fictional names (A0.4); keep big tiles (L9). |
| My Teams | Rebuilt per L15; E1/E2/E3/E4/E8 surface as team panels (links, not copies). |
| Department-home features (E4 strip, E6, E7, E9-E14) | Unchanged in function; reached via More > Departments & Copilots. |
| Farewell | Removed from Ideas & Roadmap. |

## A5. Build order (replaces Part B §4 ordering at the top level)
1. Branch, copy this brief to docs, shared data-layer extensions (Part B §4 step 1).
2. **Shell changes first, because they touch every page:** L5 sidebar removal, L4/§A2 nav, L2 role-screen removal + Switch view, L23 More consolidation, L21 Morning check-in removal, L18 Farewell removal, L1 sign-in.
3. **Communication (L6, L16), Today (L10), Meetings (L11, L12, L13) with E1 and E3.**
4. **My Teams rebuild (L14, L15)** and **Review real examples (L8, L9).**
5. **Professional Growth (L19, L20, L22)** and **People & Org (L17 + E8).**
6. Part B §4 steps 3-7 (E2, E4, E5, E6, E7, E10, E11, E9, E12, E13, E14).
If time runs out, keep this order, and list anything stubbed with the reason.

## A6. Final report format (replaces Part B §7)
- **Line 1:** the round-4 public URL.
- **Line 2:** confirmation that https://sqzxej84.vibedrop.site, https://j68z8ckf.vibedrop.site and https://u7hf3v7d.vibedrop.site are untouched.
- **Then one line per item, E1-E14 and L1-L23:** `E1: built | partly built | stubbed | deferred — one-line note`.
- **Then:** anything cut and why; the branch name (`round-4`) and the final commit SHA.
- **Then:** "Defaults used for open questions" (every Part B §5 default plus any other default you chose), also recorded in `docs/DECISIONS.md`.
Before reporting, verify on the deployed URL against Part B §6 plus this extra checklist:
- [ ] Opens on the redesigned sign-in; one tap lands on Employee Today; no "Continue as" screen anywhere.
- [ ] Top bar order exactly as §A2 on desktop and phone; no left department sidebar on any page/role.
- [ ] More has only the §A2 screens; none duplicates a main tab; no Morning check-in; no Farewell.
- [ ] Communication: Announcements first, small message tiles opening an edit-and-send pop-up, Wins & Culture at the bottom.
- [ ] Today: Appointments today with a calendar pop-up.
- [ ] Meetings: Make-up meeting button (stand-up / update) opens the AI chat; "I'll be absent" creates a required make-up task; overdue make-ups show red in Lead and George views; live note pop-up saves to the meeting.
- [ ] My Teams: compact make-up buttons with no explanatory text; transcript-derived team projects, commitments, decisions, compliance and escalation.
- [ ] Review: big tiles, no placeholder samples.
- [ ] Professional Growth: concentric "Where you fit" rings; Orientation form flips to Training; AI usage vs output has self/department/company comparisons.
- [ ] People: Teams > Sub-teams > Individuals tree with E8 org chart/RACI.

---

# PART B — Round-4 transcript edits (E1-E14), as approved
*(Original status line "DRAFT, do not build until George approves" is superseded: George approved Oct 4, 4:35 PM AZ. Part A overrides anything below that conflicts with it.)*

## 0. Why round 4 exists
George's direction (Oct 4): his call transcripts are "golden information," and DPCP OS should learn from them. Every edit below comes from something the team actually said, decided or got stuck on in a recorded meeting. The evidence lines quote **Gemini's auto-generated notes** (Quick notes, Decisions or Suggested next steps). They're Gemini's wording, not verbatim speech, and Gemini says they "may contain errors."

**Privacy in this brief:** HBS team names appear only in the evidence, the same way round 3 used them. Coaching clients and outside contacts are anonymized ("a two-clinic client practice"). The source index in the appendix lists Gmail thread IDs, not client names. **None of these names go into the UI.** The prototype keeps the fictional practices and people from `copilot-module-specs.md`.

## 1. Ground rules (same as round 3, plus additions)
1. **Do not break rounds 1-3.** Build on a new branch `round-4`, branched from `round-3` (commit `d261d5bf`), and deploy to a **new public URL** that opens with no login on phone and desktop. Leave the three earlier URLs exactly as they are. Put the round-4 URL on line 1 of the report.
2. **Keep everything from round 3:** all 12 expansions, the design guidelines and tokens, the `/design` gallery, both demo flows extended to rating, the Practice Owner page with the Balance Assessment, and every round-1/round-2 rule. Round 4 extends screens. It doesn't replace them.
3. **Mock data only. Never PHI.** Use the six fictional practices (Copper Canyon, Mesa Verde, Ponderosa = HDG; Saguaro, Lakeview, Red Rock = clients) and fictional people. No pay or compensation amounts anywhere, even as samples. No patient names or lists: recare and scheduling screens show **counts and slots only**, with the "PHI stays in the PMS until BAA" badge.
4. **No credentials on screen, ever.** Portal, domain and subscription screens show *status, owner, and "stored in the team vault"* only. They never show usernames, passwords or codes.
5. **Humans vs AI:** keep "Done by AI" and "Needs a human" distinct. AI extracts, drafts and flags. A person confirms every action item, decision and outbound message.
6. **One data layer.** Extend the round-3 typed mock layer. Reuse `tasks`, `requests`, `approvals_queue`, `audit_log`, `org_units`, `sop_documents`, `practice_checklists`. New entities are named per edit.
7. **Firewall unchanged:** no Mint content and no "modeled on Mint" language. Nothing from the Founders Intensive/NDA scope. No "Hariri Business Services"/"HBS" in the UI.
8. Record round-4 decisions in `docs/DECISIONS.md`, add a `docs/round-4.md` changelog, and add the meeting-to-product evidence table (§3) to `docs/round-4/evidence.md`, keeping client names anonymized as they are here.

## 2. What already exists (checked so these edits don't duplicate it)
Checked against the round-3 brief, `copilot-module-specs.md`, Product Design v1, `docs/DECISIONS.md`, and the live round-3 bundle (screen strings, not a full click-through, so **verify in code before building**):
- **Meetings tab** (round 1-3): meeting types and colors, agenda, a "Still open" list, recap, action items with owner/date tags ("Needs owner," "Needs date"), the lead's "Confirm all," and the AI check-in for a missed daily meeting.
- **Decisions page** (George role): George's pending approvals (money, signatures) with context and deadline. It's a *queue*, not a history.
- **Growth > Organization map**, **People & roles**, and **Permissions** (3.9). *(Round 4: the Organization map is replaced by L19's concentric circles; the org chart moves to More > People & Org per L17.)*
- **Insurance:** AR Follow-up Board (1.5), Credentialing Tracker (1.7), Biller Scorecard (1.9).
- **Equipment/Supplies:** Location Equipment Planner (2.1), Vendor & Quote Comparison (2.2), Landed Cost & Import Tracker (2.3), Orders & Deliveries (3.3), Catalog & Store (3.4).
- **Staffing:** Requisitions (4.1), Candidate Pipeline with AI-drafted outreach (4.2), Talent Bench (4.3), Offers & Agreements (4.6).
- **Construction:** Site Pipeline with a decision gate (8.1), Simulated GC Bid (8.2), Build Schedule & Trades (8.3), Barter Program Manager (8.4), Design & Drawings (8.5).
- **IT:** Help Desk, Devices, Security & HIPAA, User Access, New Location IT Build (5.1-5.5). **Admin (3.9):** integration health cards and kill switches.
- **Knowledge (3.1)** already has the Overdue Recare Protocol and Recare Tracker SOPs, and the front-desk role lists "Recare calls" weekly.

## 3. The 14 edits, ranked (E1 = highest)
Ranking = how often it came up × how much time or money it costs today × how close it is to George's current priorities (team management, new locations, meetings). **Build tags:** **[Tonight]** = buildable now with mock data. **[Needs George]** = build with the stated default, then confirm (§5).

---

### E1. Meeting follow-through ledger (extends Meetings) — Effort **L** — **[Tonight]**
**Departments:** all (Operations owns it). **Problem:** every meeting creates 5-20 next steps, but once the lead taps "Confirm all," nothing follows them across meetings. Of 147 next steps from 19 internal meetings (Sep 17-Oct 1), Meeting Notes Bot found Slack or email evidence for only 76 (34 done, 42 in progress) and none for 71. Leads sometimes upload typed summaries instead of the Gemini notes, and people who missed a meeting are chased by hand.
**Evidence:**
- Aqib meeting, Sep 28: "Team leads occasionally uploaded manually typed summaries instead of raw transcripts, causing reporting gaps." Also: "George encountered missing data and incomplete timestamps when browsing past meeting reports."
- George Zaid Dalisu, Sep 14: "create an Airtable or similar database to store all transcripts for weekly access."
- New Location Team, Sep 16: "[Dalisu Shange] Process Transcript: Feed the meeting transcript into the workflow and distribute it to George."
- New Location Team Meet, Sep 11: "[Zaid Singh] Notify Absentees: Message all team members who were absent from today meeting."
- Barter Task Force, Sep 7: "Oversee the workload and track progress to prevent items from falling through the cracks."
- Meeting Notes Bot check (Oct 4) of 19 meetings: 34 Done, 42 In progress, 71 with no evidence.

**Screens and features:**
- **Commitments ledger** (new tab inside Meetings, plus a lead/George view): every confirmed action item from every meeting, as a `task` with source meeting, owner, original due and current due, status (Not started / In progress / Done / Dropped with reason), and **proof of done** (a link to a Slack message, email, file or ticket; required to mark Done). Filters: by owner, by meeting series, by department, overdue, no proof. Aging colors per the §2 status tokens.
- **Carry-over into the next meeting of the series:** the meeting page's "Still open" list fills automatically from the ledger (items from the previous occurrence that aren't done), with one-tap "Done / Still on it / Blocked / Drop." The prep task (Product Design §5.5) includes them.
- **Notes quality states on the meeting card:** *Gemini notes found* (green); *Summary only, no transcript* (amber, which tells the lead to attach the Gemini notes); *Host hasn't shared notes* (amber, for meetings someone else hosted); *No notes recorded* (round-3 state kept).
- **Absent attendees:** after the recap is confirmed, people invited but absent get a "Catch up" card on Today with the recap and their own items. Opening it marks the recap as read.
- **Rolls up:** each person's open items show on Today. Overdue items with no proof feed the leader view and George's 3 PM team report card ("12 items overdue, 5 with no proof").
- **Data:** `meeting_series`, `meetings` (series_id, notes_state, transcript_ref), `meeting_action_items` → `tasks` (source_meeting_id, proof_url, proof_type, carried_count), `meeting_reads`.
- **Sample data:** a "New Location Team (Wed/Fri)" series with 6 occurrences, 40 items, and a realistic mix (half done with proof, a third in progress, several carried 2-3 times, 3 dropped with reasons). Use fictional names.

---

### E2. Location Launch Program (cross-department opening playbook) — Effort **L** — **[Tonight]**
**Departments:** Construction (lead), plus Staffing, Insurance (credentialing), Equipment, Supplies, IT, Marketing and Accounting. **Problem:** a new location is one project that runs through every department, and today it lives in several spreadsheets. Round 3 has Construction's site pipeline and build schedule, but nothing ties the entity, credentialing, hiring, equipment, marketing and soft-opening work for one location into a single plan with dependencies and gates. Product Design v1 §14.8 describes a 17-step pipeline with gates, and the prototype doesn't show it yet.
**Evidence:**
- Dalisu Zaid, Sep 8: "The team is organizing the new location opening process into distinct work streams such as credentialing, construction, and marketing." Also: "Leadership identified a need to transition from external spreadsheets to using Akib's platform as the primary source of truth for new locations."
- New Location Team Meet, Sep 11: "Identified a requirement for a standardized new location process tracker to facilitate consistent project monitoring across future sites." Also: "Marketing protocol for new sites requires website launch upon lease signing, supplemented by billboards, PPC, and direct mail." And: "Staffing strategy includes a 2-week soft opening period for team onboarding and training prior to full operations."
- Doctor Committee, Sep 7: "Adopting a standardized opening model using 2 full-time doctors and 2 complete care teams to avoid the operational complexity of mid-cycle hiring."
- Insurance coverage, Sep 16: "loan closing is held up due to delayed insurance coverage." (a cross-department dependency)
- George Zaid Dalisu, Sep 14: "Integrate the project management layer and workflow status dashboard into the internal team tool."
- New Location team, Jul 28 (from the New Location call digest): "Launch 10 dental offices on one synchronized, fully staffed playbook."

**Screens and features:**
- **Program home (per location):** a header with the location, target open date, a countdown, and the **3 gates** from Product Design §14.8 (doctor signed, FDA/import clearance, layout sign-off), each green/amber/red. Below that, **workstream lanes**: Entity & registrations, Lease & site, Design & permits, Construction, Equipment & import, Supplies, IT build, Credentialing & fee schedules, Staffing (doctors and care teams), Marketing launch, Soft opening (2 weeks), Go-live. Each lane shows its owner, its % done, its next step and its blocker.
- **Dependencies:** steps can be blocked by steps in other lanes ("Bank loan closing ← business insurance bound"; "Website live ← lease signed"; "Credentialing submitted ← NPI + practice phone and email"; "Soft opening ← 2 care teams hired"). A blocked step shows who it's waiting on. The AI flags the critical path.
- **Template:** one "Standard HDG opening" template (steps, owners by role, default durations, gates) that a new location is cloned from. Editing the template prompts "apply to future locations only / also to open programs."
- **Portfolio view (George, leads):** every location in flight as a row with gates, the open date versus the forecast, and the top blocker.
- **Links, not copies:** steps link to existing records (8.1 site, 8.3 trades, 2.3 shipments, 1.7 credentialing, 4.1 requisitions, 5.5 IT build), so there's one record and no double entry.
- **Data:** `programs` (location, template_id, target_open, forecast_open), `program_steps` (workstream, owner_role, owner_id, depends_on[], gate flag, linked_record), `program_templates`. Sample: Mesa Verde (HDG, in build), Ponderosa (HDG, LOI stage), plus one client buildout (Red Rock) to show it working for clients too.

---

### E3. Decision log and "Needs further discussion" queue (extends Decisions) — Effort **S** — **[Tonight]**
**Departments:** all. **Problem:** Gemini already splits each meeting's outcomes into "Aligned" and "Needs further discussion." Deferred items get their own follow-up meetings, and some decisions get reversed later, but nothing records what was decided, when, by whom, or what changed.
**Evidence:**
- New location team call, Sep 18 (Decisions, "Needs Further Discussion"): the in-house painting plan "was deferred for final discussion in a dedicated Monday meeting," and the hygienist value proposition "was deferred to a dedicated Monday meeting." Next step: "[Dalisu Shange] Schedule Meetings: Create calendar invitations for the Monday task force meetings regarding recruiting and facilities."
- Painting Task Force, Sep 21: aligned on "Self-performing painting work internally," but "Determining approach for flooring work" stayed open.
- New Location Meeting, Sep 25: "Shaldon successfully implemented a barter system with flooring contractors." Then New locations Meeting, Sep 30: "flooring contractors rejected the labor barter system because they must pay laborers directly." This is a reversal no one logged.
- New locations Meeting, Sep 30 (Aligned): "keep ordering and shipment tracking on two separate sheets rather than combining them into one."

**Screens and features:**
- **Decisions page gets two more tabs** next to George's approval queue: **Log** (every Aligned decision: title, the one-line rule, department, source meeting with timestamp link, who decided, date, and "supersedes / superseded by") and **Open questions** (every "Needs further discussion" item, with owner, the meeting it's parked for, and age).
- **"Park for a task force"** on an open question creates the follow-up meeting invite draft (Calendar, needs approval) and attaches the question to that meeting's agenda. When that meeting aligns, the question closes into the Log.
- **Conflict flag:** when a new decision contradicts a logged one (same topic, opposite rule), the AI suggests "Supersede?" and a person confirms.
- **Feeds Knowledge (3.1):** a logged decision can be turned into a "Suggest an SOP edit" draft.
- **Data:** `decisions` (kind = approval / aligned / open, topic, rule_text, source_meeting_id, decided_by, supersedes_id, status), reusing the existing Decisions route.

---

### E4. Deadlines with a cost — Effort **M** — **[Tonight]**
**Departments:** Equipment, Supplies, Accounting, Insurance, Construction. **Problem:** the deadlines that cost real money (early-payment discounts, cargo cut-offs, dead-freight and demurrage, timely-filing limits, LOI exclusivity) live in people's heads and meeting notes. Product Design v1 lists "deadlines that slip silently" as a cross-department pattern and a shared "Deadline tracker" component, and the prototype doesn't show it yet.
**Evidence:**
- New Location Team, Sep 23: "Nina confirmed a 15% discount for payments completed on or before Sep 25."
- Procurement, Sep 22: "Junaid flagged potential dead freight fees pending completion dates for compressor parts."
- New Location Weekly Call, Oct 2: "Junaid reported shipment booking delays past October 18 due to space constraints."
- New Location Team, Sep 8: "Sheldon highlighted the necessity of monitoring delivery timelines to mitigate Q4 supply chain delays."
- Coaching call, Sep 30 (two-clinic client): "Approximately 8 to 10 claims represent fixable denials delayed past timely filing limits."
- Product Design v1 §14.8 risk: "the Kingman LOI exclusivity lapsed ~Sep 28."

**Screens and features:**
- **Deadlines strip** on each department home and on the Location Launch Program: items with a date, **what's at stake** ("$ discount," "$ fee per day," "claim becomes unrecoverable," "exclusivity lost"), an owner, and a countdown. They escalate on the round-3 ladder: 7 days amber, 2 days red, and on the day itself they go to George's Decisions queue if a money decision is needed.
- **AI capture:** when a meeting recap, email or quote mentions a dated condition ("on or before," "cut-off," "expires," "timely filing"), the AI proposes a deadline card with the quote attached. A person confirms it.
- **George view:** "Money at stake this week" as a total, with each line linked to its source.
- **Data:** `deadlines` (source_type, source_id, due_at, stake_type, stake_amount_est, owner_id, escalation_level, status).

---

### E5. Practice identity record and mismatch check — Effort **M** — **[Tonight]**
**Departments:** Accounting (entity), IT (phone/domain), Insurance (credentialing), Marketing (texting/website), Construction (lease). **Problem:** the same facts (legal entity name, DBA, address, EIN, NPI, phone, domain, email) get typed into LOIs, FDA and shipping forms, payer applications and texting registrations, and they don't match. That causes rejections and delays.
**Evidence:**
- New Location Weekly Call, Oct 2: "Twilio rejected the SMS campaign because business and practice names mismatched." Also: "Sadaqat flagged potential state location mismatches associated with the current phone number." And: "[Nosi Mtshali] Confirm address: Verify current address associated with the Google Voice phone number."
- New Location Team, Sep 23: "Official business address documents must align with LLC registration details for federal and shipping filings."
- Insurance coverage, Sep 16: "George Hariri flagged the initial LOI as sloppy and referencing incorrect entity names."
- New Location Team Meet, Sep 11: "entity registration and domain acquisition, pending finalization of physical address and EIN."
- Meeting Notes Bot check (Oct 3-4): the fee-schedule request was waiting on the practice's phone number and email from George. Oct 2 notes: "Khadim utilized a contingency phone number and email for initial credentialing requests."

**Screens and features:**
- **Practice identity card** (on the practice record and on the Location Launch Program's Entity lane): legal name, DBA/brand, entity type, registered address, physical address, mailing address, EIN status, NPI-1/NPI-2 status, main phone (and its registered address/state), domain, practice email, texting registration status, and the owner of each field. Each field has a "source document" link and a verified date. **EIN/NPI show only "On file / Pending" and the last 2 digits** (sample).
- **Where it's used:** a list of every filing and document that uses each field (LOI, lease, FDA, CBP/bond, payer applications, texting registration, website footer, Google Business profile). Each one shows match ✓ or mismatch ✗.
- **Mismatch check:** before any outbound filing draft is approved, the AI compares it with the identity card and blocks with a plain-English reason ("Entity name on this LOI doesn't match the registered name"). This plugs into the round-3 approvals inbox as a risk tag.
- **Missing-field tasks:** a missing field (for example, "practice phone and email") becomes a task for its owner, linked to everything it blocks.
- **Data:** `practice_identity` (field, value_masked, status, owner_id, source_doc, verified_at), `identity_usages` (document_type, document_id, field, match_state).

---

### E6. Outreach sequences with consent, timing and template results (extends Staffing 4.2, reused by Construction and Marketing) — Effort **M** — **[Tonight]**
**Departments:** Staffing (doctor and hygienist recruiting), Construction (barter and contractor outreach), Marketing. **Problem:** cold outreach is the team's main growth engine, but the logs live in outside spreadsheets. Texting platforms block cold texts without consent. The team learns by trial and error which message, channel, profile and time of day works, and it doesn't keep the lessons.
**Evidence:**
- New locations Meeting, Sep 30: "GHL and Twilio block cold texts due to strict A2P campaign consent requirements." Also: "reaching out requires warming up leads first to secure consent before messaging." Decision (Aligned): "message leads first to ask for a good time to call rather than putting an email in the initial message." Decision: "use Mishka's profile for I hire dental outreach instead of creating a new profile."
- Doctor Committee, Sep 7: "migrate all CRM activities and outreach logs into the central platform rather than external spreadsheets to enable better feedback loops." Also: "maintaining consistent outreach while analyzing failures to pivot messaging, timing, or channels."
- New Location Team Meet, Sep 11: "Create a report detailing all cold outbound attempts and the message text used in each." Also: "George mandated a review of all current cold outbound messaging templates."
- New Location Team, Sep 16: "Mishka shifted doctor outreach calls to 4:00 PM or 5:00 PM local time to improve contact rates."
- New Location Team, Sep 8: "Submit the refined outreach script to Sheldon for final approval before starting communications."
- New Location Weekly Call, Oct 2: "Hussein recommended CRM enhancements to improve system usability and email integration."

**Screens and features:**
- **Sequences:** a step builder (for example, step 1 is an email or platform message asking for a good time to call, step 2 is a call in the 4-5 PM local window, step 3 is a voicemail, and step 4 is a text **only after consent is recorded**). Each step uses an approved template version. Sending stays approve-and-send.
- **Consent and channel status per contact:** Not contacted / Messaged / Replied / **Consent to text ✓** / Opted out. The text step is disabled until consent is ✓. It also shows the texting-registration status from 4.5.
- **Template library with versions and results:** each template shows its approver, its version, sends, replies, calls booked and reply rate, and lets you compare v2 with v3. "Review templates" is a monthly task for the lead.
- **Best-time insight:** connect rate by local hour and by sending profile, labeled "Suggested by AI."
- **Shared by three departments:** the same component powers Staffing candidates, Construction contractor and barter leads (8.4), and Marketing outbound. Only the stages differ.
- **Data:** `outreach_sequences`, `outreach_steps`, `message_templates` (version, approved_by, department), `outreach_events` (contact_id, channel, profile, template_version, outcome, local_time), `contact_consent`.

---

### E7. Payer portal access matrix and timely-filing watch (Insurance) — Effort **M** — **[Tonight]**
**Departments:** Insurance (DICP). **Problem:** at client practices, the billing team can't work claims it can't see. Portal access is patchy, some portals block offshore logins, paid claims go without follow-up, and fixable denials age past timely filing.
**Evidence:**
- Coaching call, Sep 30 (two-clinic client): "Canadian insurance portal access restrictions prevent the offshore team from efficiently verifying statuses." Next step: "Compile a list of all current insurance portal credentials to identify access gaps. Evaluate which portals require re-instatement or new authorization." Also: "discovering 40 paid claims lacked follow-up." And: "Approximately 8 to 10 claims represent fixable denials delayed past timely filing limits."
- George Sadaqat Team Costs, Sep 30: "Sadaqat reported completing 74 out of 112 claims despite encountering portal access barriers."

**Screens and features:**
- **Portal access matrix** (new module 1.10): practice × payer portal, where each cell is Access ✓ / Pending reinstatement / Blocked from offshore / MFA held by the practice / None. Each cell also shows who holds MFA, the last successful login, and "stored in the team vault." **Never show credentials.** A gap creates a task for the practice ("Reinstate the dental portal for the billing team") through the round-3 request object.
- **Claims blocked by access:** an AR Follow-up Board (1.5) filter for "can't work: no portal access," with counts and dollars by payer.
- **Timely-filing countdown:** every denial and unworked claim on 1.5 and 1.6 shows the payer's filing limit and the days left, which feed edit E4. A "Fix before it expires" lane is sorted by days left × amount.
- **Paid-but-not-reconciled check:** a count of claims marked paid without posting or follow-up, shown on the RCM Command Center (1.1).
- **Data:** `payer_portals`, `portal_access` (practice_id, portal_id, state, mfa_holder_role, last_success_at), `payer_rules` (timely_filing_days). Fake payers and practices only.

---

### E8. Escalation path and living org chart (extends Growth > Organization map and People & roles) — Effort **S/M** — **[Tonight]**
**Departments:** Operations, People/HR. **Problem:** George is deliberately stepping back ("less accessible over 90 days"), and the team keeps re-stating the chain of command in meetings: ask Shaldon first, then Zaid or Dalisu, and only then George. The org chart and RACI are being rebuilt by hand.
**Evidence:**
- New Location Team, Sep 16: "Shaldon directed the team to funnel non-urgent questions through Dalisu, Zaid, or Shaldon to respect George's limited time."
- Insurance coverage, Sep 16: "Established a support escalation path requiring Shaldon Thomas, Zaid Singh, and Dalisu Shange to resolve questions before escalation." Also: "George Hariri proposed relocating provider recruiting discussions out of the new location team chat."
- New Location Team Meet, Sep 11: "Reporting structure requires all project updates and escalation needs to flow through Sheldon first."
- New Location Meeting, Sep 25: "George Hariri will be less accessible over 90 days, requiring greater operational independence from the team."
- George Dalisu Zaid, Sep 29: "Create and maintain a living organizational chart." Also: "An updated RACI matrix and organizational chart clarify reporting lines."

**Screens and features:**
- **Ask the right person:** when anyone asks a question in Chat or Communication and tags George, DPCP OS suggests the right owner from the RACI ("Facilities questions go to the New Location lead first"). George gets it only after the lead marks "Tried, needs George," and the question arrives with the lead's note.
- **George-time meter** (George view): how many questions reached him this week, how many came through a lead, and how many skipped the path.
- **Living org chart:** the Organization map generated from People & roles (3.9), showing teams, leads, the dotted lines for people on two teams, and each **workstream's RACI** (from edit E2). Changing a role updates the chart. No pay data appears.
- **Channel rules:** each department lists its official channel ("Provider recruiting lives in the Staffing channel"). When a message lands in the wrong place, the AI offers "Move to the Staffing channel?"
- **Data:** `org_units`, `raci` (workstream, role, R/A/C/I), `escalation_paths` (department, step order, role).

---

### E9. Care-team schedule template builder (practice side) — Effort **M** — **[Tonight] [Needs George: defaults]**
**Departments:** Staffing/Training (Nomi, Mishka), Coaching. Feeds the Balance Assessment (1.4, 1.6, 3.2). **Problem:** HDG's assisted-hygiene care-team model depends on a specific schedule: doctor and hygiene columns, assistant time versus doctor time, set visit lengths, and a "solo mode" for a new doctor. Today that lives in reviewed spreadsheets and a "schedule multiplier" document. Practices need a template they can see, coach to and check against.
**Evidence:**
- Hygiene and Scheduling Meeting, Sep 29: "New patient visits span 90 minutes, combining a 30-minute doctor slot with a 60-minute hygiene slot." Also: "Scaling and root planing procedures require 1 hour per 2 quadrants instead of full-mouth sessions." And: "Provider time scheduling divides appointments into assistant time and doctor time." And: "Solo mode assigns newly hired doctors 4 hygiene columns while restricting treatment time to assistant-only visits." Next steps: "Create scheduling template … Blend features from the reviewed spreadsheet examples," and "Provide instruction on routing slips and calendar management."
- Hygienist Recruitment Task Force, Sep 21: "Hygienists will float across operatory rooms to get patients numb and accelerate treatment starts."
- Coaching call, Sep 30 (single-practice client): "Restorative side scheduling remains consistently booked out for approximately 2 weeks." Also: "Block scheduling rules are bypassed within 2 days to rapidly fill open time slots."

**Screens and features:**
- **Template builder:** columns (doctor / hygiene / assisted-hygiene), operating mode (Standard, Solo-new-doctor, Seller-transition), and appointment types with segmented time (assistant minutes + doctor minutes + hygienist minutes). Samples: a 90-minute new-patient visit, and SRP at 1 hour per 2 quadrants. Block rules include a "release blocks X days out" setting (default 2).
- **Week preview:** the template laid on a week grid, showing chair hours by provider type and the implied capacity for Balance metrics 1.4, 1.6 and 3.2 ("this template gives a new patient 3 hygiene openings within 9 days").
- **Office manager "My Day" (3.2):** "today versus template" counts (unfilled blocks releasing tomorrow). No patient detail.
- **Training tie-in (3.6):** a "Care team flow" module with routing slips and who does what in assisted hygiene, linked to the template.
- **Data:** `schedule_templates`, `template_columns`, `appointment_types` (segments[]), `block_rules`. Sample templates for Copper Canyon (HDG) and Saguaro (client).

---

### E10. Standard location kit and order-sheet checks (extends Equipment 2.1/2.2 and Supplies 3.x) — Effort **M** — **[Tonight]**
**Departments:** Equipment, Supplies (Procurement). **Problem:** orders are being sized for several offices at once, with spares, and with special handling rules, and the quotes that come back often disagree with the order sheet. 2.1 already sizes equipment from the operatory count, but it doesn't handle multi-office scaling, spares, cabinet kits, hazmat rules or quote-vs-sheet errors.
**Evidence:**
- Orders, Sep 4: "George directed that all equipment orders must be scaled to support 5 dental offices." Also: "George mandated a spare parts section in all orders to maintain inventory for immediate breakage replacements." And: "mobile cabinets with 3 specific configurations: general, endo, and surgery." And: "hazardous materials, such as oils and chemicals, require Material Safety Data Sheets (MSDS) for carrier acceptance." And: "purchasing supplies like bleach locally to avoid potential shipping hazards." And: "a 100% tariff on masks and gloves sourced from China, requiring non-Chinese vendors."
- New Location Weekly Call, Oct 2: "Nomi and Mishka identified pricing and quantity discrepancies in vendor quotes."
- Procurement, Sep 22: "prioritized SCS order sheets over Gard orders due to quantity errors." Next step: "Compile a list of items not provided by primary vendors including liquids and irrigation supplies."
- New Location Team Call, Aug 11 (call digest): "Standardize equipment and clinical materials across all locations."

**Screens and features:**
- **Standard kit:** one HDG standard list (per-operatory, per-office, shared) with a **"× number of offices"** multiplier, an automatic **spare-parts section** (a % or count per line), and **cabinet kits** (General / Endo / Surgery) as named bundles.
- **Line flags:** Hazmat → MSDS required (with the document attached or missing); "Buy local" (don't ship); tariff-origin risk; FDA status (from 2.3); and "Not supplied by primary vendors" (a gap list).
- **Quote vs sheet check:** when a quote or proforma is parsed (2.2), the AI diffs it line by line against the kit ("Qty 30 on the quote vs 50 on the sheet"; "price changed from v2") and lists the discrepancies for Mishka/Nomi to resolve before payment approval.
- **Data:** `kit_templates`, `kit_lines` (scope, qty_per, spare_rule, hazmat, msds_doc, buy_local, origin_risk), `quote_diffs`.

---

### E11. Web, domain, subscription and automation register (IT, extends Admin 3.9) — Effort **M** — **[Tonight]**
**Departments:** IT, Marketing, Operations (Aqib, Ahsam). **Problem:** websites and domains are spread across hosts. Automations quietly stop when the workspace they run under closes. AI subscriptions lapse, and tool costs aren't audited. Round 3's integration cards show health, but not who owns each asset, which account it runs under, when it renews, or what it costs.
**Evidence:**
- Aqib meeting, Sep 28: "Automations stopped running because they were tied to a closed workspace." Also: "High-demand spikes caused processing errors when running workflows through Gemini." Next steps: "Request the necessary API and platform credentials for the new workspace," and "Verify the status of the OpenAI API subscription."
- Marketing Meeting, Sep 29: "Zain rebuilt the dental practice copilot website amid fragmented hosting across Bluehost and GoDaddy." Next steps: "Consolidate domain registrations and hosting services for all client and company websites," and "Review current software and tool subscriptions to identify and cancel unnecessary services." Also: "build client-owned websites directly on their platforms."
- Dalisu Zaid, Sep 8: "The DPCP website is currently experiencing intermittent accessibility issues and displaying spam-like popup notifications."
- George Dalisu Zaid, Sep 29: "Zaid proposed establishing staging and production versions of internal tools to prevent workflow interruptions."
- George Sadaqat Team Costs, Sep 30: "Transition email addresses from the Herreri Business Services domain to the Dental Insurance Co-pilot domain."

**Screens and features:**
- **Asset register:** domains, websites, hosting, email domains, AI/API subscriptions, SaaS tools and automations. Each row shows the owner, **the account it runs under** (company workspace vs a personal account, with a red flag if personal or closed), the client it belongs to (client-owned yes/no), renewal date, monthly cost (sample), last-healthy check and a "stored in the team vault" status.
- **Automation run health:** the last run, failures in 24 hours, the provider used (primary/backup), and "runs under a closed or expired account" as a red flag. A fallback provider is shown as configured or not.
- **Environments:** each internal automation is tagged Staging or Production, with "Promote to production" behind the round-3 "George approves" gate.
- **Monthly cost review:** subscriptions with no use in 30 days show as "Cancel?" suggestions. Renewals feed edit E4.
- **Data:** `digital_assets` (type, owner_id, account_ref, client_owned, renews_at, monthly_cost_sample, env), `automation_runs`.

---

### E12. Plan-check rules and the design-service intake (extends Construction 8.5) — Effort **S/M** — **[Tonight]**
**Departments:** Construction (Johannah, Shaldon). It's also a client service. **Problem:** the in-house architect now reviews outside DSO plans as a paid service, and the same errors keep showing up: an outdated code edition, non-standard doors, narrow halls, operatories under the minimum width, and missing as-builts. Requests come in without a scope or a turnaround time, and the architect works part time.
**Evidence:**
- Architect Call, Sep 17 (outside DSO facilities director): "persistent issues with local architects regarding project timelines, code compliance, and accuracy." Details: a project "planned using the 2017 building code instead of the updated 2023 code, wasting two months," and "non-standardized doors instead of standard 36-inch doors." Also: "currently lacks existing as-built plans." The team "do[es] not perform onsite scanning or US-specific civil engineering and parking lot design." Next step: "Define Turnaround Time."
- New Location Team, Sep 16: "reviewing ADA and local municipality regulations, specifically targeting 44-inch hallway widths and 36-inch entryways."
- New Location Facilities, Sep 14: "concerns regarding operatory widths under 8 feet." Also: "no as-built drawings are available." The Aug 14 call digest set the operatory width at 8 ft 4 in.
- New Location Team, Sep 23: "Plumbers require a rough water supply layout to quote running PEX lines to each operatory."
- New Location Meeting, Sep 25: "Develop the blocking diagram and floor plan process internally to allow for future client service offerings."

**Screens and features:**
- **Plan-check checklist** on each drawing version in 8.5: code edition used vs the jurisdiction's current edition, corridor ≥ 44 in, doors ≥ 36 in, operatory width ≥ the HDG standard (8 ft 4 in, editable), ADA restroom and turning space, a sterilization/lab/storage zone marked, a rough water layout present (PEX per op, RO filter location), and an as-builts status. Each check is Pass / Fail / Not applicable, with a comment. The AI pre-fills and a person signs off.
- **Design-service intake (client-facing request type):** scope (blocking / full set / plan check), the as-builts available, the jurisdiction and code edition, the requested turnaround, and an **out-of-scope notice** (no onsite scanning, civil or parking design). Capacity shows the architect's weekly hours versus the work queued.
- **Data:** `plan_checks` (drawing_version_id, rule_id, result, note), `plan_rules` (editable standards), and a design-service `ticket_type` on the round-3 request object.

---

### E13. Office role time study (extends Workforce 3.5, practice-staff version) — Effort **M** — **[Tonight]**
**Departments:** Staffing, Coaching, Insurance (billing teams). **Problem:** client practices are sizing front-office and billing teams by gut feel. Coaching calls end with "do a time study," but there's no tool to do it, so staff time goes to posting rather than follow-up and to downtime rather than growth calls.
**Evidence:**
- Coaching call, Sep 30 (two-clinic client): "Conduct Time Study: Perform a time study on office functions to optimize staffing and task allocation." Also: "Two dedicated AR staff members focus primarily on payment posting rather than claim follow-ups." And: "George recommended operating with a lean team of 3 front desk staff for the 12-operatory clinic." And: "Send the general roles and responsibilities for a dental front office to the team." And: "utilizing the offshore team's surplus capacity to absorb administrative tasks like scheduling."
- George Sadaqat Team Costs, Sep 30: "the client maintains 7 offshore FTEs dedicated exclusively to posting payments."
- Coaching call, Sep 30 (single-practice client): "Staff downtime labor costs are repurposed into growth activities via overdue recare reactivation calls."

**Screens and features:**
- **Run a time study (office manager or coach):** pick roles and a 1-2 week window. On the practice staff site, each person in the study gets a "What are you working on?" tile with 8-12 function chips (check-in, phones, scheduling, verification, posting, AR follow-up, treatment coordination, recare calls, downtime) and taps when they switch. No screenshots, and nothing like Time Doctor.
- **Results:** hours by function per role versus the role page's expected mix (Knowledge 3.1 role pages), "could move to DPCP" suggestions (for example, verification or posting to the Insurance Copilot, or scheduling to the remote team), and a lean-staffing suggestion labeled "Suggested by AI."
- **Output:** the result can be exported to Review as a coaching deliverable and linked to a Balance Assessment resolution plan.
- **Data:** `time_studies`, `time_study_taps` (person, function, start, end). Counts only.

---

### E14. Recare reactivation call board and confirmation rule (extends the front-desk My Day 3.2) — Effort **S** — **[Tonight]**
**Departments:** Coaching/Training, Marketing. Feeds Balance metrics 1.5, 1.7 and 1.9. **Problem:** the recare SOP exists (3.1), but practices track the daily calls in a shared sheet. The coaching standard is a set number of daily attempts per person, tracked in real time, plus a firm confirmation rule.
**Evidence:**
- Coaching call, Sep 30 (single-practice client): "Teams target 30 to 40 daily outbound contact attempts per dedicated person using real-time tracking." Also: "Overdue recare lists extend from 6 months up to 4 years." And: "Confirmation text messages explicitly state that unconfirmed appointments within 48 hours will be reassigned." Next step: "Implement a Google Sheets based overdue recare tracking system to ensure the team can update the status in real time." Also: "September experiences peak cancellations driven by back-to-school schedules."

**Screens and features:**
- **Call board on the staff site:** each assigned person gets a counter with the goal (default 35 per day), outcome taps (Booked / Left message / No answer / Declined / Bad number), today's progress ring, and the team total. **The patient list stays in the PMS.** The board records counts and outcomes only.
- **Overdue buckets as counts:** 6-12 months, 1-2 years, 2-4 years, so the office works the newest first (per the SOP).
- **Confirmation rule card** on the front-desk My Day: "Unconfirmed within 48 hours → release," with today's count of releases due (no names).
- **Office manager and owner:** a weekly attempts-to-booked rate, plus a link to Balance 1.5 and its trend.
- **Data:** `recare_sessions` (person, date, attempts, outcomes{}), `recare_buckets` (practice, bucket, count).

---

## 4. Build plan (priority order)
1. **Shared foundations:** extend the data layer (new entities above), the `deadlines` component, and the "proof of done" pattern.
2. **E1 Meeting follow-through ledger** and **E3 Decision log** (same Meetings/Decisions area, and they share the meeting record).
3. **E2 Location Launch Program**, wired to existing 8.x, 2.3, 1.7, 4.1 and 5.5 records, plus **E4 Deadlines** on it.
4. **E5 Practice identity record** (the Entity lane of E2 uses it).
5. **E6 Outreach sequences** and **E8 Escalation path / org chart**.
6. **E7 Portal access matrix**, **E10 Location kit**, **E11 Asset register**.
7. **E9 Schedule template**, **E12 Plan-check**, **E13 Time study**, **E14 Recare board**.
If time runs out, keep this order and list anything stubbed in the report, with the reason.

## 5. Questions for George (build with the default; confirm after)
1. **Proof of done (E1):** must every action item have a proof link to be marked Done? *Default:* yes for internal items, with "No link: explain" allowed for the lead only.
2. **Who sees the ledger (E1):** *Default:* each person sees their own. Leads see their team. George sees all.
3. **Launch template (E2):** use the 17-step New_Location_Workflow_v3 as the template's steps? *Default:* yes, with sample durations, and Shaldon edits it.
4. **George escalation (E8):** should a question that skipped the lead be held back from George or just flagged? *Default:* flagged, not held.
5. **Recare goal (E14):** 35 attempts per person per day as the default, editable per practice? *Default:* yes.
6. **Schedule defaults (E9):** use the Sep 29 numbers (90-minute new patient = 30 doctor + 60 hygiene; SRP at 1 hour per 2 quadrants; release blocks 2 days out) as HDG defaults? *Default:* yes, labeled "HDG standard, editable."
7. **Design service (E12):** show it as a client request type now, or keep it internal until pricing exists? *Default:* request type, labeled "Sample, not real pricing."

## 6. Acceptance checklist (verify on the deployed URL before reporting)
- [ ] The round-1, round-2 and round-3 URLs are unchanged and live. The round-4 URL is new, public, and opens with no login on phone and desktop.
- [ ] Everything in the round-3 acceptance checklist is still true.
- [ ] All 14 edits exist as clickable screens with mock data, with Done by AI vs Needs a human where AI is involved, and with phone layouts.
- [ ] E1: a confirmed action item appears in the ledger, carries into the next meeting of its series, and can't be marked Done without proof (or the lead's explanation). The notes-quality states show.
- [ ] E2: one location shows all workstream lanes, the 3 gates, at least 4 cross-lane dependencies and a portfolio row. Steps link to the existing 8.x/2.3/1.7/4.1/5.5 records, not copies.
- [ ] E3: the Log and Open questions tabs exist. "Park for a task force" attaches the question to a meeting agenda, and one sample decision shows "superseded by."
- [ ] E5: a sample outbound filing is blocked by a mismatch with a plain-English reason.
- [ ] E6: the text step is disabled until consent is recorded.
- [ ] E7 and E11: no credentials anywhere, only status and "stored in the team vault."
- [ ] No pay or compensation amounts. No patient names or lists (recare, scheduling and time study are counts only). No real client, vendor or employee names in the UI. No Mint content. No "HBS" in the UI.

## 7. Final report format
**Replaced by §A6 in Part A** (one line per E1-E14 and L1-L23).

---

## Appendix A: source index (Gemini notes reviewed)
All from the HBS Gmail (sender gemini-notes@google.com) unless noted. The times are the email times, AZ.
| Date | Meeting | Type | Source |
|---|---|---|---|
| Sep 4 | Facilities | New locations | Gmail 1a06d15a0a3003ff |
| Sep 4 | Orders | Procurement | Gmail 1a06d35b4c897583 |
| Sep 7 | Shaldon review meeting | Leadership | Gmail 1a07cea853e7692d |
| Sep 7 | Doctor Committee | Staffing | Gmail 1a07db33642841a5 |
| Sep 7 | Barter Task Force | Construction | Full notes, /workspace/circle/hdg_meetings |
| Sep 8 | Dalisu Zaid | Leadership | Gmail 1a0818cd59679307 |
| Sep 8 | Leadership Drive | Strategy | Gmail 1a082382b0a730fd |
| Sep 8 | New Location Team | New locations | Gmail 1a082aa5ec66d659 |
| Sep 9 | George Junaid | Imports | Gmail 1a086d2d5113bfe6 |
| Sep 11 | New Location Team Meet | New locations | Full notes, hdg_meetings |
| Sep 14 | George Zaid Dalisu | Leadership | Gmail 1a0a0a9456af5c8a |
| Sep 14 | New Location Facilities | New locations | Gmail 1a0a1a66b8dae0c1 |
| Sep 15 | Two-clinic client, urgent cash call | Coaching | Gmail 1a0a6977e8f332cf |
| Sep 16 | Insurance coverage | New locations | Gmail 1a0aaf783dfbb806 |
| Sep 16 | New Location Team | New locations | Gmail 1a0abd00ecbe7b6f |
| Sep 17 | Mishka Dentist Recruitment | Staffing | Gmail 1a0b02896f1f66c8 |
| Sep 17 | Marketing meeting | Marketing | Gmail 1a0b14bfc3845a05 |
| Sep 17 | Architect Call (Dalisu-hosted, Drive only) | Construction service | Drive 1iFbitfJWDIfwrC6GX6isFlv9MEA_h-I1uAq1vxJVYpM |
| Sep 18 | New location team call | New locations | Full notes, hdg_meetings |
| Sep 21 | Painting Task Force | Construction | Full notes, hdg_meetings |
| Sep 21 | Hygienist Recruitment Task Force | Staffing | Full notes, hdg_meetings |
| Sep 21 | Untitled billing call | Insurance | Gmail 1a0c55c794b324bc |
| Sep 22 | Procurement | Procurement | Gmail 1a0cb0f06451d2a5 |
| Sep 23 | New Location Team | New locations | Full notes, hdg_meetings |
| Sep 25 | New Location Meeting | New locations | Full notes, hdg_meetings |
| Sep 25 | George Zaid Dalisu | Leadership | Gmail 1a0da83dcb93f2b6 |
| Sep 28 | Aqib meeting | Technology | Gmail 1a0e99f4ad981ad6 |
| Sep 29 | Hygiene and Scheduling Meeting | Staffing/clinical | Gmail 1a0ee19b36d496f4 |
| Sep 29 | Marketing Meeting | Marketing | Gmail 1a0ee315fd6fde0a |
| Sep 29 | Procurement Meeting | Procurement | Gmail 1a0ee49925fecdec |
| Sep 29 | George Dalisu Zaid | Leadership | Gmail 1a0ef52600352361 |
| Sep 30 | George Sadaqat Team Costs | Insurance | Gmail 1a0f365875b2d2f0 |
| Sep 30 | New locations Meeting | New locations | Full notes, hdg_meetings |
| Sep 30 | Two-clinic client coaching call | Coaching | Gmail 1a0f40b3b99dc5e6 |
| Sep 30 | Single-practice client coaching call | Coaching | Gmail 1a0f53ad143dfdad |
| Oct 1 | Darin onboarding | People/HR | Gmail 1a0f920f1107ced7 |
| Oct 2 | New Location Weekly Call | New locations | Gmail 1a0fe629e04c749e |
Also used: `/workspace/new-location/call-digest.md` (Jul 28-Sep 30 New Location calls) for the Jul 28, Aug 11 and Aug 14 lines, and `/workspace/meeting-notes/` (next-steps status, Oct 4) for the follow-through counts.
**Not used on purpose:** the attorney touch-base (Sep 22), anything SP/Shared Practices, compensation and pay figures, and the Marketing Lead interview (Sep 28). Not reached: the Sep 7 Dalisu-hosted "Meeting started" doc and the other ~50 coaching transcripts. These could feed a coaching-focused round later.
