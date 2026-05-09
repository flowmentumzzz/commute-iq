# 04 · Manual trip entry form

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans`.

**Goal:** Add a small form on the customer home that lets a user record a commute transaction by hand (vendor, amount, category, date). Submitted trips are stored locally (and, when signed in, also persisted to Supabase via the API). The Money Leak Detector and Auto-capture sections then reflect the user's real spending, not just the static mock list.

**Notion task IDs:**
- T1 (page_id `35b745ac-054b-818a-8c62-e2b5f97bb7cd`)
- T2 (page_id `35b745ac-054b-81f5-bbf7-fa405a7b2f7e`) — covered by the same form's edit/delete affordances

**Branch:** `feat/manual-trip-entry` from `main`.

**Depends on:** plan 00 (design system) for visual consistency, and plan 01 (auth) is **recommended** because the API-backed save needs a signed-in user. The localStorage-only flow described below works without auth.

**Design reference:** [`./index.html`](../../../../index.html). The trip-list rows should mirror the prototype's `.trip` block (icon chip + name + time + price, neo-brutalist border + shadow). The form should use prototype input styling (thick-bordered fields, lime focus ring).

---

## Context

The customer app currently shows `mockTransactions` (defined in `packages/domain/src/mock-data.ts`) for the auto-capture mock and the money leak input. We want users to be able to add their own.

We have two storage targets:

1. **localStorage** — works for everyone, no auth needed. Browser-local.
2. **Supabase `commute_transactions`** — requires auth (RLS-scoped), persists across devices.

Both are valid. The form should accept a transaction, save to localStorage immediately, and **also** post to the API (which persists to Supabase) **only when the user is signed in**.

## Architecture decisions

- **Zod** for input validation in the form. Type from `z.infer`.
- **Storage layer** lives in `packages/domain/src/transaction-storage.ts` so it's reusable from CRM later. Pure functions over a `Storage`-like interface so it's easy to test.
- **Optimistic UI** — local storage + UI update first, API call in the background. If API fails, log warning and keep the local trip.
- **Edit / delete via inline buttons** in the trip list. Keep edit minimal (re-open the form pre-filled). Delete confirms with a `window.confirm`.
- **Date format** — store `occurredAt` as ISO 8601 (`new Date(...).toISOString()`).

---

## Task 1 · Storage utility in the domain package

**Files:**
- Create: `packages/domain/src/transaction-storage.ts`
- Create: `packages/domain/src/transaction-storage.test.ts`
- Modify: `packages/domain/src/index.ts` (re-export)

- [ ] Define `LocalTransaction = CommuteTransaction & { id: string; occurredAt: string }`.
- [ ] Export pure functions `loadTransactions(storage: Storage): LocalTransaction[]`, `saveTransaction(storage: Storage, transaction: LocalTransaction): LocalTransaction[]`, `removeTransaction(storage: Storage, id: string): LocalTransaction[]`. They read/write `commute-iq:transactions` JSON.
- [ ] Test using a small in-memory Storage stub: `class MemoryStorage implements Pick<Storage, "getItem" | "setItem" | "removeItem">`.
- [ ] Cover: empty load, save then load, save preserves order (newest first), remove by id, malformed JSON returns empty list.

## Task 2 · API route on the customer side that proxies to the NestJS API

**Files:**
- Create: `apps/customer/app/api/transactions/route.ts`

- [ ] `POST` handler that:
  1. Reads body `{ amountVnd, category, merchant, occurredAt }`, validates with Zod.
  2. Reads the signed-in user via `createServerSupabaseClient()`. Returns 401 if no user.
  3. Reads or creates the user's `commute_profiles.id` (if none, create one with sensible defaults using `home_label = ""`, `work_label = ""`, `primary_transport = "motorbike"`).
  4. Inserts a row into `commute_transactions` for that profile.
  5. Returns the inserted row.
- [ ] Use `service` Supabase client for the insert (RLS bypass) **only after** the user has been verified by the cookie-aware client. Don't use the service client for auth checks.

## Task 3 · Manual trip form

**Files:**
- Create: `apps/customer/components/manual-trip-form.tsx` (client component)

- [ ] Fields:
  - `vendor` (text, required)
  - `amountVnd` (number, required, min 1000)
  - `category` (select: fuel | parking | ride_hailing | routine | maintenance)
  - `occurredAt` (date input, defaults to today)
- [ ] Submit handler:
  1. Validate via Zod.
  2. `saveTransaction(localStorage, ...)` immediately, update local state.
  3. Call `fetch("/api/transactions", { method: "POST", body: JSON.stringify(payload) })` — non-blocking.
  4. Reset form.
- [ ] Show inline error for validation, success toast (or inline note) on save.

## Task 4 · Trip list

**Files:**
- Create: `apps/customer/components/trip-list.tsx` (client component)

- [ ] On mount, call `loadTransactions(localStorage)`. Hydration-safe (defer reads to `useEffect`).
- [ ] Render newest-first. Each row: vendor, category, formatted VND, date, edit + delete buttons.
- [ ] Edit re-opens the form pre-filled. Delete confirms then `removeTransaction(...)`.
- [ ] Empty state: "Chưa có giao dịch nào — thêm bằng form bên trên."

## Task 5 · Wire into home page

**Files:**
- Modify: `apps/customer/app/page.tsx`

- [ ] Below the existing Auto-capture / So sánh phương tiện grid, add a `<Card>` titled "Giao dịch của bạn" containing `<ManualTripForm />` then `<TripList />`.

## Task 6 · Money Leak detector picks up real data

**Files:**
- Modify: `apps/customer/components/money-leak-spotlight.tsx`

- [ ] If `localStorage.getItem("commute-iq:transactions")` has data (≥ 3 transactions), prefer the user's data over `mockTransactions` when calling `findMoneyLeaks`.
- [ ] Otherwise keep the current mock-driven behavior so first-time visitors still see a populated card.
- [ ] Mark the card "use client" if needed since it now reads localStorage.

---

## Verification

- [ ] `npm test` — covers transaction-storage
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] `npm run dev:customer`. Add 3 trips with the same vendor → Money Leak card surfaces it.
- [ ] Refresh the page → trips persist (from localStorage).
- [ ] **If signed in:** check Supabase dashboard, the trip appeared in `commute_transactions`.
- [ ] Delete a trip → it disappears from the list.

## PR

**Title:** `feat(customer): manual trip entry with localStorage + Supabase persistence`

**Body sections:**

```markdown
## Summary
- New apps/customer/components/manual-trip-form.tsx (Zod-validated client form).
- New apps/customer/components/trip-list.tsx with edit/delete.
- New packages/domain/src/transaction-storage.ts with Vitest coverage.
- New apps/customer/app/api/transactions route that persists to Supabase when signed in.
- Money Leak Detector now picks up the user's real transactions when at least 3 exist.

## Test plan
- [ ] Add 3 transactions for HIGHLANDS → Money Leak card switches to that vendor.
- [ ] Refresh — transactions persist from localStorage.
- [ ] Sign in, add a transaction → row appears in Supabase commute_transactions.

## Notes
- Closes Notion T1 + T2.
- Depends on plan 01 (auth) for the Supabase persistence path. Without auth, localStorage-only flow still works.
```
