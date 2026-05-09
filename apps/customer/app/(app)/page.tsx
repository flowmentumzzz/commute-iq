import Link from "next/link";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent } from "@commute-iq/ui/components/card";

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { MoneyLeakSpotlight } from "../../components/money-leak-spotlight";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export default async function HomeTab() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.trim().split(" ").at(-1) ?? extractFromEmail(user?.email ?? null) ?? "Bạn";
  const initial = firstName.charAt(0).toUpperCase();
  const greeting = pickGreeting(new Date().getHours());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{greeting}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
            {firstName} 👋
          </h2>
        </div>
        <div className="grid size-11 place-items-center rounded-full border-2 border-foreground bg-rose font-display text-base font-bold shadow-brutal-sm">
          {initial}
        </div>
      </div>

      <MoneyLeakSpotlight />

      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          tone="paper"
          label="Tháng này"
          value={currency.format(1_240_000)}
          delta="↓ 12% vs tháng trước"
        />
        <SummaryCard
          tone="lime"
          label="Đã đi"
          value="47"
          unit="chuyến"
          delta="trung bình 26k/chuyến"
        />
      </div>

      <Card className="bg-lime">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl border-2 border-foreground bg-foreground text-lg text-lime">
              💼
            </span>
            <h3 className="font-display text-lg font-extrabold">
              Bạn được hoàn {currency.format(320_000)}
            </h3>
          </div>
          <p className="text-sm leading-relaxed">
            Công ty bạn đã bật chính sách hỗ trợ đi lại. App đã tính sẵn — chỉ cần xác nhận.
          </p>
          <Link
            href="/claims"
            className="inline-flex h-10 items-center justify-center rounded-full border-2 border-foreground bg-foreground px-4 font-display text-sm font-semibold text-lime shadow-brutal-sm transition hover:-translate-x-px hover:-translate-y-px hover:shadow-brutal"
          >
            Xác nhận & gửi 1 chạm
          </Link>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between px-1">
          <h3 className="font-display font-bold">Hôm nay</h3>
          <Link href="/insights" className="font-mono text-[11px] uppercase tracking-wider text-ink-soft hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <TripRow icon="🛵" iconBg="bg-lime" title="Nhà → Văn phòng" subtitle="07:42 · 6.3km · auto" amount={22_000} note="xăng + gửi" />
        <TripRow icon="☕" iconBg="bg-rose" title="Highlands · trên đường" subtitle="07:55 · ngã tư CMT8" amount={38_000} note="lần 14 / tháng" />
        <TripRow icon="🚖" iconBg="bg-leaf text-paper" title="Grab về nhà · trời mưa" subtitle="18:34 · 6.1km" amount={71_000} note="" />
      </section>

      <p className="px-1 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
        Mock data — kết nối <Link href="/playground" className="underline">playground</Link> để xem true-cost calculator.
      </p>
    </div>
  );
}

function SummaryCard({
  tone,
  label,
  value,
  unit,
  delta
}: {
  tone: "paper" | "lime";
  label: string;
  value: string;
  unit?: string;
  delta: string;
}) {
  const tonal = tone === "lime" ? "bg-lime" : "bg-paper";
  return (
    <div className={`rounded-2xl border-2 border-foreground p-4 shadow-brutal-sm ${tonal}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-2xl font-extrabold tracking-tight">
        {value}
        {unit && <span className="ml-1 font-mono text-xs font-normal text-ink-soft">{unit}</span>}
      </p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-leaf">{delta}</p>
    </div>
  );
}

function TripRow({
  icon,
  iconBg,
  title,
  subtitle,
  amount,
  note
}: {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  amount: number;
  note: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border-2 border-foreground bg-paper p-3 shadow-brutal-sm">
      <span className={`grid size-10 place-items-center rounded-xl border-2 border-foreground text-lg ${iconBg}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate font-display font-semibold">{title}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{subtitle}</p>
      </div>
      <div className="text-right">
        <p className="font-display font-bold tabular-nums">{currency.format(amount)}</p>
        {note && <p className="font-mono text-[10px] tracking-wider text-ink-soft">{note}</p>}
      </div>
    </div>
  );
}

function pickGreeting(hour: number): string {
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

function extractFromEmail(email: string | null): string | null {
  if (!email) return null;
  const local = email.split("@")[0] ?? "";
  if (!local) return null;
  return local.charAt(0).toUpperCase() + local.slice(1);
}
