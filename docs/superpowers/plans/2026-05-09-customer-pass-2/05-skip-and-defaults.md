# 05 · Skip & try with defaults

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans`.

**Goal:** First-time visitors see a small banner above the calculator that explains "Bạn đang xem dữ liệu mẫu — kéo các thanh để xem con số của riêng bạn." Two CTAs: "Bắt đầu thiết lập" (placeholder; opens a stub modal) and "Bỏ qua, dùng mẫu". Either choice persists in localStorage so the banner doesn't reappear.

**Notion task ID:** O7 (page_id `35b745ac-054b-81a7-bdd4-c37051765411`) — flip to `In progress` then `Done`.

**Branch:** `feat/welcome-banner` from `main`.

**Status:** Not done — the welcome banner component and home-page wiring are not present.

**Depends on:** plan 00 (design system) — recommended so the banner uses the prototype's tokens.

**Design reference:** [`./index.html`](../../../../index.html). Match the prototype's `.headline-strip` styling — dark inked card with lime pill, mono caption, and the playful coral/grape blooms in the body background. The CTAs should use the same brutal button style as everything else.

---

## Context

The customer home page lands directly on the calculator with default values (Honda Vision · 280 km/month · 14 rainy days · 3 coffee/week · 20 M VND salary). New visitors don't know the numbers are samples vs. their real life. A welcome banner converts the page into a soft onboarding moment without forcing the user through a multi-step flow.

## Architecture decisions

- **localStorage only** for the dismissed flag. Key: `commute-iq:welcome-dismissed` = `"1"`.
- **No modal yet** for "Bắt đầu thiết lập" — show a placeholder toast or a small inline "Coming soon" hint. Full onboarding is a separate Notion task (O1 / O2 / O8).
- **Hydration-safe** — read localStorage in `useEffect`, render `null` until checked.

---

## Task 1 · Welcome banner component

**Files:**
- Create: `apps/customer/components/welcome-banner.tsx` (client component)

- [ ] On mount, read `localStorage.getItem("commute-iq:welcome-dismissed")`. If `"1"`, return `null`.
- [ ] Otherwise render a `<Card>` with:
  - Title: "Bạn đang xem dữ liệu mẫu"
  - Body: "Kéo các thanh ở bên dưới để xem chi phí đi lại thật của bạn."
  - Two buttons:
    - Primary: "Bắt đầu thiết lập" → for now, just sets the dismissed flag and shows an alert / inline note "Onboarding flow coming soon — slider sẵn rồi nhé."
    - Secondary: "Bỏ qua, dùng mẫu" → sets the dismissed flag and unmounts the banner.
- [ ] Banner has a small "x" close affordance in the top-right that also dismisses.

## Task 2 · Wire into home page

**Files:**
- Modify: `apps/customer/app/page.tsx`

- [ ] Render `<WelcomeBanner />` immediately above `<TrueCostCalculator />`. The banner self-hides if dismissed; the calculator never shifts.

## Task 3 · Edge cases

- [ ] If localStorage isn't accessible (private browsing, SSR), default to **showing** the banner (better UX than hiding it).
- [ ] No SSR/hydration warning: only run the localStorage read inside `useEffect`, render `null` on first paint.

---

## Verification

- [ ] `npm test` — still green
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] `npm run dev:customer`:
  - Fresh tab (or `localStorage.clear()`): banner shows above calculator.
  - Click "Bỏ qua, dùng mẫu" → banner disappears.
  - Reload → banner stays gone.
  - In DevTools, `localStorage.removeItem("commute-iq:welcome-dismissed")` then reload → banner reappears.

## PR

**Title:** `feat(customer): welcome banner with skip + dismiss persistence`

**Body sections:**

```markdown
## Summary
- New WelcomeBanner client component above the True Cost calculator.
- Two CTAs: "Bắt đầu thiết lập" (placeholder for full onboarding) and "Bỏ qua, dùng mẫu".
- Both persist a localStorage flag so the banner doesn't reappear.

## Test plan
- [ ] Fresh tab → banner visible.
- [ ] Click skip → banner gone, persisted across reloads.
- [ ] Clear localStorage → banner returns.

## Notes
- Closes Notion O7.
- Full onboarding flow (motorbike picker step, address step) is a separate later task.
```
