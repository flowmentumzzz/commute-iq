import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { SignInForm } from "./sign-in-form";

export const dynamic = "force-dynamic";

interface SignInPageProps {
  searchParams: { next?: string };
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  let user: { id: string } | null = null;
  try {
    const supabase = createServerSupabaseClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  if (user) {
    redirect("/");
  }

  const next = sanitizeNext(searchParams.next);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background bg-body-bloom px-5 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-3">
          <Link href="/" className="font-mono text-[10px] uppercase tracking-widest text-ink-soft hover:underline">
            ← commute.vn
          </Link>
          <CardTitle className="text-3xl">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email — chúng tôi gửi link đăng nhập 1 chạm. Không cần mật khẩu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm next={next} />
        </CardContent>
      </Card>
    </main>
  );
}

function sanitizeNext(value: string | undefined): string {
  if (!value || !value.startsWith("/")) {
    return "/";
  }
  if (value.startsWith("//")) {
    return "/";
  }
  return value;
}
