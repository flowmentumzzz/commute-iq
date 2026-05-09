# Local Development

## Requirements

- Node.js `20.11.0` or newer
- npm, using the root `package-lock.json`
- Optional: Supabase CLI for local database work

## Install

```bash
npm install
cp .env.example .env
```

App-specific env examples are available at:

- `apps/customer/.env.local.example`
- `apps/crm/.env.local.example`
- `apps/api/.env.example`

## Run Apps

Use separate terminals:

```bash
npm run dev:customer
npm run dev:crm
npm run dev:api
```

Default local URLs:

- Customer: `http://localhost:3000`
- CRM: `http://localhost:3001`
- API: `http://localhost:4000/health`

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

`npm test` currently covers the shared domain package:

- True-cost calculation
- Vietnamese commute SMS parsing

`npm run build` compiles the API, both Next apps, and all shared packages.

## Working With Shared Packages

Next.js apps transpile shared workspace packages through `transpilePackages` in each app's `next.config.mjs`.

When adding business logic, prefer `packages/domain` first. Add or update tests there before wiring the result into `apps/customer`, `apps/crm`, or `apps/api`.

When adding reusable UI, put primitives in `packages/ui/src/components` and keep app-specific compositions inside the app.
