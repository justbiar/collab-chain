import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collectionTitle,
  getChainView,
  hasJoinRequest,
  hoursUntil,
  msUntil,
  INVITE_EXPIRY_HOURS,
  TURN_EXPIRY_HOURS,
} from "@/lib/chain";
import { collectionProgress, isCollectionAdmin } from "@/lib/collection";
import { getLocale, t } from "@/lib/i18n";
import { auth } from "@/auth";
import { isSuperAdmin } from "@/lib/admin";
import { displayHandle } from "@/lib/handle";
import { ChainRow } from "@/components/ChainRow";
import { CollectionAdminPanel } from "@/components/CollectionAdminPanel";
import { CountdownClock } from "@/components/CountdownClock";
import { JoinRequestButton } from "@/components/JoinRequestButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChainPage({ params }: PageProps) {
  const [{ id }, locale, session] = await Promise.all([params, getLocale(), auth()]);
  const rootId = Number(id);
  if (!Number.isInteger(rootId)) notFound();

  const view = await getChainView(rootId);
  if (!view) notFound();

  const s = t(locale);
  const { root, path, nodes, state, phase } = view;
  const remaining = hoursUntil(state.turnDeadline);
  const isFounder = isCollectionAdmin(root, session?.user?.username);
  const isAdmin = isFounder || isSuperAdmin(session?.user?.username);
  const isOpen = root.chainStatus === "live" && phase !== "past";
  const progress = collectionProgress(root, path.length);

  // Katılma isteği: sadece giriş yapmış, henüz bu koleksiyonda olmayan ve
  // koleksiyon şu an fiilen açık (upcoming/past değil) kullanıcılara gösterilir.
  const sessionHandle = session?.user?.username ?? null;
  const alreadyMember = sessionHandle
    ? path.some((c) => c.xUsername.toLowerCase() === sessionHandle.toLowerCase())
    : false;
  const canRequestJoin = Boolean(sessionHandle) && phase === "ongoing" && !alreadyMember;
  const initialRequested =
    canRequestJoin && sessionHandle ? await hasJoinRequest(root.id, sessionHandle) : false;

  // Geri sayımların başlangıç değeri sunucuda hesaplanıp istemciye veriliyor;
  // böylece ilk render iki tarafta da aynı oluyor (hydration uyuşmazlığı yok)
  // ve saymayı istemci devralınca başlatıyor.
  const turnDeadline = state.turnDeadline;
  const closesAt = isOpen && progress.mode === "deadline" ? progress.deadlineAt : null;
  const startsAt = phase === "upcoming" ? progress.startsAt : null;
  const collectionTarget = startsAt ?? closesAt;

  const statusLabel =
    root.chainStatus === "completed"
      ? s.collection.statusCompleted
      : root.chainStatus === "cancelled"
        ? s.collection.statusCancelled
        : root.chainStatus === "dead"
          ? s.collection.statusFrozen
          : phase === "upcoming"
            ? s.collection.statusUpcoming
            : s.collection.statusOngoing;

  return (
    <div className="bg-blueprint-grid relative min-h-screen w-full overflow-x-hidden px-4 pt-28 pb-16 sm:px-8 sm:pt-24">
      <div aria-hidden className="ambient-blue-aura" />
      <div aria-hidden className="ambient-blueprint-aura" />

      <header className="relative z-10 mx-auto mb-10 max-w-4xl text-center">
        {root.coverImageUrl && (
          <div className="mx-auto mb-6 h-36 w-full max-w-2xl overflow-hidden rounded-[22px] border border-[rgba(var(--edge-rgb),0.15)] sm:h-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={root.coverImageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <p className="font-mono text-[13px] tracking-[0.3em] text-ash uppercase">
          {s.chainPage.eyebrow}
        </p>
        <p className="mt-2 text-[40px] font-[800] leading-[1.05] tracking-[-0.04em] text-gradient-ice sm:text-[52px]">
          {collectionTitle(root)}
        </p>

        <Link
          href={`/u/${encodeURIComponent(root.xUsername)}`}
          className="mt-2 inline-block font-mono text-[12px] text-smoke underline-offset-4 transition hover:text-bone hover:underline"
        >
          {s.collection.byFounder(displayHandle(root.xUsername))}
        </Link>

        {root.collectionDescription && (
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-ash">
            {root.collectionDescription}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <span className="rounded-full border border-[rgba(var(--edge-rgb),0.22)] bg-carbon/40 px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-ash">
            [{statusLabel}]
          </span>
          <span className="font-mono text-[13px] text-smoke">
            {s.chainPage.membersCount(path.length)}
          </span>
        </div>

        {/* Bitiş koşulu */}
        <p className="mt-2.5 font-mono text-[12px] text-smoke">
          {phase === "upcoming" && progress.startsAt
            ? s.collection.startsAt(progress.startsAt.toLocaleString(locale))
            : progress.mode === "limit" && progress.slotsLeft != null && progress.memberLimit
              ? s.collection.slotsLeft(progress.slotsLeft, progress.memberLimit)
              : isOpen && progress.mode === "manual"
                ? s.collection.manualNote
                : ""}
        </p>

        {/* Koleksiyonun kendi geri sayımı: ya başlamasına ya kapanmasına */}
        {collectionTarget && (
          <div className="mt-7 flex flex-col items-center gap-3">
            <p className="font-mono text-[10px] tracking-[0.25em] text-smoke">
              {startsAt ? s.countdown.startsInTitle : s.countdown.collectionTitle}
            </p>
            <CountdownClock
              deadlineMs={collectionTarget.getTime()}
              initialRemainingMs={msUntil(collectionTarget) ?? 0}
              locale={locale}
              size="lg"
            />
          </div>
        )}
      </header>

      <main className="relative z-10 mx-auto max-w-6xl">
        {canRequestJoin && (
          <div className="mb-6 flex justify-center">
            <JoinRequestButton
              collectionId={root.id}
              initialRequested={initialRequested}
              locale={locale}
            />
          </div>
        )}

        {isAdmin && (
          <CollectionAdminPanel
            collectionId={root.id}
            path={path}
            isOpen={isOpen}
            isFounder={isFounder}
            locale={locale}
          />
        )}

        {/* Sıra / kapanma durumu */}
        {state.isDead && root.chainStatus === "dead" ? (
          <div className="metallic-panel mx-auto mb-6 max-w-xl rounded-[22px] px-6 py-5 text-center">
            <p className="font-mono text-[11px] tracking-[0.2em] text-bone">
              [{s.turn.deadTitle}]
            </p>
            <p className="mt-2 text-[13px] leading-snug text-smoke">{s.turn.deadBody}</p>
          </div>
        ) : (
          isOpen &&
          state.turnHolder && (
            <div className="metallic-panel mx-auto mb-6 flex max-w-xl flex-col items-center gap-3 rounded-[22px] px-6 py-6 text-center">
              <p className="text-[15px] font-[500] text-bone">
                {s.turn.holder(state.turnHolder.xUsername)}
              </p>

              {turnDeadline ? (
                <div className="flex flex-col items-center gap-2.5">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-smoke">
                    {s.countdown.turnTitle}
                  </p>
                  <CountdownClock
                    deadlineMs={turnDeadline.getTime()}
                    initialRemainingMs={msUntil(turnDeadline) ?? 0}
                    locale={locale}
                  />
                </div>
              ) : (
                remaining != null && (
                  <p className="font-mono text-[12px] text-ash">{s.turn.remaining(remaining)}</p>
                )
              )}

              {state.lapsed.length > 0 && (
                <p className="mt-1 max-w-sm text-[12px] leading-snug text-smoke">
                  {s.turn.lapsedNotice(state.lapsed.length)}
                </p>
              )}
            </div>
          )
        )}

        <div className="glass-panel rounded-[24px] p-6 shadow-2xl">
          <ChainRow nodes={nodes} state={state} isOpen={isOpen} locale={locale} />
        </div>

        {isOpen && (
          <p className="mx-auto mt-6 max-w-xl text-center text-[12px] leading-snug text-smoke">
            {s.turn.rules(INVITE_EXPIRY_HOURS, TURN_EXPIRY_HOURS)}
          </p>
        )}

        <div className="mt-10 text-center">
          <Link href="/" className="text-xs text-smoke underline">
            {s.chainPage.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
