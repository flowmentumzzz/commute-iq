export type CommuteCategory = "fuel" | "parking" | "ride_hailing" | "routine" | "maintenance";

export type CommuteTransaction = {
  amountVnd: number;
  category: CommuteCategory;
  merchant: string;
  source: "sms" | "manual" | "mock";
  occurredAt?: string;
  raw?: string;
};

export type TrueCostInput = {
  salaryMonthlyVnd?: number;
  directCost: {
    fuelMonthlyVnd: number;
    parkingMonthlyVnd: number;
    rideHailingMonthlyVnd: number;
  };
  vehicle: {
    purchasePriceVnd: number;
    resaleValueVnd: number;
    ownershipYears: number;
    maintenanceYearlyVnd: number;
    insuranceYearlyVnd: number;
  };
  weather: {
    rainyDays: number;
    grabSwitchProbability: number;
    grabDeltaPerRainyDayVnd: number;
  };
  routine: {
    coffeeMonthlyVnd: number;
    accessoriesMonthlyVnd: number;
  };
};

export type TrueCostResult = {
  totalMonthlyVnd: number;
  salaryShare: number | null;
  breakdown: {
    directMonthlyVnd: number;
    amortizedMonthlyVnd: number;
    weatherMonthlyVnd: number;
    routineMonthlyVnd: number;
  };
};

export type MoneyLeak = {
  merchant: string;
  category: CommuteCategory;
  count: number;
  totalAmountVnd: number;
  averageAmountVnd: number;
  estimatedMonthlySavingsVnd: number;
};
