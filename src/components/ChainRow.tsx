import Link from "next/link";
import type { Card } from "@/generated/prisma/client";
import { isInviteExpired } from "@/lib/invite";
import { Avatar } from "./Avatar";
import { GoldenChain } from "./GoldenChain";

interface ChainRowProps {
  cards: Card[];
}

export function ChainRow({ cards }: ChainRowProps) {
  const tip = cards[cards.length - 1];
  const hasPending = Boolean(tip?.targetUsername) && tip?.inviteStatus === "pending";
  const expired = hasPending && isInviteExpired(tip);

  return (
    <div className="flex items-center gap-1 overflow-x-auto py-4">
      {cards.map((card, i) => (
        <div key={card.id} className="flex shrink-0 items-center gap-1">
          {i > 0 && <GoldenChain linkCount={3} className="w-10 shrink-0" />}
          <Link
            href={`/card/${card.id}`}
            className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-[17.6px] border border-bone/10 bg-carbon p-4 text-center transition hover:border-bone/30"
          >
            <div className="h-16 w-16 overflow-hidden rounded-full border border-bone/15">
              <Avatar
                imageUrl={card.profileImageUrl}
                username={card.xUsername}
                className="h-full w-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-bone/5 text-xl font-[450] text-iron">
                    {card.firstName.charAt(0).toUpperCase() || "?"}
                  </div>
                }
              />
            </div>
            <div>
              <p className="truncate text-sm font-[450] text-bone">
                {card.firstName} {card.lastName}
              </p>
              <p className="text-[11px] text-smoke">@{card.xUsername}</p>
            </div>
            <span className="rounded-full border border-bone/10 px-2 py-0.5 text-[9px] text-iron">
              #{card.id}
            </span>
          </Link>
        </div>
      ))}

      {hasPending && (
        <div className="flex shrink-0 items-center gap-1">
          <GoldenChain linkCount={3} className="w-10 shrink-0" />
          <Link
            href={expired ? `/card/${tip.id}` : `/invite/${tip.id}`}
            className="flex w-36 shrink-0 flex-col items-center gap-2 rounded-[17.6px] border-2 border-dashed border-bone/15 bg-carbon p-4 text-center transition hover:border-bone/40"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-bone/20 text-2xl text-iron">
              {expired ? "⌛" : "?"}
            </div>
            <div>
              <p className="text-[9px] tracking-widest text-iron">SIRADAKİ</p>
              <p className="truncate text-[11px] text-smoke">
                @{tip.targetUsername}
              </p>
            </div>
            <span className="rounded-full border border-bone/20 px-2 py-0.5 text-[9px] text-smoke">
              {expired ? "SÜRESİ DOLDU" : "PENDING"}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
