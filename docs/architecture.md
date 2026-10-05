# Architecture notes

These are the decisions that change how the app is built. The clickable prototype keeps them in fake data. The production shape is still the one in the [technical design](technical-design-v1.md), with the updates below.

## Model provider

DPCP OS does not call a model vendor from a screen.

`lib/models.ts` is the switch. `callModel({ routes, taskType, prompt })` picks the primary model for that kind of work, or the backup when asked. The catalog is Grok (primary), Gemini (backup), and a slot for another model from config. Adding a vendor means adding a catalog entry and a client behind `callModel`. Screens, the router, and the check-in call this function and then stop.

Routes live on the model record (`modelRoutes`). An administrator or George changes primary and backup per task type on the Models panel (System, and Manage access). The next call uses the new route. Employees do not get model seats. One company account does the background work.

Task types in the prototype: drafts, review revisions, daily check-in calls, background jobs, ask-and-route, and meeting summaries.

## No hard spend cap

Nothing in the switch refuses a call because a dollar total was reached. Cost and tokens are recorded and shown beside output on AI usage vs output: tasks completed, on-time rate, and the four-week efficiency trend (tasks per dollar). A leader sees the people on the teams they lead. George and an administrator see everyone. An employee sees their own row. It is not a ranking.

## Time Doctor

Time Doctor is already on the highest tier and is a core source, not a side widget. The information layer reads:

- hours tracked
- activity
- project and task
- idle time
- a screenshot summary (text)

My Workday shows the person's own day. A leader sees the same fields for people on the teams they lead. The usage view puts those hours next to AI cost and tasks completed.

The prototype stores this in `lib/insights.ts`. It does not show screenshot images, and the summaries do not include patient detail. Raw images, and any model reading those images, stay out of the core app until a later PHI decision (DECISIONS.md, D13).

## Daily check-ins

Two team meetings a day, start and end. The questions are fixed. A person's check-in is `attended`, `ai`, `missing`, `upcoming`, or `excused` (out today). The AI call uses the check-in route from the model switch and writes the same summary and transcript shape as the meeting. Leaders read completion on My Teams. George reads it on Company.

## What the prototype does not do

No live Time Doctor API, no live model HTTP call, and no spend meter that can block a job. `lib/store.tsx` is still the only writer for check-ins and model routes. Swap that store later. Do not call a vendor from a screen in the meantime.
