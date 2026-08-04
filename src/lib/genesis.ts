import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/admin";
import { USERNAME_MAX } from "@/lib/types";
import type { GenesisGrant } from "@/generated/prisma/client";

function normalizeHandle(username: string): string {
  const handle = username.replace(/^@/, "").trim();
  return handle.length > USERNAME_MAX ? handle.slice(0, USERNAME_MAX) : handle;
}

/** Davetsiz yeni koleksiyon başlatabilir mi — süper admin ya da yetki verilmiş biri. */
export async function canStartGenesis(username: string | null | undefined): Promise<boolean> {
  if (isSuperAdmin(username)) return true;

  const handle = normalizeHandle(username ?? "");
  if (!handle) return false;

  const grant = await prisma.genesisGrant.findFirst({
    where: { xUsername: { equals: handle, mode: "insensitive" } },
  });
  return grant !== null;
}

export function listGenesisGrants(): Promise<GenesisGrant[]> {
  return prisma.genesisGrant.findMany({ orderBy: { grantedAt: "desc" } });
}

export async function grantGenesis(username: string): Promise<GenesisGrant> {
  const handle = normalizeHandle(username);
  if (!handle) throw new Error("USERNAME_REQUIRED");

  return prisma.genesisGrant.upsert({
    where: { xUsername: handle },
    update: {},
    create: { xUsername: handle },
  });
}

export async function revokeGenesis(username: string): Promise<void> {
  const handle = normalizeHandle(username);
  if (!handle) return;
  await prisma.genesisGrant.deleteMany({
    where: { xUsername: { equals: handle, mode: "insensitive" } },
  });
}
