import { formatMillionsVnd } from "./format";

interface KpiRowProps {
  totalSpendVnd: number;
  approvedCount: number;
  approvedTotal: number;
  needsReviewCount: number;
  flaggedCount: number;
  employees: number;
}

interface KpiCardProps {
  label: string;
  value: string;
  suffix?: string;
  delta: string;
  tone: "paper" | "lime" | "rose" | "sky";
}

const TONE_STYLES: Record<KpiCardProps["tone"], string> = {
  paper: "bg-paper",
  lime: "bg-lime",
  rose: "bg-rose",
  sky: "bg-sky"
};

function KpiCard({ label, value, suffix, delta, tone }: KpiCardProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-foreground p-4 shadow-brutal-sm ${TONE_STYLES[tone]}`}
    >
      <p className="mb-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground/65">
        {label}
      </p>
      <p className="font-display text-2xl font-extrabold leading-tight tracking-tight text-foreground">
        {value}
        {suffix ? (
          <small className="ml-1 text-[13px] font-medium opacity-60">{suffix}</small>
        ) : null}
      </p>
      <p className="mt-1 font-mono text-[10px] tracking-tight text-foreground/70">{delta}</p>
    </div>
  );
}

export function KpiRow({
  totalSpendVnd,
  approvedCount,
  approvedTotal,
  needsReviewCount,
  flaggedCount,
  employees
}: KpiRowProps) {
  const total = formatMillionsVnd(totalSpendVnd);

  return (
    <section className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KpiCard
        tone="paper"
        label="TỔNG CHI"
        value={total.value}
        suffix={total.suffix}
        delta={`${employees} nhân viên`}
      />
      <KpiCard
        tone="lime"
        label="ĐÃ DUYỆT"
        value={approvedCount.toString()}
        suffix={`/${approvedTotal}`}
        delta="74% claim tháng này"
      />
      <KpiCard
        tone="rose"
        label="CẦN XEM"
        value={`${needsReviewCount} `}
        suffix="⚠"
        delta="bất thường nhẹ"
      />
      <KpiCard
        tone="sky"
        label="ĐÁNH DẤU"
        value={`${flaggedCount} `}
        suffix="✗"
        delta="có thể trùng / sai pattern"
      />
    </section>
  );
}
