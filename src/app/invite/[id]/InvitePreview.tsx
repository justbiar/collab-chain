import Link from "next/link";
import { ChainShareGraphic } from "@/components/ChainShareGraphic";
import { CardData } from "@/lib/types";
import type { Card } from "@/generated/prisma/client";

export function InvitePreview({ parent }: { parent: Card }) {
  const data: CardData = {
    firstName: parent.firstName,
    lastName: parent.lastName,
    xUsername: parent.xUsername,
    role: parent.role,
    skills: parent.skills,
    profileImageUrl: parent.profileImageUrl,
    logoImageUrl: parent.logoImageUrl,
    targetUsername: parent.targetUsername ?? "",
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 overflow-x-hidden bg-carbon px-4 py-10">
      <header className="max-w-xl text-center">
        <p className="text-[19px] tracking-[-0.03em] text-ash">
          @{parent.targetUsername}
        </p>
        <p className="mt-1 text-[35px] font-[450] leading-[1.1] tracking-[-0.04em] text-bone">
          Zincire davetlisin!
        </p>
        <p className="mt-3 text-[15px] text-smoke">
          {parent.firstName} {parent.lastName} (@{parent.xUsername}) seni Web3
          Chain&apos;e davet etti. Kabul et, kendi kartını oluştur ve zinciri
          devam ettir.
        </p>
      </header>

      <div className="w-full max-w-full overflow-x-auto rounded-[17.6px] border border-bone/10 bg-carbon p-6 sm:p-10">
        <div className="mx-auto aspect-[1200/630] w-full max-w-[720px] overflow-hidden">
          <div
            className="origin-top-left scale-[0.6]"
            style={{ width: 1200, height: 630 }}
          >
            <ChainShareGraphic data={data} />
          </div>
        </div>
      </div>

      <Link
        href={`/create?invite=${parent.id}`}
        className="rounded-full bg-bone px-8 py-4 text-[15px] font-[500] tracking-[-0.02em] text-carbon transition hover:bg-ash"
      >
        Kabul Et ve Kartımı Oluştur
      </Link>

      <Link href="/" className="text-xs text-iron underline">
        ← Ana Sayfaya Dön
      </Link>
    </div>
  );
}
