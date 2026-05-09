"use client";

import { useMemo, useState } from "react";
import {
  calculateTrueCost,
  motorbikeModels,
  type TrueCostInput,
  type TrueCostResult
} from "@commute-iq/domain";
import { Badge } from "@commute-iq/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { CommuteBreakdownChart } from "./commute-breakdown-chart";

const A95_VND_PER_LITER = 24_500;
const WORKING_DAYS_PER_MONTH = 22;
const WEEKS_PER_MONTH = 4.3;
const OWNERSHIP_YEARS = 7;
const INSURANCE_YEARLY_VND = 660_000;
const GRAB_DELTA_PER_RAINY_DAY_VND = 60_000;
const GRAB_SWITCH_PROBABILITY = 0.5;
const AVERAGE_DAILY_PARKING_VND = 16_000;
const ACCESSORIES_MONTHLY_VND = 40_000;
const AVERAGE_COFFEE_PRICE_VND = 35_000;

interface CalculatorState {
  motorbikeId: string;
  monthlyKm: number;
  rainyDays: number;
  coffeeStopsPerWeek: number;
  salaryMonthlyVnd: number;
  considerSalary: boolean;
}

const DEFAULT_STATE: CalculatorState = {
  motorbikeId: motorbikeModels.find((m) => m.id === "honda-vision")?.id ?? motorbikeModels[0].id,
  monthlyKm: 280,
  rainyDays: 14,
  coffeeStopsPerWeek: 3,
  salaryMonthlyVnd: 20_000_000,
  considerSalary: true
};

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

function deriveInput(state: CalculatorState): TrueCostInput {
  const motorbike =
    motorbikeModels.find((m) => m.id === state.motorbikeId) ?? motorbikeModels[0];

  const fuelMonthlyVnd = Math.round(
    (motorbike.fuelLitersPer100Km / 100) * state.monthlyKm * A95_VND_PER_LITER
  );
  const parkingMonthlyVnd = WORKING_DAYS_PER_MONTH * AVERAGE_DAILY_PARKING_VND;
  const coffeeMonthlyVnd = Math.round(
    state.coffeeStopsPerWeek * AVERAGE_COFFEE_PRICE_VND * WEEKS_PER_MONTH
  );

  return {
    salaryMonthlyVnd: state.considerSalary ? state.salaryMonthlyVnd : undefined,
    directCost: {
      fuelMonthlyVnd,
      parkingMonthlyVnd,
      rideHailingMonthlyVnd: 0
    },
    vehicle: {
      purchasePriceVnd: motorbike.purchasePriceVnd,
      resaleValueVnd: motorbike.resaleValueVnd,
      ownershipYears: OWNERSHIP_YEARS,
      maintenanceYearlyVnd: motorbike.maintenanceYearlyVnd,
      insuranceYearlyVnd: INSURANCE_YEARLY_VND
    },
    weather: {
      rainyDays: state.rainyDays,
      grabSwitchProbability: GRAB_SWITCH_PROBABILITY,
      grabDeltaPerRainyDayVnd: GRAB_DELTA_PER_RAINY_DAY_VND
    },
    routine: {
      coffeeMonthlyVnd,
      accessoriesMonthlyVnd: ACCESSORIES_MONTHLY_VND
    }
  };
}

