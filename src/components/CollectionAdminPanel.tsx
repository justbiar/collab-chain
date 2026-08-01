"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Locale, t } from "@/lib/dictionary";
import type { Card } from "@/generated/prisma/client";

interface Props {
  collectionId: number;
  /** Yaşayan yol — kurucu hariç herkes çıkarılabilir. */
  path: Card[];
  /** Kapanmış koleksiyonda sadece silme kalır. */
  isOpen: boolean;
  locale: Locale;
}

export function CollectionAdminPanel({ collectionId, path, isOpen, locale }: Props) {
  const s = t(locale).collection;
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const removable = path.filter((c) => c.parentId != null);

  const run = async (
    key: string,
    confirmText: string,
    request: () => Promise<Response>,
    afterDelete = false
  ) => {
    if (!window.confirm(confirmText)) return;

    setBusy(key);
    setError(null);
    try {
      const res = await request();
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? s.errorGeneric);
        return;
      }
      if (afterDelete) router.push("/");
      else router.refresh();
    } catch {
      setError(s.errorGeneric);
    } finally {
      setBusy(null);
    }
  };

  const patch = (body: object) =>
    fetch(`/api/collections/${collectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  return (
    <div className="metallic-panel mx-auto mb-6 max-w-xl rounded-[22px] px-6 py-5">
      <p className="text-center font-mono text-[11px] tracking-[0.2em] text-ash">
        [{s.adminTitle}]
      </p>
      <p className="mt-1.5 text-center text-[12px] text-smoke">{s.adminNote}</p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        {isOpen && (
          <>
            <button
              disabled={busy !== null}
              onClick={() =>
                run("complete", s.confirmComplete, () => patch({ action: "complete" }))
              }
              className="btn-metallic-silver rounded-full px-5 py-2 text-[13px] font-[500] disabled:opacity-50"
            >
              {busy === "complete" ? s.working : s.actionComplete}
            </button>
            <button
              disabled={busy !== null}
              onClick={() => run("cancel", s.confirmCancel, () => patch({ action: "cancel" }))}
              className="btn-metallic-ghost rounded-full px-4 py-2 text-[13px] disabled:opacity-50"
            >
              {busy === "cancel" ? s.working : s.actionCancel}
            </button>
          </>
        )}

        <button
          disabled={busy !== null}
          onClick={() =>
            run(
              "delete",
              s.confirmDelete,
              () => fetch(`/api/collections/${collectionId}`, { method: "DELETE" }),
              true
            )
          }
          className="rounded-full border border-red-500/40 px-4 py-2 text-[13px] text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          {busy === "delete" ? s.working : s.actionDelete}
        </button>
      </div>

      {isOpen && removable.length > 0 && (
        <div className="mt-5 border-t border-[rgba(var(--edge-rgb),0.12)] pt-4">
          <p className="font-mono text-[10px] tracking-[0.18em] text-smoke">{s.removeTitle}</p>
          <p className="mt-1.5 text-[11px] leading-snug text-smoke">{s.removeHint}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {removable.map((member) => (
              <button
                key={member.id}
                disabled={busy !== null}
                onClick={() =>
                  run(
                    `remove-${member.id}`,
                    s.confirmRemove(member.xUsername),
                    () => patch({ action: "remove", memberId: member.id })
                  )
                }
                className="btn-metallic-ghost rounded-full px-3 py-1.5 font-mono text-[11px] disabled:opacity-50"
              >
                {busy === `remove-${member.id}` ? s.working : `@${member.xUsername} ✕`}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-center text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
