"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@commute-iq/ui/components/button";

type Status = "idle" | "submitting" | "sent" | "error" | "cooldown";

interface SignInFormProps {
  next: string;
}

const COOLDOWN_MS = 60_000;
const COOLDOWN_KEY_PREFIX = "commute-iq.signin.lastsent.";

function cooldownKey(email: string): string {
  return COOLDOWN_KEY_PREFIX + email;
}

function readCooldownEnd(email: string): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(cooldownKey(email));
  if (!raw) return null;
  const sentAt = Number(raw);
  if (!Number.isFinite(sentAt)) return null;
  const end = sentAt + COOLDOWN_MS;
  return end > Date.now() ? end : null;
}

function writeCooldown(email: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cooldownKey(email), String(Date.now()));
}

export function SignInForm({ next }: SignInFormProps) {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const inFlightRef = useRef(false);

  const emailSchema = useMemo(
    () =>
      z
        .string({ required_error: t("emailRequired") })
        .trim()
        .toLowerCase()
        .email(t("emailInvalid")),
    [t]
  );

  useEffect(() => {
    if (status !== "cooldown") return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setStatus("idle");
          setMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  function startCooldown(emailValue: string, fromServer: boolean): void {
    writeCooldown(emailValue);
    setSecondsLeft(Math.ceil(COOLDOWN_MS / 1000));
    setStatus("cooldown");
    setMessage(fromServer ? t("rateLimitMessage") : t("cooldownMessage"));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (inFlightRef.current) return;

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? t("emailInvalid"));
      return;
    }

    const cooldownEnd = readCooldownEnd(parsed.data);
    if (cooldownEnd) {
      const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
      setSecondsLeft(remaining);
      setStatus("cooldown");
      setMessage(t("cooldownMessage"));
      return;
    }

    inFlightRef.current = true;
    setStatus("submitting");
    setMessage(null);

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, next })
      });

      const body = (await response.json().catch(() => null)) as
        | { ok?: boolean; channel?: "supabase" | "resend"; error?: string }
        | null;

      if (!response.ok || !body?.ok) {
        if (response.status === 429) {
          startCooldown(parsed.data, true);
          return;
        }
        setStatus("error");
        setMessage(body?.error ?? t("sendFailGeneric"));
        return;
      }

      writeCooldown(parsed.data);
      setStatus("sent");
      setMessage(body.channel === "resend" ? t("sentMessageResend") : t("sentMessage"));
    } catch (error: unknown) {
      setStatus("error");
      setMessage(getErrorMessage(error, t("genericError")));
    } finally {
      inFlightRef.current = false;
    }
  }

  const isLocked = status === "submitting" || status === "sent" || status === "cooldown";

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <label className="flex flex-col gap-2">
        <span className="font-display text-sm font-semibold">{t("emailLabel")}</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "submitting" || status === "sent"}
          placeholder={t("emailPlaceholder")}
          className="h-11 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      <Button type="submit" disabled={isLocked}>
        {status === "submitting"
          ? t("submitting")
          : status === "sent"
            ? t("sent")
            : status === "cooldown"
              ? t("wait", { seconds: secondsLeft })
              : t("submit")}
      </Button>

      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`font-mono text-[11px] uppercase tracking-wider ${
            status === "error" ? "text-coral" : status === "cooldown" ? "text-ink-soft" : "text-leaf"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  return fallback;
}
