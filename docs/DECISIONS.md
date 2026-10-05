# DPCP OS decisions

**Status:** prototype. The items under **Decided** are George's. Everything under **Open** still needs his yes or no. Recommended defaults come from the product design and are not decisions.

Related: [product design](product-design-v1.md) · [screen specs](screen-specs-v2.md) · [technical design](technical-design-v1.md) · [Time Doctor V2 takeover](td-v2-bot-takeover.md) · [brand](BRAND.md) · [monitoring policy recommendation](legal/monitoring-policy-recommendation.md)

## Decided

1. **RCM / billing is a separate add-on, and it is the only part that holds patient information (PHI).** Core DPCP OS holds no PHI. Until a BAA exists, insurance work in the core app is route-and-track only: task, client, count, status.
2. **IT sets up every employee's connectors before day 1.** The person does a short first-login "finish setup" (notice, Slack connect, phone install, Time Doctor, notifications).
3. **Reuse the accounts the developer Aqib already runs, and transfer ownership to George.** Do not create a second set of company accounts.
4. **One cutover for the whole team**, after a full build and a pilot. Reliability is the top priority. No department-by-department launch.
5. **Humans do only what a person must do.** Outbound messages, money, signatures, legal commitments, live calls and meetings, and anything the AI is not confident about. The AI is each person's daily manager: it orders the day, prepares the task, and closes the rest.
6. **One company model account does background work.** Employees are app users. They do not get model seats. Grok is the primary model. Gemini stays as the backup. See decision 14.
7. **The product is for human work.** The AI prepares. The person judges, communicates, reviews, and decides. The app opens on the next human step and uses an ask bar instead of filters. See [design principles](design-principles.md).
8. **Names.** My Workday, Growth, Communication, Review, Use AI, Calendar, Meetings, My Teams. Growth is a top-level tab. Review is where a person approves or sends a draft back. Use AI is a full workspace that can hand a result to Review or to the workday.
9. **Access is assigned, not toggled.** A person can lead one team and be a member of another. The live product has no role switcher. The prototype bar (Employee, Leader, Administrator, George) is a review tool only. See [roles](roles.md).
10. **Two owner accounts.** `george@hariribusinessservices.com` is the locked system owner and the only place that address appears. `georgehariri@gmail.com` is George's day-to-day user (the George view). Other administrators act under the system owner and cannot demote it.
11. **The app does not say HBS.** The brand in the product is Dental Practice Copilot / DPCP OS. Department items use that department's copilot logo. See [BRAND.md](BRAND.md).
12. **Daily check-ins are mandatory.** Two team meetings every workday: start of day and end of day. Morning questions are yesterday, today, and blockers. Evening questions are done, not done, and handoffs. Attending the meeting completes it. Missing it means the same questions on a short AI voice call. The transcript and summary are logged like the meeting. My Workday shows morning and evening as attended, done with AI, or missing, and offers the call when one is missing. Leaders see their team. George sees the company.
13. **No hard AI spend cap.** The AI is not cut off at a dollar amount, and background jobs do not pause because a budget hit 100%. Use AI starts from a task or a workflow. Most runs are background. Leaders see their team on AI usage vs output (cost, tokens, tasks completed, execution rate, efficiency trend). George and administrators see everyone. This replaces the hard stop in open question 10. Whether anyone gets a soft alert is still open.
14. **DPCP OS is model-agnostic.** Grok is primary. Gemini is the backup. Every model call goes through one provider switch (`lib/models.ts`) so a model can be changed in config. The Models panel sets primary and backup per task type. This answers open question 13 and technical decision D5.
15. **Time Doctor is a core platform.** It is already on the highest tier. Hours, activity, projects and tasks, idle time, and screenshot summaries are part of the information layer, shown on My Workday, on My Teams for a leader, and on AI usage vs output. Summaries are text. The prototype does not show screenshot images or patient detail. Raw screenshot handling for any future PHI add-on stays under open decision D13.
16. **The mission is People + AI.** George's words: "Leveraging People + AI to become the #1 company in dental practice management." That means being the best at owning and operating dental practices. People + AI is the same idea as humans doing the human work and AI doing the rest. The line is the tagline on the entry screen, the mission on My Workday, the first screen of orientation and onboarding, and the header of Wins & Culture.
17. **Employee experience is the design test.** Every screen has to pass six checks: work from home, one clear next thing on My Workday, connection through check-ins and Wins & Culture and the team, work people can enjoy because the AI took the drudgery, a visible stake in the mission, and growth as a person. See [design principles](design-principles.md).
18. **The culture is the three pillars.** Intelligence (problem solving), Energy (persistence and output), Integrity (honest conversations and strong leadership). Wins and shout-outs are tagged with one pillar. The AI suggests it. Recognitions sit on a person's profile. October has a spotlight, not a performance ranking. The pillars are on orientation.
19. **Growth is a top-level tab.** It is how a person gets better, not a report filed away. Supervisors and peers leave pillar-tagged feedback. A periodic review is scored on the three pillars. The AI drafts it from on-time rate, Time Doctor, client scores, recognitions, and check-ins. The supervisor edits and finalizes it. A career path says what the next level takes. Skills gained are kept. My Workday shows this week's goal and the latest note. A person sees their own. A leader sees the team. George sees everyone.
20. **Work connects up a chain.** Every person should see Individual → Team → Department → Company → Mission. Mission is People + AI, number one in dental practice management. My Workday puts a situational "Why this matters" line on the task. Growth shows the chain on the profile. Supervisor feedback has templates that name the chain. A reminder appears when a meaningful task or a client win is finished, not on every small step.
21. **The Sep 30 culture session is in the product.** A people directory with profiles. A new teammate gets an automatic "Meet our new teammate" post. Welcome and farewell are both structured: a send-off post, exit feedback, a handover checklist, and access removal. Monday's top three feed My Workday. Friday appreciations are pillar-tagged and feed the monthly spotlight. A new hire finishes a training track of three days to one week, with supervisor sign-off, before client tasks or client email. Pulse check-ins land on day 7, 30, and 90. Anyone can suggest a culture idea. Pillar definitions and example behaviors are placeholder text until George replaces them, and they show wherever a pillar appears.
22. **Users evolve the platform.** Feedback on DPCP OS is on every screen, as text or a voice note, and the screen context is captured with it. Ideas & Roadmap is public inside the company: people see ideas, vote, and watch Received → Planned → Building → Shipped. When something ships, Wins & Culture posts "You asked, we built" and credits the person. The AI clusters notes into themes for the Architect and George. This is separate from client feedback about a practice.
23. **The screen should feel like Apple, and like the brand.** Clarity, deference, whitespace, one focal point, large type, soft cards, little chrome. Navy and blue come from the Dental Practice Copilot logo, with the plane mark. The lockup reads "Dental Practice" over "Copilot OS". The mission statement appears once, in the footer under that name. "Why this matters" stops at the team and the company.
24. **Today is the day, not a dashboard.** The tab is Today. It opens with 3 to 7 items: the predicted successful day, including meetings. Finished items stay, struck through. A midday change is a banner, then the list updates. Tappable counts clear Communication and Review. Pages are for human work. Embedded chat panels are gone. A small floating mark opens an ask bar about that page. Use AI is the only full-screen conversation, and nothing else on that page is a destination.
25. **Meetings have types.** Daily is the Stand-up Meeting and the Update Meeting. Team Meetings are weekly, leader-led or George-led. Client Meetings and Internal Meetings are the other two. Each type has one color and label, shown on Today, Calendar, and Meetings, with a filter on Meetings. A miss on Today is "Make Up Stand-up" or "Make Up Daily Update", a short AI voice conversation, then the meeting is made up.
26. **Communication is one inbox.** Email and Slack, in order of importance. "Needs your reply" first, then "For your awareness" with one-tap acknowledge. Each message has an Ask AI line. The result goes to Review. WhatsApp and texts are later tabs, not built yet.
27. **Review is one card at a time.** Priority order, a progress count, files in Google Drive, point-by-point feedback, then Submit feedback. The AI revises and returns it. Approval queues a drafted send in Communication when a send is needed.
28. **Growth has two layers.** Execution is professionalism, responsiveness, on track, and speed, as scores and a simple trend. Growth areas are the three pillars plus one role skill, each tied to current tasks.
29. **George's view is two things.** What the team needs from him, as one-tap approvals, then a department progress view that shows only exceptions.
30. **My Teams includes project trackers.** Phases, owners, due dates, status, and dependencies. A current phase lands on that owner's Today. Templates are editable. The first template is a new dental location: site search, lease, construction, credentialing, hiring, launch.
31. **The prototype controls are a Demo menu.** View as, state, notice, Slack, reset, and all screens sit in one small Demo control, hidden until opened.
32. **The app is for the internal team.** HDG offices are a future client layer. No office screens. Tasks and people can carry an empty office id later.
33. **The prototype opens like the real app.** There is no catalog home. The first screen is sign-in: Dental Practice Copilot OS branding, one Sign in with Google button for HBS Google Workspace, and the mission only in the footer. Sign-in is fake. It opens a preview as Employee, Lead, or George, then Today. The small Demo tag stays for the rest of the review controls. The product brand is still DPCP OS. HBS appears only as the Google Workspace on that button.
34. **The practice desk is an original HDG design.** The shared computer in a practice (lists, who is here, requests, learning, the day, wins) is built from HDG's own front-desk work. It is not modeled on any outside checklist product. No outside product name, screen, wording, or visual system is used. Names on that desk are original: The Desk, Open the day, Huddle card, Sterile cycle, Close the day. The look is its own: warm paper, moss, and clay, large name tiles, not the internal navy app.
35. **The day tab stays Today.** A later note said "My Workday." Round 1 renamed that tab Today, and round 2 keeps Today. This is a question for George, not a silent rename.
36. **Round 2 adds the practice layer and the eight copilots.** Decision 32 still describes the internal team. The practice desk, the practice owner view, and the department modules are now in the prototype. Tasks and people may still carry an empty office id. The sample book is six fictional practices.
37. **Insurance shows initials and fake claim IDs only.** A badge on every Insurance screen says PHI stays in the PMS until a BAA. No dates of birth, member IDs, or clinical notes. The practice desk refuses that detail in the request box.
38. **A person sees their copilots. George sees all eight.** IT and Construction use Rowan until those teams have their own people. There is no separate IT or Construction logo in the brand folder, so those two use the plane mark.
39. **The HDG / Client switch is a prototype control.** It lives in the Demo menu and on the practice owner view. The work is the same. The tag and the rows change. Copper Canyon stands for HDG. Saguaro stands for a client.
40. **An appeal over $1,000 needs the lead.** The live sample is claim 88-1042 at $2,860. Nadia can approve the draft. Omar still signs before it is submitted. No pay figures are stored. Practice ratios are not someone's wage.

