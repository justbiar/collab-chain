export function xAvatarUrl(username: string): string | null {
  const handle = username.replace(/^@/, "").trim();
  if (!handle) return null;
  return `/api/avatar?u=${encodeURIComponent(handle)}`;
}
