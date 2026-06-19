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

---

## 5. Accessibility matching features

### 5.1 Structured accessibility requirement matching

- **Problem pattern:** Wheelchair-dependent patients are matched to standard vehicles or blocked entirely because accessible vehicle availability is not tracked as a hard constraint.
- **Source case studies:** `case-study-007-michelle-medicaid-wheelchair.md`, `case-study-008-kevin-lee-veteran-advocate.md`
- **Tags:** `wheelchair-accessible`, `vehicle-mismatch`, `non-transferable`, `capacity-shortage`
- **Feature implication:** Capture accessibility requirements as a structured enum on the patient profile and enforce it as a hard filter during driver matching, not a free-text hint.
- **MVP scope (v0.1):** `accessibilityRequirement` enum on Patient (`STANDARD`, `WHEELCHAIR_ACCESSIBLE`, `NON_TRANSFERABLE_WHEELCHAIR`), `isWheelchairAccessible` boolean on Driver, hard filter applied in pooling query.
- **Future scope (v1.0+):** Multi-constraint matching (stretcher, oxygen, transfer assist), accessible vehicle capacity tracking across counties.

### 5.2 Scheduling constraint and same-day fallback handling

- **Problem pattern:** Medicaid 72-hour advance rules conflict with real care scheduling workflows. Urgent-but-non-emergency requests have no escalation path and default to emergency services.
- **Source case studies:** `case-study-007-michelle-medicaid-wheelchair.md`
- **Tags:** `72-hour-scheduling`, `same-day-gap`, `medicaid-transportation`, `urgent-non-emergency`, `ambulance-to-uber`
- **Feature implication:** Capture scheduling lead-time constraints per ride and route same-day requests into an elevated escalation workflow with fallback-pool prioritization.
- **MVP scope (v0.1):** `schedulingConstraint` enum and `needsSameDayFallback` flag on RideRequest, surfaced in coordinator dashboard as elevated priority.
- **Future scope (v1.0+):** Automated triage routing based on constraint type, integration with NEMT provider scheduling APIs.

---

## 6. Advocate and veteran pathway features

### 6.1 Advocate role and ride coordination pathway

- **Problem pattern:** Veteran advocates and informal coordinators manually arrange rides for patients who are outside standard clinic referral paths. No system supports this coordination or connects advocates to clinic and driver visibility.
- **Source case studies:** `case-study-008-kevin-lee-veteran-advocate.md`
- **Tags:** `veteran-advocate`, `unofficial-coordinator`, `no-unified-communication`, `manual-coordination`
- **Feature implication:** Add a first-class `ADVOCATE` role allowing advocates to submit and track ride requests on behalf of patients without requiring a clinic referral.
- **MVP scope (v0.1):** `Advocate` model linked to `User`, `AdvocateRideRequest` join model, advocate-scoped ride visibility in coordinator dashboard.
- **Future scope (v1.0+):** Multi-patient advocacy management, advocate-to-clinic communication thread, veteran-specific transport provider network.

### 6.2 Clinic-initiated rescheduling workflow

- **Problem pattern:** When transport is late, clinic staff manually adjust appointment times with no system record linking the reschedule to the original transportation failure.
- **Source case studies:** `case-study-008-kevin-lee-veteran-advocate.md`
- **Tags:** `manual-rescheduling`, `staff-burnout`, `no-rescheduling-chain`, `clinic-workflow`
- **Feature implication:** Link rescheduled appointments back to the original via a self-referencing `rescheduledFromId` on the `Appointment` model, giving coordinators an audit trail for cascading schedule disruptions.
- **MVP scope (v0.1):** `rescheduledFromId` on `Appointment`, reschedule event logged in `RideEvent` with reason.
- **Future scope (v1.0+):** Automated reschedule detection from delay events, clinic-facing reschedule request workflow.
