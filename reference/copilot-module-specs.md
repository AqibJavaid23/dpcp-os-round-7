# DPCP OS: Custom module specs for the 8 client-facing Copilots
Draft for prototype round 2. Written Sat Oct 3, 2026 (AZ) for George's Sunday-morning review.
Owner: HBS Grok Bot (prototype brief). Read-only research. Nothing was sent or changed in any app.

**How to read this.** Each Copilot section has:
1. **Snapshot**: services, who the client is, key metrics, typical requests, and tools, with the sources behind them.
2. **Custom modules**: the screens and tools that appear **only when a user is inside that department** (on top of the shared tabs: Today, Communication, Review, AI, Calendar, Meetings, My Teams). For each one: purpose, what's on screen, sample data, the **AI does / a human does** split, and the practice-facing request types it serves.

**Rules for the prototype**
- **All sample data is fictional.** No real client, patient, vendor or employee names, and no pay data. The practices below are made up.
- **[ASSUMPTION]** marks anything that isn't in a Drive or workspace source and is filled in from standard DSO practice.
- **PHI rule (George's decision):** RCM is the only area that touches patient data. In the prototype, Insurance screens show realistic but fake patient initials and claim IDs, and a "PHI stays in the PMS until BAA" badge.
- **Humans vs AI:** every module shows a clear **Done by AI** vs **Needs a human** split. The human step is always a judgment, a relationship, an approval, or a signature.

**Shared fictional practices (use everywhere)**
| Practice | Type | City (AZ) | Chairs | PMS | Notes |
|---|---|---|---|---|---|
| Copper Canyon Dental | HDG | Kingsford | 12 ops | Open Dental | De novo, opened 6 weeks ago |
| Mesa Verde Family Dental | HDG | Sunvale | 14 ops | Open Dental | In build-out (Construction module) |
| Ponderosa Smiles | HDG (acquired) | Pine Hollow | 8 ops | Dentrix | Integration in progress |
| Saguaro Family Dental | Client | Desert Springs | 6 ops | Eaglesoft | Insurance + Marketing + Supplies |
| Lakeview Dental Arts | Client | Lakeview | 9 ops | Curve | Insurance + Accounting + IT |
| Red Rock Pediatric Dental | Client | Red Rock | 5 ops | Dentrix | Staffing + Equipment |

---

## 0. The shared department frame (every Copilot gets this)
When a user switches into a department, the left rail swaps to that department's modules. Every department starts on a **Department Home** with the same four blocks, so switching feels familiar:
1. **Needs a human today**: the 3 to 7 items only a person can do, ranked (same strikethrough-on-complete pattern as Today).
2. **Done by AI since yesterday**: a quiet count with a "see what AI did" link (e.g. "AI verified 46 patients, drafted 3 appeals, matched 112 ERA lines").
3. **Practice requests**: the department's slice of the live request tracker (new, AI working, with a person, waiting on practice, done), with SLA timers.
4. **Department pulse**: 4 headline numbers (department-specific, listed per Copilot below), each with goal and trend arrow. No bar graphs (George's round-1 rule on score cards).
A small **HDG / Client** toggle filters every module (same experience, different book of business).

**Request routing table (practice staff site → department)**
| Practice staff taps... | Routed to | AI first step |
|---|---|---|
| "Equipment is broken / needs service" | Equipment | Troubleshooting checklist, warranty lookup, service ticket draft |
| "We need to order supplies" / "We're low on ___" | Supplies | Matches to catalog/par level, builds the cart |
| "We need to hire" / "Someone quit" / "Need a temp" | Staffing | Drafts job post from role template, opens a requisition |
| "Insurance question" / "Patient balance question" / "Need a verification" | Insurance | Pulls eligibility status, answers or opens task |
| "Computer / phone / internet / printer problem" | IT | Guided fix steps, then help-desk ticket |
| "Bill / invoice / payroll / P&L question" | Accounting | Pulls the document or report, drafts the answer |
| "Marketing / website / reviews / ad question" | Marketing | Pulls this week's numbers, drafts the answer |
| "Something in the building is broken" / "Remodel / new space" | Construction (Facilities) | Work order + photo intake, vendor shortlist |

---

## 1. Dental Insurance Copilot (DICP): billing, RCM and credentialing. **Deepest treatment.**

### Snapshot
- **Services:** eligibility and benefits verification (with add-ons), verification QA, claim submission and scrubbing, rejections and corrected claims, payment posting (ERA/EOB/checks), AR follow-up, denials and appeals, month-end client reports, credentialing and fee-schedule negotiation, plus HBS's own invoicing to clients. Being rebranded from HBS billing to DICP; existing clients keep current pricing, new clients get new DICP pricing (pending the lead's pricing analysis).
- **Client:** HDG practices and outside client practices (US and Canada) that outsource their insurance billing.
- **Team shape:** a billing lead, an AI-adoption lead, a credentialing specialist, eligibility verifiers with a supervisor, and claims/posting/AR billers. Lower-cost new hires are planned, supervised by the experienced team.
- **Key metrics:** collections vs production, AR aging buckets (90+ highlighted), days in AR, clean-claim rate, denial rate by reason, appeals won, posting backlog, verifications done before date of service, **% of tasks done with AI and hours saved per biller** (George's metric).
- **Typical practice requests:** "verify this patient for tomorrow," "why was this claim denied," "patient disputes balance," "we got a check with no EOB," "add a new payer," "credential our new associate."
- **Tools:** PMS (Open Dental, Dentrix, Eaglesoft, Curve, DPX), payer portals (Availity, Delta, MetLife, Aetna, BCBS, Humana), remote access (Splashtop/RemotePC), clearinghouse (not yet identified per client), client Google Sheets for AR and posting.
- **Sources:** `/workspace/org-design/design/dept-needs/insurance-rcm.md`; `/workspace/billing-team/` (knowledge, rcm-task-inventory, ai-roadmap); Drive: *George Sadaqat Team Costs* Sep 30 notes (1zYzpfIEwCrSI1z253TJFPIYPLaypFm4hI6knRK95zhI), *HBS Team Redesign/Update* Phase 2 tab (1GzfOZXaDlzQsCSngFf-1F8ljKs465n-1vvDPYPd0jNY), *HBS Dental Billing Process Overview* and *Error Reduction SOP & GPT-Enhanced Workflow* (HBS Dental Billing folder, per drive-map), *Dual Insurance Handling SOP*, *Insurance Phone Scripting*, *QA Checklist*; *DENTAL STAFFING CO-PILOT* research (1AyVOR5-JiBs91qSFeMY8sJcI3hbIQb7MBGmL2gXCfd8) for the staffing→DICP cross-sell; `/workspace/dpcp-launch/owner-briefs/insurance.md`.

### Custom modules
**1.1 RCM Command Center (department home, lead view)**
- *Purpose:* one screen for the lead to see every client's revenue health and where people are stuck.
- *On screen:* client cards in a grid, each showing collections vs production (MTD), AR 0-30/31-60/61-90/90+ with 90+ in red, clean-claim rate, posting backlog, open denials, and blockers (missing access, missing deposit info, portal down). Tap a card to drill into that client's workspace. A strip at the top: "Needs you today" (e.g. 2 escalations, 1 pricing approval).
- *Sample data:* Saguaro Family Dental: production $142,300 / collections $118,900 (83.6%), AR 90+ $21,400 (red, up 9% vs last month), clean-claim rate 94%, 31 ERA lines unposted, blocker "No deposit info for 3 checks since Sep 24." Lakeview Dental Arts: 97% collection ratio, AR 90+ $4,100, no blockers.
- *AI does:* compiles every number nightly from posted data, flags trends ("AR 90+ rising 3 weeks in a row"), drafts the explanation. *Human does:* decides the response, calls the client, re-prioritizes the team.
- *Practice requests served:* "Why are our collections down?" → AI drafts an answer from the dashboard; lead approves.

**1.2 Eligibility & Verification Queue**
- *Purpose:* verify every scheduled patient before their visit.
- *On screen:* a day-by-day list for the next 3 business days ("picking"), each row: patient initials, appointment time, payer, status (AI verified ✓ / AI partial: needs a call / failed portal / done by human), benefits summary preview (deductible remaining, annual max remaining, frequencies, AOB setting, waiting periods). Filter chips: Needs a call, Missing plan in PMS, Dual coverage.
- *Sample data:* Copper Canyon Dental, Tue Oct 6: 48 patients, 41 AI-verified, 5 need a call (2 Delta portal timeouts, 3 BCBS "pays patient directly" flags), 2 missing plan in PMS. Example row: "J.R., 8:00 AM, MetLife PPO, deductible $25 of $50 left, max $1,140 of $1,500, BWX due, AOB = Yes."
- *AI does:* pulls the schedule, logs into portals (where allowed), fills the standard benefits-summary template, runs the completeness checklist, flags client-specific rules (e.g. AOB setting on Curve, BCBS paying the patient). *Human does:* insurance calls when portals fail, updates the plan in the PMS, approves flagged verifications.
- *Practice requests served:* "Verify a same-day add-on," "Patient says they have new insurance."

**1.3 Claims Workbench (submission + scrubbing + rejections)**
- *Purpose:* get clean claims out the same day and fix rejections fast.
- *On screen:* three lanes: Ready to submit (AI-scrubbed), Needs a fix (flag reason: missing X-ray attachment, missing narrative, code/frequency conflict, missing tooth/surface), Rejected (clearinghouse reason, AI-proposed correction). Each claim card: claim ID, DOS, payer, procedure codes, amount, AI confidence.
- *Sample data:* Saguaro: 37 claims from yesterday, 31 ready, 4 need a fix ("D4341 x4 quads: perio charting not attached"), 2 rejected ("Subscriber ID mismatch: AI proposes correcting to the ID on the Sep 30 eligibility check").
- *AI does:* pre-submission scrub, drafts narratives, classifies rejections and proposes the fix. *Human does:* submits in the PMS/clearinghouse, makes the correction, approves narratives.

**1.4 Payment Posting Desk**
- *Purpose:* post every payment accurately and catch underpayments.
- *On screen:* left: incoming ERAs, EOB PDFs and scanned checks; right: AI's line-by-line match to open claims (green = auto-matched, amber = partial/underpaid vs fee schedule, red = no match). A "Missing deposit info" panel lists checks or EFTs the practice hasn't confirmed.
- *Sample data:* Lakeview, Oct 2 batch: 112 ERA lines, 104 auto-matched, 6 underpaid (Delta paid $78 vs $96 contracted on D1110), 2 no match. Missing deposit: "Check #20418, $1,240.50, Cigna, received Sep 28: practice hasn't confirmed deposit."
- *AI does:* matches ERA/EOB lines, OCRs checks, compares to the fee schedule, drafts the "missing deposit info" request. *Human does:* posts exceptions, sends the request to the practice, decides on underpayment appeals.
- *Practice requests served:* "We got a check, where does it go?", "Patient paid at the desk; please post."

**1.5 AR Follow-up Board**
- *Purpose:* work the aging list in the order that recovers the most money.
- *On screen:* ranked list (AI priority = amount × age × payer likelihood), each with the suggested next action and a call script, touch count, last outcome code. A "Call mode" view: one claim at a time, script on the left, outcome buttons on the right (Paid/in process, Needs info, Denied → appeal, Resubmit, Write-off request).
- *Sample data:* "#1 Saguaro, Aetna, claim 88-1042, $2,860 (D2740 x2), 74 days, 2 touches, last outcome 'in review.' Next: call, ask for the reprocessing ref #. Script ready."
- *AI does:* ranks, writes scripts, logs outcomes from call notes, schedules the next touch. *Human does:* makes payer calls, chooses the outcome, requests write-offs (lead approves).

**1.6 Denials & Appeals Studio**
- *Purpose:* turn denials into won appeals.
- *On screen:* a denial trend chart by reason and payer (simple counts, not bar graphs; ranked list), an appeals pipeline (Drafted by AI → In review → Sent → Won/Lost), and the appeal editor, which opens in **Review** (the shared tab) with the AI draft, the denial letter and the attachments side by side.
- *Sample data:* Top denial reasons this month: "Frequency limitation (12)," "Missing narrative (7)," "Not covered: downgrade (5)." Appeal "Copper Canyon, Delta, D4910 denied as frequency": AI draft v2 waiting for senior review, revised after the reviewer's comment "cite perio history."
- *AI does:* drafts appeals from templates and past winning appeals, tracks deadlines. *Human does:* senior review, submits, records the result.

**1.7 Credentialing Tracker**
- *Purpose:* enroll providers with payers and manage fee schedules (scalable credentialing process).
- *On screen:* per provider × payer matrix: Not started / Docs gathering / Submitted / In review / Approved / Effective date; missing-documents checklist (license, DEA, malpractice COI, W-9, CAQH attestation); fee-schedule panel with UCR reference and negotiation status.
- *Sample data:* "Dr. A. Mendez (new associate, Copper Canyon): Delta PPO submitted Sep 18, 45-60 day typical; MetLife missing malpractice COI; CAQH re-attestation due Oct 22."
- *AI does:* tracks status, chases documents, sends reminders, compares fee schedules to UCR. *Human does:* payer calls and negotiation, signatures.
- *Practice requests served:* "We hired a new doctor, credential them," "Can we drop a payer?"

**1.8 Client Month-End Report Builder**
- *Purpose:* send every client a clean monthly report.
- *On screen:* checklist per client (data posted, numbers checked, summary approved, sent), a report preview (collections, AR, denials, wins, next month's focus) that opens in Review.
- *Sample data:* "Saguaro, September report: AI draft ready; 2 numbers flagged for a check (AR 90+ changed by $3,900 after a late posting)."
- *AI does:* compiles and writes the summary. *Human does:* checks the numbers, approves, sends.

**1.9 Biller Scorecard & AI Adoption**
- *Purpose:* George's metric: % of work done with AI and hours saved, per biller.
- *On screen:* per-biller row: tasks done, % with AI, estimated hours saved this week, quality flags. A gentle flag for "no AI use 2 weeks in a row." Weekly AI-adoption report (from the AI-adoption lead) lives here.
- *Sample data:* "Biller A: 212 tasks, 68% with AI, 9.5 hrs saved. Biller F: 140 tasks, 12% with AI (flag, 2nd week)."
- *AI does:* computes it from the task log. *Human does:* coaching (AI-adoption lead, lead).

---

## 2. Dental Equipment Copilot (DECP)

### Snapshot
- **Services:** equipment planning for new locations (full 12-op de novo equipment lists), direct-from-manufacturer sourcing with multi-vendor comparison, quotes and landed-cost modeling (freight, duties/tariffs, bond, broker), FDA/UDI compliance per SKU, import and shipment tracking, warehouse/3PL storage, delivery and install coordination (remote-guided assembly by a technician), warranties and service, and resale of units to out-of-state dentists with transport invoiced separately.
- **Client:** HDG de novos and acquisitions first; outside dentists buying units (early interested buyers: a 4-unit and a 1-unit order).
- **Key metrics:** landed cost vs domestic list price (savings %), quote turnaround, SKUs FDA-cleared before booking (must be 100%), shipments on time, equipment uptime / open service tickets, warranty claims recovered.
- **Typical practice requests:** "chair won't recline," "autoclave error code," "we need a quote for 3 new ops," "where is our delivery," "warranty question."
- **Tools:** vendor master and outreach tracker, PIs/CIs/quotes, openFDA/GUDID, customs bond and broker, 3PL (equipment warehouse in AZ), WhatsApp/email with vendors.
- **Sources (Drive):** *HDG_DeNovo_Equipment_List (6).xlsx* (1gRFMTwvUzlx7Ty_isUZiQ-cOWTXBnSS2: Equipment List, Instrument Cassettes, Strategic Flags, Open Research Items tabs; 12-op day-1 standard, 9 comparison vendors, color-coded statuses); *HDG_Vendor_Tracker_UPDATED.xlsx* (1GN-kA4oGmhFhRIuHWpRZJm-eRyGZLE2T: 4-step pipeline Catalog → Products ID'd → Quote requested → Quote logged, tariff estimates, summary dashboard by category); *Procurement Meeting Sep 29* notes (1X_UfKPeym7n_aFSXR17q2G9r1W3xrSvMTxf26UWqFTI, via owner brief); *HBS Team Redesign* Phase 2. Workspace: `/workspace/org-design/design/dept-needs/procurement.md`, `/workspace/procurement/register.md`, `fda-udi-research.md`, `/workspace/dpcp-launch/owner-briefs/equipment.md`.
- **[ASSUMPTION]:** preventive-maintenance schedules, service-ticket SLAs and warranty tracking are standard DSO equipment-management practice; Drive has no service SOP yet.

### Custom modules
**2.1 Location Equipment Planner**
- *Purpose:* build and track the full equipment list for a new or expanding location.
- *On screen:* category tree (per-operatory hard equipment, handpieces, imaging/CBCT, sterilization, utility room, digital fab lab, instrument cassettes), each line: qty, per-op/shared, chosen vendor, comparison vendors, status color (quote requested / comparing / FDA check needed / brand-locked open question), unit and line cost. "Open research decisions" panel (CBCT model, intraoral scanner, implant system, rotary endo).
- *Sample data:* "Mesa Verde (14 ops): Dental chair + delivery unit, qty 14, 3 vendors compared, quote requested Sep 30; High-speed handpieces qty 34 (3 per restorative chair, 2 per hygiene chair); Autoclaves qty 2, flag 'ceiling case accepted: monitor post-open'."
- *AI does:* sizes quantities from the op count and patient-flow assumptions, fills comparison rows from catalogs, flags gaps. *Human does:* picks vendors and models, approves spend (George for capital).

**2.2 Vendor & Quote Comparison**
- *Purpose:* compare manufacturers side by side and negotiate.
- *On screen:* vendor pipeline (Catalog obtained → Products identified → Quote requested → Quote received), quote comparison table for one item (price, MOQ, lead time, FDA status, warranty, tariff est.), negotiation notes.
- *Sample data:* "Integrated chair system, 12 units: Vendor A $X/unit FOB, 45-day lead; Vendor B includes scaler + stool in base price; Vendor C no FDA listing found (red)." Summary: 39 hard-equipment vendors: 3 quote requested, 28 contacted, 5 not yet contacted.
- *AI does:* parses quotes/PIs into line items, diffs versions, flags missing FDA data. *Human does:* talks to vendors (anything outbound needs approval), chooses.

**2.3 Landed Cost & Import Tracker**
- *Purpose:* know the true delivered cost and get shipments cleared.
- *On screen:* per-shipment board: status (PI signed → In production → Ready → Sailed → At port → Cleared → Delivered), sail/ETA, per-SKU FDA/UDI readiness, documents (PL/CI/BL) completeness, bond and importer registration state, landed-cost breakdown (price + freight + duties + broker/bond fees + insurance). Holds in red. Conflicts flagged (two different sail dates).
- *Sample data:* "Shipment EQ-0412: 6 chairs + 2 compressors, sailed Sep 22, ETA Oct 19. FDA/UDI: 14/16 SKUs ready, 2 missing GUDID (hold risk). Product $28,000 → landed $46,100 (duties 34%)."
- *AI does:* computes landed cost, checks document completeness and FDA data, flags risks. *Human does:* decides to book or hold; George sets bond coverage and signs.

**2.4 Install & Service Desk**
- *Purpose:* keep every chair and machine running.
- *On screen:* asset register per practice (asset, serial, install date, warranty end, last PM), open service tickets with SLA timers, PM calendar, "remote-guided install" sessions (tech on site, HBS specialist on video).
- *Sample data:* "Copper Canyon Op 7 chair: 'won't recline,' opened 9:12 AM by Front Desk (tap-in: Maria), AI troubleshooting sent (check foot-control cable), unresolved → tech visit booked Thu. Warranty: covered to Aug 2027."
- *AI does:* troubleshooting steps, warranty lookup, drafts the service request. *Human does:* coordinates the technician, approves paid repairs.
- *Practice requests served:* broken equipment, error codes, PM scheduling.

**2.5 Equipment Sales (client resale orders)**
- *Purpose:* sell units to outside dentists.
- *On screen:* order pipeline (Inquiry → Quote sent → Deposit → Shipped → Installed), each with unit price, separate transport line, margin.
- *Sample data:* "Red Rock Pediatric: 2 chairs + delivery units, quote sent Oct 1, transport line $2,400, awaiting deposit."
- *AI does:* drafts quotes from price list + transport calc. *Human does:* approves pricing, sends, handles the relationship.

---

## 3. Dental Supplies Copilot (DSUP)

### Snapshot
- **Services:** supply ordering for practices, par levels and reorder, direct-from-manufacturer sourcing (gloves, masks, disposables, restorative materials, burs), an online store (Shopify) and marketplace listings (Net32, Dental Mates), drop-ship via a temperature-controlled 3PL, inventory tracking, price benchmarking.
- **Client:** HDG locations first, then outside practices buying through the store.
- **Key metrics:** supply cost as % of collections (benchmark under 5%, per the P&L SOP), fill rate, stockouts, order cycle time, savings vs incumbent distributor, inventory turns.
- **Typical practice requests:** "we're low on gloves (M)," "order this item," "where's our order," "wrong item shipped," "find a cheaper composite."
- **Tools:** central inventory master SKU list, supply list workbook with par/reorder formulas, Shopify, Net32/Dental Mates, 3PL portal.
- **Sources (Drive):** *HDG_DeNovo_Supply_List_v4.xlsx* (11OIElv93Bd-YpfXnAlF4C6bxsmgGp3w-: Assumptions tab with editable volume inputs; Seed qty = weekly consumption × 10 weeks (8 central + 2 "tackle box"); monthly reorder = weekly × 4.33; implant components; standardized bur blocks); *HDG_Vendor_Tracker_UPDATED.xlsx* (disposables vendors); *Central Inventory Master SKU List.xlsx* (Procurement folder, per drive-map); *Procurement Meeting Sep 29* (via owner brief: Shopify, 3PL drop-ship, mask vendors). Workspace: `/workspace/dpcp-launch/owner-briefs/supplies.md`, `dept-needs/procurement.md`.
- **[ASSUMPTION]:** practice-side ordering UX, substitution approvals and budget caps follow standard DSO procurement practice.

### Custom modules
**3.1 Practice Inventory & Par Levels**
- *Purpose:* each practice sees what it has, what it uses, and what to reorder.
- *On screen:* per-practice list by stocking location (Operatory standing stock / Tackle box / Central), each SKU: on hand, par, weekly use, days of cover, status (OK / Reorder / Critical). Editable assumptions panel (chairs, patients per chair per day) that recalculates par.
- *Sample data:* "Copper Canyon: Nitrile gloves M: on hand 4 boxes, par 12, weekly use 660 units → Critical (3 days). 2x2 gauze: 22 days of cover, OK."
- *AI does:* predicts usage from the schedule, recalculates par, raises reorders. *Human does:* office manager confirms counts; approves above-budget orders.

**3.2 Reorder & Cart Builder**
- *Purpose:* one-tap reorder.
- *On screen:* AI-built cart grouped by vendor/channel, price vs last order, substitutions suggested (with savings), budget bar for the month.
- *Sample data:* "Saguaro, October cart: 18 lines, $2,184 (vs $2,610 via current distributor, saves 16%). Substitution: composite brand X → house brand, needs dentist approval."
- *AI does:* builds cart, finds cheapest compliant source, proposes substitutions. *Human does:* approves cart; dentist approves clinical substitutions.
- *Practice requests served:* "We're low on ___," "Order this."

**3.3 Orders & Deliveries Tracker**
- *Purpose:* where every order is.
- *On screen:* orders list (Placed → Shipped → Delivered → Received/checked), tracking links, backorders, returns and wrong-item claims.
- *Sample data:* "SO-1088 Lakeview: 3 of 4 boxes delivered, 1 backordered (saliva ejectors, ETA Oct 9)."
- *AI does:* tracks, chases backorders, drafts return claims. *Human does:* practice confirms receipt; specialist resolves disputes.

**3.4 Catalog & Store Manager (e-commerce)**
- *Purpose:* run the online store and marketplace listings.
- *On screen:* product list (SKU, cost, price, margin, channel listings, stock at 3PL, FDA status), listing drafts, store orders feed.
- *Sample data:* "Nitrile exam gloves, case of 1,000: cost $X, price $Y, margin 28%, listed on Store + Net32, 3PL stock 140 cases."
- *AI does:* writes listings, keeps prices synced, flags low margin. *Human does:* approves pricing and new SKUs (George approves removing SKUs).

**3.5 Supplier Price Benchmark**
- *Purpose:* prove savings.
- *On screen:* item-by-item comparison of current distributor price vs DSUP price; savings per practice per month.
- *Sample data:* "Saguaro could save $5,400/yr across 42 SKUs."
- *AI does:* builds the comparison from the practice's invoices. *Human does:* presents it to the client.

---

## 4. Dental Staffing Copilot (DSCP)

### Snapshot
- **Services:** recruiting for dentists, hygienists, dental assistants, front office and office managers (US and South Africa only), screening and recorded interviews with summary notes, scorecards, offers and agreements, onboarding, 30-day training and 90-day performance management, and a recurring cost-plus model for South Africa remote staff. Pricing research proposes an "Ascension Model": Offer 1 placement + 90-day guarantee; Offer 2 placement + 30-day training + 90-day performance management; retainer for unlimited placements + ongoing HR. Current pilot clients stay free for now.
- **Client:** HDG locations (built-in pipeline) and outside practices/DSOs; every billing-coordinator request is a cross-sell to Insurance.
- **Key metrics:** days to fill, candidates in pipeline per role (target 50+ pre-vetted before launch), interview show rate, offer acceptance, 90-day retention, placements per month, credential verification turnaround.
- **Typical practice requests:** "we need a hygienist," "our DA quit," "need a temp for Friday," "check this candidate's license," "onboard our new hire."
- **Tools:** Indeed, iHire, DentalPost, LinkedIn, the recruiting CRM, Gmail, Drive templates (JDs, offer letter, associate agreement), AZ State Board license lookup.
- **Sources (Drive):** *DENTAL STAFFING CO-PILOT: Arizona Launch Viability & Pricing Intelligence* (1AyVOR5-JiBs91qSFeMY8sJcI3hbIQb7MBGmL2gXCfd8); *Dental Staffing Co-Pilot Meeting* May 12 notes (1o4Huv4OJ38xcpBQ1A1xRxMNJJVjK8yKrRjSyLOdbYMg); *Darin onboarding* Oct 1 notes (1WKgokYiP_RkKl2KGjK4sO1p_exn6FQE68FkkICgsYX0); JD lead magnets ("The Job Description That Actually Attracts Good Hygienists/Assistants/Candidates" PDFs); HDG Staffing folder (DA Development Program, DA Skill Sign-off Checklists). Workspace: `/workspace/staffing-copilot/` (knowledge, hiring-pipeline, handbook-outline), `dept-needs/people-staffing.md`.

### Custom modules
**4.1 Requisitions Board**
- *Purpose:* every open role across practices in one place.
- *On screen:* cards per open role: practice, role, stage, candidates (sourced/screened/interviewed/offer), days open (30+ flagged), owner, next step.
- *Sample data:* "Copper Canyon: Associate Dentist, 41 days open (flag), 12 sourced, 3 calls booked. Saguaro: RDH, 9 days, 6 screened, 2 interviews Thu."
- *AI does:* opens the requisition from the practice request, posts the job from a template, keeps counts live. *Human does:* sets priority, owns client relationship.

**4.2 Candidate Pipeline (ATS)**
- *Purpose:* move candidates through stages.
- *On screen:* kanban: Sourced → Contacted → Screened → Interview → Scorecard → Offer → Hired → Credential check. Candidate card: role, location, license status, AI screen score with reasons, interview recording + AI summary.
- *Sample data:* "R. Patel, RDH, 6 yrs, AZ license active (verified Oct 2), local anesthesia permit ✓, AI screen 86/100: 'strong perio, wants 4 days.'"
- *AI does:* screens resumes against the rubric, drafts outreach, schedules, summarizes interviews into scorecards. *Human does:* sends outreach (approved), holds interviews, hiring decision (practice owner or George for HDG).

**4.3 Talent Bench**
- *Purpose:* supply before demand: a pre-vetted bench ready in 24 hours.
- *On screen:* bench counts by role and county vs target (e.g. 50 total), availability, last contact.
- *Sample data:* "Bench: 23 RDH, 31 DA, 7 front office, 4 dentists. Target 50 pre-vetted by launch."
- *AI does:* nurture sequences, re-checks availability. *Human does:* relationship calls.

**4.4 Credential & Compliance Check**
- *Purpose:* never place someone who can't legally work.
- *On screen:* per candidate: state license, CPR, anesthesia/scope permits, NPI, DEA (dentists), background check, W-2 classification, I-9; status and expiry dates.
- *Sample data:* "Dr. L. Okafor: AZ license active, DEA pending, background check ordered Oct 1."
- *AI does:* looks up public records, tracks expiries. *Human does:* orders background checks, signs off.

**4.5 Onboarding & 90-Day Tracker**
- *Purpose:* make placements stick (the premium offer).
- *On screen:* per new hire: first-week checklist, 30-day training modules, day 7/30/90 check-ins, performance notes, guarantee window countdown.
- *Sample data:* "M. Lopez (DA, Copper Canyon): day 23 of 90, training 6/9 modules, day-30 check-in Oct 12."
- *AI does:* runs the checklist, schedules check-ins, drafts the summaries. *Human does:* check-in conversations, replacement decisions.

**4.6 Offers & Agreements**
- *Purpose:* fast, consistent offers.
- *On screen:* offer builder from templates (offer letter, associate agreement), approval chain, e-sign status.
- *AI does:* fills templates. *Human does:* attorney review where marked, owner signs.

---

## 5. Dental IT Copilot (DITC)

### Snapshot
- **Services [mostly ASSUMPTION; Drive has no IT service definition yet]:** help desk for practice staff, device and workstation management, networks and Wi-Fi, phones/VoIP, printers and scanners, imaging-software support, PMS/server support, backups, cybersecurity (MFA, patching, antivirus, phishing training), HIPAA Security Rule operations (risk assessment, access reviews, BAA tracking), new-location IT build-outs (low-voltage, network, AV), user onboarding/offboarding, and password-manager rollout.
- **Grounding from sources:** IT is listed on the services box but has no lead yet (Dental IT Lead is an open hire; IT support/systems management is interim). The Oct 2 IT/security audit found client credentials sent in plain text by email and recommended: client credentials only through the company password manager, MFA on remote access (RemotePC), and rotation. The vendor tracker has an "IT / AV Infrastructure" category for new locations.
- **Client:** HDG locations first; client practices later.
- **Key metrics:** tickets opened/resolved, first-response and resolution time, % devices patched, MFA coverage, backup success rate, open security findings, HIPAA risk assessment status.
- **Typical practice requests:** "computer is slow," "printer won't print," "can't log into the PMS," "phones are down," "new hire needs a login," "suspicious email."
- **Tools [ASSUMPTION]:** remote access (RemotePC/Splashtop), RMM/endpoint tool, password manager (1Password), Google Workspace admin, VoIP portal, backup service.
- **Sources:** `/workspace/finance-systems/it-security-ai-audit-2026-10-02.md`; `/workspace/dpcp-launch/owner-briefs/it.md`; *HBS Team Redesign* Phase 2 (open Dental IT Lead hire); *Darin onboarding* Oct 1 (three-track IT role); *HDG_Vendor_Tracker_UPDATED.xlsx* (IT/AV vendor category).

### Custom modules
**5.1 Help Desk**
- *Purpose:* fix staff tech problems fast.
- *On screen:* ticket queue with priority (Down / Degraded / Request), SLA timers, practice, device, AI troubleshooting already tried, assigned tech. "Resolved by AI" counter.
- *Sample data:* "P1 Lakeview: 'Front desk PC can't open Curve,' 8:04 AM, AI steps tried (restart, cache clear) → remote session started 8:19 AM by tech. 14 tickets this week; 6 resolved by AI self-help."
- *AI does:* guided self-fix with the staff member, gathers device info, drafts the ticket. *Human does:* remote session, on-site dispatch.
- *Practice requests served:* all tech problems.

**5.2 Asset & Device Inventory**
- *Purpose:* know every device per practice.
- *On screen:* devices (workstations, imaging PCs, servers, printers, phones, network gear) with OS, patch status, warranty, assigned room, last check-in.
- *Sample data:* "Copper Canyon: 22 workstations, 2 not patched in 30+ days (Op 3, Sterilization), server backup OK last night."
- *AI does:* flags out-of-date devices. *Human does:* approves replacements.

**5.3 Security & HIPAA Center**
- *Purpose:* keep practices compliant and safe.
- *On screen:* MFA coverage %, password-manager adoption, open findings (e.g. "credentials shared by email"), annual risk assessment status, BAA register, access reviews due, phishing-test results.
- *Sample data:* "MFA 78% (goal 100%), 3 findings open: 'Remote-access tool without MFA at Saguaro,' 'Shared front-desk login at Ponderosa,' 'Departed employee still in PMS.'"
- *AI does:* scans for findings, drafts remediation steps and policies. *Human does:* approves changes, signs the risk assessment.

**5.4 User Access (onboarding/offboarding)**
- *Purpose:* new hires get access day 1; leavers lose it same day.
- *On screen:* checklist per person: Google account, PMS user, phone extension, password-manager vault, imaging software; status green/red (same pattern as the round-1 new-employee setup screen).
- *AI does:* runs the checklist, opens requests. *Human does:* admin actions.

**5.5 New Location IT Build**
- *Purpose:* a repeatable IT checklist for de novos.
- *On screen:* low-voltage/network drops per op, ISP order, firewall, Wi-Fi, phones, PMS server/cloud, imaging, AV, go-live checklist with dates.
- *Sample data:* "Mesa Verde: ISP install Oct 21, 28 of 34 drops spec'd, phones vendor not chosen."

---

## 6. Dental Accounting Copilot (DACC)

### Snapshot
- **Services:** monthly bookkeeping and close, bank and card reconciliation, AP/bill pay, payroll prep and approval flow, P&L analysis using George's framework (Summary, Cost of Producing Dentistry, Operating Costs, Growth Costs, 4-Wall Profitability), KPI and benchmark reporting, budgeting/FP&A, tax coordination, and financial controls (payment approval matrix, separation of duties).
- **Client:** HDG entities and outside practices (P&L analysis is already delivered to coaching clients during onboarding).
- **Key metrics:** close done by day X, unreconciled items, collections, expense ratios vs benchmarks (supplies under 5%, lab ~4%, associate pay 13-14%, combined labor ~21%, net margin target 25-30%), 4-wall profit %, break-even, AP aging, exceptions flagged.
- **Typical practice requests:** "send me last month's P&L," "is this charge legit," "pay this invoice," "payroll question," "why did profit drop."
- **Tools:** QuickBooks, Stripe, PayPal, bank/card feeds, Google Sheets, Drive client P&L folders, payroll provider (ADP for some practices, per the Payroll SOPs in Drive).
- **Sources (Drive):** *SOP: Using Finance & KPIs Co-Pilot for Onboarding P&L Reports* (1lsVy3OPvwBval9Jn1It6WSfvkwm2ShUCFbC9yCedIx8: George's 5-section framework and benchmark ratios); *Dental Practice Co-Pilot Example Tasks List* (1xPvpjrLcCqNp8t33DJEVN3XQhiHtmkLiSKc7hZ8DOeU: KPI scorecards, payroll-to-revenue, overhead trend, vendor/subscription cost control); Payroll SOP (ADP) / Payroll Execution Guide (Coaching Clients Docs, per drive-map). Workspace: `dept-needs/finance.md`, `/workspace/finance-systems/knowledge.md`, `/workspace/dpcp-launch/owner-briefs/accounting.md`.
- **Note:** George's private finances and the CFO-private area are excluded. The independent CFO-bot audit is shown only as a read-only "Audit" badge, not a screen.

### Custom modules
**6.1 Month-End Close Board**
- *Purpose:* close every entity's books on time.
- *On screen:* entity × checklist grid (bank reconciled, cards reconciled, AP entered, payroll booked, accruals, review, reports sent), with blockers.
- *Sample data:* "September close: Copper Canyon 6/7 done (waiting: card statement); Saguaro 4/7 (14 uncategorized transactions)."
- *AI does:* auto-categorizes, reconciles matches, lists exceptions. *Human does:* resolves exceptions, signs off.

**6.2 P&L Analyzer (George's framework)**
- *Purpose:* turn any P&L into George-style analysis.
- *On screen:* 5 sections with numbers, % of revenue, benchmark ranges and colored deltas, and AI commentary with "levers" (e.g. "+1% labor overage = $3,100/month"). Opens in Review before sending.
- *Sample data:* "Saguaro, Sep: collections $310,000; CPD 23.7%; operating 33.5%; growth 6.5%; 4-wall profit 36.3%. Lever: hygiene productivity to 3.4× pay = +$4,500/month."
- *AI does:* full draft analysis. *Human does:* QA, then presents to the owner.

**6.3 Payments & Approvals Queue**
- *Purpose:* nothing gets paid without an owner, a reason and an approval.
- *On screen:* bills and payroll runs with requester, approver, releaser (separation of duties), status (Pending approval → Approved → Paid), exception flags (new payee, changed bank details, unusual amount, duplicate).
- *Sample data:* "Lab invoice $4,820, Copper Canyon, approver: office manager ✓, releaser: accountant. ⚠ New payee bank details changed Oct 1: verify by phone."
- *AI does:* matches invoices to POs, flags fraud patterns. *Human does:* approves and releases.

**6.4 KPI & Benchmark Dashboard (per practice)**
- *Purpose:* owner-level financial health.
- *On screen:* collections MTD vs goal, expense ratios vs benchmark, payroll-to-revenue, subscription spend, break-even, cash runway; simple score and goal format.
- *AI does:* computes and explains. *Human does:* interprets with the owner.

**6.5 Collections & AR (HBS invoicing to clients)**
- *Purpose:* get DPCP paid.
- *On screen:* client invoices, failed payments, aging, drafted dunning notes.
- *AI does:* flags failures, drafts notes. *Human does:* approves outreach.

---

## 7. Dental Marketing Copilot (DMCP)

### Snapshot
- **Services:** Google/Bing PPC (the core channel), Meta lead funnels for high-ticket cases (5-minute follow-up), SEO and AI-search optimization, Google Business Profile, landing pages (Differentiator page + Emergency page, CTAs only "Book Online" and "Call"), websites built on client-owned hosting, call tracking (subaccount the client owns), weekly snapshot and monthly report, reputation and review requests, social content. Model: hourly/fractional, **the client owns every asset**; DMCP has manager/editor access only. Rebuilding on a "Ritesh model": confirmed bookings as the only primary conversion, call-to-patient matching, cost per patient seen.
- **Client:** HDG locations and outside practices (4 active accounts as of Sep 29).
- **Key metrics:** leads, confirmed bookings, patients seen, cost per lead, cost per new patient seen, ROI, spend vs headroom (goal: scale e.g. $2.5K → $6K/month), call answer rate, report compliance (every client, every week).
- **Typical practice requests:** "are the ads working," "we need more implant patients," "update our hours on Google," "new landing page," "a review mentions us badly," "change our budget."
- **Tools:** Google Ads, Meta, GA4/GTM, GBP, Looker Studio, WhatConverts/CallRail, client websites (Wix, GoDaddy), booking tools, the weekly and monthly marketing rhythm, Claude projects for snapshot/monthly generators.
- **Sources (Drive):** *Dental Marketing Co-Pilot (DMCOP) – Business Model Overview* (12Du8G8SP-skgnbm7Oj9onxbSlMXANK6L5uWGp-nJpFA); *Welcome to Dental Marketing Co-Pilot.docx*, *Intro to Full-Service Dental Marketing.docx*, *DMCOP Master Spreadsheet.xlsx* (titles found, not readable as text); *Ritesh's Marketing playbook* (1h6KHiplX1TGwnMYZgX5ORxSI7KHQGobww8tkamok7qM), Weekly Snapshot Standard (1ekGxTdJ-o3VMIAPD6HSDZL5VfdtfwHqs), Monthly Report (1XHUNtsgDbBOItoVqlG_3AgT1cPr7yrED), Landing Page SOP (1vi9CE4qPa-djd7QyZNmuWzUO8q94IuqpDOMonutTnsM), via `/workspace/marketing/knowledge.md` and `rebuild-plan.md`; `dept-needs/marketing.md`.

### Custom modules
**7.1 Client Performance Board**
- *Purpose:* per-client results at a glance.
- *On screen:* table: leads, confirmed bookings, patients seen, cost/lead, cost/new patient, ROI, MoM trend, verdict (Scale / Hold / Fix). Flat or declining rows flagged.
- *Sample data:* "Saguaro: 64 leads, 29 booked, 21 seen, $96/new patient, verdict Scale (+$800/mo headroom). Copper Canyon: 18 leads, booked unknown (tracking gap) → Fix."
- *AI does:* pulls data nightly, writes verdicts. *Human does:* approves budget moves with the client.

**7.2 Weekly Snapshot & Monthly Report Studio**
- *Purpose:* every client gets a report every week, no misses.
- *On screen:* compliance grid (client × week: drafted / approved / sent / confirmed), the draft in Review (calls, cost/call, spend, verdict, 3-5 actions, budget recommendation).
- *Sample data:* "Week of Sep 28: 3 of 4 sent; Lakeview missing (AI draft ready since Fri 9 AM)."
- *AI does:* drafts. *Human does:* approves and sends (client-facing).

**7.3 Tracking & Attribution Health**
- *Purpose:* trust the numbers.
- *On screen:* per account: primary conversion = confirmed booking? call tracking installed and client-owned? GA4/GTM firing? assets owned by client? Each green/red with fix steps.
- *Sample data:* "Saguaro: 5/5 green. Lakeview: primary conversion is 'page view' (red), call tracking not client-owned (red)."
- *AI does:* audits accounts. *Human does:* changes settings in the client's accounts.

**7.4 Call-to-Patient Match**
- *Purpose:* prove ads create patients.
- *On screen:* weekly list of tracked calls; front desk marks Scheduled / Seen (this can be done from the practice staff site); match rate.
- *Sample data:* "Week 40: 47 tracked calls, 31 marked by front desk, 19 scheduled, 12 seen."
- *AI does:* exports calls, transcribes, mines negative keywords. *Human does:* front desk marks outcomes.

**7.5 Campaign Optimizer**
- *Purpose:* weekly optimization ritual.
- *On screen:* AI-proposed changes (negatives, bids, ad tests, budget shifts) with approve/reject, and the weekly checklist.
- *AI does:* proposes. *Human does:* applies and approves budget moves.

**7.6 Landing Page & Content Builder**
- *Purpose:* build pages and posts to the SOP.
- *On screen:* page drafts from Google Reviews (Differentiator → Emergency), QC checklist, social post drafts. Open in Review.
- *AI does:* drafts copy. *Human does:* compliance review, builds on client hosting, approves posting.

**7.7 Reputation (reviews)**
- *Purpose:* review velocity and sentiment.
- *On screen:* rating trend, new reviews, review-request campaign stats. (George's rule: don't respond to Google reviews; flag only.)

---

## 8. Dental Construction Copilot (DCCP) (buildouts, renovations, facilities)

### Snapshot
- **Services:** site and lease review (video walkthrough, blocking diagram, TI budget, LOI terms, TI negotiation), floor plans and MEP drawings to dental standards (in-house architect), the **Simulated GC Bid** (trade-by-trade estimate at full market rates; the total becomes the TI ask, paid at Certificate of Occupancy), owner-as-GC management (self-perform vs licensed-sub scopes, quote-first bidding, construction checklists), the **barter program** (local trades paid partly or fully in dental-care credits at fair market value; trades become first patients), direct equipment and materials procurement, facilities maintenance and work orders after opening. Proof point: painting priced at $5-6K in-house vs $14K-35K quotes. Owner: the New Location lead.
- **Client:** HDG de novos (2 in build-out, more planned) and outside dentists opening or expanding.
- **Key metrics:** TI received vs actual cash outlay ("captured spread"), budget vs actual per trade, schedule vs plan (days to CO), barter credit liability outstanding vs redemption capacity, quotes per trade, punch-list items open, open facilities work orders.
- **Typical practice requests:** "something's broken in the building" (leak, HVAC, door, lights), "we want to add 2 ops," "landlord question," "need a contractor."
- **Tools:** Simulated GC Bid worksheet, scope-of-work checklist, barter agreement and tradesperson application, county research sheet, drawings (CAD), Slack #facilities-department, LoopNet.
- **Sources (Drive):** *HDG_Barter_Construction_Playbook.docx* (1w-b8CW80skh_ZvV1chMnShWbBAgUgNHT: Parts 1-9, decision gate, trade classification, appendices A-G); *Estimate_1068 from a construction management LLC* (PDF, title only); *Candidate Scorecard – Construction Operations Manager.xlsx*; Construction Manager folder (HDG). Workspace: `/workspace/new-location/dcc-service-outline.md`, `dental-construction-copilot.md`, `ti-playbook-v1.md`, `rural-ti-playbook-v1.md`, `site-tracker.md`; `/workspace/dpcp-launch/owner-briefs/construction.md`.
- **[ASSUMPTION]:** post-opening facilities work orders, preventive maintenance and vendor SLAs follow standard DSO facilities practice; Drive has no facilities SOP yet. Pricing for outside clients is open.

### Custom modules
**8.1 Site Pipeline**
- *Purpose:* vet many sites in parallel and see which clears the gate.
- *On screen:* site cards: address, county, size, op capacity (must reach 12-20 at full build-out), landlord, TI asked vs offered, LOI status, purchase option raised (yes/no), **decision gate** (3 checks: TI committed at CO, inside target counties, 12-20 op capacity).
- *Sample data:* "Mesa Verde site: 15 rooms (scalable to 20) ✓, target county ✓, TI: asked $10/sf, landlord redline offers $0 ✗ → gate not met. Pine Hollow strip unit: TI unknown."
- *AI does:* researches listings, county data, comps; drafts LOI language. *Human does:* negotiates, George signs.

**8.2 Simulated GC Bid & Budget**
- *Purpose:* build the TI ask, then track real cost against it.
- *On screen:* trade lines (demo, framing, electrical, plumbing incl. med gas/vacuum, HVAC, flooring, painting, cabinetry, low-voltage) with market-rate estimate, contingency 10-15%, GC overhead/profit 15-20%, soft costs → TI ask; then actual cost columns (cash / barter credits) and the captured spread.
- *Sample data:* "Mesa Verde: Simulated bid $412,000 (TI ask). Actual to date: cash $96,400 + barter credits $38,200 FMV. Painting: market $31,000 vs actual $5,800."
- *AI does:* fills market-rate estimates, updates actuals from invoices. *Human does:* validates against an outside quote on early projects; George approves.

**8.3 Build Schedule & Trades Board**
- *Purpose:* run the build like a GC.
- *On screen:* phase timeline (Design → Permits → Rough-in → Inspections → Finishes → CO → Soft opening), trades with classification (Cash + barter margin / Fully barter / Cash only), quotes received, inspections, daily photo log, punch list.
- *Sample data:* "Electrical 85%, ceiling/lighting 95%, plumbing quotes 2 of 3, rough-in inspection Oct 14."
- *AI does:* chases quotes, keeps the schedule, summarizes photo logs. *Human does:* site supervision, contractor decisions.

**8.4 Barter Program Manager**
- *Purpose:* run trades-for-dental-credits safely.
- *On screen:* participants, trade, hours/value, credits issued at FMV, consent on file, redemption location, outstanding liability vs chair capacity ceiling, redemption appointments during the soft-opening window.
- *Sample data:* "14 participants, $38,200 credits issued, ceiling $60,000, 9 redemption appointments booked for soft opening week."
- *AI does:* tracks credits and liability, drafts recruitment ads and press releases from templates. *Human does:* signs barter agreements, approves credit values.

**8.5 Design & Drawings**
- *Purpose:* floor plans and MEP sets to dental standards.
- *On screen:* drawing set versions (blocking diagram, floor plan, electrical, plumbing, HVAC, telecom), open comments, approval status. Opens in Review.

**8.6 Facilities Work Orders (after opening)**
- *Purpose:* keep open practices running.
- *On screen:* work orders from the practice staff site (photo, location, urgency), vendor assigned, SLA, cost, PM calendar (HVAC filters, compressor service, backflow test).
- *Sample data:* "Copper Canyon: 'Water under sterilization sink' (photo), urgent, plumber booked 2 PM; HVAC filter change due Oct 15."
- *AI does:* triages, finds a vendor, drafts the dispatch. *Human does:* approves cost, confirms done.
- *Practice requests served:* building problems, remodel requests.

---

## 9. Gaps and open items found during research
- **Thin in Drive:** IT (no service definition), Accounting as a client-facing service (only the P&L SOP), Supplies e-commerce (no store SOP), Equipment service/warranty, Construction pricing. Prototype uses labeled assumptions.
- **Unreadable here:** several .docx/.xlsx/PDF offering docs (e.g. *Welcome to Dental Marketing Co-Pilot*, *DMCOP Master Spreadsheet*, *BUSINESS PLAN: Multi-Practice Co-Pilot*, *Client-Facing Invoicing Guidelines*, *HBS_Business_Acumen.pdf*, the JD PDFs). Worth converting to Google Docs.
- **Practice staff site:** an original HDG design built from HDG's own workflows (no third-party product is the model).
- **Owners still unconfirmed** for Equipment, Supplies, IT and Accounting (dpcp-launch tracker).
