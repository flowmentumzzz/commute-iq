import type { ClaimRow } from "@commute-iq/domain";

import { ClaimsTableRow } from "./claims-table-row";

interface ClaimsTableProps {
  claims: ClaimRow[];
  totalThisMonth: number;
}

export function ClaimsTable({ claims, totalThisMonth }: ClaimsTableProps) {
  return (
    <section className="rounded-2xl border-2 border-foreground bg-paper p-5 shadow-brutal-sm">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[15px] font-bold text-foreground">
          Yêu cầu hoàn phí gần đây
        </h3>
        <span className="font-mono text-[10px] text-foreground/55">
          {claims.length} / {totalThisMonth}
        </span>
      </header>

      <div
        className="grid grid-cols-[32px_1.1fr_1.1fr_0.7fr_0.85fr_auto] gap-2.5 border-b-2 border-foreground px-1 pb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-foreground/55"
      >
        <span aria-hidden />
        <span>Nhân viên</span>
        <span>Tuyến</span>
        <span>Số tiền</span>
        <span>Trạng thái</span>
        <span aria-hidden />
      </div>

      <div className="text-xs">
        {claims.map((claim) => (
          <ClaimsTableRow key={claim.id} claim={claim} />
        ))}
      </div>
    </section>
  );
}
