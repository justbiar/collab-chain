export interface CardData {
  firstName: string;
  lastName: string;
  xUsername: string;
  role: string;
  /** Ham, virgülle ayrılmış metin (örn. "Solidity, Rust, DeFi"). Render sırasında parseSkills ile diziye çevrilir. */
  skills: string;
  profileImageUrl: string | null;
  logoImageUrl: string | null;
  targetUsername: string;
}

export const EMPTY_CARD_DATA: CardData = {
  firstName: "",
  lastName: "",
  xUsername: "",
  role: "",
  skills: "",
  profileImageUrl: null,
  logoImageUrl: null,
  targetUsername: "",
};

export function parseSkills(skillsInput: string): string[] {
  return skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
