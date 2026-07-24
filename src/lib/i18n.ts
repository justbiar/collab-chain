import { cookies } from "next/headers";
import type { Locale } from "./dictionary";

export type { Locale, Dict } from "./dictionary";
export { t } from "./dictionary";

export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "tr";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : DEFAULT_LOCALE;
}
