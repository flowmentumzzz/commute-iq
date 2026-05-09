"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Button } from "@commute-iq/ui/components/button";

import { setLocale } from "../lib/locale";
import { type Locale, locales } from "../i18n/config";

export function LanguageSwitcher() {
  const current = useLocale() as Locale;
  const t = useTranslations("language");
  const [isPending, startTransition] = useTransition();

  const next = nextLocale(current);
  const nextLabel = t(next);
  const currentLabel = t(current);

  const onClick = () => {
    startTransition(() => {
      void setLocale(next);
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isPending}
      aria-label={t("ariaLabel", { label: currentLabel })}
      className="gap-2 font-mono text-[10px] uppercase tracking-wider"
    >
      <span aria-hidden>🌐</span>
      <span>{shortCode(next)}</span>
      <span className="sr-only">{nextLabel}</span>
    </Button>
  );
}

function nextLocale(current: Locale): Locale {
  const idx = locales.indexOf(current);
  return locales[(idx + 1) % locales.length];
}

function shortCode(locale: Locale): string {
  return locale === "vi" ? "EN" : "VI";
}
