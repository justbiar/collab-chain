import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCardById, setCardCast, ChainError, chainErrorStatus } from "@/lib/chain";
import { enforceWriteRateLimit } from "@/lib/rate-limit";
import { parseCastUrl } from "@/lib/cast";

/** `[id]/tweet/route.ts`'in Farcaster eşdeğeri. */
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
  // Cast'i sadece kartın sahibi iliştirebilir.
  if (card.xUsername.toLowerCase() !== sessionHandle) {
    return NextResponse.json({ error: "NOT_CARD_OWNER" }, { status: 403 });
  }

  const body = (await req.json()) as { castUrl?: string | null };
  const raw = body.castUrl?.trim() ?? "";

  // Boş gönderim cast'i kaldırır.
  if (!raw) {
    const updated = await setCardCast(cardId, null);
    return NextResponse.json({ castUrl: updated.castUrl });
  }

  const parsed = parseCastUrl(raw);
  if (!parsed) {
    return NextResponse.json({ error: "INVALID_CAST_URL" }, { status: 400 });
  }

  try {
    const updated = await setCardCast(cardId, parsed.url);
    return NextResponse.json({ castUrl: updated.castUrl });
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}
