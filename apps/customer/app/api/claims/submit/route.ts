import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const submitSchema = z.object({
  count: z.number().int().min(1).max(500)
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // TODO: persist claim submission once reimbursement-policy backend lands.
  return NextResponse.json({ success: true, accepted: parsed.data.count });
}
