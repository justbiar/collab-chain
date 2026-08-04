"use client";

import { ChangeEvent, useState } from "react";
import { CollectionFormData } from "@/lib/types";
import { readFileAsDataUrl } from "@/lib/download-image";
import { isAllowedImageFile } from "@/lib/image";
import { Locale, t } from "@/lib/dictionary";

interface Props {
  value: CollectionFormData;
  onChange: (next: CollectionFormData) => void;
  locale: Locale;
}

const inputClass =
  "w-full rounded-[12px] border border-bone/10 bg-bone/5 px-3 py-2 text-sm text-bone placeholder:text-iron/60 outline-none transition focus:border-bone/40 focus:bg-bone/[0.07]";

/** Sadece yeni koleksiyon açılırken (davetsiz akışta) gösterilir. */
export function CollectionSettingsForm({ value, onChange, locale }: Props) {
  const s = t(locale).collection;
  const [imageError, setImageError] = useState<string | null>(null);
  const update = (patch: Partial<CollectionFormData>) => onChange({ ...value, ...patch });

  const modes = [
    { id: "manual" as const, label: s.modeManual, hint: s.modeManualHint },
    { id: "deadline" as const, label: s.modeDeadline, hint: s.modeDeadlineHint },
    { id: "limit" as const, label: s.modeLimit, hint: s.modeLimitHint },
  ];

  const handleCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAllowedImageFile(file)) {
      setImageError(s.imageInvalid);
      e.target.value = "";
      return;
    }
    setImageError(null);
    update({ coverImageUrl: await readFileAsDataUrl(file) });
  };

  return (
    <div className="space-y-5 rounded-[17.6px] border border-bone/10 bg-carbon p-6">
      <h2 className="text-sm font-[450] tracking-[0.2em] text-bone">{s.settingsTitle}</h2>

      {/* Koleksiyonun kendi kimliği */}
      <div>
        <label className="mb-1.5 block text-[11px] tracking-[0.15em] text-iron">
          {s.nameField}
        </label>
        <input
          className={inputClass}
          value={value.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder={s.namePlaceholder}
          maxLength={48}
        />
        <p className="mt-1.5 text-[11px] text-iron">{s.nameHint}</p>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] tracking-[0.15em] text-iron">
          {s.descriptionField}
        </label>
        <textarea
          rows={2}
          maxLength={160}
          className={`${inputClass} resize-none`}
          value={value.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder={s.descriptionPlaceholder}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] tracking-[0.15em] text-iron">
          {s.coverField}
        </label>
        <div className="flex items-center gap-3">
          {value.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value.coverImageUrl}
              alt=""
              className="h-12 w-20 shrink-0 rounded-[8px] object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCover}
            className="block w-full text-xs text-iron file:mr-3 file:rounded-full file:border file:border-bone/20 file:bg-transparent file:px-3 file:py-2 file:text-xs file:text-bone hover:file:bg-bone/5"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-iron">{s.coverHint}</p>
        {imageError && <p className="mt-1 text-[11px] text-red-400">{imageError}</p>}
      </div>

      <div className="border-t border-bone/10 pt-4">
        <p className="mb-2.5 text-[11px] tracking-[0.15em] text-iron">{s.modeLabel}</p>
        <div className="space-y-2">
          {modes.map((mode) => {
            const active = value.mode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => update({ mode: mode.id })}
                aria-pressed={active}
                className={`w-full rounded-[14px] border p-3.5 text-left transition ${
                  active
                    ? "border-[rgba(var(--edge-rgb),0.45)] bg-bone/[0.07]"
                    : "border-bone/10 hover:border-bone/25"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      active ? "border-bone" : "border-bone/30"
                    }`}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-bone" />}
                  </span>
                  <span className="text-[13px] font-[500] text-bone">{mode.label}</span>
                </div>
                <p className="mt-1.5 pl-6.5 text-[11px] leading-snug text-iron">{mode.hint}</p>
              </button>
            );
          })}
        </div>
      </div>

      {value.mode === "deadline" && (
        <div>
          <label className="mb-1.5 block text-[11px] tracking-[0.15em] text-iron">
            {s.deadlineField}
          </label>
          <input
            type="datetime-local"
            className={inputClass}
            value={value.deadlineAt}
            onChange={(e) => update({ deadlineAt: e.target.value })}
          />
        </div>
      )}

      {value.mode === "limit" && (
        <div>
          <label className="mb-1.5 block text-[11px] tracking-[0.15em] text-iron">
            {s.limitField}
          </label>
          <input
            type="number"
            min={2}
            max={10000}
            className={inputClass}
            value={value.memberLimit}
            onChange={(e) => update({ memberLimit: e.target.value })}
            placeholder="100"
          />
        </div>
      )}

      <div className="border-t border-bone/10 pt-4">
        <label className="mb-1.5 block text-[11px] tracking-[0.15em] text-iron">
          {s.startField}
        </label>
        <input
          type="datetime-local"
          className={inputClass}
          value={value.startsAt}
          onChange={(e) => update({ startsAt: e.target.value })}
        />
        <p className="mt-1.5 text-[11px] leading-snug text-iron">{s.startHint}</p>
      </div>
    </div>
  );
}
