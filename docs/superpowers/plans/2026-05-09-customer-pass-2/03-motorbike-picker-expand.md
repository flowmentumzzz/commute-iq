# 03 · Expand motorbike catalog to 30+ Vietnam models

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans`.

**Goal:** Replace the 4-entry mock motorbike catalog with a realistic ~30-entry catalog covering the bikes most office workers in HCMC and Hà Nội actually own. The True Cost calculator will pick from a much wider list and the resulting numbers (purchase price, residual, fuel L/100km, maintenance) will reflect real Vietnamese market data.

**Notion task ID:** O4 (page_id `35b745ac-054b-8143-96dc-ff823f42e995`) — flip to `In progress` when starting, `Done` when PR opens.

**Branch:** `feat/motorbike-catalog-expand` from `main`.

**Status:** Done — the motorbike catalog is expanded to 30 entries, the calculator default now finds `honda-vision` by id, and catalog integrity tests are present. The optional research note file is not present.

**Depends on:** none. Runs in parallel.

**Design reference:** [`./index.html`](../../../../index.html). This is a data-only task — no UI changes — but the picker's option list will be consumed by the calculator UI which should already match the prototype after plan 00.

---

## Context

`packages/domain/src/mock-data.ts` currently exports `motorbikeModels` with 4 entries (Wave Alpha, Vision, Janus, Klara). The True Cost calculator (`apps/customer/components/true-cost-calculator.tsx`) consumes this list directly via the motorbike picker `<select>`.

The shape of each entry:

```ts
{
  id: string;            // kebab-case, brand-model
  name: string;          // human-readable
  purchasePriceVnd: number;
  resaleValueVnd: number;     // expected after 7 years (~40% of new for ICE, ~35% for EV)
  fuelLitersPer100Km: number; // 0 for EV
  maintenanceYearlyVnd: number;
}
```

## Architecture decisions

- **Data only.** No engine changes, no UI changes. The picker already maps over `motorbikeModels`, so it picks up new entries automatically.
- **Group by brand** — no schema change required, just keep the array sorted by brand then by popularity within brand. Honda first because it dominates the VN market.
- **Conservative fuel numbers** — use vendor-published figures + a 10% real-world fudge. Document sources inline as comments.
- **EV models** include `kwhPer100km` as a comment but **not** as a typed field for now (the engine treats EVs as `fuelLitersPer100Km = 0`, which means zero fuel cost). A follow-up task can add an electricity field and wire it through the engine.

---

## Task 1 · Source the data

**Files:**
- Create: `packages/domain/src/__research__/motorbikes.md` (notes; not imported)

- [ ] List 30+ motorbike models with: brand, model name, ~2025/2026 new price (VND), expected residual after 7 years, vendor-published L/100km, ballpark yearly maintenance.
- [ ] Sources: Honda VN, Yamaha Motor VN, VinFast, Dat Bike, Yadea VN sites + standard resale market knowledge (e.g., chotot.com listings for used bikes).
- [ ] Brands to cover, in priority order:
  - Honda: Wave Alpha, Wave RSX, Future, Blade 110, Vision, Air Blade, Lead 125, SH Mode, SH 125i, SH 150i (10)
  - Yamaha: Sirius, Janus, Grande, FreeGo, Exciter 150, NVX 155 (6)
  - Suzuki: Address, Raider R150, GD110 (3)
  - Piaggio: Liberty 150, Vespa Sprint, Vespa Primavera (3)
  - VinFast (EV): Klara A2, Vento S, Theon S, Feliz S (4)
  - Dat Bike (EV): Weave 200, Quantum (2)
  - Yadea (EV): G5, Voltguard (2)
  - **Target: 30+. Stop at 32 to keep the picker readable.**

## Task 2 · Update mock-data.ts

**Files:**
- Modify: `packages/domain/src/mock-data.ts`

- [ ] Replace `motorbikeModels` with the expanded list. Keep the existing 4 entries (or update them with refined numbers) so existing tests pass.
- [ ] Sort by brand (Honda, Yamaha, Suzuki, Piaggio, VinFast, Dat Bike, Yadea), then by popularity within brand.
- [ ] Add an inline comment above each EV entry: `// Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km`.

## Task 3 · Update demoTrueCostInput if needed

**Files:**
- Modify: `packages/domain/src/mock-data.ts`

- [ ] Verify `demoTrueCostInput.vehicle` numbers still align with a real Honda Vision (or whichever model is the demo default). Adjust if your refined Vision numbers differ.

## Task 4 · Update the calculator default if needed

**Files:**
- Modify: `apps/customer/components/true-cost-calculator.tsx`

- [ ] The calculator picks `motorbikeModels[1]?.id ?? motorbikeModels[0].id` as the default (currently `honda-vision`). Confirm that index 1 is still a sensible default after the sort, or update to `motorbikeModels.find(m => m.id === "honda-vision")?.id ?? motorbikeModels[0].id` for resilience to future reorderings.

## Task 5 · Test coverage

**Files:**
- Modify or create: `packages/domain/src/mock-data.test.ts`

- [ ] Add a Vitest test asserting `motorbikeModels.length >= 30`.
- [ ] Add a test asserting every entry has positive `purchasePriceVnd`, `resaleValueVnd`, `fuelLitersPer100Km >= 0`, `maintenanceYearlyVnd > 0`.
- [ ] Add a test asserting every `id` is unique and follows kebab-case (`/^[a-z0-9-]+$/`).

---

## Verification

- [ ] `npm test` — passes including the new mock-data tests
- [ ] `npm run typecheck` — clean
- [ ] `npm run build` — clean
- [ ] `npm run dev:customer` → open `/`, click the motorbike picker → 30+ options visible, ordered by brand
- [ ] Pick a Honda SH Mode → fuel cost goes up; pick a VinFast Klara → fuel goes to 0

## PR

**Title:** `feat(domain): expand motorbike catalog to 30+ Vietnam models`

**Body sections:**

```markdown
## Summary
- Expanded motorbikeModels from 4 to ~32 entries covering Honda, Yamaha, Suzuki, Piaggio, VinFast, Dat Bike, Yadea.
- Realistic 2025/2026 VND prices, residuals, L/100km, maintenance.
- New Vitest coverage for catalog integrity.

## Test plan
- [ ] Picker shows 30+ models in the customer app.
- [ ] Switching motorbike updates fuel + amortization in the live calculator.

## Notes
- Closes Notion O4.
- Follow-up: add kwh/100km field for EVs and wire electricity cost through the engine.
```
