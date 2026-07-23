import { NextResponse } from "next/server";
import { getAllChains } from "@/lib/chain";

export async function GET() {
  const chains = await getAllChains();
  return NextResponse.json({ chains });
}
