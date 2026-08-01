"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CardForm } from "@/components/CardForm";
import { GateScreen } from "@/components/GateScreen";
import { FitToWidth } from "@/components/FitToWidth";
import { GradedCard } from "@/components/GradedCard";
import { ChainShareGraphic } from "@/components/ChainShareGraphic";
import { CollectionSettingsForm } from "@/components/CollectionSettingsForm";
import {
  CardData,
  CollectionFormData,
  EMPTY_CARD_DATA,
  EMPTY_COLLECTION_FORM,
} from "@/lib/types";
import { Locale, t } from "@/lib/dictionary";
import type { Card } from "@/generated/prisma/client";

type Tab = "card" | "chain";

interface CreateClientProps {
  parentId: number | null;
  parentCard: Card | null;
  inviteError: string | null;
  inviteExpiryHours: number;
  /** Bu kişinin zincirde alacağı sıra — kart üstünde gösterilen numara. */
  nextPosition: number;
  locale: Locale;
}

export function CreateClient({
  parentId,
  parentCard,
  inviteError,
  inviteExpiryHours,
  nextPosition,
  locale,
}: CreateClientProps) {
  const s = t(locale).create;
  const router = useRouter();
  const lockedUsername = parentCard?.targetUsername ?? null;
  const [data, setData] = useState<CardData>(() =>
    lockedUsername ? { ...EMPTY_CARD_DATA, xUsername: lockedUsername } : EMPTY_CARD_DATA
  );
  const [tab, setTab] = useState<Tab>("card");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Ayarlar yalnızca yeni koleksiyon açılırken sorulur.
  const isNewCollection = parentId == null;
  const [collection, setCollection] = useState<CollectionFormData>(EMPTY_COLLECTION_FORM);

  if (inviteError) {
    return (
      <GateScreen>
        <p className="text-lg font-[500] text-bone">{inviteError}</p>
        <Link href="/" className="text-sm text-smoke underline">
          {s.backHome}
        </Link>
      </GateScreen>
    );
  }

  const handleSave = async () => {
    if (!data.firstName.trim() || !data.xUsername.trim()) {
      setError(s.requiredFields);
      return;
    }
    if (isNewCollection && !collection.name.trim()) {
      setError(t(locale).collection.nameRequired);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          parentId,
          collection: isNewCollection ? collection : undefined,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        const messages: Record<string, string> = {
          INVITE_ALREADY_ACCEPTED: s.errorAlreadyAccepted,
          USERNAME_MISMATCH: s.errorUsernameMismatch,
          INVITE_EXPIRED: s.errorExpired,
          NOT_AUTHENTICATED: s.errorNotAuthenticated,
          USER_BANNED: s.errorBanned,
          NOT_YOUR_TURN: s.errorNotYourTurn,
          CHAIN_DEAD: s.errorChainDead,
          COLLECTION_CLOSED: s.errorChainDead,
          COLLECTION_NOT_STARTED: s.errorNotStarted,
          NOT_ADMIN: s.errorNotAdmin,
          COLLECTION_NAME_REQUIRED: t(locale).collection.nameRequired,
        };
        setError(messages[json.error as string] ?? json.error ?? s.errorGeneric);
        return;
      }

      router.push(`/card/${json.id}`);
    } catch {
      setError(s.errorConnection);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-blueprint-grid relative min-h-screen w-full overflow-x-hidden px-4 pt-28 pb-10 sm:px-8 sm:pt-24">
      {/* Authkit Ambient background glows */}
      <div aria-hidden className="ambient-blue-aura" />
      <div aria-hidden className="ambient-blueprint-aura" />

      <header className="relative z-10 mx-auto mb-12 max-w-4xl text-center">
        <p className="font-mono text-[19px] tracking-[-0.03em] text-bone uppercase">
          {parentCard ? s.titleAccept : s.titleNew}
        </p>
        {parentCard && (
          <p className="mt-2 text-sm text-ash">
            {s.invitedBy(parentCard.firstName, parentCard.lastName, parentCard.xUsername)}
          </p>
        )}
        <p className="mt-2 text-[15px] text-ash">{s.instructions}</p>

        <p className="mt-1 text-[13px] text-iron">{s.expiryNote(inviteExpiryHours)}</p>
      </header>


      <main className="relative z-10 mx-auto grid max-w-6xl min-w-0 gap-8 lg:grid-cols-[380px_1fr]">

        <div className="space-y-6">
          <CardForm data={data} onChange={setData} locale={locale} lockedUsername={lockedUsername} />
          {isNewCollection && (
            <CollectionSettingsForm
              value={collection}
              onChange={setCollection}
              locale={locale}
            />
          )}
        </div>

        <section className="flex min-w-0 flex-col items-center gap-6">
          <div className="metallic-panel flex rounded-full p-1">
            <button
              onClick={() => setTab("card")}
              className={`rounded-full px-5 py-2 font-mono text-xs tracking-wider transition ${
                tab === "card"
                  ? "btn-metallic-silver"
                  : "text-smoke hover:text-bone"
              }`}
            >
              {tab === "card" ? `[${s.tabCard}]` : s.tabCard}
            </button>
            <button
              onClick={() => setTab("chain")}
              className={`rounded-full px-5 py-2 font-mono text-xs tracking-wider transition ${
                tab === "chain"
                  ? "btn-metallic-silver"
                  : "text-smoke hover:text-bone"
              }`}
            >
              {tab === "chain" ? `[${s.tabChain}]` : s.tabChain}
            </button>
          </div>

          <div className="metallic-panel w-full max-w-full rounded-[22px] p-4 sm:p-10">
            {/* Sadece aktif sekme render edilir — gizli sekmenin ölçüsü
                alınamadığı için ölçekleme yanlış çıkıyordu. */}
            {tab === "card" && (
              <div className="mockup-stage pt-4 pb-28">
                <FitToWidth designWidth={400}>
                  <div className="mockup-reflect">
                    <GradedCard data={data} cardNumber={nextPosition} locale={locale} />
                  </div>
                </FitToWidth>
              </div>
            )}
            {tab === "chain" && (
              <div className="mx-auto w-full max-w-[720px]">
                <FitToWidth designWidth={1200}>
                  <ChainShareGraphic data={data} locale={locale} />
                </FitToWidth>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-metallic-silver w-full max-w-md rounded-full px-5 py-4 text-[15px] tracking-[-0.01em] disabled:opacity-50"
          >
            {isSaving ? s.saving : parentCard ? s.saveAccept : s.saveNew}
          </button>

        </section>
      </main>
    </div>
  );
}
