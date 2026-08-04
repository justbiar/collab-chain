import Link from "next/link";
import type { ChainNode, ChainState } from "@/lib/chain";
import { isInviteExpired } from "@/lib/invite";
import { displayHandle } from "@/lib/handle";
import { Locale, t } from "@/lib/dictionary";
import { Avatar } from "./Avatar";
import { GoldenChain } from "./GoldenChain";

interface ChainRowProps {
  nodes: ChainNode[];
  state: ChainState;
  /** Kapanmış koleksiyonda bekleyen halka gösterilmez. */
  isOpen?: boolean;
  locale: Locale;
}

export function ChainRow({ nodes, state, isOpen = true, locale }: ChainRowProps) {
  const s = t(locale);
  const holder = state.turnHolder;
  // Bekleyen halka sıradaki kişiye aittir; sıra geriye düştüyse eski uçtaki
  // davet değil, sırayı elinde tutanın daveti gösterilir.
  const pendingTarget =
    isOpen && holder && holder.targetUsername && holder.inviteStatus === "pending"
      ? holder
      : null;
  const pendingExpired = pendingTarget ? isInviteExpired(pendingTarget) : false;

  return (
    <div className="flex items-center gap-1 overflow-x-auto px-2 py-6 scrollbar-none">
      {nodes.map(({ card, burned, position }, i) => (
        <div key={card.id} className="flex shrink-0 items-center gap-1">
          {i > 0 && (
            <GoldenChain
              linkCount={3}
              className="w-10 shrink-0"
              animated={!burned}
              broken={burned}
            />
          )}
          <Link
            href={`/card/${card.id}`}
            className={`glass-panel glass-panel-hover group relative flex w-36 shrink-0 flex-col items-center gap-2 rounded-[20px] p-4 text-center ${
              burned ? "opacity-45 grayscale" : ""
            }`}
          >
            {isOpen && !burned && holder?.id === card.id && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-bone px-2 py-0.5 font-mono text-[8px] tracking-[0.15em] text-carbon">
                {s.chainNode.turnBadge}
              </span>
            )}

            <div
              className={`relative h-16 w-16 overflow-hidden rounded-full border p-0.5 transition-transform duration-300 group-hover:scale-105 ${
                burned
                  ? "border-[rgba(var(--edge-rgb),0.15)]"
                  : "border-[rgba(var(--edge-rgb),0.2)] group-hover:border-chrome"
              }`}
            >
              <Avatar
                imageUrl={card.profileImageUrl}
                username={card.xUsername}
                className="h-full w-full rounded-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-steel-plate text-xl font-[450] text-ash">
                    {card.firstName.charAt(0).toUpperCase() || "?"}
                  </div>
                }
              />
            </div>

            <div>
              <p
                className={`truncate text-sm font-[450] transition-colors ${
                  burned ? "text-smoke line-through" : "text-bone group-hover:text-chrome"
                }`}
              >
                {card.firstName} {card.lastName}
              </p>
              <p className="font-mono text-[11px] text-smoke">@{displayHandle(card.xUsername)}</p>
            </div>

            <span
              className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] transition-colors ${
                burned
                  ? "border-[rgba(var(--edge-rgb),0.15)] text-smoke"
                  : "border-[rgba(var(--edge-rgb),0.15)] bg-carbon/40 text-ash group-hover:border-[rgba(var(--edge-rgb),0.4)]"
              }`}
            >
              {burned ? `[${s.chainNode.burned}]` : `#${position}`}
            </span>
          </Link>
        </div>
      ))}

      {pendingTarget && (
        <div className="flex shrink-0 items-center gap-1">
          <GoldenChain linkCount={3} className="w-10 shrink-0" />
          <Link
            href={pendingExpired ? `/card/${pendingTarget.id}` : `/invite/${pendingTarget.id}`}
            className="glass-panel glass-panel-hover group relative flex w-36 shrink-0 flex-col items-center gap-2 rounded-[20px] border-dashed border-[rgba(var(--edge-rgb),0.25)] p-4 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-[rgba(var(--edge-rgb),0.3)] bg-steel-plate/30 transition-colors group-hover:border-[rgba(var(--edge-rgb),0.6)]">
              <span className="text-smoke group-hover:text-bone">
                {pendingExpired ? "↺" : "+"}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-[500] text-ash group-hover:text-bone">
                {pendingExpired ? s.chainNode.expired : s.chainNode.pending}
              </p>
              <p className="truncate text-[11px] text-smoke">
                @{displayHandle(pendingTarget.targetUsername ?? "")}
              </p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
