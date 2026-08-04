import Link from "next/link";
import { collectionTitle, getAllCollections } from "@/lib/chain";
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



