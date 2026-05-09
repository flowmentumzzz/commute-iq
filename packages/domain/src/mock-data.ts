import type { CommuteTransaction, TrueCostInput } from "./types.js";

export const motorbikeModels = [
  {
    id: "honda-wave-alpha",
    name: "Honda Wave Alpha",
    purchasePriceVnd: 22_000_000,
    resaleValueVnd: 9_000_000,
    fuelLitersPer100Km: 1.9,
    maintenanceYearlyVnd: 1_200_000
  },
  {
    id: "honda-vision",
    name: "Honda Vision",
    purchasePriceVnd: 36_000_000,
    resaleValueVnd: 15_000_000,
    fuelLitersPer100Km: 2.0,
    maintenanceYearlyVnd: 1_800_000
  },
  {
    id: "yamaha-janus",
    name: "Yamaha Janus",
    purchasePriceVnd: 32_000_000,
    resaleValueVnd: 13_000_000,
    fuelLitersPer100Km: 1.9,
    maintenanceYearlyVnd: 1_600_000
  },
  {
    id: "vinfast-klara",
    name: "VinFast Klara",
    purchasePriceVnd: 35_000_000,
    resaleValueVnd: 14_000_000,
    fuelLitersPer100Km: 0,
    maintenanceYearlyVnd: 900_000
  }
] as const;

export const parkingByDistrict = [
  { district: "Quan 1", monthlyVnd: 450_000 },
  { district: "Quan 3", monthlyVnd: 380_000 },
  { district: "Quan 7", monthlyVnd: 300_000 },
  { district: "Cau Giay", monthlyVnd: 320_000 },
  { district: "Ba Dinh", monthlyVnd: 400_000 }
] as const;

export const transportComparisons = [
  { mode: "Xe may xang", dailyVnd: 18_000, timeDeltaMinutes: 0 },
  { mode: "Xe may dien", dailyVnd: 22_000, timeDeltaMinutes: 0 },
  { mode: "GrabBike", dailyVnd: 35_000, timeDeltaMinutes: -5 },
  { mode: "Xe buyt", dailyVnd: 7_000, timeDeltaMinutes: 40 }
] as const;

export const demoTrueCostInput: TrueCostInput = {
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
};

const day = (n: number) => `2026-05-${String(n).padStart(2, "0")}T07:42:00+07:00`;
const evening = (n: number) => `2026-05-${String(n).padStart(2, "0")}T18:34:00+07:00`;

export const mockTransactions: CommuteTransaction[] = [
  { amountVnd: 38_000, category: "routine", merchant: "HIGHLANDS", source: "sms", occurredAt: day(2) },
  { amountVnd: 8_000, category: "parking", merchant: "GUI XE Q.1", source: "sms", occurredAt: day(2) },
  { amountVnd: 71_000, category: "ride_hailing", merchant: "GRAB", source: "sms", occurredAt: evening(2) },
  { amountVnd: 50_000, category: "fuel", merchant: "PETROLIMEX", source: "sms", occurredAt: day(3) },
  { amountVnd: 8_000, category: "parking", merchant: "GUI XE Q.1", source: "sms", occurredAt: day(3) },
  { amountVnd: 38_000, category: "routine", merchant: "HIGHLANDS", source: "sms", occurredAt: day(4) },
  { amountVnd: 8_000, category: "parking", merchant: "GUI XE Q.1", source: "sms", occurredAt: day(4) },
  { amountVnd: 85_000, category: "ride_hailing", merchant: "GRAB", source: "sms", occurredAt: evening(4) },
  { amountVnd: 38_000, category: "routine", merchant: "HIGHLANDS", source: "sms", occurredAt: day(5) },
  { amountVnd: 8_000, category: "parking", merchant: "GUI XE Q.1", source: "sms", occurredAt: day(5) },
  { amountVnd: 8_000, category: "parking", merchant: "GUI XE Q.1", source: "sms", occurredAt: day(6) },
  { amountVnd: 38_000, category: "routine", merchant: "HIGHLANDS", source: "sms", occurredAt: day(6) },
  { amountVnd: 50_000, category: "fuel", merchant: "PETROLIMEX", source: "sms", occurredAt: day(7) },
  { amountVnd: 8_000, category: "parking", merchant: "GUI XE Q.1", source: "sms", occurredAt: day(8) },
  { amountVnd: 78_000, category: "ride_hailing", merchant: "GRAB", source: "sms", occurredAt: evening(8) },
  { amountVnd: 38_000, category: "routine", merchant: "HIGHLANDS", source: "sms", occurredAt: day(9) },
  { amountVnd: 8_000, category: "parking", merchant: "GUI XE Q.1", source: "sms", occurredAt: day(9) },
  { amountVnd: 35_000, category: "routine", merchant: "PHUC LONG", source: "sms", occurredAt: day(10) },
  { amountVnd: 8_000, category: "parking", merchant: "GUI XE Q.1", source: "sms", occurredAt: day(10) }
];
