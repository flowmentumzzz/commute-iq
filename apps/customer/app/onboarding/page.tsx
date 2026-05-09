import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "../../lib/supabase/server";
import { OnboardingFlow } from "./onboarding-flow";
import type { DraftProfile } from "./types";

export const dynamic = "force-dynamic";

interface OnboardingPageProps {
  searchParams: { edit?: string };
}

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/onboarding");
  }

  const editing = searchParams.edit === "1";

  const { data: existingProfile } = await supabase
    .from("commute_profiles")
    .select("home_label, work_label, primary_transport, vehicle_model")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingProfile && !editing) {
    redirect("/");
  }

  const initialDraft: Partial<DraftProfile> = existingProfile
    ? splitProfileIntoDraft(existingProfile)
    : {};

  return (
    <main className="flex min-h-screen items-start justify-center bg-background bg-body-bloom px-5 py-10">
      <OnboardingFlow initialDraft={initialDraft} editing={editing} />
    </main>
  );
}

interface ExistingProfile {
  home_label: string;
  work_label: string;
  primary_transport: string;
  vehicle_model: string | null;
}

function splitProfileIntoDraft(profile: ExistingProfile): Partial<DraftProfile> {
  const [homeLabel = "", homeDistrict = ""] = profile.home_label.split("·").map((s) => s.trim());
  const [workLabel = "", workDistrict = ""] = profile.work_label.split("·").map((s) => s.trim());
  const transport = profile.primary_transport;

  return {
    homeLabel,
    homeDistrict,
    workLabel,
    workDistrict,
    primaryTransport: isValidTransport(transport) ? transport : "motorbike",
    vehicleModelId: profile.vehicle_model ?? undefined
  };
}

function isValidTransport(value: string): value is DraftProfile["primaryTransport"] {
  return value === "motorbike" || value === "grab_be" || value === "bus" || value === "bike_walk";
}
