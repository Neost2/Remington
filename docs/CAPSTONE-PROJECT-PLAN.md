# CarePath — Atlas School Capstone Project Plan
**Demo Day: August 13, 2025**
**Team:** Debalent (PM), Remington (Backend), Michelle (UI)
**Cohort:** Builders+Backers Mobility Cohort

---

## What Is Already Done

Before week assignments begin, the following is fully built and deployed:

**Backend (Remington inherits)**
- PostgreSQL schema via Prisma — all models complete: User, Patient, Driver, Coordinator, Advocate, RideRequest, Appointment, FallbackOffer, DepotRoute, RideCredit, Notification, PaymentAuthorization, RidePayment, SurveyResponse, CommunicationLog
- Enums: Role (incl. ADVOCATE), AccessibilityRequirement, SchedulingConstraint, UrgencyLevel, RideStatus, FundingSource, PaymentStatus, TransportationProviderType
- Auth: register, login, /me with JWT
- Ride controller: createRideRequest, getPendingRides, assignDriver, getPoolingOptions, triggerFallback, confirmRide, completeRide, listAllRides
- Controllers scaffolded: patient, driver, coordinator, fallback, credit, payment, rideEvent, communicationLog, surveyResponse
- Routes wired for all controllers
- Middleware: JWT auth, error handler
- Setup script: `npm run setup` with interactive env config

**UI (Michelle inherits)**
- Next.js 16 static export deployed to AWS Amplify — live at https://main.d352gym2v1cw7h.amplifyapp.com
- Mobile-first design system (`cp-` CSS classes, safe area insets, 44px touch targets, bottom tab nav)
- Landing page with brand gradient, stats (15 interviews, 13 strong signals), pillar cards, validation section
- DashboardLayout with role-based bottom nav (mobile) and sidebar (desktop)
- Coordinator Pooling Hub page — ride queue, candidate matching, fallback trigger
- Patient Intake page — full ride request form with accessibility and urgency fields
- UI components: Badge, Button, Card, StatCard, Sidebar, Topbar
- Brand palette: purple #5540a1, blue #0c6bc2, teal #1b9c86, navy #052b56

**Validation (PM)**
- 15 case studies logged, 13 strong signals
- conversation-tracker.csv, synthesis-log.md, patterns.md, validation-to-feature-mapping.md all current

---

## Weekly Milestones

Each milestone is a pass/fail gate. The team checks in every Friday. If a milestone is not met, it carries into the next week and the PM adjusts scope — no new work starts until the gate is cleared.

| Week | Dates | Milestone | Gate Criteria |
|---|---|---|---|
| 1 | Jul 14–18 | **Auth + Env Running** | Both teammates have the app running locally. Login and register work end-to-end via Postman. Patient and driver profiles can be created via API. |
| 2 | Jul 21–25 | **Core Ride Flow Live** | A patient can log in, submit a ride request via the UI, and a coordinator can see it in the pooling hub. Patient and driver dashboards render real data. |
| 3 | Jul 28–Aug 1 | **Full Coordinator Loop** | Coordinator can assign a driver, trigger fallback, and see status changes. Driver can move a ride through CONFIRMED → IN_PROGRESS → COMPLETED. All stat cards show live counts. |
| 4 | Aug 4–8 | **Demo-Ready Build** | Seed script populates all demo scenarios. Survey screen works. All API errors show user-facing banners. Feature freeze Aug 6. Final Amplify deploy done. |
| Demo | Aug 11–13 | **Shipped** | Full demo flow runs without errors on a mobile device. Slide deck is final. Team has done at least one full dry run together. |

---

## Weekly Schedule

### Week 1 — July 14–18 | Foundation Handoff + Auth Flow

**Debalent (PM)**
- Brief Remington and Michelle on codebase — walk through schema, routes, and UI structure
- Set up shared GitHub project board with issues for each task below
- Confirm local dev environments are running for both teammates (`npm run setup`)
- Define demo day script: what screens to show, what data to seed, what story to tell

**Remington (Backend)**
- Run `npm run setup`, connect to local PostgreSQL, confirm `prisma migrate dev` succeeds
- Read through all existing controllers and routes — understand what is stubbed vs. complete
- Complete `patient.controller.ts`: createProfile, getProfile, updateProfile
- Complete `driver.controller.ts`: createProfile, getProfile, updateProfile, toggleAvailability
- Write a Postman or REST collection covering: register → login → create patient profile → create ride request

**Michelle (UI)**
- Clone repo, run `cd carepath-ui && npm run dev`, confirm landing page and dashboard pages render
- Review `globals.css` cp- design system and all existing components
- Build the Login page at `/login` — email + password form, calls `POST /api/auth/login`, stores JWT in localStorage, redirects by role
- Build the Register page at `/register` — role selector (Patient / Driver / Coordinator), name, email, phone, password

---

### Week 2 — July 21–25 | Patient + Driver Profiles

**Debalent (PM)**
- Review Week 1 PRs — merge or request changes
- Seed the database with demo data: 2 patients, 3 drivers, 1 coordinator, 3 pending ride requests (script in `scripts/seed.js`)
- Draft the demo day narrative: problem → validation evidence → live demo flow → ask

**Remington (Backend)**
- Complete `coordinator.controller.ts`: getProfile, listRidesInCounty, getDashboardStats (pending count, matched count, fallback count)
- Add `GET /api/rides/my` for patients — returns their own ride history
- Add `GET /api/drivers/available` — returns available drivers in a county (used by coordinator pooling)
- Ensure all protected routes return 401 when token is missing or invalid

