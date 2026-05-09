const MONTHS_PER_YEAR = 12;

import type { TrueCostInput, TrueCostResult } from "./types.js";

export function calculateTrueCost(input: TrueCostInput): TrueCostResult {
  const directMonthlyVnd =
    input.directCost.fuelMonthlyVnd +
    input.directCost.parkingMonthlyVnd +
    input.directCost.rideHailingMonthlyVnd;

  const vehicleDepreciationMonthlyVnd =
    (input.vehicle.purchasePriceVnd - input.vehicle.resaleValueVnd) /
    (input.vehicle.ownershipYears * MONTHS_PER_YEAR);

  const vehicleOperationsMonthlyVnd =
    (input.vehicle.maintenanceYearlyVnd + input.vehicle.insuranceYearlyVnd) / MONTHS_PER_YEAR;

  const amortizedMonthlyVnd = Math.round(
    vehicleDepreciationMonthlyVnd + vehicleOperationsMonthlyVnd
  );

  const weatherMonthlyVnd = Math.round(
    input.weather.rainyDays *
      input.weather.grabSwitchProbability *
      input.weather.grabDeltaPerRainyDayVnd
  );

  const routineMonthlyVnd =
    input.routine.coffeeMonthlyVnd + input.routine.accessoriesMonthlyVnd;

  const totalMonthlyVnd =
    directMonthlyVnd + amortizedMonthlyVnd + weatherMonthlyVnd + routineMonthlyVnd;

  return {
    totalMonthlyVnd,
    salaryShare: input.salaryMonthlyVnd ? totalMonthlyVnd / input.salaryMonthlyVnd : null,
    breakdown: {
      directMonthlyVnd,
      amortizedMonthlyVnd,
      weatherMonthlyVnd,
      routineMonthlyVnd
    }
  };
}
