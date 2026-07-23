import { NextRequest, NextResponse } from "next/server";
import { createCard, ChainError, chainErrorStatus } from "@/lib/chain";
import { CardData } from "@/lib/types";

interface CreateCardBody extends CardData {
  parentId?: number | null;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<CreateCardBody>;

  if (!body.firstName?.trim() || !body.xUsername?.trim()) {
    return NextResponse.json(
      { error: "İsim ve X kullanıcı adı zorunludur." },
      { status: 400 }
    );
  }

  try {
    const card = await createCard({
      firstName: body.firstName,
      lastName: body.lastName ?? "",
      xUsername: body.xUsername,
      role: body.role ?? "",
      skills: body.skills ?? "",
      profileImageUrl: body.profileImageUrl ?? null,
      logoImageUrl: body.logoImageUrl ?? null,
      targetUsername: body.targetUsername ?? "",
      parentId: body.parentId ?? null,
    });

    return NextResponse.json({ id: card.id });
  } catch (err) {
    if (err instanceof ChainError) {
      return NextResponse.json({ error: err.message }, { status: chainErrorStatus(err) });
    }
    throw err;
  }
}
