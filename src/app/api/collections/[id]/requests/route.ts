import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { requestToJoin, cancelJoinRequest, ChainError, chainErrorStatus } from "@/lib/chain";
import { enforceWriteRateLimit } from "@/lib/rate-limit";

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
}

/** Bu koleksiyona katılma isteği gönderir. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const collectionId = parseId(id);
  if (collectionId == null) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const session = await auth();
  const handle = session?.user?.username;
  if (!handle) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }

  const rateLimited = await enforceWriteRateLimit(req, handle);
  if (rateLimited) return rateLimited;

  try {
    await requestToJoin(collectionId, handle);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}

/** Kendi katılma isteğini geri çeker. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const collectionId = parseId(id);
  if (collectionId == null) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const session = await auth();
  const handle = session?.user?.username;
  if (!handle) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }

  const rateLimited = await enforceWriteRateLimit(req, handle);
  if (rateLimited) return rateLimited;

  await cancelJoinRequest(collectionId, handle);
  return NextResponse.json({ ok: true });
}
