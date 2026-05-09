"use client";

import { Button } from "@commute-iq/ui/components/button";

import { ALL_DISTRICTS, type DraftProfile } from "../types";

interface LocationsStepProps {
  draft: Partial<DraftProfile>;
  onChange: <K extends keyof DraftProfile>(key: K, value: DraftProfile[K]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function LocationsStep({ draft, onChange, onBack, onNext }: LocationsStepProps) {
  const ready =
    Boolean(draft.homeLabel?.trim()) &&
    Boolean(draft.homeDistrict?.trim()) &&
    Boolean(draft.workLabel?.trim()) &&
    Boolean(draft.workDistrict?.trim());

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
          Chỉ cần 2 điểm
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Nhà và công ty. App sẽ nhận ra mọi chuyến đi từ đó.
        </p>
      </div>

      <LocationField
        emoji="🏠"
        title="Nhà"
        placeholder="VD: 123 Lý Thường Kiệt"
        labelValue={draft.homeLabel ?? ""}
        districtValue={draft.homeDistrict ?? ""}
        onLabelChange={(value) => onChange("homeLabel", value)}
        onDistrictChange={(value) => onChange("homeDistrict", value)}
      />
      <LocationField
        emoji="🏢"
        title="Văn phòng"
        placeholder="VD: 22 Nguyễn Huệ"
        labelValue={draft.workLabel ?? ""}
        districtValue={draft.workDistrict ?? ""}
        onLabelChange={(value) => onChange("workLabel", value)}
        onDistrictChange={(value) => onChange("workDistrict", value)}
      />

      <p className="font-mono text-[11px] leading-relaxed text-ink-soft">
        🔒 Vị trí chỉ lưu để app tính chi phí — không gửi đi đâu khác.
      </p>

      <div className="flex flex-col gap-3">
        <Button onClick={onNext} disabled={!ready}>
          Tiếp →
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Quay lại
        </Button>
      </div>
    </div>
  );
}

interface LocationFieldProps {
  emoji: string;
  title: string;
  placeholder: string;
  labelValue: string;
  districtValue: string;
  onLabelChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
}

function LocationField({
  emoji,
  title,
  placeholder,
  labelValue,
  districtValue,
  onLabelChange,
  onDistrictChange
}: LocationFieldProps) {
  const set = Boolean(labelValue.trim()) && Boolean(districtValue.trim());

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border-2 border-foreground p-4 shadow-brutal-sm ${
        set ? "bg-lime" : "bg-paper"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`grid size-11 place-items-center rounded-full border-2 border-foreground text-lg ${
            set ? "bg-foreground text-lime" : "bg-coral"
          }`}
        >
          {emoji}
        </div>
        <p className="font-display font-bold">{title}</p>
      </div>
      <input
        type="text"
        value={labelValue}
        onChange={(event) => onLabelChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select
        value={districtValue}
        onChange={(event) => onDistrictChange(event.target.value)}
        className="h-10 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Chọn quận/huyện…</option>
        {ALL_DISTRICTS.map((district) => (
          <option key={district} value={district}>
            {district}
          </option>
        ))}
      </select>
    </div>
  );
}
