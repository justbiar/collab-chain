import { notFound } from "next/navigation";
import { getCardById } from "@/lib/chain";
import { getLocale } from "@/lib/i18n";
import { CardProfileClient } from "./CardProfileClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CardPage({ params }: PageProps) {
  const [{ id }, locale] = await Promise.all([params, getLocale()]);
  const cardId = Number(id);
  if (!Number.isInteger(cardId)) notFound();

  const card = await getCardById(cardId);
  if (!card) notFound();

  return <CardProfileClient card={card} locale={locale} />;
}