## Open questions from the product design

Each line is the question, then the recommended default. None of these are decided.

1. **Who approves a release.** Architect Bot reviews every change. Aqib moves a reviewed batch from staging to production. George also taps big user-facing changes. Rollback is one step.
2. **Grok Bot plan.** Buy SuperGrok Heavy for the one HBS account, with an on-demand usage card, "improve the model" off, and a monthly cap. No per-employee Grok seats.
3. **Who sees a person's execution rate.** The person, their lead, and George. Never coworkers. Never a ranking.
4. **Who approves an employee's outbound draft.** The employee, for a routine reply. Money, pricing, contracts, legal, or a new commitment goes to the lead, or to George above a set amount.
5. **How long a quick answer may take.** About 30 seconds. Longer work comes back as a task.
6. **Slack DM connect at launch.** Required for everyone, after a written "work Slack is managed" notice they acknowledge in the app.
7. **Never-touch list.** Health and leave, harassment or misconduct, pay disputes, discipline, legal claims, immigration, family matters, passwords, and anything an employee marks private with George. Those items go to a restricted HR queue. HR owns the list.
8. **Personal on-time goal.** Company target stays 80%. A person's default goal is 85%. They may raise it, not lower it.
9. **What "today" means.** The person's own shift and time zone.
10. **Monthly AI budget.** Decision 13 removes the hard cap: jobs do not pause at 100%. A soft alert at 50% or 80% is still open. The usage view is how leaders see cost.
11. **Uptime target.** 99.5% during working hours, reported weekly.
12. **Pilot.** George plus two staff. The pilot ends when George says the quality bar is met.
13. **Backup model.** Decided in decision 14. Gemini is the backup. The provider switch can point a task type at another configured model.
14. **#automation-team turnaround.** Acknowledge within one working hour. Simple tasks the same day.
15. **Who can send a must-acknowledge notice.** George, company-wide. HR, company-wide with George's OK. A lead, to their own department.
16. **Meeting notes.** Gemini notes on for internal Meet calls. For client calls, on, with the usual notice to attendees.
17. **What gets built first from Request or Report.** AI groups and ranks. George approves the top five each week. Bug fixes do not wait.
18. **Hours AI saved.** Standard minutes for that task type, minus the person's actual time. Shown as an estimate.
19. **Who approves a holding reply while someone is out.** The named backup.
20. **xAI Zero Data Retention.** On for the production API account.
21. **Launch shape.** A Monday after the pilot passes. A short live kickoff. Welcome notice and first-week paths ready that morning.
22. **Who sees finance numbers.** George and the finance lead. Everyone else sees only their own tasks.
23. **Payment approval.** The finance lead may release up to $500 to an approved payee. Above that, or any new payee or bank-detail change, needs George plus a call-back. No AI ever releases money.
24. **HR system of record.** A restricted employee record inside DPCP OS. Only HR and George see the sensitive fields.
25. **Attorney review of the Slack and email monitoring policy.** Yes, for Arizona, South Africa, and Pakistan, before cutover. See the [monitoring recommendation](legal/monitoring-policy-recommendation.md). That memo is not legal advice and is not a decision. Its checkboxes are still blank.
26. **Backups and PTO.** Every person has a primary and a secondary backup before launch. PTO rules are still to be set. Holiday calendars for the US, South Africa, and Pakistan.
27. **PHI owner.** Name one owner. Suggested: the insurance lead for operations, George for the final say. A one-page stop-gap policy before launch. RCM stays route-and-track until BAAs are signed.
28. **Stop the current PHI exposure now.** Yes, starting now: no patient data in personal Gmail, Claude, the Netlify tool, or n8n workflows that call Gemini or OpenAI.
29. **Coaching mail.** Drafts in George's HBS Gmail. A named person approves in DPCP OS and sends as George. George still approves any reply that answers a client question. Prep-confirmation auto-send is the one standing exception.
30. **WhatsApp vendor chats.** Still skipped. Key messages get forwarded into email. Revisit after launch.
31. **James Clinic bookkeeping.** Only status, counts, and exceptions in DPCP OS until a privacy review.
32. **Plain-text passwords.** Rotate any login that was posted in Slack or a sheet, and move it to the vault. The app redacts credentials on intake.
33. **Who sees pay.** George, the finance lead, the person who approves payroll, and the payee. Bots never repeat a pay figure.
34. **Client list.** One client record in DPCP OS is the source of truth. George confirms the active list once before launch.

