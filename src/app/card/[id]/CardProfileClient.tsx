"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GradedCard } from "@/components/GradedCard";
import { ChainShareGraphic } from "@/components/ChainShareGraphic";
import { CardData } from "@/lib/types";
import { downloadNodeAsImage } from "@/lib/download-image";
import { buildChainTweetIntent } from "@/lib/twitter-share";
import { isInviteExpired, hoursRemaining } from "@/lib/invite";
import { Locale, t } from "@/lib/dictionary";
import type { Card } from "@/generated/prisma/client";

type Tab = "card" | "chain";

export function CardProfileClient({ card, locale }: { card: Card; locale: Locale }) {
  const s = t(locale).profile;
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("card");
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [renewTarget, setRenewTarget] = useState("");
  const [isRenewing, setIsRenewing] = useState(false);
  const [renewError, setRenewError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef<HTMLDivElement>(null);

  const data: CardData = {
    firstName: card.firstName,
    lastName: card.lastName,
    xUsername: card.xUsername,
    role: card.role,
    skills: card.skills,
    profileImageUrl: card.profileImageUrl,
    logoImageUrl: card.logoImageUrl,
    targetUsername: card.targetUsername ?? "",
  };

  const hasTarget = Boolean(card.targetUsername);
  const expired = hasTarget && isInviteExpired(card);
  const remainingHours = hoursRemaining(card);

  const handleDownload = async () => {
    const node = tab === "card" ? cardRef.current : chainRef.current;
    if (!node) return;
    setIsDownloading(true);
    try {
      await downloadNodeAsImage(
        node,
        tab === "card"
          ? `web3-card-${card.xUsername}.png`
          : `web3-chain-${card.xUsername}.png`
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    const inviteUrl = `${window.location.origin}/invite/${card.id}`;
    const url = buildChainTweetIntent(card.targetUsername ?? "", inviteUrl, locale);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyInvite = async () => {
    const inviteUrl = `${window.location.origin}/invite/${card.id}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRenew = async () => {
    if (!renewTarget.trim()) {
      setRenewError(s.renewErrorTarget);
      return;
    }
    setIsRenewing(true);
    setRenewError(null);
    try {
      const res = await fetch(`/api/cards/${card.id}/invite`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUsername: renewTarget }),
      });
      const json = await res.json();
      if (!res.ok) {
        setRenewError(json.error ?? s.renewErrorGeneric);
        return;
      }
      setRenewTarget("");
      router.refresh();
    } catch {
      setRenewError(s.renewErrorConnection);
    } finally {
      setIsRenewing(false);
    }
  };

  const create = t(locale).create;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-carbon px-4 py-10 sm:px-8">
      <header className="mx-auto mb-8 max-w-6xl text-center">
        <p className="text-[19px] tracking-[-0.03em] text-ash">#{card.id}</p>
        <p className="mt-1 text-[35px] font-[450] leading-[1.1] tracking-[-0.04em] text-bone">
          {card.firstName} {card.lastName}
        </p>
        <p className="mt-2 text-[15px] text-smoke">
          @{card.xUsername} {card.role && `· ${card.role}`}
        </p>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col items-center gap-6">
        <div className="flex rounded-full border border-bone/10 p-1">
          <button
            onClick={() => setTab("card")}
            className={`rounded-full px-5 py-2 text-xs tracking-wider transition ${
              tab === "card"
                ? "bg-bone text-carbon"
                : "text-iron hover:text-bone"
            }`}
          >
            {create.tabCard}
          </button>
          {hasTarget && (
            <button
              onClick={() => setTab("chain")}
              className={`rounded-full px-5 py-2 text-xs tracking-wider transition ${
                tab === "chain"
                  ? "bg-bone text-carbon"
                  : "text-iron hover:text-bone"
              }`}
            >
              {create.tabChain}
            </button>
          )}
        </div>

        <div className="w-full max-w-full overflow-x-auto rounded-[17.6px] border border-bone/10 bg-carbon p-6 sm:p-10">
          <div className={tab === "card" ? "flex justify-center" : "hidden"}>
            <GradedCard ref={cardRef} data={data} cardNumber={card.id} locale={locale} />
          </div>
          {hasTarget && (
            <div
              className={
                tab === "chain"
                  ? "mx-auto aspect-[1200/630] w-full max-w-[720px] overflow-hidden"
                  : "hidden"
              }
            >
              <div
                className="origin-top-left scale-[0.6]"
                style={{ width: 1200, height: 630 }}
              >
                <ChainShareGraphic ref={chainRef} data={data} locale={locale} />
              </div>
            </div>
          )}
        </div>

        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 rounded-full border border-bone/20 px-5 py-3 text-[15px] tracking-[-0.02em] text-bone transition hover:bg-bone/5 disabled:opacity-50"
          >
            {isDownloading ? s.downloading : s.pngDownload}
          </button>
          {hasTarget && card.inviteStatus === "pending" && !expired && (
            <button
              onClick={handleShare}
              className="flex-1 rounded-full bg-bone px-5 py-3 text-[15px] font-[500] tracking-[-0.02em] text-carbon transition hover:bg-ash"
            >
              {s.shareOnX}
            </button>
          )}
        </div>

        {hasTarget && (
          <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-[17.6px] border border-bone/10 p-4 text-center">
            <p className="text-xs text-smoke">
              {card.inviteStatus === "accepted"
                ? s.accepted(card.targetUsername ?? "")
                : expired
                  ? s.expired(card.targetUsername ?? "")
                  : s.pending(card.targetUsername ?? "", remainingHours)}
            </p>

            {card.inviteStatus === "pending" && !expired && (
              <button
                onClick={handleCopyInvite}
                className="text-xs text-bone underline"
              >
                {copied ? s.copied : s.copyInviteLink}
              </button>
            )}

            {card.inviteStatus === "pending" && expired && (
              <div className="flex w-full flex-col items-center gap-2">
                <p className="text-[11px] text-iron">{s.renewHint}</p>
                <div className="flex w-full gap-2">
                  <input
                    value={renewTarget}
                    onChange={(e) => setRenewTarget(e.target.value)}
                    placeholder={s.renewPlaceholder}
                    className="w-full rounded-full border border-bone/10 bg-bone/5 px-4 py-2 text-sm text-bone placeholder:text-iron/60 outline-none focus:border-bone/40"
                  />
                  <button
                    onClick={handleRenew}
                    disabled={isRenewing}
                    className="shrink-0 rounded-full bg-bone px-4 py-2 text-xs font-[500] text-carbon transition hover:bg-ash disabled:opacity-50"
                  >
                    {isRenewing ? s.renewing : s.renewButton}
                  </button>
                </div>
                {renewError && <p className="text-xs text-red-400">{renewError}</p>}
              </div>
            )}
          </div>
        )}

        <Link href="/" className="text-xs text-iron underline">
          {s.backHome}
        </Link>
      </main>
    </div>
  );
}
