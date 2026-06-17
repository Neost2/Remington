# CarePath Validation → Feature Mapping

## 1. Core coordination features

### 1.1 Shared real-time timeline

- **Problem pattern:** No single shared view tells the patient, caregiver, driver, or clinic what is happening right now.
- **Source case studies:** `case-study-001-kevin-driver.md`, `case-study-003-alyssa-heart-asthma.md`, `case-study-004-katina-rn.md`, `case-study-005-elijah-rn-bsn.md`
- **Tags:** `clinic-no-visibility`, `no-notification`, `wasted-trip`, `no-shared-timeline`
- **Feature implication:** Create one timeline that shows ride status, appointment status, delay state, and next action for every stakeholder.
- **MVP scope (v0.1):** Manual status tracking, ETA display, appointment state labels, and simple notifications.
- **Future scope (v1.0+):** Scheduling integrations, automatic sync with clinics or dispatch, and push alerts.

---

### 1.2 Risk detection and alerts

- **Problem pattern:** High-risk rides need early warning when cancellations, delays, or no-shows start to emerge.
- **Source case studies:** `case-study-002-churchie-dialysis.md`, `case-study-003-alyssa-heart-asthma.md`, `case-study-005-elijah-rn-bsn.md`
- **Tags:** `last-minute-cancelation`, `no-notification`, `no-risk-detection`, `missed-appointment`
- **Feature implication:** Detect risk before the appointment is missed and notify the right people quickly.
- **MVP scope (v0.1):** Rule-based alerts when a ride is canceled, late, or unconfirmed.
- **Future scope (v1.0+):** Predictive risk scoring, smart escalation, and automated backup routing.

---

## 2. Backup and redundancy features

### 2.1 Backup ride workflows

- **Problem pattern:** Many users have no reliable fallback when the first ride fails.
- **Source case studies:** `case-study-002-churchie-dialysis.md`, `case-study-003-alyssa-heart-asthma.md`, `case-study-004-katina-rn.md`, `case-study-005-elijah-rn-bsn.md`
- **Tags:** `no-backup`, `family-unreliable`, `insurance-transportation`, `no-coordination`
- **Feature implication:** Add an escalation path that can trigger a backup ride or alternate contact before the appointment is lost.
- **MVP scope (v0.1):** Backup request button, alternate contact list, and manual escalation timer.
- **Future scope (v1.0+):** Provider network orchestration, automatic fallback assignment, and capacity-based routing.

---

## 3. Clinical workflow features

### 3.1 Clinic dashboard for transport risk

- **Problem pattern:** Clinics need a quick way to see which patients are at transport risk before the visit window closes.
- **Source case studies:** `case-study-001-kevin-driver.md`, `case-study-004-katina-rn.md`, `case-study-005-elijah-rn-bsn.md`
- **Tags:** `clinic-no-visibility`, `no-shared-timeline`, `no-coordination`, `missed-appointment`
- **Feature implication:** A clinic-facing dashboard can help staff intervene early and reduce missed care.
- **MVP scope (v0.1):** Patient list with risk flags, ETA, and status notes.
- **Future scope (v1.0+):** Scheduling integration, role-based views, and EHR/operational alerts.

### 3.2 Nurse / social worker referral

- **Problem pattern:** Nurses and social workers are natural referral points for patients with recurring transportation barriers.
- **Source case studies:** `case-study-004-katina-rn.md`, `case-study-005-elijah-rn-bsn.md`
- **Tags:** `rn`, `care-coordinator`, `chronic`, `delayed-care`
- **Feature implication:** Give clinical staff an easy referral path when transport risk is identified.
- **MVP scope (v0.1):** Simple referral form or patient flag.
- **Future scope (v1.0+):** Workflow integration with hospital or clinic discharge and care coordination processes.

---

## 4. Affordability and access features

### 4.1 Cost-aware transport options

- **Problem pattern:** Some patients cannot use transportation options simply because they are too expensive.
- **Source case studies:** `case-study-004-katina-rn.md`, `case-study-005-elijah-rn-bsn.md`
- **Tags:** `no-gas`, `rideshare-unaffordable`, `insurance-transportation`, `financial-barrier`
- **Feature implication:** Capture the cost barrier and surface transport options that fit the patient’s reality.
- **MVP scope (v0.1):** Cost-barrier intake field, transport preference capture, and affordability flags.
- **Future scope (v1.0+):** Subsidy matching, payer workflow support, and benefit-aware routing.
