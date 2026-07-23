import { getCardById, isInviteExpired, INVITE_EXPIRY_HOURS } from "@/lib/chain";
import { CreateClient } from "./CreateClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ invite?: string }>;
}

export default async function CreatePage({ searchParams }: PageProps) {
  const { invite } = await searchParams;
  const parentId = invite ? Number(invite) : null;

  let parentCard = null;
  let inviteError: string | null = null;

  if (parentId != null) {
    if (!Number.isInteger(parentId)) {
      inviteError = "Geçersiz davet linki.";
    } else {
      parentCard = await getCardById(parentId);
      if (!parentCard) {
        inviteError = "Davet bulunamadı.";
      } else if (parentCard.inviteStatus === "accepted") {
        inviteError = "Bu davet zaten başkası tarafından kabul edilmiş.";
      } else if (isInviteExpired(parentCard)) {
        inviteError =
          "Bu davetin süresi doldu. Davet sahibinin daveti yenilemesi gerekiyor.";
      }
    }
  }

  return (
    <CreateClient
      parentId={inviteError ? null : parentId}
      parentCard={inviteError ? null : parentCard}
      inviteError={inviteError}
      inviteExpiryHours={INVITE_EXPIRY_HOURS}
    />
  );
}
