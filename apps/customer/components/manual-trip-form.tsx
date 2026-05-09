"use client";

import { useState } from "react";
import { z } from "zod";
import {
  generateId,
  loadTransactions,
  saveTransaction,
  type LocalTransaction
} from "@commute-iq/domain";
import { Button } from "@commute-iq/ui/components/button";

const CATEGORY_OPTIONS: Array<{ value: LocalTransaction["category"]; label: string }> = [
  { value: "fuel", label: "Xăng" },
  { value: "parking", label: "Gửi xe" },
  { value: "ride_hailing", label: "Grab / Be" },
  { value: "routine", label: "Cà phê / thói quen" },
  { value: "maintenance", label: "Bảo dưỡng" }
];

const formSchema = z.object({
  merchant: z.string().trim().min(1, "Cần ghi tên cửa hàng."),
  amountVnd: z
    .number({ invalid_type_error: "Số tiền chưa hợp lệ." })
    .int()
    .min(1_000, "Tối thiểu 1.000đ."),
  category: z.enum(["fuel", "parking", "ride_hailing", "routine", "maintenance"]),
  occurredAt: z.string().min(1, "Chọn ngày.")
});

type FormState = z.infer<typeof formSchema>;

const todayIso = () => new Date().toISOString().slice(0, 10);

const EMPTY_FORM: FormState = {
  merchant: "",
  amountVnd: 0,
  category: "routine",
  occurredAt: todayIso()
};

interface ManualTripFormProps {
  onTransactionsChange: (transactions: LocalTransaction[]) => void;
}

export function ManualTripForm({ onTransactionsChange }: ManualTripFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSuccess(false);
    setError(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ.");
      return;
    }

    setSubmitting(true);

    const tx: LocalTransaction = {
      id: generateId(),
      amountVnd: parsed.data.amountVnd,
      merchant: parsed.data.merchant,
      category: parsed.data.category,
      source: "manual",
      occurredAt: new Date(`${parsed.data.occurredAt}T00:00:00+07:00`).toISOString()
    };

    const next = saveTransaction(window.localStorage, tx);
    onTransactionsChange(next);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amountVnd: tx.amountVnd,
          merchant: tx.merchant,
          category: tx.category,
          occurredAt: tx.occurredAt
        })
      });

      if (response.status === 401) {
        // Not signed in — local save still applies; surface a soft note.
        setSuccess(true);
        setError("Đã lưu cục bộ — đăng nhập để đồng bộ với server.");
      } else if (!response.ok) {
        setSuccess(true);
        setError("Đã lưu cục bộ — server không nhận được, sẽ thử lại sau.");
      } else {
        setSuccess(true);
      }
    } catch {
      setSuccess(true);
      setError("Đã lưu cục bộ — không kết nối được server.");
    } finally {
      setSubmitting(false);
      setForm(EMPTY_FORM);
      // Refresh list to ensure UI reflects latest storage state.
      onTransactionsChange(loadTransactions(window.localStorage));
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Cửa hàng / nơi chi">
          <input
            type="text"
            value={form.merchant}
            onChange={(event) => update("merchant", event.target.value)}
            placeholder="VD: Highlands"
            className="h-10 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>
        <Field label="Số tiền (VND)">
          <input
            type="number"
            inputMode="numeric"
            min={1000}
            value={form.amountVnd || ""}
            onChange={(event) => update("amountVnd", Number(event.target.value))}
            placeholder="38000"
            className="h-10 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>
        <Field label="Loại chi">
          <select
            value={form.category}
            onChange={(event) => update("category", event.target.value as FormState["category"])}
            className="h-10 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ngày">
          <input
            type="date"
            value={form.occurredAt}
            onChange={(event) => update("occurredAt", event.target.value)}
            className="h-10 rounded-xl border-2 border-foreground bg-paper px-3 text-sm font-medium shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Đang lưu…" : "Thêm giao dịch"}
        </Button>
        {success && !error && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-leaf">
            ✓ Đã lưu
          </span>
        )}
        {error && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-coral">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-display text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
