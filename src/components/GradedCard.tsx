import { forwardRef } from "react";
import { CardData, parseSkills } from "@/lib/types";
import { generateBarcodeWidths, generatePlayerId } from "@/lib/twitter-share";
import { LogoPattern } from "./LogoPattern";
import { Avatar } from "./Avatar";

interface GradedCardProps {
  data: CardData;
  cardNumber?: number;
}

export const GradedCard = forwardRef<HTMLDivElement, GradedCardProps>(
  function GradedCard({ data, cardNumber = 1 }, ref) {
    const { firstName, lastName, xUsername, role, skills, profileImageUrl } = data;
    const fullName = `${firstName} ${lastName}`.trim() || "İsimsiz Oyuncu";
    const handle = xUsername.replace(/^@/, "") || "kullaniciadi";
    const barcodeSeed = handle || "web3card";
    const barcodeWidths = generateBarcodeWidths(barcodeSeed);
    const playerId = generatePlayerId(barcodeSeed);
    const skillList = parseSkills(skills);

    return (
      <div
        ref={ref}
        className="relative w-[400px] rounded-[17.6px] border border-bone/10 bg-carbon p-3"
      >
        {/* Header / PSA-style label */}
        <div className="relative mb-3 flex items-start justify-between rounded-[12px] bg-bone px-3 py-2">
          <div>
            <p className="text-[11px] font-[450] tracking-[-0.02em] text-carbon">
              WEB3 CARD
            </p>
            <p className="text-[7px] tracking-[0.15em] text-iron">
              DIGITAL COLLECTIBLE
            </p>
            <div className="mt-1.5 flex h-4 items-end gap-[1.5px]">
              {barcodeWidths.map((w, i) => (
                <div
                  key={i}
                  className="bg-carbon"
                  style={{ width: `${w}px`, height: "100%" }}
                />
              ))}
            </div>
            <p className="mt-1 text-[7px] tracking-wider text-iron">
              PLAYER ID: {playerId}
            </p>
          </div>
          <div className="text-3xl font-[450] leading-none tracking-[-0.03em] text-carbon">
            #{cardNumber}
          </div>
        </div>

        {/* Inner card */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[12px] border border-bone/10 bg-carbon p-4">
          <LogoPattern logoUrl={data.logoImageUrl} />

          {/* top row */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="rounded-full border border-bone/20 px-2 py-0.5 text-[9px] tracking-wider text-smoke">
              ● ACTIVE
            </span>
            <span className="text-xs font-[450] text-bone">@{handle}</span>
          </div>

          {/* profile */}
          <div className="relative z-10 mt-7 flex flex-col items-center">
            <div className="h-28 w-28 rounded-full border border-bone/15 p-[3px]">
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
            <h3 className="mt-3 text-center text-lg font-[450] leading-tight tracking-[-0.02em] text-bone">
              {fullName}
            </h3>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-smoke">
              {role || "Web3 Builder"}
            </p>
          </div>

          {/* skills */}
          <div className="relative z-10 mt-7">
            <p className="text-[9px] tracking-[0.2em] text-iron">SKILLS:</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(skillList.length > 0 ? skillList : ["Web3", "Builder"]).map((skill, i) => (
                <span
                  key={i}
                  className="rounded-full border border-bone/10 bg-bone/5 px-2 py-1 text-[9px] text-smoke"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
