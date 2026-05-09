/**
 * Lightweight formatters for the manager dashboard. The prototype uses
 * compact Vietnamese number forms (e.g. "14.2M đ", "1.18M") so we don't
 * pull in `Intl.NumberFormat` for these — the rendered strings are part
 * of the visual design.
 */

export function formatMillionsVnd(amountVnd: number): { value: string; suffix: string } {
  const millions = amountVnd / 1_000_000;
  const value = millions.toFixed(millions < 10 ? 2 : 1);
  return { value, suffix: "M đ" };
}

export function formatCaughtMillions(amountVnd: number): { value: string; suffix: string } {
  const millions = amountVnd / 1_000_000;
  const value = millions.toFixed(2);
  return { value, suffix: "M" };
}

export function formatLeakSpendShort(amountVnd: number): string {
  const millions = Math.round(amountVnd / 1_000_000);
  return `${millions} triệu`;
}
