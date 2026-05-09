"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@commute-iq/ui/components/button";

interface ClaimSubmitButtonProps {
  totalCount: number;
}

type Status = "idle" | "submitting" | "submitted" | "error";

export function ClaimSubmitButton({ totalCount }: ClaimSubmitButtonProps) {
  const t = useTranslations("claims");
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
        setMessage(t("submitFail"));
        return;
      }

      setStatus("submitted");
      setMessage(t("submittedBody", { count: totalCount }));
    } catch {
      setStatus("error");
      setMessage(t("networkFail"));
    }
  }

  if (status === "submitted") {
    return (
      <div className="rounded-2xl border-2 border-foreground bg-leaf p-4 text-paper shadow-brutal-sm">
        <p className="font-display font-bold">{t("submittedTitle")}</p>
        {message && <p className="mt-1 text-sm opacity-90">{message}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="destructive" onClick={submit} disabled={status === "submitting"}>
        {status === "submitting" ? t("submitting") : t("submitCta", { count: totalCount })}
      </Button>
      {message && status === "error" && (
        <p role="alert" className="font-mono text-[10px] uppercase tracking-wider text-coral">
          {message}
        </p>
      )}
    </div>
  );
}
