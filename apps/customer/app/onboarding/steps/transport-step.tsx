"use client";

import { motorbikeModels } from "@commute-iq/domain";
import { Button } from "@commute-iq/ui/components/button";

import { TRANSPORT_OPTIONS, type DraftProfile, type TransportMode } from "../types";

interface TransportStepProps {
  draft: Partial<DraftProfile>;
  onChange: <K extends keyof DraftProfile>(key: K, value: DraftProfile[K]) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitLabel: string;
}

export function TransportStep({
  draft,
  onChange,
  onBack,
  onSubmit,
  submitting,
  submitLabel
}: TransportStepProps) {
  const selected = (draft.primaryTransport ?? "motorbike") as TransportMode;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
          Bạn đi gì hằng ngày?
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Chọn cái bạn dùng nhiều nhất. Đổi lúc nào cũng được.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {TRANSPORT_OPTIONS.map((option) => {
          const active = option.id === selected;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange("primaryTransport", option.id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 border-foreground px-3 py-4 shadow-brutal-sm transition hover:-translate-x-px hover:-translate-y-px hover:shadow-brutal ${
                active ? "bg-coral text-paper" : "bg-paper"
              }`}
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="font-display text-sm font-semibold">{option.label}</span>
            </button>
          );
        })}
      </div>

      {selected === "motorbike" && (
        <label className="flex flex-col gap-2">
          <span className="font-display text-sm font-semibold">Xe máy của bạn</span>
          <select
            value={draft.vehicleModelId ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              onChange("vehicleModelId", value === "" ? (undefined as unknown as string) : value);
            }}
            className="h-11 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Tôi điền sau</option>
            {motorbikeModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-foreground bg-bg-2 p-3">
        <span className="text-lg" aria-hidden>
          💡
        </span>
        <p className="text-xs leading-relaxed">
          App hiểu <strong>chuyến hỗn hợp</strong> — ví dụ: xe máy → gửi xe → cà phê → văn phòng. Đó là chuyện thường ngày ở Sài Gòn.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? "Đang lưu…" : submitLabel}
        </Button>
        <Button variant="ghost" onClick={onBack} disabled={submitting}>
          Quay lại
        </Button>
      </div>
    </div>
  );
}
