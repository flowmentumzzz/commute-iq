export type MagicLinkChannel = "supabase" | "resend";

export interface SendMagicLinkResult {
  channel: MagicLinkChannel;
  supabaseError?: string;
}

export interface SendMagicLinkInput {
  email: string;
  redirectTo: string;
}

export interface OtpFailure {
  message: string;
  status?: number;
}

export interface OtpSender {
  send(input: SendMagicLinkInput): Promise<OtpFailure | null>;
}

export interface FallbackLinkGenerator {
  generate(input: SendMagicLinkInput): Promise<string>;
}

export interface ResendSender {
  send(input: { to: string; subject: string; html: string; text: string }): Promise<void>;
}

export interface SendMagicLinkDeps {
  otp: OtpSender;
  linkGenerator: FallbackLinkGenerator | null;
  resend: ResendSender | null;
}

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

export async function sendMagicLink(
  input: SendMagicLinkInput,
  deps: SendMagicLinkDeps
): Promise<SendMagicLinkResult> {
  const failure = await deps.otp.send(input);

  if (!failure) {
    return { channel: "supabase" };
  }

  if (!isRetryable(failure)) {
    throw new MagicLinkError(failure.message, failure.status ?? 500);
  }

  if (!deps.linkGenerator || !deps.resend) {
    throw new MagicLinkError(
      "Supabase email failed and Resend fallback is not configured.",
      503,
      { supabaseError: failure.message }
    );
  }

  const link = await deps.linkGenerator.generate(input);

  await deps.resend.send({
    to: input.email,
    subject: "Link đăng nhập commute.vn",
    html: renderHtml(link),
    text: renderText(link)
  });

  return { channel: "resend", supabaseError: failure.message };
}

function isRetryable(failure: OtpFailure): boolean {
  if (failure.status === undefined) return true;
  return RETRYABLE_STATUSES.has(failure.status);
}

function renderHtml(link: string): string {
  const safe = escapeHtml(link);
  return `<!doctype html><html><body style="font-family:system-ui,sans-serif;padding:24px;background:#FFF6E5;color:#1A1A1A">
<h1 style="font-size:20px;margin:0 0 12px">Link đăng nhập commute.vn</h1>
<p style="margin:0 0 16px">Bấm nút bên dưới để đăng nhập. Link có hiệu lực trong 60 phút.</p>
<p style="margin:0 0 24px"><a href="${safe}" style="display:inline-block;background:#D7FF3D;color:#1A1A1A;border:2.5px solid #1A1A1A;padding:12px 18px;text-decoration:none;font-weight:600">Đăng nhập</a></p>
<p style="margin:0;color:#666;font-size:12px">Nếu nút không hoạt động, sao chép URL này vào trình duyệt:<br>${safe}</p>
</body></html>`;
}

function renderText(link: string): string {
  return `Link đăng nhập commute.vn\n\nMở link sau để đăng nhập (hết hạn sau 60 phút):\n${link}\n`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export class MagicLinkError extends Error {
  status: number;
  details?: Record<string, unknown>;

  constructor(message: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.name = "MagicLinkError";
    this.status = status;
    this.details = details;
  }
}
