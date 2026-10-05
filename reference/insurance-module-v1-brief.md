# Insurance (Billing) Module v1: brief for Adil
Insurance & RCM Strategy Bot. **Internal file. Not shared with the team.** Built from /workspace/billing-team/ (rcm-task-inventory.md, ai-roadmap.md, knowledge.md) and /workspace/org-design/design/dept-needs/insurance-rcm.md. **[Guess]** marks my own design suggestions, not facts.

## Ground rules from George's Oct 3 decisions
- Adil teaches the HBS bot how billing works and delivers v1 of the Insurance module. **No automation in v1**: v1 is the execution layer, where billers do their work inside DPCP OS. RCM automation comes in gradually after that.
- **No PHI in DPCP OS until a BAA is signed.** v1 screens show the client, the task, counts, status and owner only. Patient names, DOB, member IDs, claim and EOB detail stay in the PMS and payer portals, and a task links out to the right place.
- HDG practices come first, and clients get the same experience.
- Track George's metric from day one: the % of each biller's work done with AI and estimated hours saved per week. Flag any biller with no AI use 2 weeks in a row.

## 1. Execution-layer screens (v1) [guess: layout]
**Biller "Today" view** (one task at a time). Each task card shows the client, task type, count (for example, "Dental Home, verify 18 patients for upcoming DOS"), due time, a link out to the PMS or portal, buttons for done / blocked (with a reason) / handoff, and an "AI used? Y/N + tool" toggle.

**Queues by client** (lead and supervisor views):
| Queue | Unit of work (no PHI) | Owner today (standups) | Key statuses |
|---|---|---|---|
| Picking + eligibility/benefits verification | Patients per date of service per client | Ahmad, Younus (supervisor), Amna, Athar, Basharat | Not started / in progress / verified / needs call / QA'd |
| Add-ons | Add-on requests per client per day | Amna, Ahmad, Younus | Received / verified |
| Verification QA | Batches per date of service | Amna, Younus | Passed / issues found |
| Claim submission | Claims per client per day | Junaid, Zubair, Younus | Submitted / rejected / corrected |
| Payment posting | ERAs, EFTs, checks per client | Zubair, Waqas, Younus | Extracted / posted / blocked (missing deposit info) |
| AR follow-up | Claims per aging bucket (0-30 / 31-60 / 61-90 / 90+) per client | Waqas, Junaid, Sadaqat | Worked / call made / escalated |
| Denials and appeals | Appeals per client | Waqas, Sadaqat | Drafted / reviewed / sent / won / lost |
| Month-end client reports + HBS invoices | One per client per month | Zubair, Waqas, Sadaqat (approves) | Compiling / reviewed / sent |
| Credentialing | Provider + payer per location | Khadim, Sadaqat | Docs needed / submitted / approved / fee schedule set |

**Blockers board:** client access problems (portals, Splashtop, software logins), missing deposit details, portal data gaps, and payer issues (for example, BCBS paying the patient directly). Each blocker has an owner and a status.

**Sadaqat's lead dashboard:** for each client, the queue counts above, AR aging (90+ highlighted), and collections vs production. For each biller, tasks done, AI use % and hours saved. Also whether the daily standup and EOD transcripts were uploaded.

**Adil's AI-adoption panel:** the weekly per-biller metric, built from the "AI used" toggle on each task. This produces the numbers for his weekly report template (/workspace/billing-team/adil-weekly-ai-report-template.md).

## 2. Client systems list Sadaqat needs to provide
DPCP OS can't route a task to the right system without this. Known so far is marked; everything else is **not found**.
| Client | PMS | Clearinghouse | Remote access | Main payer portals | Services we do |
|---|---|---|---|---|---|
| Dental Home Dentistry | Dentrix | ? | ? | ? | ? |
| Raheel's practice (Edgar) | Curve Dental | ? | ? | ? | ? (AOB setup work, Oct 2) |
| Jory's practice (Grand Island) | Eaglesoft | ? | ? | ? | ? |
| Bobby's office | Eaglesoft | ? | ? | ? | ? |
| Dr. Edward | ? | ? | ? | ? | ? (patient AR handled by the practice's Liz) |
| Dr. Ari / Eric Foreman, incl. Miami | ? | ? | ? | ? | ? |
| J and Dian | ? | ? | ? | ? | ? |
| Souderton | ? | ? | ? | ? | ? |
| Doylestown | ? | ? | ? | ? | ? |
| WPB | ? | ? | ? | ? | ? |
| Lake Worth | ? | ? | ? | ? | ? |
| Dr. Florentine (AR project) | ? | ? | ? | ? | ? |
| James Clinic (Sameed, Faheem) | ? | ? | ? | ? | ? |
Also needed: which clinic uses DPX, what "Liquid" is, who at each client holds the logins, and whether each client has a signed BAA with HBS. Client names come from standups and may be spelled inconsistently; Sadaqat should confirm the official list.

## 3. First SOPs Adil should teach the bot (in this order) [guess: order]
1. **Eligibility/benefits verification.** The highest-volume entry-level work and the core of the plan to hire lower-cost billers. Covers the steps by PMS, the standard benefits-summary fields, when to call instead of using the portal, the add-on handling, the QA checklist, and client-specific rules such as the AOB check in Curve and BCBS paying the patient.
2. **Claim submission.** Covers the steps for each client's PMS and clearinghouse, the attachments and narratives each payer requires, and how to handle a rejection.
3. **Payment posting.** Covers ERA/EFT extraction by portal, check handling, the missing-deposit procedure, and posting exceptions.
4. **AR follow-up and appeals.** Covers aging priorities, the call script and outcome codes, appeal templates by denial reason, the senior-review rule, and the follow-up cadence. Waqas's Claude appeal method is the starting point.
5. **Month-end close.** Covers the client report template, the HBS invoice build (activity counts by client), and Sadaqat's approval step.
Each SOP should note which steps touch PHI, so the module keeps them as link-outs until a BAA is signed.

## 4. What "v1 done" looks like [guess]
- Every biller starts their day in the Today view, and every queue above has its daily counts entered.
- Sadaqat runs the morning standup from the lead dashboard.
- The client systems list is complete.
- SOPs 1-3 are taught to the bot and written into the module.
- The AI-use toggle feeds Adil's weekly report.
- No PHI is stored anywhere in DPCP OS.

## Open questions for George/CoS
- What BAA path will cover AI tools that handle PHI later (the vendor and when)?
- Should the James Clinic team be in this module or handled separately?
- Will billers use personal Gmail or HBS accounts for DPCP OS logins (a PHI risk if personal)?