## Open technical decisions

These overlap the list above. The technical design's D1 (RCM is a separate PHI add-on) and the account-transfer plan are already covered by the decided list.

- **D3.** Who can read a stored message body. Default in the design: the owner; George with an audited open; leads see counts, not bodies.
- **D4.** An employee's own Send goes out from their account. A bot draft always waits for approval. Who approves a client-facing draft is question 4.
- **D5.** Backup model. Decided in decision 14. Gemini, behind the provider switch.
- **D6.** xAI Zero Data Retention. Same as question 20.
- **D7.** Company monthly cap and per-person daily cap. Same as question 10. The dollar amount is not set.
- **D8.** Confirm Time Doctor Premium (the API needs it, and it is priced per user) and how tasks map.
- **D9.** Password vault is per user. Two seats, or self-host.
- **D10.** The SLO numbers (99.5% and the rest).
- **D11.** Whether a personal strategy account stays beside the one HBS Grok Bot account.
- **D12.** How long messages are kept, and how a deletion request is handled.
- **D13.** Time Doctor screenshot images for any future PHI add-on. Decision 15 puts text summaries in core. Raw images, and any reading of those images by a model, stay out of core until BAAs cover Time Doctor and the model provider.

## Prototype assumptions

These are so George can click the screens. They are not product decisions.

