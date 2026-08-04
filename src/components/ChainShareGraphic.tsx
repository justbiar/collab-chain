import { forwardRef } from "react";
import { CardData } from "@/lib/types";
import { displayHandle } from "@/lib/handle";
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
    const handle = displayHandle(xUsername.replace(/^@/, "")) || "username";
    const target = displayHandle(targetUsername.replace(/^@/, "")) || "next";

    return (
      <div
        ref={ref}
        className="card-plastic relative flex h-[630px] w-[1200px] items-center justify-between overflow-hidden rounded-[17.6px] px-14 py-10"
      >
        {/* watermark */}
        <div className="absolute left-1/2 top-6 z-10 -translate-x-1/2 font-mono text-[11px] tracking-[0.4em] text-white/40">
          {s.chainShare.watermark}
        </div>

        {/* LEFT: completed card */}
        <div className="card-nebula relative z-10 flex h-[460px] w-[340px] flex-col items-center justify-center overflow-hidden rounded-[17.6px] border border-white/10 p-6">
          <div aria-hidden className="card-stars pointer-events-none absolute inset-0 opacity-40" />
          <div aria-hidden className="card-holo-sheen pointer-events-none absolute inset-0" />
          <LogoPattern logoUrl={logoImageUrl} opacity={0.05} />
          <span className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-2 py-0.5 font-mono text-[9px] tracking-wider text-white/85">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8e8ec] shadow-[0_0_6px_rgba(232,232,236,0.9)]" />
            [{s.card.active}]
          </span>
          <span className="absolute right-4 top-4 z-10 font-mono text-xs font-[450] text-white">
            @{handle}
          </span>

          <div className="card-avatar-ring relative z-10 h-28 w-28 rounded-2xl p-[3px] shadow-[0_0_40px_-8px_rgba(232,232,236,0.55)]">
            <div className="h-full w-full rounded-[14px] bg-[#0a0512] p-[3px]">
              <Avatar
                imageUrl={profileImageUrl}
                username={xUsername}
                className="h-full w-full rounded-[11px] object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white/5 text-3xl font-[450] text-white/70">
                    {firstName.charAt(0).toUpperCase() || "?"}
                  </div>
                }
              />
            </div>
          </div>
          <h3 className="relative z-10 mt-4 text-center text-xl font-[600] tracking-[-0.02em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]">
            {fullName}
          </h3>
          <p className="relative z-10 mt-1 text-xs uppercase tracking-[0.15em] text-white/60">
            {role || s.card.defaultRole}
          </p>
        </div>

        {/* CHAIN */}
        <GoldenChain linkCount={9} className="relative z-10 -mx-2" />

        {/* RIGHT: next person — henüz katılmadı ama soluk/muted görünmesin diye
            aktif karttakiyle aynı görsel dille (kart-nebula, canlı halka) çizilir. */}
        <div className="card-nebula relative z-10 flex h-[400px] w-[300px] flex-col items-center justify-center rounded-[17.6px] border border-white/10 p-6">
          <div className="card-avatar-ring h-24 w-24 rounded-2xl p-[3px]">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c0c0e]">
              <Avatar
                imageUrl={null}
                username={targetUsername}
                className="h-full w-full rounded-[11px] object-cover"
                fallback={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-10 w-10 text-white/40"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
            </div>
          </div>
          <p className="mt-5 font-mono text-xs tracking-[0.2em] text-[#c9b8e8]">{s.chainShare.next}</p>
          <p className="mt-1 font-mono text-xl font-[450] text-white">@{target}</p>
        </div>
      </div>
    );
  }
);
