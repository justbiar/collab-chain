import type { Card } from "@/generated/prisma/client";

/**
 * Koleksiyonun yaşam döngüsü. Ayarlar kök kartta tutulur; kök kartın sahibi
 * koleksiyonun yöneticisidir.
 *
 * Faz zamandan ve üye sayısından türetilir — hiçbir cron gerekmez. Sadece
 * "tamamlandı" durumu kalıcılaştırılır, çünkü o terminal bir durum.
 */

export type CompletionMode = "manual" | "deadline" | "limit";
export type ChainStatus = "live" | "completed" | "cancelled" | "dead";
export type CollectionPhase = "upcoming" | "ongoing" | "past";

export const COMPLETION_MODES: CompletionMode[] = ["manual", "deadline", "limit"];

export function isCompletionMode(value: string): value is CompletionMode {
  return (COMPLETION_MODES as string[]).includes(value);
}

/** Koleksiyonun yöneticisi mi — yani kök kartın sahibi mi. */
export function isCollectionAdmin(root: Card, username: string | null | undefined): boolean {
  const handle = (username ?? "").replace(/^@/, "").trim().toLowerCase();
  return handle.length > 0 && handle === root.xUsername.trim().toLowerCase();
}

/** Başlangıç tarihi doluysa ve henüz gelmediyse koleksiyon açılmamıştır. */
export function hasStarted(root: Card, now = Date.now()): boolean {
  return root.startsAt == null || root.startsAt.getTime() <= now;
}

/**
 * Ayarlarına göre koleksiyonun şu an kendiliğinden tamamlanmış sayılıp
 * sayılmadığı. Yazma yapmaz — çağıran taraf kalıcılaştırmaya karar verir.
 */
export function shouldAutoComplete(
  root: Card,
  memberCount: number,
  now = Date.now()
): boolean {
  if (root.chainStatus !== "live") return false;
  if (!hasStarted(root, now)) return false;

  if (root.completionMode === "deadline") {
    return root.deadlineAt != null && root.deadlineAt.getTime() <= now;
  }
  if (root.completionMode === "limit") {
    return root.memberLimit != null && memberCount >= root.memberLimit;
  }
  return false;
}

/**
 * Listeleme filtrelerinde kullanılan faz.
 *
 * `memberCount` verilirse üye limiti de hesaba katılır; verilmezse sadece
 * kayıtlı durum ve tarihlere bakılır.
 */
export function collectionPhase(
  root: Card,
  memberCount?: number,
  now = Date.now()
): CollectionPhase {
  if (root.chainStatus !== "live") return "past";
  if (!hasStarted(root, now)) return "upcoming";
  if (memberCount != null && shouldAutoComplete(root, memberCount, now)) return "past";
  return "ongoing";
}

/** Yeni birinin katılmasına açık mı? */
export function acceptsNewMembers(
  root: Card,
  memberCount: number,
  now = Date.now()
): boolean {
  return collectionPhase(root, memberCount, now) === "ongoing";
}

/** Kalan gün/kontenjan gibi bilgiler için — arayüzde geri sayım göstermeye yarar. */
export interface CollectionProgress {
  mode: CompletionMode;
  /** deadline modunda kalan saat. */
  hoursLeft: number | null;
  /** limit modunda kalan kontenjan. */
  slotsLeft: number | null;
  memberLimit: number | null;
  deadlineAt: Date | null;
  startsAt: Date | null;
}

export function collectionProgress(
  root: Card,
  memberCount: number,
  now = Date.now()
): CollectionProgress {
  const mode = isCompletionMode(root.completionMode) ? root.completionMode : "manual";
  return {
    mode,
    hoursLeft:
      mode === "deadline" && root.deadlineAt
        ? Math.max(0, Math.ceil((root.deadlineAt.getTime() - now) / (60 * 60 * 1000)))
        : null,
    slotsLeft:
      mode === "limit" && root.memberLimit != null
        ? Math.max(0, root.memberLimit - memberCount)
        : null,
    memberLimit: root.memberLimit,
    deadlineAt: root.deadlineAt,
    startsAt: root.startsAt,
  };
}
