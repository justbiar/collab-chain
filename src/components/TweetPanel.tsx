"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Locale, t } from "@/lib/dictionary";
import { isValidTweetUrl } from "@/lib/tweet";
import { TweetEmbed } from "./TweetEmbed";

interface TweetPanelProps {
  cardId: number;
  tweetUrl: string | null;
  /** Kartın sahibi mi — sadece o iliştirip kaldırabilir. */
  isOwner: boolean;
  locale: Locale;
}

export function TweetPanel({ cardId, tweetUrl, isOwner, locale }: TweetPanelProps) {
  const s = t(locale).tweet;
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(tweetUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sahibi değilse ve tweet yoksa gösterilecek bir şey yok.
  if (!isOwner && !tweetUrl) return null;

  const save = async (next: string | null) => {
    if (next && !isValidTweetUrl(next)) {
      setError(s.errorInvalid);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${cardId}/tweet`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweetUrl: next }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(
          json.error === "INVALID_TWEET_URL"
            ? s.errorInvalid
            : json.error === "RATE_LIMITED"
              ? s.errorRateLimited
              : s.errorGeneric
        );
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setError(s.errorConnection);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="metallic-panel w-full max-w-md rounded-[22px] p-6">
      <p className="text-center font-mono text-[11px] tracking-[0.2em] text-smoke">{s.title}</p>

      {tweetUrl && !editing && (
        <div className="mt-4 space-y-3">
          <TweetEmbed url={tweetUrl} />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-metallic-silver rounded-full px-5 py-2 text-[13px] font-[500]"
            >
              {s.view}
            </a>
            {isOwner && (
              <>
                <button
                  onClick={() => {
                    setValue(tweetUrl);
                    setEditing(true);
                  }}
                  className="btn-metallic-ghost rounded-full px-4 py-2 text-[13px]"
                >
                  {s.change}
                </button>
                <button
                  onClick={() => save(null)}
                  disabled={isSaving}
                  className="text-[12px] text-smoke underline disabled:opacity-50"
                >
                  {s.remove}
                </button>
              </>
            )}
          </div>

          <p className="text-center text-[11px] leading-snug text-smoke">{s.metricsNote}</p>
        </div>
      )}

      {isOwner && (!tweetUrl || editing) && (
        <div className="mt-4 space-y-3">
          <p className="text-center text-[12px] leading-snug text-smoke">{s.ownerHint}</p>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={s.placeholder}
            className="w-full rounded-[12px] border border-[rgba(var(--edge-rgb),0.15)] bg-carbon/40 px-3 py-2 text-sm text-bone outline-none transition placeholder:text-iron focus:border-[rgba(var(--edge-rgb),0.4)]"
          />
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => save(value)}
              disabled={isSaving}
              className="btn-metallic-silver rounded-full px-5 py-2 text-[13px] font-[500] disabled:opacity-50"
            >
              {isSaving ? s.saving : s.save}
            </button>
            {editing && (
              <button
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="text-[12px] text-smoke underline"
              >
                {s.cancel}
              </button>
            )}
          </div>
        </div>
      )}

      {!isOwner && !tweetUrl && (
        <p className="mt-3 text-center text-[12px] text-smoke">{s.empty}</p>
      )}

      {error && <p className="mt-3 text-center text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
