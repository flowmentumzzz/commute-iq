import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent } from "@commute-iq/ui/components/card";

import { ClaimSubmitButton } from "./submit-button";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

interface ClaimRow {
  id: string;
  icon: string;
  iconBg: string;
  date: string;
  route: string;
  meta: string;
  amount: number;
}

const ELIGIBLE: ClaimRow[] = [
  { id: "1", icon: "🛵", iconBg: "bg-lime", date: "06/05", route: "Home → Office", meta: "07:42 · ✓ geofence match", amount: 40_000 },
  { id: "2", icon: "🛵", iconBg: "bg-lime", date: "05/05", route: "Home → Office", meta: "07:50 · ✓ geofence match", amount: 40_000 },
  { id: "3", icon: "🚖", iconBg: "bg-leaf text-paper", date: "04/05", route: "Grab · OT 22:30", meta: "ca tăng — chính sách trễ", amount: 85_000 },
  { id: "4", icon: "🛵", iconBg: "bg-lime", date: "03/05", route: "Home → Office", meta: "07:48 · ✓ geofence match", amount: 40_000 },
  { id: "5", icon: "🛵", iconBg: "bg-lime", date: "02/05", route: "Home → Office", meta: "07:55 · ✓ geofence match", amount: 40_000 }
];

export default function ClaimsTab() {
  const total = ELIGIBLE.reduce((sum, claim) => sum + claim.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Hoàn phí</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">Tự động nhận lại</h2>
      </div>

      <Card className="relative overflow-hidden bg-foreground text-paper">
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-lime/30 blur-2xl" />
        <CardContent className="relative flex flex-col gap-3 p-5">
          <Badge variant="default" className="w-fit">
            Đang chờ xác nhận
          </Badge>
          <p className="font-display text-4xl font-black leading-none tracking-tight">
            {currency.format(total)}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm opacity-90">
            <Badge variant="default" className="bg-lime text-foreground">
              {ELIGIBLE.length} chuyến
            </Badge>
            <span>đã khớp chính sách công ty</span>
          </div>
        </CardContent>
      </Card>

      <ClaimSubmitButton totalCount={ELIGIBLE.length} />

      <section className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between px-1">
          <h3 className="font-display font-bold">Chuyến đủ điều kiện</h3>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            {ELIGIBLE.length} / {ELIGIBLE.length}
          </span>
        </div>
        {ELIGIBLE.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border-2 border-foreground bg-paper p-3 shadow-brutal-sm"
          >
            <span className={`grid size-10 place-items-center rounded-xl border-2 border-foreground text-lg ${row.iconBg}`}>
              {row.icon}
            </span>
            <div className="min-w-0">
              <p className="font-display font-semibold">
                {row.date} · {row.route}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{row.meta}</p>
            </div>
            <p className="font-display font-bold tabular-nums">{currency.format(row.amount)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
