import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCardById, renewInvite, ChainError, chainErrorStatus } from "@/lib/chain";
import { enforceWriteRateLimit } from "@/lib/rate-limit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cardId = Number(id);
  if (!Number.isInteger(cardId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  // Daveti yalnızca kartın sahibi yenileyebilir; aksi halde herkes
  // başkasının davetini istediği kişiye yönlendirebilirdi.
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

  const body = (await req.json()) as { targetUsername?: string };
  if (!body.targetUsername?.trim()) {
    return NextResponse.json(
      { error: "Hedef kullanıcı adı zorunludur." },
      { status: 400 }
    );
  }

  try {
    const updated = await renewInvite(cardId, body.targetUsername);
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}
