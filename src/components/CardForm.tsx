"use client";

import { ChangeEvent, useState } from "react";
import {
  CardData,
  FIRST_NAME_MAX,
  LAST_NAME_MAX,
  ROLE_MAX,
  SKILLS_MAX,
  USERNAME_MAX,
} from "@/lib/types";
import { readFileAsDataUrl } from "@/lib/download-image";
import { isAllowedImageFile } from "@/lib/image";
import { BIO_MAX, REASON_MAX } from "@/lib/twitter-share";
import {
  displayHandle,
  farcasterIdentity,
  isFarcasterHandle,
  platformOf,
  profileHref,
  type HandlePlatform,
} from "@/lib/handle";
import { Locale, t } from "@/lib/dictionary";

interface CardFormProps {
  data: CardData;
  onChange: (data: CardData) => void;
  locale: Locale;
  /** X ile giriş yapılan hesabın kullanıcı adı — alan hep buna kilitlenir, başkasının adı yazılamaz. */
  sessionUsername: string;
  /** Bu koleksiyona katılmak isteyenler — hedef alanının altında seçilebilir. */
  joinRequests: string[];
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[11px] tracking-[0.15em] text-iron">
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-[12px] border border-bone/10 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-iron/60 outline-none transition focus:border-bone/40 focus:bg-bone/[0.07]";

export function CardForm({ data, onChange, locale, sessionUsername, joinRequests }: CardFormProps) {
  const s = t(locale).form;
  const [imageError, setImageError] = useState<string | null>(null);
  const [targetPlatform, setTargetPlatform] = useState<HandlePlatform>(
    isFarcasterHandle(data.targetUsername) ? "farcaster" : "x"
  );
  const update = (patch: Partial<CardData>) => onChange({ ...data, ...patch });

  const updateTarget = (raw: string, platform: HandlePlatform = targetPlatform) => {
    const bare = raw.replace(/^@/, "");
    update({ targetUsername: platform === "farcaster" ? farcasterIdentity(bare) : bare });
  };

  const handleImageUpload =
    (field: "profileImageUrl" | "logoImageUrl") =>
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!isAllowedImageFile(file)) {
        setImageError(s.imageInvalid);
        e.target.value = "";
        return;
      }
      setImageError(null);
      const dataUrl = await readFileAsDataUrl(file);
      update({ [field]: dataUrl } as Partial<CardData>);
    };

  return (
    <div className="space-y-5 rounded-[17.6px] border border-bone/10 bg-carbon p-6">
      <h2 className="text-sm font-[450] tracking-[0.2em] text-bone">{s.title}</h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>{s.firstName}</FieldLabel>
          <input
            className={inputClass}
            value={data.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            placeholder="Satoshi"
            maxLength={FIRST_NAME_MAX}
          />
        </div>
        <div>
          <FieldLabel>{s.lastName}</FieldLabel>
          <input
            className={inputClass}
            value={data.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            placeholder="Nakamoto"
            maxLength={LAST_NAME_MAX}
          />
        </div>
      </div>

      <div>
        <FieldLabel>{s.xUsername}</FieldLabel>
        <input
          className={`${inputClass} cursor-not-allowed opacity-60`}
          value={`${isFarcasterHandle(data.xUsername) ? "fc:" : "@"}${displayHandle(data.xUsername)}`}
          placeholder="@username"
          readOnly
        />
        <p className="mt-1.5 text-[11px] text-iron">
          {s.lockedNote(displayHandle(sessionUsername), platformOf(sessionUsername))}
        </p>
      </div>

      <div>
        <FieldLabel>{s.role}</FieldLabel>
        <input
          className={inputClass}
          value={data.role}
          onChange={(e) => update({ role: e.target.value })}
          placeholder={s.rolePlaceholder}
          maxLength={ROLE_MAX}
        />
      </div>

      <div>
        <FieldLabel>{s.skills}</FieldLabel>
        <input
          className={inputClass}
          value={data.skills}
          onChange={(e) => update({ skills: e.target.value })}
          placeholder={s.skillsPlaceholder}
          maxLength={SKILLS_MAX}
        />
      </div>

      <div>
        <FieldLabel>{s.bio}</FieldLabel>
        <textarea
          rows={2}
          maxLength={BIO_MAX}
          className={`${inputClass} resize-none`}
          value={data.bio}
          onChange={(e) => update({ bio: e.target.value })}
          placeholder={s.bioPlaceholder}
        />
        <div className="mt-1.5 flex items-start justify-between gap-3">
          <p className="text-[11px] text-iron">{s.bioHint}</p>
          <span className="shrink-0 font-mono text-[10px] text-iron">
            {data.bio.length}/{BIO_MAX}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>{s.profileImage}</FieldLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload("profileImageUrl")}
            className="block w-full text-xs text-iron file:mr-3 file:rounded-full file:border file:border-bone/20 file:bg-transparent file:px-3 file:py-2 file:text-xs file:text-bone hover:file:bg-bone/5"
          />
        </div>
        <div>
          <FieldLabel>{s.logoImage}</FieldLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload("logoImageUrl")}
            className="block w-full text-xs text-iron file:mr-3 file:rounded-full file:border file:border-bone/20 file:bg-transparent file:px-3 file:py-2 file:text-xs file:text-bone hover:file:bg-bone/5"
          />
        </div>
      </div>
      {imageError && <p className="text-[11px] text-red-400">{imageError}</p>}

      <div className="space-y-4 border-t border-bone/10 pt-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <FieldLabel>{s.targetUsername}</FieldLabel>
            <div className="flex shrink-0 rounded-full border border-bone/10 bg-bone/5 p-0.5">
              {(["x", "farcaster"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setTargetPlatform(p);
                    if (data.targetUsername.trim()) updateTarget(displayHandle(data.targetUsername), p);
                  }}
                  className={`rounded-full px-2.5 py-1 font-mono text-[10px] transition ${
                    targetPlatform === p ? "bg-bone/15 text-bone" : "text-iron hover:text-bone"
                  }`}
                >
                  {p === "x" ? "X" : "Farcaster"}
                </button>
              ))}
            </div>
          </div>
          <input
            className={inputClass}
            value={displayHandle(data.targetUsername)}
            onChange={(e) => updateTarget(e.target.value)}
            maxLength={USERNAME_MAX}
            placeholder={s.targetPlaceholder}
          />

          {joinRequests.length > 0 && (
            <div className="mt-2.5">
              <p className="text-[11px] tracking-[0.1em] text-iron">{s.joinRequestsTitle}</p>
              <p className="mt-1 text-[11px] leading-snug text-iron">{s.joinRequestsHint}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {joinRequests.map((handle) => (
                  <div
                    key={handle}
                    className="flex items-center gap-1 rounded-full border border-bone/10 bg-bone/5 py-1 pr-1 pl-2.5"
                  >
                    <a
                      href={profileHref(handle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] text-bone hover:underline"
                    >
                      @{displayHandle(handle)}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetPlatform(platformOf(handle));
                        update({ targetUsername: handle });
                      }}
                      className="rounded-full border border-bone/20 px-2 py-1 text-[10px] text-bone transition hover:bg-bone/10"
                    >
                      {s.selectAction}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sebep ancak biri etiketlendiyse anlamlı. */}
        {data.targetUsername.trim() && (
          <div>
            <FieldLabel>{s.targetReason}</FieldLabel>
            <textarea
              rows={2}
              maxLength={REASON_MAX}
              className={`${inputClass} resize-none`}
              value={data.targetReason}
              onChange={(e) => update({ targetReason: e.target.value })}
              placeholder={s.targetReasonPlaceholder}
            />
            <div className="mt-1.5 flex items-start justify-between gap-3">
              <p className="text-[11px] text-iron">{s.targetReasonHint}</p>
              <span className="shrink-0 font-mono text-[10px] text-iron">
                {data.targetReason.length}/{REASON_MAX}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
