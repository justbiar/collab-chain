import type { Locale } from "./dictionary";
import { t } from "./dictionary";

/** Form alanı sınırları — tweet 280 karaktere sığsın diye. */
export const BIO_MAX = 120;
export const REASON_MAX = 120;

const TWEET_MAX = 280;
/** X, her linki sabit 23 karakter sayar; url ayrı parametre olarak gidiyor. */
const URL_COST = 24;

function clamp(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

interface TweetParts {
  targetUsername: string;
  bio?: string;
  targetReason?: string;
}

/**
 * Paylaşım metnini kullanıcının kendi tanıtımı ve etiketlediği kişi için
 * yazdığı sebeple doldurur. Sığmazsa önce sebep, sonra bio kısaltılır —
 * zinciri devam ettiren çağrı her zaman korunur.
 */
export function buildChainTweetText(
  { targetUsername, bio, targetReason }: TweetParts,
  locale: Locale
): string {
  const s = t(locale).tweetIntent;
  const handle = targetUsername.replace(/^@/, "").trim();
  const budget = TWEET_MAX - URL_COST;

  const trimmedBio = (bio ?? "").trim();
  const trimmedReason = (targetReason ?? "").trim();

  const build = (bioText: string, reasonText: string) => {
    const blocks: string[] = [];
    blocks.push(bioText ? `${s.lead} ${bioText}` : s.lead);
    if (handle) {
      blocks.push(reasonText ? `${s.nextUp(handle)} — ${reasonText}` : s.nextUp(handle));
    }
    blocks.push(s.closing);
    return blocks.join("\n\n");
  };

  let text = build(trimmedBio, trimmedReason);
  if (text.length <= budget) return text;

  // Önce sebebi kıs.
  const overflow = text.length - budget;
  const shorterReason = clamp(trimmedReason, Math.max(0, trimmedReason.length - overflow));
  text = build(trimmedBio, shorterReason);
  if (text.length <= budget) return text;

  // Hâlâ sığmıyorsa bio'yu da kıs.
  const stillOver = text.length - budget;
  const shorterBio = clamp(trimmedBio, Math.max(0, trimmedBio.length - stillOver));
  text = build(shorterBio, shorterReason);

  return text.length <= budget ? text : clamp(text, budget);
}

export function buildChainTweetIntent(
  parts: TweetParts,
  siteUrl: string,
  locale: Locale
) {
  const params = new URLSearchParams({
    text: buildChainTweetText(parts, locale),
    url: siteUrl,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function generatePlayerId(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const id = Math.abs(hash) % 1000000;
  return id.toString().padStart(6, "0");
}

export function generateBarcodeWidths(seed: string, bars = 28) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const widths: number[] = [];
  let state = Math.abs(hash) || 42;
  for (let i = 0; i < bars; i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    widths.push(1 + (state % 3));
  }
  return widths;
}
