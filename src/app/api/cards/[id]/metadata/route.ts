import { NextRequest, NextResponse } from "next/server";
import { getCardById, getCardPosition, findRoot, collectionTitle } from "@/lib/chain";
import { getAppUrl } from "@/lib/site-url";
import { displayHandle } from "@/lib/handle";

/**
 * ERC-721 `tokenURI` buraya işaret eder — NFT metadata standardına uygun
 * JSON döner. Token id her zaman Card.id ile aynı (bkz. ChainCard.sol).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cardId = Number(id);
  if (!Number.isInteger(cardId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const card = await getCardById(cardId);
  if (!card) {
    return NextResponse.json({ error: "CARD_NOT_FOUND" }, { status: 404 });
  }

  const root = await findRoot(card);
  const position = await getCardPosition(card);
  const appUrl = getAppUrl();

  return NextResponse.json({
    name: `${card.firstName} ${card.lastName}`.trim() || `@${displayHandle(card.xUsername)}`,
    description: card.bio || `${collectionTitle(root)} zincirinde #${position}.`,
    image: card.profileImageUrl || `${appUrl}/icon-512.png`,
    external_url: `${appUrl}/card/${card.id}`,
    attributes: [
      { trait_type: "Collection", value: collectionTitle(root) },
      { trait_type: "Position", value: position },
      { trait_type: "Role", value: card.role || "—" },
      { trait_type: "Handle", value: `@${displayHandle(card.xUsername)}` },
    ],
  });
}
