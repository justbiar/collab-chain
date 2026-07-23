"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CardForm } from "@/components/CardForm";
import { GradedCard } from "@/components/GradedCard";
import { ChainShareGraphic } from "@/components/ChainShareGraphic";
import { CardData, EMPTY_CARD_DATA } from "@/lib/types";
import type { Card } from "@/generated/prisma/client";

type Tab = "card" | "chain";

interface CreateClientProps {
  parentId: number | null;
  parentCard: Card | null;
  inviteError: string | null;
  inviteExpiryHours: number;
}

export function CreateClient({
  parentId,
  parentCard,
  inviteError,
  inviteExpiryHours,
}: CreateClientProps) {
  const router = useRouter();
  const lockedUsername = parentCard?.targetUsername ?? null;
  const [data, setData] = useState<CardData>(() =>
    lockedUsername ? { ...EMPTY_CARD_DATA, xUsername: lockedUsername } : EMPTY_CARD_DATA
  );
  const [tab, setTab] = useState<Tab>("card");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (inviteError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-carbon px-4 text-center">
        <p className="text-lg font-[450] text-bone">{inviteError}</p>
        <Link href="/" className="text-smoke underline">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    if (!data.firstName.trim() || !data.xUsername.trim()) {
      setError("İsim ve X kullanıcı adı zorunludur.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, parentId }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(
          json.error === "INVITE_ALREADY_ACCEPTED"
            ? "Bu davet başkası tarafından kabul edilmiş."
            : json.error === "USERNAME_MISMATCH"
              ? "Bu davet sadece davet edilen X hesabıyla kabul edilebilir."
              : json.error === "INVITE_EXPIRED"
                ? "Bu davetin süresi doldu."
                : json.error === "NOT_AUTHENTICATED"
                  ? "Oturumun sona ermiş, sayfayı yenileyip tekrar X ile giriş yap."
                  : json.error ?? "Bir hata oluştu."
        );
        return;
      }

      router.push(`/card/${json.id}`);
    } catch {
      setError("Bağlantı hatası, tekrar dene.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-carbon px-4 py-10 sm:px-8">
      <header className="mx-auto mb-8 max-w-6xl text-center">
        <p className="text-[19px] tracking-[-0.03em] text-ash">
          {parentCard ? "ZİNCİRE KATIL" : "KARTINI OLUŞTUR"}
        </p>
        {parentCard && (
          <p className="mt-3 text-sm text-smoke">
            🎉 {parentCard.firstName} {parentCard.lastName} (@{parentCard.xUsername})
            seni zincire davet etti!
          </p>
        )}
        <p className="mt-2 text-[15px] text-iron">
          Bilgilerini doldur, kartını oluştur ve zinciri devam ettir.
        </p>
        <p className="mt-1 text-[13px] text-iron">
          Etiketlediğin kişinin daveti kabul etmesi için {inviteExpiryHours} saati
          olacak.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl min-w-0 gap-8 lg:grid-cols-[380px_1fr]">
        <CardForm data={data} onChange={setData} lockedUsername={lockedUsername} />

        <section className="flex min-w-0 flex-col items-center gap-6">
          <div className="flex rounded-full border border-bone/10 p-1">
            <button
              onClick={() => setTab("card")}
              className={`rounded-full px-5 py-2 text-xs tracking-wider transition ${
                tab === "card"
                  ? "bg-bone text-carbon"
                  : "text-iron hover:text-bone"
              }`}
            >
              KOLEKSIYON KARTI
            </button>
            <button
              onClick={() => setTab("chain")}
              className={`rounded-full px-5 py-2 text-xs tracking-wider transition ${
                tab === "chain"
                  ? "bg-bone text-carbon"
                  : "text-iron hover:text-bone"
              }`}
            >
              ZİNCİR PAYLAŞIMI
            </button>
          </div>

          <div className="w-full max-w-full overflow-x-auto rounded-[17.6px] border border-bone/10 bg-carbon p-6 sm:p-10">
            <div className={tab === "card" ? "flex justify-center" : "hidden"}>
              <GradedCard data={data} cardNumber={1} />
            </div>
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
                <ChainShareGraphic data={data} />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full max-w-md rounded-full bg-bone px-5 py-4 text-[15px] font-[500] tracking-[-0.02em] text-carbon transition hover:bg-ash disabled:opacity-50"
          >
            {isSaving
              ? "Kaydediliyor..."
              : parentCard
                ? "Kabul Et ve Kartımı Oluştur"
                : "Kartımı Oluştur ve Zincire Katıl"}
          </button>
        </section>
      </main>
    </div>
  );
}
