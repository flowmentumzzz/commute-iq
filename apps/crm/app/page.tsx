import { calculateTrueCost, demoTrueCostInput, motorbikeModels, mockTransactions } from "@commute-iq/domain";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export default function CrmHomePage() {
  const cost = calculateTrueCost(demoTrueCostInput);
  const rideHailingTotal = mockTransactions
    .filter((transaction) => transaction.category === "ride_hailing")
    .reduce((sum, transaction) => sum + transaction.amountVnd, 0);

  return (
    <main className="min-h-screen bg-[linear-gradient(120deg,#173d33,#f3e1c4)] px-5 py-6 text-foreground md:px-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 rounded-[2rem] bg-card/95 p-6 md:flex-row md:items-end">
          <div>
            <Badge>CRM</Badge>
            <h1 className="mt-4 font-display text-5xl font-black tracking-tight">Commute Ops</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Internal foundation for user cohorts, reimbursement workflows, and Vietnam commute insight QA.
            </p>
          </div>
          <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
            <p className="text-sm opacity-80">Demo profile true cost</p>
            <p className="font-display text-4xl font-black">{currency.format(cost.totalMonthlyVnd)}</p>
          </div>
        </header>

        <div className="grid gap-5 md:grid-cols-3">
          <MetricCard label="Mock users" value="1,000 target" hint="Q1 2026 TP.HCM pilot" />
          <MetricCard label="SMS captured" value={mockTransactions.length.toString()} hint="Regex parser ready" />
          <MetricCard label="Rain delta" value={currency.format(cost.breakdown.weatherMonthlyVnd)} hint="14 rainy days model" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Transaction review queue</CardTitle>
              <CardDescription>Seed data for CRM review and future reimbursement approval.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {mockTransactions.map((transaction) => (
                <div key={`${transaction.merchant}-${transaction.amountVnd}`} className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl bg-muted p-4">
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
              <CardTitle>Static lookup readiness</CardTitle>
              <CardDescription>Vietnam-specific datasets that power the calculator.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {motorbikeModels.map((model) => (
                <div key={model.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{model.name}</p>
                    <Badge variant="outline">{model.fuelLitersPer100Km || "EV"} L/100km</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Maintenance {currency.format(model.maintenanceYearlyVnd)}/year
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reimbursement layer placeholder</CardTitle>
            <CardDescription>
              Next CRM phase: company policies, employee claims, approval timeline, and Misa/Base.vn export.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Ride-hailing review total: {currency.format(rideHailingTotal)}</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="bg-card/95">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-display text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
