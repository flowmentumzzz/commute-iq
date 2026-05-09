import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@commute-iq/ui/components/badge";
import { Button } from "@commute-iq/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@commute-iq/ui/components/card";

import { createServerSupabaseClient } from "../../../lib/supabase/server";

const TRANSPORT_KEYS = ["motorbike", "grab_be", "bus", "bike_walk"] as const;

type TransportKey = (typeof TRANSPORT_KEYS)[number];

function isTransportKey(value: string): value is TransportKey {
  return (TRANSPORT_KEYS as readonly string[]).includes(value);
}

export default async function ProfileTab() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const t = await getTranslations("profile");
  const tAuth = await getTranslations("auth");

  const email = user?.email ?? null;

  const { data: profile } = await supabase
    .from("commute_profiles")
    .select("home_label, work_label, primary_transport, vehicle_model")
    .eq("user_id", user!.id)
    .maybeSingle();

  const transportLabel = profile
    ? isTransportKey(profile.primary_transport)
      ? t(`transportLabels.${profile.primary_transport}` as const)
      : profile.primary_transport
    : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="px-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{t("eyebrow")}</p>
        <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
          {email?.split("@")[0] ?? t("fallbackTitle")}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("accountCard")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-foreground bg-paper p-3 shadow-brutal-sm">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{t("emailLabel")}</p>
              <p className="truncate font-display font-semibold">{email ?? "—"}</p>
            </div>
            <Badge variant="success">{tAuth("signedInBadge")}</Badge>
          </div>
          <form action="/auth/sign-out" method="POST">
            <Button type="submit" variant="secondary" className="w-full">
              {tAuth("signOut")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("commuteCard")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {profile ? (
            <>
              <ProfileRow label={t("homeLabel")} value={profile.home_label || "—"} />
              <ProfileRow label={t("workLabel")} value={profile.work_label || "—"} />
              <ProfileRow label={t("transportLabel")} value={transportLabel ?? "—"} />
              {profile.vehicle_model && (
                <ProfileRow label={t("vehicleLabel")} value={profile.vehicle_model} />
              )}
            </>
          ) : (
            <p className="rounded-xl border-2 border-dashed border-foreground bg-paper p-3 text-sm text-ink-soft">
              {t("noProfile")}
            </p>
          )}
          <Button asChild variant="default">
            <Link href="/onboarding?edit=1">
              {profile ? t("editCta") : t("startCta")}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("otherCard")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild variant="secondary">
            <Link href="/playground">{t("playgroundCta")}</Link>
          </Button>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            {t("buildLine")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-foreground bg-paper p-3 shadow-brutal-sm">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">{label}</p>
      <p className="mt-1 font-display font-semibold">{value}</p>
    </div>
  );
}
