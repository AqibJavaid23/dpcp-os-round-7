# DPCP OS module: Dental Equipment Copilot
**Status:** draft module spec. Nothing built or sent. It follows product-design-v1 (principles, roles, shared components) and screen-specs-v2 §0 (frame, status colors, the five standard states, microcopy). It runs for HDG practices first, and client practices get the identical experience. Anything marked "(guess)" isn't in a source.
**Sources:** procurement/register.md · procurement/fda-udi-research.md · dept-needs/procurement.md · dpcp-launch (owner-briefs/equipment.md, launch-checklists.md) · handoffs · To-Do sheet Team Tracking tab.

## 1. Users and roles (maps to screen-specs §0.4)
| Role | Who | Sees | Does |
|---|---|---|---|
| Practice staff (web app, no login) | Front desk, assistants, hygienists. Staff tap their name. | Their own practice's requests and assets | Report a breakdown, request equipment, complete PM checklists, confirm delivery or install |
| Client practice lead | Office manager or doctor (guess) | All requests, assets and spend for their own practice | Approves practice-side orders and quotes, and the install schedule |
| HBS procurement employee | Junaid (lead, proposed owner); Zaid (vendor docs, signature posting); Shaldon (remote assembly guidance) | HBS execution queue | Work the tasks; approve routine internal steps |
| Lead | Junaid | My team + the module dashboard | Reassign, step in, approve team items |
| George | George | Everything | Money, legal, signatures, removing SKUs, bond coverage, pricing |

## 2. Screens
1. **Practice: Report a problem / Request equipment** (no login). Tap your name, then pick the asset from a photo list, then pick a type (Breakdown · Repair · Service due · New equipment · Install). Add a description and photo, and say whether it's urgent (patient chair down = urgent). The screen confirms "We've got it." Free text warns against patient names (no PHI).
2. **Practice: My requests.** Status chips use the standard colors. Staff confirm delivery or install with a photo.
3. **HBS execution queue.** Each request becomes a Today task with prepared context: asset history, warranty, vendor, draft outreach and the SOP step.
4. **Lead dashboard (Junaid).** Open requests by type and age, practices with equipment down, the shipment pipeline board, compliance holds (red), the George decision queue and the exceptions queue.
5. **Asset register / catalog.** One row per installed unit: practice, model, serial, maker, UDI DI, K-number, install date, warranty, PM schedule, history. Plus the catalog of offered models with their compliance status.
6. **Vendor view.** Maker vs trader, FEI, listings, K-numbers, GUDID, registration renewal status, doc checklist, open POs, response history.
7. **Shipment / import tracker.** Per container: SKUs, FDA/UDI readiness per SKU, PL/CI/BL completeness, bond, sail/ETA, broker entry status, destination (Dircks or a China hold warehouse).

## 3. Request types and status lifecycles
| Type | Lifecycle |
|---|---|
| New equipment order | Requested → Quoted → Practice/George approved → Compliance check → PO placed → Ready at factory → Shipped → Cleared customs → Received (Dircks) → Delivered → Installed → Closed |
| Repair / breakdown | Reported → Triaged (urgency) → Remote fix tried (guess) → Tech or vendor booked → Parts ordered (optional) → Fixed → Practice confirmed → Closed |
| Preventive maintenance / service | Scheduled (from the asset PM plan) → Reminder sent → Done (checklist) → Logged → Next due set |
| Install | Delivered → Local tech booked → Remote assembly guidance (Shaldon) → Installed → Practice sign-off → Asset registered |
| Warranty claim | Opened → Evidence gathered (photo, serial, UDI) → Claim drafted → Approved & sent → Vendor response → Replaced/repaired or denied → Closed |
| Recall | Recall detected (guess: FDA recall feed matched on UDI/model) → Affected assets listed → Must-acknowledge notice to practices → Remedy done → Closed |
Blocked or held can happen at any stage, with a reason. A held stage shows red. A stage waiting on George shows blue.

