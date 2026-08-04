import { displayHandle, isFarcasterHandle } from "@/lib/handle";

/** Kimlik string'inin (X ya da "fc:"-önekli Farcaster) genel platform avatarı. */
export function xAvatarUrl(username: string): string | null {
  const raw = username.replace(/^@/, "").trim();
  if (!raw) return null;
  const handle = displayHandle(raw);
  if (!handle) return null;
  const platform = isFarcasterHandle(raw) ? "farcaster" : "twitter";
  return `/api/avatar?u=${encodeURIComponent(handle)}&p=${platform}`;
}
