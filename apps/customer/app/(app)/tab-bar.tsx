"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  href: string;
  emoji: string;
  label: string;
}

const TABS: Tab[] = [
  { href: "/", emoji: "🏠", label: "Trang chủ" },
  { href: "/insights", emoji: "📊", label: "Thấu hiểu" },
  { href: "/claims", emoji: "💼", label: "Hoàn phí" },
  { href: "/profile", emoji: "👤", label: "Tôi" }
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-3xl items-stretch justify-around border-t-2 border-foreground bg-paper px-3 py-2 lg:relative lg:mt-6 lg:max-w-5xl lg:rounded-full lg:border-2 lg:bg-paper lg:px-2 lg:shadow-brutal-sm"
    >
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center gap-1 px-1 py-2 lg:flex-row lg:justify-center lg:gap-2"
          >
            <span
              className={`grid size-9 place-items-center rounded-xl border-2 text-base transition lg:size-7 ${
                active ? "border-foreground bg-lime" : "border-transparent text-ink-soft"
              }`}
              aria-hidden
            >
              {tab.emoji}
            </span>
            <span
              className={`font-display text-[10px] font-semibold uppercase tracking-wider lg:text-xs lg:normal-case lg:tracking-normal ${
                active ? "text-foreground" : "text-ink-soft"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
