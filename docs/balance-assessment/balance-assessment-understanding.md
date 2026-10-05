> Repo copy, anonymized: real client names, emails and mailbox links removed. Use only fictional practices in the app.

# The Practice Balance Assessment: plain-English summary
*Written Sun Oct 4, 2026 by Grok Bot, for George's review. Used by brief §3.12 (Practice Owner page). Read-only research. Nothing was sent.*

## Sources (all from George's HBS mailbox, George's work mailbox)
1. **Email "Balance Assessment Documents"**, George → Dr. L (coaching client, DSO owner) , Sun Jun 28, 2026, 8:26 AM AZ. Two attachments:
   - **Practice Balance Assessment Form.docx**: the fillable diagnostic (practice profile, summary table, the five parts with targets, the priority box, the sequence rule).
   - **Practice Balance Assessment Guide.docx**: the full walkthrough (George called it "the 18-page explainer"): how to calculate every metric, data sources, how to read results, what to do when a metric is red, the sequence rule, 5 common patterns, how to run it as a team.
   - Thread: [link removed] . Dr. L replied "thank you" (Jun 29). George forwarded the same email and attachments to the client's project manager ("PM") on Tue Sep 22, 10:03 AM AZ.
   - Local copies: `src/balance/` (the .docx files and text extracts).
2. **Context email "Executive Assistant Hiring, Same-Store Growth & Founder Compensation"**, George → Dr. L, Thu Jun 25, 2026 (recap of the Wed Jun 24 call). It introduces the assessment as the tool for same-store growth across Dr. L's 26 locations ("doctor days to hygiene days, doctor days to exams, new patients to doctors… when a practice is out of ratio, the growth opportunity surfaces itself"), with the [one client location] practice as the live example (target 300 exams/month, team meeting weekly). Dr. L replied "Thanks, I'll take a look."
3. **Call transcript "George Dr. L Balance the PM"**, Tue Sep 22, 2026, 10:00-10:30 AM AZ (Google Meet). The file is "20260922_Call Transcript", attached to George's recap and also in Drive: [link removed] . The transcript text covers about 25 minutes, though the footer says "Transcription ended after 00:35:50." George and Dr. L moved to a phone call at the end, and that part isn't in it.
4. **Recap email "Dashboard Integration, PMS Discussion, and the Sample Demo"**, George → Dr. L and the PM, Wed Sep 23, 2026, 10:16 AM AZ (with the transcript attached). the PM replied Fri Oct 2 and George replied the same day. Thread: [link removed]

**Who's who.** **Dr. L (coaching client, DSO owner)** (Dr. L),  is the owner of **[client DSO]**, a growing DSO with 26 practices and an HBS coaching client (calls titled "George [client DSO] Coaching Call"). **the client's project manager ("PM")**,  is a **Project Manager at [client DSO]** (about 6 years there, IT/computer science background). He built their Open Dental → Cola (AWS) data pipeline and the Looker Studio-style practice dashboard. Others on the [client DSO] team in the mailbox: [client ops lead], [client CFO] (CFO).

**SP check:** this is **HBS work, not SP.** Everything was sent from George's HBS account to an HBS client, and neither document carries any SP name or branding. A search of the SP mailbox for "balance assessment" or the [client DSO] addresses found nothing. In the transcript George mentions "I did this exact same project when I was CFO" (building in-house PMS reporting), but he names no company. If DPCP OS ever cites that background, keep it unnamed.

## What it is, in plain English
A practice makes money through a chain: patients come in, get examined, are offered treatment, accept it, get scheduled, and pay. When a practice underperforms, usually **one link** is the problem, not the whole practice. The Balance Assessment checks every link with **ratios** (one part of the practice compared to another), because ratios show what raw totals hide.

George's golf analogy (Sep 22): a golfer has driving, irons, short game and putting. You gain the most strokes by fixing the weakest part *for the score they're shooting*. With 26 locations, some are bad at "driving" and some at "putting." The assessment tells each practice's coach which one, so coaching focuses there. **It compares a practice to itself (and to the targets), never practice against practice.** It is deliberately **operational KPIs only: no P&L, no EBITDA.**

## Structure: 5 parts, 25 metrics, in priority order
1. **Patient flow** (9 metrics): "the ceiling on everything else." New patients per doctor (30-40), exams per doctor (120-150), exam split between doctors (within 15-20%), doctor:hygiene days (1:2), patients current on recare (70%+), new-patient hygiene availability (3 openings within 1-2 weeks), hygiene reappointment (90%+), new-patient reappointment (75%+), no-shows and cancellations (under 10%).
2. **Treatment conversion** (4 metrics, all per doctor): patient acceptance (75-80%), dollar acceptance (35-50%), accepted per exam ($300-500), presented per exam ($400-600).
3. **Schedule efficiency and provider capacity** (3): doctor production per hour ($550 floor, $700-800 healthy, $1,000+ elite), restorative availability (3 crown-level openings within 1-2 weeks), hygiene as % of production (20-30%).
4. **Hygiene production quality** (4): perio % (17-20%), fluoride % (45-50%), hygiene production per day ($1,200-1,600 assisted, $800-1,000 unassisted), per hour ($200-250 assisted, $150-200 unassisted).
5. **Accounts receivable** (5): collections rate (95%+; under 88% = active billing problem), total AR to monthly production (under 1:1), AR over 90 days (under 10%), days in AR (under 30), and the insurance vs patient AR split (diagnostic only).

