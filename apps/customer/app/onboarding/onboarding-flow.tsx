"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Card, CardContent } from "@commute-iq/ui/components/card";

import { saveProfile } from "./save-profile";
import {
  PROGRESS_STORAGE_KEY,
  STEP_ORDER,
  draftProfileSchema,
  type DraftProfile,
  type Step
} from "./types";
import { LocationsStep } from "./steps/locations-step";
import { TransportStep } from "./steps/transport-step";
import { WelcomeStep } from "./steps/welcome-step";

interface OnboardingFlowProps {
  initialDraft: Partial<DraftProfile>;
  editing: boolean;
}

const EMPTY_DRAFT: Partial<DraftProfile> = {
  homeLabel: "",
  homeDistrict: "",
  workLabel: "",
  workDistrict: "",
  primaryTransport: "motorbike",
  vehicleModelId: undefined
};

export function OnboardingFlow({ initialDraft, editing }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>(editing ? "locations" : "welcome");
  const [draft, setDraft] = useState<Partial<DraftProfile>>({ ...EMPTY_DRAFT, ...initialDraft });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { step: Step; draft: Partial<DraftProfile> } | null;
      if (parsed && STEP_ORDER.includes(parsed.step)) {
        setStep(parsed.step);
        setDraft((current) => ({ ...current, ...parsed.draft }));
      }
    } catch {
      // ignore corrupted storage
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ step, draft }));
    } catch {
      // ignore quota / private mode
    }
  }, [step, draft]);

  const stepIndex = STEP_ORDER.indexOf(step);

  function update<K extends keyof DraftProfile>(key: K, value: DraftProfile[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function goNext() {
    setError(null);
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setStep(STEP_ORDER[nextIndex]);
    }
  }

  function goBack() {
    setError(null);
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEP_ORDER[prevIndex]);
    }
  }

  const validation = useMemo(() => draftProfileSchema.safeParse(draft), [draft]);

  function submit() {
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Dữ liệu chưa đủ.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await saveProfile(validation.data, { editing });
      if (!result.success) {
        setError(result.error ?? "Không lưu được. Vui lòng thử lại.");
        return;
      }
      try {
        window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
      } catch {
        // ignore
      }
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col gap-6 p-6">
        <ProgressDots stepIndex={stepIndex} />

        {step === "welcome" && <WelcomeStep onNext={goNext} />}
        {step === "locations" && (
          <LocationsStep draft={draft} onChange={update} onBack={goBack} onNext={goNext} />
        )}
        {step === "transport" && (
          <TransportStep
            draft={draft}
            onChange={update}
            onBack={goBack}
            onSubmit={submit}
            submitting={isPending}
            submitLabel={editing ? "Cập nhật & vào app" : "Vào app 🚀"}
          />
        )}

        {error && (
          <p role="alert" className="font-mono text-[11px] uppercase tracking-wider text-coral">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressDots({ stepIndex }: { stepIndex: number }) {
  return (
    <div className="flex justify-center gap-2">
      {STEP_ORDER.map((_, index) => (
        <span
          key={index}
          className={`h-1.5 rounded-full transition-all ${
            index <= stepIndex ? "w-10 bg-foreground" : "w-7 bg-foreground/15"
          }`}
        />
      ))}
    </div>
  );
}
