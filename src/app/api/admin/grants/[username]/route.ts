import { NextRequest, NextResponse } from "next/server";
import { revokeGenesis } from "@/lib/genesis";
import { enforceWriteRateLimit } from "@/lib/rate-limit";
import { requireSuperAdmin } from "@/lib/require-super-admin";

/** Bir X hesabından genesis yetkisini alır. Sadece süper admin. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username: target } = await params;
  const { username, error } = await requireSuperAdmin();
  if (error) return error;

  const rateLimited = await enforceWriteRateLimit(req, username);
  if (rateLimited) return rateLimited;

  await revokeGenesis(decodeURIComponent(target));
  return NextResponse.json({ ok: true });
}
