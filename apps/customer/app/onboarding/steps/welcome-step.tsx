"use client";

import { Button } from "@commute-iq/ui/components/button";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <WelcomeIllustration />
      <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
        Tiền đi lại,
        <br />
        nhìn rõ <span className="rounded-md bg-lime px-1.5">trong 30 giây</span>
      </h1>
      <p className="text-sm leading-relaxed text-ink-soft">
        Không cần gõ tay. App tự nhận xe máy, Grab, gửi xe, cà phê dọc đường — và chỉ ra chỗ tiền đang chảy.
      </p>
      <div className="flex w-full flex-col gap-3">
        <Button onClick={onNext}>Bắt đầu →</Button>
      </div>
    </div>
  );
}

function WelcomeIllustration() {
  return (
    <svg
      viewBox="0 0 220 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hình minh hoạ commute"
      className="h-44 w-52"
    >
      <ellipse cx="110" cy="170" rx="90" ry="12" fill="hsl(var(--foreground))" opacity=".08" />
      <rect x="40" y="65" width="140" height="95" rx="14" fill="hsl(var(--lime))" stroke="hsl(var(--foreground))" strokeWidth="3" />
      <rect x="40" y="65" width="140" height="28" rx="14" fill="hsl(var(--coral))" stroke="hsl(var(--foreground))" strokeWidth="3" />
      <circle cx="155" cy="113" r="13" fill="hsl(var(--foreground))" />
      <circle cx="155" cy="113" r="5" fill="hsl(var(--lime))" />
      <g transform="translate(58 22)">
        <circle cx="20" cy="20" r="22" fill="hsl(var(--paper))" stroke="hsl(var(--foreground))" strokeWidth="2.5" />
        <text x="20" y="28" fontSize="22" textAnchor="middle">🛵</text>
      </g>
      <g transform="translate(140 12)">
        <circle cx="20" cy="20" r="20" fill="hsl(var(--sky))" stroke="hsl(var(--foreground))" strokeWidth="2.5" />
        <text x="20" y="27" fontSize="18" textAnchor="middle">☕</text>
      </g>
      <g transform="translate(170 75)">
        <circle cx="16" cy="16" r="16" fill="hsl(var(--rose))" stroke="hsl(var(--foreground))" strokeWidth="2.5" />
        <text x="16" y="22" fontSize="15" textAnchor="middle">⛽</text>
      </g>
    </svg>
  );
}
