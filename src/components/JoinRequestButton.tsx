"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Locale, t } from "@/lib/dictionary";

interface Props {
  collectionId: number;
  /** Sunucuda hesaplanmış başlangıç durumu — istemci sadece devralır. */
  initialRequested: boolean;
  locale: Locale;
}

const ERROR_KEYS = {
  ALREADY_MEMBER: "errorAlreadyMember",
  USER_BANNED: "errorBanned",
  COLLECTION_NOT_STARTED: "errorNotStarted",
  COLLECTION_CLOSED: "errorClosed",
  RATE_LIMITED: "errorRateLimited",
} as const;

export function JoinRequestButton({ collectionId, initialRequested, locale }: Props) {
  const s = t(locale).joinRequest;
  const router = useRouter();
  const [requested, setRequested] = useState(initialRequested);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errorMessage = (code: string | undefined) => {
    const key = code ? ERROR_KEYS[code as keyof typeof ERROR_KEYS] : undefined;
    return key ? s[key] : s.errorGeneric;
  };

  const send = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/collections/${collectionId}/requests`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(errorMessage(json.error));
        return;
      }
      setRequested(true);
      router.refresh();
    } catch {
      setError(s.errorConnection);
    } finally {
      setBusy(false);
    }
  };

  const withdraw = async () => {
    if (!window.confirm(s.confirmWithdraw)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/collections/${collectionId}/requests`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(errorMessage(json.error));
        return;
      }
      setRequested(false);
      router.refresh();
    } catch {
      setError(s.errorConnection);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {requested ? (
        <>
          <p className="text-[12px] text-smoke">{s.sentNote}</p>
          <button
            disabled={busy}
            onClick={withdraw}
            className="btn-metallic-ghost rounded-full px-4 py-2 text-[13px] disabled:opacity-50"
          >
            {busy ? s.working : s.withdrawButton}
          </button>
        </>
      ) : (
        <button
          disabled={busy}
          onClick={send}
          className="btn-metallic-silver rounded-full px-5 py-2 text-[13px] font-[500] disabled:opacity-50"
        >
          {busy ? s.working : s.sendButton}
        </button>
      )}
      {error && <p className="text-[12px] text-red-400">{error}</p>}
    </div>
  );
}
