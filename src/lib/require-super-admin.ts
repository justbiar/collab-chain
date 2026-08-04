import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isSuperAdmin } from "@/lib/admin";

/** Admin API route'larının başında çağrılır — sadece süper admin geçebilir. */
export async function requireSuperAdmin(): Promise<
  { username: string; error: null } | { username: null; error: NextResponse }
> {
  const session = await auth();
  const username = session?.user?.username;
  if (!username || !isSuperAdmin(username)) {
    return { username: null, error: NextResponse.json({ error: "NOT_ADMIN" }, { status: 403 }) };
  }
  return { username, error: null };
}
