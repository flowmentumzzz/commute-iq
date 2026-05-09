"use client";

import { useEffect, useState } from "react";
import {
  loadTransactions,
  removeTransaction,
  type LocalTransaction
} from "@commute-iq/domain";
import { Button } from "@commute-iq/ui/components/button";

import { ManualTripForm } from "./manual-trip-form";

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

const dateFmt = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const CATEGORY_LABEL: Record<LocalTransaction["category"], string> = {
  fuel: "Xăng",
  parking: "Gửi xe",
  ride_hailing: "Xe công nghệ",
  routine: "Cà phê",
  maintenance: "Bảo dưỡng"
};

const CATEGORY_COLOR: Record<LocalTransaction["category"], string> = {
  fuel: "bg-rose",
  parking: "bg-bg-2",
  ride_hailing: "bg-leaf text-paper",
  routine: "bg-coral text-paper",
  maintenance: "bg-sky"
};

export function TripList() {
  const [transactions, setTransactions] = useState<LocalTransaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTransactions(loadTransactions(window.localStorage));
    setHydrated(true);
  }, []);

  function handleDelete(id: string) {
    if (typeof window === "undefined") return;
    if (!window.confirm("Xoá giao dịch này?")) return;
    const next = removeTransaction(window.localStorage, id);
    setTransactions(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <ManualTripForm onTransactionsChange={setTransactions} />

      {hydrated && transactions.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-foreground bg-paper px-4 py-6 text-center text-sm text-ink-soft">
          Chưa có giao dịch nào — thêm bằng form bên trên.
        </p>
      )}

      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-2xl border-2 border-foreground bg-paper p-3 shadow-brutal-sm"
        >
          <span
            className={`grid size-10 place-items-center rounded-xl border-2 border-foreground font-mono text-[10px] uppercase ${
              CATEGORY_COLOR[tx.category]
            }`}
          >
            {CATEGORY_LABEL[tx.category].slice(0, 3)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display font-semibold">{tx.merchant}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              {dateFmt.format(new Date(tx.occurredAt))} · {CATEGORY_LABEL[tx.category]}
            </p>
          </div>
          <p className="font-display font-bold tabular-nums">{currency.format(tx.amountVnd)}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(tx.id)}
            aria-label={`Xoá giao dịch ${tx.merchant}`}
          >
            Xoá
          </Button>
        </div>
      ))}
    </div>
  );
}
