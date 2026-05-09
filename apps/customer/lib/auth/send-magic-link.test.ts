import { describe, expect, it, vi } from "vitest";

import {
  MagicLinkError,
  sendMagicLink,
  type FallbackLinkGenerator,
  type OtpFailure,
  type OtpSender,
  type ResendSender
} from "./send-magic-link";

const input = { email: "user@example.com", redirectTo: "https://app.example/auth/callback?next=/" };

function otpThatSucceeds(): OtpSender {
  return { send: vi.fn().mockResolvedValue(null) };
}

function otpThatFails(failure: OtpFailure): OtpSender {
  return { send: vi.fn().mockResolvedValue(failure) };
}

function linkGen(link = "https://supabase.example/auth/verify?token=abc"): FallbackLinkGenerator {
  return { generate: vi.fn().mockResolvedValue(link) };
}

function resend(): ResendSender {
  return { send: vi.fn().mockResolvedValue(undefined) };
}

describe("sendMagicLink", () => {
  it("returns supabase channel when OTP succeeds and never touches the fallback", async () => {
    const otp = otpThatSucceeds();
    const linkGenerator = linkGen();
    const sender = resend();

    const result = await sendMagicLink(input, { otp, linkGenerator, resend: sender });

    expect(result).toEqual({ channel: "supabase" });
    expect(linkGenerator.generate).not.toHaveBeenCalled();
    expect(sender.send).not.toHaveBeenCalled();
  });

  it("falls back to Resend on retryable Supabase failure (429)", async () => {
    const otp = otpThatFails({ message: "rate limited", status: 429 });
    const linkGenerator = linkGen("https://supabase.example/auth/verify?token=xyz");
    const sender = resend();

    const result = await sendMagicLink(input, { otp, linkGenerator, resend: sender });

    expect(result).toEqual({ channel: "resend", supabaseError: "rate limited" });
    expect(linkGenerator.generate).toHaveBeenCalledWith(input);
    expect(sender.send).toHaveBeenCalledTimes(1);
    const sent = (sender.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(sent.to).toBe(input.email);
    expect(sent.html).toContain("https://supabase.example/auth/verify?token=xyz");
    expect(sent.text).toContain("https://supabase.example/auth/verify?token=xyz");
  });

  it("falls back when Supabase throws without a status", async () => {
    const otp = otpThatFails({ message: "network down" });
    const linkGenerator = linkGen();
    const sender = resend();

    const result = await sendMagicLink(input, { otp, linkGenerator, resend: sender });

    expect(result.channel).toBe("resend");
    expect(sender.send).toHaveBeenCalledTimes(1);
  });

  it("rethrows non-retryable Supabase errors (400) without using Resend", async () => {
    const otp = otpThatFails({ message: "invalid email", status: 400 });
    const linkGenerator = linkGen();
    const sender = resend();

    await expect(
      sendMagicLink(input, { otp, linkGenerator, resend: sender })
    ).rejects.toBeInstanceOf(MagicLinkError);

    expect(linkGenerator.generate).not.toHaveBeenCalled();
    expect(sender.send).not.toHaveBeenCalled();
  });

  it("throws 503 when Supabase fails and Resend is not configured", async () => {
    const otp = otpThatFails({ message: "smtp dead", status: 500 });

    const error = await sendMagicLink(input, {
      otp,
      linkGenerator: null,
      resend: null
    }).catch((value) => value);

    expect(error).toBeInstanceOf(MagicLinkError);
    expect((error as MagicLinkError).status).toBe(503);
    expect((error as MagicLinkError).details).toMatchObject({ supabaseError: "smtp dead" });
  });

  it("escapes HTML special characters in the magic link", async () => {
    const tricky = "https://x.example/?a=1&b=<script>";
    const otp = otpThatFails({ message: "smtp dead", status: 500 });
    const linkGenerator = linkGen(tricky);
    const sender = resend();

    await sendMagicLink(input, { otp, linkGenerator, resend: sender });

    const sent = (sender.send as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(sent.html).not.toContain("<script>");
    expect(sent.html).toContain("&lt;script&gt;");
    expect(sent.html).toContain("&amp;b=");
  });
});
