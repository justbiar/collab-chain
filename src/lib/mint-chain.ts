import { base, baseSepolia } from "wagmi/chains";

/**
 * Aktif mint ağı — tek yerden kontrol edilir. Mainnet'e geçiş
 * NEXT_PUBLIC_MINT_NETWORK=base yapılıp yeni bir kontrat adresi
 * girilmesinden ibaret, kod tarafında değişiklik gerekmez.
 */
export const MINT_NETWORK: "baseSepolia" | "base" =
  process.env.NEXT_PUBLIC_MINT_NETWORK === "base" ? "base" : "baseSepolia";

export const mintChain = MINT_NETWORK === "base" ? base : baseSepolia;

export const CHAIN_CARD_ADDRESS = process.env
  .NEXT_PUBLIC_CHAIN_CARD_ADDRESS as `0x${string}` | undefined;

export function explorerTxUrl(txHash: string): string {
  const base = MINT_NETWORK === "base" ? "https://basescan.org" : "https://sepolia.basescan.org";
  return `${base}/tx/${txHash}`;
}

export const CHAIN_CARD_ABI = [
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "cardId", type: "uint256" },
      { name: "uri", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
] as const;
