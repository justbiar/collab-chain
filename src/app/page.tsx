import Link from "next/link";
import { getAllChains, INVITE_EXPIRY_HOURS } from "@/lib/chain";
import { ChainRow } from "@/components/ChainRow";

export const dynamic = "force-dynamic";

export default async function Home() {
  const chains = await getAllChains();
  const totalCards = chains.reduce((sum, chain) => sum + chain.length, 0);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-carbon px-4 py-10 sm:px-8">
      <header className="mx-auto mb-16 max-w-2xl text-center">
        <p className="text-[19px] leading-[1.2] tracking-[-0.03em] text-ash">
          WEB3 CHAIN CARD
        </p>
        <p className="mt-2 text-[40px] font-[450] leading-[1] tracking-[-0.04em] text-bone sm:text-[53px] sm:tracking-[-0.06em]">
          {totalCards > 0 ? `${totalCards} Kişi Zincirde` : "Zinciri Başlat"}
        </p>
        <p className="mt-4 text-[15px] text-smoke">
          {totalCards > 0
            ? "Birinin seni etiketlediği davet linkiyle zincire katıl, ya da kendi zincirini başlat."
            : "Zincirin ilk halkası sen ol. Kartını oluştur ve daveti başlat."}
        </p>
        <Link
          href="/create"
          className="mt-8 inline-block rounded-full bg-bone px-8 py-4 text-[15px] font-[500] tracking-[-0.02em] text-carbon transition hover:bg-ash"
        >
          Zincir Başlat
        </Link>

        <div className="mx-auto mt-8 max-w-sm rounded-[17.6px] border border-bone/10 p-5 text-left">
          <p className="text-[11px] tracking-[0.15em] text-iron">KURALLAR</p>
          <ul className="mt-2.5 list-disc space-y-1.5 pl-4 text-[13px] text-smoke">
            <li>Her kart zincirde sadece bir sonraki kişiyi davet edebilir.</li>
            <li>
              Davet edilen kişinin kabul etmesi için {INVITE_EXPIRY_HOURS} saati
              vardır.
            </li>
            <li>
              Süre dolarsa davet sahibi farklı birini etiketleyip daveti
              yenileyebilir.
            </li>
          </ul>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8">
        {chains.length === 0 ? (
          <p className="text-center text-[15px] text-iron">
            Henüz kimse zincire katılmadı. İlk kartı sen oluştur!
          </p>
        ) : (
          chains.map((chain) => <ChainRow key={chain[0].id} cards={chain} />)
        )}
      </main>
    </div>
  );
}
