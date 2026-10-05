# DPCP OS: Employee Monitoring & Data Policy Recommendation

**Prepared for:** George Hariri, Owner, Hariri Business Services (HBS), Arizona
**Date:** October 3, 2026
**Status:** Draft for internal decision. Nothing has been sent to anyone. Nothing has been deployed.

> **DISCLAIMER: THIS IS NOT LEGAL ADVICE.** This memo was prepared for HBS's internal decision-making. It is not a legal opinion, and nobody who wrote it is your attorney. It summarizes publicly available law as researched on October 3, 2026, and some of it may be wrong, out of date, or inapplicable to HBS's exact setup. Every point tagged **[VERIFY – licensed attorney, <jurisdiction>]** needs confirmation from a lawyer licensed in that jurisdiction before you rely on it. Do not roll out mandatory capture of DMs or screenshots to South African or Pakistani workers until counsel has signed off.

---

## 1. Executive summary

**What's planned:** DPCP OS stores every worker's work Gmail (through Google Workspace domain-wide delegation) and Slack messages, including DMs (through a Slack app each user authorizes). It also pulls in Time Doctor time tracking and screenshots, and uses AI to turn messages into tasks. Connecting is mandatory, and IT sets it up before day 1. The workers are in Arizona, South Africa and Pakistan, and they're a mix of employees and contractors.

**Bottom line:**

1. **The plan as written (Option A) is legally possible in Arizona and under US federal law** with good written notice and signed consent. **It's the riskiest option in South Africa** (POPIA's minimality and proportionality tests, plus RICA's interception rules). **In Pakistan it's legally uncertain** (no data-protection statute yet, but there's a constitutional privacy right and PECA's interception offence). Under any law, full capture also **makes contractors look like employees**.
2. **Some of the plan's details work against you:**
   - **Having IT authorize the Slack app "as the user" before day 1** undercuts the consent you're relying on. The worker should sign first, then authorize (or watch it being authorized).
   - **Bulk-storing DMs and showing them to people who weren't in the conversation** is where nearly all the legal and trust risk sits. It may also conflict with Slack's API terms, which bar apps from undermining Slack's access controls.
   - **Time Doctor screenshots** are the single strongest "control" signal for contractor misclassification. If any worker touches RCM (revenue cycle management) work, screenshots can also capture PHI (protected health information).
3. **Recommendation: Option B, "Work channels yes, DMs no, people don't read messages."**
   - Make capture mandatory for work Gmail and Slack channels.
   - Exclude DMs by default, with a one-click "send this to DPCP" opt-in.
   - Turn screenshots off, or blur them, and keep them only briefly. Turn them off completely for contractors.
   - Let the AI create tasks, but don't let humans routinely read stored messages. Allow logged, two-person "break-glass" access for real investigations and legal holds.
   - Enforce a never-touch list (HR matters, health, pay, legal disputes, personal messages, private messages between you and an employee) at the point of ingestion, not just in the display.
4. **Outside counsel:** you need a **South African** privacy/labour lawyer before go-live (the highest-risk jurisdiction). A **Pakistani** employment/cyber-law lawyer should review the contract and consent language. An **Arizona/US** employment lawyer should do a short review of the policy, contractor agreements and the NLRA (National Labor Relations Act) angle. Bring in **HIPAA** counsel only when RCM goes live.

### George's decision (fill in)

| Decision | Options | Recommended | Your choice |
|---|---|---|---|
| Overall model | A / B / C | **B** | ☐ |
| Slack DMs | Captured / Excluded by default with opt-in / Excluded entirely | **Excluded by default + opt-in** | ☐ |
| Time Doctor screenshots (employees) | Full / Blurred & 7–14 day retention / Off | **Blurred, ≤14 days, or off** | ☐ |
| Time Doctor screenshots (contractors) | Same as employees / Off | **Off** | ☐ |
| Human reading of stored messages | Routine / Break-glass only / Never | **Break-glass only** | ☐ |
| Raw message retention in DPCP OS | 30 / 90 / 365 days | **30–90 days** | ☐ |
| Break-glass approvers | George + 1 designee / George + outside counsel | **George + a named second approver** | ☐ |
| Engage SA counsel before SA go-live | Yes / No | **Yes** | ☐ |

---

## 2. The options

### Option A: Full mandatory capture, as planned

- **What it is:** All work Gmail, all Slack channels and DMs, and Time Doctor screenshots for everyone. AI triage. Humans can read stored messages. Mandatory, and set up by IT before day 1.
- **Pros:** The fullest picture of the work. Nothing slips through triage. Simplest to explain ("everything is captured").
- **Cons:**
  - DMs are where people talk about health, pay, HR complaints, personal life and unionizing, so you'll inevitably store "never-touch" data.
  - Under POPIA it's hard to defend as minimal and proportionate.
  - RICA consent from SA workers covers only conversations they're part of. External and other-party content relies on the business exception and notice.
  - DM capture has to rely on each user's token, and it may conflict with Slack's API terms (see §3.6).
  - It strongly signals employer control over contractors.
  - It hurts morale and recruiting.
  - It creates a large discoverable archive: in any lawsuit, everything stored can be demanded.
- **Risk:** **High in South Africa**, **Medium-High in Pakistan**, **Low-Medium in Arizona/US** (with signed consent), **High for contractor misclassification** everywhere.

### Option B: Mandatory work-channel capture, DMs excluded or opt-in, screenshots limited (RECOMMENDED)

- **What it is:**
  - **Mandatory:** work Gmail (with exclusions), Slack public and private *channels*, and Time Doctor *time and activity* data.
  - **DMs:** off by default. A worker can send a DM thread to DPCP with a message shortcut or emoji.
  - **Screenshots:** off, or blurred with 7–14 day retention, for employees only. Off for contractors.
  - **AI:** creates tasks. Humans see tasks plus a short excerpt and a link back to the source. Nobody reads full stored messages without break-glass approval.
  - **Never-touch list:** enforced at ingestion.
- **Pros:**
  - Keeps ~80–90% of the operational value, since most real work requests come through email and channels.
  - Much easier to justify under POPIA (minimality, legitimate interest) and RICA s6 (business communications on a business system).
  - Avoids most of the DM problems.
  - Lowers misclassification risk for contractors.
  - Shrinks the discoverable archive.
- **Cons:**
  - Some work requests made in DMs will be missed unless people opt them in. You'll need a norm: "work requests go in channels."
  - More engineering: exclusion rules, opt-in shortcut, break-glass flow.
  - Still needs written notice and consent everywhere.
- **Risk:** **Low-Medium in South Africa** (after counsel review), **Low-Medium in Pakistan**, **Low in Arizona/US**, **Low-Medium for misclassification**.

### Option C: Minimal, task triage only, no human message reading

