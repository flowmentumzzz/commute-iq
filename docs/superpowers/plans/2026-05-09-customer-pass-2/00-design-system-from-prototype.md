# 00 · Port the prototype design system into `packages/ui`

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans`. **Do this first** if you can — every other plan in this folder will look better against the prototype design language.

**Goal:** Make the customer (and CRM) apps visually match `./index.html` — the neo-brutalist prototype that defines the product. Port the prototype's color palette, typography, shadow language, and core component styling into `packages/ui` and the Tailwind configs so plans 01–05 inherit a consistent look without re-deriving it.

**Notion task ID:** none directly — this is a design-system implementation task that supports the visual goal of "build the product following the prototype."

**Branch:** `feat/design-system-prototype` from `main`.

**Status:** Done — prototype tokens, fonts, Tailwind colors/shadows, and shared UI component restyles are present in the local workspace.

**Depends on:** none. **Recommended to land before plans 01–05.** Existing customer features (calculator, money leak, dark mode) are easy to retheme afterward.

---

## Design reference

`./index.html` at the repo root is the canonical visual + interaction reference. **Every styling decision in plans 00–05 should be cross-checked against this file.** Open it in a browser to see the live prototype.

Key prototype facts to mirror:

- **Palette** (CSS variables in `:root` of the prototype):
  - `--bg: #FFF6E5` (warm cream)
  - `--bg-2: #FFE8B0`
  - `--ink: #1A1A1A` (near-black, used for text + borders)
  - `--ink-soft: #4A4A4A`
  - `--paper: #FFFDF7` (off-white card surface)
  - `--lime: #D7FF3D` (primary accent)
  - `--coral: #FF6B5C` (secondary accent / alerts)
  - `--grape: #6E5BFF`, `--sky: #6CC8FF`, `--leaf: #2BB673`, `--rose: #FF9CC1` (data viz + chip variants)
- **Fonts:**
  - Display / headings: **Bricolage Grotesque** (400–800)
  - Body: **Be Vietnam Pro** (400–800) — covers Vietnamese diacritics
  - Labels / monospace: **DM Mono** (400, 500)
- **Shadows:** hard black offsets, no blur:
  - `--shadow: 4px 4px 0 0 var(--ink)`
  - `--shadow-sm: 2px 2px 0 0 var(--ink)`
  - `--shadow-lg: 6px 6px 0 0 var(--ink)`
- **Borders:** thick `2.5px solid var(--ink)` on cards, buttons, chips. Generous border-radius (14–28px).
- **Background bloom:** body has soft radial gradients in rose / sky / lime at low opacity. Decorative, not structural.

The prototype's phone shell is **not** something to reproduce literally on desktop. Use the design language; let layout adapt to web/PWA.

---

## Architecture decisions

- **Tokens in `packages/ui/src/styles/globals.css`** so customer + CRM share them.
- **Fonts via `next/font/google`** in each app's `layout.tsx`. Variable-axis fonts where supported.
- **`packages/ui` Card / Button / Badge** rewritten to the neo-brutalist style (thick border, hard shadow, no `shadow-sm`).
- **Dark mode** must keep working (S5 already shipped). Map dark equivalents: ink swaps to a warm off-white, paper swaps to deep brown. Match Vietnamese dusk vibes, not generic dark-mode gray.
- **Accent uses lime as primary**, coral for alerts. The current "dark green primary" is replaced.

---

## Task 1 · Tailwind palette + shadows

**Files:**
- Modify: `packages/ui/src/styles/globals.css`
- Modify: `apps/customer/tailwind.config.ts`
- Modify: `apps/crm/tailwind.config.ts`