Each metric in the Guide has a formula, a target, three bands (On target / Monitor / Action required) and an "If red, what to do."

## Scoring and the one rule that matters
- **Status per metric:** ✓ at or above target, **!** close to target (the form says within 10%; the Guide gives exact bands per metric), ✗ below target.
- **The sequence rule:** the **first part (1 → 5) with a failing metric is the only priority.** Don't work lower parts until that one has a documented resolution plan and measurable progress. "A practice cannot convert its way out of a patient flow problem. It cannot collect its way out of a conversion problem." A bad number lower down is often a symptom of a higher part (thin hygiene production because there aren't enough patients is a Part 1 problem).
- **Output:** not a list of 20 fixes, but **one priority per month.** The form's box records Part, Metric, Value, Target, Resolution Plan and Review Date.
- **Five common patterns** in the Guide: strong production with weak collections (Part 5), full schedule with low production per hour (root cause Part 2), low new patients with good retention (check availability, then marketing), multi-doctor imbalance (per-doctor fix), and high cancellations with low reappointment (commitment at the chair).

## Inputs, cadence, how it's presented
- **Inputs:** one full calendar month of PMS data (new patients, exams by doctor, hygiene visits, doctor and hygiene days, active patients and those with a future hygiene appointment, reappointment, production and collections in total, by doctor and for hygiene, treatment presented and accepted by doctor, AR aging, insurance vs patient AR), plus two schedule checks (openings for 1.6 and 3.2). It works with Dentrix, Eaglesoft, Curve and Open Dental standard reports.
- **Cadence:** monthly, same day each month, as a **trend tool**, not a snapshot.
- **Presentation:** a structured monthly review. The practice manager pulls the data, and the doctors own the clinical metrics. Start with the summary, find the priority, leave with a time-bound plan, and review in about 30 days. Over time the history becomes the practice's "operating intelligence."

## How Dr. L's team responded
- **Dr. L:** brief acknowledgments by email ("Thanks, I'll take a look" Jun 26; "thank you" Jun 29). On Jun 25 George's recap committed Dr. L to a weekly same-store growth session with [client ops lead] and the regional managers, using the balance ratios. In the Sep 22 transcript Dr. L was in the room with the PM but barely spoke.
- **the PM (Sep 22):** hadn't seen it before the call, because Dr. L never forwarded it, so George forwarded it during the call. the PM immediately called it "a success rubric… broken into categories," "a stellar filter," and liked that it already has benchmark targets. He first asked whether it should be its own site or a tab in the dashboard, and whether practices would be compared against each other (George said no). He also floated a standalone printable/PDF version, since George worries "I create these things and then nobody uses them."
- **the PM (Oct 2 email):** "this matches my notes." He'll put the form, the guide and the transcript into [client AI tool] (their AI tool), share a rough sample with George and Dr. L before building it out, and book the [a vendor] demo. Expect the sample "a little after" the next week or two. George replied Oct 2: looking forward to it.

## What George and the PM agreed (Sep 22 call + Sep 23 recap)
1. **Put it inside the existing practice page, not a separate tool.** Order on the page: collections by month, new patients by month and provider production first, then the **Balance Assessment**: a **color-coded summary table on top** and the **five parts in detail below.**
2. **Monthly PDF of that whole page to each coach** (production, collections, new patients, provider breakdown, balance assessment).
3. **Compare a practice to itself over time**, not to other practices.
4. **"Intent over label":** metrics are "potato, potato." Substitute any equivalent metric the PMS already has (for example % acceptance instead of dollar acceptance). The goal behind the metric is what matters.
5. **Design feedback on the PM's dashboard:** make collections by month a **bar graph** instead of a line chart. Trim anything that doesn't support a practice-level decision (George questioned "OTC %," over-the-counter collections; the PM wants 90%+). George also said the page "doesn't seem too busy" for people expected to run a practice.
6. **Flash a sample early**, before going deep, for George and Dr. L to review by email.
7. **Side topics:** keep Dental Intel for now (their $490/office/month bundle covers digital forms, patient communication and online scheduling, and an in-house rebuild saves maybe $250/month per practice at a real switching cost). Do the [a vendor] (agentic PMS) demo. The hard part (Open Dental data through Cola into a database) is done. The rest is visualization.

## What this means for DPCP OS (summary of brief §3.12)
The Practice Owner page puts **DPCP's value first** (what DPCP handled, money recovered and saved, time given back, wins, progress since joining). Then comes George's **Balance Assessment**, laid out as he told the PM: color-coded summary, the sequence-rule priority, then the five parts, with each weak area linked to the DPCP service that fixes it, plus a monthly PDF that goes to Review before it reaches the coach.

## Gaps
- The transcript's last ~10 minutes (after George and Dr. L moved to the phone) aren't recorded. The "other project" the PM and George are "testing" isn't described.
- No written feedback from Dr. L on the content of the assessment beyond acknowledgments. the PM's sample isn't in yet, so George hasn't seen anything to review.
