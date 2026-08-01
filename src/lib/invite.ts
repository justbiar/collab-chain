/** Etiketlenen kişinin daveti kabul etmesi için tanınan süre. */
export const INVITE_EXPIRY_HOURS = 24;
/** Zincire katılan üyenin birini etiketlemesi için tanınan süre. */
export const TURN_EXPIRY_HOURS = 24;

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

function hoursFromNow(hours: number): Date {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export function expiryDate(): Date {
  return hoursFromNow(INVITE_EXPIRY_HOURS);
}

export function turnExpiryDate(): Date {
  return hoursFromNow(TURN_EXPIRY_HOURS);
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function hoursRemaining(card: InviteLike): number | null {
  if (card.inviteStatus !== "pending" || !card.inviteExpiresAt) return null;
  const ms = card.inviteExpiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (60 * 60 * 1000)));
}

export function hoursUntil(deadline: Date | null): number | null {
  if (!deadline) return null;
  const ms = deadline.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (60 * 60 * 1000)));
}

/** Geri sayım kutularının sunucudaki başlangıç değeri için kalan milisaniye. */
export function msUntil(deadline: Date | null | undefined): number | null {
  if (!deadline) return null;
  return Math.max(0, deadline.getTime() - Date.now());
}
