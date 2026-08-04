import { prisma } from "@/lib/prisma";
import {
  CardData,
  FIRST_NAME_MAX,
  LAST_NAME_MAX,
  ROLE_MAX,
  SKILLS_MAX,
  USERNAME_MAX,
} from "@/lib/types";
import { isValidImageValue } from "@/lib/image";
import { isSuperAdmin } from "@/lib/admin";
import {
  isInviteExpired,
  expiryDate,
  turnExpiryDate,
  addHours,
  TURN_EXPIRY_HOURS,
} from "@/lib/invite";
import {
  acceptsNewMembers,
  collectionPhase,
  isCollectionAdmin,
  isCompletionMode,
  shouldAutoComplete,
} from "@/lib/collection";
import type { CollectionPhase } from "@/lib/collection";
import type { Card } from "@/generated/prisma/client";

export {
  INVITE_EXPIRY_HOURS,
  TURN_EXPIRY_HOURS,
  isInviteExpired,
  hoursRemaining,
  hoursUntil,
  msUntil,
} from "@/lib/invite";

export class ChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChainError";
  }
}

const CHAIN_ERROR_STATUS: Record<string, number> = {
  PARENT_NOT_FOUND: 404,
  CARD_NOT_FOUND: 404,
  USERNAME_MISMATCH: 403,
  TARGET_REQUIRED: 400,
  INVITE_ALREADY_ACCEPTED: 409,
  INVITE_EXPIRED: 410,
  USER_BANNED: 403,
  NOT_YOUR_TURN: 409,
  CHAIN_DEAD: 410,
  COLLECTION_CLOSED: 410,
  COLLECTION_NOT_STARTED: 425,
  NOT_COLLECTION_ADMIN: 403,
  MEMBER_NOT_FOUND: 404,
  CANNOT_REMOVE_FOUNDER: 409,
  INVALID_IMAGE: 400,
  ALREADY_MEMBER: 409,
  USERNAME_REQUIRED: 400,
  ALREADY_MINTED: 409,
  WALLET_REQUIRED: 400,
  INVALID_WALLET_ADDRESS: 400,
};

export function chainErrorStatus(err: ChainError): number {
  return CHAIN_ERROR_STATUS[err.message] ?? 409;
}

function normalizeHandle(username: string): string {
  return username.replace(/^@/, "").trim();
}

/**
 * Client'taki `maxLength` yalnızca UI kolaylığı — API doğrudan çağrılırsa
 * atlanabilir. Sınırsız metinlerin DB'ye yazılmasını engellemek için
 * serbest metin alanları burada da kırpılır.
 */
