import { redirect } from "next/navigation";

/**
 * Demo-friendly auth gate for the manager dashboard.
 *
 * If `MANAGER_DEMO_ALLOW=true` OR the request carries `?demo=1`, render the
 * dashboard without a session. Otherwise we redirect to the customer app's
 * sign-in until the crm gets its own Supabase wiring (plan 01 follow-up).
 *
 * TODO(crm-auth): replace with `createServerSupabaseClient()` + role check
 * (`profiles.role = 'manager'`) once the crm Supabase client lands.
 */
export interface AuthGateInput {
  demoQuery?: string | string[];
}

export function ensureManagerAccess(input: AuthGateInput): void {
  const demoEnv = process.env.MANAGER_DEMO_ALLOW === "true";
  const demoQuery = Array.isArray(input.demoQuery) ? input.demoQuery[0] : input.demoQuery;
  const demoRequest = demoQuery === "1" || demoQuery === "true";

  if (demoEnv || demoRequest) {
    return;
  }

  redirect("/sign-in");
}
