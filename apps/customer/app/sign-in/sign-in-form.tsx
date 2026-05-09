"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@commute-iq/ui/components/button";

import { createBrowserSupabaseClient } from "../../lib/supabase/browser";

const emailSchema = z
  .string({ required_error: "Vui lòng nhập email." })
  .trim()
  .toLowerCase()
  .email("Email chưa đúng định dạng.");

type Status = "idle" | "submitting" | "sent" | "error";

interface SignInFormProps {
  next: string;
}

export function SignInForm({ next }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Email chưa hợp lệ.");
      return;
    }

    setStatus("submitting");
    setMessage(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const callback = new URL("/auth/callback", window.location.origin);
      callback.searchParams.set("next", next);

      const { error } = await supabase.auth.signInWithOtp({
        email: parsed.data,
        options: { emailRedirectTo: callback.toString() }
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("sent");
      setMessage("Kiểm tra email — link đăng nhập đã được gửi.");
    } catch (error: unknown) {
      setStatus("error");
      setMessage(getErrorMessage(error));
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <label className="flex flex-col gap-2">
        <span className="font-display text-sm font-semibold">Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "submitting" || status === "sent"}
          placeholder="ban@congty.vn"
          className="h-11 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
        />
      </label>

      <Button type="submit" disabled={status === "submitting" || status === "sent"}>
        {status === "submitting" ? "Đang gửi…" : status === "sent" ? "Đã gửi" : "Gửi link đăng nhập"}
      </Button>

      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`font-mono text-[11px] uppercase tracking-wider ${
            status === "error" ? "text-coral" : "text-leaf"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Có lỗi xảy ra. Vui lòng thử lại.";
}