export function TrueCostCalculator() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  const result: TrueCostResult = useMemo(
    () => calculateTrueCost(deriveInput(state)),
    [state]
  );

  const salaryPercent =
    result.salaryShare !== null
      ? Math.round(result.salaryShare * 1000) / 10
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <Card>
        <CardHeader className="gap-4">
          <Badge variant="destructive" className="w-fit">
            ✨ True Cost
          </Badge>
          <CardTitle className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Chi phí đi lại thật của bạn
          </CardTitle>
          <CardDescription className="text-base">
            Kéo các thanh để xem con số thay đổi theo thói quen thật của bạn — không phải con số ước lượng.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative overflow-hidden rounded-2xl border-2 border-foreground bg-foreground p-6 text-paper shadow-brutal">
            <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-coral/35 blur-2xl" />
            <div className="relative">
              <p className="font-mono text-[11px] uppercase tracking-widest opacity-70">
                Mỗi tháng bạn tốn
              </p>
              <p className="mt-3 font-display text-4xl font-black leading-none tracking-tight md:text-5xl">
                <span className="rounded-md bg-lime px-1.5 text-foreground">
                  {currency.format(result.totalMonthlyVnd)}
                </span>
              </p>
              {salaryPercent !== null && (
                <p className="mt-4 text-sm opacity-90">
                  Chiếm <strong className="text-lime">{salaryPercent}%</strong> lương tháng của bạn.
                </p>
              )}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                <BreakdownPill label="Trực tiếp" value={result.breakdown.directMonthlyVnd} />
                <BreakdownPill label="Khấu hao" value={result.breakdown.amortizedMonthlyVnd} />
                <BreakdownPill label="Mưa" value={result.breakdown.weatherMonthlyVnd} />
                <BreakdownPill label="Thói quen" value={result.breakdown.routineMonthlyVnd} />
              </div>
            </div>
          </div>
          <CommuteBreakdownChart breakdown={result.breakdown} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thói quen của bạn</CardTitle>
          <CardDescription>Các con số cập nhật ngay khi bạn thay đổi.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <SelectField
            label="Xe máy"
            value={state.motorbikeId}
            onChange={(motorbikeId) => setState((s) => ({ ...s, motorbikeId }))}
            options={motorbikeModels.map((m) => ({ value: m.id, label: m.name }))}
          />
          <RangeField
            label="Quãng đường mỗi tháng"
            value={state.monthlyKm}
            min={50}
            max={1000}
            step={10}
            unit="km"
            onChange={(monthlyKm) => setState((s) => ({ ...s, monthlyKm }))}
          />
          <RangeField
            label="Số ngày mưa trong tháng"
            value={state.rainyDays}
            min={0}
            max={25}
            step={1}
            unit="ngày"
            onChange={(rainyDays) => setState((s) => ({ ...s, rainyDays }))}
          />
          <RangeField
            label="Cà phê dọc đường"
            value={state.coffeeStopsPerWeek}
            min={0}
            max={7}
            step={1}
            unit="lần / tuần"
            onChange={(coffeeStopsPerWeek) => setState((s) => ({ ...s, coffeeStopsPerWeek }))}
          />
          <SalaryField state={state} setState={setState} />
        </CardContent>
      </Card>
    </div>
  );
}

function BreakdownPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-paper/15 bg-paper/10 px-3 py-2">
      <p className="font-mono text-[10px] uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-1 font-display text-sm font-bold tabular-nums">
        {currency.format(value)}
      </p>
    </div>
  );
}

interface RangeFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (next: number) => void;
}

function RangeField({ label, value, min, max, step, unit, onChange }: RangeFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between text-sm">
        <span className="font-display font-semibold">{label}</span>
        <span className="font-display text-base font-bold tabular-nums">
          {value.toLocaleString("vi-VN")}{" "}
          <span className="font-mono text-[10px] font-normal uppercase tracking-wider text-ink-soft">
            {unit}
          </span>
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (next: string) => void;
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-display text-sm font-semibold">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface SalaryFieldProps {
  state: CalculatorState;
  setState: (updater: (s: CalculatorState) => CalculatorState) => void;
}

function SalaryField({ state, setState }: SalaryFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-display font-semibold">Lương tháng (tuỳ chọn)</span>
        <button
          type="button"
          className="font-mono text-[10px] uppercase tracking-wider text-ink-soft underline-offset-2 hover:underline"
          onClick={() => setState((s) => ({ ...s, considerSalary: !s.considerSalary }))}
        >
          {state.considerSalary ? "Bỏ qua" : "Tính %"}
        </button>
      </div>
      {state.considerSalary && (
        <>
          <span className="font-display text-base font-bold tabular-nums">
            {currency.format(state.salaryMonthlyVnd)}
          </span>
          <input
            type="range"
            min={5_000_000}
            max={60_000_000}
            step={500_000}
            value={state.salaryMonthlyVnd}
            onChange={(event) =>
              setState((s) => ({ ...s, salaryMonthlyVnd: Number(event.target.value) }))
            }
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
          />
        </>
      )}
    </div>
  );
}
