import { describe, expect, it } from "vitest";

import { parseCommuteTransactions } from "./sms-parser";

describe("parseCommuteTransactions", () => {
  it("extracts commute-related transactions from Vietnamese bank and wallet messages", () => {
    const messages = [
      "VPBank: TK 1234 tru 56,000 VND tai GRAB BIKE HCMC ngay 18/11. So du 9,100,000 VND",
      "MoMo: Thanh toan 28.000d tai PETROLIMEX Nguyen Trai thanh cong",
      "ACB: -12,000 VND GUI XE VINCOM D1 08:11",
      "Shopee: Don hang da giao thanh cong"
    ];

    expect(parseCommuteTransactions(messages)).toEqual([
      {
        amountVnd: 56_000,
        category: "ride_hailing",
        merchant: "GRAB",
        source: "sms",
        raw: messages[0]
      },
      {
        amountVnd: 28_000,
        category: "fuel",
        merchant: "PETROLIMEX",
        source: "sms",
        raw: messages[1]
      },
      {
        amountVnd: 12_000,
        category: "parking",
        merchant: "GUI XE",
        source: "sms",
        raw: messages[2]
      }
    ]);
  });
});