function clampText(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

/* ------------------------------------------------------------------ *
 * Turn clock
 * ------------------------------------------------------------------ */

/**
 * Bu üyenin sırasının bittiği an.
 *
 * - Henüz kimseyi etiketlemediyse: katılırken verilen `turnExpiresAt`.
 * - Etiketledi ve davet hâlâ açık: `inviteExpiresAt`. Bu sürede top karşı
 *   tarafta, üye kusurlu sayılmaz.
 * - Etiketledi ama davet edilen kabul etmeden süre doldu: üyeye yeniden
 *   etiketlemesi için taze bir tur tanınır.
 */
function memberDeadline(card: Card): Date | null {
  if (card.inviteStatus === "accepted") return null;

  if (!card.targetUsername || !card.inviteExpiresAt) {
    return card.turnExpiresAt;
  }

  return isInviteExpired(card)
    ? addHours(card.inviteExpiresAt, TURN_EXPIRY_HOURS)
    : card.inviteExpiresAt;
}

export interface ChainState {
  /** Sıra kimde — süresini kaçırmamış en derin aktif üye. Zincir öldüyse null. */
  turnHolder: Card | null;
  turnDeadline: Date | null;
  /** Süresini kaçırmış, yerine biri geldiğinde elenecek üyeler (uçtan geriye). */
  lapsed: Card[];
  /** Sıra kurucuya kadar düştü ve kurucu da kaçırdı — koleksiyon dondu. */
  isDead: boolean;
}

/**
 * Zincirin o anki durumunu sadece zamandan hesaplar — hiçbir şey yazmaz.
 *
 * Uçtaki üye süresini kaçırdıysa sıra bir üste düşer ve üsttekine taze bir
 * 24 saat tanınır; o da kaçırırsa bir daha üste, ta kurucuya kadar.
 */
export function resolveChainState(activePath: Card[]): ChainState {
  if (activePath.length === 0) {
    return { turnHolder: null, turnDeadline: null, lapsed: [], isDead: false };
  }

  const now = Date.now();
  const lapsed: Card[] = [];
  let inheritedDeadline: Date | null = null;

  for (let i = activePath.length - 1; i >= 0; i--) {
    const card = activePath[i];
    const deadline: Date | null =
      inheritedDeadline === null
        ? memberDeadline(card)
        : addHours(inheritedDeadline, TURN_EXPIRY_HOURS);

    // Sırası olmayan (zaten devretmiş) üye — zincir bir yol olduğu için
    // buraya sadece uçta düşülür.
    if (deadline === null) {
      return { turnHolder: card, turnDeadline: null, lapsed, isDead: false };
    }

    if (deadline.getTime() >= now) {
      return { turnHolder: card, turnDeadline: deadline, lapsed, isDead: false };
    }

    lapsed.push(card);
    inheritedDeadline = deadline;
  }

  // Kurucu dahil herkes kaçırdı.
  return { turnHolder: null, turnDeadline: null, lapsed, isDead: true };
}

/* ------------------------------------------------------------------ *
 * Bans
 * ------------------------------------------------------------------ */

export async function isUsernameBanned(username: string): Promise<boolean> {
  const handle = normalizeHandle(username);
  if (!handle) return false;
  const hit = await prisma.bannedUser.findFirst({
    where: { xUsername: { equals: handle, mode: "insensitive" } },
  });
  return hit !== null;
}

/* ------------------------------------------------------------------ *
 * Join requests
 *
 * Bir koleksiyona etiketlenmeden katılmak isteyenlerin listesi. Sırası
 * gelen üye, kart oluştururken ya da daveti yenilerken bu listeden seçip
 * doğrudan etiketleyebilir. Biri gerçekten katıldığında (bir kart onun
 * adına oluşturulduğunda) isteği otomatik olarak temizlenir.
 * ------------------------------------------------------------------ */

export interface JoinRequestSummary {
  xUsername: string;
  createdAt: Date;
}

/** Bir X hesabının bu koleksiyona katılma isteği göndermesi. */
export async function requestToJoin(collectionId: number, username: string): Promise<void> {
  const handle = normalizeHandle(username);
  if (!handle) throw new ChainError("USERNAME_REQUIRED");

  const found = await prisma.card.findUnique({ where: { id: collectionId } });
  if (!found) throw new ChainError("CARD_NOT_FOUND");
  const root = await findRoot(found);

  if (await isUsernameBanned(handle)) throw new ChainError("USER_BANNED");

  const path = (await getChainByRootId(root.id)) ?? [];
  if (path.some((c) => c.xUsername.toLowerCase() === handle.toLowerCase())) {
    throw new ChainError("ALREADY_MEMBER");
  }

  const syncedRoot = await syncAutoCompletion(root, path.length);
  if (!acceptsNewMembers(syncedRoot, path.length)) {
    throw new ChainError(
      collectionPhase(syncedRoot, path.length) === "upcoming"
        ? "COLLECTION_NOT_STARTED"
        : "COLLECTION_CLOSED"
    );
  }

  await prisma.joinRequest.upsert({
    where: { collectionId_xUsername: { collectionId: root.id, xUsername: handle } },
    update: {},
    create: { collectionId: root.id, xUsername: handle },
  });
}

/** Kendi katılma isteğini geri çeker. */
export async function cancelJoinRequest(collectionId: number, username: string): Promise<void> {
  const handle = normalizeHandle(username);
  if (!handle) return;
  await prisma.joinRequest.deleteMany({
    where: { collectionId, xUsername: { equals: handle, mode: "insensitive" } },
  });
}

/** Bekleyen istekler — en eskiden yeniye. */
export async function listJoinRequests(collectionId: number): Promise<JoinRequestSummary[]> {
  const requests = await prisma.joinRequest.findMany({
    where: { collectionId },
    orderBy: { createdAt: "asc" },
  });
  return requests.map((r) => ({ xUsername: r.xUsername, createdAt: r.createdAt }));
}

export async function hasJoinRequest(collectionId: number, username: string): Promise<boolean> {
  const handle = normalizeHandle(username);
  if (!handle) return false;
  const hit = await prisma.joinRequest.findFirst({
    where: { collectionId, xUsername: { equals: handle, mode: "insensitive" } },
  });
  return hit !== null;
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

export async function cardCount(): Promise<number> {
  return prisma.card.count({ where: { status: "active" } });
}

export function getCardById(id: number) {
  return prisma.card.findUnique({ where: { id } });
}

async function activeChildOf(cardId: number): Promise<Card | null> {
  return prisma.card.findFirst({
    where: { parentId: cardId, status: "active" },
    orderBy: { createdAt: "asc" },
  });
}

export async function findRoot(card: Card): Promise<Card> {
  let root = card;
  while (root.parentId != null) {
    const parent: Card | null = await prisma.card.findUnique({
      where: { id: root.parentId },
    });
    if (!parent) break;
    root = parent;
  }
  return root;
}

/**
 * Kartın zincirdeki kaçıncı halka olduğu (1 = kurucu).
 *
 * Kart numarası veritabanı id'si DEĞİLDİR: id'ler global olarak artar ve
 * silinen kayıtlardan sonra boşluk bırakır, o yüzden "zincirin ilk kişisi"
 * bambaşka bir sayı görürdü. Derinlik elenmiş üyeler için de doğru çalışır —
 * yerine geçen kişi aynı sırayı devralır.
 */
export async function getCardPosition(card: Card): Promise<number> {
  let position = 1;
  let current: Card = card;
  while (current.parentId != null) {
    const parent: Card | null = await prisma.card.findUnique({
      where: { id: current.parentId },
    });
    if (!parent) break;
    current = parent;
    position++;
  }
  return position;
}

/** Zincirin yaşayan yolu — elenmiş üyeler atlanır. */
export async function getChainByRootId(id: number): Promise<Card[] | null> {
  const found = await prisma.card.findUnique({ where: { id } });
  if (!found) return null;

  const root = await findRoot(found);
  const chain: Card[] = [root];
  let current: Card = root;
  while (true) {
    const child = await activeChildOf(current.id);
    if (!child) break;
    chain.push(child);
    current = child;
  }
  return chain;
}

export interface ChainNode {
  card: Card;
  /** Elenmiş — zincirin akışından koparılmış ama hikâye için gösterilir. */
  burned: boolean;
  /** Zincirdeki sıra (1 = kurucu). Kart üstünde gösterilen numara budur. */
  position: number;
}

/**
 * Görüntüleme sırası: her aktif üyenin ardından, varsa o üyenin altında yanmış
 * dal, sonra yaşayan halef. Böylece "4 ve 5 yandı, 3 yeni bir 4 buldu" akışı
 * olduğu gibi okunur.
 */
async function buildDisplayNodes(root: Card): Promise<ChainNode[]> {
  const nodes: ChainNode[] = [];

  const walkBurned = async (card: Card, position: number) => {
    nodes.push({ card, burned: true, position });
    const children = await prisma.card.findMany({
      where: { parentId: card.id },
      orderBy: { createdAt: "asc" },
    });
    for (const child of children) await walkBurned(child, position + 1);
  };

  let current: Card | null = root;
  let position = 1;
  while (current) {
    nodes.push({ card: current, burned: false, position });

    const burnedChildren = await prisma.card.findMany({
      where: { parentId: current.id, status: "eliminated" },
      orderBy: { createdAt: "asc" },
    });
    // Yanmış dal, ait olduğu sıradan itibaren numaralanır — yerine geçen
    // kişi de aynı sırayı alır.
    for (const child of burnedChildren) await walkBurned(child, position + 1);

    current = await activeChildOf(current.id);
    position++;
  }

  return nodes;
}

export interface ChainView {
  root: Card;
  /** Yaşayan yol. */
  path: Card[];
  /** Yanmışlar dahil, ekranda gösterilecek sıra. */
  nodes: ChainNode[];
  state: ChainState;
  phase: CollectionPhase;
}

export async function getChainView(id: number): Promise<ChainView | null> {
  const found = await prisma.card.findUnique({ where: { id } });
  if (!found) return null;

  let root = await findRoot(found);
  const path = (await getChainByRootId(root.id)) ?? [];

  // Süresi ya da kontenjanı dolmuşsa görüntülemede kapanmış olarak yazılır.
  root = await syncAutoCompletion(root, path.length);

  const state = resolveChainState(path);

  // Zincirin ölmesi terminal bir durum: tespit edince bir kez yaz, cezaları
  // uygula. Sadece hâlâ açık koleksiyonlar donabilir — tamamlanmış ya da
  // iptal edilmiş bir koleksiyonda sıranın kaçması ceza doğurmaz.
  if (state.isDead && root.chainStatus === "live") {
    await freezeChain(root, state.lapsed);
    const refreshed = await prisma.card.findUnique({ where: { id: root.id } });
    if (refreshed) root = refreshed;
  }

  return {
    root,
    path,
    nodes: await buildDisplayNodes(root),
    state,
    phase: collectionPhase(root, path.length),
  };
}

export interface CollectionSummary {
  root: Card;
  chain: Card[];
  phase: CollectionPhase;
}

export async function getAllCollections(): Promise<CollectionSummary[]> {
  const roots = await prisma.card.findMany({
    where: { parentId: null, status: "active" },
    orderBy: { createdAt: "desc" },
  });

  const out: CollectionSummary[] = [];
  for (const found of roots) {
    const chain = (await getChainByRootId(found.id)) ?? [];
    const root = await syncAutoCompletion(found, chain.length);
    out.push({ root, chain, phase: collectionPhase(root, chain.length) });
  }
  return out;
}

export async function getAllChains(): Promise<Card[][]> {
  return (await getAllCollections()).map((c) => c.chain);
}

/* ------------------------------------------------------------------ *
 * Penalties
 * ------------------------------------------------------------------ */

/** Süresini kaçıran üyeleri eler ve X hesaplarını kalıcı olarak yasaklar. */
async function eliminate(
  tx: Pick<typeof prisma, "card" | "bannedUser">,
  members: Card[]
) {
  if (members.length === 0) return;

  const now = new Date();
  await tx.card.updateMany({
    where: { id: { in: members.map((m) => m.id) } },
    data: { status: "eliminated", eliminatedAt: now },
  });

  for (const member of members) {
    const handle = normalizeHandle(member.xUsername);
    if (!handle) continue;
    await tx.bannedUser.upsert({
      where: { xUsername: handle },
      update: {},
      create: { xUsername: handle, cardId: member.id },
    });
  }
}

/** Kurucu dahil herkes kaçırdı: koleksiyonu dondur, gecikenleri ele. */
async function freezeChain(root: Card, lapsed: Card[]) {
  // Kurucu koleksiyonun sahibi — dondurulur ama yasaklanmaz.
  const punishable = lapsed.filter((c) => c.id !== root.id);

  await prisma.$transaction(async (tx) => {
    await eliminate(tx, punishable);
    await tx.card.update({
      where: { id: root.id },
      data: { chainStatus: "dead" },
    });
  });
}

/* ------------------------------------------------------------------ *
 * Collection lifecycle
 * ------------------------------------------------------------------ */

/**
 * Süresi dolmuş ya da kontenjanı dolmuş koleksiyonu tamamlanmış olarak
 * kalıcılaştırır. Terminal bir durum olduğu için bir kez yazılır.
 */
async function syncAutoCompletion(root: Card, memberCount: number): Promise<Card> {
  if (!shouldAutoComplete(root, memberCount)) return root;
  return prisma.card.update({
    where: { id: root.id },
    data: { chainStatus: "completed", completedAt: new Date() },
  });
}

export interface CollectionSettings {
  name?: string;
  description?: string;
  coverImageUrl?: string | null;
  startsAt?: Date | null;
  completionMode?: string;
  deadlineAt?: Date | null;
  memberLimit?: number | null;
}

/**
 * Koleksiyonun görünen adı. İsim verilmemişse (eski kayıtlar) kurucunun
 * adına düşer ki hiçbir yerde boş başlık çıkmasın.
 */
export function collectionTitle(root: Card): string {
  const named = root.collectionName.trim();
  if (named) return named;
  return `${root.firstName} ${root.lastName}`.trim() || root.xUsername;
}

/**
 * Yönetici işlemleri için kök kartı bulur ve yetkiyi doğrular.
 * Koleksiyonun kurucusu ya da süper admin — süper admin her koleksiyonu
 * moderasyon amacıyla düzenleyebilir.
 */
async function requireAdminRoot(collectionId: number, username: string): Promise<Card> {
  const found = await prisma.card.findUnique({ where: { id: collectionId } });
  if (!found) throw new ChainError("CARD_NOT_FOUND");

  const root = await findRoot(found);
  if (!isCollectionAdmin(root, username) && !isSuperAdmin(username)) {
    throw new ChainError("NOT_COLLECTION_ADMIN");
  }
  return root;
}

/** Koleksiyonu erkenden bitirir ve yayımlar. */
export async function completeCollection(collectionId: number, username: string): Promise<Card> {
  const root = await requireAdminRoot(collectionId, username);
  if (root.chainStatus !== "live") throw new ChainError("COLLECTION_CLOSED");

  return prisma.card.update({
    where: { id: root.id },
    data: { chainStatus: "completed", completedAt: new Date() },
  });
}

/** Koleksiyonu başarısız olarak kapatır — tamamlanmış sayılmaz. */
export async function cancelCollection(collectionId: number, username: string): Promise<Card> {
  const root = await requireAdminRoot(collectionId, username);
  if (root.chainStatus !== "live") throw new ChainError("COLLECTION_CLOSED");

  return prisma.card.update({
    where: { id: root.id },
    data: { chainStatus: "cancelled", completedAt: new Date() },
  });
}

/**
 * Koleksiyonu ve içindeki tüm kartları kalıcı olarak siler.
 * Yabancı anahtar zinciri yüzünden uçtan köke doğru silinir.
 */
export async function deleteCollection(collectionId: number, username: string): Promise<number> {
  const root = await requireAdminRoot(collectionId, username);

  const all: Card[] = [];
  const collect = async (card: Card) => {
    all.push(card);
    const children = await prisma.card.findMany({ where: { parentId: card.id } });
    for (const child of children) await collect(child);
  };
  await collect(root);

  await prisma.$transaction(async (tx) => {
    await tx.bannedUser.deleteMany({ where: { cardId: { in: all.map((c) => c.id) } } });
    await tx.joinRequest.deleteMany({ where: { collectionId: root.id } });
    // Ebeveyn referansları kırılmasın diye derinden yüzeye doğru sil.
    for (const card of [...all].reverse()) {
      await tx.card.delete({ where: { id: card.id } });
    }
  });

  return all.length;
}

/**
 * Yöneticinin bir üyeyi zincirden çıkarması. Süresini kaçıranın aksine bu
 * bir kural ihlali değil, o yüzden X hesabı yasaklanmaz — kişi başka bir
 * koleksiyona katılabilir. Çıkarılanın altındaki herkes de zincirden düşer.
 */
export async function removeMember(
  collectionId: number,
  memberId: number,
  username: string
): Promise<number> {
  const root = await requireAdminRoot(collectionId, username);
  if (memberId === root.id) throw new ChainError("CANNOT_REMOVE_FOUNDER");

  const member = await prisma.card.findUnique({ where: { id: memberId } });
  if (!member || member.status !== "active") throw new ChainError("MEMBER_NOT_FOUND");

  // Üyenin gerçekten bu koleksiyona ait olduğunu doğrula.
  const memberRoot = await findRoot(member);
  if (memberRoot.id !== root.id) throw new ChainError("MEMBER_NOT_FOUND");

  const removed: Card[] = [];
  const collect = async (card: Card) => {
    removed.push(card);
    const children = await prisma.card.findMany({
      where: { parentId: card.id, status: "active" },
    });
    for (const child of children) await collect(child);
  };
  await collect(member);

  await prisma.$transaction(async (tx) => {
    await tx.card.updateMany({
      where: { id: { in: removed.map((c) => c.id) } },
      data: { status: "eliminated", eliminatedAt: new Date() },
    });
    // Sıra, çıkarılanın bir öncekine döner ve taze bir tur alır.
    if (member.parentId != null) {
      await tx.card.update({
        where: { id: member.parentId },
        data: {
          inviteStatus: "pending",
          targetUsername: null,
          targetReason: "",
          inviteExpiresAt: null,
          turnExpiresAt: turnExpiryDate(),
        },
      });
    }
  });

  return removed.length;
}

/* ------------------------------------------------------------------ *
 * Writes
 * ------------------------------------------------------------------ */

interface CreateCardInput extends CardData {
  parentId?: number | null;
  /** Sadece yeni koleksiyon açılırken (parentId yokken) dikkate alınır. */
  collection?: CollectionSettings;
}

export async function createCard(input: CreateCardInput): Promise<Card> {
  const { parentId, collection, ...data } = input;
  const submittedHandle = normalizeHandle(data.xUsername);

  if (await isUsernameBanned(submittedHandle)) {
    throw new ChainError("USER_BANNED");
  }

  // Görsel alanları sınırsız string olarak DB'ye yazılabilir olmasın diye
  // burada doğrulanır — client'ın gönderdiği herhangi bir string değil,
  // yalnızca izin verilen tipte ve boyutta bir data URL kabul edilir.
  if (
    !isValidImageValue(data.profileImageUrl) ||
    !isValidImageValue(data.logoImageUrl) ||
    (parentId == null && !isValidImageValue(collection?.coverImageUrl))
  ) {
    throw new ChainError("INVALID_IMAGE");
  }

  /** Yerine yeni kişi alındığı için elenecek üyeler. */
  let toEliminate: Card[] = [];
  /** Katılınca kendi katılma isteği temizlenecek koleksiyonun kök id'si. */
  let collectionRootId: number | null = null;

  if (parentId != null) {
    const parent = await prisma.card.findUnique({ where: { id: parentId } });
    if (!parent) throw new ChainError("PARENT_NOT_FOUND");

    const invitedHandle = normalizeHandle(parent.targetUsername ?? "").toLowerCase();
    if (!invitedHandle || invitedHandle !== submittedHandle.toLowerCase()) {
      throw new ChainError("USERNAME_MISMATCH");
    }
    if (isInviteExpired(parent)) throw new ChainError("INVITE_EXPIRED");

    let root = await findRoot(parent);
    const path = (await getChainByRootId(root.id)) ?? [];

    // Süresi/kontenjanı dolmuşsa kabul anında kapanmış sayılır.
    root = await syncAutoCompletion(root, path.length);

    if (root.chainStatus === "dead") throw new ChainError("CHAIN_DEAD");
    if (root.chainStatus === "completed" || root.chainStatus === "cancelled") {
      throw new ChainError("COLLECTION_CLOSED");
    }
    if (!acceptsNewMembers(root, path.length)) {
      throw new ChainError(
        collectionPhase(root, path.length) === "upcoming"
          ? "COLLECTION_NOT_STARTED"
          : "COLLECTION_CLOSED"
      );
    }

    const state = resolveChainState(path);

    // Daveti gönderen kişi gerçekten sırayı elinde tutmalı. Aksi halde
    // zincirin ortasındaki eski bir davet linki dalı ikiye bölerdi.
    if (state.turnHolder?.id !== parent.id) {
      throw new ChainError(
        state.lapsed.some((c) => c.id === parent.id) ? "NOT_YOUR_TURN" : "INVITE_ALREADY_ACCEPTED"
      );
    }

    // Sıra geriye düştüyse, aradaki gecikenler bu kabulle birlikte yanar.
    toEliminate = state.lapsed;
    collectionRootId = root.id;
  }

  const targetUsername = data.targetUsername
    ? clampText(normalizeHandle(data.targetUsername), USERNAME_MAX)
    : null;

  return prisma.$transaction(async (tx) => {
    await eliminate(tx, toEliminate);

    const card = await tx.card.create({
      data: {
        firstName: clampText(data.firstName, FIRST_NAME_MAX),
        lastName: clampText(data.lastName, LAST_NAME_MAX),
        xUsername: submittedHandle,
        role: clampText(data.role, ROLE_MAX),
        skills: clampText(data.skills, SKILLS_MAX),
        bio: data.bio ?? "",
        profileImageUrl: data.profileImageUrl || null,
        logoImageUrl: data.logoImageUrl || null,
        targetUsername,
        targetReason: targetUsername ? (data.targetReason ?? "") : "",
        inviteStatus: "pending",
        inviteExpiresAt: targetUsername ? expiryDate() : null,
        // Kimseyi etiketlemeden katıldıysa sırası hemen işlemeye başlar.
        turnExpiresAt: targetUsername ? null : turnExpiryDate(),
        parentId: parentId ?? null,
        // Koleksiyon ayarları yalnızca kök kartta tutulur.
        ...(parentId == null
          ? {
              collectionName: (collection?.name ?? "").trim(),
              collectionDescription: (collection?.description ?? "").trim(),
              coverImageUrl: collection?.coverImageUrl || null,
              startsAt: collection?.startsAt ?? null,
              completionMode: isCompletionMode(collection?.completionMode ?? "")
                ? collection!.completionMode!
                : "manual",
              deadlineAt: collection?.deadlineAt ?? null,
              memberLimit: collection?.memberLimit ?? null,
            }
          : {}),
      },
    });

    if (parentId != null) {
      await tx.card.update({
        where: { id: parentId },
        data: { inviteStatus: "accepted", turnExpiresAt: null },
      });

      // Katılan kişinin bu koleksiyon için bekleyen bir isteği varsa artık
      // gereksiz — davetle mi yoksa listeden seçilerek mi katıldığı fark
      // etmeden temizlenir.
      if (collectionRootId != null) {
        await tx.joinRequest.deleteMany({
          where: { collectionId: collectionRootId, xUsername: { equals: submittedHandle, mode: "insensitive" } },
        });
      }
    }

    return card;
  });
}

/**
 * Üyenin kendi kartına duyuru tweet'ini iliştirmesi. Sadece kartın sahibi
 * (doğrulanmış X hesabı) çağırabilir — kontrol route katmanında yapılır.
 */
export async function setCardTweet(cardId: number, tweetUrl: string | null): Promise<Card> {
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) throw new ChainError("CARD_NOT_FOUND");

  return prisma.card.update({
    where: { id: cardId },
    data: { tweetUrl },
  });
}

/** `setCardTweet`'in Farcaster eşdeğeri — duyuru cast'ini iliştirir. */
export async function setCardCast(cardId: number, castUrl: string | null): Promise<Card> {
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) throw new ChainError("CARD_NOT_FOUND");

  return prisma.card.update({
    where: { id: cardId },
    data: { castUrl },
  });
}

