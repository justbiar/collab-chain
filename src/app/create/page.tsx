import Link from "next/link";
import { getCardById, isInviteExpired, INVITE_EXPIRY_HOURS } from "@/lib/chain";
import { auth, signIn, signOut } from "@/auth";
import { getLocale, t } from "@/lib/i18n";
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

  // Davet kabul akışı: X ile kimlik doğrulaması şart
  if (parentCard && !inviteError) {
    const session = await auth();
    const target = (parentCard.targetUsername ?? "").toLowerCase();

    if (!session?.user) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
          <p className="text-lg font-[450] text-bone">
            {s.authRequiredTitle(parentCard.targetUsername ?? "")}
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
              className="rounded-full bg-bone px-6 py-3 text-[15px] font-[500] tracking-[-0.02em] text-carbon transition hover:bg-ash"
            >
              {s.signInWithX}
            </button>
          </form>
          <Link href="/" className="text-xs text-iron underline">
            {s.backHome}
          </Link>
        </div>
      );
    }

    const sessionHandle = (session.user.username ?? "").toLowerCase();
    if (sessionHandle !== target) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
          <p className="text-lg font-[450] text-bone">{s.notYoursTitle}</p>
          <p className="max-w-sm text-sm text-smoke">
            {s.notYoursBody(
              parentCard.targetUsername ?? "",
              session.user.username ?? s.unknownUser
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
              className="rounded-full border border-bone/20 px-6 py-3 text-[15px] text-bone transition hover:bg-bone/5"
            >
              {s.signOutRetry}
            </button>
          </form>
          <Link href="/" className="text-xs text-iron underline">
            {s.backHome}
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
      locale={locale}
    />
  );
}
