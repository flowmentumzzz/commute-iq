import { mockTransactions, transportComparisons } from "@commute-iq/domain";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { MoneyLeakSpotlight } from "../components/money-leak-spotlight";
import { TrueCostCalculator } from "../components/true-cost-calculator";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export default function CustomerHomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)),transparent_34%),linear-gradient(135deg,hsl(var(--background)),#f7dfbb)] px-5 py-6 md:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-xl text-primary-foreground">
              CW
            </div>
            <div>
              <p className="font-display text-xl font-bold">Commute Wallet</p>
              <p className="text-sm text-muted-foreground">Vietnam-first commute finance</p>
            </div>
          </div>
          <Badge variant="secondary">Hackathon MVP</Badge>
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
                  className="flex items-center justify-between rounded-2xl bg-muted p-4"
                >
                  <div>
                    <p className="font-semibold">{transaction.merchant}</p>
                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                  </div>
                  <p className="font-semibold">{currency.format(transaction.amountVnd)}</p>
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
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-2xl border border-border p-4"
                >
                  <p className="font-semibold">{item.mode}</p>
                  <p>{currency.format(item.dailyVnd)}/ngày</p>
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
