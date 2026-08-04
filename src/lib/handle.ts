/**
 * Kimlik string'i tek bir alanda (`xUsername`) iki sağlayıcıyı ayırt eder:
 * X hesapları çıplak handle olarak ("elonmusk"), Farcaster hesapları "fc:"
 * önekiyle ("fc:dwr") saklanır. Aynı handle string'inin iki platformda farklı
 * kişilere ait olabilmesi yüzünden (ban/admin/genesis atlatma riski) önek
 * şart — ban listesi, genesis yetkisi ve süper admin karşılaştırmaları hep
 * bu tam string üzerinden yapılır.
 */
const FARCASTER_PREFIX = "fc:";

export function isFarcasterHandle(handle: string): boolean {
  return handle.startsWith(FARCASTER_PREFIX);
}

export function farcasterIdentity(username: string): string {
  return `${FARCASTER_PREFIX}${username.replace(/^@/, "").trim()}`;
}

/** Gösterimde `@` ile birlikte kullanılacak çıplak kullanıcı adı. */
export function displayHandle(handle: string): string {
  return isFarcasterHandle(handle) ? handle.slice(FARCASTER_PREFIX.length) : handle;
}

/** Handle'ın ait olduğu platformdaki genel profil linki. */
export function profileHref(handle: string): string {
  return isFarcasterHandle(handle)
    ? `https://warpcast.com/${displayHandle(handle)}`
    : `https://x.com/${handle}`;
}

export type HandlePlatform = "x" | "farcaster";

export function platformOf(handle: string): HandlePlatform {
  return isFarcasterHandle(handle) ? "farcaster" : "x";
}
