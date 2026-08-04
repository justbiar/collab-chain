import { NextRequest, NextResponse } from "next/server";
import { listGenesisGrants, grantGenesis } from "@/lib/genesis";
import { enforceWriteRateLimit } from "@/lib/rate-limit";
import { requireSuperAdmin } from "@/lib/require-super-admin";

/** Genesis yetkisi verilmiş hesapların listesi. Sadece süper admin görebilir. */
export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const grants = await listGenesisGrants();
  return NextResponse.json({
    grants: grants.map((g) => ({ xUsername: g.xUsername, grantedAt: g.grantedAt })),
  });
}

/** Bir X hesabına davetsiz koleksiyon başlatma yetkisi verir. Sadece süper admin. */
export async function POST(req: NextRequest) {
  const { username, error } = await requireSuperAdmin();
  if (error) return error;

  const rateLimited = await enforceWriteRateLimit(req, username);
  if (rateLimited) return rateLimited;

  const body = (await req.json().catch(() => ({}))) as { username?: string };
  const target = (body.username ?? "").replace(/^@/, "").trim();
  if (!target) {
    return NextResponse.json({ error: "USERNAME_REQUIRED" }, { status: 400 });
  }

  const grant = await grantGenesis(target);
  return NextResponse.json({ xUsername: grant.xUsername, grantedAt: grant.grantedAt });
}