- **What it is:** DPCP OS reads messages on the fly, creates tasks, and stores only the task plus a link to the original in Gmail or Slack. It never stores message bodies, has no break-glass role for message content, and takes no screenshots (Time Doctor time only, or no Time Doctor).
- **Pros:** Lowest legal exposure and the smallest data footprint. Easiest POPIA story ("we don't keep it"). The fewest data-subject requests and the least to produce in discovery.
- **Cons:**
  - No internal record if you need to investigate misconduct or a client dispute (though the source systems, Gmail/Vault and Slack, still hold the data under their own retention).
  - Weaker audit trail of why a task was created.
  - DMs are still a problem if you process them on the fly.
- **Risk:** **Low** in all three countries. **Low** for misclassification.

### Comparison

| | A (Full) | B (Recommended) | C (Minimal) |
|---|---|---|---|
| Operational value | Highest | High | Medium |
| South Africa legal risk | High | Low-Med | Low |
| Pakistan legal risk | Med-High | Low-Med | Low |
| Arizona/US legal risk | Low-Med | Low | Low |
| Contractor misclassification risk | High | Low-Med | Low |
| Never-touch leakage risk | High | Medium | Low |
| Discovery/breach exposure | Large | Moderate | Small |
| Build effort | Lowest | Medium | Medium |
| Worker trust | Low | Medium-High | High |

### Recommendation: Option B, built on C's "store-less" design

Why:

1. **It solves the actual business problem.** Turning work requests into tasks needs work channels, not private DMs.
2. **It's the version you can defend in South Africa,** which has the strictest law of your three countries. POPIA asks whether you could reach the same goal with less data, and A fails that test for DMs and screenshots.
3. **It keeps contractors defensible.** Remove screenshots and DMs for contractors and the "control" story gets much weaker.
4. **It keeps a break-glass path** for real problems (fraud, harassment, client disputes, legal holds), which C gives up.
5. **Store less by default.** Keep tasks, an excerpt and a source link. Purge raw bodies after 30–90 days. You can expand later if counsel is comfortable. Clawing data back is much harder than not collecting it.

---

## 3. Legal analysis by jurisdiction

### 3.1 US federal

**ECPA Title I, the Wiretap Act (18 U.S.C. §§ 2510–2523).** This prohibits intentionally *intercepting* wire, oral or electronic communications. The main exceptions:

- **Party consent (18 U.S.C. § 2511(2)(d)).** Interception is lawful if one party to the communication consents, unless the purpose is criminal or tortious. A signed acknowledgment from each worker is your main protection.
- **Business-use / "ordinary course of business" exception.** The definition of an interception "device" in 18 U.S.C. § 2510(5)(a) excludes equipment used in the ordinary course of business. Courts read this narrowly. It generally covers monitoring business communications for a legitimate business reason, not personal communications once they're identified as personal. **[VERIFY – licensed attorney, US federal]**
- **Provider exception (18 U.S.C. § 2511(2)(a)(i)).** This applies to providers of the communication service. Whether HBS counts as a "provider" when Google or Slack hosts the service is unclear. **[VERIFY – licensed attorney, US federal]**
- **Interception vs. stored access.** Pulling messages from Gmail or Slack through an API after they've been delivered is generally treated as *access to stored communications*, not real-time "interception." Courts, including the Ninth Circuit (which covers Arizona), have required interception to be contemporaneous with transmission (*Konop v. Hawaiian Airlines*, 302 F.3d 868 (9th Cir. 2002)). That points you to the SCA. **[VERIFY – licensed attorney, US federal / 9th Cir.]**

**Stored Communications Act (18 U.S.C. § 2701 et seq.).** This prohibits unauthorized access to communications held in electronic storage by a communications service. The exceptions:

- **§ 2701(c)(1):** conduct authorized by the person or entity providing the service. Some courts have applied this to employers searching their own email systems (e.g., *Fraser v. Nationwide Mutual Ins. Co.*, 352 F.3d 107 (3d Cir. 2003)). Whether it applies when Google or Slack is the actual provider is less settled. **[VERIFY – licensed attorney, US federal]**
- **§ 2701(c)(2):** conduct authorized by a user of the service with respect to a communication of or intended for that user. This is why each worker's own authorization and signed consent matter.

**Practical upshot (US):**

- Work Gmail on HBS's Workspace domain plus a signed policy plus consent is low risk.
- Slack DMs collected through each user's own authorization, with signed consent, are low-to-moderate risk.
- **Never** collect from personal accounts (personal Gmail, personal WhatsApp). That's where SCA and state claims arise.
- Don't let IT authorize the app *as the user* without that user's signed consent first.

**Other US federal points:**

- **NLRA § 7.** Non-supervisory US employees have a protected right to discuss pay and working conditions with each other, including in DMs. Monitoring that chills or punishes that activity can be an unfair labor practice. The NLRB General Counsel's 2022 memo on electronic surveillance (GC 23-02) is reported to have been rescinded in 2025. Even so, the underlying § 7 risk remains. **[VERIFY – licensed attorney, US federal/NLRA]** Treat pay discussions and complaints about working conditions as never-touch for discipline.
- **Privilege.** An employee's messages with their own lawyer on a work account can still be privileged in some courts (e.g., *Stengart v. Loving Care Agency* (N.J. 2010)). Exclude known attorney domains. **[VERIFY – licensed attorney, US]**
- **HIPAA:** see §3.8.

### 3.2 Arizona

- **One-party consent.** Under **A.R.S. § 13-3005(A)(1)**, it's a class 5 felony to intentionally intercept a wire or electronic communication "to which he is not a party" without the consent of either the sender or the receiver. **A.R.S. § 13-3012(9)** exempts interception made with the consent of a party.
- **No business-extension exemption.** Arizona's exemption list (§ 13-3012) reportedly has no general "ordinary course of business" exemption like the federal one. That means **party consent is your Arizona safe harbor**, and it's another reason to get signed consent from every worker. **[VERIFY – licensed attorney, Arizona]**
- **No specific Arizona employer-monitoring notice statute** was found. Arizona doesn't have a law like New York's or Connecticut's, so written notice is best practice rather than a statutory requirement. **[VERIFY – licensed attorney, Arizona]**
- **Related Arizona rules:**
  - A.R.S. § 13-3019 (surreptitious photographing/recording). Make sure Time Doctor's webcam and photo features are **off**.
  - Arizona's data-breach law (A.R.S. § 18-551 et seq.) applies if stored data containing covered personal information is breached. **[VERIFY – licensed attorney, Arizona]**
  - For contractors, Arizona's Declaration of Independent Business Status statute (A.R.S. § 23-1601) creates a rebuttable presumption of contractor status if a declaration is signed. Heavy monitoring can help rebut that presumption. **[VERIFY – licensed attorney, Arizona]**

### 3.3 Other US states (if remote workers move)

Require workers to tell you **before** they relocate, so you can update notices.

- **Written-notice laws for electronic monitoring:**
  - **New York** (Civil Rights Law § 52-c): prior written notice, acknowledgment, and posting.
  - **Connecticut** (Gen. Stat. § 31-48d).
  - **Delaware** (19 Del. C. § 705).
  - Reportedly **Maine** has added one. **[VERIFY – licensed attorney, ME]**
