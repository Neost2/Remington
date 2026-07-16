const {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle,
  ShadingType, convertInchesToTwip
} = require('docx');
const fs = require('fs');

const TEAL = '0d9488';
const LIGHT_TEAL = 'ccfbf1';
const SLATE = '1e293b';
const LIGHT_GRAY = 'f8fafc';
const MID_GRAY = 'e2e8f0';

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 300, after: 120 },
    run: { color: SLATE, bold: true },
  });
}

function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: SLATE })],
    spacing: { after: 100 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text: `• ${text}`, size: 22, color: SLATE })],
    spacing: { after: 80 },
    indent: { left: convertInchesToTwip(0.3) },
  });
}

function spacer() {
  return new Paragraph({ text: '', spacing: { after: 80 } });
}

function cell(text, isHeader = false, shade = null) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: isHeader, size: isHeader ? 20 : 19, color: isHeader ? 'ffffff' : SLATE })],
        alignment: AlignmentType.LEFT,
        spacing: { before: 60, after: 60 },
      }),
    ],
    shading: isHeader
      ? { type: ShadingType.SOLID, color: TEAL }
      : shade
      ? { type: ShadingType.SOLID, color: shade }
      : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
  });
}

function makeTable(headers, rows, altShade = LIGHT_GRAY) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map(h => cell(h, true)),
        tableHeader: true,
      }),
      ...rows.map((row, i) =>
        new TableRow({
          children: row.map(c => cell(c, false, i % 2 === 0 ? altShade : 'ffffff')),
        })
      ),
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY },
      left: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY },
      right: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY },
      insideH: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY },
      insideV: { style: BorderStyle.SINGLE, size: 1, color: MID_GRAY },
    },
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Calibri', size: 22, color: SLATE } },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        run: { bold: true, size: 28, color: TEAL, font: 'Calibri' },
        paragraph: { spacing: { before: 320, after: 160 } },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        run: { bold: true, size: 24, color: SLATE, font: 'Calibri' },
        paragraph: { spacing: { before: 240, after: 120 } },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          },
        },
      },
      children: [

        // Title block
        new Paragraph({
          children: [new TextRun({ text: 'CarePath', bold: true, size: 52, color: TEAL, font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Team Brainstorming Document', size: 28, color: SLATE, font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Demond Balentine  ·  Michelle Berthiaume  ·  Remington Neustadter', size: 22, color: '64748b', font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Atlas School Capstone  ·  July 2026', size: 20, color: '94a3b8', font: 'Calibri' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        // Step 1
        heading('Step 1: Problem Definition'),
        body('Core Problem Statement:'),
        body('Patients in rural and low-income areas miss critical medical appointments — dialysis, oncology, cardiology, post-surgical follow-ups — not because they don\'t want to go, but because they have no reliable way to get there. Transportation failures cause no-shows. No-shows cause health deterioration, ER visits, and preventable deaths.'),
        spacer(),
        body('Who is affected (from 15 validation interviews):'),
        bullet('Patients who rely on Medicaid transport, family, or volunteers — all unreliable'),
        bullet('Caregivers (CNAs, home health aides) who absorb coordination burden with no tools'),
        bullet('Coordinators at clinics and nonprofits managing rides manually via phone and text'),
        bullet('Drivers (volunteers and NEMT) with no visibility into patient needs or scheduling'),
        bullet('Institutional partners (churches, clinics) who want to help but have no coordination layer'),
        spacer(),
        body('What currently fails:'),
        bullet('No-show rates are high — confirmations and reminders don\'t reach patients'),
        bullet('Fallback options are not organized — when a ride falls through, there is no plan B'),
        bullet('Communication happens across phone, text, and paper — nothing is tracked'),
        bullet('No one measures whether rides actually happened or what the health outcome was'),
        spacer(),
        body('What CarePath solves:'),
        body('A transportation coordination platform connecting patients, volunteer drivers, coordinators, and institutional partners — with ride matching, fallback escalation, SMS communication, and outcome tracking — without requiring mileage as a decision factor.'),
        spacer(),

        // Step 2
        heading('Step 2: Wild Ideas (No Filtering — All Ideas Welcome)'),
        body('Each team member contributed ideas freely. No idea was dismissed at this stage.'),
        spacer(),

        makeTable(
          ['Team Member', 'Idea'],
          [
            ['Demond', '"Panic button" for patients when their ride doesn\'t show — instantly alerts the fallback pool'],
            ['Demond', 'Gamification for drivers — reliability badges, community leaderboard, milestone rewards'],
            ['Demond', 'Coordinator "war room" view — real-time map of all active rides in a county'],
            ['Demond', 'Depot route builder — coordinators create recurring community van runs (e.g. every Tuesday to dialysis)'],
            ['Demond', 'Ride credit marketplace — hospitals and churches pre-purchase ride credits for patients'],
            ['Demond', 'AI-assisted ride matching — suggest best driver based on availability, reliability, and proximity'],
            ['Demond', 'Voice call fallback for patients without smartphones — automated call confirms ride details'],
            ['Demond', 'Integration with Medicaid billing codes to auto-generate reimbursement documentation'],
            ['Michelle', 'Caregiver companion view — family members can track a patient\'s ride in real time'],
            ['Michelle', 'Onboarding flow for patients with low tech literacy — large text, simple language, voice-guided steps'],
            ['Michelle', 'Post-ride "how did it go?" survey — 1-tap NPS for patients, builds outcome data over time'],
            ['Michelle', 'Visual ride timeline on patient dashboard — shows pickup → in transit → arrived'],
            ['Michelle', 'Coordinator digest email — daily summary of rides completed, pending, and fallback events'],
            ['Michelle', 'Community impact dashboard — total rides completed, appointments kept, estimated ER visits avoided'],
            ['Michelle', 'Accessibility flags on ride requests — wheelchair, oxygen, stretcher — visible to drivers before accepting'],
            ['Michelle', 'Dark mode and high-contrast mode for elderly patients with vision impairments'],
            ['Remington', 'SMS-only driver workflow — driver doesn\'t need an app at all'],
            ['Remington', 'Reverse brainstorm: how would we cause the most no-shows? → Build the opposite'],
            ['Remington', 'Automated reminder sequence — 48hr, 24hr, 2hr before pickup via SMS'],
            ['Remington', 'Driver reliability scoring — calculated from completed rides, on-time rate, patient ratings'],
            ['Remington', 'Ride pooling — multiple patients going to the same clinic share one driver'],
            ['Remington', 'Offline-first patient intake — form works without internet, syncs when connection returns'],
            ['Remington', 'QR code check-in at clinic — patient scans on arrival, automatically marks ride completed'],
            ['Remington', 'Webhook integration — when ride is completed, notify the clinic\'s EHR system'],
          ]
        ),
        spacer(),

        // Step 3
        heading('Step 3: Build-On (Team Builds on Each Other\'s Ideas)'),
        makeTable(
          ['Original Idea', 'Who Had It', 'Built On By', 'How It Grows'],
          [
            ['Panic button for missed rides', 'Demond', 'Remington', 'Trigger SMS blast to entire fallback pool with one tap, log the event automatically'],
            ['SMS-only driver workflow', 'Remington', 'Demond', 'Extend to patients too — full ride lifecycle via SMS for users without smartphones'],
            ['Post-ride NPS survey', 'Michelle', 'Demond', 'Feed NPS data into coordinator dashboard as a live satisfaction score per driver'],
            ['Depot route builder', 'Demond', 'Michelle', 'Add a visual calendar view so coordinators can see all recurring routes at a glance'],
            ['Caregiver companion view', 'Michelle', 'Remington', 'Add a shareable ride link — patient texts a URL to family to track the ride'],
            ['Ride pooling', 'Remington', 'Michelle', 'Show pooling candidates on coordinator hub with a "combine rides" button'],
            ['Community impact dashboard', 'Michelle', 'Demond', 'Make it public-facing — embed on a clinic or church website to show community value'],
            ['Reliability scoring', 'Remington', 'Michelle', 'Display score as a visual badge on driver profiles — builds trust with coordinators'],
            ['Automated reminders', 'Remington', 'Demond', 'Let coordinators customize the reminder schedule per patient communication preference'],
            ['Accessibility flags', 'Michelle', 'Remington', 'Auto-filter driver pool to only show wheelchair-capable vehicles when flag is set'],
          ]
        ),
        spacer(),

        // Step 4
        heading('Step 4: Mind Map Clusters'),
        body('After grouping all ideas, five natural clusters emerged:'),
        spacer(),
        makeTable(
          ['Cluster', 'Ideas in This Group'],
          [
            ['Communication', 'SMS-only workflow, Automated reminders, Voice call fallback, Caregiver tracking, Shareable ride link'],
            ['Coordination', 'Ride matching, Pooling, Depot routes, Fallback escalation, Accessibility filters'],
            ['Outcomes & Data', 'NPS surveys, Community impact dashboard, Driver reliability scores, EHR webhook, Reimbursement docs'],
            ['Equity & Access', 'Low-tech onboarding, Large text / voice UI, Offline-first intake, High contrast mode'],
            ['Partner Tools', 'Credit marketplace, Coordinator digest email, Public impact embed, Gamification / badges'],
          ]
        ),
        spacer(),

        // Step 5
        heading('Step 5: Narrowing — What Makes the Demo Day Cut'),
        body('Scored by: Impact (reduces no-shows), Feasibility (buildable by Aug 13), Differentiation (makes CarePath stand out). ★★★ = High  ★★ = Medium  ★ = Low'),
        spacer(),
        makeTable(
          ['Idea', 'Impact', 'Feasibility', 'Differentiation', 'Decision'],
          [
            ['SMS reminders (48hr / 24hr / 2hr)', '★★★', '★★★', '★★', '✅ Build — Week 4'],
            ['Fallback panic button', '★★★', '★★★', '★★★', '✅ Build — Week 3'],
            ['Post-ride NPS survey', '★★', '★★★', '★★', '✅ Build — Week 4'],
            ['Accessibility flags on ride requests', '★★★', '★★★', '★★', '✅ In schema — wire to UI Week 2'],
            ['Ride pooling (coordinator hub)', '★★★', '★★', '★★★', '✅ Build — Week 3'],
            ['Driver reliability score', '★★', '★★★', '★★', '✅ Build — Week 3'],
            ['Community impact dashboard', '★★', '★★', '★★★', '⏳ Stretch goal — Week 4'],
            ['Caregiver companion / shareable link', '★★', '★★', '★★★', '⏳ Stretch goal'],
            ['SMS-only driver workflow', '★★★', '★', '★★★', '🔜 Post-demo roadmap'],
            ['QR code clinic check-in', '★★', '★', '★★★', '🔜 Post-demo roadmap'],
            ['EHR webhook integration', '★★★', '★', '★★★', '🔜 Post-demo roadmap'],
            ['Offline-first intake', '★★', '★', '★★', '🔜 Post-demo roadmap'],
            ['Medicaid billing integration', '★★★', '★', '★★★', '🔜 Post-demo roadmap'],
          ]
        ),
        spacer(),

        // Step 6
        heading('Step 6: Action Plan'),
        heading('Immediate — This Week', HeadingLevel.HEADING_2),
        makeTable(
          ['Task', 'Owner', 'Deadline'],
          [
            ['Wire accessibility flags to patient intake form', 'Michelle', 'Jul 18'],
            ['Confirm fallback controller triggers SMS via Twilio', 'Remington', 'Jul 18'],
            ['Add automated reminder logic (48hr / 24hr / 2hr)', 'Remington', 'Jul 25'],
            ['Add driver reliability score to coordinator pooling hub', 'Michelle', 'Jul 25'],
          ]
        ),
        spacer(),
        heading('Week 3 — Jul 28 – Aug 1', HeadingLevel.HEADING_2),
        makeTable(
          ['Task', 'Owner', 'Deadline'],
          [
            ['Build ride pooling "combine rides" button on coordinator hub', 'Michelle', 'Aug 1'],
            ['Wire fallback escalation — FALLBACK_NEEDED status + SMS blast', 'Remington', 'Aug 1'],
            ['Coordinator dashboard stat cards pulling live data', 'Michelle', 'Aug 1'],
          ]
        ),
        spacer(),
        heading('Week 4 — Aug 4–8', HeadingLevel.HEADING_2),
        makeTable(
          ['Task', 'Owner', 'Deadline'],
          [
            ['Post-ride NPS survey screen + POST /api/survey endpoint', 'Remington + Michelle', 'Aug 6'],
            ['Community impact numbers on landing page (live counts)', 'Michelle', 'Aug 6'],
            ['Feature freeze + full demo run-through', 'All', 'Aug 6'],
          ]
        ),
        spacer(),
        heading('Post-Demo Roadmap (Future Sprints)', HeadingLevel.HEADING_2),
        bullet('SMS-only driver and patient workflow (no app required)'),
        bullet('Caregiver companion ride tracking with shareable link'),
        bullet('QR code clinic check-in'),
        bullet('EHR webhook integration'),
        bullet('Medicaid reimbursement documentation export'),
        bullet('Offline-first patient intake'),
        spacer(),

        // Reverse brainstorm
        heading('Reverse Brainstorm Check'),
        body('"How would we guarantee patients miss their appointments?"'),
        spacer(),
        makeTable(
          ['Failure Mode (How to Cause Problems)', 'CarePath\'s Counter-Solution'],
          [
            ['Never confirm the ride', 'Confirmation SMS + real-time status tracking'],
            ['Give patients no way to report a no-show driver', 'Fallback panic button — instant alert to backup pool'],
            ['Make the coordinator manage everything by memory', 'Coordinator dashboard + full ride queue'],
            ['Never follow up after a ride', 'Post-ride NPS survey sent automatically on completion'],
            ['Ignore patients who don\'t have smartphones', 'SMS-only + voice call fallback (roadmap)'],
          ]
        ),
        spacer(),

        new Paragraph({
          children: [new TextRun({ text: 'CarePath Capstone  ·  Atlas School  ·  July 2026', size: 18, color: '94a3b8', italics: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('docs/brainstorm.docx', buffer);
  console.log('brainstorm.docx created successfully');
});
