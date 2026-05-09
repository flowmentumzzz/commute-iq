# Architecture

Commute Wallet is structured as an npm-workspaces monorepo with three deployable apps and three shared packages.

## System Shape

```text
commute-iq
├── apps
│   ├── customer   Next.js customer UI
│   ├── crm        Next.js internal CRM UI
│   └── api        NestJS backend API
├── packages
│   ├── domain     Commute calculation, SMS parsing, mock VN lookup data
│   ├── ui         Shared shadcn-style UI components and Tailwind tokens
│   └── supabase   Typed Supabase client helpers
└── supabase       Local config and migrations
```

## Boundaries

`packages/domain` owns business rules that must be consistent across UI and backend. This includes the true-cost formula, commute transaction types, parser behavior, and MVP lookup data.

`packages/ui` owns source-controlled UI primitives. The components follow a shadcn-style approach, meaning components are regular project code rather than a black-box dependency.

`packages/supabase` owns database client construction and a first-pass `Database` type. This should later be replaced or refreshed with generated Supabase types once the hosted project is linked.

`apps/customer` is the public product demo. It should stay optimized for the hackathon pitch: clear hero number, visual breakdown, Vietnam-specific insight, and a crisp narrative.

`apps/crm` is the internal operations workspace. It should become the home for transaction review, user cohorts, reimbursement policy setup, and admin workflows.

`apps/api` is the backend boundary. It uses NestJS because the Notion production stack names NestJS + PostgreSQL. The current API can run locally as a normal HTTP server and deploy to Vercel through `apps/api/api/index.ts`.

## Data Flow

Customer and CRM apps currently consume mock data directly from `packages/domain`.

The API exposes:

- `GET /health`
- `GET /commute/demo`
- `POST /commute/true-cost`
- `POST /commute/parse-sms`

Supabase is scaffolded for persistent profiles, commute profiles, transactions, and monthly summaries. The next product step is to move demo state from static mock data into Supabase-backed flows.

## Design Notes

The foundation intentionally keeps all core commute logic out of React components. This makes the calculator testable, reusable by the API, and safer to evolve when mobile or production services arrive.

The two Next apps are separate Vercel projects rather than one app with route groups. This mirrors the user requirement for two UI platforms and lets customer and CRM deployments evolve independently.
