"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Locale, t } from "@/lib/dictionary";
import { isValidCastUrl } from "@/lib/cast";

interface CastPanelProps {
  cardId: number;
  castUrl: string | null;
  /** Kartın sahibi mi — sadece o iliştirip kaldırabilir. */
  isOwner: boolean;
  locale: Locale;
}

/**
 * `TweetPanel`'in Farcaster eşdeğeri. Warpcast'in genel bir gömme widget'ı
 * olmadığı için (X'in widgets.js'inin karşılığı yok) canlı önizleme yerine
 * doğrudan Warpcast'e açılan bir link gösterilir.
 */
export function CastPanel({ cardId, castUrl, isOwner, locale }: CastPanelProps) {
  const s = t(locale).cast;
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(castUrl ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOwner && !castUrl) return null;

  const save = async (next: string | null) => {
    if (next && !isValidCastUrl(next)) {
      setError(s.errorInvalid);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${cardId}/cast`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ castUrl: next }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(
          json.error === "INVALID_CAST_URL"
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

      {castUrl && !editing && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={castUrl}
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
                    setValue(castUrl);
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
        </div>
      )}

      {isOwner && (!castUrl || editing) && (
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

      {!isOwner && !castUrl && (
        <p className="mt-3 text-center text-[12px] text-smoke">{s.empty}</p>
      )}

      {error && <p className="mt-3 text-center text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