**Michelle (UI)**
- Build Patient Dashboard at `/patient` — shows active ride status card, next appointment, quick "Request a Ride" button
- Build Driver Dashboard at `/driver` — shows today's assigned rides, availability toggle, rides completed count
- Wire the Patient Intake form to the real API (`POST /api/rides`) using the stored JWT — replace demo mode default with live attempt, fall back to demo on error

---

### Week 3 — July 28 – Aug 1 | Coordinator Hub + Ride Status

**Debalent (PM)**
- Review Week 2 PRs — merge or request changes
- Prepare 3 demo scenarios with seeded data: (1) standard ride assignment, (2) wheelchair-accessible match, (3) fallback escalation
- Begin slide deck for demo day: problem, validation, product, team

**Remington (Backend)**
- Wire `fallback.controller.ts` to the fallback service — when triggered, mark ride FALLBACK_NEEDED, log a RideEvent, send SMS notification via Twilio if configured
- Add `PATCH /api/rides/:id/status` for drivers — allows driver to move ride from CONFIRMED → IN_PROGRESS → COMPLETED
- Add `GET /api/coordinator/stats` — returns counts for dashboard stat cards
- Validate that `getPoolingOptions` returns correct wheelchair-filtered candidates using seeded data

**Michelle (UI)**
- Wire Coordinator Pooling Hub to real API — replace demo toggle default with live load using stored coordinator JWT
- Build Coordinator Dashboard at `/coordinator` — stat cards (pending, matched, fallback), recent ride list
- Add ride status badge updates to the Patient Dashboard — poll `GET /api/rides/my` every 30 seconds or on page focus

---

### Week 4 — Aug 4–8 | Polish, Notifications + Demo Prep

**Debalent (PM)**
- Final PR review and merge — freeze feature work by Aug 6
- Run full demo flow end-to-end with seeded data, document any bugs
- Finalize slide deck — 8 slides max: problem, 3 validation quotes, product demo screenshot, team, ask
- Prepare the Amplify redeploy checklist for demo day morning

**Remington (Backend)**
- Complete `communicationLog.controller.ts` — log every SMS send/receive to the DB
- Add `POST /api/survey` — patient submits NPS score and comment after ride completion
- Harden error responses — all 400/404/500 cases return `{ error: string }` consistently
- Write a `scripts/seed.js` that inserts demo-ready data (patients, drivers, coordinator, 3 ride requests in different statuses)

**Michelle (UI)**
- Build a post-ride Survey screen at `/patient/survey` — NPS slider (0–10), comment field, submit button
- Add loading states and error banners to all forms that call the API
- Final mobile QA pass: test every screen on 375px (iPhone SE) and 390px (iPhone 14) viewport widths
- Redeploy to Amplify with final build

---

### Demo Week — Aug 11–13 | Freeze + Present

**Aug 11 (Monday)**
- All code merged to `main`
- Final Amplify deploy — job number logged
- Seed production-adjacent demo data
- Each teammate does a solo run-through of their assigned screens

**Aug 12 (Tuesday)**
- Full team dry run — PM drives the demo, Remington and Michelle on standby for questions
- Fix any last-minute display or API issues
- No new features after this point

**Aug 13 (Wednesday) — Demo Day**
- Demo flow: Landing page → Patient intake → Coordinator pooling hub → Driver dashboard → Fallback escalation → Survey
- Validation evidence: reference the 15 case studies and 13 strong signals on the landing page stats
- Builders+Backers context: position CarePath as a transportation-to-care orchestration layer, not a ride app

---

## Role Responsibilities Summary

| Area | Owner | Notes |
|---|---|---|
| Project management, GitHub board, demo narrative | Debalent | Also owns validation docs and seed data |
| All API routes, controllers, database, Prisma, SMS | Remington | Inherits complete schema and auth — focus is wiring and completing controllers |
| All UI pages, components, mobile QA, Amplify deploy | Michelle | Inherits complete design system and 2 working pages — focus is remaining screens and API wiring |

---

## Key Technical References

| Item | Location |
|---|---|
| Database schema | `prisma/schema.prisma` |
| API entry point | `src/app.ts`, `src/server.ts` (port 3001) |
| All route files | `src/routes/` |
| All controller files | `src/controllers/` |
| UI design system | `carepath-ui/src/app/globals.css` |
| UI components | `carepath-ui/src/components/` |
| UI pages | `carepath-ui/src/app/(dashboard)/` |
| Amplify app | https://main.d352gym2v1cw7h.amplifyapp.com |
| GitHub repo | https://github.com/Debalent/CarePath |
| Local API | http://localhost:3001 |
| Local UI | http://localhost:3000 |

---

## Demo Day Screen Flow

1. **Landing page** — brand, 15 interviews / 13 strong signals, validation quotes
2. **Register / Login** — patient registers, logs in, JWT stored
3. **Patient Intake** — submits ride request with wheelchair flag and urgency level
4. **Coordinator Pooling Hub** — coordinator sees pending ride, views matched candidates, assigns driver
5. **Driver Dashboard** — driver sees assigned ride, marks in progress, marks complete
6. **Fallback escalation** — coordinator triggers fallback on a second ride, sees FALLBACK_NEEDED status
7. **Post-ride survey** — patient submits NPS score

All screens use seeded demo data as fallback if live API is unavailable.
