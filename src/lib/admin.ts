import { farcasterIdentity } from "@/lib/handle";

/**
 * Süper admin — ortam değişkeniyle tanımlanan, tek ve değişmez sahip hesap.
 * Genesis yetkisi ver/al panelini yönetir ve her koleksiyonu düzenleyebilir.
 * Davetsiz yeni koleksiyon başlatma yetkisi için bkz. `canStartGenesis`
 * (@/lib/genesis) — süper admin dışında yetki verilmiş hesaplar da olabilir.
 *
 * Admin, X ya da Farcaster hesabından biriyle (ya da ikisiyle) giriş yapmış
 * sayılabilir — ADMIN_X_USERNAME ve ADMIN_FARCASTER_USERNAME ayrı ayrı
 * tanımlanabilir.
 */
export function adminHandle(): string {
  return (process.env.ADMIN_X_USERNAME ?? "").replace(/^@/, "").trim();
}

function envAdminHandles(): string[] {
  const x = adminHandle().toLowerCase();
  const fc = (process.env.ADMIN_FARCASTER_USERNAME ?? "").replace(/^@/, "").trim();
  const handles: string[] = [];
  if (x) handles.push(x);
  if (fc) handles.push(farcasterIdentity(fc).toLowerCase());
  return handles;
}

export function isSuperAdmin(username: string | null | undefined): boolean {
  const handle = (username ?? "").replace(/^@/, "").trim().toLowerCase();
  if (!handle) return false;
  // Admin hiç tanımlı değilse kimse süper admin olamaz — açık kapı bırakmaz.
  return envAdminHandles().includes(handle);
}
