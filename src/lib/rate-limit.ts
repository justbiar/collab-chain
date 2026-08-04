import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

function limiterFor(key: string, requests: number, window: `${number} ${"s" | "m" | "h"}`) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `ratelimit:${key}`,
  });
}

/** Zincire yazan işlemler: kart oluşturma, davet yenileme, tweet ekleme, yönetici aksiyonları. */
const writeLimiter = limiterFor("write", 20, "10 m");
/** X avatar proxy'si — oturum gerektirmediği için daha sıkı, IP bazlı. */
const avatarLimiter = limiterFor("avatar", 60, "1 m");

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

/**
 * Yazma yapan bir API route'un başında çağrılır. Limit aşıldıysa 429
 * response döner; aksi halde null döner ve işleyiş devam eder.
 *
 * Kimlik doğrulanmış istekler kullanıcı adına, anonim istekler IP'ye göre
 * sınırlanır — böylece tek bir X hesabı birden fazla IP'den limiti atlatamaz
 * ve oturumsuz istekler de paylaşılan bir IP'yi (aynı ofis/NAT) tek başına tüketemez.
 */
export async function enforceWriteRateLimit(
  req: NextRequest,
  identity: string | null
): Promise<NextResponse | null> {
  const key = identity ? `user:${identity.toLowerCase()}` : `ip:${clientIp(req)}`;
  const { success } = await writeLimiter.limit(key);
  if (!success) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }
  return null;
}

export async function enforceAvatarRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const { success } = await avatarLimiter.limit(`ip:${clientIp(req)}`);
  if (!success) {
    return new NextResponse(null, { status: 429 });
  }
  return null;
}
