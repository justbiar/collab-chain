import Link from "next/link";
import type { Card } from "@/generated/prisma/client";
import type { CollectionPhase } from "@/lib/collection";
import { collectionTitle } from "@/lib/chain";
import { displayHandle } from "@/lib/handle";
import { Locale, t } from "@/lib/dictionary";
import { AvatarStack } from "./AvatarStack";

interface CollectionCardProps {
  root: Card;
  chain: Card[];
  phase: CollectionPhase;
  locale: Locale;
}

export function CollectionCard({ root, chain, phase, locale }: CollectionCardProps) {
  const s = t(locale);
  const founder = chain[0] ?? root;

  const statusLabel =
    root.chainStatus === "completed"
      ? s.collection.statusCompleted
      : root.chainStatus === "cancelled"
        ? s.collection.statusCancelled
        : root.chainStatus === "dead"
          ? s.collection.statusFrozen
          : phase === "upcoming"
            ? s.collection.statusUpcoming
            : s.collection.statusOngoing;

  return (
    <Link
      href={`/chain/${root.id}`}
      className="glass-panel glass-panel-hover group relative flex flex-col overflow-hidden rounded-[22px]"
    >
      {/* Kapak — koleksiyonun kendi görseli */}
      <div className="relative h-28 w-full overflow-hidden bg-steel-plate/40">
        {root.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={root.coverImageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div aria-hidden className="bg-blueprint-grid h-full w-full opacity-60" />
        )}
        {/* Başlığın okunabilirliği için alta doğru koyulaşma */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/40 to-transparent"
        />
        <span className="absolute right-3 top-3 rounded-full border border-[rgba(var(--edge-rgb),0.25)] bg-carbon/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.1em] text-ash backdrop-blur-sm">
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center gap-3 px-6 pb-6 text-center">
        {/* Kapağın üstüne binen üye yığını — koleksiyonun kaç kişilik
            olduğunu tek bakışta anlatır. */}
        <div className="-mt-7 transition-transform duration-300 group-hover:scale-105">
          <AvatarStack members={chain.length > 0 ? chain : [founder]} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[17px] font-[600] tracking-[-0.01em] text-bone transition-colors group-hover:text-chrome">
            {collectionTitle(root)}
          </p>
          <p className="mt-0.5 font-mono text-[10px] text-smoke">
            {s.collection.byFounder(displayHandle(founder.xUsername))}
          </p>
        </div>

        {root.collectionDescription && (
          <p className="line-clamp-2 text-[12px] leading-snug text-smoke">
            {root.collectionDescription}
          </p>
        )}

        <span className="mt-auto rounded-full border border-[rgba(var(--edge-rgb),0.2)] bg-carbon/40 px-3 py-1 font-mono text-[10px] text-ash">
          {s.chainPage.membersCount(chain.length)}
        </span>
      </div>
    </Link>
  );
}
