import Link from "next/link";
import { notFound } from "next/navigation";
import { getCardById, isInviteExpired } from "@/lib/chain";
import { prisma } from "@/lib/prisma";
import { getLocale, t } from "@/lib/i18n";
import { GateScreen } from "@/components/GateScreen";
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
      <GateScreen>
        <p className="text-lg font-[500] text-bone">{s.noTarget}</p>
        <Link href="/" className="text-sm text-smoke underline">
          {s.backHomePlain}
        </Link>
      </GateScreen>
    );
  }

  if (parent.inviteStatus === "accepted") {
    const child = await prisma.card.findFirst({ where: { parentId } });
    return (
      <GateScreen>
        <p className="text-lg font-[500] text-bone">{s.alreadyAccepted}</p>
        {child && (
          <Link
            href={`/card/${child.id}`}
            className="btn-metallic-silver rounded-full px-6 py-3 text-[15px] font-[500]"
          >
            {s.viewCard(child.xUsername)}
          </Link>
        )}
        <Link href="/" className="text-xs text-smoke underline">
          {s.backHome}
        </Link>
      </GateScreen>
    );
  }

  if (isInviteExpired(parent)) {
    return (
      <GateScreen>
        <p className="text-lg font-[500] text-bone">{s.expiredTitle}</p>
        <p className="max-w-sm text-sm text-smoke">
          {s.expiredBody(parent.firstName, parent.lastName, parent.targetUsername ?? "")}
        </p>
        <Link href="/" className="text-xs text-smoke underline">
          {s.backHome}
        </Link>
      </GateScreen>
    );
  }

  return <InvitePreview parent={parent} locale={locale} />;
}
