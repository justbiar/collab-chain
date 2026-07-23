import Link from "next/link";
import { getCardById, isInviteExpired, INVITE_EXPIRY_HOURS } from "@/lib/chain";
import { auth, signIn, signOut } from "@/auth";
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

  // Davet kabul akışı: X ile kimlik doğrulaması şart
  if (parentCard && !inviteError) {
    const session = await auth();
    const target = (parentCard.targetUsername ?? "").toLowerCase();

    if (!session?.user) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
          <p className="text-lg font-[450] text-bone">
            @{parentCard.targetUsername}, bu daveti kabul etmek için X ile
            giriş yapmalısın.
          </p>
          <p className="max-w-sm text-sm text-smoke">
            {parentCard.firstName} {parentCard.lastName} seni bu X hesabı
            için davet etti — devam etmeden önce kimliğini doğrulaman
            gerekiyor.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("twitter", {
                redirectTo: `/create?invite=${parentId}`,
              });
            }}
          >
            <button
              type="submit"
              className="rounded-full bg-bone px-6 py-3 text-[15px] font-[500] tracking-[-0.02em] text-carbon transition hover:bg-ash"
            >
              X ile Giriş Yap
            </button>
          </form>
          <Link href="/" className="text-xs text-iron underline">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      );
    }

    const sessionHandle = (session.user.username ?? "").toLowerCase();
    if (sessionHandle !== target) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
          <p className="text-lg font-[450] text-bone">
            Bu davet sana ait değil
          </p>
          <p className="max-w-sm text-sm text-smoke">
            Bu davet @{parentCard.targetUsername} için oluşturulmuş, ama sen
            @{session.user.username ?? "bilinmeyen"} olarak giriş yaptın.
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: `/create?invite=${parentId}` });
            }}
          >
            <button
              type="submit"
              className="rounded-full border border-bone/20 px-6 py-3 text-[15px] text-bone transition hover:bg-bone/5"
            >
              Çıkış Yap ve Farklı Hesapla Dene
            </button>
          </form>
          <Link href="/" className="text-xs text-iron underline">
            ← Ana Sayfaya Dön
          </Link>
        </div>
      );
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
