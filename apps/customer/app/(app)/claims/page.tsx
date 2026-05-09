import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent } from "@commute-iq/ui/components/card";

import { ClaimSubmitButton } from "./submit-button";

function buildCurrencyFormatter(locale: string): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  });
}

const ROW_KEYS = ["1", "2", "3", "4", "5"] as const;
type RowKey = (typeof ROW_KEYS)[number];
const ROW_META: Record<RowKey, { icon: string; iconBg: string; amount: number }> = {
  "1": { icon: "🛵", iconBg: "bg-lime", amount: 40_000 },
  "2": { icon: "🛵", iconBg: "bg-lime", amount: 40_000 },
  "3": { icon: "🚖", iconBg: "bg-leaf text-paper", amount: 85_000 },
  "4": { icon: "🛵", iconBg: "bg-lime", amount: 40_000 },
  "5": { icon: "🛵", iconBg: "bg-lime", amount: 40_000 }
};

export default async function ClaimsTab() {
  const locale = await getLocale();
  const t = await getTranslations("claims");
  const currency = buildCurrencyFormatter(locale);

  const total = ROW_KEYS.reduce((sum, key) => sum + ROW_META[key].amount, 0);
  const totalCount = ROW_KEYS.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{t("eyebrow")}</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">{t("title")}</h2>
      </div>

      <Card className="relative overflow-hidden bg-foreground text-paper">
        <div className="pointer-events-none absolute -right-10 -top-12 size-44 rounded-full bg-lime/30 blur-2xl" />
        <CardContent className="relative flex flex-col gap-3 p-5">
          <Badge variant="default" className="w-fit">
            {t("pendingBadge")}
          </Badge>
          <p className="font-display text-4xl font-black leading-none tracking-tight">
            {currency.format(total)}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm opacity-90">
            <Badge variant="default" className="bg-lime text-foreground">
              {t("tripsBadge", { count: totalCount })}
            </Badge>
            <span>{t("matchedNote")}</span>
          </div>
        </CardContent>
      </Card>

      <ClaimSubmitButton totalCount={totalCount} />

      <section className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between px-1">
          <h3 className="font-display font-bold">{t("eligibleHeading")}</h3>
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
            {totalCount} / {totalCount}
          </span>
        </div>
        {ROW_KEYS.map((key) => {
          const meta = ROW_META[key];
          return (
            <div
              key={key}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border-2 border-foreground bg-paper p-3 shadow-brutal-sm"
            >
              <span className={`grid size-10 place-items-center rounded-xl border-2 border-foreground text-lg ${meta.iconBg}`}>
                {meta.icon}
              </span>
              <div className="min-w-0">
                <p className="font-display font-semibold">
                  {t(`rows.${key}.date` as const)} · {t(`rows.${key}.route` as const)}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  {t(`rows.${key}.meta` as const)}
                </p>
              </div>
              <p className="font-display font-bold tabular-nums">{currency.format(meta.amount)}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