- The in-app clock is frozen at **Tue, Oct 20, 2026, 10:42 AM**.
- People and practices are fictional. "George" is the owner role in the product, not a data record of a real mailbox.
- There is no backend. `lib/seed.ts` is the data. `lib/store.tsx` is the only writer. Swap those for Supabase later. Screens should keep using `useApp()`.
- The prototype bar (role and state) is not part of the product.
- Insurance work shows counts and status only. A held message is redacted on purpose.
- Havasu Dental Group logos are in `public/brand/logos/hdg-practices/` and are not used in the app.
- Headings use Montserrat because the wordmark looks like it. Body text uses Geist. Confirm both with the brand owner before they are locked.
- The monitoring memo's Option B is a recommendation only.

## Round 3 defaults pending George

These are the open questions in the round 3 brief. Each line is the default used in the prototype. None of them is a decision.

1. **The Practice Owner page replaces the round 2 layout** on the same role and URL. Practice health, what DPCP is handling, and the needs-you line stay on the page, under the value hero. (Brief assumption.)
2. **The coach in the prototype is the office manager.** Robin Hale, Jordan Ellis, and the other office managers are the reviewer. The monthly PDF, once a person approves it in Review, is for the practice owner and that office manager. It is not sent on its own.
3. **No extra bar chart.** Round 1 keeps score cards as a number, a goal, and an arrow. Progress since joining uses those tiles. A separate "practice numbers" bar chart is not on the page.
4. **An amber with no red is Watch, not Priority.** The first red part is the only priority. Parts to its right are secondary until that part has a plan.
5. **Targets are the Guide's targets** for every practice. A coach cannot edit them in this prototype.
6. **Time given back is an estimate** from sample minutes per ticket type, and it is labeled Estimate. **Saved** counts a verified difference from the prior price only. Avoided costs are not shown as savings.
7. **The section is named Balance Assessment,** the same words as the form.
8. **Client practices see the same owner page,** including the Balance Assessment, on every sample tier. The HDG / Client tag and the services change. The work does not.
9. **The help map stands, including Coaching.** Coaching is a suggested queue. It is not an eighth copilot logo. Get DPCP help opens a real ticket on that queue.
10. **Fonts stay Montserrat and Geist.** The v0 guideline asked for a system font. The brand has not confirmed that, so the tokens keep the current faces.
11. **The marketing module spec** in `reference/copilot-module-specs.md` had an outside checklist product in its tools list. Those phrases were left out of the repo copy under the round 3 firewall. The rest of the spec is the attached file.
12. **The attached technical design** is in `reference/technical-design-v1.md`. `docs/technical-design-v1.md` was already a different file, so it was not overwritten.
13. **Manual availability** (metrics 1.6 and 3.2) is entered in days. The bands treat 14 days as two weeks and 21 days as three weeks.
14. **A one-doctor practice is not scored** on exam split. The row says "Not scored."
15. **5.5 never passes or fails.** It always shows a diagnostic pill. The split is insurance percent versus patient percent.
16. **September 2026 is the default month,** the last full month before the prototype clock (Oct 20, 2026). A new plan's review date defaults to Nov 19, 2026 (30 days). Copper Canyon's current plan keeps the brief's sample date, Nov 3.
17. **George and a lead can open any of the six practices** from the owner page. The Practice Owner role still follows the HDG / Client switch: Copper Canyon or Saguaro.

