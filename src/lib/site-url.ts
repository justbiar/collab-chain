/** Client ve server'da aynı şekilde okunabilen, uygulamanın kendi kökeni. */
export function getAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000";
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

export function getAppDomain(): string {
  return new URL(getAppUrl()).host;
}
