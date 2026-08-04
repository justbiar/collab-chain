import { cookies } from "next/headers";
import type { Locale } from "./dictionary";

export type { Locale, Dict } from "./dictionary";
export { t } from "./dictionary";

export const LOCALE_COOKIE = "locale";
export const DEFAULT_LOCALE: Locale = "en";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  // Kayıtlı bir tercih varsa ona uyulur; hiç seçim yapılmadıysa DEFAULT_LOCALE'a düşülür.
  if (value === "en" || value === "tr") return value;
  return DEFAULT_LOCALE;
}
