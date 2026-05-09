import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent } from "@commute-iq/ui/components/card";

function buildCurrencyFormatter(locale: string): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  });
}

const BREAKDOWN_KEYS = ["fuelParking", "rideHailing", "coffee", "transit", "tolls"] as const;
const BREAKDOWN_VALUES: Record<(typeof BREAKDOWN_KEYS)[number], { value: number; color: string }> = {
  fuelParking: { value: 462_000, color: "bg-coral" },
  rideHailing: { value: 340_000, color: "bg-leaf" },
  coffee: { value: 266_000, color: "bg-rose" },
  transit: { value: 112_000, color: "bg-sky" },
  tolls: { value: 60_000, color: "bg-bg-2" }
};
const BREAKDOWN_TOTAL = 1_240_000;

export default async function InsightsTab() {
  const locale = await getLocale();
  const t = await getTranslations("insights");
  const currency = buildCurrencyFormatter(locale);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{t("eyebrow")}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h2>
        </div>
        <PeriodTabs
          labels={{
            week: t("periodWeek"),
            month: t("periodMonth"),
            threeMonths: t("period3Months")
          }}
        />
      </div>

      <Card className="relative overflow-hidden bg-foreground text-paper">
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-coral/35 blur-2xl" />
        <CardContent className="relative flex flex-col gap-2 p-5">
          <Badge variant="default" className="w-fit">
            {t("monthBadge")}
          </Badge>
          <p className="font-display text-4xl font-black leading-none tracking-tight">
            {currency.format(BREAKDOWN_TOTAL)}
          </p>
          <p className="text-sm opacity-90">
            <strong className="text-lime">↓ 12%</strong>{" "}
            {t("comparePrefix", { amount: currency.format(169_000) })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <h3 className="font-display font-bold">{t("byCategoryHeading")}</h3>
          {BREAKDOWN_KEYS.map((key) => (
            <BreakdownRow
              key={key}
              name={t(`categories.${key}` as const)}
              value={BREAKDOWN_VALUES[key].value}
              total={BREAKDOWN_TOTAL}
              color={BREAKDOWN_VALUES[key].color}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="bg-lime">
        <CardContent className="flex flex-col gap-2 p-5">
          <Badge variant="ink" className="w-fit">
            {t("tipBadge")}
          </Badge>
          <h3 className="font-display text-lg font-extrabold leading-tight">
            {t.rich("tipTitle", {
              amount: currency.format(240_000),
              hl: (chunks) => (
                <span className="rounded-md bg-foreground px-1.5 text-lime">{chunks}</span>
              )
            })}
          </h3>
          <p className="text-sm opacity-85">{t("tipBody")}</p>
        </CardContent>
      </Card>
    </div>
  );
}

interface PeriodTabsProps {
  labels: { week: string; month: string; threeMonths: string };
}

function PeriodTabs({ labels }: PeriodTabsProps) {
  const items = [labels.week, labels.month, labels.threeMonths];
  return (
    <div className="flex gap-1 rounded-full border-2 border-foreground bg-paper p-1 shadow-brutal-sm">
      {items.map((label) => {
        const active = label === labels.month;
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
