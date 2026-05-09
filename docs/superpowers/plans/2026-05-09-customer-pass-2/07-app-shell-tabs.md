# 07 · App shell + tab navigation (Home / Insights / Claims / Profile)

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans`.

**Goal:** Convert the customer app from a single-screen calculator into the prototype's four-tab employee app. After this lands, signed-in users see a Home tab (greeting + leak hero + month summary + reimburse CTA + today's trip feed), an Insights tab (category breakdown + suggestion), a Claims tab (submit-1-tap card + eligible trips), and a Profile tab (auth status + commute profile + edit-setup link). The True Cost calculator is preserved as a `/playground` route so the educational widget isn't lost.

**Notion task IDs:** none yet — open a new task "App shell + tab navigation" under the customer epic and link it here. This is the substantive surface behind the prototype's `home`, `insights`, `claims`, `profile` screens.

**Branch:** `feat/app-shell-tabs` from `main`.

**Depends on:**
- Plan 00 (design system) — required. Tokens, fonts, brutal Card/Button must be in.
- Plan 01 (auth) — required. Profile tab needs the user; Home greeting reads `profiles.full_name`; Claims tab pulls user-scoped rows.
- Plan 06 (onboarding) — recommended. Home reads `commute_profiles` to render the user's actual home/office labels.
- Plan 04 (manual trip entry) — optional. The Home "Today" feed and the Claims eligible-trips list both consume the same `commute_transactions` rows that plan 04 starts persisting.

**Design reference:** [`./index.html`](../../../../index.html) — the four `data-screen="..."` blocks (`home`, `insights`, `claims`, `profile`) and the `.tab-bar` at the bottom of the phone shell. **Every visual decision in this plan must be cross-checked against those blocks.**

---

## Context

`apps/customer/app/page.tsx` currently *is* the True Cost calculator. There is no nav, no insights screen, no claims screen, no tab bar. The prototype's employee app is multi-screen; this plan rebuilds the customer app to match.

What changes structurally:

- `/` becomes the **Home tab** content (matches `data-screen="home"`).
- `/insights`, `/claims`, `/profile` become routes (each maps to its prototype `data-screen`).
- A persistent **bottom tab bar** is rendered for signed-in users on these four routes.
- The True Cost calculator moves to `/playground` (still public, reachable from Profile and from the welcome banner's "Bắt đầu thiết lập" placeholder before plan 06 lands).

The prototype's tab bar is anchored to the phone-shell bottom. On web, render it as a fixed bottom bar on `md:` and below; on `lg:`, render it as a top-of-content tab strip. Match the prototype's pill-style buttons either way.

## Architecture decisions

- **App Router groups.** Use `apps/customer/app/(app)/...` for the four authed tabs so a shared `layout.tsx` can render the tab bar and the brand topbar without affecting `/sign-in`, `/onboarding`, `/playground`. The `(app)` group's `layout.tsx` redirects unauthenticated users to `/sign-in?next=<current>`.
- **Server-first data.** Each tab's page is a server component that reads Supabase via `createServerSupabaseClient()`. Use small client islands only for interactive bits (claims select-all checkbox, breakdown tab toggle).
- **Stable URLs over modal-y state.** The prototype animates between screens; on web, real routes are better — back button works, deep links work, Vercel URLs work for sharing.
- **Mocks where data isn't real yet.** Month totals, trip feed, eligible claims all read from `@commute-iq/domain` mocks until plan 04 (transactions) and a future reimbursement-policy backend land. Mark mock blocks with a tiny `MOCK` chip in dev only.
- **No Profile tab Supabase writes here** — that's plan 06 (`/onboarding?edit=1`). Profile tab just reads + links.

---

## Task 1 · App route group + shared layout

**Files:**
- Create: `apps/customer/app/(app)/layout.tsx`
- Create: `apps/customer/app/(app)/tab-bar.tsx`
- Create: `apps/customer/app/(app)/topbar.tsx`
- Move: existing `apps/customer/app/page.tsx` content → `apps/customer/app/playground/page.tsx`
- Create: `apps/customer/app/(app)/page.tsx` (new Home tab — see Task 2)

- [ ] `(app)/layout.tsx` is a server component. It calls `createServerSupabaseClient().auth.getUser()`. If signed out, `redirect("/sign-in?next=/")`. If signed in, render `<Topbar />` + `{children}` + `<TabBar active={...} />`.
- [ ] `<TabBar />` is a client component (active-route awareness via `usePathname`). Four buttons: Home (`/`), Insights (`/insights`), Claims (`/claims`), Profile (`/profile`). Each is a `<Link>` styled to match the prototype `.tab-bar` pill — `<span class="ico">` + label, lime fill on the active item's icon container, dark ink-on-cream otherwise.
- [ ] `<Topbar />` renders the `commute.vn` wordmark (matching `.brand` in the prototype: rotated lime square mark + Bricolage Grotesque + DM Mono tag). On the right: `<AuthStatus />` from plan 01.
- [ ] Mobile: tab bar is `fixed bottom-0 inset-x-0 border-t-2 border-foreground bg-paper`. `lg:`: tab bar moves below the topbar as a horizontal pill row, content gets the full viewport.

## Task 2 · Home tab content

**Files:**
- Modify: `apps/customer/app/(app)/page.tsx`
- Create: `apps/customer/components/home/greeting.tsx`
- Create: `apps/customer/components/home/leak-hero.tsx` (or refactor `money-leak-spotlight.tsx` into this)
- Create: `apps/customer/components/home/month-summary.tsx`
- Create: `apps/customer/components/home/reimburse-card.tsx`
- Create: `apps/customer/components/home/today-trips.tsx`

- [ ] **Greeting** matches the prototype's `.home-greet`: DM Mono label "CHÀO BUỔI SÁNG" / "GOOD MORNING" / "GOOD EVENING" picked by local hour, then a Bricolage Grotesque h2 with the user's first name + "👋", and a circled avatar with the first letter on the right.
- [ ] **Leak hero** matches `.leak-hero`: coral background, paper text, `<Badge>✨ MONEY LEAK</Badge>` in ink-on-lime, h3 with the leak total in a lime-highlighted span (`Cà phê + gửi xe trên đường = 380.000đ/tháng`), supporting paragraph, 12-bar mini-chart, and a "Cho tôi xem chi tiết →" button that links to `/insights`.
- [ ] **Month summary** matches `.month-summary`: 2-column grid. Card A (paper) shows "THÁNG NÀY" + total + delta vs last month. Card B (lime) shows "ĐÃ ĐI" + trip count + avg cost/trip.
- [ ] **Reimburse card** matches `.reimburse-card`: lime background, brutal border. Icon-mini + "Bạn được hoàn 320.000đ" headline, body copy mentioning the company name (read from `commute_profiles.company_name` if present, else "công ty của bạn"), then a brutal-primary "Xác nhận & gửi 1 chạm" button that links to `/claims`.
- [ ] **Today's trips** matches `.trip` rows: each row has a `.icon` chip (bike=lime/grab=leaf/bus=sky/coffee=rose), strong label, DM Mono time+route, and a Bricolage-bold price. Reads from `commute_transactions` for the signed-in user filtered to today's date; if empty, falls back to a 3-row mock from `@commute-iq/domain` so first-time users see the layout populated.

## Task 3 · Insights tab

**Files:**
- Create: `apps/customer/app/(app)/insights/page.tsx`
- Create: `apps/customer/components/insights/period-tabs.tsx` (client)
- Create: `apps/customer/components/insights/total-hero.tsx`
- Create: `apps/customer/components/insights/category-breakdown.tsx`
- Create: `apps/customer/components/insights/suggestion-card.tsx`
- Delete or repurpose: `apps/customer/components/commute-breakdown-chart.tsx` (the existing pie chart)

- [ ] Greeting variant: DM Mono "THẤU HIỂU" + h2 "Tiền đi đâu?".
- [ ] **Period tabs**: client component with three buttons (Tuần / Tháng / 3 tháng). Default to Tháng. Match `.insight-tabs` styling (brutal pills, ink-on-lime when active).
- [ ] **Total hero**: dark-ink card with lime "THÁNG 5 / 2026" badge, big Bricolage number with "đ" suffix, then "↓ 12% so với tháng trước · tiết kiệm 169k" with the percent in lime.
- [ ] **Category breakdown**: replace the pie chart with horizontal bars matching `.breakdown` and `.br-row`. One row per category (`fuel`, `ride_hailing`, `coffee`, `bus_metro`, `tolls`). Each row: colored dot + name + bar (filled to category share, colored to match the prototype: coral / leaf / rose / sky / bg-2) + DM Mono value (e.g. `462k`).
- [ ] **Suggestion card**: lime background card with "🎯 GỢI Ý" badge, h3 with a hardcoded recommendation ("3 ngày/tuần đi metro = tiết kiệm 240k/tháng" with the savings amount in an ink/lime inverse pill), supporting copy. Hardcoded for the hackathon — wiring real recommendations is a follow-up.

## Task 4 · Claims tab

**Files:**
- Create: `apps/customer/app/(app)/claims/page.tsx`
- Create: `apps/customer/components/claims/claim-summary.tsx`
- Create: `apps/customer/components/claims/eligible-trips.tsx`
- Create: `apps/customer/components/claims/submit-button.tsx` (client, optimistic UI)
- Create: `apps/customer/app/api/claims/submit/route.ts` (POST stub that returns `{ success: true }` for now)

- [ ] Greeting variant: DM Mono "HOÀN PHÍ" + h2 "Tự động nhận lại".
- [ ] **Claim summary** matches `.claim-summary`: ink card, lime corner blob, "ĐANG CHỜ XÁC NHẬN" label, big Bricolage amount with `<span class="dong">đ</span>`, meta line with a lime "8 chuyến" pill + "đã khớp chính sách công ty".
- [ ] **Submit button** matches `.btn.btn-coral.btn-block`. On click, optimistically swap to "✓ Đã gửi · chờ duyệt" + show a Toast ("Đã gửi 8 chuyến — bộ phận tài chính sẽ duyệt trong 24h"). POST `/api/claims/submit` in the background; on error, revert.
- [ ] **Eligible trips** matches `.trip` rows. Each row: bike/grab icon chip, date + "Home → Office", DM Mono caption ("✓ geofence match" or "ca tăng — chính sách trễ"), price. Hardcoded 5-row mock for now (move to real data once `commute_transactions` has eligibility flagging). Section title "Chuyến đủ điều kiện" with a "Sửa →" link to a stub.

## Task 5 · Profile tab

**Files:**
- Create: `apps/customer/app/(app)/profile/page.tsx`
- Create: `apps/customer/components/profile/profile-card.tsx`

- [ ] Greeting variant: DM Mono "TÔI" + h2 with the user's name.
- [ ] Card 1: account block — email, magic-link sign-out form (reuses plan 01's `/auth/sign-out`).
- [ ] Card 2: commute profile block — reads from `commute_profiles`. Shows home label + district, work label + district, primary transport, vehicle model. "Sửa thiết lập đi lại →" button links to `/onboarding?edit=1`.
- [ ] Card 3: utility block — language toggle placeholder (VN/EN), theme toggle (existing component), "App phiên bản" footer. Language toggle is a no-op stub for now; full i18n is a separate task.
- [ ] Footer link: "Mở True Cost playground →" to `/playground` so the educational calculator is reachable.

## Task 6 · Playground (preserve the calculator)

**Files:**
- Create: `apps/customer/app/playground/page.tsx`
- Create: `apps/customer/app/playground/layout.tsx` (no tab bar — standalone)

- [ ] Move the previous `app/page.tsx` content here verbatim (TrueCostCalculator + MoneyLeakSpotlight + auto-capture + comparisons grid). Keep the welcome banner from plan 05 here too — that's where it makes sense now.
- [ ] Layout has only the brand topbar (no tab bar). A small "← Quay lại app" link goes to `/`.

## Task 7 · Unauthenticated home behavior

**Files:**
- Create or modify: `apps/customer/app/page.tsx` (the *root* `/` route resolution)

App Router routes `/` to `(app)/page.tsx` because of the route group. The `(app)/layout.tsx` redirect handles unauthed users — they get bounced to `/sign-in?next=/`. Confirm with a manual test that:

- [ ] Hitting `/` while signed out → `/sign-in?next=/`.
- [ ] Hitting `/playground` while signed out → renders fine (no auth required for the educational calculator).
- [ ] Hitting `/` while signed in → Home tab content with tab bar visible.

## Task 8 · Tests

**Files:**
- Create: `apps/customer/app/(app)/__tests__/tab-bar.test.tsx`
- Create: `apps/customer/components/home/__tests__/greeting.test.tsx`

- [ ] `tab-bar.test.tsx`: renders 4 tabs, marks the right one active for each pathname (`/`, `/insights`, `/claims`, `/profile`).
- [ ] `greeting.test.tsx`: returns "CHÀO BUỔI SÁNG" before noon, "CHÀO BUỔI CHIỀU" 12–17, "CHÀO BUỔI TỐI" after 17. Uses a mocked `Date`.

---

## Verification

- [ ] `npm test` — green
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] `npm run dev:customer`. Sign in → land on `/` → Home tab visible with greeting, leak hero, month summary, reimburse card, today's trips, and a bottom tab bar.
- [ ] Click each tab → URL changes to `/`, `/insights`, `/claims`, `/profile`. The active tab's icon container is filled lime.
- [ ] On `/insights`, the breakdown shows horizontal bars, not a pie chart.
- [ ] On `/claims`, click "✨ Gửi 8 chuyến · 1 chạm" → button swaps to confirmation + toast appears.
- [ ] On `/profile`, "Sửa thiết lập đi lại →" links to `/onboarding?edit=1`.
- [ ] `/playground` still renders the True Cost calculator standalone.
- [ ] Side-by-side compare with the prototype's home / insights / claims / profile screens — matches.

## PR

**Title:** `feat(customer): app shell with home/insights/claims/profile tabs`

**Body sections:**

```markdown
## Summary
- New (app) route group with shared layout, brand topbar, and bottom tab bar.
- New / (home), /insights, /claims, /profile pages matching the prototype.
- Calculator preserved at /playground; welcome banner moves there.
- Auth-gated app group; /sign-in?next=<path> redirect for signed-out users.

## Test plan
- [ ] Sign in → / shows Home tab content; tab bar present.
- [ ] Each tab navigates correctly and marks the active item.
- [ ] /insights breakdown is horizontal bars (not pie).
- [ ] /claims submit button optimistically confirms + toasts.
- [ ] /playground still works for guests.

## Notes
- Closes the prototype-vs-customer-app surface gap identified in customer-pass-2 review.
- Mocks remain for trip feed + claim eligibility until plan 04 data and a reimbursement-policy backend land.
```
