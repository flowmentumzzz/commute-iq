import Link from "next/link";

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background bg-body-bloom">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-7 md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-12 -rotate-[4deg] items-center justify-center rounded-[14px] border-2 border-foreground bg-lime text-2xl shadow-brutal-sm">
            🛵
          </div>
          <div>
            <p className="font-display text-2xl font-extrabold leading-none tracking-tight">
              commute<span className="text-coral">.</span>vn
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-soft">
              {"// playground"}
            </p>
          </div>
        </Link>
        <Link
          href="/"
          className="rounded-full border-2 border-foreground bg-paper px-4 py-2 font-mono text-[11px] uppercase tracking-wider shadow-brutal-sm transition hover:-translate-x-px hover:-translate-y-px hover:shadow-brutal"
        >
          ← Quay lại app
        </Link>
      </header>
      {children}
    </div>
  );
}
