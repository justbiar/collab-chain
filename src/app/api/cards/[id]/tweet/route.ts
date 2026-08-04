import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCardById, setCardTweet, ChainError, chainErrorStatus } from "@/lib/chain";
import { enforceWriteRateLimit } from "@/lib/rate-limit";
import { parseTweetUrl } from "@/lib/tweet";

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
  // Tweet'i sadece kartın sahibi iliştirebilir.
  if (card.xUsername.toLowerCase() !== sessionHandle) {
    return NextResponse.json({ error: "NOT_CARD_OWNER" }, { status: 403 });
  }

  const body = (await req.json()) as { tweetUrl?: string | null };
  const raw = body.tweetUrl?.trim() ?? "";

  // Boş gönderim tweet'i kaldırır.
  if (!raw) {
    const updated = await setCardTweet(cardId, null);
    return NextResponse.json({ tweetUrl: updated.tweetUrl });
  }

  const parsed = parseTweetUrl(raw);
  if (!parsed) {
    return NextResponse.json({ error: "INVALID_TWEET_URL" }, { status: 400 });
  }

  try {
    const updated = await setCardTweet(cardId, parsed.url);
    return NextResponse.json({ tweetUrl: updated.tweetUrl });
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}
