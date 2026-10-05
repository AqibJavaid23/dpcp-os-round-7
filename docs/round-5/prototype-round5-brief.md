# DPCP OS prototype, round 5 brief (George's Loom 3, Sun Oct 4, 2026, ~6:13 PM AZ)

Base: branch `round-4` (commit 4afcb8a96b0ac8f72a10d71c6b392c82dddf2a28), live at https://3q6hbzkn.vibedrop.site.
George's verdict: "Overall, I really like this look and feel." Keep everything not listed below.

## Keep (praised)
- Overall look and feel, sign-in, Today dashboard ("love this"), Communication landing ("beautiful"), AI screen ("love this"), the My Teams make-up buttons existing, Switch view, the Practice Owner page structure ("this is right").

## Changes to build
- **M1 Sign-in: one logo.** There are two "Dental Practice Copilot OS" logos on the sign-in screen. Show exactly one; fix the layout around it.
- **M2 Communication: better open behavior.** Opening an item (e.g. "September collections") "opens up kind of weird." Replace it with a clean, smooth open: a right-side detail panel on desktop and a full-screen sheet on phone, with a clear close/back and animation. Choose the simplest polished option and record it in DECISIONS.md.
- **M3 Communication: split channels.** Separate into three distinct sections/tabs: **Client email**, **Internal email**, **Internal Slack**. Announcements stay first (from round 4). Fake data in each.
- **M4 Communication: more overview in the open item.** The expanded item needs more overview: a short AI summary, who's involved, the thread/history at a glance, status, related items/tasks, and suggested next action. Keep the edit-and-send pop-up and Acknowledge.
- **M5 Wins & Culture: core values placeholder.** Remove the "Intelligence, Energy, Integrity" values text. Replace it with a clearly labeled placeholder: "Our core values (coming soon)". Keep the section at the bottom of Communication. Mark it in DECISIONS.md as "to be designed in detail by Manzoor as an immersive experience"; don't redesign it beyond the placeholder.
- **M6 Review: vertical tiles, no pagination.** Remove the "1 of 8" Previous/Next pager. Show all review items as **bigger tiles stacked down the page** (scroll), each keeping the same expand function. This overrides round 4's L9 "one large tile at a time."
- **M7 AI: traditional chatbot.** Make the AI screen work like a standard chatbot: file attachment (paperclip, drag-and-drop, shows attached file chips with fake upload), conversation history list/new chat, copy/regenerate on replies, suggested prompts, streaming-style reply animation, and stop button. Mock responses only.
- **M8 My Teams: same-color buttons.** "Make-up daily stand-up" and "Make-up daily update" buttons use the exact same color/style. Don't otherwise redesign My Teams; George flagged that the page "doesn't feel right" and Manzoor and Zaid will iterate on it. Record that in DECISIONS.md.
- **M9 Meetings: meeting-scoped AI chat.** When any meeting is opened, show an embedded chat panel tied to *that* meeting (header shows the meeting name so it's obvious the AI knows the context). The user can document things/take notes, request things ("add an action item for…", "summarize so far", "draft the follow-up"), and the AI replies about that meeting. Notes/requests saved to the meeting record. Works on phone (bottom sheet) and desktop (side panel). Typed notes from round 4 L11 can merge into this panel.
- **M10 Practice Owner view: pending.** George said the Practice Owner Today page "needs to be modified" but the video cut off before the details. Don't change it; mark it "pending George's next Loom" in DECISIONS.md.

## Delegated to people (no build, list in DECISIONS.md)
- Shama and Manzoor go through all the small helper copy (e.g. "What a successful day looks like, start at the top") in detail.
- Manzoor designs Wins & Culture as an immersive experience.
- Manzoor and Zaid iterate on My Teams.
- Shama still owns the Today Meetings block redesign (L3, from round 4).

## Report format
Line 1 is the round-5 URL. Line 2 confirms rounds 1-4 are untouched (HTTP 200). Then one line per M1-M10 (built / partly built / stubbed / deferred), anything cut and why, the branch and final commit SHA, and the defaults used.
