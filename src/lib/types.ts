export interface CardData {
  firstName: string;
  lastName: string;
  xUsername: string;
  role: string;
  /** Ham, virgülle ayrılmış metin (örn. "Solidity, Rust, DeFi"). Render sırasında parseSkills ile diziye çevrilir. */
  skills: string;
  /** Kısa kendini tanıtma — paylaşım tweet'ine girer. */
  bio: string;
  profileImageUrl: string | null;
  logoImageUrl: string | null;
  targetUsername: string;
  /** Etiketlenen kişi neden takip edilmeli — paylaşım tweet'ine girer. */
  targetReason: string;
}

export const EMPTY_CARD_DATA: CardData = {
  firstName: "",
  lastName: "",
  xUsername: "",
  role: "",
  skills: "",
  bio: "",
  profileImageUrl: null,
  logoImageUrl: null,
  targetUsername: "",
  targetReason: "",
};

/** Yeni koleksiyon açılırken sorulan ayarlar — form durumu olarak string tutulur. */
export interface CollectionFormData {
  /** Koleksiyonun adı — kurucunun adı yerine bu gösterilir. */
  name: string;
  description: string;
  coverImageUrl: string | null;
  mode: "manual" | "deadline" | "limit";
  /** `datetime-local` girdisi. */
  deadlineAt: string;
  memberLimit: string;
  startsAt: string;
}

export const EMPTY_COLLECTION_FORM: CollectionFormData = {
  name: "",
  description: "",
  coverImageUrl: null,
  mode: "manual",
  deadlineAt: "",
  memberLimit: "",
  startsAt: "",
};

export function parseSkills(skillsInput: string): string[] {
  return skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
