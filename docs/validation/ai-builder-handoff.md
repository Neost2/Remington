# CarePath AI Builder Handoff Guide

Use this guide when you finish the 10+ interview test cycle and return to AI Builder.

## Source of Truth

- Interview tracker: `docs/validation/conversation-tracker.csv`
- Signal rubric: `docs/validation/signal-rubric.md`
- Rolling synthesis: `docs/validation/synthesis-log.md`
- Case studies: `docs/validation/case-studies/`

## Minimum Readiness Before Handoff

- 10 or more interviews completed
- Segment diversity covered (patients, families/caregivers, transportation stakeholders)
- At least 3 repeated pain patterns identified
- Quote-level evidence captured in each case

## AI Builder Input Pack (Recommended)

### Problem Summary

- One paragraph on the core coordination failure
- Top 3 repeated pain points from interviews

### Evidence Block

- 5 to 10 strongest participant quotes
- Impact examples (medical, logistical, emotional, financial)
- Signal distribution (Weak/Medium/Strong)

### User Segments

- Segment counts from tracker
- Which segment is highest urgency
- Which segment is best for pilot start

### Priority Requirements

- Real-time status and ETA visibility
- Delay/cancelation alerts
- Backup ride escalation for high-risk visits
- Critical appointment flags

### Pilot Assumptions To Test Next

- Which assumptions are de-risked
- Which assumptions still need validation

## Suggested Prompt to Re-enter AI Builder

"I completed early validation interviews for CarePath. Use the attached evidence to help me refine product requirements, pilot design, and investor narrative. Prioritize features that prevent missed care caused by transportation and communication failures."

Then attach or paste:

- conversation-tracker.csv summary rows
- strongest quotes by segment
- latest synthesis log highlights
- case study snapshots #1 through latest

## Output You Should Request from AI Builder

- Updated product requirements (v1)
- Pilot workflow and escalation logic
- Segment-specific value proposition statements
- Risk register with mitigation actions
- Investor-ready validation summary draft
