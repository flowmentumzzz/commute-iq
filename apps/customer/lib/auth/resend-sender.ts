import { Resend } from "resend";
import type { ResendSender } from "./send-magic-link";

export function createResendSender(): ResendSender | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) return null;

  const client = new Resend(apiKey);

  return {
    async send({ to, subject, html, text }) {
      const { error } = await client.emails.send({ from, to, subject, html, text });
      if (error) {
        throw new Error(`Resend send failed: ${error.message}`);
      }
    }
  };
}
