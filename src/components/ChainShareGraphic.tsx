import { forwardRef } from "react";
import { CardData } from "@/lib/types";
import { Locale, t } from "@/lib/dictionary";
import { LogoPattern } from "./LogoPattern";
import { GoldenChain } from "./GoldenChain";
import { Avatar } from "./Avatar";

interface ChainShareGraphicProps {
  data: CardData;
  locale: Locale;
}

export const ChainShareGraphic = forwardRef<HTMLDivElement, ChainShareGraphicProps>(
  function ChainShareGraphic({ data, locale }, ref) {
    const s = t(locale);
    const { firstName, lastName, xUsername, role, profileImageUrl, targetUsername, logoImageUrl } =
      data;
    const fullName = `${firstName} ${lastName}`.trim() || s.card.unnamed;
    const handle = xUsername.replace(/^@/, "") || "username";
    const target = targetUsername.replace(/^@/, "") || "next";

    return (
      <div
        ref={ref}
        className="relative flex h-[630px] w-[1200px] items-center justify-between overflow-hidden rounded-[17.6px] bg-carbon px-14 py-10"
      >
        {/* watermark */}
        <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 text-[11px] tracking-[0.4em] text-iron">
          {s.chainShare.watermark}
        </div>

        {/* LEFT: completed card */}
        <div className="relative z-10 flex h-[460px] w-[340px] flex-col items-center justify-center overflow-hidden rounded-[17.6px] border border-bone/10 bg-carbon p-6">
          <LogoPattern logoUrl={logoImageUrl} opacity={0.05} />
          <span className="absolute left-4 top-4 rounded-full border border-bone/20 px-2 py-0.5 text-[9px] tracking-wider text-smoke">
            ● {s.card.active}
          </span>
          <span className="absolute right-4 top-4 text-xs font-[450] text-bone">
            @{handle}
          </span>

          <div className="relative z-10 h-28 w-28 rounded-full border border-bone/15 p-[3px]">
            <div className="h-full w-full rounded-full bg-carbon p-[3px]">
              <Avatar
                imageUrl={profileImageUrl}
                username={xUsername}
                className="h-full w-full rounded-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-bone/5 text-3xl font-[450] text-iron">
                    {firstName.charAt(0).toUpperCase() || "?"}
                  </div>
                }
              />
            </div>
          </div>
          <h3 className="relative z-10 mt-4 text-center text-xl font-[450] tracking-[-0.02em] text-bone">
            {fullName}
          </h3>
          <p className="relative z-10 mt-1 text-xs uppercase tracking-[0.15em] text-smoke">
            {role || s.card.defaultRole}
          </p>
        </div>

        {/* CHAIN */}
        <GoldenChain linkCount={9} className="relative z-10 -mx-2" />

        {/* RIGHT: pending card */}
        <div className="relative z-10 flex h-[400px] w-[300px] flex-col items-center justify-center rounded-[17.6px] border-2 border-dashed border-bone/15 bg-carbon p-6">
          <Avatar
            imageUrl={null}
            username={targetUsername}
            className="h-24 w-24 rounded-full border-2 border-dashed border-bone/20 object-cover opacity-80 grayscale"
            fallback={
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-bone/20 text-iron">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-10 w-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            }
          />
          <p className="mt-5 text-xs tracking-[0.2em] text-iron">{s.chainShare.next}</p>
          <p className="mt-1 text-xl font-[450] text-bone">@{target}</p>
          <span className="mt-3 rounded-full border border-bone/20 px-3 py-1 text-[10px] tracking-[0.2em] text-smoke">
            {s.chainShare.pending}
          </span>
        </div>
      </div>
    );
  }
);
