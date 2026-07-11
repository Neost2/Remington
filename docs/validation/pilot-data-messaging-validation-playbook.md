# CarePath Pilot Data and Messaging Validation Playbook

This guide standardizes pilot data capture, messaging tests, quality checks, and 14-day reporting.

## Purpose

- Ensure consistent data entry across team members.
- Avoid formula breaks in low-data conditions.
- Produce funder-ready outputs with minimal manual cleanup.

## Sheet Tab Order

1. Referral-Level
2. Weekly Roll-Up
3. Messaging Scorecard
4. Messaging Findings Summary
5. Quality Checks

## Tab Setup

### 1) Referral-Level

Headers:

Referral ID | Referral Date | Appt. Date | Attended/No-Show | Reminder Sent (Y/N) | Transport Confirmed (Y/N) | Fallback Used (Y/N) | Follow-up Completed (Y/N) | Staff Time (min) | Notes

Validation:

- Attended/No-Show: Attended, No-Show
- Reminder Sent (Y/N): Y, N
- Transport Confirmed (Y/N): Y, N
- Fallback Used (Y/N): Y, N
- Follow-up Completed (Y/N): Y, N

Protection:

- Lock row 1 only.
- Keep data-entry rows unlocked.

### 2) Weekly Roll-Up

Headers:

Week # | Referrals This Week | No-Shows (#) | No-Show % | Avg Staff Time (min) | Burden Trend | Standout Quote

Validation:

- Burden Trend: Less, Same, More

Formula:

- No-Show % (D2): =IF(B2=0,0,C2/B2)

Formatting:

- Format column D as Percent.

Protection:

- Lock row 1 and formula cells in column D.

### 3) Messaging Scorecard

Headers:

Date | Audience | Message (A/B) | Resonance (1-5) | Clarity (1-5) | Trust (1-5) | Top Objection Heard | Follow-up Intent (Y/N) | Notes/Quote

Validation:

- Audience: Admin, Frontline, Patient
- Message (A/B): A, B
- Resonance (1-5): 1,2,3,4,5
- Clarity (1-5): 1,2,3,4,5
- Trust (1-5): 1,2,3,4,5
- Follow-up Intent (Y/N): Y, N

Protection:

- Lock row 1 only.

### 4) Messaging Findings Summary

Headers:

Audience Tested | Message A Performance | Message B Performance | Top Objections | Winning Message | Final Headline Language | Immediate Next Actions

### 5) Quality Checks

Headers:

Issue | Row Reference | Explanation

## Formula Pack

Use these in a calculations area (or summary rows) on Messaging Scorecard.

- Average Trust by audience and message (example: Admin A):

  =IFERROR(AVERAGEIFS(F2:F100,B2:B100,"Admin",C2:C100,"A"),0)

- Average Resonance by audience and message (example: Admin A):

  =IFERROR(AVERAGEIFS(D2:D100,B2:B100,"Admin",C2:C100,"A"),0)

- Follow-up intent rate by audience and message (example: Admin B):

  =IF(COUNTIFS(B2:B100,"Admin",C2:C100,"B")=0,0,COUNTIFS(B2:B100,"Admin",C2:C100,"B",H2:H100,"Y")/COUNTIFS(B2:B100,"Admin",C2:C100,"B"))

- Winning message by audience (Trust first, Resonance tie-break) example for Admin:

  =IF(IFERROR(AVERAGEIFS(F$2:F$100,B$2:B$100,"Admin",C$2:C$100,"A"),0)>IFERROR(AVERAGEIFS(F$2:F$100,B$2:B$100,"Admin",C$2:C$100,"B"),0),"A",IF(IFERROR(AVERAGEIFS(F$2:F$100,B$2:B$100,"Admin",C$2:C$100,"A"),0)<IFERROR(AVERAGEIFS(F$2:F$100,B$2:B$100,"Admin",C$2:C$100,"B"),0),"B",IF(IFERROR(AVERAGEIFS(D$2:D$100,B$2:B$100,"Admin",C$2:C$100,"A"),0)>=IFERROR(AVERAGEIFS(D$2:D$100,B$2:B$100,"Admin",C$2:C$100,"B"),0),"A","B")))

## Quality Check Rules

Log each failed check as one row in Quality Checks.

- Missing appointment outcome: Referral-Level column D is blank.
- Missing staff time: Referral-Level column I is blank.
- No-show with no notes: Referral-Level column D is No-Show and column J is blank.
- Weekly inconsistency: Weekly Roll-Up column B equals 0 and column C is not 0.

## Team SOP

### Daily (5 minutes, Coordinator)

- Add new referral rows and update status fields.
- Add messaging test interactions to Messaging Scorecard.

### Weekly (10 minutes, Reviewer)

- Run quality checks and log issues.
- Confirm formulas and percent formatting are intact.
- Capture one standout quote from each active audience.

### Day 14 (15 minutes, Founder or Coordinator)

- Complete Messaging Findings Summary.
- Export reporting package.
- Confirm final winner and headline per audience.

## 14-Day Reporting Package

Export all four outputs:

1. Messaging Findings Summary (PDF)
2. Messaging Scorecard snapshot (CSV or PDF)
3. Top 5 quotes from Notes/Quote
4. Recommended final headline by audience

## Handoff Notes

- Use templates in docs/validation/templates for quick tab creation.
- Do not edit locked headers or formula cells.
- Keep formulas zero-safe and IFERROR-wrapped.
