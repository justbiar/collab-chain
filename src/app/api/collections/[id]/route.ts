import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  cancelCollection,
  completeCollection,
  deleteCollection,
  removeMember,
  ChainError,
  chainErrorStatus,
} from "@/lib/chain";
import { enforceWriteRateLimit } from "@/lib/rate-limit";

type AdminAction = "complete" | "cancel" | "remove";

interface Body {
  action?: AdminAction;
  /** remove için: zincirden çıkarılacak kartın id'si. */
  memberId?: number;
}

async function requireSession() {
  const session = await auth();
  const handle = session?.user?.username;
  if (!handle) {
    return { handle: null, error: NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 }) };
  }
  return { handle, error: null };
}

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
}

/** Koleksiyonu tamamla / iptal et / bir üyeyi çıkar. Sadece yönetici. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const collectionId = parseId(id);
  if (collectionId == null) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const { handle, error } = await requireSession();
  if (error) return error;

  const rateLimited = await enforceWriteRateLimit(req, handle);
  if (rateLimited) return rateLimited;

  const body = (await req.json()) as Body;

  try {
    switch (body.action) {
      case "complete":
        return NextResponse.json({ status: (await completeCollection(collectionId, handle)).chainStatus });

      case "cancel":
        return NextResponse.json({ status: (await cancelCollection(collectionId, handle)).chainStatus });

      case "remove": {
        if (!Number.isInteger(body.memberId)) {
          return NextResponse.json({ error: "MEMBER_NOT_FOUND" }, { status: 400 });
        }
        const removed = await removeMember(collectionId, body.memberId as number, handle);
        return NextResponse.json({ removed });
      }

      default:
        return NextResponse.json({ error: "UNKNOWN_ACTION" }, { status: 400 });
    }
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}

/** Koleksiyonu ve tüm kartlarını kalıcı olarak siler. Sadece yönetici. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const collectionId = parseId(id);
  if (collectionId == null) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const { handle, error } = await requireSession();
  if (error) return error;

  const rateLimited = await enforceWriteRateLimit(req, handle);
  if (rateLimited) return rateLimited;

  try {
    return NextResponse.json({ deleted: await deleteCollection(collectionId, handle) });
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}