- **All-party-consent interception states:** California, Florida, Illinois, Maryland, Massachusetts, Montana, New Hampshire, Pennsylvania, Washington, among others. In these, one person's consent may not cover the other people in a conversation. Signed consent from *all* workers handles internal messages. External correspondents are the gap. **[VERIFY – licensed attorney, per state]**
- **California:** the CCPA/CPRA covers employee data if HBS meets its thresholds (revenue and number of consumers). That would bring notice-at-collection requirements, access/deletion rights, and risk-assessment rules for monitoring. HBS likely falls below the thresholds, but check if a California hire happens. **[VERIFY – licensed attorney, California]**
- **Illinois BIPA, Texas and Washington biometric laws:** don't enable any face, photo or biometric features.

### 3.4 South Africa: POPIA and RICA (highest-risk jurisdiction)

**Does POPIA apply to an Arizona business?** POPIA applies to responsible parties domiciled in South Africa, or not domiciled there but using "automated or non-automated means" in the Republic. Running Time Doctor and DPCP connectors on SA workers' laptops very likely counts. If you use a South African employer-of-record or entity, it applies directly. **Assume POPIA applies.** **[VERIFY – licensed attorney, South Africa]**

**POPIA: what you must do**

| Requirement | What it means for DPCP OS |
|---|---|
| **Lawful processing (s 9) and minimality (s 10)** | Processing must be adequate, relevant and *not excessive*. DMs and screenshots are the hard part. Option B keeps you on the right side. |
| **Justification (s 11)** | Don't rely on consent alone. In employment, consent is weak because it isn't truly voluntary when the job depends on it. Rely on **s 11(1)(b)** (necessary for the employment/service contract) and **s 11(1)(f)** (legitimate interest of HBS). Use consent as a backup, mainly for RICA. Under s 11(3), workers can **object** to processing based on legitimate interest, so you need a process to consider objections. **[VERIFY – licensed attorney, South Africa]** |
| **Purpose specification (s 13) and retention limits (s 14)** | Name specific purposes (task triage, security, time records, investigations, legal holds). Keep data no longer than needed, with set retention periods (§7). |
| **Further processing (s 15)** | Don't reuse message data for unrelated things such as performance scoring or training AI models without a new assessment. |
| **Notification (s 18)** | Before collection, tell the worker: (a) what you collect and from where; (b) HBS's name and address; (c) the purpose; (d) whether providing the data is voluntary or mandatory; (e) the consequences of not providing it; (f) any law requiring it; (g) any cross-border transfer and the protection level; (h) recipients, rights of access, correction and objection, and the right to complain to the Information Regulator, with contact details. **The acknowledgment form in §11 is written to cover this.** |
| **Security (s 19) and operators (ss 20–21)** | Google, Slack, Time Doctor, your AI/LLM vendor and your hosting provider are "operators." Each needs a written contract with security terms, which their standard data processing agreements (DPAs) usually provide. **Confirm your AI vendor won't train on your data.** |
| **Breach notification (s 22)** | Notify the Regulator and affected workers as soon as reasonably possible after a compromise. |
| **Data-subject rights (ss 23–25)** | Access, correction and deletion. Requests are handled through PAIA (the Promotion of Access to Information Act) procedures. A private-body PAIA manual may be required. **[VERIFY – licensed attorney, South Africa]** |
| **Special personal information (ss 26–33)** | This covers religious or philosophical beliefs, race/ethnicity, trade-union membership, political persuasion, health, sex life, biometrics and criminal behaviour. DMs and screenshots *will* pick some of it up. Processing is prohibited unless an exception applies. That's the strongest reason to exclude DMs and filter health and HR content at ingestion. |
| **Automated decisions (s 71)** | A person may not be subjected to a decision with legal or substantial effect based *solely* on automated processing that profiles them, including their *performance at work*. **Never let the AI or Time Doctor scores alone drive discipline, pay or termination.** A human must decide, and the worker must be able to respond. |
| **Information Officer (ss 55–56)** | Each responsible party has an Information Officer (by default, the head of the business, which means you) and must register them with the Information Regulator. You can appoint deputies. Whether a foreign responsible party must register is unclear, but registering is the safe path. **[VERIFY – licensed attorney, South Africa]** |
| **Cross-border transfer (s 72)** | Moving SA workers' data to US servers (Google, Slack, the DPCP host, the AI vendor) is a transfer to third parties abroad. It's allowed if the recipient is bound by adequate law, binding corporate rules or a **binding agreement** with POPIA-equivalent protections, or if the worker consents, or if it's necessary for the contract. Use operator DPAs with POPIA-adequate terms. Commentators note s 72 may apply differently where HBS itself is the foreign responsible party. **[VERIFY – licensed attorney, South Africa]** |
| **Prior authorisation (ss 57–58)** | Needed for specific processing types, including: unique identifiers used for a different purpose and linked with other parties' data; information on criminal or objectionable conduct processed *for third parties*; credit reporting; and **transferring special personal information to a third party in a country without adequate protection**. Ordinary employee monitoring is generally *not* listed. But **Option A** (DMs plus screenshots capturing health and similar data, sent to the US) could arguably trigger s 57(1)(d). Option B largely avoids this. **[VERIFY – licensed attorney, South Africa]** |

**RICA (Regulation of Interception of Communications and Provision of Communication-Related Information Act, 70 of 2002)**

- RICA prohibits intercepting communications in the course of transmission, unless an exception applies.
- **s 4:** a party to the communication may intercept it.
- **s 5: prior written consent.** Anyone may intercept if one of the parties has given **prior consent in writing**. The acknowledgment form (§11) includes an explicit RICA s 5 consent, signed **before** any connection is activated.
- **s 6: business exception.** A business may intercept *indirect communications* (email, messages) in the course of carrying on its business, on a system provided wholly or partly for that business, **if all four conditions are met**:
  - (a) the interception is done by, or with the consent of, the **system controller** (in effect, the CEO-equivalent, which means you);
  - (b) it's for a listed purpose, such as establishing facts, detecting unauthorized use of the system, or securing the system's effective operation;
  - (c) the system is provided for use wholly or partly in connection with the business;
  - (d) the system controller has made **all reasonable efforts to inform users in advance** that communications may be intercepted, *or* the user has consented, expressly or impliedly.
- **Does pulling stored messages through an API count as "interception in the course of transmission"?** Probably not, and in that case POPIA governs instead. SA courts haven't settled this for cloud APIs, so comply with both. **[VERIFY – licensed attorney, South Africa]**
- **Why this matters:** In SA labour disputes, the CCMA (the Commission for Conciliation, Mediation and Arbitration) and the Labour Court can exclude evidence obtained in breach of RICA or the constitutional privacy right (Constitution s 14). An illegal capture can make the evidence useless when you need it. **[VERIFY – licensed attorney, South Africa]**

