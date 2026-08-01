import Link from "next/link";
import { ChainShareGraphic } from "@/components/ChainShareGraphic";
import { FitToWidth } from "@/components/FitToWidth";
import { CardData } from "@/lib/types";
import { Locale, t } from "@/lib/i18n";
import type { Card } from "@/generated/prisma/client";

export function InvitePreview({ parent, locale }: { parent: Card; locale: Locale }) {
  const s = t(locale).invite;
  const data: CardData = {
    firstName: parent.firstName,
    lastName: parent.lastName,
    xUsername: parent.xUsername,
    role: parent.role,
    skills: parent.skills,
    bio: parent.bio,
    profileImageUrl: parent.profileImageUrl,
    logoImageUrl: parent.logoImageUrl,
    targetUsername: parent.targetUsername ?? "",
    targetReason: parent.targetReason,
  };

  return (
    <div className="bg-blueprint-grid relative min-h-screen w-full overflow-x-hidden px-4 pt-28 pb-10 sm:px-8 sm:pt-24">
      {/* Authkit Ambient background glows */}
      <div aria-hidden className="ambient-blue-aura" />
      <div aria-hidden className="ambient-blueprint-aura" />

      <header className="relative z-10 mx-auto mb-8 max-w-xl text-center">
        <p className="font-mono text-[19px] tracking-[-0.03em] text-bone">
          @{parent.targetUsername}
        </p>
        <p className="mt-1 text-[44px] font-[800] leading-[1.05] tracking-[-0.04em] text-gradient-ice">
          {s.heading}
        </p>
        <p className="mt-3 text-[15px] text-ash">
          {s.body(parent.firstName, parent.lastName, parent.xUsername)}
        </p>
      </header>

      <main className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-6">
        <div className="glass-panel w-full max-w-full rounded-[22px] p-4 shadow-2xl sm:p-10">
          <div className="mx-auto w-full max-w-[720px]">
            <FitToWidth designWidth={1200}>
              <ChainShareGraphic data={data} locale={locale} />
            </FitToWidth>
          </div>
        </div>

        <Link
          href={`/create?invite=${parent.id}`}
          className="btn-metallic-silver inline-flex items-center gap-3 rounded-full px-10 py-5 text-[16px] font-[700] tracking-[-0.01em]"
        >
          {s.acceptCta}
        </Link>

        <Link href="/" className="text-xs text-smoke underline">
          {s.backHome}
        </Link>
      </main>
    </div>
  );
}
