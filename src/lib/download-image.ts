import { toPng } from "html-to-image";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}

/**
 * html-to-image, bir düğümde birden fazla <img> aynı anda ağdan yüklenirken
 * bunları karıştırabiliyor — iki farklı avatarlı bir kartta ikisi de aynı
 * görsele dönüşebiliyor (kütüphanenin kendi bir hatası, kaynak URL'den
 * bağımsız). Bunu tamamen atlatmak için: yakalama sırasında gerçek <img>'leri
 * şeffaf bir piksele çevirip düğümü öyle yakalıyoruz (fotoğraf yokken hata da
 * yok), sonra her görseli kendi konumuna/boyutuna göre ayrıca canvas'a
 * çiziyoruz.
 */
export async function captureNodeAsDataUrl(node: HTMLElement): Promise<string> {
  const pixelRatio = 2;
  const nodeRect = node.getBoundingClientRect();
  // Sadece gerçekten yüklenmiş görselleri işle — yeniden ağdan çekmeye gerek
  // yok, tarayıcı zaten belleğinde tutuyor. src'yi değiştirmeden önce her
  // görseli kendi bitmap'ine anlık olarak kopyalıyoruz ki sonradan src'yi
  // geri koyarken oluşabilecek yeniden-yükleme gecikmesine bağımlı olmayalım.
  const imgEls = Array.from(node.querySelectorAll("img")).filter((img) => img.complete);

  const slots = await Promise.all(
    imgEls.map(async (img) => ({
      bitmap: await createImageBitmap(img).catch(() => null),
      rect: img.getBoundingClientRect(),
      radius: parseFloat(getComputedStyle(img).borderTopLeftRadius) || 0,
    }))
  );

  const originalSrcs = imgEls.map((img) => img.src);
  imgEls.forEach((img) => {
    img.src = TRANSPARENT_PIXEL;
  });

  let baseUrl: string;
  try {
    baseUrl = await withTimeout(
      toPng(node, { pixelRatio }),
      20000,
      "Görsel oluşturma zaman aşımına uğradı, tekrar dene."
    );
  } finally {
    imgEls.forEach((img, i) => {
      img.src = originalSrcs[i];
    });
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(nodeRect.width * pixelRatio);
  canvas.height = Math.round(nodeRect.height * pixelRatio);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context alınamadı.");

  const base = await loadImage(baseUrl);
  ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

  for (const slot of slots) {
    if (!slot.bitmap) continue;
    const naturalW = slot.bitmap.width;
    const naturalH = slot.bitmap.height;

    const x = (slot.rect.left - nodeRect.left) * pixelRatio;
    const y = (slot.rect.top - nodeRect.top) * pixelRatio;
    const w = slot.rect.width * pixelRatio;
    const h = slot.rect.height * pixelRatio;
    const r = Math.min(slot.radius * pixelRatio, w / 2, h / 2);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.clip();

    // object-fit: cover — kaynağı kutuyu dolduracak şekilde ortala/kırp.
    const scale = Math.max(w / naturalW, h / naturalH);
    const dw = naturalW * scale;
    const dh = naturalH * scale;
    ctx.drawImage(slot.bitmap, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
  }

  return canvas.toDataURL("image/png");
}

export async function downloadNodeAsImage(node: HTMLElement, filename: string) {
  const dataUrl = await captureNodeAsDataUrl(node);
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
