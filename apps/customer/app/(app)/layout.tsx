import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { TabBar } from "./tab-bar";
import { Topbar } from "./topbar";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/");
  }

  return (
    <div className="min-h-screen bg-background bg-body-bloom pb-28 lg:pb-12">
      <Topbar email={user.email ?? null} />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pt-3 sm:px-6 sm:pt-6 lg:max-w-5xl">
        {children}
      </main>
      <TabBar />
    </div>
  );
}
