# 01 · Email magic-link sign-in (+ sign-out)

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:executing-plans` to walk this plan task-by-task. Steps use `- [ ]` for tracking.

**Goal:** Add Supabase email magic-link auth to the customer app. After this lands, a user can enter an email, click the link in their inbox, and land on the home page signed in. They can also sign out from the nav.

**Notion task IDs:**
- A1 (page_id `35b745ac-054b-8197-8ca0-f486bc4b30f3`) — Status: `In progress` (already set by the planner)
- A3 (page_id `35b745ac-054b-817d-a8db-c35ba0d72683`) — flip to `In progress` when you start, `Done` when PR opens

**Branch:** `feat/auth-magic-link` from `main`.

**Status:** In progress — Supabase auth dependencies are present, but the auth clients, middleware, sign-in page, callback route, sign-out route, and auth status component are not present.

**Depends on:** plan 00 (design system) — recommended so the sign-in card and `<AuthStatus />` already use the prototype palette.

**Design reference:** [`./index.html`](../../../../index.html) at repo root. The sign-in surface should use the same paper card, ink borders, lime CTA, and DM Mono labels as the prototype. The `<AuthStatus />` chip in the nav should mirror the prototype's brand-tag + pill aesthetic.

---

## Context

The customer app currently has no auth. `packages/supabase` exports `createBrowserSupabaseClient` (no cookies) and `createServiceSupabaseClient` (server, service-role). Neither is suitable for cookie-based session auth in a Next.js App Router app.

This plan adds **app-local** Supabase helpers that use `@supabase/ssr` and live in `apps/customer/lib/supabase/`. We do **not** modify `packages/supabase` because the SSR cookie wiring is App-Router-specific.

Supabase project: hosted at `https://gyvmqylszjuzjztwogtl.supabase.co`. Anon key is in `apps/customer/.env.local.example`. The `profiles` table already exists with RLS that lets a user select/update their own row (`auth.uid() = id`).

## Architecture decisions

- **`@supabase/ssr` v0.5.x** for cookie helpers (deprecated `@supabase/auth-helpers-nextjs` is **not** used).
- **Magic link only** for now (no password, no Google OAuth — Google is a separate Notion task A2).
- **Auto-create profile row** in the auth callback (the schema has no `on auth.user insert` trigger yet).
- **Middleware** refreshes the session on every request; without it the cookie expires and server components return `null`.
- **No protected routes** in this plan — everyone can see `/`. The `<AuthStatus />` component just shows the right CTA.

---

## Task 1 · Add deps

**Files:**
- Modify: `apps/customer/package.json`

- [ ] Add `"@supabase/ssr": "0.5.2"` and `"@supabase/supabase-js": "2.47.10"` to `dependencies` in `apps/customer/package.json`.
- [ ] Run `npm install` from repo root.

## Task 2 · Supabase client wrappers

**Files:**
- Create: `apps/customer/lib/supabase/browser.ts`
- Create: `apps/customer/lib/supabase/server.ts`

- [ ] In `browser.ts`, export `createBrowserSupabaseClient()` that calls `createBrowserClient<Database>(url, anonKey)` from `@supabase/ssr`. Re-use the `Database` type from `@commute-iq/supabase`.
- [ ] In `server.ts`, export `createServerSupabaseClient()` that calls `createServerClient<Database>(url, anonKey, { cookies })` where `cookies` is wired to `next/headers` `cookies()`. Pattern:

  ```ts
  import { cookies } from "next/headers";
  import { createServerClient } from "@supabase/ssr";
  import type { Database } from "@commute-iq/supabase";

  export function createServerSupabaseClient() {
    const cookieStore = cookies();
    return createServerClient<Database>(url, anonKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component during render — ignore
          }
        }
      }
    });
  }
  ```