- [ ] In `globals.css`, replace the `:root` block with prototype HSLs:
  - `--background: 43 100% 95%;` (≈ #FFF6E5)
  - `--foreground: 0 0% 10%;`
  - `--card: 45 100% 99%;`
  - `--primary: 73 100% 62%;` (≈ #D7FF3D lime)
  - `--primary-foreground: 0 0% 10%;`
  - `--secondary: 36 100% 84%;` (≈ #FFE8B0)
  - `--accent: 7 100% 68%;` (coral)
  - `--ink: 0 0% 10%;` (extra token)
  - Border + ring still tied to ink.
- [ ] Add `.dark` overrides keeping the same hue families but inverted lightness.
- [ ] Add custom Tailwind theme tokens for hard shadows: `boxShadow: { 'brutal': '4px 4px 0 0 hsl(var(--foreground))', 'brutal-sm': '2px 2px 0 0 hsl(var(--foreground))', 'brutal-lg': '6px 6px 0 0 hsl(var(--foreground))' }`.
- [ ] Add color tokens for `lime`, `coral`, `grape`, `sky`, `leaf`, `rose` so non-shadcn data-viz elements can use them.

## Task 2 · Fonts

**Files:**
- Modify: `apps/customer/app/layout.tsx`
- Modify: `apps/crm/app/layout.tsx`
- Modify: both `tailwind.config.ts`

- [ ] Use `next/font/google`:
  ```ts
  import { Bricolage_Grotesque, Be_Vietnam_Pro, DM_Mono } from "next/font/google";
  const display = Bricolage_Grotesque({ subsets: ["latin", "vietnamese"], variable: "--font-display" });
  const body = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["400","500","600","700","800"], variable: "--font-body" });
  const mono = DM_Mono({ subsets: ["latin", "vietnamese"], weight: ["400","500"], variable: "--font-mono" });
  ```
- [ ] Apply `${display.variable} ${body.variable} ${mono.variable}` to `<html>` className.
- [ ] In `tailwind.config.ts`, set `fontFamily.display = ["var(--font-display)"]`, `sans = ["var(--font-body)"]`, `mono = ["var(--font-mono)"]`.

## Task 3 · Component restyle

**Files:**
- Modify: `packages/ui/src/components/card.tsx`
- Modify: `packages/ui/src/components/button.tsx`
- Modify: `packages/ui/src/components/badge.tsx`

- [ ] **Card:** `border-2 border-foreground rounded-2xl bg-card shadow-brutal`. Remove `border-border` if it dilutes contrast. CardTitle uses `font-display font-bold`.
- [ ] **Button:** `border-2 border-foreground rounded-full font-display font-semibold shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal active:shadow-none active:translate-x-[2px] active:translate-y-[2px]` on the primary variant. Other variants follow the same offset-on-hover pattern.
- [ ] **Badge:** `border-2 border-foreground rounded-full font-mono uppercase tracking-wider px-2.5 py-0.5 text-[10px]`. Variants: `default` (lime fill), `secondary` (paper fill), `destructive` (coral fill).

## Task 4 · Page background bloom

**Files:**
- Modify: `apps/customer/app/page.tsx`

- [ ] Replace the existing gradient with the prototype's body background:
  ```css
  bg-[radial-gradient(circle_at_8%_12%,rgba(255,156,193,.32)_0,transparent_28%),radial-gradient(circle_at_92%_78%,rgba(108,200,255,.28)_0,transparent_32%),radial-gradient(circle_at_50%_100%,rgba(215,255,61,.22)_0,transparent_38%)] bg-background
  ```
- [ ] Update typography: section headings use `font-display`, KPI numbers use `font-display font-black`, mono labels use `font-mono uppercase tracking-wider`.

## Task 5 · Calculator restyle

**Files:**
- Modify: `apps/customer/components/true-cost-calculator.tsx`

- [ ] Apply neo-brutalist styling: thick borders, hard shadows on the hero card, lime accent on the hero number, coral chip for the "Money Leak" label.
- [ ] Range slider track uses `bg-muted` with `accent-primary` (lime thumb).
- [ ] Hero number uses `font-display font-black tracking-tight`. Match the prototype's "1.700.000đ/tháng" treatment.

## Task 6 · Restyle existing components

**Files:**
- Modify: `apps/customer/components/money-leak-spotlight.tsx`
- Modify: `apps/customer/components/theme-toggle.tsx`
- Modify: `apps/customer/components/commute-breakdown-chart.tsx`

- [ ] Money Leak hero card: coral background with paper foreground, lime accent for the savings number — mirror the prototype's `.leak-hero` block.
- [ ] Theme toggle: rounded-full with brutal shadow.
- [ ] Pie chart: replace generic colors with `lime / coral / sky / rose / leaf` from the new tokens.

## Task 7 · Verify both modes

- [ ] Light mode renders cream paper, lime accents, coral hero — matches prototype.
- [ ] Dark mode flips to warm off-white text on deep ink — still readable, still neo-brutalist (borders + shadows visible).

---

## Verification

- [ ] `npm test` — green
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] `npm run dev:customer` → side-by-side compare with `./index.html` (open both in browser tabs). Cards, buttons, fonts, palette, shadows should feel like the same product.
- [ ] Toggle dark mode → palette inverts but neo-brutalist style holds.

## PR

**Title:** `feat(ui): port prototype design system (neo-brutalist palette, fonts, shadows)`

**Body sections:**

```markdown
## Summary
- Tokens in packages/ui/src/styles/globals.css now match index.html (lime, coral, grape, sky, leaf, rose; hard shadow tokens).
- next/font/google: Bricolage Grotesque (display), Be Vietnam Pro (body), DM Mono (mono) wired into customer + CRM layouts.
- Card / Button / Badge in packages/ui restyled with thick borders + hard shadows.
- Customer home page, calculator, money leak card, theme toggle restyled.

## Test plan
- [ ] Side-by-side with index.html: palette + fonts + shadow language match.
- [ ] Dark mode still works.

## Notes
- index.html is preserved at repo root as the design reference for the rest of customer-pass-2.
```
