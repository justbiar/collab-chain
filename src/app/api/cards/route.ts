import { NextRequest, NextResponse } from "next/server";
import { createCard, ChainError, chainErrorStatus } from "@/lib/chain";
import { auth } from "@/auth";
import { canStartGenesis } from "@/lib/genesis";
import { enforceWriteRateLimit } from "@/lib/rate-limit";
import { CardData } from "@/lib/types";

interface CreateCardBody extends CardData {
  parentId?: number | null;
  collection?: {
    name?: string;
    description?: string;
    coverImageUrl?: string | null;
    mode?: string;
    deadlineAt?: string;
    memberLimit?: string;
    startsAt?: string;
  };
}

/** Formdan gelen `datetime-local` metnini geçerli bir tarihe çevirir. */
function parseDate(value: string | undefined): Date | null {
  if (!value?.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseLimit(value: string | undefined): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n >= 2 ? n : null;
}

export async function POST(req: NextRequest) {
  // Kart oluşturmanın her yolu doğrulanmış X oturumu ister. Oturum body
  // parse edilmeden önce kontrol edilir — aksi halde oturumu olmayan biri
  // bile sınırsız büyüklükte bir gövdeyi sunucuya işletebilirdi.
  const session = await auth();
  const xUsername = session?.user?.username;
  if (!xUsername) {
    return NextResponse.json({ error: "NOT_AUTHENTICATED" }, { status: 401 });
  }

  const rateLimited = await enforceWriteRateLimit(req, xUsername);
  if (rateLimited) return rateLimited;

  const body = (await req.json()) as Partial<CreateCardBody>;
  const parentId = body.parentId ?? null;

  // Kullanıcı adı daima oturumdan alınır; client'ın gönderdiği xUsername
  // yok sayılır ki kimse başkasının adına kart açamasın.

  // Davetsiz yeni zincir başlatmak sadece admin hesabına açık. Bu kontrol
  // /create sayfasında da var ama orası yalnızca arayüz — asıl kapı burası.
  if (parentId == null && !(await canStartGenesis(xUsername))) {
    return NextResponse.json({ error: "NOT_ADMIN" }, { status: 403 });
  }

  if (!body.firstName?.trim()) {
    return NextResponse.json(
      { error: "İsim ve X kullanıcı adı zorunludur." },
      { status: 400 }
    );
  }

  // Yeni koleksiyon kurucunun adıyla değil, kendi adıyla anılır.
  if (parentId == null && !body.collection?.name?.trim()) {
    return NextResponse.json({ error: "COLLECTION_NAME_REQUIRED" }, { status: 400 });
  }

  try {
    const card = await createCard({
      firstName: body.firstName,
      lastName: body.lastName ?? "",
      xUsername,
      role: body.role ?? "",
      skills: body.skills ?? "",
      bio: body.bio ?? "",
      profileImageUrl: body.profileImageUrl ?? null,
      logoImageUrl: body.logoImageUrl ?? null,
      targetUsername: body.targetUsername ?? "",
      targetReason: body.targetReason ?? "",
      parentId,
      // Ayarlar sadece yeni koleksiyon açılırken dikkate alınır.
      collection:
        parentId == null
          ? {
              name: body.collection?.name,
              description: body.collection?.description,
              coverImageUrl: body.collection?.coverImageUrl,
              completionMode: body.collection?.mode,
              deadlineAt: parseDate(body.collection?.deadlineAt),
              memberLimit: parseLimit(body.collection?.memberLimit),
              startsAt: parseDate(body.collection?.startsAt),
            }
          : undefined,
    });

    return NextResponse.json({ id: card.id });
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}
