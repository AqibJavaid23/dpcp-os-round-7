# Construction Copilot: DPCP OS module design v1
Built Oct 3, 2026 by HDG New Locations & Construction Bot. Internal draft, not reviewed by George or Shaldon.

**Basis:**
- The HDG New Locations department needs spec (/workspace/org-design/design/dept-needs/hdg-locations.md)
- New_Location_Workflow_v3 (Drive 1ai4t6TTR52LWnWdJC_Q3vwL5sDqVChtX), with its 17 steps and 3 gates
- The rural TI playbook (rural-ti-playbook-v1.md)
- The Dental Construction Copilot offering draft (dental-construction-copilot.md)
- The SOP coverage tracker (sop-coverage-tracker.md)

Anything marked [design] is my proposal. It isn't a decision.

## 1. Principles
- **HDG comes first, then clients.** Shaldon's team runs Kingman and Sierra Vista in this module. A client gets the same screens on their own project, and HDG's numbers serve as benchmarks.
- **One task at a time.** Each person's Today screen shows the single next thing to do, plus a count of what's queued behind it. This follows the DPCP OS principle.
- **The AI prepares and a human decides.** The AI drafts, compares, tracks and chases. A human signs, negotiates, visits, pays, approves anything going outside, and rules on anything the AI is unsure of.
- **Every step links to its SOP.** A step without one shows "No SOP yet" and feeds the coverage tracker.
- **Practice staff tap their name instead of logging in.** On site, staff use this for punch-list and delivery checks. Logins are only for Shaldon's team, George and client owners.

## 2. Screens
| Screen | Who | What it shows |
|---|---|---|
| **Today** | Everyone | One task card with the action, its due date, the project, the SOP link and Done / Blocked / Hand back buttons. A queue count sits below it. |
| **Portfolio** (lead view) | Shaldon, George; a client owner sees only their own projects | Each project's place on the 17 steps; the 3 gates (doctor, FDA clearance, layout sign-off); the projected opening date; red flags |
| **Project** | Project team | Tabs for Pipeline, Site and lease, Design, Bids, Budget, Procurement, Barter, People and credentialing, Documents and Log |
| **Deadlines** | Lead, owner | LOI expiry, due diligence, lease signing, free-rent start, TI credit dates. Alerts go out 14, 7 and 2 days before each one [design]. |
| **Bids** | Shaldon, Nosi | A quote log by trade, compared side by side against the per-op budget and the in-house cost, with a flag showing whether a quote could be bartered |
| **Budget** | Shaldon, George, client owner | Budget against actual per op and per sq ft, and TI asked against TI received. Kingman is the benchmark: $185K asked, a $25K credit after 12 months. |
| **Procurement** | Mishka, Junaid | POs, landed cost (duty, freight, 510(k)/FDA), ETAs and holds |
| **Barter ledger** | Shaldon, Zaid, Ahsam | Trades, labor hours, dental credit owed and credit redeemed |
| **Site check** (tap-your-name) | On-site staff and contractors | Punch list, delivery receipt, and photo upload for each room |
| **SOP library** | Everyone | One SOP per step, showing its status (Written, Partial, Assigned not seen, None), owner and last review date |

## 3. Request types
Each request becomes a task card on someone's Today screen.

