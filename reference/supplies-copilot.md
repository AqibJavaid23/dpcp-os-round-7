# DPCP OS module: Dental Supplies Copilot
**Status:** draft module spec. Nothing built or sent. It follows product-design-v1 (principles, roles, shared components) and screen-specs-v2 §0 (frame, status colors, the five standard states, microcopy). It runs for HDG practices first, and client practices get the identical experience. Anything marked "(guess)" isn't in a source.
**Sources:** procurement/register.md · procurement/fda-udi-research.md · dept-needs/procurement.md · dpcp-launch (owner-briefs/supplies.md, launch-checklists.md, knowledge.md) · handoffs · To-Do sheet Team Tracking tab.

## 1. Users and roles (maps to screen-specs §0.4)
| Role | Who | Sees | Does |
|---|---|---|---|
| Practice staff (web app, no login) | Front desk, assistants, hygienists. Staff tap their name. | Their own practice's orders and stock | Reorder, request a new item, report damage or a wrong item, do counts, confirm receipt |
| Client practice lead | Office manager or doctor (guess) | Their practice's orders, spend and par levels | Approves orders over a set limit, substitutions, new items |
| HBS procurement employee | Junaid (proposed interim owner); Zaid (vendor docs, carton specs); Nomi (customer support and material questions only); Mishka (quote and catalog reviews); Shama (carton artwork) | HBS execution queue | Work the tasks |
| E-commerce lead | Open seat | Marketplace listings and orders | Listings, pricing updates (George sets the pricing approach) |
| Lead | Junaid (until the e-commerce lead is named) | My team + the module dashboard | Reassign, approve team items |
| George | George | Everything | Money, pricing, vendor selection, artwork approval, bond |

## 2. Screens
1. **Practice: Order supplies** (no login). Tap your name, then see "Your usual items" with par levels and one-tap reorder. Search the catalog. Request a new item. Mark something urgent.
2. **Practice: Report a problem.** Damaged, wrong item, short-shipped, backordered or expired. Includes a photo and the lot number if there is one.
3. **Practice: Count stock.** A guided count of shelf items with big +/- tap targets, and a photo option (guess).
4. **HBS execution queue.** Each request becomes a Today task with the order draft, stock on hand, vendor or 3PL route, and the SOP step.
5. **Lead dashboard.** Orders by status, backorders, low stock across practices, aging inventory (Huge Dental), 3PL performance, marketplace sales, compliance holds, the George decision queue and the exceptions queue.
6. **Catalog / inventory.** SKU, maker, FDA data (product code, K-number or exempt, GUDID or UPC), storage condition (e.g. temperature-controlled), location (3PL, Dircks, practice), on hand, par, lot/expiry.
7. **Vendor view.** Same as Equipment: maker vs trader, FEI, listings, docs and response rate (e.g. masks: 1 of 10 vendors responded).
8. **Inbound shipment tracker.** Used for imported supplies (Motex masks, Guarddent instruments, SCS burs, Hartalega gloves).

## 3. Request types and status lifecycles
| Type | Lifecycle |
|---|---|
| Reorder | Requested (or auto-suggested at par) → Approved (practice lead if over limit) → Routed (3PL stock / drop-ship / vendor PO) → Picked & shipped → Delivered → Practice confirmed → Closed |
| New item request | Requested → Sourced (options + compliance check) → Practice lead approved → Added to catalog → First order (Reorder flow) |
| Backorder / substitution | Backorder detected → Substitute proposed (same function, compliant) → Practice lead approved → Shipped → Closed, or wait with an ETA |
| Return / damaged goods | Reported (photo) → Claim drafted → Approved & sent to vendor/3PL → Credit or replacement → Closed |
| Inventory count | Scheduled → Counted by staff → Variances flagged → Reorders suggested → Closed |
Blocked or held can happen at any stage, with a reason (red). Waiting on George or the practice lead is blue.

## 4. AI vs human steps
| Step | AI does and closes | Human step |
|---|---|---|
| Par levels and reorder suggestions | Compute from counts and usage | Practice lead approves over the limit |
| Routing | Pick 3PL stock, drop-ship or a vendor PO; draft the PO | Approve any new PO or payment |
| Substitutions | Propose a compliant equivalent | Practice lead approves |
| Vendor docs and quotes | Parse quotes and PIs; collect 510(k), registration, listing and GUDID; track | Mishka/Junaid review; outreach approved & sent |
| Marketplace listings (Net32, Dental Mates, Shopify) | Draft listings from the catalog; sync stock | E-commerce lead publishes; George sets pricing |
| Returns/claims | Assemble evidence; draft the claim | Approve & send |
| Packaging/artwork | Collect carton dims, dieline and inner-box count | Shama designs; George approves before it goes to Carmen |

## 5. Data objects
Practice · Catalog SKU (maker, FDA data, UPC/GUDID, storage condition, HTS) · Inventory lot (location, qty, lot, expiry, storage condition) · Par level · Order + order line · Vendor · Quote/PI · PO · Shipment (PL/CI/BL, bond ref) · Warehouse/3PL location · Marketplace listing · Return/claim · Count session · Packaging spec (carton dims, dieline, inners per outer, artwork approval) · Decision.

## 6. Compliance gates
1. **FDA/UDI gate per SKU (before payment and booking).** Masks need a 510(k) (lesson: no Motex FXX 510(k) found). Burs and instruments need the *real* maker's registration and listing (lesson: SCS/Celina may be a trader). For non-GMP-exempt Class I items, GUDID or a UPC is required (Guarddent lines).
2. **Not-a-device check.** Whitening gel is a cosmetic or drug and a hazmat oxidizer. It's bought domestically, never added to a device container.
3. **PL/CI/BL completeness** and **bond/customs readiness**, the same gates as Equipment.
4. **Temperature-controlled storage gate.** Items with a storage condition (e.g. the Huge Dental inventory) can only be routed to a location that meets it, and the 3PL must be qualified for it. Insured value is set from landed cost.
5. **Expiry and lot tracking** for consumables (guess).

## 7. Integration points
- **3PL / drop-ship warehouse** (California, or Phoenix and California, unsettled) and Dircks: stock sync, ship confirmations.
- **Marketplaces:** Net32, Dental Mates and the Shopify store, starting with Huge Dental inventory.
- **Vendors:** Hartalega, Motex, Guarddent, SCS, plus mask vendors via Soozo. Outreach is drafted and approved.
- **Customs broker and SOZO bond** for imports.
- **Finance payment queue.**
- **Team Tracking sheet:** read-only import of open procurement rows until cutover.
- **Design (Shama)** for box and carton artwork. The box carries the DPCP services list.

## 8. Open questions for George (recommended default in italics)
1. Who is the e-commerce lead? *Default: name one person. Junaid stays interim and Nomi stays support-only.*
2. Which 3PL, and where (California, Phoenix, or Dircks drop-ship)? *Default: decide after Junaid's shortlist.*
3. Pricing approach for practices vs marketplace buyers. *Default: George sets it; AI keeps prices in sync.*
4. Practice-lead approval limit for reorders. *Default: auto-approve at-par reorders of catalog items; anything new or over par needs approval (guess).*
5. Client practices: order through HBS stock only, or also drop-ship from vendors? *Default: both, routed by the AI, same experience as HDG.*
6. Whitening gel: is it needed? *Default: domestic purchase only.*
