# Commute Wallet for Vietnam

Commute Wallet is a Vietnam-first commute finance product. It makes invisible monthly commute spend visible by combining motorbike costs, parking, ride-hailing, rain-driven surge behavior, and routine purchases into one true monthly cost.

This repo is the foundation monorepo for two UI platforms and one backend:

- Customer app: user onboarding, true-cost calculator, rain-cost insight, transport comparison, and wrapped-style dashboard.
- CRM app: internal operations surface for mock users, transaction review, lookup data QA, and future reimbursement workflows.
- Backend API: NestJS service for shared commute calculations, SMS parsing, and future Supabase-backed product APIs.

## Documentation

- [Architecture](docs/architecture.md)
- [Local Development](docs/local-development.md)
- [Deployment](docs/deployment.md)
- [Supabase](docs/supabase.md)
- [Product Scope](docs/product-scope.md)

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev:customer
npm run dev:crm
npm run dev:api
```

Run checks:

```bash
npm test
npm run typecheck
npm run build
```

## Workspace Map

| Path | Purpose |
| --- | --- |
| `apps/customer` | Customer-facing Next.js app on port `3000`. |
| `apps/crm` | Internal CRM/admin Next.js app on port `3001`. |
| `apps/api` | NestJS backend API on port `4000`, plus Vercel serverless entrypoint. |
| `packages/domain` | True-cost calculator, SMS parser, and Vietnam mock data. |
| `packages/ui` | shadcn-style shared UI primitives and Tailwind tokens. |
| `packages/supabase` | Supabase typed client helpers. |
| `supabase` | Local Supabase config and migrations. |

## Current Status

The foundation builds and verifies with:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Vercel deployments run automatically on merges to `main`. Supabase production migrations are also automated through [`.github/workflows/supabase-migrations.yml`](/Users/rokamaku/Code/commute-iq/.github/workflows/supabase-migrations.yml:1) and run only when `supabase/migrations/**` or `supabase/config.toml` changes.
