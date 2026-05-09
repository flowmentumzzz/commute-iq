# Customer Pass 2 — Task Breakdown

This folder contains nine self-contained implementation plans that take the customer app from the live calculator (PR #1) to a real signed-in product surface — magic-link sign-up, a 3-step onboarding flow matching the prototype, a 4-tab employee app shell (home/insights/claims/profile), a B2B manager dashboard in `apps/crm`, NestJS API integration, and Supabase persistence — all styled to match the prototype.

Each plan is meant to be picked up by a separate Claude Code session.

## ⭐ Design source of truth

[`./index.html`](../../../../index.html) at the repo root is the canonical visual + interaction prototype for the product. **Every plan in this folder must produce output that, side-by-side with `index.html`, looks like the same product.** Open it in a browser before starting any plan.

The prototype defines:

- **Palette:** cream `#FFF6E5` background, ink-near-black `#1A1A1A` text & borders, lime `#D7FF3D` primary accent, coral `#FF6B5C` secondary accent, plus grape / sky / leaf / rose for chips and data viz.
- **Type:** Bricolage Grotesque (display), Be Vietnam Pro (body, supports VN diacritics), DM Mono (labels).
- **Style:** neo-brutalist — `2.5px solid var(--ink)` borders, hard offset shadows (`4px 4px 0 0 ink`, no blur), generous border-radius.
- **Screens:** welcome, setup-loc, setup-mode, home, insights, claims (employee phone view) + manager dashboard with claims table, leak patterns, heatmap, and the "Why us" panel.

Plan **00** ports these tokens + component styling into `packages/ui` so plans 01–06 inherit them automatically.

## Sign-up vs. onboarding — what's where

The product has **two distinct flows** that touch new users, and they are intentionally separated:

| Flow | What it does | Plan |
| --- | --- | --- |
| **Sign-up / sign-in** (auth) | Email magic-link via Supabase. With magic-link, sign-up = sign-in for the auth layer — first-time email creates the account; returning email logs in. | **01** |
| **Onboarding** | The 3-step setup the prototype shows (welcome → home/office locations → transport mode → review) that captures the user's commute profile. | **06** |

The plan-01 auth callback decides where the user lands after the magic link:

- **New user** (no `commute_profiles` row yet) → `/onboarding`
- **Returning user** (profile exists) → `/`

So "sign-up" is plan 01, "onboarding" is plan 06, and the **stitch** between them lives in plan 01's `/auth/callback` route handler. Plan 06 documents the same stitch from the onboarding side so either session can land first.

## Plans

| # | File | Status | Notion | Surface | Effort | Depends on |
| --- | --- | --- | --- | --- | --- | --- |
| 00 | [design-system-from-prototype.md](./00-design-system-from-prototype.md) | ✅ Done | (design) | packages/ui + apps/customer | 1d | — |
| 01 | [auth-magic-link.md](./01-auth-magic-link.md) | ✅ Done | A1, A3 | apps/customer | 1d | 00 (recommended) |
| 02 | [backend-calc-integration.md](./02-backend-calc-integration.md) | ⬜ Not started | (user request) | apps/customer + apps/api | 0.5d | 00 (recommended) |
| 03 | [motorbike-picker-expand.md](./03-motorbike-picker-expand.md) | ✅ Done | O4 | packages/domain | 0.5d | — |
| 04 | [manual-trip-entry.md](./04-manual-trip-entry.md) | ⬜ Not started | T1, T2 | apps/customer + packages/domain | 1d | 00 (style), 01 (Supabase persistence) |
| 05 | [skip-and-defaults.md](./05-skip-and-defaults.md) | ⬜ Not started | O7 | apps/customer | 0.5d | 00 (style) |
| 06 | [onboarding-flow.md](./06-onboarding-flow.md) | ⬜ Not started | O8 (and O7 deep-link) | apps/customer | 1.5d | 00 (style), 01 (auth + callback redirect) |
| 07 | [app-shell-tabs.md](./07-app-shell-tabs.md) | ⬜ Not started | (new) | apps/customer | 2d | 00, 01, 06 (recommended) |
| 08 | [manager-dashboard.md](./08-manager-dashboard.md) | ✅ Done | (new) | apps/crm + packages/domain | 1.5d | 00 |

Status legend: ✅ Done = committed on `feat/customer-pass-2` · 🟡 In progress = local but not yet committed · ⬜ Not started.

Last status sweep: 2026-05-09 — plans 00, 01, 03, 08 are all green (tests + typecheck + lint + build) on `feat/customer-pass-2`.

## Suggested order

```
00 (design) ──┬── 01 (auth) ── 06 (onboarding) ── 07 (app shell + tabs) ──┐
              │                                                            ├── 04 (trip entry)
              │                                                            │
              │   02 (api, dev-only) ──────────────────────────────────────┤
              │                                                            ├── ship
              ├── 05 (welcome banner — moves to /playground via 07) ───────┤
              │                                                            │
              └── 08 (manager dashboard) ──────────────────────────────────┘

03 (motorbike data) — fully independent, run any time
```

Concretely: ship **00 first**, then 01 / 03 / 08 in parallel, then 06 once 01 is in (06's auth-callback redirect is documented in plan 01 so it can land before 06 with a benign default that sends everyone to `/`), then 07 once 06 is in, then 04 / 05 / 02 fold in around 07. 02 and 05 are best landed *after* 07 because plan 07 moves both surfaces (the calculator and the welcome banner) to `/playground`.

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
