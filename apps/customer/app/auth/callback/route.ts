import { NextResponse, type NextRequest } from "next/server";

import { createServerSupabaseClient } from "../../../lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = sanitizeNext(url.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in", url.origin));
  }

  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(error.message)}`, url.origin)
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", url.origin));
  }

  await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: (user.user_metadata?.full_name as string | undefined) ?? null
      },
      { onConflict: "id" }
    );

  const { data: commuteProfile } = await supabase
    .from("commute_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const destination = commuteProfile ? next : "/onboarding";
  return NextResponse.redirect(new URL(destination, url.origin));
}

function sanitizeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}