## Round 4 defaults pending George

These are the open questions in the round 4 brief, plus the choices this prototype made where the brief did not pick. None of them is a decision.

1. **E1 proof of done.** Internal items need a link to mark Done. A lead can use "No link: explain."
2. **E1 ledger visibility.** A person sees their own items. A lead sees their department. George sees all. The New Location rollup (12 overdue, 5 with no proof) is on Today and on the ledger for George.
3. **E2 launch template.** The template follows the 17-step New Location workflow, with sample durations. The New Location lead can edit it. The brief names a real editor; the screen uses Leila Okonkwo.
4. **E8 skipped questions.** A question that skipped the lead is flagged. It is not held back from George.
5. **E14 recare goal.** 35 attempts per person per day, editable per practice.
6. **E9 schedule.** 90-minute new patient = 30 doctor + 60 hygiene. SRP is 1 hour per 2 quadrants. Blocks release 2 days out. Labeled "HDG standard, editable."
7. **E12 design service.** Shown as a client request type now, labeled "Sample, not real pricing."
8. **Today > Meetings block redesign is pending Shama.** The block still works. Make-up and absence are wired around it. The layout of that block was not redesigned.
9. **The outer ring is Dental Practice Copilot.** That name was already in the product. No company initials were added.
10. **Phone navigation is a horizontally scrolling bar of the same seven items.** It sits at the bottom on a phone so the header can keep the mark and the view chip.
11. **A deep link with no session opens as Employee and stays on that URL.** Sign-in is one tap to Employee Today. Switch view is only in More.
12. **Fonts stay Montserrat and Geist.** Same as round 3.

