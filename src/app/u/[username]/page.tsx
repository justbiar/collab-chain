import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfileByUsername } from "@/lib/chain";
import { getLocale, t } from "@/lib/i18n";
import { displayHandle } from "@/lib/handle";
import { Avatar } from "@/components/Avatar";
import { GoldenChain } from "@/components/GoldenChain";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ username: string }>;
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="metallic-panel flex flex-col items-center gap-1 rounded-[18px] px-4 py-5">
      <span className="font-mono text-[34px] font-[700] leading-none tracking-[-0.04em] text-gradient-ice">
        {value}
      </span>
      <span className="font-mono text-[9px] tracking-[0.18em] text-smoke">{label}</span>
    </div>
  );
}

export default async function ProfilePage({ params }: PageProps) {
  const [{ username }, locale] = await Promise.all([params, getLocale()]);
  const profile = await getProfileByUsername(decodeURIComponent(username));
  if (!profile) notFound();

  const s = t(locale).profilePage;

  return (
    <div className="bg-blueprint-grid relative min-h-screen w-full overflow-x-hidden px-4 pt-28 pb-16 sm:px-8 sm:pt-24">
      <div aria-hidden className="ambient-blue-aura" />
      <div aria-hidden className="ambient-blueprint-aura" />

      <header className="relative z-10 mx-auto mb-14 flex max-w-3xl flex-col items-center text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-smoke">{s.eyebrow}</p>

        <div className="mockup-stage mt-6 flex justify-center pb-6">
          <div className="card-avatar-ring h-28 w-28 rounded-full p-[2px] shadow-[0_0_44px_-10px_rgba(232,232,236,0.5)]">
            <div className="h-full w-full rounded-full bg-carbon p-[3px]">
              <Avatar
                imageUrl={profile.profileImageUrl}
                username={profile.username}
                className="h-full w-full rounded-full object-cover"
                fallback={
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-steel-plate text-3xl font-[450] text-ash">
                    {profile.displayName.charAt(0).toUpperCase() || "?"}
                  </div>
                }
              />
            </div>
          </div>
        </div>

        <h1 className="mt-4 text-[44px] font-[800] leading-[1.05] tracking-[-0.04em] text-gradient-ice sm:text-[56px]">
          {profile.displayName}
        </h1>
        <p className="mt-2 font-mono text-[13px] text-smoke">
          @{displayHandle(profile.username)}
          {profile.role && <span className="text-ash"> · {profile.role}</span>}
        </p>

        {profile.banned && (
          <p className="mt-5 max-w-md rounded-full border border-[rgba(var(--edge-rgb),0.2)] bg-carbon/40 px-5 py-2 text-[12px] leading-snug text-smoke">
            {s.bannedNotice}
          </p>
        )}
      </header>

      <main className="relative z-10 mx-auto max-w-4xl">
        {/* Stat plate */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label={s.statChains} value={profile.chainCount} />
          <StatTile label={s.statFounded} value={profile.foundedCount} />
          <StatTile label={s.statLongest} value={profile.longestChain} />
          <StatTile label={s.statCards} value={profile.cardCount} />
        </div>

        {/* Chain memberships */}
        <p className="mt-14 mb-5 text-center font-mono text-[11px] tracking-[0.3em] text-smoke">
          {s.chainsTitle}
        </p>

        <div className="space-y-4">
          {profile.entries.map(({ card, chain, position, eliminated }) => {
            const founder = chain[0];
            return (
              <div
                key={card.id}
                className={`metallic-panel flex flex-col gap-5 rounded-[22px] p-6 sm:flex-row sm:items-center sm:justify-between ${
                  eliminated ? "opacity-60" : ""
                }`}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[rgba(var(--edge-rgb),0.2)] p-0.5">
                    <Avatar
                      imageUrl={founder.profileImageUrl}
                      username={founder.xUsername}
                      className="h-full w-full rounded-full object-cover"
                      fallback={
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-steel-plate text-sm text-ash">
                          {founder.firstName.charAt(0).toUpperCase() || "?"}
                        </div>
                      }
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`truncate font-[450] ${
                          eliminated ? "text-smoke line-through" : "text-bone"
                        }`}
                      >
                        {founder.firstName} {founder.lastName}
                      </p>
                      {eliminated ? (
                        <span className="rounded-full border border-[rgba(var(--edge-rgb),0.25)] bg-carbon/40 px-2 py-0.5 font-mono text-[9px] tracking-[0.15em] text-smoke">
                          [{t(locale).chainNode.burned}]
                        </span>
                      ) : (
                        position === 1 && (
                          <span className="rounded-full border border-[rgba(var(--edge-rgb),0.25)] bg-carbon/40 px-2 py-0.5 font-mono text-[9px] tracking-[0.15em] text-ash">
                            [{s.founderBadge}]
                          </span>
                        )
                      )}
                    </div>
                    <p className="mt-0.5 font-mono text-[11px] text-smoke">
                      {eliminated
                        ? s.eliminatedLabel
                        : s.positionLabel(position, chain.length)}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <GoldenChain
                    linkCount={Math.min(chain.length, 5)}
                    className="hidden w-20 sm:flex"
                    animated={false}
                  />
                  <Link
                    href={`/card/${card.id}`}
                    className="btn-metallic-ghost rounded-full px-4 py-2 text-[13px] transition"
                  >
                    {s.viewCard}
                  </Link>
                  <Link
                    href={`/chain/${founder.id}`}
                    className="btn-metallic-silver rounded-full px-4 py-2 text-[13px] font-[500]"
                  >
                    {s.viewChain}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-xs text-smoke underline">
            {s.backHome}
          </Link>
        </div>
      </main>
    </div>
  );
}
