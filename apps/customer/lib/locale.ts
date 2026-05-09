"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { isLocale, LOCALE_COOKIE, type Locale } from "../i18n/config";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setLocale(next: Locale): Promise<void> {
  if (!isLocale(next)) return;
  cookies().set(LOCALE_COOKIE, next, {
    path: "/",
    maxAge: ONE_YEAR_SECONDS,
    sameSite: "lax"
  });
  revalidatePath("/", "layout");
}
