import { notFound } from "next/navigation";
import { getCardById, getCardPosition } from "@/lib/chain";
import { getLocale } from "@/lib/i18n";
import { auth } from "@/auth";
import { CardProfileClient } from "./CardProfileClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CardPage({ params }: PageProps) {
  const [{ id }, locale, session] = await Promise.all([params, getLocale(), auth()]);
  const cardId = Number(id);
  if (!Number.isInteger(cardId)) notFound();

  const card = await getCardById(cardId);
  if (!card) notFound();

  // Tweet'i yalnızca kartın sahibi iliştirebilir; API de aynı kontrolü yapar.
  const isOwner =
    (session?.user?.username ?? "").toLowerCase() === card.xUsername.toLowerCase() &&
    Boolean(session?.user?.username);

  // Kart numarası zincirdeki sıradır, veritabanı id'si değil.
  const position = await getCardPosition(card);

  return (
    <CardProfileClient
      card={card}
      position={position}
      locale={locale}
      isOwner={isOwner}
    />
  );
}
