import type { CommuteTransaction, MoneyLeak } from "./types";

const SAVINGS_FACTOR_BY_CATEGORY: Record<string, number> = {
  routine: 0.7,
  ride_hailing: 0.4,
  parking: 0.5,
  fuel: 0.1,
  maintenance: 0
};

interface FindMoneyLeaksOptions {
  minCount?: number;
  limit?: number;
}

export function findMoneyLeaks(
  transactions: readonly CommuteTransaction[],
  options: FindMoneyLeaksOptions = {}
): MoneyLeak[] {
  const minCount = options.minCount ?? 3;
  const limit = options.limit ?? 5;

  const grouped = new Map<
    string,
    Pick<MoneyLeak, "merchant" | "category" | "count" | "totalAmountVnd">
  >();

  for (const transaction of transactions) {
    const key = `${transaction.merchant}|${transaction.category}`;
    const current = grouped.get(key) ?? {
      merchant: transaction.merchant,
      category: transaction.category,
      count: 0,
      totalAmountVnd: 0
    };
    current.count += 1;
    current.totalAmountVnd += transaction.amountVnd;
    grouped.set(key, current);
  }

  return Array.from(grouped.values())
    .filter((entry) => entry.count >= minCount)
    .map<MoneyLeak>((entry) => ({
      merchant: entry.merchant,
      category: entry.category,
      count: entry.count,
      totalAmountVnd: entry.totalAmountVnd,
      averageAmountVnd: Math.round(entry.totalAmountVnd / entry.count),
      estimatedMonthlySavingsVnd: Math.round(
        entry.totalAmountVnd * (SAVINGS_FACTOR_BY_CATEGORY[entry.category] ?? 0)
      )
    }))
    .sort((a, b) => b.totalAmountVnd - a.totalAmountVnd)
    .slice(0, limit);
}