- [ ] Both helpers throw a descriptive error if `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing.

## Task 3 · Middleware for session refresh

**Files:**
- Create: `apps/customer/middleware.ts`

- [ ] Use the canonical Supabase Next.js middleware: build a `createServerClient` against `request.cookies` and a `NextResponse.next` that mirrors any cookie writes back. Call `supabase.auth.getUser()` to refresh tokens.
- [ ] Export `config.matcher` that excludes `_next/static`, `_next/image`, `favicon.ico`, and asset extensions.

Reference: <https://supabase.com/docs/guides/auth/server-side/nextjs#create-a-middleware-file>

## Task 4 · Sign-in page

**Files:**
- Create: `apps/customer/app/sign-in/page.tsx` (server component, redirects to `/` if already authed)
- Create: `apps/customer/app/sign-in/sign-in-form.tsx` (client component)

- [ ] Server page: call `createServerSupabaseClient().auth.getUser()`. If user exists, `redirect("/")`. Otherwise render `<SignInForm />` inside a `<Card>`.
- [ ] Client form: controlled `<input type="email">` and a submit button. On submit, call `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: \`${location.origin}/auth/callback\` } })`. Show success state ("Kiểm tra email") or error.
- [ ] Validate email with a Zod schema before calling Supabase.

## Task 5 · Auth callback

**Files:**
- Create: `apps/customer/app/auth/callback/route.ts`

- [ ] Route handler exports `GET(request: NextRequest)`.
- [ ] Read `code` from `request.nextUrl.searchParams`.
- [ ] Call `supabase.auth.exchangeCodeForSession(code)`.
- [ ] After session is set, fetch the user; upsert a `profiles` row with `id = user.id` and `full_name = user.user_metadata.full_name ?? null`. Use `.upsert(..., { onConflict: 'id' })` so re-sign-in is idempotent.
- [ ] **Decide the destination based on onboarding state:**
  - Read `commute_profiles` for the user.
  - **No row** → user is new → redirect to `/onboarding` (plan 06 builds this).
  - **Row exists** → existing user → redirect to `/` (or to a sanitized `next` query param if present).
- [ ] If plan 06 has not landed yet, send everyone to `/`. The plan-06 PR will swap the redirect.

## Task 6 · Sign-out route

**Files:**
- Create: `apps/customer/app/auth/sign-out/route.ts`

- [ ] Export `POST(request: NextRequest)` handler.
- [ ] Call `supabase.auth.signOut()` then redirect to `/`.

## Task 7 · Auth status in nav

**Files:**
- Create: `apps/customer/components/auth-status.tsx` (server component)
- Modify: `apps/customer/app/page.tsx` (render `<AuthStatus />` in the nav)

- [ ] `AuthStatus` reads the user via `createServerSupabaseClient().auth.getUser()`.
- [ ] If signed in: render the user email + a `<form action="/auth/sign-out" method="POST">` containing a "Đăng xuất" button.
- [ ] If signed out: render a `<Link href="/sign-in">` button labelled "Đăng nhập".
- [ ] Place it in the right side of the nav next to the existing `<ThemeToggle />` and `Hackathon MVP` badge.

## Task 8 · Env vars

**Files:**
- Modify: `apps/customer/.env.local.example` (already has the two required vars; just confirm)

- [ ] Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present.
- [ ] Document in PR description that the Supabase project must have **Magic Link** enabled and **Site URL** set to `http://localhost:3000` for local dev.

---

## Verification

- [ ] `npm install` (from repo root)
- [ ] `npm run typecheck` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean
- [ ] `cp apps/customer/.env.local.example apps/customer/.env.local`
- [ ] `npm run dev:customer` → `http://localhost:3000`
- [ ] Click "Đăng nhập" → submit a real email → check inbox for magic link
- [ ] Click magic link → land on `/` signed in (email visible in nav)
- [ ] Verify a row exists in Supabase `profiles` with the user's UUID
- [ ] Click "Đăng xuất" → email goes away, sign-in link returns
- [ ] Reload the home page after sign-in → still signed in (cookie persisted)

## PR

**Title:** `feat(customer): email magic-link sign-in`

**Body sections:**

```markdown
## Summary
- Adds @supabase/ssr-based browser + server clients in apps/customer/lib/supabase.
- Adds /sign-in (form), /auth/callback (code exchange + profile upsert), /auth/sign-out (POST).
- Adds middleware that refreshes the session on every request.
- Adds <AuthStatus /> in the nav.

## Test plan
- [ ] Local sign-in → magic link → landed signed in.
- [ ] Sign-out clears the session.
- [ ] Reload after sign-in keeps the session.
- [ ] profiles row created on first sign-in.

## Notes
- Closes Notion A1 + A3.
- Requires Supabase project to have Magic Link enabled and Site URL set to http://localhost:3000.
```
