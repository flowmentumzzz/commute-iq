import { describe, expect, it } from "vitest";

import { findMoneyLeaks } from "./money-leak.js";
import type { CommuteTransaction } from "./types.js";

const make = (
  merchant: string,
  category: CommuteTransaction["category"],
  amountVnd: number
): CommuteTransaction => ({
  merchant,
  category,
  amountVnd,
  source: "mock"
});

describe("findMoneyLeaks", () => {
  it("ignores merchants below the minCount threshold", () => {
    const result = findMoneyLeaks(
      [make("HIGHLANDS", "routine", 35_000), make("HIGHLANDS", "routine", 35_000)],
      { minCount: 3 }
    );
    expect(result).toEqual([]);
  });

  it("ranks recurring merchants by total spend and applies category savings factor", () => {
    const transactions: CommuteTransaction[] = [
      make("HIGHLANDS", "routine", 38_000),
      make("HIGHLANDS", "routine", 38_000),
      make("HIGHLANDS", "routine", 42_000),
      make("HIGHLANDS", "routine", 38_000),
      make("PETROLIMEX", "fuel", 50_000),
      make("PETROLIMEX", "fuel", 50_000),
      make("PETROLIMEX", "fuel", 50_000),
      make("GUI XE", "parking", 8_000)
    ];

    const result = findMoneyLeaks(transactions, { minCount: 3 });

    expect(result).toHaveLength(2);
    expect(result[0].merchant).toBe("HIGHLANDS");
    expect(result[0].count).toBe(4);
    expect(result[0].totalAmountVnd).toBe(156_000);
    expect(result[0].averageAmountVnd).toBe(39_000);
    expect(result[0].estimatedMonthlySavingsVnd).toBe(Math.round(156_000 * 0.7));

    expect(result[1].merchant).toBe("PETROLIMEX");
    expect(result[1].count).toBe(3);
    expect(result[1].totalAmountVnd).toBe(150_000);
    expect(result[1].averageAmountVnd).toBe(50_000);
    expect(result[1].estimatedMonthlySavingsVnd).toBe(15_000);
  });

  it("returns no more than `limit` leaks", () => {
    const transactions: CommuteTransaction[] = Array.from({ length: 15 }, (_, index) =>
      make(`MERCHANT_${index % 5}`, "routine", 30_000)
    );
    const result = findMoneyLeaks(transactions, { minCount: 3, limit: 2 });
    expect(result).toHaveLength(2);
  });
});