/** Kartın NFT'sinin gideceği cüzdanı kaydeder — mint'ten önce gerekli. */
export async function setCardWallet(cardId: number, walletAddress: string): Promise<Card> {
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) throw new ChainError("CARD_NOT_FOUND");

  return prisma.card.update({
    where: { id: cardId },
    data: { walletAddress },
  });
}

/** Mint başarılı olduğunda zincir/tx bilgisini kalıcılaştırır. */
export async function setCardMinted(
  cardId: number,
  data: { nftChain: string; nftTxHash: string }
): Promise<Card> {
  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) throw new ChainError("CARD_NOT_FOUND");
  if (card.nftTxHash) throw new ChainError("ALREADY_MINTED");
  if (!card.walletAddress) throw new ChainError("WALLET_REQUIRED");

  return prisma.card.update({
    where: { id: cardId },
    data,
  });
}

export async function renewInvite(cardId: number, newTargetUsername: string): Promise<Card> {
  const handle = clampText(normalizeHandle(newTargetUsername), USERNAME_MAX);
  if (!handle) throw new ChainError("TARGET_REQUIRED");

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card) throw new ChainError("CARD_NOT_FOUND");
  if (card.inviteStatus === "accepted") throw new ChainError("INVITE_ALREADY_ACCEPTED");
  if (card.status === "eliminated") throw new ChainError("NOT_YOUR_TURN");

  const root = await findRoot(card);
  if (root.chainStatus === "dead") throw new ChainError("CHAIN_DEAD");

  const path = (await getChainByRootId(root.id)) ?? [];
  const state = resolveChainState(path);
  if (state.turnHolder?.id !== card.id) throw new ChainError("NOT_YOUR_TURN");

  return prisma.card.update({
    where: { id: cardId },
    data: {
      targetUsername: handle,
      inviteStatus: "pending",
      inviteExpiresAt: expiryDate(),
      turnExpiresAt: null,
    },
  });
}

