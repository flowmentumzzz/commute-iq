# Customer Pass 2 — Task Breakdown

This folder contains six self-contained implementation plans that take the customer app from the live calculator (PR #1) to a real signed-in product surface backed by the NestJS API and Supabase — and styled to match the prototype.

Each plan is meant to be picked up by a separate Claude Code session.

## ⭐ Design source of truth

[`./index.html`](../../../../index.html) at the repo root is the canonical visual + interaction prototype for the product. **Every plan in this folder must produce output that, side-by-side with `index.html`, looks like the same product.** Open it in a browser before starting any plan.

The prototype defines:

- **Palette:** cream `#FFF6E5` background, ink-near-black `#1A1A1A` text & borders, lime `#D7FF3D` primary accent, coral `#FF6B5C` secondary accent, plus grape / sky / leaf / rose for chips and data viz.
- **Type:** Bricolage Grotesque (display), Be Vietnam Pro (body, supports VN diacritics), DM Mono (labels).
- **Style:** neo-brutalist — `2.5px solid var(--ink)` borders, hard offset shadows (`4px 4px 0 0 ink`, no blur), generous border-radius.
- **Screens:** welcome, setup-loc, setup-mode, home, insights, claims (employee phone view) + manager dashboard with claims table, leak patterns, heatmap, and the "Why us" panel.

Plan **00** ports these tokens + component styling into `packages/ui` so plans 01–05 inherit them automatically.

## Plans

| # | File | Notion | Surface | Effort | Depends on |
| --- | --- | --- | --- | --- | --- |
| 00 | [design-system-from-prototype.md](./00-design-system-from-prototype.md) | (design) | packages/ui + apps/customer | 1d | — |
| 01 | [auth-magic-link.md](./01-auth-magic-link.md) | A1, A3 | apps/customer | 1d | 00 (recommended) |
| 02 | [backend-calc-integration.md](./02-backend-calc-integration.md) | (user request) | apps/customer + apps/api | 0.5d | 00 (recommended) |
| 03 | [motorbike-picker-expand.md](./03-motorbike-picker-expand.md) | O4 | packages/domain | 0.5d | — |
| 04 | [manual-trip-entry.md](./04-manual-trip-entry.md) | T1, T2 | apps/customer + packages/domain | 1d | 00 (style), 01 (Supabase persistence) |
| 05 | [skip-and-defaults.md](./05-skip-and-defaults.md) | O7 | apps/customer | 0.5d | 00 (style) |

## Suggested order

```
00 (design) ──┬── 01 (auth) ──┐
              │               ├── 04 (trip entry)
              │   02 (api) ───┘
              │
              ├── 05 (welcome banner)
              └── ...

03 (motorbike data) — fully independent, run any time
```

Concretely: ship **00 first**, then 01 / 02 / 03 / 05 in parallel, then 04.

If a session can't do 00 first (timing, dependencies blocked), it should still write components that **use the prototype tokens by name** (e.g., `bg-lime`, `font-display`) so a later 00 pass can land cleanly.

## Conventions every plan follows

- Branch naming: `feat/<short-slug>` from `main`.
- Commit style: conventional commits (`feat:`, `fix:`, `docs:`, etc).
- Each plan ends in **one PR** opened with `gh pr create`.
- Notion task status flow: `Not started` → `In progress` (when you start) → `Done` (when PR opens).
- Each plan lists the Notion `page_id`s so a session can flip status without searching.
- **Always cross-reference `./index.html`** before deciding visual + UX details. Match the prototype unless explicit reason not to.

## Repo facts a session should know up front

- Monorepo with npm workspaces. Apps in `apps/{customer,crm,api}`. Shared in `packages/{domain,ui,supabase}`.
- Customer app: Next.js 14 App Router, Tailwind, shadcn-style components in `@commute-iq/ui`.
- Domain logic is in `@commute-iq/domain` (`calculateTrueCost`, `findMoneyLeaks`, `parseCommuteTransactions`, `motorbikeModels`, `mockTransactions`).
- API: NestJS at `apps/api`, exposes `GET /health`, `GET /commute/demo`, `POST /commute/true-cost`, `POST /commute/parse-sms`.
- Supabase: schema + RLS already in `supabase/migrations/`. Tables: `profiles`, `commute_profiles`, `commute_transactions`, `monthly_commute_summaries`. Hosted at `https://gyvmqylszjuzjztwogtl.supabase.co`.
- `packages/supabase` exports `createBrowserSupabaseClient`, `createServiceSupabaseClient`, and a `Database` type. **It does not yet have an SSR-cookie-aware server client** — plan 01 adds that in `apps/customer/lib/supabase/`.

## Quick verification commands every plan should pass

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run dev:customer  # smoke-test in browser, side-by-side with ./index.html
```
