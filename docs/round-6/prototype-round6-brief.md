# DPCP OS prototype, round 6 brief (George's Looms 4 and 5, Sun Oct 4, 2026, ~6:20 PM AZ)

Base: branch `round-5` (commit ba223f4e50b69755ec565c8cf1d8f89069e0ba7a), live at https://ajaynmgy.vibedrop.site.
This is the LAST prototype before the team's Monday kickoff. Keep everything not listed below.

## Keep (praised)
- The calendar (Today / This week): "love this, all good there."
- Professional Growth "Where you fit" rings, Growth areas, and the idea of AI usage living inside Professional Growth.
- The RACI idea, the Departments & Copilots view, and Ideas & Roadmap ("encourages our team to make suggestions").
- The Practice Owner page *concept*.

## Changes to build
- **N1 Practice Owner Today: redesign.** George: "this whole thing is just bad, needs to be redesigned." Remove the HDG / Client toggle entirely, because everyone is a client and there's one experience. Rebuild the page as a clean owner dashboard.
- **N2 Balance Assessment: data-driven and graphical.** It's "really messy." Clean it up and present it with charts, gauges, trend lines and scorecards so an owner can see what's going on in the office at a glance. Use fake numbers only. Text goes into tooltips or drill-downs.
- **N3 Switch view: role-specific experiences.** Each role (Employee, Lead, Admin, George/Executive, Practice Owner) should feel like a completely different, immersive experience: its own home layout, accent, nav emphasis and hero content, not the same screens with a toggle. Make the switcher itself feel polished (role cards with an icon and a one-line description).
- **N4 Department in the top nav.** When a person is assigned to a department (e.g. Insurance), that department appears as its own tab in the main top nav (and the phone bar), so they never go to More for it. Show it with the fake current user's department.
- **N5 Professional Growth: onboarding and training in the app.**
  - Introductory orientation training comes first: modules, progress and completion.
  - Once orientation is complete, it's marked done and collapses or disappears, because it only exists at the beginning.
  - After that comes ongoing professional training: a module library with progress.
  - Fold the round-4 L20 Training checklist into this.
- **N6 Professional Growth: graphical data.** All data on this tab is graphical and intuitive (charts and progress rings, not text tables). This is a general rule: anywhere we show data, prefer visuals.
- **N7 AI usage inside Professional Growth.** Remove the small text link to a separate AI usage page. Move AI usage further down Professional Growth and merge AI usage versus output with the Comparisons (you vs. department vs. company) into ONE graphical section.
- **N8 "Where you fit": business-specific.** Keep the rings, but make the labels and content specific to the real business structure: the person, their department, the business unit (e.g. Dental Insurance Copilot), then Dental Practice Copilot. Use the brand names, not generic words.
- **N9 People & Org: department tiles first.**
  - Start with clickable department tiles that show each department's logo.
  - Clicking a tile drills into that department's people, each with a small employee profile card: start date, role, a few "about me" facts, and a fake avatar.
  - Keep and integrate the RACI matrix per department, with sample RACI data. Zaid's real matrices replace it later.
  - All names are fictional.
- **N10 Branding everywhere.** George is "very particular" about the whole Dental Copilot brand identity. Departments & Copilots and People & Org show an individual logo for each copilot or department: Dental Insurance, Staffing, Equipment, Supplies, IT, Accounting, Marketing and Construction Copilot, plus Dental Practice Copilot. Build them as a consistent placeholder logo system (the same mark style, a distinct color per copilot) that Shama will replace. Put brand marks in the headers.
- **N11 More > Decisions: remove.** Remove the Decisions screen from More and anywhere it's linked.
- **N12 Settings & Admin: rebuild, very robust.** Rebuild it as a full admin console:
  - Profile and preferences, notifications, and working hours.
  - Users and roles, with role-based permissions (a matrix).
  - Departments and teams management, and practice/location management.
  - Connected accounts and integrations, shown as status only with no credentials.
  - Branding and theme, an audit log, data and privacy, and security (2FA and sessions, shown as status only).
  - Billing and plan placeholder, and help.
  - Everything is mock.
- **N13 Lead view: project management stub.** Zaid will define the project management features the Lead view needs. For now, add a basic project management layer to the Lead view's My Teams: projects with owners, due dates, status, a board/list toggle, workload per person and overdue flags. Mark it in DECISIONS.md as "pending Zaid's spec."

## Delegated to people (no build; list in DECISIONS.md)
- Zaid: define the project management features for the Lead view, and supply the RACI matrices for People & Org.
- Shama: the brand identity pass and real logos for every department and copilot.
- Practice Owner page: more notes from George to come.

## Report format
Report in this order:
1. The round-6 URL.
2. Confirmation that rounds 1-5 are untouched.
3. One line per N1-N13 (built / partly built / stubbed / deferred).
4. Anything cut, and why.
5. The branch and final commit SHA.
6. The defaults used.
