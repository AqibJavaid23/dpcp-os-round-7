# Time Doctor V2: how the bot team takes it over (draft, Oct 3, 2026)

**What it is.** Three n8n automations share the Airtable base "HBS Team Oversight". A morning reset marks everyone Pending. Every 10 minutes the TD Daily Analyzer picks one person, pulls their Time Doctor screenshots, groups them, and has Gemini *describe* (not judge) each block. In the evening the report generator builds one PDF, emails it and then clears the table. The Oct 1 report had 12 of 21 pages broken by system failures plus 8 hard defects. Your review sets the order: reliability, then accuracy, then your draft PDF, then Phase 6. "Done" means 5 clean weekdays in a row.

**Who does each stage**
| Stage (review) | Chief Of Staff Bot | Cursor agents build |
|---|---|---|
| 1 Reliability (Prompt A): token refresh every run, Pending→Processing→Done/Error with retries, Gemini daily cap, error alerts, test copy | Turns the prompt into a GitHub issue | Workflow JSON changes |
| 2 Accuracy: time engine and idle incidents (B), AI descriptions only (C), pre-send gate (D), shift-based day, archiving and 30-day images (F) | 4 issues, each with its own test cases | Code, unit tests, replays of the 8 Oct 1 defects |
| 3 Per-supervisor PDF (E) | Issue; brings you the draft | Template; you sign off |
| 4 Phase 6 and later | Specs after the 5 clean days | Code |

Your six Stage 4 prompts are already written as build specs with acceptance tests, so they become issues almost unchanged. The Architect Bot reviews every change before it merges. Aqib only hands things over, provides credentials (a bot never touches a login or secret) and approves releases.

**What Aqib hands over first**
- JSON exports of all three workflows plus the token-generating workflow, with credentials stripped. It isn't confirmed which n8n instance runs TD today.
- The current Gemini prompts (observer, timeline, management report) and node change log
- Airtable schema and a sample day of data
- Who owns Time Doctor and how logins work: Ahsam's seat and the API token. Zain still holds the old credentials, and a plain-text token sits in the old exports.
- Where outputs go: PDF.co, Drive, the Gmail sender, the recipient list
- The inputs your review asked for: each team's time zone and shift hours, and the supervisor-to-team roster

**How it fits into DPCP OS** *(design, not built)*
Time Doctor minutes and idle incidents attach to each task, which makes Today plans realistic and lets the bot spot stuck work. The per-supervisor PDF becomes the leads view and the end-of-day report, with execution rate measured against real hours. Airtable likely moves into the DPCP OS database later *(guess)*.

**Risks and blockers**
- GitHub isn't connected, and the company org, the dpcp-os repo, the xAI/Gemini keys and the vault don't exist yet. Until they do, the bots can only write specs.
- Only people can do these: the exports, rotating the TD token, the Gemini billing and cap, n8n admin access, turning workflows on, and your layout sign-off.
- TD runs live in production with no test copy, so the test copy (Prompt A) comes first.
- Daily cost is still unmeasured (about 189 AI calls per person per day before grouping).
- The V2 Blueprint and Aqib's Sep 28–Oct 2 brief on the box are unreadable.
- Aqib's Oct 7 plan would change to a write-up of how the current logic works (pending your OK).
