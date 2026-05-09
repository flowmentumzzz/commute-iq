"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { draftProfileSchema, type DraftProfile } from "./types";

interface SaveResult {
  success: boolean;
  error?: string;
}

export async function saveProfile(draft: DraftProfile, options: { editing?: boolean } = {}): Promise<SaveResult> {
  const parsed = draftProfileSchema.safeParse(draft);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ." };
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/onboarding");
  }

  const homeLabel = `${parsed.data.homeLabel} · ${parsed.data.homeDistrict}`;
  const workLabel = `${parsed.data.workLabel} · ${parsed.data.workDistrict}`;

  if (options.editing) {
    const { error } = await supabase
      .from("commute_profiles")
      .update({
        home_label: homeLabel,
        work_label: workLabel,
        primary_transport: parsed.data.primaryTransport,
        vehicle_model: parsed.data.vehicleModelId ?? null
      })
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }
  } else {
    const { error } = await supabase.from("commute_profiles").insert({
      user_id: user.id,
      home_label: homeLabel,
      work_label: workLabel,
      primary_transport: parsed.data.primaryTransport,
      vehicle_model: parsed.data.vehicleModelId ?? null
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  redirect("/");
}
