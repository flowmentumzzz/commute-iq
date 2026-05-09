# Deployment

The repo is Vercel-ready as a monorepo with three separate deployable projects.

## Vercel Projects

Create three Vercel projects from the same Git repository.

| Vercel Project | Root Directory | Purpose |
| --- | --- | --- |
| `commute-wallet-customer` | `apps/customer` | Public customer app |
| `commute-wallet-crm` | `apps/crm` | Internal CRM app |
| `commute-wallet-api` | `apps/api` | NestJS API |

Each app has its own `vercel.json`.

## Environment Variables

Customer project:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY=
NEXT_PUBLIC_API_BASE_URL=
```

CRM project:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=
```

API project:

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CORS_ORIGIN=
PORT=4000
```

Set `CORS_ORIGIN` to a comma-separated list of allowed customer and CRM origins, for example:

```bash
CORS_ORIGIN=https://customer.example.com,https://crm.example.com
```

## Build Commands

Vercel should infer workspace installs from the root lockfile. The project configs specify build commands:

- Customer: `npm run build --workspace @commute-iq/customer`
- CRM: `npm run build --workspace @commute-iq/crm`
- API: `npm run build --workspace @commute-iq/api`

## API Routing

The API app has a serverless entrypoint at `apps/api/api/index.ts`.

`apps/api/vercel.json` rewrites all incoming paths to the serverless Nest handler, so routes such as `/health` and `/commute/demo` are served by NestJS.

## Supabase Deployment

Supabase is linked through MCP to:

```text
https://gyvmqylszjuzjztwogtl.supabase.co
```

After creating a Supabase project, link and push migrations:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Then add the Supabase URL and keys to the three Vercel projects.

## Supabase Migration Pipeline

Production database changes are applied by [`.github/workflows/supabase-migrations.yml`](/Users/rokamaku/Code/commute-iq/.github/workflows/supabase-migrations.yml:1).

Trigger behavior:

- Runs on pushes to `main`
- Only runs when `supabase/migrations/**` or `supabase/config.toml` changes
- Supports manual runs through GitHub Actions `workflow_dispatch`

Required GitHub repository secrets:

```bash
SUPABASE_ACCESS_TOKEN=
SUPABASE_DB_PASSWORD=
SUPABASE_PROJECT_REF=
```

Workflow behavior:

- Authenticates the Supabase CLI with `SUPABASE_ACCESS_TOKEN`
- Links the CLI to the hosted project from `SUPABASE_PROJECT_REF`
- Runs `supabase db push --dry-run`
- Runs `supabase db push`
- Runs `supabase config push` only when `supabase/config.toml` changed in the push

Current Vercel status: the repo contains Vercel-ready app configs, and production app deploys run automatically from Git pushes to `main`.

## Version Note

The Notion plan specified Next.js 14, so the scaffold stays on Next 14. During setup, npm warned that the pinned `next@14.2.23` has a security advisory. Before a public production launch, upgrade to the latest patched Next 14 release or intentionally migrate the apps to a newer Next major version.
