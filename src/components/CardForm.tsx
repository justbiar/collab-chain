"use client";

import { ChangeEvent } from "react";
import { CardData } from "@/lib/types";
import { readFileAsDataUrl } from "@/lib/download-image";
import { BIO_MAX, REASON_MAX } from "@/lib/twitter-share";
import { Locale, t } from "@/lib/dictionary";

interface CardFormProps {
  data: CardData;
  onChange: (data: CardData) => void;
  locale: Locale;
  /** Davetle gelen kullanıcı için X adını sabitler; başka bir isimle kabul edilmesini engeller. */
  lockedUsername?: string | null;
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

export function CardForm({ data, onChange, locale, lockedUsername }: CardFormProps) {
  const s = t(locale).form;
  const update = (patch: Partial<CardData>) => onChange({ ...data, ...patch });

  const handleImageUpload =
    (field: "profileImageUrl" | "logoImageUrl") =>
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
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
          />
        </div>
        <div>
          <FieldLabel>{s.lastName}</FieldLabel>
          <input
            className={inputClass}
            value={data.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            placeholder="Nakamoto"
          />
        </div>
      </div>

      <div>
        <FieldLabel>{s.xUsername}</FieldLabel>
        <input
          className={`${inputClass} ${lockedUsername ? "cursor-not-allowed opacity-60" : ""}`}
          value={data.xUsername}
          onChange={(e) => update({ xUsername: e.target.value })}
          placeholder="@username"
          readOnly={Boolean(lockedUsername)}
        />
        {lockedUsername && (
          <p className="mt-1.5 text-[11px] text-iron">{s.lockedNote(lockedUsername)}</p>
        )}
      </div>

      <div>
        <FieldLabel>{s.role}</FieldLabel>
        <input
          className={inputClass}
          value={data.role}
          onChange={(e) => update({ role: e.target.value })}
          placeholder={s.rolePlaceholder}
        />
      </div>

      <div>
        <FieldLabel>{s.skills}</FieldLabel>
        <input
          className={inputClass}
          value={data.skills}
          onChange={(e) => update({ skills: e.target.value })}
          placeholder={s.skillsPlaceholder}
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

      <div className="space-y-4 border-t border-bone/10 pt-4">
        <div>
          <FieldLabel>{s.targetUsername}</FieldLabel>
          <input
            className={inputClass}
            value={data.targetUsername}
            onChange={(e) => update({ targetUsername: e.target.value })}
            placeholder={s.targetPlaceholder}
          />
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