### 3.5 Pakistan

- **No enacted data-protection law (verified as of October 2026).** The **Personal Data Protection Bill, 2023** is still a draft. The Senate private member's version lapsed after the committee neither passed nor rejected it. The Ministry of IT & Telecom's revised draft was still being finalized after stakeholder consultation in 2025. 2026 practice guides (ICLG, Chambers) describe it as not yet passed. The draft is GDPR-like: consent, purpose limits, data-subject rights, a proposed National Commission for Personal Data Protection, possible data-localization rules for "critical" data, and large proposed fines. A separate Draft Data Governance Policy 2026, made under the Digital Nation Pakistan Act 2025, mostly concerns government data. **Re-check before go-live. Build Pakistan processes to the draft bill's and POPIA's standard now so you don't have to redo them later.** **[VERIFY – licensed attorney, Pakistan]**
- **Prevention of Electronic Crimes Act 2016 (PECA):**
  - It criminalizes **unauthorized access** to information systems or data.
  - It criminalizes **unauthorized interception** of non-public transmissions "with dishonest intention" by technical means. In the enacted Act this is reportedly s 19 (it was s 17 in the National Assembly bill text), punishable by up to 2 years and/or a fine of up to PKR 500,000.
  - "Unauthorized" means without authorization. **A signed, specific authorization from each worker, covering company accounts on company systems, is your protection.** Never access personal accounts.
  - The 2025 PECA amendments focus on online content and "false information." They reportedly add no workplace-monitoring exemption.
  - **[VERIFY – licensed attorney, Pakistan]** (section numbering and how it applies to employer monitoring).
- **Constitution, Art. 14:** "The dignity of man and, subject to law, the privacy of home, shall be inviolable." Pakistani courts have read privacy broadly, including in phone-tapping cases (often cited: *Benazir Bhutto v. President of Pakistan*, PLD 1998 SC 388). It mainly binds the state, but courts and labour forums may use it to interpret contracts and judge fairness. **[VERIFY – licensed attorney, Pakistan]**
- **Employment-contract practice:** Monitoring is usually handled by an explicit clause in the employment or service contract plus an IT/acceptable-use policy, with written acknowledgment. Provincial labour laws (Sindh, Punjab and others) and standing-orders rules may apply to "workers" depending on role and headcount. **[VERIFY – licensed attorney, Pakistan]**
- **Practical point:** Pakistani remote workers are often engaged as freelancers. For them, the contractor approach in §4 matters more than data law.

### 3.6 Platform terms: Google Workspace and Slack

**Google Workspace (domain-wide delegation, DWD)**

- DWD lets a service account read every user's mailbox without per-user consent. That's powerful and dangerous.
  - Restrict the service account to the **narrowest scopes** (e.g., `gmail.readonly`, or metadata plus a label-filtered read).
  - Store its key in a secrets manager and rotate it.
  - Log every use.
  - Treat a compromise of that key as a breach of every mailbox.
- Google's Workspace terms make the **customer** (HBS) responsible for obtaining any consents end users need and for using admin access lawfully. **[VERIFY – licensed attorney, US; confirm against current Google Workspace terms]**
- An *internal* app (limited to your Workspace users) generally avoids Google's OAuth verification and restricted-scope security assessment. Those requirements apply to externally distributed apps. **[VERIFY against current Google developer policy]**
- **Google Vault** already provides retention rules, legal holds and eDiscovery for Gmail. **Use Vault for legal holds and long-term retention** rather than building a second archive in DPCP OS.

**Slack**

- **Admin exports of DMs:** Owners and admins can export only *public channels* by default. Exporting private channels and DMs requires a Business+ or Enterprise plan **and an application to Slack**. Slack requires the owner to confirm that (a) appropriate employment agreements and corporate policies are in place, and (b) every use of exports is permitted under applicable law. The Discovery API (Enterprise only) is limited to eDiscovery, archiving and data-loss-prevention (DLP) use cases.
- **API Terms (effective Oct 10, 2025):**
  - You may not use the APIs to **"undermine the Services' access controls, such as by exposing private channel data to a user without access."** Building an app that collects DMs through user tokens and then shows them to managers or admins who weren't in the conversation could be read as exactly that. Option B avoids the problem. **[VERIFY – licensed attorney, US; confirm with Slack]**
  - The stricter data rules (no LLM training on API data, no bulk export, minimal retention) apply to apps offered **outside your organization**. Apps distributed commercially outside the Marketplace also face tight rate limits. **If HBS ever offers DPCP OS (or the RCM add-on) to clients, those rules apply.** Keep the internal app separate.
- For any later Slack eDiscovery or legal-hold needs, use Slack's native legal holds (Enterprise) or the Discovery API through an approved vendor rather than a home-built archive.

### 3.7 Time Doctor screenshots

- Screenshots capture whatever is on the screen: personal banking, health portals, chats with family, and RCM screens containing PHI.
- **Settings to use:** turn **off** webcam, photos and any audio. Use **blurred** screenshots, or none. Allow a "pause/private" mode outside paid time. Never install it on personal devices without a work-only profile. Keep screenshots ≤14 days.
- **Contractors: no screenshots.** (See §4.) **[VERIFY: confirm current Time Doctor feature names and settings with the vendor]**

### 3.8 The HIPAA boundary (brief)

- Core DPCP OS is meant to hold **no PHI**. But if any worker emails or Slacks claim details, patient names or EOBs (explanations of benefits), or has a billing system open during a screenshot, **core DPCP OS will ingest PHI**. It, and every vendor in the chain, then falls into HIPAA scope as part of HBS's business-associate work.
- **Controls:**
  - Keep RCM work in a **separate Google group or OU (organizational unit) and separate Slack channels**, excluded from core ingestion.
  - No Time Doctor screenshots on RCM roles.
  - Add a PHI-detection filter that drops matches.
  - Have a written rule: "No PHI in general channels or email."
- **When RCM goes live:** sign BAAs (business associate agreements) with Google (available for Workspace), Slack (requires an eligible enterprise plan) and your AI vendor, and sign client BAAs. Get HIPAA counsel review before go-live. **[VERIFY – licensed attorney, US/HIPAA]**

---

## 4. Employees vs. contractors

**The risk:** Misclassification tests in all three countries focus on **control over how, when and where the work is done**. Mandatory screenshots, activity tracking, set hours, AI-assigned tasks and required connection before day 1 are all evidence of control.

