import { beforeEach, describe, expect, it } from "vitest";

import {
  generateId,
  loadTransactions,
  removeTransaction,
  saveTransaction,
  type LocalTransaction,
  type MinimalStorage
} from "./transaction-storage.js";

class MemoryStorage implements MinimalStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  raw(key: string): string | undefined {
    return this.store.get(key);
  }
}

function makeTransaction(overrides: Partial<LocalTransaction> = {}): LocalTransaction {
  return {
    id: generateId(),
    amountVnd: 35_000,
    category: "routine",
    merchant: "CAFE A",
    source: "manual",
    occurredAt: "2026-05-09T07:42:00+07:00",
    ...overrides
  };
}

describe("transaction-storage", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  it("returns empty list when no transactions stored", () => {
    expect(loadTransactions(storage)).toEqual([]);
  });

  it("save then load round-trips", () => {
    const tx = makeTransaction({ id: "t1" });
    saveTransaction(storage, tx);
    expect(loadTransactions(storage)).toEqual([tx]);
  });

  it("returns newest first", () => {
    const older = makeTransaction({ id: "t1", occurredAt: "2026-05-01T07:00:00+07:00" });
    const newer = makeTransaction({ id: "t2", occurredAt: "2026-05-09T07:00:00+07:00" });
    saveTransaction(storage, older);
    saveTransaction(storage, newer);
    expect(loadTransactions(storage).map((t) => t.id)).toEqual(["t2", "t1"]);
  });

  it("removeTransaction removes by id", () => {
    saveTransaction(storage, makeTransaction({ id: "keep" }));
    saveTransaction(storage, makeTransaction({ id: "drop" }));
    removeTransaction(storage, "drop");
    expect(loadTransactions(storage).map((t) => t.id)).toEqual(["keep"]);
  });

  it("returns empty list on malformed JSON", () => {
    storage.setItem("commute-iq:transactions", "{not json}");
    expect(loadTransactions(storage)).toEqual([]);
  });

  it("save replaces transaction with the same id", () => {
    saveTransaction(storage, makeTransaction({ id: "t1", amountVnd: 30_000 }));
    saveTransaction(storage, makeTransaction({ id: "t1", amountVnd: 50_000 }));
    const loaded = loadTransactions(storage);
    expect(loaded).toHaveLength(1);
    expect(loaded[0].amountVnd).toBe(50_000);
  });
});
