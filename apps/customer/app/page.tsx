import { calculateTrueCost, demoTrueCostInput, mockTransactions, transportComparisons } from "@commute-iq/domain";
import { Badge } from "@commute-iq/ui/components/badge";
import { Button } from "@commute-iq/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { CommuteBreakdownChart } from "../components/commute-breakdown-chart";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export default function CustomerHomePage() {
  const cost = calculateTrueCost(demoTrueCostInput);
  const salaryPercent = cost.salaryShare ? Math.round(cost.salaryShare * 1000) / 10 : null;

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

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-primary/20 bg-card/90">
            <CardHeader className="gap-4">
              <Badge className="w-fit">True Cost Calculator</Badge>
              <div className="flex flex-col gap-3">
                <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                  Ban khong ton 280k.
                  <span className="block text-primary">Ban ton gan 2 trieu.</span>
                </h1>
                <CardDescription className="max-w-2xl text-base">
                  Xe may, tien mat, Grab khi mua, gui xe, ca phe tren duong: tat ca duoc gom lai thanh
                  mot con so that.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
                <p className="text-sm opacity-80">Chi phi di lai that moi thang</p>
                <p className="mt-3 font-display text-5xl font-black">{currency.format(cost.totalMonthlyVnd)}</p>
                <p className="mt-3 text-sm opacity-80">
                  {salaryPercent}% luong thang cua nhan vien van phong mau tai TP.HCM.
                </p>
              </div>
              <CommuteBreakdownChart breakdown={cost.breakdown} />
            </CardContent>
          </Card>

          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>Mua Cost</CardTitle>
              <CardDescription>Thang nay HCMC co 14 ngay mua. Ban chuyen sang Grab 7 ngay.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-2xl bg-secondary p-5">
                <p className="text-sm text-muted-foreground">Chi phi tang them vi mua</p>
                <p className="font-display text-4xl font-black">{currency.format(cost.breakdown.weatherMonthlyVnd)}</p>
              </div>
              <Button size="lg">Xem commute wrapped</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Auto-capture mock</CardTitle>
              <CardDescription>SMS ngan hang va vi dien tu duoc parse bang regex that.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {mockTransactions.map((transaction) => (
                <div key={`${transaction.merchant}-${transaction.amountVnd}`} className="flex items-center justify-between rounded-2xl bg-muted p-4">
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
              <CardTitle>So sanh phuong tien</CardTitle>
              <CardDescription>Break-even nhanh cho thoi quen di lam hang ngay.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {transportComparisons.map((item) => (
                <div key={item.mode} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-2xl border border-border p-4">
                  <p className="font-semibold">{item.mode}</p>
                  <p>{currency.format(item.dailyVnd)}/ngay</p>
                  <Badge variant="outline">{item.timeDeltaMinutes > 0 ? `+${item.timeDeltaMinutes}` : item.timeDeltaMinutes} phut</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
