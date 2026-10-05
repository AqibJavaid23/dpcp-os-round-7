# DPCP OS source snapshot

Branch: `round-7`
Commit: `1a5c19b7ca49542c82eeec9d505b2e3eceb0f33c`

Clean source tree for that commit. This archive omits `node_modules`, `.next`, `out`, `dist`, and `.git`.

---

# DPCP OS

Dental Practice Copilot OS. This repository is the clickable prototype: the screens George reviews before any real build.

People in the app are fictional. There is no patient information and no backend.

## Run it

```bash
npm install && npm run dev
```

Open http://127.0.0.1:3847

`npm run build` writes a static export to `out/`. Fake data stays in the browser, so the exported site needs no server and no login.

```bash
npm install
npm run build
npx --yes serve out -p 3847
```

Routes use a trailing slash (`/today/`, `/tasks/nadia-mesa/`) so a plain static host can open them. Zip the folder to share the same build:

```bash
zip -r dpcp-os-static.zip out
```

## How George reviews screens

1. The app opens on Sign in with Google (HBS Google Workspace). Signing in is fake: choose Employee, Lead, George, or Practice Owner. The team lands on Today. A practice owner lands on Practice health. **Play the demo** on that same screen walks a crown appeal and a broken chair. Practice desks (`/practice/saguaro/`, `/practice/copper-canyon/`) need no login.
2. The small **Demo** tag still switches view (including Administrator and Practice Owner), state, notice, Slack, reset, and HDG / Client. **All screens** in that menu lists every screen. The left rail is the eight copilots a person belongs to. George sees all eight. Feedback on DPCP OS sits on every screen and lands on Ideas & Roadmap. The mission is in the footer. A task shows why it matters, up to the company. People, farewell, and Jamie's training gate are in the directory. George or Amina sees feedback themes and can move an idea to Shipped, which credits the person in Wins & Culture. See [round 2](docs/round-2.md).
3. Use **State** to check empty, loading, error, offline, and AI paused. The product has to work in all of them.
4. Hide Demo when you want to judge the screen itself. It is not part of the product.
5. On a phone width, tabs sit at the bottom. The header uses the copilot mark. Must-acknowledge notices go full screen.
6. Say which screen is approved, and what to change, before that screen is built for real.

Chat on Today already has the four routes worth clicking: an SOP answer, a clarifying question, an approval, and a job that comes back as a task. Type in the box to try the others (a quick answer, "move to Friday", "show me Sana's messages").

## Docs

- [Screen specs](docs/screen-specs-v2.md) — what each screen does
- [Product design](docs/product-design-v1.md)
- [Technical design](docs/technical-design-v1.md)
- [Decisions](docs/DECISIONS.md) — what is already decided, and the open questions
- [Architecture](docs/architecture.md) — model switch, Time Doctor, check-ins, no spend cap
- [Brand](docs/BRAND.md)
- [Time Doctor V2 takeover](docs/td-v2-bot-takeover.md)
- [Monitoring policy recommendation](docs/legal/monitoring-policy-recommendation.md) — not legal advice, not a decision

## Stack

Next.js, TypeScript, Tailwind, shadcn/ui. Installable as a PWA. The data layer is typed and fake so it can be swapped for Supabase later.
