"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Locale, t } from "@/lib/dictionary";
import { USERNAME_MAX } from "@/lib/types";
import { displayHandle, farcasterIdentity, isFarcasterHandle, type HandlePlatform } from "@/lib/handle";
import type { CollectionPhase } from "@/lib/collection";

interface Grant {
  xUsername: string;
  grantedAt: string;
}

interface CollectionSummary {
  id: number;
  title: string;
  xUsername: string;
  phase: CollectionPhase;
}

interface Props {
  grants: Grant[];
  collections: CollectionSummary[];
  locale: Locale;
}

function phaseLabel(phase: CollectionPhase, labels: ReturnType<typeof t>["collection"]): string {
  switch (phase) {
    case "upcoming":
      return labels.filterUpcoming;
    case "ongoing":
      return labels.filterOngoing;
    case "past":
      return labels.filterPast;
  }
}

export function AdminPanel({ grants, collections, locale }: Props) {
  const s = t(locale).admin;
  const collectionLabels = t(locale).collection;
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [platform, setPlatform] = useState<HandlePlatform>("x");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleError = (json: { error?: string }) =>
    setError(json.error === "RATE_LIMITED" ? s.errorRateLimited : s.errorGeneric);

  const grant = async () => {
    const target = username.trim();
    if (!target) {
      setError(s.usernameRequired);
      return;
    }
    setBusy("grant");
    setError(null);
    try {
      const res = await fetch("/api/admin/grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: platform === "farcaster" ? farcasterIdentity(target) : target,
        }),
      });
      if (!res.ok) {
        handleError(await res.json().catch(() => ({})));
        return;
      }
      setUsername("");
      router.refresh();
    } catch {
      setError(s.errorConnection);
    } finally {
      setBusy(null);
    }
  };

  const revoke = async (handle: string) => {
    if (!window.confirm(s.confirmRevoke(handle))) return;
    setBusy(`revoke-${handle}`);
    setError(null);
    try {
      const res = await fetch(`/api/admin/grants/${encodeURIComponent(handle)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        handleError(await res.json().catch(() => ({})));
        return;
      }
      router.refresh();
    } catch {
      setError(s.errorConnection);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="metallic-panel mx-auto mb-10 max-w-4xl rounded-[22px] px-6 py-6">
      <p className="text-center font-mono text-[11px] tracking-[0.2em] text-ash">[{s.title}]</p>
      <p className="mt-1.5 text-center text-[12px] text-smoke">{s.subtitle}</p>

      <div className="mt-5 border-t border-[rgba(var(--edge-rgb),0.12)] pt-4">
        <p className="font-mono text-[10px] tracking-[0.18em] text-smoke">{s.grantSectionTitle}</p>
        <p className="mt-1 text-[11px] leading-snug text-smoke">{s.grantSectionHint}</p>

        <div className="mt-3 flex gap-2">
          <div className="flex shrink-0 rounded-full border border-bone/10 bg-bone/5 p-0.5">
            {(["x", "farcaster"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`rounded-full px-3 py-1.5 font-mono text-[11px] transition ${
                  platform === p ? "btn-metallic-silver" : "text-smoke hover:text-bone"
                }`}
              >
                {p === "x" ? "X" : "FC"}
              </button>
            ))}
          </div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@kullaniciadi"
            maxLength={USERNAME_MAX}
            className="w-full rounded-[12px] border border-bone/10 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-iron/60 outline-none transition focus:border-bone/40 focus:bg-bone/[0.07]"
          />
          <button
            disabled={busy !== null}
            onClick={grant}
            className="btn-metallic-silver shrink-0 rounded-full px-5 py-2 text-[13px] font-[500] disabled:opacity-50"
          >
            {busy === "grant" ? s.working : s.grantAction}
          </button>
        </div>

        {grants.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {grants.map((g) => (
              <button
                key={g.xUsername}
                disabled={busy !== null}
                onClick={() => revoke(g.xUsername)}
                className="btn-metallic-ghost rounded-full px-3 py-1.5 font-mono text-[11px] disabled:opacity-50"
              >
                {busy === `revoke-${g.xUsername}`
                  ? s.working
                  : `${isFarcasterHandle(g.xUsername) ? "fc:" : "@"}${displayHandle(g.xUsername)} ✕`}
              </button>
            ))}
          </div>
        )}
      </div>

      {collections.length > 0 && (
        <div className="mt-5 border-t border-[rgba(var(--edge-rgb),0.12)] pt-4">
          <p className="font-mono text-[10px] tracking-[0.18em] text-smoke">
            {s.collectionsSectionTitle}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/chain/${c.id}`}
                className="btn-metallic-ghost rounded-full px-3 py-1.5 font-mono text-[11px]"
              >
                {c.title} · @{displayHandle(c.xUsername)} · {phaseLabel(c.phase, collectionLabels)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-center text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
