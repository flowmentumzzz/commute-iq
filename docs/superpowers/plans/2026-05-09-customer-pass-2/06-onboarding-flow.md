# 06 · Multi-step onboarding flow

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans`.

**Goal:** Build the three-step onboarding from the prototype: welcome → home/office locations → primary transport mode → land on the calculator with the user's real profile saved. After plan 01 (auth) lands, the auth callback routes new users into this flow; existing users skip straight to home.

**Notion task IDs:**
- O7 expansion (the welcome banner from plan 05 is the dismissible/skip path; this plan is the **full** onboarding flow that page 05's "Bắt đầu thiết lập" CTA opens)
- O8 (page_id `35b745ac-054b-8151-b239-e92bf6170426`) — edit onboarding mid-flight uses the same UI; flip to `Done` after this PR
- New: this plan also captures the "signup destination" decision documented in the Notion-vs-prototype gap.

If your Notion has separate task IDs for O1 (address autocomplete), O2 (map picker), or O3 (real distance calc), **leave those as Not started**. They're tracked in plan 07 as upgrades to the text-only locations step shipped here.

**Branch:** `feat/onboarding-flow` from `main`.

**Status:** Not done — the onboarding route, step components, save-profile action, auth-callback stitch, and tests are not present.

**Depends on:**
- Plan 00 (design system) — strongly recommended for visual consistency.
- Plan 01 (auth) — required. The callback in plan 01 needs to know whether the signed-in user has completed onboarding (does a `commute_profiles` row exist for them?). If yes → `/`. If no → `/onboarding`.

**Design reference:** [`./index.html`](../../../../index.html) — open it and run through the welcome → setup-loc → setup-mode flow on the left phone. This plan implements **the same three steps** as web pages, with the prototype's neo-brutalist treatment (lime CTAs, paper cards, ink borders, Bricolage Grotesque headings). The progress indicator has **3 dots** (one per step), matching `.progress` in the prototype. Save happens at the end of step 3 — there is no separate "review" step in the prototype, and we don't add one.

---

## Context

The current customer home page **is** the calculator. New users land directly on it with default values. The prototype's design intent is that new users go through a quick guided setup first so the calculator opens with their real data, not the demo defaults.

What needs to be captured in onboarding (matches the prototype exactly — no extra fields):

- Home address label + district
- Office address label + district
- Primary transport mode (motorbike / Grab-Be / bus / bike-walk)
- If motorbike: which model (consumed from `motorbikeModels` in `@commute-iq/domain`) — optional, the prototype doesn't gate on this.

City (HCMC vs Hà Nội), salary, and any other profile detail are **not** captured here. The prototype's onboarding doesn't ask for them; they live elsewhere (city is inferred from district choices; salary is a Profile-tab edit + the playground calculator's slider).

Schema reminder (already exists in `supabase/migrations/`):

```text
commute_profiles
  id uuid pk
  user_id uuid fk profiles(id)
  home_label text
  work_label text
  primary_transport text  -- 'motorbike' | 'grab_be' | 'bus' | 'mixed'
  vehicle_model text       -- nullable
  salary_monthly_vnd int   -- nullable
  created_at timestamptz
