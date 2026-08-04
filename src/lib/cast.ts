/** Warpcast (Farcaster) gönderi linki yardımcıları — `tweet.ts`'in eşdeğeri. */

const CAST_URL =
  /^https?:\/\/(?:www\.)?warpcast\.com\/([a-z0-9][a-z0-9-]{0,15}(?:\.eth)?)\/(0x[0-9a-fA-F]{6,64})(?:[/?#].*)?$/i;

export interface ParsedCast {
  /** Normalize edilmiş, izleme parametreleri atılmış link. */
  url: string;
  username: string;
  hash: string;
}

export function parseCastUrl(input: string): ParsedCast | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const match = CAST_URL.exec(trimmed);
  if (!match) return null;

  const [, username, hash] = match;
  return { url: `https://warpcast.com/${username}/${hash}`, username, hash };
}

export function isValidCastUrl(input: string): boolean {
  return parseCastUrl(input) !== null;
}
