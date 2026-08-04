import { createConfig, http } from "wagmi";
import { base, baseSepolia, hardhat } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

/**
 * Base Sepolia (test) ve Base (mainnet) hedefleniyor; `hardhat` sadece
 * `npx hardhat node` ile açılan yerel ağa karşı geliştirirken kullanılır —
 * production'da hiçbir zaman seçilmez (bkz. lib/mint-chain.ts).
 */
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base, hardhat],
  connectors: [coinbaseWallet({ appName: "Collab Chain" }), injected()],
  transports: {
    [baseSepolia.id]: http(),
    [base.id]: http(),
    [hardhat.id]: http(),
  },
});
