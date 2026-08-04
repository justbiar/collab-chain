import Link from "next/link";
import { collectionTitle, getAllCollections, INVITE_EXPIRY_HOURS } from "@/lib/chain";
import type { CollectionPhase } from "@/lib/collection";
import { getLocale, t } from "@/lib/i18n";
import { auth } from "@/auth";
import { isSuperAdmin } from "@/lib/admin";
import { listGenesisGrants } from "@/lib/genesis";
import { AvatarMarquee } from "@/components/AvatarMarquee";
import { CollectionCard } from "@/components/CollectionCard";
import { AdminPanel } from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

const FILTERS = ["all", "upcoming", "ongoing", "past"] as const;
type Filter = (typeof FILTERS)[number];

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const [{ filter: rawFilter }, collections, locale, session] = await Promise.all([
    searchParams,
    getAllCollections(),
    getLocale(),
    auth(),
  ]);
  const s = t(locale);

  const isSuper = isSuperAdmin(session?.user?.username);
  const grants = isSuper ? await listGenesisGrants() : [];

  const filter: Filter = FILTERS.includes(rawFilter as Filter)
    ? (rawFilter as Filter)
    : "all";
  const visible =
    filter === "all" ? collections : collections.filter((c) => c.phase === filter);

  const allCards = collections.flatMap((c) => c.chain);
  const totalCards = allCards.length;

  const filterLabel: Record<Filter, string> = {
    all: s.collection.filterAll,
    upcoming: s.collection.filterUpcoming,
    ongoing: s.collection.filterOngoing,
    past: s.collection.filterPast,
  };
  const countFor = (f: Filter) =>
    f === "all" ? collections.length : collections.filter((c) => c.phase === f).length;

  return (
    <div className="bg-blueprint-grid relative min-h-screen w-full overflow-x-hidden px-4 pt-28 pb-16 sm:px-8 sm:pt-24">
      {/* Authkit Ambient background glows */}
      <div aria-hidden className="ambient-blue-aura" />
      <div aria-hidden className="ambient-blueprint-aura" />

      <header className="relative z-10 mx-auto mb-20 max-w-4xl text-center">
        {/* Authkit Main Title — big, solid-contrast, confident */}
        <h1 className="text-[56px] font-[800] leading-[0.98] tracking-[-0.04em] text-gradient-ice sm:text-[88px] sm:tracking-[-0.05em] lg:text-[104px]">
          {totalCards > 0 ? s.home.totalCards(totalCards) : s.home.startChain}
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-[17px] text-ash leading-relaxed">
          {totalCards > 0 ? s.home.subtitleWithChain : s.home.subtitleEmpty}
        </p>

        {/* Authkit Signal Blue Primary CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/create"
            className="btn-metallic-silver inline-flex items-center gap-3 rounded-full px-10 py-5 text-[16px] font-[700] tracking-[-0.01em]"
          >
            <span>{s.home.cta}</span>
            <span className="font-mono text-sm opacity-80">→</span>
          </Link>
        </div>

        <div className="mt-5">
          <Link
            href="/rules"
            className="font-mono text-[11px] tracking-[0.15em] text-smoke underline underline-offset-4 transition hover:text-bone"
          >
            {s.rulesPage.nav}
          </Link>
        </div>

        {/* Trust stat row — solid bright icon discs pop against the dark hero */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-4 sm:divide-x sm:divide-[rgba(var(--edge-rgb),0.15)]">
          <div className="flex flex-col items-center gap-3 text-center sm:px-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bone text-carbon shadow-[0_0_22px_-4px_rgba(232,232,236,0.4),inset_0_-1px_0_rgba(0,0,0,0.25)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            </span>
            <div>
              <p className="font-mono text-[11px] font-[700] tracking-[0.15em] text-bone">{s.home.ruleOneInviteTitle}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-ash">{s.home.ruleOneInvite}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center sm:px-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bone text-carbon shadow-[0_0_22px_-4px_rgba(232,232,236,0.4),inset_0_-1px_0_rgba(0,0,0,0.25)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3.5 2" />
              </svg>
            </span>
            <div>
              <p className="font-mono text-[11px] font-[700] tracking-[0.15em] text-bone">{s.home.ruleExpiryTitle}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-ash">{s.home.ruleExpiry(INVITE_EXPIRY_HOURS)}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center sm:px-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bone text-carbon shadow-[0_0_22px_-4px_rgba(232,232,236,0.4),inset_0_-1px_0_rgba(0,0,0,0.25)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.51 9a9 9 0 0114.85-3.36L21 8.5M20.49 15a9 9 0 01-14.85 3.36L3 15.5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 4.5V8.5H17M3 19.5V15.5H7" />
              </svg>
            </span>
            <div>
              <p className="font-mono text-[11px] font-[700] tracking-[0.15em] text-bone">{s.home.ruleRenewTitle}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-ash">{s.home.ruleRenew}</p>
            </div>
          </div>
        </div>
      </header>

      {isSuper && (
        <AdminPanel
          grants={grants.map((g) => ({
            xUsername: g.xUsername,
            grantedAt: g.grantedAt.toISOString(),
          }))}
          collections={collections.map(({ root, phase }) => ({
            id: root.id,
            title: collectionTitle(root),
            xUsername: root.xUsername,
            phase,
          }))}
          locale={locale}
        />
      )}

      <AvatarMarquee cards={allCards} />

      <main className="relative z-10 mx-auto max-w-6xl">
        {collections.length === 0 ? (
          <div className="glass-panel rounded-[22px] p-12 text-center">
            <p className="text-[15px] text-smoke">{s.home.emptyState}</p>
          </div>
        ) : (
          <>
            <p className="mb-5 text-center font-mono text-[11px] tracking-[0.3em] text-smoke">
              {s.home.collectionsTitle}
            </p>

            {/* Faz filtreleri */}
            <div className="mb-8 flex justify-center">
              <div className="metallic-panel flex flex-wrap justify-center gap-1 rounded-full p-1">
                {FILTERS.map((f) => (
                  <Link
                    key={f}
                    href={f === "all" ? "/" : `/?filter=${f}`}
                    scroll={false}
                    className={`rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.1em] transition ${
                      filter === f
                        ? "btn-metallic-silver"
                        : "text-smoke hover:text-bone"
                    }`}
                  >
                    {filterLabel[f]}
                    <span className="ml-1.5 opacity-60">{countFor(f)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="glass-panel rounded-[22px] p-12 text-center">
                <p className="text-[15px] text-smoke">{s.collection.emptyFiltered}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map(({ root, chain, phase }) => (
                  <CollectionCard
                    key={root.id}
                    root={root}
                    chain={chain}
                    phase={phase as CollectionPhase}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}



