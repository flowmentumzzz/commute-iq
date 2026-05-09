import type { TrueCostInput, TrueCostResult } from "@commute-iq/domain";

const DEFAULT_BASE_URL = "http://localhost:4000";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;
}

export interface DemoCostPayload {
  input: TrueCostInput;
  result: TrueCostResult;
}

export async function fetchDemoCost(): Promise<DemoCostPayload | null> {
  const url = `${getApiBaseUrl()}/commute/demo`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      console.warn(`[api] /commute/demo returned ${response.status}`);
      return null;
    }
    const payload = (await response.json()) as DemoCostPayload;
    return payload;
  } catch (error: unknown) {
    console.warn("[api] /commute/demo unreachable", error);
    return null;
  }
}

export async function postTrueCost(input: TrueCostInput): Promise<TrueCostResult | null> {
  const url = `${getApiBaseUrl()}/commute/true-cost`;

  try {
    const response = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input)
    });
    if (!response.ok) {
      console.warn(`[api] /commute/true-cost returned ${response.status}`);
      return null;
    }
    return (await response.json()) as TrueCostResult;
  } catch (error: unknown) {
    console.warn("[api] /commute/true-cost unreachable", error);
    return null;
  }
}