/* ------------------------------------------------------------------ *
 * Profile
 * ------------------------------------------------------------------ */

export interface ProfileChainEntry {
  /** The card this person holds inside that chain. */
  card: Card;
  chain: Card[];
  /** 1-indexed spot in the chain — 1 means they founded it. */
  position: number;
  eliminated: boolean;
}

export interface ProfileSummary {
  username: string;
  displayName: string;
  role: string;
  profileImageUrl: string | null;
  entries: ProfileChainEntry[];
  chainCount: number;
  cardCount: number;
  longestChain: number;
  foundedCount: number;
  banned: boolean;
}

export async function getProfileByUsername(username: string): Promise<ProfileSummary | null> {
  const handle = normalizeHandle(username);
  if (!handle) return null;

  const cards = await prisma.card.findMany({
    where: { xUsername: { equals: handle, mode: "insensitive" } },
    orderBy: { createdAt: "asc" },
  });
  if (cards.length === 0) return null;

  const entries: ProfileChainEntry[] = [];
  for (const card of cards) {
    const root = await findRoot(card);
    const chain = (await getChainByRootId(root.id)) ?? [];
    entries.push({
      card,
      chain,
      // Derinlikten hesaplanır, böylece elenmiş üyeler için de gerçek sıra çıkar.
      position: await getCardPosition(card),
      eliminated: card.status === "eliminated",
    });
  }

  const latest = cards[cards.length - 1];
  const active = entries.filter((e) => !e.eliminated);

  return {
    username: latest.xUsername,
    displayName: `${latest.firstName} ${latest.lastName}`.trim(),
    role: latest.role,
    profileImageUrl: latest.profileImageUrl,
    entries,
    chainCount: active.length,
    cardCount: cards.length,
    longestChain: active.reduce((max, e) => Math.max(max, e.chain.length), 0),
    foundedCount: active.filter((e) => e.position === 1).length,
    banned: await isUsernameBanned(handle),
  };
}
