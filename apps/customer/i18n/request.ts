import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale, LOCALE_COOKIE } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieValue) ? cookieValue : defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default as Record<string, unknown>;

  return { locale, messages };
});
