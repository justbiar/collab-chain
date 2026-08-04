import type { Card } from "@/generated/prisma/client";
import { displayHandle } from "@/lib/handle";
import { Avatar } from "./Avatar";

interface AvatarStackProps {
  members: Card[];
  /** Kaç avatar gösterilsin; kalanlar "+N" olarak toplanır. */
  max?: number;
}

/**
 * Koleksiyona katılanların üst üste binen avatarları. İlk birkaçı gösterilir,
 * kalan sayı "+N" rozetinde toplanır — kapak üstünde koleksiyonun tek kişiye
 * ait değil, bir topluluk olduğunu anlatır.
 */
export function AvatarStack({ members, max = 3 }: AvatarStackProps) {
  if (members.length === 0) return null;

  const shown = members.slice(0, max);
  const remaining = members.length - shown.length;

  return (
    <div className="flex items-center justify-center">
      {shown.map((member, i) => (
        <div
          key={member.id}
          title={`@${displayHandle(member.xUsername)}`}
          className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[rgba(var(--edge-rgb),0.25)] bg-carbon p-0.5 ${
            i > 0 ? "-ml-3.5" : ""
          }`}
          // Soldaki avatar üstte kalsın — doğal bir istifleme hissi verir.
          style={{ zIndex: shown.length - i }}
        >
          <Avatar
            imageUrl={member.profileImageUrl}
            username={member.xUsername}
            className="h-full w-full rounded-full object-cover"
            fallback={
              <div className="flex h-full w-full items-center justify-center rounded-full bg-steel-plate text-sm font-[450] text-ash">
                {member.firstName.charAt(0).toUpperCase() || "?"}
              </div>
            }
          />
        </div>
      ))}

      {remaining > 0 && (
        <div
          // Sayı okunabilsin diye yığının en üstünde durur.
          style={{ zIndex: shown.length + 1 }}
          className="relative -ml-3.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(var(--edge-rgb),0.25)] bg-steel-plate font-mono text-[12px] font-[600] text-bone"
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