- **US:** IRS common-law control test. FLSA "economic reality" test (the DOL's 2024 rule is reportedly under reconsideration). Arizona § 23-1601 declaration. **[VERIFY – licensed attorney, US/Arizona]**
- **South Africa:** LRA s 200A presumption of employment (control, set hours, economic dependence, tools provided). The Code of Good Practice on who is an employee. Misclassification brings unfair-dismissal exposure plus UIF (Unemployment Insurance Fund), tax and COIDA (workers' compensation) liabilities. **[VERIFY – licensed attorney, South Africa]**
- **Pakistan:** Courts and labour forums look at substance over labels. Provincial law governs. **[VERIFY – licensed attorney, Pakistan]**
- **Also consider:** monitoring foreign "contractors" like employees can create local-employer or permanent-establishment tax issues. Consider an employer-of-record (EOR) for anyone who is really an employee. **[VERIFY – tax advisor, South Africa/Pakistan]**

**How to handle contractors:**

| Area | Employees | Contractors |
|---|---|---|
| Gmail capture | HBS Workspace account, mandatory (with exclusions) | Only if they use an HBS-issued account. Scope it to HBS project mail. Never their own business email. |
| Slack | Channels mandatory; DMs opt-in | Project channels only (consider guest/single-channel access). **No DMs.** |
| Time Doctor | Time and activity; screenshots blurred/limited or off | **Time logging for billing only** (or their own invoices). **No screenshots, no activity scores.** |
| Hours | Set by HBS | Set by the contractor. HBS sets deadlines and deliverables. |
| Devices | HBS device preferred | Their own device. **No monitoring software on personal devices.** Use web access to HBS systems. |
| Consent | Policy + acknowledgment | **Contract clause** + acknowledgment, scoped narrower ("HBS systems you choose to use for HBS work") |
| Tasks | AI assigns and tracks | AI creates *deliverable* tickets. No minute-by-minute oversight. |

If you find you need to monitor a "contractor" like an employee, that's a sign they should be reclassified (or hired through an EOR).

---

## 5. Never-touch list and how to enforce it

**The never-touch categories:**

1. HR matters: complaints, grievances, investigations, discipline, performance reviews, accommodation requests.
2. Health and medical information, sick notes, disability, family medical matters, and any PHI.
3. Pay and benefits: individual salary, payroll, bank details, tax forms, loans, garnishments. Also workers discussing pay with each other (protected in the US).
4. Personal messages: family, personal finances, religion, politics, union or worker-organizing activity, dating.
5. Legal disputes and privileged communications: anything with lawyers (HBS's or the worker's), legal threats, regulators, whistleblowing.
6. **Private messages between George and an employee** (by default, excluded entirely, in both directions).

**Enforcement layers (strongest first):**

| Layer | How | Example |
|---|---|---|
| **1. Don't connect it** | Exclude whole sources at the connector | No Slack DMs (Option B). No DMs where George is a participant, ever. Exclude `hr@`, `payroll@`, `legal@` and George↔employee 1:1 email threads by participant rule. Exclude private channels named `#hr-*`, `#private-*`, `#rcm-*`. |
| **2. Participant/domain blocklist** | Drop messages to or from listed domains and addresses before storage | Payroll/HRIS vendors, benefits, health providers, insurers, law firms, the Information Regulator, personal-email domains (gmail.com, yahoo.com, outlook.com), unless whitelisted for a known client. |
| **3. Label/flag opt-out** | Workers can mark items private | A Gmail label `Private-NoDPCP` excluded from the DWD query. A Slack emoji or shortcut ("Hide from DPCP") that deletes the item from DPCP within minutes. |
| **4. AI/keyword classifier** | Pre-storage classifier flags HR, health, pay, legal and personal content and **drops** it (doesn't just hide it) | "doctor," "diagnosis," "salary," "lawyer," "grievance," "harass*," ID/bank-number patterns, PHI patterns |
| **5. Access control** | Even if something slips through, nobody routinely reads raw content (§8) | Break-glass only |
| **6. Audit and correction** | Monthly sample review of drop/keep accuracy, by the Information Officer only, looking at metadata | Tune the rules |

**Limits (be honest about these in the policy):**

- Classifiers miss things. Health or pay details mentioned in the middle of a work thread will sometimes get through, so the policy must say *"we try to exclude; if we find it, we delete it and won't use it."*
- The AI has to *read* a message to classify it. Even with transient processing, that is still "processing" under POPIA, so disclose it.
- **Native admin tools sidestep DPCP OS entirely.** As Workspace super admin you can use Vault to read any mailbox, and Slack owners can apply for full exports. The never-touch commitment must therefore **also bind George and IT's use of Google Vault, Gmail admin and Slack admin tools.** Put that in the policy.
- External senders don't know your rules, so personal content will arrive in work inboxes.
- Excluding George↔employee messages means DPCP OS won't turn your own requests in those threads into tasks. Ask staff to repost work requests in a channel.

---

## 6. Jurisdiction table

| | **US federal** | **Arizona** | **Other US states** | **South Africa** | **Pakistan** |
|---|---|---|---|---|---|
| **Key law** | ECPA/Wiretap Act; SCA; NLRA § 7 | A.R.S. §§ 13-3005, 13-3012(9) | NY Civ. Rights § 52-c; CT § 31-48d; DE § 705; all-party-consent states; CCPA | POPIA (Act 4 of 2013); RICA (Act 70 of 2002); Constitution s 14; LRA | PECA 2016; Constitution Art. 14; PDP Bill (draft, not enacted) |
| **Notice or consent?** | One-party consent or business-use exception; consent recommended | **One-party consent** (no business-extension exemption found) | Written notice + acknowledgment (NY/CT/DE); all-party consent in some states | **Both**: s 18 notice + s 11 justification; RICA s 5 written consent or s 6 advance notice | Written authorization (avoids "unauthorized" under PECA) |
| **Work Gmail** | OK with policy + consent | OK with consent | OK with notice | OK if proportionate + notified | OK with contract clause |
| **Slack DMs** | Moderate risk; user consent | Consent covers it | Higher risk in all-party states | **High risk**: minimality + special PI | Moderate/uncertain |
| **Screenshots** | Low-moderate; NLRA chill | Low; webcam off (§ 13-3019) | Notice laws apply | **High**: special PI; s 71 profiling | Moderate; dignity/privacy |
| **Data rights** | None general | None general | CCPA if thresholds met | Access, correction, deletion, objection, complaint | None enforceable yet (honor voluntarily) |
| **Cross-border** | n/a | n/a | n/a | s 72 safeguards; s 57 if special PI | None yet; watch draft bill localization |
| **Contractor risk** | IRS/DOL control tests | § 23-1601 declaration | ABC test (e.g., CA) | LRA s 200A presumption | Substance over label |
| **Counsel?** | Light review | Light review | Only when someone moves | **Required before go-live** | **Recommended** |

---

## 7. Retention, deletion, access requests and legal holds

**Retention schedule (proposed; confirm with counsel):**

| Data | Where | Retention |
|---|---|---|
| Raw message bodies ingested into DPCP OS | DPCP OS | **30 days** (B) / not stored (C) / max 90 days |
| Task records (title, excerpt ≤300 chars, source link, status) | DPCP OS | Life of the task + 2 years |
| Opt-in DM threads | DPCP OS | Same as raw messages |
| Time Doctor time records (hours worked/billed) | Time Doctor / payroll | **≥3 years.** US FLSA keeps payroll records 3 years and time cards 2 years; SA's BCEA (Basic Conditions of Employment Act) s 31 keeps time and pay records 3 years. **[VERIFY – licensed attorney, US/SA/Pakistan]** |
| Time Doctor screenshots | Time Doctor | **7–14 days**, then auto-delete |
| Activity scores | Time Doctor | 90 days; not used alone for decisions |
| Audit logs (access, break-glass, exports) | DPCP OS (append-only) | 3 years |
| Source email and Slack | Google / Slack | Governed by your Vault and Slack retention settings. Set them deliberately (e.g., 3–7 years for business email per counsel). |

**Departing workers:**
- Disconnect all connectors on the last day.
- Revoke Slack tokens and remove the user from DWD scope.
- Purge their raw messages and screenshots from DPCP OS within 30 days, unless a legal hold applies.
- Keep task records and time records per the schedule.
- Hand over business email through normal Workspace offboarding.
- Send SA workers written confirmation if they ask.

**Access and deletion requests:**
- **South Africa (POPIA ss 23–25 / PAIA):** Respond within the PAIA timeframe (generally 30 days). **[VERIFY – licensed attorney, South Africa]** Give the worker their data, and correct or delete it where retention isn't justified. Record objections (s 11(3)) and decide them in writing.
- **Pakistan and the US:** No general statutory right (unless CCPA applies). **Offer the same process voluntarily.** It's cheap and builds trust.
- **Third-party content:** a response may include other people's messages. Redact them first.

**Legal holds:**
- When litigation, a regulator inquiry or a serious internal investigation is *reasonably anticipated*, suspend deletion for the relevant people and date range.
- Use **Google Vault holds** and Slack legal holds (Enterprise) or export, plus a DPCP OS "hold" flag that stops auto-purge.
- Document who ordered the hold, its scope and when it was released.
- Holds override the schedule above. **[VERIFY – licensed attorney, US]** (US duty-to-preserve rules are strict; destroying data after a duty arises is sanctionable.)

---

## 8. Who can read stored messages

| Role | Can see | Cannot see |
|---|---|---|
| **The worker** | Their own tasks, their own ingested items, and a "what DPCP has about me" page | Others' items |
| **Team lead / manager** | Tasks for their team: title, short excerpt, status, source link (opening the link uses the normal Gmail/Slack permissions, so they only see what they could already see) | Raw stored bodies; screenshots of others (unless an employee screenshot review is enabled, which isn't recommended) |
| **George (owner)** | All tasks and dashboards; time totals | Raw bodies without break-glass; never-touch categories |
| **IT/admin** | System health, connector status, metadata, logs | Message content (enforce with encryption and role separation) |
| **AI pipeline** | Message content, transiently, to create tasks and run filters | No training on HBS data (vendor contract); no use of outputs as sole basis for decisions (POPIA s 71) |
| **Break-glass reviewer** | Specific content, for a specific person, date range and reason | Anything outside the approved scope |

**Break-glass procedure:**
1. Written request with a reason code: security incident, fraud, harassment complaint, client dispute, legal hold or legal demand.
2. Two-person approval: George plus a named second approver (a senior HR/ops person, or outside counsel for anything involving George personally).
3. Time-boxed (e.g., 72 hours) and limited by scope (person, date range, source).
4. Every view, search and export logged to an **append-only audit log** the approvers can't edit.
5. Where safe and lawful, tell the affected worker afterward.
6. Quarterly review of all break-glass events by the Information Officer.
7. **Conflict rule:** if the matter involves George, George can't be an approver. Outside counsel decides.

---

## 9. Do you need outside counsel? Yes, scoped like this

| Jurisdiction | Needed? | Why | Rough scope |
|---|---|---|---|
| **South Africa** | **Yes, before SA go-live** | POPIA applicability to a foreign employer; s 11 basis; s 57 prior authorisation; s 72 transfer mechanism; Information Officer registration; RICA s 5/s 6 fit for API capture; LRA s 200A for contractors; PAIA manual | Review the policy and form, a short written opinion, Regulator registration |
| **Pakistan** | **Recommended** | PECA "authorization" wording; provincial labour law; contractor status; PDP Bill status at go-live | Review contract clauses and the form; one-page memo |
| **Arizona / US federal** | **Recommended (light)** | Consent wording; SCA provider question; NLRA language; contractor agreements (§ 23-1601); retention | 1–2 hour review of the policy, form and contractor template |
| **Other US states** | Only when a worker relocates | Notice laws / all-party consent / CCPA | Per state |
| **HIPAA** | **When RCM goes live** | BAAs, PHI boundary, vendor eligibility | RCM add-on review |

---

## 10. DRAFT: HBS Monitoring & Data Policy (DPCP OS)

*Template. Adapt after counsel review. Bracketed items are choices for George. This text follows Option B.*

### HBS Workplace Systems Monitoring & Data Policy

**Version:** [1.0] **Effective:** [date] **Owner:** George Hariri, Information Officer

**1. Why we have this policy**
HBS runs its operations through an internal system called **DPCP OS**. DPCP OS reads work communications on HBS systems and turns work requests into tasks, so nothing gets dropped and clients are served on time. This policy explains exactly what we collect, why, who can see it, how long we keep it and your rights. We collect the minimum we need.

**2. Who this covers**
Everyone who uses HBS systems: employees, independent contractors, interns and temporary workers, wherever they're based (including the United States, South Africa and Pakistan). Section 9 sets narrower rules for contractors.

**3. Which systems are covered**
- **HBS Google Workspace email** (your @[hbs-domain] account).
- **HBS Slack**: public and private *channels* you belong to.
- **Slack direct messages: NOT collected**, unless you choose to send a specific message or thread to DPCP OS using the "Send to DPCP" shortcut. [If George picks A: replace with DM collection language.]
- **Time Doctor** (employees): time worked, project and task time, app and website activity [and blurred screenshots taken at intervals during tracked work time, deleted after [14] days]. **Webcam, photo and audio features are off.**
- **We never access your personal accounts** (personal email, personal WhatsApp, personal social media), even if you use them on an HBS device.

**4. What we use the data for (and nothing else)**
a. Creating and tracking work tasks (AI triage).
b. Recording time worked for payroll, billing and client reporting.
c. Keeping HBS systems secure and detecting unauthorized use.
d. Investigating specific, serious concerns (for example, fraud, a security incident, harassment or a client dispute) under the break-glass procedure in section 7.
e. Meeting legal obligations, including legal holds and lawful requests.

We do **not** use DPCP OS data to train AI models, sell data or make automated decisions about discipline, pay or dismissal. People make those decisions, and you'll have the chance to respond.

**5. Never-touch categories**
We design DPCP OS to **exclude, and if found, delete** the following without using it:
- HR matters (complaints, grievances, investigations, performance reviews, accommodations)
- Health and medical information
- Individual pay, bank and tax details, and conversations between workers about pay or working conditions
- Personal messages (family, personal finances, religion, politics, union or worker-organizing activity)
- Communications with lawyers, about legal disputes, with regulators, or whistleblowing reports
- Private one-to-one messages between you and George Hariri

How: we exclude certain sources entirely, block certain senders and domains, let you mark items private (Gmail label "Private-NoDPCP"; the Slack "Hide from DPCP" shortcut), and use an automatic filter. **These tools aren't perfect.** If excluded content gets through, it'll be deleted once found and won't be used against you. These commitments also apply to HBS's use of Google and Slack administrator tools.

Please use HBS systems for work. Keep personal matters on personal accounts and devices.

**6. How the AI works**
The AI reads incoming work messages to decide whether they contain a task and whether they fall into a never-touch category. It creates a task with a short excerpt and a link to the original. Raw message text is stored for up to [30] days, then deleted. You can see, correct or dismiss tasks created from your messages.

**7. Who can see what**
- **You:** your own tasks and the data DPCP OS holds about you.
- **Your manager:** tasks for your team (title, short excerpt, status, link).
- **George Hariri:** all tasks and time reports.
- **IT:** system operation only, not message content.
- **Break-glass:** no person reads stored message content routinely. Reading specific stored content needs a written reason, approval from two named people, and a time and scope limit, and every access is logged. If the matter involves George, outside counsel decides instead. Where safe and lawful, we'll tell you afterward.

**8. How long we keep data**
| Data | Kept for |
|---|---|
| Raw message text in DPCP OS | [30] days |
| Tasks | Life of task + 2 years |
| Time records | [3] years (or longer if the law requires) |
| Screenshots (if enabled) | [14] days |
| Activity scores | 90 days |
| Access/audit logs | 3 years |

When you leave HBS, we disconnect DPCP OS on your last day and delete your raw message data and screenshots within 30 days, unless a legal hold applies. **Legal holds:** if litigation or an investigation is expected, we may preserve relevant data beyond these periods until the hold is lifted.

**9. Contractors**
If you're an independent contractor:
- DPCP OS only covers HBS-issued accounts and the HBS Slack channels for your projects.
- **No DMs. No screenshots. No activity scores.**
- Time Doctor (if used) records time for invoicing only.
- **No monitoring software will be installed on your personal device.**
- HBS sets deliverables and deadlines, not your working methods or hours.

**10. Where data is stored and transferred**
DPCP OS and its service providers ([Google, Slack, Time Doctor, [AI vendor], [hosting provider]]) store and process data in the **United States** and possibly other countries. Each provider is bound by a written agreement requiring confidentiality and security protections at least equivalent to those required by South Africa's POPIA. **[VERIFY – SA counsel]**

**11. Security**
Encryption in transit and at rest, role-based access, restricted administrator credentials, audit logging and breach response. We'll notify affected people and regulators as the law requires.

**12. Your rights**
You can:
- ask what data we hold about you and get a copy;
- ask us to correct or delete it (unless we must keep it);
- object to processing based on HBS's legitimate interests;
- mark items private;
- complain to us or, if you're in South Africa, to the **Information Regulator (South Africa)**: [insert current contact details: website, complaints email, physical address. **VERIFY before issuing**].

Contact the Information Officer: George Hariri, [email], [address]. We respond within 30 days.

**13. Mandatory participation**
Using DPCP OS for HBS work accounts is a condition of working with HBS, because it's how work is assigned and tracked. If you don't sign the acknowledgment, we can't activate your HBS accounts. Saying no to the *optional* items (sending DMs to DPCP OS) has no consequences.

**14. Moving location**
Tell HBS **before** you start working from a different state or country. Different notice rules may apply there.

**15. Changes**
We'll give at least [14] days' written notice of material changes and ask for a new acknowledgment where the law requires it.

**16. Breaches of this policy**
Misusing DPCP OS or monitoring data (including by managers) is a disciplinary matter.

---

## 11. DRAFT: Acknowledgment and Consent Form

*To be signed (wet ink or e-signature) **before** any DPCP OS connector, Slack authorization or Time Doctor install is activated. IT may pre-create accounts but must not activate collection until this form is signed. For South African workers it's written to serve as the POPIA s 18 notification and the RICA s 5 prior written consent. **[VERIFY – licensed attorney, South Africa]** For Pakistani workers it's written to serve as written authorization for PECA purposes. **[VERIFY – licensed attorney, Pakistan]***

### HBS DPCP OS: Acknowledgment, Notice and Consent

**Worker name:** ____________ **Role:** ____________ **Country/state of work:** ____________
**Status:** ☐ Employee ☐ Independent contractor ☐ Other: ______

**Part 1: Notice (what HBS collects and why)**
I confirm I received and read the HBS Workplace Systems Monitoring & Data Policy, version [1.0], dated [date], and that HBS has told me the following:

1. **Who is collecting:** Hariri Business Services, [legal entity name], [address], Arizona, USA. Information Officer: George Hariri, [email].
2. **What is collected and from where:** messages in my HBS email account; messages in HBS Slack channels I belong to; Slack direct messages **only** if I choose to send them; Time Doctor time and activity data [and blurred screenshots during tracked time] **[employees only]**; and system access logs. HBS collects this from HBS's own systems and its service providers, not from my personal accounts.
3. **Purpose:** task creation and tracking; time recording for payroll and billing; security; specific investigations under the break-glass procedure; legal compliance and legal holds.
4. **Mandatory or voluntary:** using DPCP OS with my HBS work accounts is **mandatory** to work with HBS. Sending DMs to DPCP OS is **voluntary**.
5. **Consequence of not agreeing:** HBS can't activate my work accounts, and I may not be able to perform the role.
6. **Legal basis:** performing my employment/service contract, HBS's legitimate business interests, legal obligations (for example, time and payroll records), and, where required by law, my consent below.
7. **Recipients:** authorized HBS personnel under role-based access, and HBS's service providers (Google, Slack, Time Doctor, [AI vendor], [hosting provider]), each under a confidentiality and security agreement.
8. **Cross-border transfer:** my data will be stored and processed in the **United States** and possibly other countries, which may not have the same data-protection laws as my country. HBS protects it through written agreements with its providers.
9. **Never-touch categories and limits:** HBS designs DPCP OS to exclude HR, health, pay, personal, legal and private George-to-worker messages, and to delete such content if found. I understand the filters aren't perfect.
10. **AI and decisions:** AI creates tasks from messages. No decision about discipline, pay or dismissal will be based solely on automated processing.
11. **Retention:** as set out in the policy (raw messages [30] days; screenshots [14] days; time records [3] years; audit logs 3 years), subject to legal holds.
12. **My rights:** to access, correct or delete my information, to object, and to complain to HBS's Information Officer. **South African workers:** you may complain to the **Information Regulator (South Africa)**: [contact details – VERIFY before issuing].

**Part 2: Consent and authorization**
*(Tick each box. Boxes A–D are required to activate HBS accounts. Box E is optional.)*

☐ **A. Monitoring of HBS work systems.** I consent to, and authorize, HBS and its service providers accessing, copying, storing and processing communications sent or received through my HBS email account and HBS Slack channels, as described in the policy.

☐ **B. Interception consent (all workers; specifically South Africa, RICA s 5).** I give my **prior written consent** to HBS, as system controller, and its authorized service providers to intercept, monitor and record indirect communications I send or receive over HBS telecommunication systems (HBS email and HBS Slack channels) for the purposes listed in Part 1. This consent applies from the date I sign until it's withdrawn in writing or my engagement ends.

☐ **C. Authorization of access (US SCA, Arizona A.R.S. § 13-3012(9), Pakistan PECA).** As a user of and party to these communications, I authorize HBS to access my HBS accounts' stored communications for the purposes above. I understand HBS will **not** access any personal account.

☐ **D. Time Doctor [employees].** I consent to Time Doctor recording my time and activity [and blurred screenshots] **only during tracked work time**, on [HBS-issued device / work profile]. Webcam, photo and audio features are disabled.
*[Contractors: replace with:]* ☐ **D-C. Time logging [contractors].** I agree to log time in Time Doctor for invoicing. I understand there will be no screenshots, no activity scores and no software on my personal device.

☐ **E. Optional: Slack DMs.** I understand I can send individual Slack DM threads to DPCP OS using "Send to DPCP." I'll only do this for work matters, and I'll make sure the other person agrees to their messages being sent.

**Part 3: Acknowledgments**
☐ I'll use HBS systems for HBS work and keep personal matters on personal accounts.
☐ I'll tell HBS before I start working from a different state or country.
☐ I'll keep patient health information (PHI) out of general email and Slack channels and use only approved RCM channels.
☐ I understand that withdrawing consent B or C may mean HBS can't continue my engagement in roles that require these systems. Withdrawing it doesn't affect processing done before withdrawal.
☐ *(Contractors)* I confirm I'm an independent business. I decide how, when and where I do the work, and HBS sets deliverables and deadlines.

**Signature:** ____________ **Date:** ____________
**Received for HBS (name/title):** ____________ **Date:** ____________

*Keep the signed form for the length of the engagement + [5] years. Give the worker a copy.*

---

## 12. Outside counsel checklist

**South Africa (privacy + labour lawyer) – before SA go-live**
- [ ] Does POPIA apply to HBS (Arizona entity) as a responsible party "using means in the Republic"? Should HBS use a local entity or EOR?
- [ ] Is s 11(1)(b)/(f) the right basis, with consent only as backup? Does mandatory consent hold up?
- [ ] Does Option B pass the s 10 minimality test? Do blurred screenshots?
- [ ] Is prior authorisation (s 57) triggered by any part of the design (e.g., special PI to the US, unique identifiers)?
- [ ] What's the right s 72 transfer mechanism for Google, Slack, Time Doctor, the AI vendor and the host? Are the providers' standard DPAs enough?
- [ ] Registering the Information Officer and deputies with the Regulator; PAIA manual requirement.
- [ ] Does RICA s 5 and/or s 6 apply to API retrieval of stored Gmail/Slack data? Is the consent wording sufficient?
- [ ] s 71 safeguards for AI tasks and Time Doctor scores.
- [ ] Contractor status under LRA s 200A and the Code of Good Practice; UIF/tax exposure.
- [ ] Will monitoring evidence be admissible in CCMA/Labour Court proceedings?
- [ ] Information Regulator contact details for the notice.

**Pakistan (employment + cyber-law lawyer)**
- [ ] Confirm the PDP Bill is still not enacted at go-live. What's expected, and is there a localization risk?
- [ ] Confirm the PECA interception and unauthorized-access section numbers, and that written authorization is enough.
- [ ] Article 14 implications for private employers.
- [ ] Applicable provincial labour law (Sindh/Punjab, etc.) and standing orders; consent clauses in contracts.
- [ ] Contractor/freelancer classification; tax and permanent-establishment questions.

**Arizona / US federal (employment lawyer)**
- [ ] Is the consent wording sufficient under A.R.S. §§ 13-3005/13-3012(9), the Wiretap Act and the SCA?
- [ ] SCA "provider" exception for cloud-hosted Workspace and Slack.
- [ ] NLRA § 7: policy wording; protecting pay and working-condition discussions.
- [ ] Contractor agreement template; whether to use the A.R.S. § 23-1601 declaration; IRS/DOL control risk.
- [ ] FLSA recordkeeping for time data; retention and legal-hold procedure.
- [ ] Notice requirements if a worker moves (NY, CT, DE, CA, all-party-consent states).

**Platform / vendor (counsel or IT + vendor)**
- [ ] Google Workspace terms: end-user consent responsibilities; DWD scope; internal-app status.
- [ ] Slack API Terms: confirm the internal app's DM handling doesn't "undermine access controls." Slack plan level for exports and legal holds.
- [ ] Time Doctor: DPA, data location, blur/disable settings, screenshot retention controls.
- [ ] AI vendor: DPA, no training, data location, retention, subprocessors.

**HIPAA (when RCM add-on launches)**
- [ ] BAAs with Google, Slack (eligible plan), the AI vendor, Time Doctor (or exclude RCM roles), and clients.
- [ ] Technical separation of RCM channels and accounts from core DPCP OS.

---

## 13. Immediate next steps (no legal risk to do now)

1. Choose an option in the decision table (§1).
2. Change the onboarding sequence: sign the form → activate connectors → worker authorizes Slack (not IT on their behalf).
3. Turn off Time Doctor webcam, photo and audio features now. Blur screenshots or turn them off; set retention to ≤14 days; turn off screenshots for contractors.
4. Build the exclusions (layers 1–3 in §5) before ingesting any data.
5. Sign DPAs with all vendors; confirm the AI vendor won't train on your data.
6. Book the South African counsel review; send them this memo, the policy and the form.
7. Re-check Pakistan's PDP Bill status the week before Pakistan go-live.

---

### Sources checked (October 3, 2026)
- Arizona Legislature: A.R.S. § 13-3005 and § 13-3012 (azleg.gov)
- POPIA s 57 (acts.co.za); Information Regulator POPIA FAQ and Guidance Note on Prior Authorisation (inforegulator.org.za); SciELO SA article on s 72 cross-border flows (2024)
- RICA s 6 text (saflii.org; acts.co.za; internet.org.za)
- Senate of Pakistan bill summary, PDP Bill 2023 (senate.gov.pk); ICLG Data Protection 2026 – Pakistan; Chambers Data Protection & Privacy 2026 – Pakistan; PECA 2016 bill text (na.gov.pk)
- Slack: "Export your workspace data," "Guide to Slack import and export tools," Data Management, Discovery API guide; Slack API Terms of Service (effective Oct 10, 2025); Slack changelog, May 29, 2025
- Case citations (*Konop*, *Fraser*, *Stengart*, *Benazir Bhutto*) are from general knowledge and were **not** re-checked against primary sources. **[VERIFY – licensed attorney]**