## 4. AI vs human steps
| Step | AI does and closes | Human step |
|---|---|---|
| Intake | Turn the practice report, Slack or email into a request; dedupe; set urgency | Low-confidence urgency calls |
| Quote/PI parsing | Parse into SKU, qty and price; diff versions; compute margin and transport as its own line | George sets resale pricing; approves |
| Compliance | Look up FEI, listing, product code, K-number, GMP-exempt status and GUDID; fill the per-SKU sheet | George removes or replaces uncleared SKUs (e.g. X5 motor, W01) |
| Vendor outreach | Draft requests and follow-ups | Approve & send (always) |
| Scheduling techs/installs | Propose slots; build the assembly checklist | Practice lead confirms; Shaldon guides live |
| Warranty/recall | Assemble evidence; draft the claim or notice | Approve & send |
| Payments, bond, contracts | Prepare amounts and landed cost | George only; no AI releases money |

## 5. Data objects
Practice · Asset (model, serial, UDI DI, location, warranty, PM plan) · Catalog item (maker, product code, class, K-number or exempt, GMP-exempt, GUDID DI, HTS, needs 2877) · Vendor (legal maker vs trader, FEI, US agent, renewal status, docs) · Request (type, urgency, status, owner, source) · Quote/PI · PO · Shipment (container, SKUs, PL/CI/BL, sail/ETA, bond ref, entry codes) · Warehouse location (Dircks, China hold) · Service visit · Warranty claim · Recall notice · Decision (George queue) · Document (510(k) letter, registration, label photos).

## 6. Compliance gates (block the next stage; lessons from fda-udi-research.md and the register)
1. **FDA/UDI gate (before PO payment and before booking).** No SKU moves with a blank cell. Every device needs a UDI on the label and package plus a GUDID record, unless it's Class I *and* GMP-exempt. A K-number is not a UDI. Reusable handpieces need a direct mark. Lesson: YADENG had a K-number but no GUDID, and items marked "No FDA" were on the PI.
2. **Real-maker gate.** Trader papers must match the actual manufacturer (lesson: the Chuan Fu camera papers).
3. **Device-declaration gate.** Compressors and suction are dental devices (NRD) and are never declared "industrial". Any such suggestion triggers a must-acknowledge to the lead and George.
4. **PL/CI/BL completeness.** Every item is declared, including goods packed inside chair crates.
5. **Bond/customs gate.** The importer # is on file, an active continuous bond shows at Customs, and HBS importer registration is active. Lesson: a shipment was ready to sail with no bond on file.
6. **Radiation gate.** X-ray units (e.g. Runyes) need Form 2877 and an accession number.
7. **Registration renewal watch.** Foreign establishment renewals are tracked yearly.
8. **Storage gate.** Destination storage must meet the item's condition (temperature where required; equipment goes to Dircks), and insured value is set from landed cost.

## 7. Integration points
- **Vendors:** email-based outreach drafts. WhatsApp chats are outside triage, so Junaid forwards them.
- **Registrar Corp:** SKU verification.
- **Customs:** broker entry data; SOZO bond.
- **Dircks:** equipment warehouse receipts and insured value.
- **China hold warehouse.**
- **openFDA lookups:** registration/listing, 510(k), GUDID.
- **To-Do sheet Team Tracking tab:** read-only import of open procurement rows until cutover, then read-only.
- **Finance payment queue.**
- **Shipment/procurement trackers:** existing ones are migrated.

## 8. Open questions for George (recommended default in italics)
1. Confirm Junaid as owner of Equipment. *Default: yes, with Zaid as backup.*
2. Resale pricing model. *Default: margin on equipment plus a separate transport line.*
3. Do client practices see vendor names and costs? *Default: they see their price only (guess).*
4. Service scope: does HBS run repairs and PM for client practices, or only sales? *Default: HDG first, same flow for clients (guess).*
5. Private label: ever? *Default: no. HBS stays importer, not labeler.*
6. Practice-side approval limit before the client lead must approve. *Default: any order or paid repair.*
