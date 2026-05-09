import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent } from "@commute-iq/ui/components/card";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

const BREAKDOWN = [
  { name: "Xăng + gửi xe", value: 462_000, total: 1_240_000, color: "bg-coral" },
  { name: "Grab / Be", value: 340_000, total: 1_240_000, color: "bg-leaf" },
  { name: "Cà phê dọc đường", value: 266_000, total: 1_240_000, color: "bg-rose" },
  { name: "Buýt / Metro", value: 112_000, total: 1_240_000, color: "bg-sky" },
  { name: "Cầu, cao tốc", value: 60_000, total: 1_240_000, color: "bg-bg-2" }
];

export default function InsightsTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">Thấu hiểu</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">Tiền đi đâu?</h2>
        </div>
        <PeriodTabs />
      </div>

      <Card className="relative overflow-hidden bg-foreground text-paper">
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-coral/35 blur-2xl" />
        <CardContent className="relative flex flex-col gap-2 p-5">
          <Badge variant="default" className="w-fit">
            Tháng 5 / 2026
          </Badge>
          <p className="font-display text-4xl font-black leading-none tracking-tight">
            {currency.format(1_240_000)}
          </p>
          <p className="text-sm opacity-90">
            <strong className="text-lime">↓ 12%</strong> so với tháng trước · tiết kiệm {currency.format(169_000)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <h3 className="font-display font-bold">Theo loại chi</h3>
          {BREAKDOWN.map((row) => (
            <BreakdownRow key={row.name} {...row} />
          ))}
        </CardContent>
      </Card>

      <Card className="bg-lime">
        <CardContent className="flex flex-col gap-2 p-5">
          <Badge variant="ink" className="w-fit">
            🎯 Gợi ý
          </Badge>
          <h3 className="font-display text-lg font-extrabold leading-tight">
            3 ngày/tuần đi metro = tiết kiệm{" "}
            <span className="rounded-md bg-foreground px-1.5 text-lime">{currency.format(240_000)}/tháng</span>
          </h3>
          <p className="text-sm opacity-85">
            Tuyến metro số 1 đi qua công ty bạn. App đã thử với 47 chuyến đã ghi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PeriodTabs() {
  const items = ["Tuần", "Tháng", "3 tháng"];
  return (
    <div className="flex gap-1 rounded-full border-2 border-foreground bg-paper p-1 shadow-brutal-sm">
      {items.map((label) => {
        const active = label === "Tháng";
        return (
          <button
            key={label}
            type="button"
            className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
              active ? "bg-foreground text-lime" : "text-ink-soft"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function BreakdownRow({
  name,
  value,
  total,
  color
}: {
  name: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = Math.max(2, Math.round((value / total) * 100));
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`size-3 shrink-0 rounded border-2 border-foreground ${color}`} aria-hidden />
      <span className="w-24 shrink-0 truncate text-xs">{name}</span>
      <span className="relative flex-1 overflow-hidden rounded-full border border-foreground/15 bg-foreground/5">
        <span className={`block h-2 ${color}`} style={{ width: `${pct}%` }} />
      </span>
      <span className="w-16 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums">
        {Math.round(value / 1000)}k
      </span>
    </div>
  );
}
