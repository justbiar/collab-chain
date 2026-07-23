import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("u")?.replace(/^@/, "").trim();
  if (!username) {
    return new Response(null, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://unavatar.io/twitter/${encodeURIComponent(username)}`,
      { next: { revalidate: 3600 } }
    );
  } catch {
    return new Response(null, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(null, { status: 404 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "image/jpeg",
      "cache-control": "public, max-age=3600",
    },
  });
}
