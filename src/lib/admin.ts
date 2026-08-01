/**
 * Davetsiz yeni zincir başlatma yetkisi tek bir X hesabına bağlı.
 * Hem /create sayfası hem de kart oluşturma API'si aynı kontrolü kullanır.
 */
export function adminHandle(): string {
  return (process.env.ADMIN_X_USERNAME ?? "").replace(/^@/, "").trim();
}

export function isAdminHandle(username: string | null | undefined): boolean {
  const admin = adminHandle().toLowerCase();
  const handle = (username ?? "").replace(/^@/, "").trim().toLowerCase();
  // Admin tanımlı değilse kimse zincir başlatamaz — açık kapı bırakmaz.
  return admin.length > 0 && handle.length > 0 && handle === admin;
}