| Request | Raised by | AI handles | Human task |
|---|---|---|---|
| New site screen | Lead, client | Market data, listings, TI comps and a draft 1–10 scorecard | Site visit and scoring (Shaldon); go or no-go (George or client) |
| LOI draft | Lead | Drafts from the template, with the TI ask computed from the per-op budget | Negotiation (Shaldon); signing (George or client) |
| Lease review | Lead | Compares the lease line by line against the signed LOI, flags differences and builds the deadline calendar | Negotiation; legal review if needed; signing |
| Layout / blocking diagram | Lead | Intake checklist (ops, ADA, equipment power, ceiling runs, RO/PEX) and revision tracking | Johannah draws; Shaldon reviews; regulatory sign-off |
| Contractor bid request | Lead, Nosi | Drafts outreach, logs quotes, normalizes and compares them, and flags barter fits | Approving outbound messages; site visit (Nosi); awarding the bid (Shaldon) |
| Barter deal | Shaldon, Zaid | Script, candidate list and ledger entry | Closing the deal; recording the credit liability (Ahsam) |
| Purchase order / import | Mishka, Junaid | Landed-cost model, 510(k) check, PO and ETA tracking, hold alerts | Payment approval (George or client); FDA and customs signatures |
| Entity / NPI / insurance | Ahsam | Checklist, status, chasing missing items, address-match check | Submissions and signatures |
| Credentialing | Sadaqat, Khadim | Status by payer, chasing documents | Submissions |
| Staffing for opening | Nomi | Role checklist and the countdown to 2 weeks before opening | Hiring decisions |
| Change order | Contractor, Shaldon | Shows the cost and schedule impact against the budget | Approval (Shaldon; George above a threshold [design]) |
| Payment request | Contractor, vendor | Matches it to the PO or bid and to the work marked done | Payment (George or client); Ahsam records it |
| Punch-list item | On-site staff (tap-your-name) | Routes it to the trade, and tracks it to close-out with photos | Fixing it; Shaldon confirms |
| Opening review | System, at opening and 30/60/90 days | Actuals against budget and timeline; draft lessons for the SOPs | Review meeting; SOP updates approved by Shaldon |

## 4. Statuses
**Request statuses:**
- New
- In AI prep
- Waiting on human (the task card is live)
- Waiting on outside party
- Blocked, with a reason and an owner
- Done
- Cancelled

When a request passes its due date, it's marked Overdue and goes to Shaldon.

**Project stages** follow Workflow v3: Site verification, Layout, Regulatory check, LOI, Entity, Doctor, Credentialing, Engineering, Contractors, Lease, Insurance, Procurement, Build, Marketing wave 1, Staffing, Marketing wave 2, Open, then Review. Each stage is Not started, In progress, Blocked or Done.

**Gates:** the doctor, FDA clearance and layout sign-off gates are each Open, At risk or Cleared. The opening date is projected only once all three are Cleared or have a date [design].

## 5. What AI handles and what becomes a human task
**AI handles:**
- Drafting LOIs, outreach, scripts and recaps
- Comparing leases against the LOI and bids against budget
- Landed-cost math
- Deadline calendars and alerts
- Chasing missing items internally
- Turning transcripts into tasks
- SOP coverage tracking
- Benchmarks against HDG actuals

**Always a human task:**
- Signing LOIs, leases and contracts
- Negotiating with landlords, agents and contractors
- Site visits and scoring
- Any payment or purchase approval
- Approving any message going outside before it's sent
- Barter commitments
- Design and aesthetic direction (George, or the client owner)
- Regulatory and FDA sign-offs
- **Any AI output it marks low-confidence**, such as an unclear lease clause, a conflicting quote, or a missing source. These become a "Review" task for the owner instead of being acted on.

## 6. HDG first, then clients
- **Phase 1:** run Kingman, and Sierra Vista or whatever replaces it, end to end in this module. Fill in the SOP library from the coverage tracker.
- **Phase 2:** turn on client projects. The client owner gets Portfolio, Project, Today, Budget and Site check for their own sites. Shaldon's team are the assigned humans. HDG benchmarks appear without HDG's private terms [design].
- **Pricing and the service definition** belong to the Dental Construction Copilot track. Shaldon's draft is due Oct 30 and pricing Nov 13; both dates are proposed (/workspace/dpcp-launch/owner-briefs/construction.md).

## 7. Open questions
1. What's the change-order and payment threshold that needs George? [design: none set]
2. Should barter credit be booked as a liability by Ahsam? Accounting treatment isn't decided.
3. Do clients see HDG benchmark numbers?
4. What is Future Built Construction's role? It's still unknown.
5. Where does Zaid's tracker sheet live, and should it be migrated or replaced?
