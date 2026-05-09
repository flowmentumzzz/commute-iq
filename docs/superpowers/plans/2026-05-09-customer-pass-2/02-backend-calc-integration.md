# 02 · Backend calculation integration

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans`.

**Goal:** Have the customer app call the NestJS API for the canonical True Cost calculation on initial server render. The live client-side calculator stays untouched (instant feedback during slider drag), but a "Validated by API" reference card shows the same calculation coming from the server, demonstrating end-to-end integration.

**Notion task IDs:** none specifically — this closes the user request "do calculation integration on backend too" and complements I1 which is already Done.

**Branch:** `feat/customer-api-reference` from `main`.

**Depends on:** plan 00 (design system) — recommended so the new ApiReferenceCard fits visually.

**Design reference:** [`./index.html`](../../../../index.html). The reference card should reuse the prototype's leak-hero / claim-summary card patterns: thick black border, hard shadow, lime or coral accent, mono labels.

---

## Context

The NestJS API at `apps/api` exposes:

- `GET /commute/demo` → `{ input: TrueCostInput, result: TrueCostResult }`
- `POST /commute/true-cost` → `TrueCostResult` for a given input
- `POST /commute/parse-sms` → parsed transactions

`apps/customer` currently calls `calculateTrueCost(...)` directly in the browser. This plan adds a typed API client so the customer can hit the NestJS endpoints from server components and (future) server actions.

Local dev requires the API to be running: `npm run dev:api` listens on `http://localhost:4000`.

## Architecture decisions

- **Server-side fetch** (Next.js server component) for the demo card so the API is exercised on every page load — good for catching breakage early.
- **`cache: "no-store"`** so we never get a stale calculation in dev. Add caching later when that matters.
- **Graceful fallback** — if the API is down, render a small "API not reachable" badge instead of crashing the whole page. The live calculator still works.
- **Don't replace the live calculator's local computation.** Calling the API on every slider tick would feel laggy and fight Next's Router cache. Server-side reference fetch + client-side live recompute is the right split.

---

## Task 1 · API client helper

**Files:**
- Create: `apps/customer/lib/api/index.ts`

- [ ] Export `getApiBaseUrl(): string` that reads `process.env.NEXT_PUBLIC_API_BASE_URL` and falls back to `http://localhost:4000`.
- [ ] Export `fetchDemoCost(): Promise<{ input: TrueCostInput; result: TrueCostResult } | null>`. Returns `null` on any failure (HTTP error, network error, JSON parse error). Logs the error to `console.warn` (not `console.error` — this is a soft failure).
- [ ] Export `postTrueCost(input: TrueCostInput): Promise<TrueCostResult | null>`. Same null-on-error pattern.
- [ ] Both helpers use `fetch(url, { cache: "no-store" })` and `await response.json()`. Type the body using imports from `@commute-iq/domain`.

## Task 2 · API reference card

**Files:**
- Create: `apps/customer/components/api-reference-card.tsx` (server component, no `"use client"`)

- [ ] Inside the component, `await fetchDemoCost()`.
- [ ] If `null`: render a `<Card>` with a muted message "API chưa kết nối — chạy `npm run dev:api` để bật" and a small "Refresh" link to reload.
- [ ] If a result: render the total VND, a per-bucket breakdown grid (direct, amortized, weather, routine), and a small footer "Nguồn: NestJS API · `${apiBaseUrl}`".
- [ ] Format VND using `Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })`.

## Task 3 · Wire into home page

**Files:**
- Modify: `apps/customer/app/page.tsx`

- [ ] Import `<ApiReferenceCard />`.
- [ ] Render it between the live `<TrueCostCalculator />` and the `<MoneyLeakSpotlight />`.
- [ ] Wrap the import in a `<Suspense fallback={...}>` boundary so the API call doesn't block the rest of the page rendering.

## Task 4 · Env documentation

**Files:**
- Modify: `apps/customer/.env.local.example` (no change needed if `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` is already there — confirm and document)

- [ ] In the PR description, note that `NEXT_PUBLIC_API_BASE_URL` should point at the deployed API on Vercel for production.

## Task 5 · Optional: API health hint in dev

**Files:**
- Modify: `apps/customer/components/api-reference-card.tsx`

- [ ] If `fetchDemoCost()` returned `null` and `process.env.NODE_ENV === "development"`, also render a tiny `<code>npm run dev:api</code>` chip so the developer knows what to do.

---

## Verification

- [ ] `npm test` — still green
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] **Two terminals:** terminal A `npm run dev:api`, terminal B `npm run dev:customer`. Open `http://localhost:3000`.
- [ ] Confirm the API Reference card shows a total matching `demoTrueCostInput`.
- [ ] Stop the API. Reload the customer page. Confirm the card falls back to the "API not reachable" message and the rest of the page still renders fine.
- [ ] Live calculator still recomputes instantly (no API delay).

## PR

**Title:** `feat(customer): server-side API reference card backed by NestJS`

**Body sections:**

```markdown
## Summary
- New apps/customer/lib/api with typed helpers for /commute/demo and /commute/true-cost.
- New ApiReferenceCard server component that hits GET /commute/demo on every render.
- Graceful fallback when the API is down — live calculator still works.

## Test plan
- [ ] Run dev:api + dev:customer. Reference card shows API total.
- [ ] Stop dev:api. Reference card shows "API chưa kết nối" message; live calculator still recomputes.

## Notes
- Closes the "do calculation integration on backend too" follow-up to PR #1.
- Future work: hit POST /commute/true-cost on debounced slider changes for a "validated" badge on the live calculator.
```
