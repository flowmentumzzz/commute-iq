import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient } from "@commute-iq/supabase";

import { createServerSupabaseClient } from "../../../../lib/supabase/server";
import { createResendSender } from "../../../../lib/auth/resend-sender";
import {
  MagicLinkError,
  sendMagicLink,
  type FallbackLinkGenerator,
  type OtpFailure,
  type OtpSender
} from "../../../../lib/auth/send-magic-link";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email("Email chưa đúng định dạng."),
  next: z
    .string()
    .optional()
    .transform((value) => sanitizeNext(value))
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Email chưa hợp lệ." },
      { status: 400 }
    );
  }

  const origin = request.nextUrl.origin;
  const callback = new URL("/auth/callback", origin);
  callback.searchParams.set("next", parsed.data.next);

  const otp = createSupabaseOtpSender();
  const linkGenerator = createSupabaseLinkGenerator();
  const resend = createResendSender();

  try {
    const result = await sendMagicLink(
      { email: parsed.data.email, redirectTo: callback.toString() },
      { otp, linkGenerator, resend }
    );
    return NextResponse.json({ ok: true, channel: result.channel }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof MagicLinkError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng thử lại.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function createSupabaseOtpSender(): OtpSender {
  return {
    async send({ email, redirectTo }): Promise<OtpFailure | null> {
      try {
        const client = createServerSupabaseClient();
        const { error } = await client.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirectTo }
        });
        if (!error) return null;
        return { message: error.message, status: error.status };
      } catch (error: unknown) {
        return { message: error instanceof Error ? error.message : "Supabase OTP failed" };
      }
    }
  };
}

function createSupabaseLinkGenerator(): FallbackLinkGenerator | null {
  let service;
  try {
    service = createServiceSupabaseClient();
  } catch {
    return null;
  }

  return {
    async generate({ email, redirectTo }) {
      const { data, error } = await service.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo }
      });
      if (error) {
        throw new MagicLinkError(`Cannot generate fallback link: ${error.message}`, 500);
      }
      const action = data.properties?.action_link;
      if (!action) {
        throw new MagicLinkError("Fallback link missing action_link.", 500);
      }
      return action;
    }
  };
}

function sanitizeNext(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
