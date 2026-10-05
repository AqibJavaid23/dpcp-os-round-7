# Design principles

Dental Practice Copilot OS is the place a person does the work only a person should do. The AI prepares, drafts, and routes. The person judges, talks to people, reviews quality, decides, and is accountable.

The mission is George's: **Leveraging People + AI to become the #1 company in dental practice management.** That means being the best at owning and operating dental practices. People + AI is the theme of the product.

## The design test

Every screen has to pass this. If it fails one line, it is not done.

1. **Work from home.** Remote-first. Nothing assumes a shared office.
2. **Organized and clear.** My Workday is one prioritized next thing, with a reason.
3. **Connected.** Check-ins, Wins & Culture, and who is on the team.
4. **Enjoyable.** The AI takes the drudgery. The screen should feel calm and finished.
5. **Part of something bigger.** The mission, practices helped, and company milestones are visible on My Workday and at the start of orientation.
6. **Grow as a person.** Growth is a top-level tab. Skills gained are kept. A small nudge on My Workday points at this week's goal.

## For humans

Names, labels, and microcopy speak to a person, not a system. "My Workday", "Growth", "Communication", "Review", "Use AI", "Calendar", "Meetings", "My Teams".

Prepared work is labeled as prepared. Anything that still needs a person is labeled as needing them. The person directs the AI and approves what goes out.

## Guide, don't filter

The app opens on the next thing that needs a human, and says why it matters. A review that is ready again shows up on My Workday. Details stay one step away.

Each area has an ask bar instead of filter controls. A person types what they need ("emails from Dr. Patel this week", "what's overdue on my team") and the area answers in place. Two or three example prompts sit under the box. Chat-to-filter replaces filter UI.

## Roles are assigned

In the live product there is no switcher. Management assigns access. A person can lead one team and be a member of another, and each team shows the matching view.

The prototype bar is not the product. It only lets a reviewer look through four views: Employee, Leader, Administrator, and George. See [roles](roles.md).

## Brand

The product is Dental Practice Copilot OS (short form DPCP OS). The header lockup is the DPCP logo plus an "OS" wordmark. The footer says "Powered by Dental Practice Copilot OS" in DPCP navy and blue.

Do not mention Hariri Business Services or HBS anywhere in the app: not in the interface, copy, fake data, page titles, manifest, or icons. HBS is a private holding company and stays out of this product. The only exception is the system owner's email address, `george@hariribusinessservices.com`, and only where that address is shown on the admin screen.

Department items use that department's copilot logo. Where the kit has no logo, use a DPCP-colored placeholder and record the gap in [BRAND.md](BRAND.md). The DPCP OS lockup stays the app-level brand.

## The day has two check-ins

Start of day and end of day are mandatory team meetings. The questions do not change: yesterday, today, and blockers in the morning; done, not done, and handoffs in the evening. Missing the meeting does not skip the check-in. The same questions happen on a short call with the AI, and the transcript is kept with the meeting notes.

My Workday says whether each one is attended, done with AI, or missing, and the missing one is the prompt. A leader sees the team. George sees the company.

## AI is tied to the work

Use AI starts from a task or a workflow. Long work runs in the background and comes back on the workday. Open chat is for the thing that is not a task yet.

There is no hard spend cap. Usage (cost and tokens) sits next to output (tasks completed and on-time rate), with the trend. A leader sees their team. George and an administrator see everyone. It is not a ranking.

Time Doctor is part of that picture: hours, activity, the project and task, idle time, and a screenshot summary. The summary is text. The image stays in Time Doctor.

## Models are a setting

Grok is primary. Gemini is the backup. Calls go through one switch, and an administrator or George can point each kind of work at a different model. Screens do not talk to a model vendor directly.
