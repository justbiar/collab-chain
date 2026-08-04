import { NextRequest, NextResponse } from "next/server";
import { isAddress } from "viem";
import { auth } from "@/auth";
import { getCardById, setCardWallet, ChainError, chainErrorStatus } from "@/lib/chain";
import { enforceWriteRateLimit } from "@/lib/rate-limit";

/** Kartın NFT'sinin gideceği cüzdanı bağlar/günceller — sadece kart sahibi. */
export async function PATCH(
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

  const body = (await req.json()) as { walletAddress?: string };
  if (!body.walletAddress || !isAddress(body.walletAddress)) {
    return NextResponse.json({ error: "INVALID_WALLET_ADDRESS" }, { status: 400 });
  }

  try {
    const updated = await setCardWallet(cardId, body.walletAddress);
    return NextResponse.json({ walletAddress: updated.walletAddress });
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}
