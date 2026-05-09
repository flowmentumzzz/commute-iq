import { NextResponse } from "next/server";
import { z } from "zod";

const approveSchema = z.object({ id: z.string().min(1) }).strict();

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = approveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "invalid_payload" },
      { status: 400 }
    );
  }

  // TODO(crm-reimbursement): persist the approval once the policy backend lands.
  // For now this is a stub that mirrors the optimistic UI.
  return NextResponse.json({ success: true });
}
