"use client";

import { forwardRef, useState, useRef, MouseEvent } from "react";
import { CardData, parseSkills } from "@/lib/types";
import { generateBarcodeWidths, generatePlayerId } from "@/lib/twitter-share";
import { Locale, t } from "@/lib/dictionary";
import { LogoPattern } from "./LogoPattern";
import { Avatar } from "./Avatar";
import { Sparkle } from "./Sparkle";

interface GradedCardProps {
  data: CardData;
  cardNumber?: number;
  locale: Locale;
}

const RESTING_STYLE = {
  transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
  boxShadow: "0 30px 70px -24px rgba(0, 0, 0, 0.9)",
  "--mouse-x": "50%",
  "--mouse-y": "50%",
} as React.CSSProperties;

export const GradedCard = forwardRef<HTMLDivElement, GradedCardProps>(
  function GradedCard({ data, cardNumber = 1, locale }, ref) {
    const s = t(locale).card;
    const { firstName, lastName, xUsername, role, skills, profileImageUrl } = data;
    const fullName = `${firstName} ${lastName}`.trim() || s.unnamed;
    const handle = xUsername.replace(/^@/, "") || "username";
    const barcodeSeed = handle || "web3card";
    const barcodeWidths = generateBarcodeWidths(barcodeSeed);
    const playerId = generatePlayerId(barcodeSeed);
    const skillList = parseSkills(skills);

    const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>(RESTING_STYLE);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      const cardNode = containerRef.current;
      if (!cardNode) return;

      const rect = cardNode.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt (-12deg to +12deg)
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`,
        // Cold specular kick that follows the tilt, like light raking across metal
        boxShadow: `${-rotateY * 1.5}px ${rotateX * 1.5 + 28}px 70px -18px rgba(0, 0, 0, 0.92), 0 0 40px -12px rgba(232, 232, 236, 0.22)`,
        "--mouse-x": `${((x / rect.width) * 100).toFixed(1)}%`,
        "--mouse-y": `${((y / rect.height) * 100).toFixed(1)}%`,
      } as React.CSSProperties);
    };

    const handleMouseLeave = () => setTiltStyle(RESTING_STYLE);

    return (
      <div ref={ref} className="card-3d-wrapper relative w-[400px]">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
          className="card-plastic relative cursor-pointer overflow-hidden rounded-[20px] p-3 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.9)]"
        >
          {/* Dynamic case glare spotlight */}
          <div aria-hidden className="card-glare pointer-events-none absolute inset-0 opacity-80" />

          {/* Static corner glare accents on the moulded plastic */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 -top-10 h-40 w-64 rotate-[-20deg] bg-white/12 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-16 h-28 w-40 rotate-[15deg] bg-white/6 blur-2xl"
          />

          {/* Inner bezel — the recessed well the card sits in */}
          <div className="relative rounded-[14px] border border-white/8 bg-black/25 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),inset_0_-1px_0_rgba(0,0,0,0.5)]">
            {/* Grading label */}
            <div className="relative mb-2.5 overflow-hidden rounded-[9px] bg-[#f4f5f7] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.6)]">
              <div className="card-holo-strip h-[3px] w-full" />
              <div className="flex items-start justify-between px-3 py-2">
                <div className="min-w-0">
                  <p className="text-[15px] font-[700] leading-none tracking-[-0.03em] text-[#08080a]">
                    {s.brand}
                  </p>
                  <p className="mt-1 text-[7px] font-[500] tracking-[0.18em] text-[#4a4d54] uppercase">
                    {s.digitalCollectible}
                  </p>
                  <p className="mt-1 truncate font-mono text-[9px] font-[500] text-[#08080a]">
                    {handle}
                  </p>
                  <div className="mt-1.5 flex h-3.5 items-end gap-[1.5px]">
                    {barcodeWidths.map((w, i) => (
                      <div
                        key={i}
                        className="bg-[#08080a]"
                        style={{ width: `${w}px`, height: "100%" }}
                      />
                    ))}
                  </div>
                  <p className="mt-1 font-mono text-[7px] tracking-wider text-[#4a4d54]">
                    {s.playerId}: {playerId}
                  </p>
                </div>
                <div className="font-mono text-[34px] font-[700] leading-none tracking-[-0.05em] text-[#08080a]">
                  #{cardNumber}
                </div>
              </div>
            </div>

            {/* Art plate */}
            <div className="card-nebula relative aspect-[3/4] overflow-hidden rounded-[9px] border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
              <div aria-hidden className="card-stars pointer-events-none absolute inset-0 opacity-40" />
              <div aria-hidden className="card-holo-sheen pointer-events-none absolute inset-0" />
              <LogoPattern logoUrl={data.logoImageUrl} />

              <div className="relative z-10 flex h-full flex-col p-3.5">
                {/* Machined status bar */}
                <div className="flex items-center justify-between rounded-[7px] border border-white/15 bg-gradient-to-b from-white/14 to-white/4 px-2.5 py-1.5 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                  <span className="flex items-center gap-1.5 font-mono text-[10px] font-[500] tracking-wider text-[#e8e8ec]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#e8e8ec] shadow-[0_0_8px_rgba(232,232,236,0.9)]" />
                    [{s.active}]
                  </span>
                  <span className="font-mono text-[11px] font-[500] text-[#e8e8ec]">{handle}</span>
                </div>

                {/* Portrait — takes the slack so the plate never bottoms out empty */}
                <div className="flex flex-1 flex-col items-center justify-center py-4">
                  <div className="card-avatar-ring h-28 w-28 rounded-2xl p-[2px] shadow-[0_0_36px_-8px_rgba(232,232,236,0.55)]">
                    <div className="h-full w-full rounded-[14px] bg-[#0a0512] p-[3px]">
                      <Avatar
                        imageUrl={profileImageUrl}
                        username={xUsername}
                        className="h-full w-full rounded-[11px] object-cover"
                        fallback={
                          <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white/6 text-3xl font-[450] text-[#e8e8ec]">
                            {firstName.charAt(0).toUpperCase() || "?"}
                          </div>
                        }
                      />
                    </div>
                  </div>
                  <h3 className="mt-3 text-center text-lg font-[600] leading-tight tracking-[-0.02em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
                    {fullName}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-[500] uppercase tracking-[0.18em] text-[#c9b8e8]">
                    {role || s.defaultRole}
                  </p>
                </div>

                {/* Skills plate */}
                <div className="flex items-start gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-white/12 bg-black/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm">
                    <Sparkle className="h-4 w-4 animate-spin-slow text-[#e8e8ec]" />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="font-mono text-[9px] tracking-[0.2em] text-[#a99cc4]">{s.skills}</p>
                    <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1">
                      {(skillList.length > 0 ? skillList : ["Web3", "Builder"]).map((skill, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-white/90">
                          <span className="skill-dot h-1 w-1 shrink-0 rounded-full" />
                          <span className="truncate">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer branding */}
                <div className="flex items-center justify-between pt-4">
                  <span className="text-[7px] tracking-[0.25em] text-white/45">{s.brand}</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-white/45">
                    <Sparkle className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
