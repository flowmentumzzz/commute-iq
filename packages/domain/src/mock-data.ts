import type { CommuteTransaction, TrueCostInput } from "./types.js";

export const motorbikeModels = [
  { id: "honda-wave-alpha", name: "Honda Wave Alpha 110", purchasePriceVnd: 22_000_000, resaleValueVnd: 9_000_000, fuelLitersPer100Km: 1.9, maintenanceYearlyVnd: 1_200_000 },
  { id: "honda-wave-rsx", name: "Honda Wave RSX 110", purchasePriceVnd: 25_000_000, resaleValueVnd: 10_000_000, fuelLitersPer100Km: 1.95, maintenanceYearlyVnd: 1_300_000 },
  { id: "honda-blade-110", name: "Honda Blade 110", purchasePriceVnd: 21_000_000, resaleValueVnd: 8_500_000, fuelLitersPer100Km: 1.85, maintenanceYearlyVnd: 1_200_000 },
  { id: "honda-future-125", name: "Honda Future 125", purchasePriceVnd: 32_000_000, resaleValueVnd: 13_000_000, fuelLitersPer100Km: 2.1, maintenanceYearlyVnd: 1_400_000 },
  { id: "honda-vision", name: "Honda Vision 110", purchasePriceVnd: 36_000_000, resaleValueVnd: 15_000_000, fuelLitersPer100Km: 2.0, maintenanceYearlyVnd: 1_800_000 },
  { id: "honda-air-blade-160", name: "Honda Air Blade 160", purchasePriceVnd: 54_000_000, resaleValueVnd: 22_000_000, fuelLitersPer100Km: 2.1, maintenanceYearlyVnd: 2_000_000 },
  { id: "honda-lead-125", name: "Honda Lead 125", purchasePriceVnd: 42_000_000, resaleValueVnd: 17_000_000, fuelLitersPer100Km: 2.05, maintenanceYearlyVnd: 1_900_000 },
  { id: "honda-sh-mode-125", name: "Honda SH Mode 125", purchasePriceVnd: 64_000_000, resaleValueVnd: 28_000_000, fuelLitersPer100Km: 2.15, maintenanceYearlyVnd: 2_200_000 },
  { id: "honda-sh-125i", name: "Honda SH 125i", purchasePriceVnd: 88_000_000, resaleValueVnd: 40_000_000, fuelLitersPer100Km: 2.2, maintenanceYearlyVnd: 2_500_000 },
  { id: "honda-sh-150i", name: "Honda SH 150i", purchasePriceVnd: 104_000_000, resaleValueVnd: 48_000_000, fuelLitersPer100Km: 2.4, maintenanceYearlyVnd: 2_700_000 },

  { id: "yamaha-sirius", name: "Yamaha Sirius 110", purchasePriceVnd: 22_000_000, resaleValueVnd: 8_500_000, fuelLitersPer100Km: 1.9, maintenanceYearlyVnd: 1_300_000 },
  { id: "yamaha-janus", name: "Yamaha Janus 125", purchasePriceVnd: 32_000_000, resaleValueVnd: 13_000_000, fuelLitersPer100Km: 1.9, maintenanceYearlyVnd: 1_600_000 },
  { id: "yamaha-freego", name: "Yamaha FreeGo 125", purchasePriceVnd: 32_000_000, resaleValueVnd: 13_000_000, fuelLitersPer100Km: 1.95, maintenanceYearlyVnd: 1_500_000 },
  { id: "yamaha-grande", name: "Yamaha Grande 125", purchasePriceVnd: 50_000_000, resaleValueVnd: 21_000_000, fuelLitersPer100Km: 1.9, maintenanceYearlyVnd: 2_000_000 },
  { id: "yamaha-exciter-150", name: "Yamaha Exciter 150", purchasePriceVnd: 50_000_000, resaleValueVnd: 22_000_000, fuelLitersPer100Km: 2.4, maintenanceYearlyVnd: 2_000_000 },
  { id: "yamaha-nvx-155", name: "Yamaha NVX 155", purchasePriceVnd: 57_000_000, resaleValueVnd: 24_000_000, fuelLitersPer100Km: 2.5, maintenanceYearlyVnd: 2_200_000 },

  { id: "suzuki-address", name: "Suzuki Address 110", purchasePriceVnd: 30_000_000, resaleValueVnd: 12_000_000, fuelLitersPer100Km: 2.0, maintenanceYearlyVnd: 1_400_000 },
  { id: "suzuki-gd110", name: "Suzuki GD110", purchasePriceVnd: 33_000_000, resaleValueVnd: 13_000_000, fuelLitersPer100Km: 2.1, maintenanceYearlyVnd: 1_500_000 },
  { id: "suzuki-raider-r150", name: "Suzuki Raider R150", purchasePriceVnd: 50_000_000, resaleValueVnd: 21_000_000, fuelLitersPer100Km: 2.5, maintenanceYearlyVnd: 2_000_000 },

  { id: "piaggio-liberty-150", name: "Piaggio Liberty 150", purchasePriceVnd: 75_000_000, resaleValueVnd: 32_000_000, fuelLitersPer100Km: 2.5, maintenanceYearlyVnd: 2_500_000 },
  { id: "piaggio-vespa-primavera", name: "Vespa Primavera 125", purchasePriceVnd: 80_000_000, resaleValueVnd: 34_000_000, fuelLitersPer100Km: 2.6, maintenanceYearlyVnd: 2_600_000 },
  { id: "piaggio-vespa-sprint", name: "Vespa Sprint 125", purchasePriceVnd: 88_000_000, resaleValueVnd: 38_000_000, fuelLitersPer100Km: 2.6, maintenanceYearlyVnd: 2_800_000 },

  // Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km
  { id: "vinfast-klara-a2", name: "VinFast Klara A2", purchasePriceVnd: 22_000_000, resaleValueVnd: 8_000_000, fuelLitersPer100Km: 0, maintenanceYearlyVnd: 900_000 },
  // Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km
  { id: "vinfast-feliz-s", name: "VinFast Feliz S", purchasePriceVnd: 26_000_000, resaleValueVnd: 10_000_000, fuelLitersPer100Km: 0, maintenanceYearlyVnd: 850_000 },
  // Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km
  { id: "vinfast-vento-s", name: "VinFast Vento S", purchasePriceVnd: 56_000_000, resaleValueVnd: 22_000_000, fuelLitersPer100Km: 0, maintenanceYearlyVnd: 1_000_000 },
  // Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km
  { id: "vinfast-theon-s", name: "VinFast Theon S", purchasePriceVnd: 70_000_000, resaleValueVnd: 28_000_000, fuelLitersPer100Km: 0, maintenanceYearlyVnd: 1_100_000 },
  // Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km
  { id: "dat-bike-quantum", name: "Dat Bike Quantum", purchasePriceVnd: 40_000_000, resaleValueVnd: 18_000_000, fuelLitersPer100Km: 0, maintenanceYearlyVnd: 950_000 },
  // Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km
  { id: "dat-bike-weave-200", name: "Dat Bike Weave 200", purchasePriceVnd: 50_000_000, resaleValueVnd: 22_000_000, fuelLitersPer100Km: 0, maintenanceYearlyVnd: 1_000_000 },
  // Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km
  { id: "yadea-voltguard", name: "Yadea Voltguard", purchasePriceVnd: 32_000_000, resaleValueVnd: 13_000_000, fuelLitersPer100Km: 0, maintenanceYearlyVnd: 900_000 },
  // Electric — fuelLitersPer100Km = 0; ~2.0–2.5 kWh/100km
  { id: "yadea-g5", name: "Yadea G5", purchasePriceVnd: 40_000_000, resaleValueVnd: 16_000_000, fuelLitersPer100Km: 0, maintenanceYearlyVnd: 950_000 }
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
