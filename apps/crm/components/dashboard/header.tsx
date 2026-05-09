import Link from "next/link";

interface DashboardHeaderProps {
  companyName: string;
  period: string;
}

export function DashboardHeader({ companyName, period }: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-foreground bg-bg-2 px-6 py-4">
      <div>
        <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground">
          {companyName}
        </h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/60">
          {period}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-full border-2 border-foreground bg-paper px-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground shadow-brutal-sm transition-transform hover:-translate-x-px hover:-translate-y-px hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Xuất CSV
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-full border-2 border-foreground bg-lime px-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground shadow-brutal-sm transition-transform hover:-translate-x-px hover:-translate-y-px hover:shadow-brutal active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Duyệt tất cả ✓
        </button>
        <Link
          href="/dashboard/why"
          className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground/70 underline decoration-dashed underline-offset-4 hover:text-foreground"
        >
          Vì sao là tụi mình →
        </Link>
      </div>
    </header>
  );
}
