import Link from "next/link";
import {
  findRoot,
  getCardById,
  getCardPosition,
  isInviteExpired,
  isUsernameBanned,
  listJoinRequests,
  INVITE_EXPIRY_HOURS,
} from "@/lib/chain";
import { auth, signIn, signOut } from "@/auth";
import { getLocale, t } from "@/lib/i18n";
import { GateScreen } from "@/components/GateScreen";
import { FarcasterSignInButton } from "@/components/FarcasterSignInButton";
import { displayHandle } from "@/lib/handle";
import { CreateClient } from "./CreateClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ invite?: string }>;
}

export default async function CreatePage({ searchParams }: PageProps) {
  const [{ invite }, locale] = await Promise.all([searchParams, getLocale()]);
  const s = t(locale).create;
  const parentId = invite ? Number(invite) : null;

  let parentCard = null;
  let inviteError: string | null = null;

  if (parentId != null) {
    if (!Number.isInteger(parentId)) {
      inviteError = s.invalidLink;
    } else {
      parentCard = await getCardById(parentId);
      if (!parentCard) {
        inviteError = s.inviteNotFound;
      } else if (parentCard.inviteStatus === "accepted") {
        inviteError = s.inviteAlreadyAcceptedByOther;
      } else if (isInviteExpired(parentCard)) {
        inviteError = s.inviteExpiredRenewNeeded;
      }
    }
  }

  // Genesis akışı (davetsiz yeni zincir başlatma): artık herkes başlatabilir,
  // tek şart oturum açmış olmak. Aynı kontrol /api/cards içinde de var —
  // burası sadece arayüz kapısı.
  if (parentId == null && !inviteError) {
    const session = await auth();

    if (!session?.user?.username) {
      return (
        <GateScreen>
          <p className="text-lg font-[500] text-bone">{s.startAuthRequiredTitle}</p>
          <p className="max-w-sm text-sm text-smoke">{s.startAuthRequiredBody}</p>

          <div className="flex w-full flex-col items-center gap-2">
            <form
              action={async () => {
                "use server";
                await signIn("twitter", { redirectTo: "/create" });
              }}
            >
              <button
                type="submit"
                className="btn-metallic-silver rounded-full px-7 py-3 text-[15px] font-[500] tracking-[-0.02em]"
              >
                {s.signInWithX}
              </button>
            </form>
            <FarcasterSignInButton callbackUrl="/create" />
          </div>

          <Link href="/" className="text-xs text-smoke underline">
            {s.backHome}
          </Link>
        </GateScreen>
      );
    }
  }

  // Davet kabul akışı: X ile kimlik doğrulaması şart
  if (parentCard && !inviteError) {
    const session = await auth();
    const target = (parentCard.targetUsername ?? "").toLowerCase();

    if (!session?.user) {
      return (
        <GateScreen>
          <p className="text-lg font-[500] text-bone">
            {s.authRequiredTitle(displayHandle(parentCard.targetUsername ?? ""))}
          </p>
          <p className="max-w-sm text-sm text-smoke">
            {s.authRequiredBody(parentCard.firstName, parentCard.lastName)}
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
              className="btn-metallic-silver rounded-full px-7 py-3 text-[15px] font-[500] tracking-[-0.02em]"
            >
              {s.signInWithX}
            </button>
          </form>
          <FarcasterSignInButton callbackUrl={`/create?invite=${parentId}`} />
          <Link href="/" className="text-xs text-smoke underline">
            {s.backHome}
          </Link>
        </GateScreen>
      );
    }

    // Elenmiş hesap daveti kabul edemez — API de reddederdi ama kullanıcıya
    // formu doldurttuktan sonra değil, girişte söylemek gerekiyor.
    if (await isUsernameBanned(session.user.username ?? "")) {
      return (
        <GateScreen>
          <p className="text-lg font-[500] text-bone">{s.bannedTitle}</p>
          <p className="max-w-sm text-sm text-smoke">{s.bannedBody}</p>
          <Link href="/" className="text-xs text-smoke underline">
            {s.backHome}
          </Link>
        </GateScreen>
      );
    }

    const sessionHandle = (session.user.username ?? "").toLowerCase();
    if (sessionHandle !== target) {
      return (
        <GateScreen>
          <p className="text-lg font-[500] text-bone">{s.notYoursTitle}</p>
          <p className="max-w-sm text-sm text-smoke">
            {s.notYoursBody(
              displayHandle(parentCard.targetUsername ?? ""),
              displayHandle(session.user.username ?? s.unknownUser)
            )}
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: `/create?invite=${parentId}` });
            }}
          >
            <button
              type="submit"
              className="btn-metallic-ghost rounded-full px-6 py-3 text-[15px]"
            >
              {s.signOutRetry}
            </button>
          </form>
          <Link href="/" className="text-xs text-smoke underline">
            {s.backHome}
          </Link>
        </GateScreen>
      );
    }
  }

  // Önizlemede kişinin zincirde alacağı gerçek sıra gösterilir.
  const activeParent = inviteError ? null : parentCard;
  const nextPosition = activeParent ? (await getCardPosition(activeParent)) + 1 : 1;

  // Bu noktaya kadar gelindiyse (genesis ya da davet kabul akışı) oturum
  // zaten doğrulanmış ve kullanıcı adı sabitlenmiştir. Kart formunda kullanıcı
  // adı hep buradan gelir — kimse başkasının X adını yazamaz.
  const session = await auth();
  const sessionUsername = session?.user?.username ?? "";

  // Bu koleksiyona katılmak isteyenlerin listesi — sırası gelen kişi birini
  // etiketlemek yerine buradan seçebilir. Yeni (genesis) koleksiyonda henüz
  // kimse katılmak isteyemez, o yüzden liste boştur.
  const joinRequests = activeParent
    ? await listJoinRequests((await findRoot(activeParent)).id)
    : [];

  return (
    <CreateClient
      parentId={inviteError ? null : parentId}
      parentCard={activeParent}
      inviteError={inviteError}
      inviteExpiryHours={INVITE_EXPIRY_HOURS}
      nextPosition={nextPosition}
      locale={locale}
      sessionUsername={sessionUsername}
      joinRequests={joinRequests.map((r) => r.xUsername)}
    />
  );
}
