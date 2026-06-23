# BillEase — Billing & Invoicing Web App

GST-ready billing, invoicing, inventory, and reports for Indian small businesses. Inspired by MyBillBook/Swipe workflows — built from scratch.

## Features

- **Auth:** Register, login, business onboarding
- **Parties:** Customers & suppliers with ledger balances
- **Items:** HSN, GST rates, optional stock tracking
- **Invoices:** Draft → finalize, CGST/SGST/IGST, quotations
- **Purchases:** Purchase bills with stock-in on finalize
- **Payments:** Partial payments, UPI/cash/bank modes
- **PDF:** Download GST tax invoice PDF
- **WhatsApp:** Share invoice link via WhatsApp
- **Inventory:** Stock adjustments, low-stock alerts, movement log
- **Reports:** Sales, GST summary, party-wise sales, top items

## Quick start

```bash
cd billing-app
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

Copy `apps/web/.env.local` and set `DATABASE_URL` to an **absolute** path to `packages/db/prisma/dev.db` (see the example in that file).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `demo@billease.app` / `demo1234`

## Project structure

```
billing-app/
├── apps/web/           Next.js 15 app
├── packages/db/        Prisma schema + client
├── packages/shared/    GST calculator + validators
└── docs/               Supabase RLS notes
```

## Production (Supabase)

1. Create a Supabase project and copy the Postgres connection string.
2. Change `provider` in `packages/db/prisma/schema.prisma` to `postgresql`.
3. Set `DATABASE_URL` to your Supabase Postgres URL.
4. Apply RLS policies from `docs/supabase-rls.sql`.
5. Set `NEXTAUTH_SECRET` and deploy to Vercel.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start web app |
| `npm run db:push` | Sync database schema |
| `npm run db:seed` | Seed demo data |
| `npm test` | Run GST unit tests |

## License

MIT — For learning and commercial use with your own branding.
