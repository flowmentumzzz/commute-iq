import type { HeatmapCell } from "@commute-iq/domain";

interface HeatmapProps {
  grid: HeatmapCell[][];
}

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const LEVEL_STYLES: Record<HeatmapCell["level"], string> = {
  0: "bg-foreground/5 border border-foreground/5",
  1: "bg-leaf/25 border border-leaf/25",
  2: "bg-leaf/50 border border-leaf/50",
  3: "bg-leaf/75 border border-leaf/75",
  4: "bg-leaf border border-leaf"
};

export function Heatmap({ grid }: HeatmapProps) {
  const weekCount = grid[0]?.length ?? 0;

  return (
    <section className="rounded-2xl border-2 border-foreground bg-paper p-5 shadow-brutal-sm">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[15px] font-bold text-foreground">Hoạt động 12 tuần</h3>
        <span className="font-mono text-[10px] text-foreground/55">đỏ = bất thường</span>
      </header>

      <div
        className="grid gap-[3px] font-mono text-[9px]"
        style={{ gridTemplateColumns: `28px repeat(${weekCount}, 1fr)` }}
        data-testid="heatmap-grid"
      >
        <div aria-hidden />
        {Array.from({ length: weekCount }).map((_, w) => (
          <div
            key={`week-${w + 1}`}
            className="flex h-[14px] items-center justify-center text-foreground/55"
          >
            w{w + 1}
          </div>
        ))}

        {grid.map((row, dayIndex) => (
          <Row key={DAY_LABELS[dayIndex] ?? `r-${dayIndex}`} dayIndex={dayIndex} cells={row} />
        ))}
      </div>

      <div className="mt-3 flex justify-between font-mono text-[10px] text-foreground/55">
        <span>ít</span>
        <span>nhiều ←</span>
      </div>
    </section>
  );
}

interface RowProps {
  dayIndex: number;
  cells: HeatmapCell[];
}

function Row({ dayIndex, cells }: RowProps) {
  return (
    <>
      <div className="flex h-[14px] items-center justify-center text-foreground/55">
        {DAY_LABELS[dayIndex] ?? ""}
      </div>
      {cells.map((cell, weekIndex) => {
        const baseClasses = cell.flag
          ? "bg-coral border border-foreground"
          : LEVEL_STYLES[cell.level];
        return (
          <div
            key={`d${dayIndex}-w${weekIndex}`}
            data-testid="heatmap-cell"
            data-level={cell.level}
            data-flag={cell.flag ? "true" : undefined}
            className={`aspect-square rounded-[3px] ${baseClasses}`}
          />
        );
      })}
    </>
  );
}
