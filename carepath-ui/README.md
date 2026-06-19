# CarePath — UI

![CarePath](./public/carepath-logo.png)

## About

CarePath is a transportation coordination tool that helps patients anywhere in the country arrange reliable rides to medical appointments, aiming to reduce no-shows and improve access to essential healthcare.

The project is focused on removing transportation and communication failures that cause missed care. It is being shaped through early validation conversations with patients, caregivers, and transportation stakeholders.

## Stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Prisma](https://prisma.io) (via backend API)
- [Twilio](https://twilio.com) (SMS notifications)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Role-based portals

| Role | Path |
|---|---|
| Patient | `/patient` |
| Driver | `/driver` |
| Coordinator | `/coordinator` |
| Admin / Partner | `/admin` |

## Validation Workspace

Early discovery interviews and evidence are tracked in `../docs/validation/`. See the [root README](../README.md) for the full case study sequence and how to contribute interview data.
