import { notFound } from "next/navigation";
import { getCardById } from "@/lib/chain";
import { CardProfileClient } from "./CardProfileClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CardPage({ params }: PageProps) {
  const { id } = await params;
  const cardId = Number(id);
  if (!Number.isInteger(cardId)) notFound();

  const card = await getCardById(cardId);
  if (!card) notFound();

  return <CardProfileClient card={card} />;
}
