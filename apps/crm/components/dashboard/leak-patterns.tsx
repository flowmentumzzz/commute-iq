import type { LeakPattern } from "@commute-iq/domain";

interface LeakPatternsProps {
  patterns: LeakPattern[];
}

const SEVERITY_STYLES: Record<LeakPattern["severity"], string> = {
  high: "bg-coral text-paper",
  warn: "bg-bg-2 text-foreground",
  info: "bg-sky text-foreground"
};

export function LeakPatterns({ patterns }: LeakPatternsProps) {
  return (
    <section className="rounded-2xl border-2 border-foreground bg-paper p-5 shadow-brutal-sm">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[15px] font-bold text-foreground">Pattern rò rỉ</h3>
        <span className="font-mono text-[10px] text-foreground/55">auto-dò</span>
      </header>

      <ul className="list-none">
        {patterns.map((pattern) => (
          <li
            key={pattern.rank}
            className="flex gap-3 border-b border-dashed border-foreground/15 py-3 last:border-b-0"
          >
            <div
              className={`flex size-7 flex-shrink-0 items-center justify-center rounded-lg border-[1.5px] border-foreground font-display text-[13px] font-extrabold ${SEVERITY_STYLES[pattern.severity]}`}
            >
              {pattern.rank}
            </div>
            <div>
              <strong className="block text-[12.5px] font-semibold leading-tight text-foreground">
                {pattern.title}
              </strong>
              <span className="block font-mono text-[11px] text-foreground/65">
                {pattern.detail}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