## Round 5 defaults pending George

These are the choices this prototype made where the round 5 brief did not pick. None of them is a decision.

1. **Sign-in keeps one lockup.** The horizontal wordmark and the lockup were both on the screen. The lockup stays. The second logo is gone.
2. **Opening a communication item uses one sliding panel.** On a desktop it is a right-side panel. On a phone the same panel is full screen, with Back and Close. It slides in from the right.
3. **Communication channels are Client email, Internal email, and Internal Slack.** Announcements stay above them. WhatsApp and texts stay a later note, not a fourth channel.
4. **Core values are a placeholder.** The line is "Our core values (coming soon)". Wins & Culture is to be designed in detail by Manzoor as an immersive experience. This prototype does not redesign it past that line.
5. **Review is a vertical stack.** Each tile expands in place. There is no "1 of 8" pager. This replaces round 4's one-tile pager.
6. **The AI screen is a mock chatbot.** Files show as name chips only. Replies are scripted. Nothing is uploaded and nothing is sent.
7. **The two My Teams make-up buttons share one filled style.** My Teams otherwise stays as it was. Manzoor and Zaid will iterate on the page. George said it does not feel right yet.
8. **A meeting chat is tied to that meeting.** Typed notes and the chat save onto the meeting record. Desktop shows a side panel. Phone opens a bottom sheet.
9. **The Practice Owner Today page is pending George's next Loom.** It was not changed.
10. **Small helper copy is not rewritten.** Shama and Manzoor will go through lines such as "What a successful day looks like, start at the top."
11. **The Today meetings block redesign is still pending Shama.** Same as round 4.

## Round 6 defaults pending George

These are the choices this prototype made where the round 6 brief did not pick. None of them is a decision.

