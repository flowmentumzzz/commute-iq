import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@commute-iq/ui/components/button";

import { createServerSupabaseClient } from "../lib/supabase/server";

export async function AuthStatus() {
  const t = await getTranslations("auth");
  let email: string | null = null;

  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  } catch {
    email = null;
  }

  if (!email) {
    return (
      <Button asChild size="sm" variant="default">
        <Link href="/sign-in">{t("signIn")}</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className="hidden max-w-[12rem] truncate font-mono text-[10px] uppercase tracking-wider text-ink-soft sm:inline"
        title={email}
      >
        {email}
      </span>
      <form action="/auth/sign-out" method="POST">
        <Button type="submit" size="sm" variant="secondary">
          {t("signOut")}
        </Button>
      </form>
    </div>
  );
}
