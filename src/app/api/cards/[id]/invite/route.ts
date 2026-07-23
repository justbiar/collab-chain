import { NextRequest, NextResponse } from "next/server";
import { renewInvite, ChainError, chainErrorStatus } from "@/lib/chain";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cardId = Number(id);
  if (!Number.isInteger(cardId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const body = (await req.json()) as { targetUsername?: string };
  if (!body.targetUsername?.trim()) {
    return NextResponse.json(
      { error: "Hedef kullanıcı adı zorunludur." },
      { status: 400 }
    );
  }

  try {
    const card = await renewInvite(cardId, body.targetUsername);
    return NextResponse.json(card);
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}
