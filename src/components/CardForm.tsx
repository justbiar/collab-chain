"use client";

import { ChangeEvent } from "react";
import { CardData } from "@/lib/types";
import { readFileAsDataUrl } from "@/lib/download-image";

interface CardFormProps {
  data: CardData;
  onChange: (data: CardData) => void;
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

export function CardForm({ data, onChange, lockedUsername }: CardFormProps) {
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
      <h2 className="text-sm font-[450] tracking-[0.2em] text-bone">
        KART BİLGİLERİN
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>İsim</FieldLabel>
          <input
            className={inputClass}
            value={data.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            placeholder="Satoshi"
          />
        </div>
        <div>
          <FieldLabel>Soyisim</FieldLabel>
          <input
            className={inputClass}
            value={data.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            placeholder="Nakamoto"
          />
        </div>
      </div>

      <div>
        <FieldLabel>X (Twitter) Kullanıcı Adı</FieldLabel>
        <input
          className={`${inputClass} ${lockedUsername ? "cursor-not-allowed opacity-60" : ""}`}
          value={data.xUsername}
          onChange={(e) => update({ xUsername: e.target.value })}
          placeholder="@kullaniciadi"
          readOnly={Boolean(lockedUsername)}
        />
        {lockedUsername && (
          <p className="mt-1.5 text-[11px] text-iron">
            Bu davet sadece @{lockedUsername} hesabı için geçerli.
          </p>
        )}
      </div>

      <div>
        <FieldLabel>Rol / Unvan</FieldLabel>
        <input
          className={inputClass}
          value={data.role}
          onChange={(e) => update({ role: e.target.value })}
          placeholder="Founder, CTO, Smart Contract Dev..."
        />
      </div>

      <div>
        <FieldLabel>Yetenekler (virgülle ayır)</FieldLabel>
        <input
          className={inputClass}
          value={data.skills}
          onChange={(e) => update({ skills: e.target.value })}
          placeholder="Solidity, Rust, DeFi, Tokenomics"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Profil Fotoğrafı</FieldLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload("profileImageUrl")}
            className="block w-full text-xs text-iron file:mr-3 file:rounded-full file:border file:border-bone/20 file:bg-transparent file:px-3 file:py-2 file:text-xs file:text-bone hover:file:bg-bone/5"
          />
        </div>
        <div>
          <FieldLabel>Topluluk / Şirket Logosu</FieldLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload("logoImageUrl")}
            className="block w-full text-xs text-iron file:mr-3 file:rounded-full file:border file:border-bone/20 file:bg-transparent file:px-3 file:py-2 file:text-xs file:text-bone hover:file:bg-bone/5"
          />
        </div>
      </div>

      <div className="border-t border-bone/10 pt-4">
        <FieldLabel>Zincirdeki Sıradaki Kişi (Hedef @username)</FieldLabel>
        <input
          className={inputClass}
          value={data.targetUsername}
          onChange={(e) => update({ targetUsername: e.target.value })}
          placeholder="@davetettigin_kisi"
        />
      </div>
    </div>
  );
}
