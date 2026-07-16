# CarePath — Team Brainstorming Document
**Team:** Demond Balentine · Michelle Berthiaume · Remington Neustadter
**Due:** Thursday
**Format:** Problem Definition → Wild Ideas → Build-On → Clustering → Narrowing → Action Plan

---

## Step 1: Problem Definition

**Core Problem Statement:**
Patients in rural and low-income areas miss critical medical appointments — dialysis, oncology, cardiology, post-surgical follow-ups — not because they don't want to go, but because they have no reliable way to get there. Transportation failures cause no-shows. No-shows cause health deterioration, ER visits, and preventable deaths.

**Who is affected (from our 15 validation interviews):**
- Patients who rely on Medicaid transport, family, or volunteers — all of which are unreliable
- Caregivers (CNAs, home health aides) who absorb the coordination burden with no tools
- Coordinators at clinics and nonprofits who manage rides manually via phone and text
- Drivers (volunteers and NEMT) who have no visibility into patient needs or scheduling
- Institutional partners (churches, clinics) who want to help but have no coordination layer

**What currently fails:**
- No-show rates are high because confirmation and reminders don't exist or don't reach patients
- Fallback options (backup drivers) are not organized — when a ride falls through, there is no plan B
- Communication happens across phone, text, and paper — nothing is tracked
- No one measures whether rides actually happened or what the health outcome was

**What CarePath solves:**
A transportation coordination platform that connects patients, volunteer drivers, coordinators, and institutional partners — with ride matching, fallback escalation, SMS communication, and outcome tracking — all without requiring mileage as a decision factor.

---

## Step 2: Wild Ideas (No filtering — all ideas welcome)

*Each team member contributed ideas. No idea was dismissed at this stage.*

### Demond's Ideas
- A "panic button" for patients when their ride doesn't show — instantly alerts the fallback pool
- Gamification for drivers — reliability badges, community leaderboard, milestone rewards
- A coordinator "war room" view — real-time map of all active rides in a county
- Depot route builder — coordinators can create recurring community van runs (e.g. every Tuesday to dialysis)
- Ride credit marketplace — hospitals and churches pre-purchase ride credits for patients in their community
- AI-assisted ride matching — suggest the best driver based on availability, reliability score, and proximity
- Voice call fallback for patients without smartphones — automated call confirms ride details
- Integration with Medicaid billing codes to auto-generate reimbursement documentation

### Michelle's Ideas
- A caregiver companion view — family members can track a patient's ride in real time
- Onboarding flow for patients with low tech literacy — large text, simple language, voice-guided steps
- Post-ride "how did it go?" survey — 1 tap NPS for patients, builds outcome data over time
- A visual ride timeline on the patient dashboard — shows pickup → in transit → arrived
- Coordinator digest email — daily summary of rides completed, pending, and fallback events
- Community impact dashboard — shows total rides completed, appointments kept, estimated ER visits avoided
- Accessibility flags on ride requests — wheelchair, oxygen, stretcher — visible to drivers before accepting
- Dark mode and high-contrast mode for elderly patients with vision impairments

### Remington's Ideas
- Brainwriting idea: what if the driver didn't need an app at all — SMS-only driver workflow
- Reverse brainstorm: how would we cause the most no-shows? → No reminders, no fallback, no confirmation → so build the opposite
- Automated reminder sequence — 48hr, 24hr, 2hr before pickup via SMS
- Driver reliability scoring — calculated from completed rides, on-time rate, patient ratings
- Ride pooling — multiple patients going to the same clinic on the same day share one driver
- Offline-first patient intake — form works without internet, syncs when connection returns
- QR code check-in at clinic — patient scans on arrival, automatically marks ride completed
- Webhook integration — when a ride is completed, notify the clinic's EHR system

---

## Step 3: Build-On (Team builds on each other's ideas)

| Original Idea | Who Had It | Built On By | How It Grows |
|---|---|---|---|
| Panic button for missed rides | Demond | Remington | Trigger SMS blast to entire fallback pool with one tap, log the event automatically |
| SMS-only driver workflow | Remington | Demond | Extend to patients too — full ride lifecycle via SMS for users without smartphones |
| Post-ride survey | Michelle | Demond | Feed NPS data into coordinator dashboard as a live satisfaction score per driver |
| Depot route builder | Demond | Michelle | Add a visual calendar view so coordinators can see all recurring routes at a glance |
| Caregiver companion view | Michelle | Remington | Add a shareable ride link — patient gets a URL they can text to family to track the ride |
| Ride pooling | Remington | Michelle | Show pooling candidates on the coordinator hub with a "combine rides" button |
| Community impact dashboard | Michelle | Demond | Make it public-facing — embed on a clinic or church website to show community value |
| Reliability scoring | Remington | Michelle | Display score as a visual badge on driver profiles — builds trust with coordinators |
| Automated reminders | Remington | Demond | Let coordinators customize the reminder schedule per patient communication preference |
| Accessibility flags | Michelle | Remington | Auto-filter driver pool to only show wheelchair-capable vehicles when flag is set |

