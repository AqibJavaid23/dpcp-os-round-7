# Design guidelines

**Version:** v0, Sun Oct 4, 2026. Shama updates this file. Each change gets a date and one line on why.

Tokens live in `design/tokens.css`. Screens read those variables. A change there is a change everywhere that uses them.

## Feel

Calm, fast, and obvious. Every screen answers "what do I do next?" within a couple of seconds.

## Rules

1. **Layout.** One focal point. An 8-point spacing grid. Content about 1,100 px wide on desktop. Cards use a 14–16 px radius, a very light shadow, and no heavy border.
2. **Type.** Headings use Montserrat. Body uses Geist. The v0 note asked for a system stack (SF Pro, then Inter). The brand still uses Montserrat and Geist until the brand owner confirms a change. Sizes: large title, title, headline, body, caption. No more than three sizes on one card. Sentence case.
3. **Color.** Navy `#123B78`, blue `#0081CE`, deep navy `#0B254B`, tint `#BFD0E8`. Status is the same everywhere: green done or on track, amber needs attention, red blocked or overdue, blue AI working, gray not started. Light and dark both exist. Dark is a toggle on the design gallery and follows `html.dpcp-dark`.
4. **Motion.** 150–300 ms, ease-out. Sheets come up from the bottom. Reduced motion is respected on `.r3-motion`.
5. **Sheets.** Prefer a sheet or an inline expansion. A destructive or outbound confirm has one primary button and a quiet Cancel. Where undo is possible, the toast keeps Undo for a short moment.
6. **Controls.** Tap targets are at least 44 pt, and at least 64 pt on the shared practice desk. One primary button in a view. Segmented controls for two to four views.
7. **Navigation.** The existing left department rail stays. Phone keeps the bottom tabs plus More. New areas live in More and on All screens. Back uses the browser, and the main scroller remembers its place for the session.
8. **Empty, loading, error.** Every new list has an empty state with one next step, a skeleton while loading, and a plain-English error that says what to do.
9. **AI.** Quiet. The floating mark opens a sheet about the current screen. Suggested chips sit at the top of a work screen. AI copy is labeled "Drafted by AI" until a person approves it. "Done by AI" and "Needs a human" stay visually distinct.
10. **Writing.** Short, warm, plain. Buttons are verbs. No jargon on a practice-facing screen.
11. **Accessibility.** Status text is not color alone. Focus is visible. Controls have names.
12. **Gallery.** `/design/` shows buttons, cards, a sheet, status pills, and an empty state, in light and dark.

## Change log

- **2026-10-04.** v0 from the round 3 brief. Montserrat and Geist stay, because the brand has not confirmed a system font. Dark mode is a class on the page, not a second stylesheet.
