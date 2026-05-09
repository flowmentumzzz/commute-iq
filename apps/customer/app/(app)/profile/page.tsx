import Link from "next/link";
import { Badge } from "@commute-iq/ui/components/badge";
import { Button } from "@commute-iq/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { createServerSupabaseClient } from "../../../lib/supabase/server";

const TRANSPORT_LABELS: Record<string, string> = {
  motorbike: "🛵 Xe máy",
  grab_be: "🚖 Grab / Be",
  bus: "🚌 Buýt / Metro",
  bike_walk: "🚲 Xe đạp / Đi bộ"
};

export default async function ProfileTab() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const email = user?.email ?? null;

  const { data: profile } = await supabase
    .from("commute_profiles")
    .select("home_label, work_label, primary_transport, vehicle_model")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Tôi</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
          {email?.split("@")[0] ?? "Profile"}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-paper p-3 shadow-brutal-sm">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">Email</p>
              <p className="truncate font-display font-semibold">{email ?? "—"}</p>
            </div>
            <Badge variant="success">Đã đăng nhập</Badge>
          </div>
          <form action="/auth/sign-out" method="POST">
            <Button type="submit" variant="secondary" className="w-full">
              Đăng xuất
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thiết lập đi lại</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {profile ? (
            <>
              <ProfileRow label="Nhà" value={profile.home_label || "—"} />
              <ProfileRow label="Văn phòng" value={profile.work_label || "—"} />
              <ProfileRow
                label="Phương tiện chính"
                value={TRANSPORT_LABELS[profile.primary_transport] ?? profile.primary_transport}
              />
              {profile.vehicle_model && (
                <ProfileRow label="Xe máy" value={profile.vehicle_model} />
              )}
            </>
          ) : (
            <p className="rounded-xl border-2 border-dashed border-foreground bg-paper p-3 text-sm text-ink-soft">
              Bạn chưa thiết lập thông tin đi lại. Hoàn tất 3 bước để app hiểu cách bạn đi.
            </p>
          )}
          <Button asChild variant="default">
            <Link href="/onboarding?edit=1">
              {profile ? "Sửa thiết lập đi lại" : "Bắt đầu thiết lập"}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Khác</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild variant="secondary">
            <Link href="/playground">Mở True Cost playground →</Link>
          </Button>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            commute.vn · hackathon build · v0.1
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-foreground bg-paper p-3 shadow-brutal-sm">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{label}</p>
      <p className="mt-1 font-display font-semibold">{value}</p>
    </div>
  );
}
