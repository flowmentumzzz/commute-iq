import type { CommuteTransaction } from "./types.js";

export interface LocalTransaction extends CommuteTransaction {
  id: string;
  occurredAt: string;
}

export interface MinimalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const STORAGE_KEY = "commute-iq:transactions";

function readRaw(storage: MinimalStorage): LocalTransaction[] {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLocalTransaction);
  } catch {
    return [];
  }
}

function writeRaw(storage: MinimalStorage, transactions: LocalTransaction[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function isLocalTransaction(value: unknown): value is LocalTransaction {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.amountVnd === "number" &&
    typeof candidate.merchant === "string" &&
    typeof candidate.category === "string" &&
    typeof candidate.occurredAt === "string"
  );
}

export function loadTransactions(storage: MinimalStorage): LocalTransaction[] {
  const all = readRaw(storage);
  return [...all].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}

export function saveTransaction(
  storage: MinimalStorage,
  transaction: LocalTransaction
): LocalTransaction[] {
  const existing = readRaw(storage);
  const next = [transaction, ...existing.filter((t) => t.id !== transaction.id)];
  writeRaw(storage, next);
  return [...next].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}

export function removeTransaction(storage: MinimalStorage, id: string): LocalTransaction[] {
  const existing = readRaw(storage);
  const next = existing.filter((t) => t.id !== id);
  writeRaw(storage, next);
  return [...next].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
}

export function generateId(): string {
  return `tx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
