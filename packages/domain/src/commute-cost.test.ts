import { describe, expect, it } from "vitest";

import { calculateTrueCost } from "./commute-cost";

describe("calculateTrueCost", () => {
  it("combines direct, amortized, weather, and routine commute costs", () => {
    const result = calculateTrueCost({
      salaryMonthlyVnd: 20_000_000,
      directCost: {
        fuelMonthlyVnd: 480_000,
        parkingMonthlyVnd: 300_000,
        rideHailingMonthlyVnd: 240_000
      },
      vehicle: {
        purchasePriceVnd: 36_000_000,
        resaleValueVnd: 15_000_000,
        ownershipYears: 7,
        maintenanceYearlyVnd: 1_800_000,
        insuranceYearlyVnd: 660_000
      },
      weather: {
        rainyDays: 14,
        grabSwitchProbability: 0.5,
        grabDeltaPerRainyDayVnd: 60_000
      },
      routine: {
        coffeeMonthlyVnd: 20_000,
        accessoriesMonthlyVnd: 40_000
      }
    });

    expect(result.totalMonthlyVnd).toBe(1_955_000);
    expect(result.salaryShare).toBeCloseTo(0.09775, 5);
    expect(result.breakdown).toEqual({
      directMonthlyVnd: 1_020_000,
      amortizedMonthlyVnd: 455_000,
      weatherMonthlyVnd: 420_000,
      routineMonthlyVnd: 60_000
    });
  });
});
