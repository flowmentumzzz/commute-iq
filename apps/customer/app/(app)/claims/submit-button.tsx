"use client";

import { useState } from "react";
import { Button } from "@commute-iq/ui/components/button";

interface ClaimSubmitButtonProps {
  totalCount: number;
}

type Status = "idle" | "submitting" | "submitted" | "error";

export function ClaimSubmitButton({ totalCount }: ClaimSubmitButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/claims/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ count: totalCount })
      });

      if (!response.ok) {
        setStatus("error");
        setMessage("Không gửi được. Vui lòng thử lại.");
        return;
      }

      setStatus("submitted");
      setMessage(`Đã gửi ${totalCount} chuyến — bộ phận tài chính sẽ duyệt trong 24h.`);
    } catch {
      setStatus("error");
      setMessage("Không kết nối được server.");
    }
  }

  if (status === "submitted") {
    return (
      <div className="rounded-2xl border-2 border-foreground bg-leaf p-4 text-paper shadow-brutal-sm">
        <p className="font-display font-bold">✓ Đã gửi · chờ duyệt</p>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="destructive" onClick={submit} disabled={status === "submitting"}>
        {status === "submitting" ? "Đang gửi…" : `✨ Gửi ${totalCount} chuyến · 1 chạm`}
      </Button>
      {message && status === "error" && (
        <p role="alert" className="font-mono text-[10px] uppercase tracking-wider text-coral">
          {message}
        </p>
      )}
    </div>
  );
}
