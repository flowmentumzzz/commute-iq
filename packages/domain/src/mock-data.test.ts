import { describe, expect, it } from "vitest";

import { motorbikeModels } from "./mock-data.js";

describe("motorbikeModels catalog", () => {
  it("has at least 30 entries", () => {
    expect(motorbikeModels.length).toBeGreaterThanOrEqual(30);
  });

  it("every entry has positive prices, non-negative fuel, positive maintenance", () => {
    for (const model of motorbikeModels) {
      expect(model.purchasePriceVnd).toBeGreaterThan(0);
      expect(model.resaleValueVnd).toBeGreaterThan(0);
      expect(model.fuelLitersPer100Km).toBeGreaterThanOrEqual(0);
      expect(model.maintenanceYearlyVnd).toBeGreaterThan(0);
    }
  });

  it("residual is always less than purchase price", () => {
    for (const model of motorbikeModels) {
      expect(model.resaleValueVnd).toBeLessThan(model.purchasePriceVnd);
    }
  });

  it("ids are unique kebab-case", () => {
    const seen = new Set<string>();
    const kebabPattern = /^[a-z0-9-]+$/;
    for (const model of motorbikeModels) {
      expect(model.id).toMatch(kebabPattern);
      expect(seen.has(model.id)).toBe(false);
      seen.add(model.id);
    }
  });

  it("includes EV models with zero fuel consumption", () => {
    const evs = motorbikeModels.filter((m) => m.fuelLitersPer100Km === 0);
    expect(evs.length).toBeGreaterThanOrEqual(4);
    for (const ev of evs) {
      expect(ev.id.startsWith("vinfast-") || ev.id.startsWith("dat-bike-") || ev.id.startsWith("yadea-")).toBe(true);
    }
  });
});
