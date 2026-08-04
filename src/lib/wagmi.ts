import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

/**
 * Şimdilik sadece Base Sepolia (test ağı) hedefleniyor — mainnet'e (base)
 * geçiş ayrı bir onayla yapılacak, ama zinciri baştan desteklemek geçişi
 * tek satırlık bir env değişikliğine indiriyor (bkz. lib/mint-chain.ts).
 */
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [coinbaseWallet({ appName: "Collab Chain" }), injected()],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
  },
});
