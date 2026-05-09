# 08 · Manager dashboard (HR / Finance) in `apps/crm`

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans`.

**Goal:** Replace `apps/crm/app/page.tsx` with the prototype's manager dashboard: company-leak hero, 4-card KPI row, claims-review table with status flags + approve actions, leak-patterns list, and a 12-week activity heatmap. The "Why us" comparison panel is included so the dashboard doubles as the demo's closing story.

**Notion task IDs:** none yet — open a new task "Manager dashboard (HR/Finance)" under the CRM/B2B epic and link it here.

**Branch:** `feat/manager-dashboard` from `main`.

**Depends on:**
- Plan 00 (design system) — required. The dashboard is a dense neo-brutalist surface; without the tokens it looks generic.
- Plan 01 (auth) — recommended. The dashboard should require a manager-role session in production; for now, gate behind a `?demo=1` query param or a `MANAGER_DEMO_ALLOW=true` env var so the hackathon demo doesn't need real role tables.
- Plan 04 (manual trip entry) — optional. Real claim rows make the table more convincing; otherwise mocks are fine.

**Design reference:** [`./index.html`](../../../../index.html) — the right column under `<div class="surface-label">Bảng quản lý · HR / Finance</div>`, the `<div class="dash">` block, and the `<div id="view-why">` panel below it.

---

## Context

`apps/crm/app/page.tsx` currently shows a stub "Commute Ops" page (badge, demo cost, three metric cards, a transaction-review queue, a static-lookup card). It is not what the prototype shows to managers. The prototype's manager dashboard is the B2B demo surface — the moment in the pitch where the data flywheel becomes obvious.

What the prototype shows (rebuild this 1:1):

1. **Header** — `FPT Software · HCM` company name, "HR · Tháng 5 / 2026" subtitle, "Xuất CSV" + "Duyệt tất cả ✓" buttons.
2. **Company leak hero** — ink card with coral blob, "✨ COMPANY MONEY LEAK" badge, headline ("Tháng này, công ty chi 14 triệu hỗ trợ đi lại — và 8% là chi sai pattern"), a bordered stat block on the right showing `1.18M · rò rỉ phát hiện được`.
4. **KPI row** — 4 cards: Tổng chi (paper), Đã duyệt (lime), Cần xem (rose), Đánh dấu (sky). Each shows label + big Bricolage value + delta caption.
5. **Two-column grid:**
   - Left: claims table (avatar + name/role + route/mode + amount + status flag + approve button per row).
   - Right (stacked): leak-patterns list (numbered, coral/bg-2/sky badges), 12-week activity heatmap.
6. **"Why us" panel** below the dashboard — vs-table comparing Commute.vn vs MoMo / Money Lover, plus a 3-card grid of differentiators.

## Architecture decisions

- **Server-first.** The dashboard is a server component. Reads either from Supabase (when manager auth exists) or from a `mockManagerDashboard` export in `@commute-iq/domain` (the path used here). Keep the mock and real paths behind a single `getManagerDashboardData()` so swapping later is a single file change.
- **Tailwind only.** No prototype-style global CSS classes (`.kpi`, `.claim-row`, etc). Build with Tailwind utilities + plan-00 tokens (`bg-card`, `border-foreground`, `shadow-brutal`, `bg-lime`, `bg-coral`, `text-paper`, fonts).
- **Heatmap is data-driven.** A 7×12 grid (rows = day-of-week, cols = week). Each cell takes a level 0–4 + an optional `flag` boolean. Render as `<div>`s with the prototype's color ramp (transparent → leaf shades → coral for flagged anomalies).
- **Approve action is a stub.** Approving a row optimistically toggles its flag to "approved" client-side and POSTs to `/api/manager/claims/approve` which returns `{ success: true }` for now. Real workflow lands when the reimbursement-policy backend ships.
- **"Why us" is a route, not a tab toggle.** The prototype hides/shows it via the topbar nav-tabs. On web, put it on `/dashboard/why` so it has a real URL for the demo deck. Link from the dashboard header.

---

## Task 1 · Mock dashboard data in the domain package

**Files:**
- Create: `packages/domain/src/manager-dashboard.ts`
- Modify: `packages/domain/src/index.ts` (re-export)
- Create: `packages/domain/src/manager-dashboard.test.ts`

- [ ] Define types:
  ```ts
  type ClaimFlag = "ok" | "warn" | "bad" | "approved";
  interface ClaimRow {
    id: string;
    employeeName: string;
    employeeRole: string;
    avatarColor: "rose" | "lime" | "sky" | "bg-2" | "coral" | "leaf" | "grape";
    route: string;
    mode: string;
    amountVnd: number;
    flag: ClaimFlag;
  }
  interface LeakPattern {
    rank: 1 | 2 | 3;
    severity: "high" | "warn" | "info";
    title: string;
    detail: string;
  }
  interface HeatmapCell { level: 0 | 1 | 2 | 3 | 4; flag?: boolean }
  interface ManagerDashboardData {
    company: { name: string; period: string };
    leak: { spendVnd: number; offPatternPct: number; caughtVnd: number };
    kpis: { totalSpendVnd: number; approvedCount: number; approvedTotal: number; needsReviewCount: number; flaggedCount: number; employees: number };
    claims: ClaimRow[];          // ≥ 6 rows mirroring the prototype
    leakPatterns: LeakPattern[]; // 3 entries
    heatmap: HeatmapCell[][];    // 7 rows × 12 cols
  }
  ```
- [ ] Export `mockManagerDashboard: ManagerDashboardData` populated to match the prototype's numbers (FPT Software · HCM, 14.2M total, 1.18M caught, 6 example employees with names from the prototype, 3 leak patterns, a heatmap with 4–6 flagged cells distributed plausibly).
- [ ] Export `getManagerDashboardData(): Promise<ManagerDashboardData>` that returns the mock for now. Document inline that this is the swap point for real data.
- [ ] Test: `mockManagerDashboard.heatmap` is exactly 7×12; total of `kpis.approvedCount + needsReviewCount + flaggedCount ≤ pending+done counts`; every avatarColor is a valid token.

## Task 2 · Dashboard layout shell

**Files:**
- Modify: `apps/crm/app/page.tsx` (replace existing stub)
- Create: `apps/crm/components/dashboard/header.tsx`
- Create: `apps/crm/components/dashboard/company-leak.tsx`
- Create: `apps/crm/components/dashboard/kpi-row.tsx`

- [ ] Page is a server component. Calls `getManagerDashboardData()`.
- [ ] Background: `bg-background` with the prototype's body-bloom radial gradients (re-use the bg utility from plan 00 / `apps/customer/app/page.tsx`).
- [ ] Top wrapper: `<div class="dash">` equivalent — `border-2 border-foreground rounded-3xl bg-card shadow-brutal overflow-hidden`.
- [ ] **Header** matches `.dash-header`: bg-2 background, border-bottom 2px ink. Left side: `<h2>FPT Software · HCM</h2>` (font-display, 800) + DM Mono "HR · Tháng 5 / 2026". Right side: secondary "Xuất CSV" button + primary "Duyệt tất cả ✓" button + a small "Vì sao là tụi mình →" link to `/dashboard/why`.
- [ ] **Company leak** matches `.company-leak`: ink card with coral blob, "✨ COMPANY MONEY LEAK" lime-on-ink badge, h3 ("Tháng này, công ty chi `<em>14 triệu</em>` hỗ trợ đi lại — và 8% là chi sai pattern" — `<em>` styled coral pill), supporting paragraph. Right column inside the card: bordered translucent stat block with `1.18M` in lime + "rò rỉ phát hiện được" caption.
- [ ] **KPI row** matches `.kpi-row`: grid of 4. Cards: paper / lime / rose / sky backgrounds, each with DM Mono label, Bricolage 800 value (with tiny suffix span), DM Mono delta caption.

## Task 3 · Claims table panel

**Files:**
- Create: `apps/crm/components/dashboard/claims-table.tsx`
- Create: `apps/crm/components/dashboard/claims-table-row.tsx` (client — optimistic approve)
- Create: `apps/crm/app/api/manager/claims/approve/route.ts`

- [ ] Panel matches `.panel` + `.claims-table`. Header: "Yêu cầu hoàn phí gần đây" + DM Mono `8 / 118` meta on the right.
- [ ] Header row matches `.claims-thead` — DM Mono uppercase tracking-wide labels, ink underline.
- [ ] Each row matches `.claim-row`:
  - 30px avatar circle, ink border, background = avatar color token, first letter of given name in Bricolage 700.
  - Name strong (font-display) + DM Mono role caption.
  - Route line: from-to (medium) + DM Mono mode line.
  - Amount in Bricolage 700.
  - Flag chip: lime "✓ ok" / bg-2 "⚠ xem" / coral "✗ sai mode" / leaf "✓ approved". Border 1.5px ink (paper text on coral/leaf).
  - Action button: "Duyệt" on `ok`, "Xem" on `warn`/`bad`, disabled "Approved" on `approved`.
- [ ] Approve action: client component flips local flag to `approved`, POSTs `/api/manager/claims/approve` with `{ id }`. On error: revert + toast.
- [ ] Approve route: validate `{ id: string }` with Zod, return `{ success: true }`. Real persistence is a follow-up.

## Task 4 · Leak patterns + heatmap panels

**Files:**
- Create: `apps/crm/components/dashboard/leak-patterns.tsx`
- Create: `apps/crm/components/dashboard/heatmap.tsx`

- [ ] **Leak patterns panel** matches `.panel` + `.leak-list`. Header: "Pattern rò rỉ" + DM Mono "auto-dò".
- [ ] Each item: numbered chip (1/2/3), color matches severity (`high` = coral with paper text, `warn` = bg-2, `info` = sky). Body: strong title + DM Mono detail.
- [ ] **Heatmap panel** matches `.heatmap`. Header: "Hoạt động 12 tuần" + DM Mono "đỏ = bất thường".
- [ ] Grid: `grid-cols-[28px_repeat(12,1fr)] gap-[3px]`. First column = day-of-week DM Mono labels (T2, T3, T4, T5, T6, T7, CN). Cells: `aspect-square rounded-[3px]`. Color ramp: `level=0 → bg-foreground/5 border-foreground/5`, `1 → bg-leaf/25`, `2 → bg-leaf/50`, `3 → bg-leaf/75`, `4 → bg-leaf`. `flag=true` → `bg-coral border-foreground`.
- [ ] Footer legend: DM Mono "ít" → "nhiều ←".

## Task 5 · "Why us" route

**Files:**
- Create: `apps/crm/app/dashboard/why/page.tsx`
- Create: `apps/crm/components/dashboard/why-panel.tsx`

- [ ] Route renders the `<WhyPanel />` standalone (no dashboard wrapper). Matches `.why-panel`: ink card with coral + grape blobs, h2 "Sao không phải MoMo hay Money Lover?" with `<em>` ink-on-lime pills, DM Mono "// thẳng thật" subtitle.
- [ ] **vs-table**: 3 columns × 5 rows (header + 4 dimensions). Border `1.5px` translucent white. Header row has slight bg, second column highlighted with lime-tinted bg + lime header text.
- [ ] **why-grid**: 3 cards (`.why-card`), each with a lime-on-ink icon chip (with brutal shadow), Bricolage h4, body copy. Pull all four data rows + three card copies from the prototype verbatim.
- [ ] Add a "← Quay lại bảng" link back to `/`.

## Task 6 · Auth gate (demo-friendly)

**Files:**
- Modify: `apps/crm/app/page.tsx`
- Modify: `apps/crm/app/dashboard/why/page.tsx`

- [ ] If `process.env.MANAGER_DEMO_ALLOW === "true"` OR the request has `?demo=1`, skip auth (hackathon demo path).
- [ ] Otherwise, require a signed-in user (using the same `createServerSupabaseClient` pattern as the customer app). Redirect to `/sign-in` when missing. Real role-based gating (only `profiles.role = 'manager'`) is a follow-up.
- [ ] Document both paths in the PR description.

## Task 7 · Tests

**Files:**
- Create: `apps/crm/app/__tests__/page.test.tsx`
- Create: `packages/domain/src/manager-dashboard.test.ts` (already mentioned in Task 1)

- [ ] Page test: renders header, KPI row with 4 cards, claims table with at least 6 rows, leak-patterns with 3 items, heatmap 7×12. Uses the mock data so the test is deterministic.
- [ ] Heatmap test: counts flagged cells, asserts they appear and that level cells get the right CSS class.

---

## Verification

- [ ] `npm test` — green (covers domain mock + page render)
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] `MANAGER_DEMO_ALLOW=true npm run dev:crm` (or use `?demo=1`) → open `http://localhost:3001`. Dashboard renders matching the prototype's right column.
- [ ] Click "Duyệt" on an `ok` row → flag flips to `approved` + button disables.
- [ ] Click "Vì sao là tụi mình →" → `/dashboard/why` opens with the vs-table and 3-card grid.
- [ ] Side-by-side compare with the prototype's `<div class="dash">` and `<div id="view-why">` blocks — matches.

## PR

**Title:** `feat(crm): manager dashboard with claims table, leak patterns, heatmap, and "why us" panel`

**Body sections:**

```markdown
## Summary
- Replace apps/crm stub home with the prototype's manager dashboard.
- New packages/domain mockManagerDashboard + getManagerDashboardData() data layer.
- Header / company-leak / KPI row / claims table / leak patterns / heatmap.
- /dashboard/why route with vs-table + 3-card differentiator grid.
- Approve action wired to POST /api/manager/claims/approve (stub).

## Test plan
- [ ] Open with MANAGER_DEMO_ALLOW=true or ?demo=1 → dashboard matches prototype.
- [ ] Approve action optimistically updates the row.
- [ ] /dashboard/why renders the comparison.

## Notes
- Closes the manager-dashboard surface gap identified in customer-pass-2 review.
- Real role-based auth (profiles.role = 'manager') and persistent approval state are follow-ups.
```
