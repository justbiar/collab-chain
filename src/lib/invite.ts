export const INVITE_EXPIRY_HOURS = 48;

export interface InviteLike {
  inviteStatus: string;
  inviteExpiresAt: Date | null;
}

export function isInviteExpired(card: InviteLike): boolean {
  return (
    card.inviteStatus === "pending" &&
    card.inviteExpiresAt != null &&
    card.inviteExpiresAt.getTime() < Date.now()
  );
}

export function expiryDate(): Date {
  return new Date(Date.now() + INVITE_EXPIRY_HOURS * 60 * 60 * 1000);
}

export function hoursRemaining(card: InviteLike): number | null {
  if (card.inviteStatus !== "pending" || !card.inviteExpiresAt) return null;
  const ms = card.inviteExpiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (60 * 60 * 1000)));
}
