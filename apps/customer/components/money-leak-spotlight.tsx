"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  findMoneyLeaks,
  loadTransactions,
  mockTransactions,
  type CommuteTransaction,
  type MoneyLeak
} from "@commute-iq/domain";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent } from "@commute-iq/ui/components/card";

function buildCurrencyFormatter(locale: string): Intl.NumberFormat {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  });
}

export function MoneyLeakSpotlight() {
  const locale = useLocale();
  const t = useTranslations("moneyLeak");
  const [userTransactions, setUserTransactions] = useState<CommuteTransaction[] | null>(null);

  const currency = useMemo(() => buildCurrencyFormatter(locale), [locale]);

  useEffect(() => {
    const stored = loadTransactions(window.localStorage);
    if (stored.length >= 3) {
      setUserTransactions(stored);
    } else {
      setUserTransactions([]);
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === "commute-iq:transactions") {
        const refreshed = loadTransactions(window.localStorage);
        setUserTransactions(refreshed.length >= 3 ? refreshed : []);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sourceTransactions = useMemo(() => {
    if (userTransactions && userTransactions.length >= 3) return userTransactions;
    return mockTransactions;
  }, [userTransactions]);

  const leaks = findMoneyLeaks(sourceTransactions, { minCount: 3, limit: 3 });
  const top = leaks[0];

  if (!top) {
    return null;
  }

  const others = leaks.slice(1);
  const topLabel = t(`categoryLabels.${top.category}` as const);
  const topTip = t(`categoryTips.${top.category}` as const);

  return (
    <Card className="relative overflow-hidden bg-coral text-paper">
      <div className="pointer-events-none absolute -bottom-24 -left-12 size-52 rounded-full bg-lime/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -top-14 size-36 rounded-full bg-paper/15 blur-2xl" />
      <div className="relative">
        <div className="flex flex-col gap-3 p-6">
          <Badge variant="ink" className="w-fit">
            {t("badge")}
          </Badge>
          <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
            {t.rich("headlinePattern", {
              merchant: top.merchant,
              count: top.count,
              amount: currency.format(top.totalAmountVnd)
            })}
          </h3>
          <p className="text-sm leading-relaxed opacity-90">
            {t("summary", { label: topLabel, tip: topTip })}
          </p>
        </div>
        <CardContent className="flex flex-col gap-4 pt-0">
          <div className="rounded-2xl border-2 border-foreground bg-foreground p-5 text-paper shadow-brutal-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              {t("savingsLabel")}
            </p>
            <p className="mt-2 font-display text-3xl font-black leading-none tracking-tight md:text-4xl">
              <span className="text-lime">~{currency.format(top.estimatedMonthlySavingsVnd)}</span>
            </p>
            <p className="mt-2 text-sm opacity-80">
              {t("averageLabel", { amount: currency.format(top.averageAmountVnd) })}
            </p>
          </div>

          {others.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">
                {t("othersHeading")}
              </p>
              {others.map((leak) => (
                <div
                  key={`${leak.merchant}-${leak.category}`}
                  className="flex items-center justify-between rounded-2xl border-2 border-foreground bg-paper px-4 py-3 text-foreground shadow-brutal-sm"
                >
                  <div>
                    <p className="font-display font-semibold">{leak.merchant}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                      {t("otherRowMeta", {
                        count: leak.count,
                        label: t(`categoryLabels.${leak.category}` as const)
                      })}
                    </p>
                  </div>
                  <p className="font-display font-bold tabular-nums">
                    {currency.format(leak.totalAmountVnd)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}

// keep type used for category narrowing if needed in future
export type { MoneyLeak };
