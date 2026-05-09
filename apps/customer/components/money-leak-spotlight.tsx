import { findMoneyLeaks, mockTransactions, type MoneyLeak } from "@commute-iq/domain";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

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
  const leaks = findMoneyLeaks(mockTransactions, { minCount: 3, limit: 3 });
  const top = leaks[0];

  if (!top) {
    return null;
  }

  const others = leaks.slice(1);
  const topMeta = CATEGORY_TIPS[top.category];

  return (
    <Card className="bg-card/95">
      <CardHeader className="gap-3">
        <Badge className="w-fit" variant="secondary">
          Money Leak Detector
        </Badge>
        <CardTitle className="font-display text-2xl font-black md:text-3xl">
          {top.merchant} · {top.count} lần / tháng
        </CardTitle>
        <CardDescription>
          {topMeta.label} đang ngốn {currency.format(top.totalAmountVnd)} mỗi tháng. {topMeta.tip}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
          <p className="text-sm opacity-80">Tiết kiệm khả thi</p>
          <p className="mt-2 font-display text-3xl font-black md:text-4xl">
            ~{currency.format(top.estimatedMonthlySavingsVnd)}
          </p>
          <p className="mt-2 text-sm opacity-80">
            Trung bình {currency.format(top.averageAmountVnd)} mỗi lần.
          </p>
        </div>

        {others.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Các pattern khác
            </p>
            {others.map((leak) => (
              <div
                key={`${leak.merchant}-${leak.category}`}
                className="flex items-center justify-between rounded-2xl bg-muted px-4 py-3"
              >
                <div>
                  <p className="font-semibold">{leak.merchant}</p>
                  <p className="text-xs text-muted-foreground">
                    {leak.count} lần · {CATEGORY_TIPS[leak.category].label}
                  </p>
                </div>
                <p className="font-semibold">{currency.format(leak.totalAmountVnd)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
