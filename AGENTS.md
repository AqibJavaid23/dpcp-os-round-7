<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# DPCP OS

Dental Practice Copilot OS is the internal operating app for Dental Practice Copilot. Do not put HBS in the product UI. About 20–30 people, in Arizona, South Africa, and Pakistan, will use it as the only place they work. George (the owner) approves every screen before it is built for real.

This repo is the **clickable prototype**. Fake data only. No backend yet.

## Principles

1. Assume the AI is better at the busywork. A person is needed for outbound messages, money, signatures, legal commitments, live calls and meetings, and anything the AI is not confident about.
2. The AI is each person's daily manager. People do not sort their own list. One day, one task at a time, already prepared.
3. One chat box. A router decides: quick answer, SOP lookup, data the person is allowed to see, an app action, real work that comes back as a task, a decision for a lead or George, or one clarifying question.
4. Nothing is lost and nothing is deleted. Save first.
5. Reliability beats features. The core app keeps working when the AI is down.
6. Calm screens. White space. Color is for status: green on track, amber due soon or behind, red blocked, blue needs you. Brand color is separate from status color (see below).
7. Privacy by role. An employee sees their own work. A lead sees their department. George sees the company. Execution rate is never a ranking.
8. **No PHI in core DPCP OS.** RCM/billing is a separate add-on and the only future home for patient information. Do not put patient names, dates of birth, member IDs, or treatment details in the prototype, the database, or prompts.
9. **No real data and no real staff names** in the app. Practices and people in the UI are fictional.
10. **Prototype first.** George approves each screen before anyone builds the real version. Do not start Supabase, auth, n8n, or live connectors until he says that screen is ready.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS v4 and shadcn/ui (Base UI)
- Installable PWA (`app/manifest.ts`, `public/sw.js`, icons in `public/brand/logos/app-icons/`)
- Planned production shape (not built): Vercel, Supabase, a model provider switch (Grok primary, Gemini backup), one company account for background jobs, n8n webhooks, Google Workspace, Slack, Time Doctor on its highest tier
- Model calls go through `lib/models.ts`. Do not import a vendor SDK from a screen.

## Brand

Tokens live in `app/globals.css`. Rules are in `docs/BRAND.md`.

- Navy `#123B78` is primary (wordmark, headings, active nav).
- Blue `#0081CE` is for buttons and links.
- Deep navy `#0B254B` is for dark surfaces (chat bubbles, the screen-index band, PWA theme color).
- Tint `#BFD0E8` is the light accent.
- The app is branded Dental Practice Copilot OS. Do not mention HBS in the UI. Footer: "Powered by Dental Practice Copilot OS".
- Montserrat for headings. Geist for body. Montserrat is an assumption until the brand owner confirms it.
- Header, light: `dpcp_horizontal_color_cropped.png`. Dark: `dpcp_horizontal_color-reversed_cropped.png`.
- Compact spots and the phone header: the copilot mark.
- Department rows use the matching family logo (insurance, marketing, staffing, finance, equipment, supplies). Coaching and operations use the copilot mark.
- Do not use `public/brand/logos/hdg-practices/` in the app chrome.

## Folder layout

```
app/                  routes (App Router)
components/           shell, screens, brand, overlays
components/ui/        shadcn primitives
components/screens/   one folder of screens George can edit one at a time
lib/types.ts          shared types (future Supabase row shapes)
lib/seed.ts           fake data
lib/router.ts         prototype chat router (keyword routes, not a model)
lib/store.tsx         client store — the only writer
lib/brand.ts          logo paths
docs/                 product, technical, screen specs, decisions, brand
docs/legal/           monitoring-policy recommendation (not a decision)
public/brand/         official logo kit
public/sw.js          minimal service worker for install
```

Screens read and write through `useApp()`. Do not import `lib/seed.ts` from a new screen except for constants that never change (the notice text, the onboarding steps). When a real backend exists, replace the store, not each screen.

## How to run

```bash
npm install && npm run dev
```

App: http://127.0.0.1:3847

`npm run build` must pass.

## How George reviews

Open `/`. Each screen is linked. The prototype bar switches Employee / Lead / Owner and the standard states (ready, empty, loading, error, offline, AI paused). Hide the bar to judge the screen. Phone width uses the bottom tabs and the copilot mark.

## Do not

- Add real names, real clients, or PHI.
- Send email, Slack, or any live API.
- Treat `docs/legal/` as legal advice or as a decision George has made.
- Build past the approved screen. The next step after a screen looks right is his approval, then the matching work package in the technical design (WP0–WP24).
