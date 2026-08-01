import type { Card } from "@/generated/prisma/client";
import { Avatar } from "./Avatar";

interface AvatarMarqueeProps {
  cards: Card[];
}

export function AvatarMarquee({ cards }: AvatarMarqueeProps) {
  if (cards.length === 0) return null;

  const track = [...cards, ...cards];

  return (
    <div aria-hidden className="marquee-fade relative z-10 -mx-4 my-16 overflow-hidden py-2 sm:-mx-8">
      <div className="flex w-max -rotate-2 gap-2 animate-marquee">
        {track.map((card, i) => (
          <div
            key={`${card.id}-${i}`}
            className="h-[208px] w-[124px] shrink-0 overflow-hidden rounded-[6px]"
          >
            <Avatar
              imageUrl={card.profileImageUrl}
              username={card.xUsername}
              className="h-full w-full object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center bg-steel-plate text-3xl font-[450] text-ash">
                  {card.firstName.charAt(0).toUpperCase() || "?"}
                </div>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
