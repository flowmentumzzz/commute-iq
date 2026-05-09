# Commute Wallet Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable monorepo foundation for the customer UI, CRM UI, backend API, shared commute domain logic, Supabase schema, and Vercel deployment setup.

**Architecture:** Use npm workspaces with two Next.js 14 apps, one NestJS API app, and shared packages for UI, domain logic, and Supabase integration. Vercel deploys each app as a separate project by Root Directory, while Supabase owns Postgres schema and generated API foundations.

**Tech Stack:** Next.js 14, TypeScript, Tailwind, shadcn-style source components, Recharts, NestJS, Supabase/PostgreSQL, Vercel.

---

### Task 1: Workspace Foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `.env.example`
- Create: `.gitignore`

- [ ] Add npm workspaces for `apps/*` and `packages/*`.
- [ ] Add shared TypeScript strict config and root scripts for build, lint, test, and typecheck.

### Task 2: Shared Domain Package

**Files:**
- Create: `packages/domain/src/index.ts`
- Create: `packages/domain/src/commute-cost.ts`
- Create: `packages/domain/src/sms-parser.ts`
- Create: `packages/domain/src/mock-data.ts`
- Create: `packages/domain/src/*.test.ts`

- [ ] Write Vitest coverage for true-cost calculation and Vietnamese SMS parsing.
- [ ] Implement the minimal engine and parser needed by both UIs and API.

### Task 3: Shared UI and Supabase Packages

**Files:**
- Create: `packages/ui/src/components/*.tsx`
- Create: `packages/ui/src/styles/globals.css`
- Create: `packages/supabase/src/index.ts`
- Create: `supabase/migrations/*.sql`

- [ ] Add reusable shadcn-style Button, Card, Badge, and utility helpers.
- [ ] Add browser/server Supabase client helpers and initial schema migration.

### Task 4: Apps

**Files:**
- Create: `apps/customer`
- Create: `apps/crm`
- Create: `apps/api`

- [ ] Scaffold the customer dashboard, CRM dashboard, and health/cost API endpoints.
- [ ] Add app-local Vercel settings and environment examples.

### Task 5: Verification

- [ ] Install dependencies with `npm install`.
- [ ] Run `npm test`, `npm run typecheck`, and `npm run build`.
