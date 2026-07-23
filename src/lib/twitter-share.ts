export function buildChainTweetIntent(targetUsername: string, siteUrl: string) {
  const handle = targetUsername.replace(/^@/, "").trim();
  const text = handle
    ? `Ben Web3 zincirine katıldım! Sıra sende @${handle}, kendi kartını oluştur ve zinciri devam ettir! 🔗`
    : `Ben Web3 zincirine katıldım! Kendi kartını oluştur ve zinciri devam ettir! 🔗`;

  const params = new URLSearchParams({ text, url: siteUrl });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function generatePlayerId(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const id = Math.abs(hash) % 1000000;
  return id.toString().padStart(6, "0");
}

export function generateBarcodeWidths(seed: string, bars = 28) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const widths: number[] = [];
  let state = Math.abs(hash) || 42;
  for (let i = 0; i < bars; i++) {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    widths.push(1 + (state % 3));
  }
  return widths;
}
