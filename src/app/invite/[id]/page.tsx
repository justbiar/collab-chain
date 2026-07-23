import Link from "next/link";
import { notFound } from "next/navigation";
import { getCardById, isInviteExpired } from "@/lib/chain";
import { prisma } from "@/lib/prisma";
import { InvitePreview } from "./InvitePreview";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { id } = await params;
  const parentId = Number(id);
  if (!Number.isInteger(parentId)) notFound();

  const parent = await getCardById(parentId);
  if (!parent) notFound();

  if (!parent.targetUsername) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
        <p className="text-lg font-[450] text-bone">Bu kart kimseyi davet etmemiş.</p>
        <Link href="/" className="text-smoke underline">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  if (parent.inviteStatus === "accepted") {
    const child = await prisma.card.findFirst({ where: { parentId } });
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
        <p className="text-lg font-[450] text-bone">Bu davet zaten kabul edildi 🎉</p>
        {child && (
          <Link href={`/card/${child.id}`} className="text-smoke underline">
            @{child.xUsername} kartını gör
          </Link>
        )}
        <Link href="/" className="text-xs text-iron underline">
          ← Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  if (isInviteExpired(parent)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
        <p className="text-lg font-[450] text-bone">
          Bu davetin süresi doldu ⌛
        </p>
        <p className="max-w-sm text-sm text-smoke">
          {parent.firstName} {parent.lastName}, davetini {parent.targetUsername
            ? `@${parent.targetUsername}`
            : "bu kişi"}{" "}
          kabul etmediği için yenilemesi gerekiyor.
        </p>
        <Link href="/" className="text-xs text-iron underline">
          ← Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return <InvitePreview parent={parent} />;
}
