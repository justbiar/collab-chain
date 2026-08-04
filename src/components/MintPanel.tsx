"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { Locale, t } from "@/lib/dictionary";
import { mintChain, explorerTxUrl } from "@/lib/mint-chain";

interface MintPanelProps {
  cardId: number;
  isOwner: boolean;
  walletAddress: string | null;
  nftTxHash: string | null;
  locale: Locale;
}

/** Kartın Base'de NFT olarak mint edilmesini yöneten panel — sadece kart sahibi görür. */
export function MintPanel({ cardId, isOwner, walletAddress, nftTxHash, locale }: MintPanelProps) {
  const router = useRouter();
  const s = t(locale).mint;
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOwner && !nftTxHash) return null;

  if (nftTxHash) {
    return (
      <div className="metallic-panel flex w-full max-w-md flex-col items-center gap-3 rounded-[22px] p-6 text-center">
        <p className="font-mono text-[11px] tracking-[0.2em] text-smoke">{s.title}</p>
        <p className="text-[13px] text-ash">{s.minted}</p>
        <a
          href={explorerTxUrl(nftTxHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-metallic-silver rounded-full px-5 py-2 text-[13px] font-[500]"
        >
          {s.viewOnExplorer}
        </a>
      </div>
    );
  }

  if (!isOwner) return null;

  const handleMint = async () => {
    if (!address) return;
    setIsMinting(true);
    setError(null);
    try {
      if (address.toLowerCase() !== (walletAddress ?? "").toLowerCase()) {
        const walletRes = await fetch(`/api/cards/${cardId}/wallet`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ walletAddress: address }),
        });
        if (!walletRes.ok) {
          const json = await walletRes.json().catch(() => ({}));
          setError(json.error ?? s.errorGeneric);
          return;
        }
      }

      const mintRes = await fetch(`/api/cards/${cardId}/mint`, { method: "POST" });
      const json = await mintRes.json().catch(() => ({}));
      if (!mintRes.ok) {
        setError(
          json.error === "MINTING_NOT_CONFIGURED" ? s.errorNotConfigured : (json.error ?? s.errorGeneric)
        );
        return;
      }
      router.refresh();
    } catch {
      setError(s.errorConnection);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="metallic-panel flex w-full max-w-md flex-col items-center gap-3 rounded-[22px] p-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.2em] text-smoke">{s.title}</p>
      <p className="text-[13px] leading-snug text-ash">{s.hint}</p>

      {!isConnected && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isConnecting}
              className="btn-metallic-ghost rounded-full px-4 py-2 text-[13px] disabled:opacity-50"
            >
              {isConnecting ? s.connecting : `${s.connect} (${connector.name})`}
            </button>
          ))}
        </div>
      )}

      {isConnected && address && (
        <div className="flex w-full flex-col items-center gap-2">
          <p className="font-mono text-[11px] text-smoke">
            {address.slice(0, 6)}…{address.slice(-4)}
          </p>

          {chainId !== mintChain.id ? (
            <button
              onClick={() => switchChain({ chainId: mintChain.id })}
              className="btn-metallic-ghost rounded-full px-4 py-2 text-[13px]"
            >
              {s.switchNetwork(mintChain.name)}
            </button>
          ) : (
            <button
              onClick={handleMint}
              disabled={isMinting}
              className="btn-metallic-silver rounded-full px-5 py-2 text-[13px] font-[500] disabled:opacity-50"
            >
              {isMinting ? s.minting : s.mintButton}
            </button>
          )}

          <button onClick={() => disconnect()} className="text-[11px] text-smoke underline">
            {s.disconnect}
          </button>
        </div>
      )}

      {error && <p className="text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
