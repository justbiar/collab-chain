"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GradedCard } from "@/components/GradedCard";
import { ChainShareGraphic } from "@/components/ChainShareGraphic";
import { TweetPanel } from "@/components/TweetPanel";
import { CastPanel } from "@/components/CastPanel";
import { MintPanel } from "@/components/MintPanel";
import { FitToWidth } from "@/components/FitToWidth";
import { CardData, USERNAME_MAX } from "@/lib/types";
import { downloadNodeAsImage } from "@/lib/download-image";
import { buildChainTweetIntent } from "@/lib/twitter-share";
import { buildChainCastIntent } from "@/lib/farcaster-share";
import { isInviteExpired, hoursRemaining } from "@/lib/invite";
import { displayHandle } from "@/lib/handle";
import { Locale, t } from "@/lib/dictionary";
import type { Card } from "@/generated/prisma/client";

type Tab = "card" | "chain";

export function CardProfileClient({
  card,
  position,
  locale,
  isOwner,
  collectionName,
}: {
  card: Card;
  /** Zincirdeki sıra — kartın üstünde gösterilen numara. */
  position: number;
  locale: Locale;
  isOwner: boolean;
  /** Kök karttan okunan koleksiyon adı — paylaşım tweet'ine girer. */
  collectionName: string;
}) {
  const s = t(locale).profile;
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("card");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
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
    bio: card.bio,
    profileImageUrl: card.profileImageUrl,
    logoImageUrl: card.logoImageUrl,
    targetUsername: card.targetUsername ?? "",
    targetReason: card.targetReason,
  };

  const hasTarget = Boolean(card.targetUsername);
  const expired = hasTarget && isInviteExpired(card);
  const remainingHours = hoursRemaining(card);

  const handleDownload = async () => {
    const node = tab === "card" ? cardRef.current : chainRef.current;
    if (!node) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await downloadNodeAsImage(
        node,
        tab === "card"
          ? `web3-card-${card.xUsername}.png`
          : `web3-chain-${card.xUsername}.png`
      );
    } catch {
      setDownloadError(s.downloadError);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareParts = {
    collectionName,
    isFounder: card.parentId == null,
    targetUsername: card.targetUsername ?? "",
    bio: card.bio,
    targetReason: card.targetReason,
  };

  const handleShare = () => {
    const inviteUrl = `${window.location.origin}/invite/${card.id}`;
    const url = buildChainTweetIntent(shareParts, inviteUrl, locale);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareFarcaster = () => {
    const inviteUrl = `${window.location.origin}/invite/${card.id}`;
    const url = buildChainCastIntent(shareParts, inviteUrl, locale);
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
        setRenewError(
          json.error === "RATE_LIMITED" ? s.renewErrorRateLimited : (json.error ?? s.renewErrorGeneric)
        );
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
    <div className="bg-blueprint-grid relative min-h-screen w-full overflow-x-hidden px-4 pt-28 pb-10 sm:px-8 sm:pt-24">
      {/* Authkit Ambient background glows */}
      <div aria-hidden className="ambient-blue-aura" />
      <div aria-hidden className="ambient-blueprint-aura" />

      <header className="relative z-10 mx-auto mb-8 max-w-6xl text-center">
        <p className="font-mono text-[19px] tracking-[-0.03em] text-bone">#{position}</p>
        <p className="mt-1 text-[44px] font-[800] leading-[1.05] tracking-[-0.04em] text-gradient-ice">
          {card.firstName} {card.lastName}
        </p>

        <p className="mt-2 text-[15px] text-smoke">
          <Link href={`/u/${encodeURIComponent(card.xUsername)}`} className="font-mono underline-offset-4 hover:text-bone hover:underline">
            @{displayHandle(card.xUsername)}
          </Link>
          {card.role && ` · ${card.role}`}
        </p>

        {card.bio && (
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ash">
            {card.bio}
          </p>
        )}
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-6">

        <div className="metallic-panel flex rounded-full p-1">
          <button
            onClick={() => setTab("card")}
            className={`rounded-full px-5 py-2 font-mono text-xs tracking-wider transition ${
              tab === "card"
                ? "btn-metallic-silver"
                : "text-smoke hover:text-bone"
            }`}
          >
            {tab === "card" ? `[${create.tabCard}]` : create.tabCard}
          </button>
          {hasTarget && (
            <button
              onClick={() => setTab("chain")}
              className={`rounded-full px-5 py-2 font-mono text-xs tracking-wider transition ${
                tab === "chain"
                  ? "btn-metallic-silver"
                  : "text-smoke hover:text-bone"
              }`}
            >
              {tab === "chain" ? `[${create.tabChain}]` : create.tabChain}
            </button>
          )}
        </div>

        <div className="metallic-panel w-full max-w-full rounded-[22px] p-4 sm:p-10">
          {/* Sadece aktif sekme render edilir: gizli bir sekmenin ölçüsü
              alınamadığı için ölçekleme yanlış hesaplanıyordu. */}
          {tab === "card" && (
            <div className="mockup-stage pt-4 pb-28">
              <FitToWidth designWidth={400}>
                <div className="mockup-reflect">
                  <GradedCard ref={cardRef} data={data} cardNumber={position} locale={locale} />
                </div>
              </FitToWidth>
            </div>
          )}
          {hasTarget && tab === "chain" && (
            <div className="mx-auto w-full max-w-[720px]">
              <FitToWidth designWidth={1200}>
                <ChainShareGraphic ref={chainRef} data={data} locale={locale} />
              </FitToWidth>
            </div>
          )}
        </div>

        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="metallic-panel metallic-panel-hover flex-1 rounded-full px-5 py-3 text-[15px] tracking-[-0.01em] text-white disabled:opacity-50"
          >
            {isDownloading ? s.downloading : s.pngDownload}
          </button>
          {hasTarget && card.inviteStatus === "pending" && !expired && (
            <button
              onClick={handleShare}
              className="btn-metallic-silver flex-1 rounded-full px-5 py-3 text-[15px] tracking-[-0.01em]"
            >
              {s.shareOnX}
            </button>
          )}
          {hasTarget && card.inviteStatus === "pending" && !expired && (
            <button
              onClick={handleShareFarcaster}
              className="btn-metallic-ghost flex-1 rounded-full px-5 py-3 text-[15px] tracking-[-0.01em]"
            >
              {s.shareOnFarcaster}
            </button>
          )}
        </div>
        {downloadError && <p className="text-sm text-red-400">{downloadError}</p>}

        <TweetPanel
          cardId={card.id}
          tweetUrl={card.tweetUrl}
          isOwner={isOwner}
          locale={locale}
        />

        <CastPanel
          cardId={card.id}
          castUrl={card.castUrl}
          isOwner={isOwner}
          locale={locale}
        />

        <MintPanel
          cardId={card.id}
          isOwner={isOwner}
          walletAddress={card.walletAddress}
          nftTxHash={card.nftTxHash}
          locale={locale}
        />


        {hasTarget && (
          <div className="metallic-panel flex w-full max-w-md flex-col items-center gap-3 rounded-[22px] p-5 text-center">
            <p className="text-xs text-smoke">
              {card.inviteStatus === "accepted"
                ? s.accepted(displayHandle(card.targetUsername ?? ""))
                : expired
                  ? s.expired(displayHandle(card.targetUsername ?? ""))
                  : s.pending(displayHandle(card.targetUsername ?? ""), remainingHours)}
            </p>

            {card.targetReason && (
              <p className="max-w-sm text-[13px] leading-relaxed text-ash">
                “{card.targetReason}”
              </p>
            )}

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
                    maxLength={USERNAME_MAX}
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
