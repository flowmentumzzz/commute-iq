import { mockTransactions, transportComparisons } from "@commute-iq/domain";
import { Suspense } from "react";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { ApiReferenceCard } from "../../components/api-reference-card";
import { MoneyLeakSpotlight } from "../../components/money-leak-spotlight";
import { TripList } from "../../components/trip-list";
import { TrueCostCalculator } from "../../components/true-cost-calculator";
import { WelcomeBanner } from "../../components/welcome-banner";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

function ApiReferenceFallback() {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Đối chiếu từ NestJS API</CardTitle>
        <CardDescription className="font-mono text-[11px] uppercase tracking-widest">
          đang kết nối…
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function PlaygroundPage() {
  return (
    <main className="px-5 pb-12 pt-6 md:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <WelcomeBanner />

        <TrueCostCalculator />

        <Suspense fallback={<ApiReferenceFallback />}>
          <ApiReferenceCard />
        </Suspense>

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

        <Card>
          <CardHeader>
            <CardTitle>Giao dịch của bạn</CardTitle>
            <CardDescription>
              Thêm tay vài chuyến để Money Leak Detector kéo dữ liệu thật của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TripList />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