---

## Step 4: Mind Map Clusters

After grouping all ideas, five natural clusters emerged:

```
                          [ CarePath ]
                               |
        ┌──────────────────────┼──────────────────────┐
        |                      |                       |
  [Communication]        [Coordination]          [Outcomes]
  SMS-only workflow       Ride matching           NPS surveys
  Automated reminders     Pooling                 Impact dashboard
  Voice call fallback     Depot routes            Reliability scores
  Caregiver tracking      Fallback escalation     EHR webhook
  Shareable ride link     Accessibility filters   Reimbursement docs
        |                      |                       |
  [Equity & Access]      [Partner Tools]
  Low-tech onboarding    Credit marketplace
  Large text / voice UI  Coordinator digest
  Offline-first intake   Public impact embed
  High contrast mode     Gamification / badges
```

---

## Step 5: Narrowing — What Makes the Demo Day Cut

Using three criteria: **Impact** (does it reduce no-shows?), **Feasibility** (can we build it by Aug 13?), **Differentiation** (does it make CarePath stand out?)

| Idea | Impact | Feasibility | Differentiation | Decision |
|---|---|---|---|---|
| SMS reminders (48hr / 24hr / 2hr) | ★★★ | ★★★ | ★★ | ✅ Build — Week 4 |
| Fallback panic button | ★★★ | ★★★ | ★★★ | ✅ Build — Week 3 |
| Post-ride NPS survey | ★★ | ★★★ | ★★ | ✅ Build — Week 4 |
| Accessibility flags on ride requests | ★★★ | ★★★ | ★★ | ✅ Already in schema — wire to UI Week 2 |
| Ride pooling (coordinator hub) | ★★★ | ★★ | ★★★ | ✅ Build — Week 3 |
| Driver reliability score | ★★ | ★★★ | ★★ | ✅ Build — Week 3 |
| Community impact dashboard | ★★ | ★★ | ★★★ | ⏳ Stretch goal — Week 4 if time allows |
| Caregiver companion / shareable link | ★★ | ★★ | ★★★ | ⏳ Stretch goal |
| SMS-only driver workflow | ★★★ | ★ | ★★★ | 🔜 Post-demo roadmap |
| QR code clinic check-in | ★★ | ★ | ★★★ | 🔜 Post-demo roadmap |
| EHR webhook integration | ★★★ | ★ | ★★★ | 🔜 Post-demo roadmap |
| Offline-first intake | ★★ | ★ | ★★ | 🔜 Post-demo roadmap |
| Medicaid billing integration | ★★★ | ★ | ★★★ | 🔜 Post-demo roadmap |

---

## Step 6: Action Plan

### Immediate (This Week)
| Task | Owner | Deadline |
|---|---|---|
| Wire accessibility flags to patient intake form | Michelle | Jul 18 |
| Confirm fallback controller triggers SMS via Twilio | Remington | Jul 18 |
| Add automated reminder logic (48hr / 24hr / 2hr) to ride creation | Remington | Jul 25 |
| Add driver reliability score display to coordinator pooling hub | Michelle | Jul 25 |

### Week 3 (Jul 28 – Aug 1)
| Task | Owner | Deadline |
|---|---|---|
| Build ride pooling "combine rides" button on coordinator hub | Michelle | Aug 1 |
| Wire fallback escalation — FALLBACK_NEEDED status + SMS blast to pool | Remington | Aug 1 |
| Coordinator dashboard stat cards pulling live data | Michelle | Aug 1 |

### Week 4 (Aug 4–8)
| Task | Owner | Deadline |
|---|---|---|
| Post-ride NPS survey screen + POST /api/survey endpoint | Remington + Michelle | Aug 6 |
| Community impact numbers on landing page (live counts) | Michelle | Aug 6 |
| Feature freeze + full demo run-through | All | Aug 6 |

### Post-Demo Roadmap (Future Sprints)
- SMS-only driver and patient workflow (no app required)
- Caregiver companion ride tracking
- QR code clinic check-in
- EHR webhook integration
- Medicaid reimbursement documentation export
- Offline-first patient intake

---

## Reverse Brainstorm Check
*"How would we guarantee patients miss their appointments?"*
- Never confirm the ride → **We built: confirmation SMS + status tracking**
- Give patients no way to report a no-show driver → **We built: fallback panic button**
- Make the coordinator manage everything by memory → **We built: coordinator dashboard + ride queue**
- Never follow up after a ride → **We built: post-ride NPS survey**
- Ignore patients who don't have smartphones → **We built: SMS-only + voice fallback (roadmap)**

---

*Document created: July 2026 | CarePath Capstone — Atlas School*
