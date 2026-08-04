import type { Locale } from "./dictionary";
import { t } from "./dictionary";
import { displayHandle } from "./handle";

/** Cast limiti X'in tweet limitinden çok daha geniş (1024 bayt) — kırpma gerekmiyor. */
const CAST_MAX = 1024;

interface CastParts {
  collectionName: string;
  isFounder: boolean;
  targetUsername: string;
  bio?: string;
  targetReason?: string;
}

/** `buildChainTweetText`'in Farcaster eşdeğeri — aynı ton, URL maliyeti düşülmüyor. */
export function buildChainCastText(
  { collectionName, isFounder, targetUsername, bio, targetReason }: CastParts,
  locale: Locale
): string {
  const s = t(locale).tweetIntent;
  const handle = displayHandle(targetUsername.replace(/^@/, "").trim());

  const trimmedBio = (bio ?? "").trim();
  const trimmedReason = (targetReason ?? "").trim();
  const lead = isFounder ? s.startingLead(collectionName) : s.joinedLead(collectionName);

  const blocks: string[] = [lead];
  if (trimmedBio) blocks.push(trimmedBio);
  if (handle) {
    blocks.push(
      trimmedReason ? s.passingToWithReason(handle, trimmedReason) : s.passingTo(handle)
    );
  }

  const text = blocks.join("\n\n");
  return text.length <= CAST_MAX ? text : `${text.slice(0, CAST_MAX - 1).trimEnd()}…`;
}

export function buildChainCastIntent(parts: CastParts, siteUrl: string, locale: Locale) {
  const params = new URLSearchParams({
    text: buildChainCastText(parts, locale),
  });
  params.append("embeds[]", siteUrl);
  return `https://warpcast.com/~/compose?${params.toString()}`;
}
