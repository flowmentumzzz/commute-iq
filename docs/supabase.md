# Supabase

Supabase provides the initial PostgreSQL foundation for product data.

## Hosted Project

The connected hosted Supabase project is:

```text
https://gyvmqylszjuzjztwogtl.supabase.co
```

The public client key in the env examples is the modern Supabase publishable key. Keep the service-role key private and configure it only in the backend API environment.

## Files

- `supabase/config.toml`: local Supabase project configuration.
- `supabase/migrations/20260509000000_initial_schema.sql`: initial schema, indexes, and Row Level Security policies.
- `packages/supabase/src/index.ts`: typed client helpers for browser and service-role usage.

## Local Database

```bash
npx supabase start
npx supabase db reset
```

Use `db reset` to replay migrations from a clean local database.

## Hosted Database

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

After linking, generate fresh TypeScript database types and replace the hand-written starter type in `packages/supabase/src/index.ts`.

## CI/CD

Production migrations are applied automatically by [`.github/workflows/supabase-migrations.yml`](/Users/rokamaku/Code/commute-iq/.github/workflows/supabase-migrations.yml:1).

The workflow runs on merges to `main` only when one of these paths changes:

- `supabase/migrations/**`
- `supabase/config.toml`

It requires these GitHub repository secrets:

```bash
SUPABASE_ACCESS_TOKEN=
SUPABASE_DB_PASSWORD=
SUPABASE_PROJECT_REF=
```

`SUPABASE_PROJECT_REF` for the current hosted project is `gyvmqylszjuzjztwogtl`.

## Schema

`profiles` stores user-level identity metadata. It references `auth.users` and is protected so users can select and update only their own profile.

`commute_profiles` stores onboarding answers:

- Home label
- Work label
- Primary transport
- Vehicle model
- Optional monthly salary

`commute_transactions` stores parsed or manual commute expenses:

- Fuel
- Parking
- Ride-hailing
- Routine
- Maintenance

`monthly_commute_summaries` stores the monthly true-cost result:

- Direct cost
- Amortized vehicle cost
- Weather cost
- Routine cost
- Total monthly cost

## RLS Posture

RLS is enabled on all tables. The first migration includes read/insert/update policies for users' own profile and commute profile data, plus read policies for related transactions and summaries.

For admin CRM workflows, prefer backend service-role access through `apps/api` rather than exposing broad admin policies to the CRM frontend.

The hardening migration updates policies to use `(select auth.uid())`, which avoids re-evaluating the auth function for each row at scale. It also revokes public execution for `public.rls_auto_enable()` when that helper exists in the connected project.

## Environment Variables

Frontend-safe:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Backend only:

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to `apps/customer` or `apps/crm`.
