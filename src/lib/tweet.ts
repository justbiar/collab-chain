/**
 * X (Twitter) gönderi linki yardımcıları.
 *
 * Beğeni/retweet sayısını sunucu tarafında okumak X API'nin ücretli kredi
 * modelini gerektiriyor (Şubat 2026'dan beri ücretsiz katman yok). Bu yüzden
 * sayıyı biz tutmuyoruz; tweet'i gömüyoruz ve etkileşim X'in kendi
 * widget'ında görünüyor. İleride kredi alınırsa buraya bir `fetchMetrics`
 * eklenebilir — tweet id'si zaten burada çıkarılıyor.
 */

const TWEET_URL = /^https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([A-Za-z0-9_]{1,15})\/status\/(\d{1,25})(?:[/?#].*)?$/;

export interface ParsedTweet {
  /** Normalize edilmiş, izleme parametreleri atılmış link. */
  url: string;
  handle: string;
  id: string;
}

export function parseTweetUrl(input: string): ParsedTweet | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const match = TWEET_URL.exec(trimmed);
  if (!match) return null;

  const [, handle, id] = match;
  return { url: `https://x.com/${handle}/status/${id}`, handle, id };
}

export function isValidTweetUrl(input: string): boolean {
  return parseTweetUrl(input) !== null;
}
