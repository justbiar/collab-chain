import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { getAppDomain } from "@/lib/site-url";

const appClient = createAppClient({ ethereum: viemConnector() });

export interface FarcasterVerifyInput {
  message: string;
  signature: `0x${string}`;
  nonce: string;
}

/**
 * "Sign in with Farcaster" mesajının imzasını doğrular. Başarılıysa mesajı
 * imzalayan cüzdanın gerçekten o fid'in kayıtlı signer'ı olduğu kanıtlanmış
 * olur — ama kullanıcı adı burada YOK, ayrıca `resolveFarcasterUsername` ile
 * çözülmesi gerekiyor (client'ın gönderdiği username'e güvenilmiyor).
 */
export async function verifyFarcasterSignIn(
  input: FarcasterVerifyInput
): Promise<{ fid: number } | null> {
  try {
    const result = await appClient.verifySignInMessage({
      message: input.message,
      signature: input.signature,
      domain: getAppDomain(),
      nonce: input.nonce,
    });
    return result.success && result.fid ? { fid: result.fid } : null;
  } catch {
    return null;
  }
}

interface FnameTransfer {
  to: number;
  username: string;
  timestamp: number;
}

/**
 * fid'e şu an kayıtlı Farcaster kullanıcı adını, Farcaster'ın resmi fname
 * kayıt sunucusundan (fnames.farcaster.xyz) çözer — kendi hub'ımızı işletmeden
 * fid → username çözümü için Farcaster'ın önerdiği kamuya açık, anahtarsız yol.
 */
export async function resolveFarcasterUsername(fid: number): Promise<string | null> {
  try {
    const res = await fetch(`https://fnames.farcaster.xyz/transfers?fid=${fid}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { transfers?: FnameTransfer[] };
    const transfers = (data.transfers ?? []).filter((t) => t.to === fid);
    if (transfers.length === 0) return null;

    const latest = transfers.reduce((a, b) => (a.timestamp >= b.timestamp ? a : b));
    return latest.username || null;
  } catch {
    return null;
  }
}