```

There are **no fields yet** for home/work district, lat/lng, or motorbike model id (`vehicle_model` is a free-text string). We'll use the existing fields as-is: store district/coords only on the client for now, or extend the schema in a follow-up plan if needed.

## Architecture decisions

- **Three-step page at `/onboarding`** with client-side step state (no separate URLs per step — keeps routing simple, lets the form persist mid-flight in `useState`). Steps: `welcome` → `locations` → `transport`. Save happens at the end of `transport` and routes to `/`.
- **Server action** to save the profile — uses the cookie-aware Supabase client from plan 01. No need to add a NestJS endpoint just for this.
- **Resume mid-flight** — if the user closes the tab and comes back, the next visit re-enters at the last unfinished step using a `commute-iq:onboarding-progress` localStorage key.
- **Skip path** — the welcome banner from plan 05 still works. "Bỏ qua, dùng mẫu" sets the dismissed flag and **does not** mark `commute_profiles` saved, so the auth callback won't push them back into onboarding next sign-in either (we treat banner-dismissed === has-decided).
- **Edit later (O8)** — `/onboarding?edit=1` reuses the same flow but loads existing profile values and updates instead of inserts. Linked from the Profile tab (plan 07).
- **Text-only addresses for now**. A later autocomplete/map-picker plan upgrades this to VietMap/Google Places.

---

## Task 1 · Update plan 01 callback (cross-plan stitch)

**Files:**
- Modify: `apps/customer/app/auth/callback/route.ts` (file created in plan 01)

If plan 01 has not landed yet, do the work there. If it already landed, this PR adjusts its callback.

- [ ] After `exchangeCodeForSession`, look up `commute_profiles` row for the user.
- [ ] If a row exists → redirect to `/` (or `next` query param if safe).
- [ ] If no row → redirect to `/onboarding`.
- [ ] Profile (`profiles` table) upsert is unchanged — that always runs.

## Task 2 · Onboarding shell + step state

**Files:**
- Create: `apps/customer/app/onboarding/page.tsx` (server component)
- Create: `apps/customer/app/onboarding/onboarding-flow.tsx` (client component)
- Create: `apps/customer/app/onboarding/types.ts`

- [ ] Server page checks the user. If signed out → redirect to `/sign-in?next=/onboarding`. If signed in and `commute_profiles` row already exists and no `?edit=1` → redirect to `/`.
- [ ] Server page renders `<OnboardingFlow initialProfile={...} editing={...} />` inside a centered single-column layout (paper card on body bloom, mirroring the prototype phone-shell ob-illu). No phone-shell mockup — desktop layout is fine.
- [ ] `OnboardingFlow` holds:
  ```ts
  type Step = "welcome" | "locations" | "transport";
  interface DraftProfile {
    homeLabel: string;
    homeDistrict: string;
    workLabel: string;
    workDistrict: string;
    primaryTransport: "motorbike" | "grab_be" | "bus" | "bike_walk";
    vehicleModelId?: string;
  }
  ```
- [ ] State persists to `localStorage` under `commute-iq:onboarding-progress` on every change. Restored on mount.
- [ ] A progress indicator at the top: **3 dots** (welcome, locations, transport). Filled dots match the prototype's `.progress` block.

## Task 3 · Step 1: Welcome

**Files:**
- Create: `apps/customer/app/onboarding/steps/welcome-step.tsx`

- [ ] Hero illustration: port the prototype's `.ob-illu` SVG (the laptop+motorbike+coffee+fuel scene) verbatim. Keep the lime / coral / paper / sky / rose palette.
- [ ] Headline matches prototype: `Tiền đi lại,<br>nhìn rõ <span class='hl'>trong 30 giây</span>` — `.hl` is the lime highlight pill.
- [ ] Body matches prototype: "Không cần gõ tay. App tự nhận xe máy, Grab, gửi xe, cà phê dọc đường — và chỉ ra chỗ tiền đang chảy."
- [ ] CTAs match prototype: primary "Bắt đầu →" advances to locations step; secondary "Tôi đã có tài khoản" goes to `/sign-in` (only relevant if the user accidentally landed here while signed out — usually they're already authed at this point).
- [ ] **No city dropdown.** The prototype welcome screen has only the illustration, headline, body, and two buttons. Don't add fields here.

## Task 4 · Step 2: Locations

**Files:**
- Create: `apps/customer/app/onboarding/steps/locations-step.tsx`

- [ ] Two cards mirroring the prototype's `.loc-card`:
  - 🏠 Home: text input for address label, district select (Q.1, Q.3, Q.5, Q.7, Q.10, Bình Thạnh, Tân Bình, Phú Nhuận, Thủ Đức, Bình Tân — extend per city).
  - 🏢 Office: same shape.
- [ ] Both fields required to advance.
- [ ] Footer note: "🔒 Vị trí chỉ lưu để app tính chi phí — không gửi đi đâu khác." (Match the prototype's privacy reassurance.)
- [ ] CTA "Tiếp →" advances to transport step. "Quay lại" goes back to welcome.

## Task 5 · Step 3: Transport mode (and save)

**Files:**
- Create: `apps/customer/app/onboarding/steps/transport-step.tsx`
- Create: `apps/customer/app/onboarding/save-profile.ts` (server action)

- [ ] Four `.mode-chip` cards matching the prototype exactly: 🛵 Xe máy / 🚖 Grab / Be / 🚌 Buýt / Metro / 🚲 Xe đạp / Đi bộ. Mirror the prototype's `.mode-grid` 2×2 layout. Selected chip uses coral background with paper text (matches `.mode-chip.on`).
- [ ] If "Xe máy" is selected, expand a motorbike model select underneath, populated from `motorbikeModels` (from `@commute-iq/domain`). Optional — user can pick "Tôi điền sau".
- [ ] Info tip at the bottom matches the prototype's `.info-tip` *verbatim*: "App hiểu **chuyến hỗn hợp** — ví dụ: xe máy → gửi xe → cà phê → văn phòng. Đó là chuyện thường ngày ở Sài Gòn." (dashed ink border, bg-2 fill, light-bulb icon).
- [ ] CTA matches prototype: "Vào app 🚀" — on click, calls the server action `saveProfile(draft)`. **No separate review step.**
- [ ] **No salary slider.** Salary lives on the playground calculator and the Profile tab; onboarding mirrors the prototype which doesn't ask for it.
- [ ] Server action `saveProfile(draft)`:
  1. Validate `draft` with Zod (empty home/work labels rejected; transport mode constrained to the 4 valid values; vehicleModelId optional but if set must exist in `motorbikeModels`).
  2. `createServerSupabaseClient().auth.getUser()` — bail with redirect to `/sign-in` if no user.
  3. Insert (or update if `?edit=1`) `commute_profiles` row using `home_label = "${homeLabel} · ${homeDistrict}"`, `work_label = "${workLabel} · ${workDistrict}"`, `primary_transport`, `vehicle_model = vehicleModelId ?? null`. Schema currently has no district columns — concatenating into the label is the lossless workaround.
  4. Client clears `localStorage["commute-iq:onboarding-progress"]` after the action resolves.
  5. Redirect to `/`.

## Task 6 · Edit later from Profile tab

**Files:**
- Modify or Create: `apps/customer/components/profile/profile-card.tsx` (created in plan 07)

- [ ] When signed in, the Profile tab's commute-profile card has a "Sửa thiết lập đi lại →" link to `/onboarding?edit=1`.
- [ ] If plan 07 has not landed yet, fall back to a small link near `<AuthStatus />` on the calculator page so the route is reachable.

## Task 7 · Unsigned-in path

**Files:**
- Modify: `apps/customer/app/page.tsx` (uses the welcome banner from plan 05)

- [ ] If the user is signed out, the home page keeps showing the calculator with default values plus the welcome banner from plan 05. The banner's "Bắt đầu thiết lập" CTA points at `/sign-in?next=/onboarding` so guests are funneled into auth → onboarding.
- [ ] "Bỏ qua, dùng mẫu" continues to dismiss locally and shows the calculator with defaults — no profile required.

## Task 8 · Tests

**Files:**
- Create: `apps/customer/app/onboarding/__tests__/save-profile.test.ts` (Vitest)

- [ ] Test the Zod validation: rejects empty home_label, rejects unknown transport mode, accepts the happy path.
- [ ] Mock the Supabase client and assert the right insert/update calls.

---

## Verification

- [ ] `npm test` — including the new save-profile test
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] Cold start: clear localStorage + sign out. Click "Bắt đầu thiết lập" on the welcome banner → /sign-in → magic link → /auth/callback → /onboarding step 1 (welcome).
- [ ] Walk through all three steps. The progress indicator shows 3 dots that fill in order. Submit on step 3 → land on `/`.
- [ ] Reload mid-flight (e.g., during step 2) → re-opens at step 2 with values intact.
- [ ] Click "Sửa thiết lập đi lại" from the Profile tab (or fallback link) → `/onboarding?edit=1` opens with values prefilled. Save updates the row.
- [ ] Sign out → home page is calculator-with-defaults plus the welcome banner. "Bỏ qua, dùng mẫu" dismisses cleanly.
- [ ] Side-by-side compare with `./index.html`'s welcome / setup-loc / setup-mode screens — same 3-dot progress, same neo-brutalist treatment, same Vietnamese copy.

## PR

**Title:** `feat(customer): three-step onboarding flow + edit-later`

**Body sections:**

```markdown
## Summary
- New /onboarding 3-step flow (welcome → locations → transport) matching the prototype.
- Save happens at the end of step 3; no separate review step.
- Server action saves to commute_profiles.
- Auth callback (plan 01) routes new users to /onboarding and existing users to /.
- Edit-later link from Profile tab (plan 07) reopens the flow at /onboarding?edit=1.
- Unsigned-in welcome banner (plan 05) "Bắt đầu thiết lập" funnels guests into /sign-in?next=/onboarding.

## Test plan
- [ ] New user: magic link → /onboarding → finish 3 steps → / shows their data.
- [ ] Reload mid-flight → re-enters at the last step with values intact.
- [ ] /onboarding?edit=1 prefills and updates.
- [ ] Sign out → calculator-with-defaults + welcome banner; skip works.

## Notes
- Closes Notion O8 (and is the substantive implementation behind O7's "Bắt đầu thiết lập" CTA).
- O1 / O2 / O3 (autocomplete, map picker, real distance) remain Not started — separate follow-up plan.
- Schema currently stores home/work as `"${label} · ${district}"` strings. A follow-up migration can promote district + coords to columns when needed.
```
