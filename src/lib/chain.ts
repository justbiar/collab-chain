import { prisma } from "@/lib/prisma";
import { CardData } from "@/lib/types";
import { isInviteExpired, expiryDate } from "@/lib/invite";
import type { Card } from "@/generated/prisma/client";

export { INVITE_EXPIRY_HOURS, isInviteExpired, hoursRemaining } from "@/lib/invite";

export class ChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChainError";
  }
}

const CHAIN_ERROR_STATUS: Record<string, number> = {
  PARENT_NOT_FOUND: 404,
  CARD_NOT_FOUND: 404,
  USERNAME_MISMATCH: 403,
  TARGET_REQUIRED: 400,
  INVITE_ALREADY_ACCEPTED: 409,
  INVITE_EXPIRED: 410,
};

export function chainErrorStatus(err: ChainError): number {
  return CHAIN_ERROR_STATUS[err.message] ?? 409;
}

interface CreateCardInput extends CardData {
  parentId?: number | null;
}

export async function cardCount(): Promise<number> {
  return prisma.card.count();
}

export async function createCard(input: CreateCardInput): Promise<Card> {
  const { parentId, ...data } = input;

  if (parentId != null) {
    const parent = await prisma.card.findUnique({
      where: { id: parentId },
      include: { children: true },
    });

    if (!parent) throw new ChainError("PARENT_NOT_FOUND");
    if (parent.inviteStatus === "accepted" || parent.children.length > 0) {
      throw new ChainError("INVITE_ALREADY_ACCEPTED");
    }
    if (isInviteExpired(parent)) {
      throw new ChainError("INVITE_EXPIRED");
    }

    const invitedHandle = (parent.targetUsername ?? "").toLowerCase();
    const submittedHandle = data.xUsername.replace(/^@/, "").trim().toLowerCase();
    if (!invitedHandle || invitedHandle !== submittedHandle) {
      throw new ChainError("USERNAME_MISMATCH");
    }
  }

  const targetUsername = data.targetUsername
    ? data.targetUsername.replace(/^@/, "").trim()
    : null;

  return prisma.$transaction(async (tx) => {
    const card = await tx.card.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        xUsername: data.xUsername.replace(/^@/, "").trim(),
        role: data.role,
        skills: data.skills,
        profileImageUrl: data.profileImageUrl || null,
        logoImageUrl: data.logoImageUrl || null,
        targetUsername,
        inviteStatus: "pending",
        inviteExpiresAt: targetUsername ? expiryDate() : null,
        parentId: parentId ?? null,
      },
    });

    if (parentId != null) {
      await tx.card.update({
        where: { id: parentId },
        data: { inviteStatus: "accepted" },
      });
    }

    return card;
  });
}

export async function renewInvite(cardId: number, newTargetUsername: string): Promise<Card> {
  const handle = newTargetUsername.replace(/^@/, "").trim();
  if (!handle) throw new ChainError("TARGET_REQUIRED");

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) throw new ChainError("CARD_NOT_FOUND");
  if (card.inviteStatus === "accepted") {
    throw new ChainError("INVITE_ALREADY_ACCEPTED");
  }

  return prisma.card.update({
    where: { id: cardId },
    data: {
      targetUsername: handle,
      inviteStatus: "pending",
      inviteExpiresAt: expiryDate(),
    },
  });
}

export function getCardById(id: number) {
  return prisma.card.findUnique({ where: { id } });
}

export async function getAllChains(): Promise<Card[][]> {
  const roots = await prisma.card.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "asc" },
  });

  const chains: Card[][] = [];
  for (const root of roots) {
    const chain: Card[] = [root];
    let current = root;
    while (true) {
      const child = await prisma.card.findFirst({
        where: { parentId: current.id },
        orderBy: { createdAt: "asc" },
      });
      if (!child) break;
      chain.push(child);
      current = child;
    }
    chains.push(chain);
  }
  return chains;
}
