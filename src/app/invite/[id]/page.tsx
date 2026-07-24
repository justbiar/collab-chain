import Link from "next/link";
import { notFound } from "next/navigation";
import { getCardById, isInviteExpired } from "@/lib/chain";
import { prisma } from "@/lib/prisma";
import { getLocale, t } from "@/lib/i18n";
import { InvitePreview } from "./InvitePreview";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const [{ id }, locale] = await Promise.all([params, getLocale()]);
  const s = t(locale).invite;
  const parentId = Number(id);
  if (!Number.isInteger(parentId)) notFound();

  const parent = await getCardById(parentId);
  if (!parent) notFound();

  if (!parent.targetUsername) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
        <p className="text-lg font-[450] text-bone">{s.noTarget}</p>
        <Link href="/" className="text-smoke underline">
          {s.backHomePlain}
        </Link>
      </div>
    );
  }

  if (parent.inviteStatus === "accepted") {
    const child = await prisma.card.findFirst({ where: { parentId } });
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
        <p className="text-lg font-[450] text-bone">{s.alreadyAccepted}</p>
        {child && (
          <Link href={`/card/${child.id}`} className="text-smoke underline">
            {s.viewCard(child.xUsername)}
          </Link>
        )}
        <Link href="/" className="text-xs text-iron underline">
          {s.backHome}
        </Link>
      </div>
    );
  }

  if (isInviteExpired(parent)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
        <p className="text-lg font-[450] text-bone">{s.expiredTitle}</p>
        <p className="max-w-sm text-sm text-smoke">
          {s.expiredBody(parent.firstName, parent.lastName, parent.targetUsername ?? "")}
        </p>
        <Link href="/" className="text-xs text-iron underline">
          {s.backHome}
        </Link>
      </div>
    );
  }

  return <InvitePreview parent={parent} locale={locale} />;
}
