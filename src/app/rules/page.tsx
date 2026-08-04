import Link from "next/link";
import { INVITE_EXPIRY_HOURS, TURN_EXPIRY_HOURS } from "@/lib/chain";
import { getLocale, t } from "@/lib/i18n";
import { TweetEmbed } from "@/components/TweetEmbed";

const EXAMPLE_TWEET_URL = "https://x.com/justbiar/status/2083919544498737327";

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const locale = await getLocale();
  const s = t(locale).rulesPage;

  return (
    <div className="bg-blueprint-grid relative min-h-screen w-full overflow-x-hidden px-4 pt-28 pb-20 sm:px-8 sm:pt-24">
      <div aria-hidden className="ambient-blue-aura" />
      <div aria-hidden className="ambient-blueprint-aura" />

      <header className="relative z-10 mx-auto mb-16 max-w-3xl text-center">
        <p className="font-mono text-[11px] tracking-[0.3em] text-smoke">{s.eyebrow}</p>
        <h1 className="mt-4 text-[48px] font-[800] leading-[1.02] tracking-[-0.04em] text-gradient-ice sm:text-[68px]">
          {s.title}
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-ash">{s.intro}</p>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl">
        {/* Dört temel kural */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {s.steps.map((step) => (
            <div key={step.n} className="metallic-panel rounded-[22px] p-6">
              <span className="font-mono text-[28px] font-[800] leading-none tracking-[-0.04em] text-gradient-ice">
                {step.n}
              </span>
              <p className="mt-3 text-[16px] font-[600] tracking-[-0.01em] text-bone">
                {step.title}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-smoke">{step.body}</p>
            </div>
          ))}
        </div>

        {/* Süre özeti */}
        <div className="metallic-panel mt-4 flex flex-col items-center gap-4 rounded-[22px] px-6 py-6 sm:flex-row sm:justify-center sm:gap-10">
          <div className="text-center">
            <p className="font-mono text-[34px] font-[800] leading-none tracking-[-0.04em] text-gradient-ice">
              {INVITE_EXPIRY_HOURS}s
            </p>
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-smoke">
              {s.clockAccept}
            </p>
          </div>
          <div aria-hidden className="h-px w-16 bg-[rgba(var(--edge-rgb),0.2)] sm:h-12 sm:w-px" />
          <div className="text-center">
            <p className="font-mono text-[34px] font-[800] leading-none tracking-[-0.04em] text-gradient-ice">
              {TURN_EXPIRY_HOURS}s
            </p>
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-smoke">
              {s.clockTag}
            </p>
          </div>
        </div>

        {/* Adım adım örnek */}
        <p className="mt-16 text-center font-mono text-[11px] tracking-[0.3em] text-smoke">
          {s.exampleTitle}
        </p>
        <p className="mx-auto mt-3 mb-7 max-w-lg text-center text-[14px] leading-relaxed text-ash">
          {s.exampleLead}
        </p>

        <ol className="relative space-y-3">
          {s.example.map((row, i) => (
            <li key={row.label} className="metallic-panel flex gap-4 rounded-[20px] p-5">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bone font-mono text-[12px] font-[700] text-carbon">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[11px] tracking-[0.15em] text-ash uppercase">
                  {row.label}
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-smoke">{row.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Gerçek örnek tweet */}
        <div className="mt-16">
          <p className="text-center font-mono text-[11px] tracking-[0.3em] text-smoke">
            {s.exampleTweetTitle}
          </p>
          <p className="mx-auto mt-3 mb-7 max-w-lg text-center text-[14px] leading-relaxed text-ash">
            {s.exampleTweetLead}
          </p>
          <TweetEmbed url={EXAMPLE_TWEET_URL} />
        </div>

        {/* Tweet iliştirme */}
        <div className="metallic-panel mt-16 rounded-[22px] p-7 text-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-ash">{s.tweetTitle}</p>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-smoke">
            {s.tweetBody}
          </p>
        </div>

        <div className="mt-14 text-center">
          <Link href="/" className="text-xs text-smoke underline">
            {s.ctaBack}
          </Link>
        </div>
      </main>
    </div>
  );
}
