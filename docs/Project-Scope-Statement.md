# CarePath — Project Scope Statement

**Project Name:** CarePath
**Team:** Demond Balentine (Project Lead / Backend), Michelle Berthiaume (Design / Frontend), Remington Neustadter (Technical Support / Troubleshooting)
**Program:** Atlas School Capstone — Builders+Backers Mobility Cohort
**Demo Day:** August 13, 2026
**Document Owner:** Demond Balentine (PM)
**Last Updated:** July 16, 2026

---

## 1. Project Purpose and Business Need

### Business Need

Patients in rural and low-income areas — particularly those managing dialysis, oncology, cardiology, and post-surgical care — routinely miss critical medical appointments because they have no reliable way to get to them. Across 15 stakeholder validation interviews (13 producing strong signal), the team confirmed a consistent, cross-role pattern:

- **Patients** rely on Medicaid transport, family members, or volunteers — all of which fail unpredictably (case studies #2, #3, #7).
- **Caregivers and clinical staff** (CNAs, RNs, home health aides) absorb the coordination burden manually, with no shared tools or visibility (case studies #4, #5, #6, #9, #10, #11).
- **Drivers** (volunteer and NEMT) operate with no visibility into patient needs, accessibility requirements, or schedule changes, causing wasted trips and cascading delays (case study #1, #12).
- **Clinics and institutional partners** want to help coordinate rides but have no shared communication or scheduling layer, resulting in duplicated verification work and fragmented handoffs (case studies #13, #14, #15).

The consequence of these failures is missed appointments, delayed treatment, avoidable ER visits, and health deterioration — problems that are not caused by lack of willingness to attend care, but by lack of coordination infrastructure.

### Expected Outcome

CarePath is a transportation coordination platform — not a ride-hailing app — that gives patients, volunteer/NEMT drivers, care coordinators, and institutional partners a shared system to request, match, confirm, and track medically necessary rides, with an automatic fallback path when a ride falls through. The capstone deliverable is a working, demo-ready product that proves this coordination loop end-to-end and is backed by documented stakeholder validation.

### Project Objective

Deliver a functioning web application (API + mobile-first UI) by **August 13, 2026** that demonstrates the full ride lifecycle — patient intake, coordinator matching/assignment, fallback escalation, driver ride completion, and post-ride outcome capture — using real authentication and a seeded demo dataset, deployed and accessible on a mobile device for live demonstration.

---

## 2. Project Boundaries

CarePath's capstone scope is bounded to what can be built, tested, and reliably demonstrated by three team members between July 14 and August 13, 2026, on top of an already-completed database schema, authentication system, and initial UI design system. The boundary is drawn around **one coordination workflow** (request → match/assign → confirm → complete → survey, with fallback as an alternate path) rather than a full multi-sided marketplace, billing platform, or clinical records system.

Anything that requires production-scale user acquisition, real payment processing, real SMS carrier costs at scale, regulatory certification (e.g., HIPAA audit, NEMT broker licensing), or integration with third-party systems the team does not control (EHRs, Medicaid billing) is outside this boundary and is explicitly out of scope for the capstone (see Section 4).

---

## 3. In Scope

| Area | Description | Justification |
|---|---|---|
| **Authentication** | Register/login (Patient, Driver, Coordinator roles), JWT-based session, `/me` endpoint | Required foundation for every other workflow; already built and must be demo-stable |
| **Patient ride intake** | Patient submits a ride request with pickup/dropoff, urgency level, accessibility needs (wheelchair, oxygen, stretcher), and scheduling constraints | Directly validated pain point (case studies #2, #3, #7, #8); core entry point to the coordination loop |
| **Coordinator pooling hub** | Coordinator views pending ride requests, sees matched/candidate drivers filtered by accessibility and availability, assigns a driver, and can combine rides going to the same destination | Addresses the manual, phone/text-based coordination burden documented in case studies #1, #4, #9 |
| **Fallback escalation** | When a ride cannot be filled or falls through, the system flags it `FALLBACK_NEEDED`, logs a `RideEvent`, and (where configured) sends an SMS notification | Directly validated as the single highest-impact gap — "no backup when transport fails" (case studies #2, #7, #15) |
| **Driver ride lifecycle** | Driver dashboard shows assigned rides, availability toggle, and status transitions `CONFIRMED → IN_PROGRESS → COMPLETED` | Confirms the loop closes; needed for demo narrative and reliability data |
| **Coordinator/patient status visibility** | Ride status badges and dashboard stat cards (pending, matched, fallback, completed counts) | Addresses "no shared timeline" pattern (case studies #1, #12, #14) |
| **Post-ride survey (NPS)** | Patient submits a 0–10 NPS score and comment after ride completion | Produces the outcome data referenced in validation messaging and demo narrative |
| **Communication logging** | Every SMS send/receive tied to a ride is recorded in `CommunicationLog` | Supports the "no shared communication trail" finding and demo transparency |
| **Seed data and demo scenarios** | Script-generated demo dataset covering standard assignment, wheelchair-accessible match, and fallback escalation | Required so the live demo works reliably regardless of network/API conditions |
| **Mobile-first UI/UX** | Responsive design tested at 375px–390px widths, role-based navigation, existing `cp-` design system and brand palette | Team's primary user base accesses via phone; already a stated design constraint |
| **Deployment** | Next.js static export on AWS Amplify; Node/Express API reachable for the live demo | Needed for a working, presentable Demo Day build |

---

## 4. Out of Scope

| Area | Description | Justification |
|---|---|---|
| **Real payment processing** | Live charge/payout via a payment processor (Stripe, etc.) for ride credits or driver compensation | `PaymentAuthorization`/`RidePayment` models exist in schema for future use, but wiring a live payment gateway carries compliance and cost risk with no capstone-timeline benefit; demo uses simulated/mock payment states only |
| **SMS at production scale / paid carrier accounts** | Sending real SMS to a broad user base via a paid Twilio account beyond limited demo/test numbers | Cost and carrier-compliance overhead not justified for a 4-week demo build; SMS logic is built and testable, but is not scaled or hardened for production traffic |
| **HIPAA / compliance certification** | Formal HIPAA risk assessment, BAAs with vendors, security audit, penetration testing | Requires legal, compliance, and infrastructure investment far beyond a 3-person, 4-week academic capstone; the app avoids storing sensitive clinical data (diagnoses, treatment records) to reduce exposure, but is not certified for real PHI |
| **EHR / clinic system integration** | Webhook or API integration with a clinic's electronic health record system to confirm visit completion | Identified as a "wild idea" (QR check-in, EHR webhook) but requires third-party partnerships and data-sharing agreements outside the team's control |
| **Medicaid billing/reimbursement automation** | Auto-generating reimbursement documentation tied to Medicaid billing codes | Requires domain-specific regulatory knowledge and payer integration not available within the capstone timeline |
| **Depot route builder / recurring community van routes** | Coordinator tool to schedule recurring group routes (e.g., weekly dialysis van) | Valuable long-term idea from brainstorming, but not on the critical path to the core request → match → complete loop; deferred post-capstone |
| **Driver reliability score / gamification** | Calculated reliability scores, badges, leaderboards | Nice-to-have differentiation identified in brainstorming; not required to prove the core coordination workflow and is deferred if time allows, not committed |
| **Caregiver companion / shareable ride-tracking link** | Family member real-time ride tracking via a public shareable link | Introduces additional auth/privacy surface area (unauthenticated access to ride data); descoped to protect the timeline and reduce security risk |
| **Voice-call fallback / SMS-only full patient workflow** | Automated voice confirmation calls; complete non-smartphone patient journey via SMS only | Valuable accessibility idea, but a second full interaction channel doubles QA and support surface; UI-based flow is the committed channel for the demo |
| **Community impact / public-facing dashboard** | Public embeddable dashboard showing aggregate rides completed and appointments kept | Marketing/growth feature for post-demo fundraising use, not required to demonstrate the core product loop |
| **Native mobile apps (iOS/Android)** | App Store or Play Store distributed native apps | Team is shipping a mobile-first responsive web app only; native app development is a distinct, larger effort outside the 4-week window |
| **Multi-county / multi-tenant scaling** | Supporting many simultaneous counties, organizations, or white-labeled deployments | Demo and validation scope is a single coordination workflow proven with seeded data, not a scaled multi-tenant SaaS rollout |
| **Automated user acquisition / onboarding at scale** | Self-serve signup flows for new organizations, marketing site, sales pipeline | Outside a technical capstone's deliverable; the team's validation and outreach work (interviews, LinkedIn post) is a separate track from the product build |

---

## 5. Constraints

Constraints are limitations imposed on the team that restrict how the solution can be built — they are not choices the team can change.

- **Fixed deadline:** Demo Day is August 13, 2026. All scope decisions are made against this fixed date, not the other way around.
- **Team size and skill mix:** Three team members (1 PM/backend lead, 1 frontend/design, 1 technical support), each also carrying other coursework/cohort obligations. No dedicated QA, security, or DevOps role.
- **Inherited codebase:** The Prisma schema, auth system, and initial UI design system are already built and must be treated as the starting foundation; scope is defined around completing and wiring what exists, not redesigning it mid-project.
- **No production infrastructure budget:** Free/low-cost tiers only (AWS Amplify, local/managed PostgreSQL, limited Twilio trial credit) — this caps SMS volume and any paid third-party integration.
- **Academic/cohort structure:** Weekly Friday milestone gates (from the Capstone Project Plan) are pass/fail; if a milestone slips, the PM must cut scope for the following week rather than extend the deadline.
- **Data sensitivity:** Because the product touches health-adjacent scheduling data, the team must avoid storing actual PHI/clinical details, which constrains what fields and integrations (e.g., EHR) can be built.
- **Device/network assumption for demo:** Demo must work on a mobile device, potentially on unreliable venue Wi-Fi, which constrains the team to build a seeded-data fallback for every screen.

---

## 6. Assumptions

Assumptions are conditions the team believes to be true but cannot control or guarantee.

- The Builders+Backers Mobility Cohort program dates and Demo Day (August 13, 2026) will not change.
- AWS Amplify and the team's PostgreSQL hosting will remain available and stable through the demo period at no unplanned cost.
- Twilio (or an equivalent SMS provider) trial/limited credentials will remain sufficient for demo-scale SMS testing without requiring a paid upgrade.
- The 15 validation interviews and 13 strong signals already gathered are sufficient to support the product narrative; no additional primary research is required before Demo Day.
- Team members' availability will match the Weekly Schedule in the [CAPSTONE-PROJECT-PLAN.md](../docs/CAPSTONE-PROJECT-PLAN.md) — no unplanned extended absences.
- The existing Prisma schema models (RideRequest, FallbackOffer, DepotRoute, RideCredit, PaymentAuthorization, SurveyResponse, CommunicationLog, etc.) are correct and complete enough that the team will not need schema-breaking changes during the build.
- Stakeholder feedback gathered during validation (case studies) remains representative of the target user base and does not require re-validation mid-build.
- No new regulatory requirement (e.g., a state NEMT rule) will apply to a non-production capstone demo.

---

## 7. Business Processes Impacted

- **Patient care coordination:** Replaces ad hoc phone/text-based ride coordination between patients, caregivers, and clinics with a single tracked request-and-status workflow.
- **Coordinator dispatch workflow:** Changes how a clinic or nonprofit coordinator triages pending rides, matches drivers, and escalates failures — from manual phone calls to a pooling hub with structured fallback.
- **Driver scheduling and confirmation:** Introduces a structured accept/status-update flow for volunteer and NEMT drivers in place of informal scheduling.
- **Outcome/quality tracking:** Introduces a post-ride survey step that did not previously exist in the stakeholders' workflow, creating the first structured feedback loop tied to a completed ride.
- **Communication audit trail:** Introduces logging of ride-related SMS communication, where none currently exists across the validated stakeholder group.

---

## 8. Internal and External Interfaces

### Internal (within the project team / Atlas School program)

- **PM ↔ Backend/UI:** Weekly Friday milestone gate reviews, GitHub project board issue tracking, PR review and merge process (owned by Demond).
- **Backend ↔ UI:** Shared REST API contract (`src/routes/`, `src/controllers/`) consumed by the Next.js UI (`carepath-ui/src/app/`); both must stay in sync on request/response shapes.
- **Atlas School / Builders+Backers Cohort:** Weekly milestone check-ins, Demo Day presentation requirements, and slide deck expectations.

### External (outside direct team control)

- **AWS Amplify:** Hosting/deployment platform for the UI; team depends on its build and deploy pipeline being available.
- **PostgreSQL hosting provider:** Database availability for both local development and any deployed instance.
- **Twilio (or equivalent SMS provider):** Third-party SMS delivery for reminders and fallback notifications; team depends on trial/limited account limits.
- **Validation interview participants** (patients, RNs, CNAs, drivers, clinic operations staff, NEMT business contacts — case studies #1–#15): Source of the product requirements and demo narrative; no further access to their systems is required or assumed.
- **Healthcare admin advisor (Chicago-area, informal advisor):** Provides operator perspective on go-to-market and pilot strategy; not a formal project stakeholder with sign-off authority, but consulted for validation credibility.

---

## 9. Scope Change Control

Per the [Team-Charter-Filled.md](../docs/Team-Charter-Filled.md), any scope change during the build (e.g., pulling an out-of-scope item back in, or cutting an in-scope item) must:

1. Be raised at the weekly Friday milestone check-in.
2. Be approved by the PM (Demond) after team input, consistent with the team's documented decision-making process.
3. Be reflected as an update to this document and to the [CAPSTONE-PROJECT-PLAN.md](../docs/CAPSTONE-PROJECT-PLAN.md) weekly schedule.

No scope addition should be accepted after the Aug 6 feature freeze noted in the Capstone Project Plan.
