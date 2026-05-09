import { calculateTrueCost, demoTrueCostInput, parseCommuteTransactions } from "@commute-iq/domain";
import type { TrueCostInput } from "@commute-iq/domain";

type VercelRequest = {
  method?: string;
  url?: string;
  body?: unknown;
};

type VercelResponse = {
  status: (statusCode: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN ?? "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).json(null);
  }

  const pathname = new URL(req.url ?? "/", "https://commute-iq-api.local").pathname;

  if (req.method === "GET" && pathname.endsWith("/health")) {
    return res.status(200).json({
      ok: true,
      service: "commute-iq-api"
    });
  }

  if (req.method === "GET" && pathname.endsWith("/commute/demo")) {
    return res.status(200).json({
      input: demoTrueCostInput,
      result: calculateTrueCost(demoTrueCostInput)
    });
  }

  if (req.method === "POST" && pathname.endsWith("/commute/true-cost")) {
    return res.status(200).json(calculateTrueCost(parseBody<TrueCostInput>(req.body)));
  }

  if (req.method === "POST" && pathname.endsWith("/commute/parse-sms")) {
    const body = parseBody<{ messages?: string[] }>(req.body);

    return res.status(200).json({
      transactions: parseCommuteTransactions(body.messages ?? [])
    });
  }

  return res.status(404).json({
    error: "not_found",
    path: pathname
  });
}

function parseBody<T>(body: unknown): T {
  if (typeof body === "string") {
    return JSON.parse(body) as T;
  }

  return body as T;
}
