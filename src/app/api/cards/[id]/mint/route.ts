import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { auth } from "@/auth";
import { getCardById, setCardMinted, ChainError, chainErrorStatus } from "@/lib/chain";
import { enforceWriteRateLimit } from "@/lib/rate-limit";
import { getAppUrl } from "@/lib/site-url";
import { CHAIN_CARD_ABI, CHAIN_CARD_ADDRESS, MINT_NETWORK, mintChain } from "@/lib/mint-chain";

/**
 * Kartı Base'de NFT olarak mint eder. Gaz kullanıcıdan değil, uygulamanın
 * kendi relayer cüzdanından (MINTER_PRIVATE_KEY) gider — kullanıcı sadece
 * NFT'nin gideceği adresi bağlamış olmalı (bkz. [id]/wallet/route.ts).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cardId = Number(id);
  if (!Number.isInteger(cardId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const session = await auth();
  const sessionHandle = session?.user?.username?.toLowerCase();
  if (!sessionHandle) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }

  const rateLimited = await enforceWriteRateLimit(req, sessionHandle);
  if (rateLimited) return rateLimited;

  const card = await getCardById(cardId);
  if (!card) {
    return NextResponse.json({ error: "CARD_NOT_FOUND" }, { status: 404 });
  }
  if (card.xUsername.toLowerCase() !== sessionHandle) {
    return NextResponse.json({ error: "NOT_CARD_OWNER" }, { status: 403 });
  }
  if (card.nftTxHash) {
    return NextResponse.json({ error: "ALREADY_MINTED" }, { status: 409 });
  }
  if (!card.walletAddress) {
    return NextResponse.json({ error: "WALLET_REQUIRED" }, { status: 400 });
  }

  const minterKey = process.env.MINTER_PRIVATE_KEY;
  if (!CHAIN_CARD_ADDRESS || !minterKey) {
    return NextResponse.json({ error: "MINTING_NOT_CONFIGURED" }, { status: 503 });
  }

  const account = privateKeyToAccount(minterKey as `0x${string}`);
  const walletClient = createWalletClient({ account, chain: mintChain, transport: http() });
  const publicClient = createPublicClient({ chain: mintChain, transport: http() });

  const tokenUri = `${getAppUrl()}/api/cards/${cardId}/metadata`;

  try {
    const txHash = await walletClient.writeContract({
      address: CHAIN_CARD_ADDRESS,
      abi: CHAIN_CARD_ABI,
      functionName: "mint",
      args: [card.walletAddress as `0x${string}`, BigInt(cardId), tokenUri],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    if (receipt.status !== "success") {
      return NextResponse.json({ error: "MINT_REVERTED" }, { status: 502 });
    }

    const updated = await setCardMinted(cardId, { nftChain: MINT_NETWORK, nftTxHash: txHash });
    return NextResponse.json({ nftChain: updated.nftChain, nftTxHash: updated.nftTxHash });
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    console.error("mint failed", err);
    return NextResponse.json({ error: "MINT_FAILED" }, { status: 502 });
  }
}
