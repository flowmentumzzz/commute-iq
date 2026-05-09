import { formatCaughtMillions, formatLeakSpendShort } from "./format";

interface CompanyLeakProps {
  spendVnd: number;
  offPatternPct: number;
  caughtVnd: number;
}

export function CompanyLeak({ spendVnd, offPatternPct, caughtVnd }: CompanyLeakProps) {
  const spendShort = formatLeakSpendShort(spendVnd);
  const caught = formatCaughtMillions(caughtVnd);

  return (
    <section className="relative mb-5 overflow-hidden rounded-3xl border-2 border-foreground bg-foreground p-6 text-paper shadow-brutal">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-coral/35 blur-3xl"
      />
      <div className="relative z-[1] grid items-center gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-foreground">
            ✨ COMPANY MONEY LEAK
          </span>
          <h3 className="mb-2 font-display text-2xl font-extrabold leading-tight tracking-tight">
            Tháng này, công ty chi{" "}
            <em className="rounded bg-coral px-1.5 not-italic text-paper">{spendShort}</em>{" "}
            hỗ trợ đi lại — và {offPatternPct}% là chi sai pattern.
          </h3>
          <p className="text-sm leading-relaxed opacity-80">
            App tự dò 3 nhóm rò rỉ: claim trùng, chế độ không khớp, không có mặt tại văn phòng.
          </p>
        </div>
        <div className="rounded-2xl border-[1.5px] border-paper/20 bg-paper/5 p-5 text-center">
          <p className="font-display text-4xl font-extrabold leading-none tracking-tight text-lime">
            {caught.value}
            <small className="ml-0.5 text-lg opacity-65">{caught.suffix}</small>
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] opacity-60">
            rò rỉ phát hiện được
          </p>
        </div>
      </div>
    </section>
  );
}
