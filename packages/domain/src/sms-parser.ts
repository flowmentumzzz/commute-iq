import type { CommuteCategory, CommuteTransaction } from "./types";

type MerchantRule = {
  pattern: RegExp;
  merchant: string;
  category: CommuteCategory;
};

const merchantRules: MerchantRule[] = [
  { pattern: /\b(grab|be|xanh\s*sm)\b/i, merchant: "GRAB", category: "ride_hailing" },
  { pattern: /\b(petrolimex|pvoil|cay xang|xang)\b/i, merchant: "PETROLIMEX", category: "fuel" },
  { pattern: /\b(gui xe|giu xe|parking|vincom)\b/i, merchant: "GUI XE", category: "parking" },
  { pattern: /\b(ca phe|coffee|phuc long|highlands)\b/i, merchant: "CA PHE", category: "routine" }
];

const amountPattern = /(?:tru|thanh toan|-)?\s*([0-9][0-9.,]*)\s*(?:vnd|d|đ)/i;

export function parseCommuteTransactions(messages: string[]): CommuteTransaction[] {
  return messages.flatMap((raw) => {
    const rule = merchantRules.find((candidate) => candidate.pattern.test(raw));
    const amount = extractAmount(raw);

    if (!rule || amount === null) {
      return [];
    }

    return [
      {
        amountVnd: amount,
        category: rule.category,
        merchant: rule.merchant,
        source: "sms",
        raw
      }
    ];
  });
}

function extractAmount(message: string): number | null {
  const match = message.match(amountPattern);

  if (!match) {
    return null;
  }

  const normalized = match[1].replace(/[.,]/g, "");
  const amount = Number.parseInt(normalized, 10);

  return Number.isFinite(amount) ? amount : null;
}
