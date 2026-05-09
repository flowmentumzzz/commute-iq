"use client";

import { useEffect, useMemo, useState } from "react";
import {
  findMoneyLeaks,
  loadTransactions,
  mockTransactions,
  type CommuteTransaction,
  type MoneyLeak
} from "@commute-iq/domain";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent } from "@commute-iq/ui/components/card";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

const CATEGORY_TIPS: Record<MoneyLeak["category"], { label: string; tip: string }> = {
  routine: {
    label: "Cà phê / thói quen",
    tip: "Tự pha ở nhà 3 ngày/tuần là một vé tiết kiệm rõ ràng."
  },
  ride_hailing: {
    label: "Grab / Be",
    tip: "Đi xe máy khi không mưa và để Grab cho ngày mưa lớn."
  },
  parking: {
    label: "Gửi xe",
    tip: "Tìm chỗ gửi xe tháng cố định gần văn phòng có thể rẻ hơn 30–40%."
  },
  fuel: {
    label: "Xăng",
    tip: "Đổ tại cây xăng quen, giữ áp suất lốp đúng để tiết kiệm 5–10%."
  },
  maintenance: {
    label: "Bảo dưỡng",
    tip: "Bảo dưỡng định kỳ tránh được hỏng hóc đột xuất tốn kém hơn."
  }
};

export function MoneyLeakSpotlight() {
  const [userTransactions, setUserTransactions] = useState<CommuteTransaction[] | null>(null);

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
  const topMeta = CATEGORY_TIPS[top.category];

  return (
    <Card className="relative overflow-hidden bg-coral text-paper">
      <div className="pointer-events-none absolute -bottom-24 -left-12 size-52 rounded-full bg-lime/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -top-14 size-36 rounded-full bg-paper/15 blur-2xl" />
      <div className="relative">
        <div className="flex flex-col gap-3 p-6">
          <Badge variant="ink" className="w-fit">
            ✨ MONEY LEAK
          </Badge>
          <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight md:text-3xl">
            {top.merchant} · {top.count} lần / tháng = {" "}
            <span className="rounded-md bg-lime px-1.5 text-foreground">
              {currency.format(top.totalAmountVnd)}
            </span>
          </h3>
          <p className="text-sm leading-relaxed opacity-90">
            {topMeta.label} đang ngốn ngân sách mỗi tháng. {topMeta.tip}
          </p>
        </div>
        <CardContent className="flex flex-col gap-4 pt-0">
          <div className="rounded-2xl border-2 border-foreground bg-foreground p-5 text-paper shadow-brutal-sm">
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              Tiết kiệm khả thi
            </p>
            <p className="mt-2 font-display text-3xl font-black leading-none tracking-tight md:text-4xl">
              <span className="text-lime">~{currency.format(top.estimatedMonthlySavingsVnd)}</span>
            </p>
            <p className="mt-2 text-sm opacity-80">
              Trung bình {currency.format(top.averageAmountVnd)} mỗi lần.
            </p>
          </div>

          {others.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">
                Các pattern khác
              </p>
              {others.map((leak) => (
                <div
                  key={`${leak.merchant}-${leak.category}`}
                  className="flex items-center justify-between rounded-2xl border-2 border-foreground bg-paper px-4 py-3 text-foreground shadow-brutal-sm"
                >
                  <div>
                    <p className="font-display font-semibold">{leak.merchant}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                      {leak.count} lần · {CATEGORY_TIPS[leak.category].label}
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
