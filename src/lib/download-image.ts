import { toPng } from "html-to-image";

export async function downloadNodeAsImage(node: HTMLElement, filename: string) {
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
  });

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
