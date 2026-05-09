import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { fetchDemoCost, getApiBaseUrl } from "../lib/api";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export const dynamic = "force-dynamic";

export async function ApiReferenceCard() {
  const payload = await fetchDemoCost();
  const baseUrl = getApiBaseUrl();

  if (!payload) {
    return (
      <Card className="border-dashed">
        <CardHeader className="gap-3">
          <Badge variant="secondary" className="w-fit">
            API · offline
          </Badge>
          <CardTitle>API chưa kết nối</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Chạy <code className="font-mono text-foreground">npm run dev:api</code> để bật server, sau đó tải lại trang.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Endpoint: {baseUrl}/commute/demo
          </p>
        </CardContent>
      </Card>
    );
  }

  const { result } = payload;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="flex flex-col gap-2">
          <Badge variant="ink" className="w-fit">
            API · validated
          </Badge>
          <CardTitle>Đối chiếu từ NestJS API</CardTitle>
        </div>
        <span className="font-display text-2xl font-extrabold tabular-nums">
          {currency.format(result.totalMonthlyVnd)}
          <span className="ml-1 font-mono text-[10px] font-normal uppercase tracking-wider text-ink-soft">
            / tháng
          </span>
        </span>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <BucketCell label="Trực tiếp" value={result.breakdown.directMonthlyVnd} />
        <BucketCell label="Khấu hao" value={result.breakdown.amortizedMonthlyVnd} />
        <BucketCell label="Mưa" value={result.breakdown.weatherMonthlyVnd} />
        <BucketCell label="Thói quen" value={result.breakdown.routineMonthlyVnd} />
        <p className="col-span-full mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Nguồn: {baseUrl}/commute/demo
        </p>
      </CardContent>
    </Card>
  );
}

function BucketCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border-2 border-foreground bg-paper px-3 py-2 shadow-brutal-sm">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-sm font-bold tabular-nums">{currency.format(value)}</p>
    </div>
  );
}
