/**
 * Kullanıcı yüklemesi görsellerin sunucuda kabul edilecek üst sınırı.
 *
 * Tek bir kart isteği aynı anda üç görsel taşıyabilir (profil + logo + yeni
 * koleksiyonda kapak). Vercel'in fonksiyon istekleri için platform seviyesinde
 * sabit ~4.5MB gövde sınırı var — base64 kodlaması baytları ~%33 büyüttüğü
 * için üçü birden bu sınırı aşarsa istek sunucuya ulaşmadan 413 ile reddedilir.
 * 900KB * 3 * 4/3 ≈ 3.6MB, bu sınırın altında güvenli bir pay bırakır.
 */
export const MAX_IMAGE_BYTES = 900 * 1024; // 900KB — orijinal dosya boyutu

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/** base64, ham baytları ~%33 büyütür; data URL üstünde buna göre bir üst sınır. */
const MAX_DATA_URL_LENGTH = Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 100;

const DATA_URL_RE = /^data:(image\/(?:png|jpeg|jpg|webp|gif));base64,/i;

/**
 * `profileImageUrl` / `logoImageUrl` / `coverImageUrl` gibi alanlara yazılmadan
 * önce sunucu tarafında doğrulanır: boşsa geçerli (opsiyonel alan), doluysa
 * izin verilen bir görsel tipinde ve boyut sınırının altında bir data URL
 * olmalı. Sınırsız string'lerin doğrudan DB'ye yazılmasını engeller.
 */
export function isValidImageValue(value: string | null | undefined): boolean {
  if (!value) return true;
  if (value.length > MAX_DATA_URL_LENGTH) return false;
  const match = DATA_URL_RE.exec(value);
  if (!match) return false;
  return ALLOWED_MIME_TYPES.includes(match[1].toLowerCase());
}

export function isAllowedImageFile(file: File): boolean {
  return ALLOWED_MIME_TYPES.includes(file.type) && file.size <= MAX_IMAGE_BYTES;
}
