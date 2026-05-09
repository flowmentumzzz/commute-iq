import { mockTransactions, transportComparisons } from "@commute-iq/domain";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { AuthStatus } from "../components/auth-status";
import { MoneyLeakSpotlight } from "../components/money-leak-spotlight";
import { ThemeToggle } from "../components/theme-toggle";
import { TrueCostCalculator } from "../components/true-cost-calculator";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export default function CustomerHomePage() {
  return (
    <main className="min-h-screen bg-background bg-body-bloom px-5 py-7 md:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <nav className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 -rotate-[4deg] items-center justify-center rounded-[14px] border-2 border-foreground bg-lime text-2xl shadow-brutal-sm">
              🛵
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold leading-none tracking-tight">
                commute<span className="text-coral">.</span>vn
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
                {"// thấy tiền đi lại của bạn rõ ràng"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Hackathon MVP</Badge>
            <ThemeToggle />
            <AuthStatus />
          </div>
        </nav>

        <TrueCostCalculator />

        <MoneyLeakSpotlight />

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Auto-capture mock</CardTitle>
              <CardDescription>SMS ngân hàng và ví điện tử được parse bằng regex thật.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {mockTransactions.map((transaction) => (
                <div
                  key={`${transaction.merchant}-${transaction.amountVnd}`}
                  className="flex items-center justify-between rounded-2xl border-2 border-foreground bg-paper p-4 shadow-brutal-sm"
                >
                  <div>
                    <p className="font-display font-semibold">{transaction.merchant}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                      {transaction.category}
                    </p>
                  </div>
                  <p className="font-display font-bold tabular-nums">
                    {currency.format(transaction.amountVnd)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>So sánh phương tiện</CardTitle>
              <CardDescription>Break-even nhanh cho thói quen đi làm hằng ngày.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {transportComparisons.map((item) => (
                <div
                  key={item.mode}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-2xl border-2 border-foreground bg-paper p-4 shadow-brutal-sm"
                >
                  <p className="font-display font-semibold">{item.mode}</p>
                  <p className="font-display font-bold tabular-nums">
                    {currency.format(item.dailyVnd)}
                    <span className="ml-1 font-mono text-[10px] font-normal uppercase tracking-wider text-ink-soft">
                      / ngày
                    </span>
                  </p>
                  <Badge variant="outline">
                    {item.timeDeltaMinutes > 0 ? `+${item.timeDeltaMinutes}` : item.timeDeltaMinutes} phút
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
