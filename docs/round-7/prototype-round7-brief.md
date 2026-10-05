# DPCP OS Prototype — Round 7 (FINAL before Monday Oct 5 team share)

Base: branch round-6 (commit bd4286d). Create branch round-7. Deploy to a NEW vibedrop link; keep rounds 1-6 live.
This is the version shared with the whole team tomorrow, so polish, coherence and realism matter. Fix anything broken you notice.
Source: George's Looms 6 and 7 (Oct 4 evening).

## A. Views (Switch view page)
Q1. Rename "Employee" to "DPCP Employee" (a member of the Dental Practice Copilot central team).
Q2. Rename "Lead" to "DPCP Lead".
Q3. Rename "Admin" to "DPCP Admin".
Q4. Remove "Executive". Replace it with a "George" view (George's personal view as CEO, carrying what Executive had).
Q5. Keep "Practice Owner" (the client view; see section B).
Q6. Add "Practice Level Team Member": the practice-staff experience at a client or HDG office. It's where staff submit tickets and do the MintChecklist-style daily checklists (shared computers, no login, tap your name). Build a real, usable screen: tap-name picker, today's checklist by role/time of day, report an issue / submit a ticket, request support, quick feedback. Keep it simple, big touch targets.

## B. Practice Owner view (client view) navigation
Q7. Top nav: Home | Tickets | Review | Meetings | Copilots | AI | More.
 - "Today" renamed "Home".
 - "Communication" renamed "Tickets": submit a new ticket and see the status of existing tickets.
 - Review = work DPCP has sent back for tickets the owner requested (approve / request changes).
 - Meetings = appointments with the DPCP team.
 - Copilots and AI stay as they are.
Q8. Remove "My Teams" from the Practice Owner nav.
Q9. "More" contains only "Switch view" for the Practice Owner.

## C. DPCP Employee/Lead navigation order
Q10. Department-specific tab moves to just before More. Order: Today | Communication | Review | AI | My Teams | Meetings | [Department tab] | More.
Q11. The department tab is dynamic: label and content swap to the user's department (Insurance, Staffing, Equipment, Supplies, IT, Accounting, Marketing, Construction, etc.). Show at least 2-3 departments working via the user/view switch.

## D. Communication tab
Q12. Opening an item (email/Slack) opens a FULL-PAGE reading view, not a side panel. Long threads, full history, reply/acknowledge actions, back to list.
Q13. Client email, Internal email and Internal Slack are stacked vertically on one page, each section visible, no toggles/tabs (so nothing gets forgotten).
Q14. Inbox zero: each section shows an unread/needs-action count that goes DOWN as items are acknowledged/replied. Show an "All caught up" inbox-zero state per section and overall.
Q15. Wins & Culture needs another iteration: make it more immersive and celebratory (keep the core-values placeholder).

## E. Review tab
Q16. Review items are projects. Opening one goes into an immersive full-page project view, like the Communication reader but richer: overview, deliverables/attachments, history/timeline, comments, checklist of acceptance criteria, approve / send back with feedback. Make it look realistic with believable dental-ops sample content.

## F. My Teams
Q17. "Make-up daily stand-up" and "Make-up daily update" launch a VOICE session that feels like a phone call with the AI (call screen, AI speaking prompts, mic/waveform, timer, end call, then auto-generated summary). No typed input. Simulated is fine.
Q18. My Teams overall is "not good": redesign it substantially. Clear purpose: a lead sees their team's status today (who's checked in, stand-up done, blockers, workload, what's overdue) and can act. Clean, Apple-like, scannable.

## G. Meetings
Q19. "Join meeting" button on EVERY meeting in the list.
Q20. Redesign what opens when you click a meeting. Think about the real flow: before (agenda, pre-reads, prep tasks), during (join, live notes, decisions, action items being captured), after (AI summary, decisions, action items with owners/dates, recording/transcript link). Make it genuinely useful, not just typed notes.

## Constraints
- Keep everything from rounds 4-6 unless changed above. No regressions.
- Logos stay placeholders for Shama; Zaid's Lead project board can stay a stub but should look intentional.
- Report back: new URL, branch, commit, and a checklist of Q1-Q20 with done/partial.
