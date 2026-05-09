"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@commute-iq/ui/components/button";
import { Card, CardContent } from "@commute-iq/ui/components/card";

const STORAGE_KEY = "commute-iq:welcome-dismissed";

type Visibility = "checking" | "visible" | "hidden";

export function WelcomeBanner() {
  const [visibility, setVisibility] = useState<Visibility>("checking");

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      setVisibility(dismissed === "1" ? "hidden" : "visible");
    } catch {
      setVisibility("visible");
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage not available — banner still hides for this tab.
    }
    setVisibility("hidden");
  }

  if (visibility !== "visible") {
    return null;
  }

  return (
    <Card className="relative overflow-hidden bg-foreground text-paper">
      <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-coral/35 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-16 size-44 rounded-full bg-lime/25 blur-3xl" />
      <CardContent className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-paper/60 bg-paper/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider">
            ✨ Hello
          </span>
          <h3 className="mt-3 font-display text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
            Bạn đang xem dữ liệu mẫu
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-paper/85">
            Kéo các thanh ở bên dưới để xem chi phí đi lại thật của bạn — hoặc thiết lập tài khoản 30 giây để app hiểu cách bạn đi lại.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:flex-shrink-0 sm:flex-col">
          <Button asChild variant="default">
            <Link href="/sign-in?next=/onboarding" onClick={dismiss}>
              Bắt đầu thiết lập →
            </Link>
          </Button>
          <Button variant="secondary" onClick={dismiss}>
            Bỏ qua, dùng mẫu
          </Button>
        </div>
        <button
          type="button"
          aria-label="Đóng"
          onClick={dismiss}
          className="absolute right-3 top-3 grid size-7 place-items-center rounded-full border-2 border-paper/60 bg-paper/10 text-xs font-bold text-paper transition hover:bg-paper/20"
        >
          ×
        </button>
      </CardContent>
    </Card>
  );
}
