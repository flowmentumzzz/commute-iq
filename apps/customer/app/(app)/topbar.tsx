import Link from "next/link";
import { Badge } from "@commute-iq/ui/components/badge";

import { ThemeToggle } from "../../components/theme-toggle";

interface TopbarProps {
  email: string | null;
}

export function Topbar({ email }: TopbarProps) {
  return (
    <header className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4 pt-6 sm:px-6 lg:max-w-5xl">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex size-11 -rotate-[4deg] items-center justify-center rounded-[12px] border-2 border-foreground bg-lime text-2xl shadow-brutal-sm">
          🛵
        </div>
        <div>
          <p className="font-display text-xl font-extrabold leading-none tracking-tight">
            commute<span className="text-coral">.</span>vn
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            {"// hello"}
          </p>
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="hidden sm:inline-flex">
          Hackathon MVP
        </Badge>
        <ThemeToggle />
        {email && (
          <span
            className="hidden max-w-[10rem] truncate font-mono text-[10px] uppercase tracking-wider text-ink-soft md:inline"
            title={email}
          >
            {email}
          </span>
        )}
      </div>
    </header>
  );
}
