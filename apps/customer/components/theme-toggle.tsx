"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@commute-iq/ui/components/button";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "commute-iq:theme";

function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const [theme, setTheme] = useState<Theme>("system");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTheme(readStoredTheme());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }, [hydrated, theme]);

  useEffect(() => {
    if (!hydrated || theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [hydrated, theme]);

  const cycle = () => {
    setTheme((current) =>
      current === "light" ? "dark" : current === "dark" ? "system" : "light"
    );
  };

  const label = t(theme);
  const icon = theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "🖥️";

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycle}
      aria-label={t("ariaLabel", { label })}
      className="gap-2"
    >
      <span aria-hidden>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
