import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createServerSupabaseClient } from "../../../lib/supabase/server";

const transactionSchema = z.object({
  amountVnd: z.number().int().min(1_000).max(100_000_000),
  category: z.enum(["fuel", "parking", "ride_hailing", "routine", "maintenance"]),
  merchant: z.string().trim().min(1).max(120),
  occurredAt: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Ngày không hợp lệ"))
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = transactionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("commute_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  let profileId = profile?.id;
  if (!profileId) {
    const { data: created, error: createError } = await supabase
      .from("commute_profiles")
      .insert({
        user_id: user.id,
        home_label: "",
        work_label: "",
        primary_transport: "motorbike"
      })
      .select("id")
      .single();

    if (createError || !created) {
      return NextResponse.json({ error: createError?.message ?? "Profile create failed" }, { status: 500 });
    }
    profileId = created.id;
  }

  const occurredAt = normalizeOccurredAt(parsed.data.occurredAt);

  const { data: row, error: insertError } = await supabase
    .from("commute_transactions")
    .insert({
      commute_profile_id: profileId,
      category: parsed.data.category,
      merchant: parsed.data.merchant,
      amount_vnd: parsed.data.amountVnd,
      source: "manual",
      occurred_at: occurredAt
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ transaction: row }, { status: 201 });
}

function normalizeOccurredAt(value: string): string {
  if (value.includes("T")) return value;
  return new Date(`${value}T00:00:00+07:00`).toISOString();
}