1. **Practice Owner opens Copper Canyon.** There is no HDG / Client switch anywhere in the product, including the demo menu. George and a lead can still pick one of the six sample practices from the owner page. The Practice Owner role stays on Copper Canyon.
2. **The owner page keeps the value line, health scorecards, department outcomes, and the monthly review.** Long handling notes sit behind "What DPCP is handling." Balance text sits behind "How to read this" and each scorecard.
3. **Role homes differ on Today.** Employee keeps the existing Today page, including the calendar. Lead, Admin, and Executive each get their own hero, accent, and nav order. Practice Owner stays on the owner dashboard. The calendar block is on every internal Today.
4. **The department tab uses the signed-in person's department.** Employee and Lead show Insurance. Admin shows Staffing. Operations maps to Dental IT Copilot. Coaching maps to Dental Construction Copilot. George and the Practice Owner show Copilots, which opens Departments & Copilots.
5. **Orientation collapses after every module is checked and the lead confirms.** Until then it stays open. Ongoing training is visible and locked until then. A demo control marks the lead confirmation.
6. **Where you fit uses four rings:** the person, their department, the copilot name (Dental Insurance Copilot and the rest), then Dental Practice Copilot. For George the department ring reads Company leadership and the business-unit ring is Dental Practice Copilot.
7. **AI usage and the you / department / company comparison are one chart section** at the bottom of Professional Growth. The separate usage page remains at its URL and is not linked. Counts are tasks, not pay. On-time stays a private ring.
8. **People & Org opens on nine copilot tiles.** Sample RACI is fictional and sits under the people in that department. Real matrices are pending Zaid.
9. **Copilot marks are one white mark on a colored tile.** Insurance navy, Staffing teal, Equipment purple, Supplies clay, IT blue, Accounting deep navy, Marketing brand blue, Construction brown, Dental Practice Copilot navy. Shama replaces the art.
10. **Decisions is unlinked.** The page still opens by URL so old notes do not 404. It is not in More, the screen index, or My Teams.
11. **Settings & Admin is one console** with the sections in the brief. Billing shows an active sample plan and no amounts. Connected accounts and security show status only. Design gallery, all screens, and system health sit under Help.
12. **Lead My Teams has a project board** with board and list, owners, due dates, status, workload, and overdue. It is pending Zaid's spec. Employee My Teams does not show that board.

### Delegated, not built

- Zaid: define the project management features for the Lead view, and supply the RACI matrices for People & Org.
- Shama: the brand identity pass and real logos for every department and copilot.
- Practice Owner page: more notes from George to come.

## Round 7 defaults pending George

These are the choices this prototype made where the round 7 brief did not pick. None of them is a decision. Where they differ from an earlier round, this section is the one to follow.

1. **Practice Level Team Member is a desk, not a sixth role.** It lives at /desk, outside the company chrome, on a shared computer at Copper Canyon. A person taps their name. Lists follow the role and the time of day. The pattern is a tap-to-check list. No other product's name or content is in the screen.
2. **Practice Owner tickets live at /owner-tickets.** The owner can submit a ticket and see status. Restricted people matters stay off that list. Review is the work sent back for approval, with Approve and Request changes. It is not the internal project stack. Appeal review stays on the company review page.
3. **Practice Owner meetings are appointments with the company team.** Each row has Join. The internal stand-up list stays on the company meetings page.
4. **Practice Owner More is only Switch view.** My Teams is not on that nav.
5. **DPCP Employee and DPCP Lead share one nav order.** Today, Communication, Review, AI, My Teams, Meetings, the department tab, More. DPCP Admin and George keep the round 6 order. The view that was called Executive is labeled George. The role id is still george.
6. **The department tab follows the signed-in person.** Switch view can open Nadia Reyes (Insurance), Amina Farouk (Staffing), or Theo March (Equipment). Theo's home is the lead home because that person is a lead.
7. **Opening a communication item replaces the list with a full page.** Client email, internal email, and internal Slack are stacked, with no channel toggle. A count is the items that need a reply, a decision, or a hold. Acknowledge and Send lower that count. Each section, and the page, can read All caught up. The older side panel remains in the code and is not used by this inbox.
8. **Wins & Culture keeps the line "Our core values (coming soon)".** The first win is a featured panel. The rest are cards.
9. **A review project opens a full page.** Approve stays off until every acceptance check is on. Send back records a note.
10. **The two My Teams make-up buttons open a simulated voice call.** There is no typed box on that call. End call writes a summary. The make-up chat on Meetings stays typed.
11. **My Teams opens on a today board:** checked in, stand-up, blockers, workload, overdue. A lead can nudge, and can step in on the blocked appeal. The lead project board stays on the page as a stub.
12. **Every meeting row has Join.** The meeting page has Before, During, and After. Join opens During. Still open, Take notes, I'll be absent, and the meeting assistant stay on the page. Typed notes still echo as "Saved on this meeting."

