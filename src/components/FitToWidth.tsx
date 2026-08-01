"use client";

import { useEffect, useRef, useState } from "react";

interface FitToWidthProps {
  /** İçeriğin tasarlandığı sabit genişlik (px). */
  designWidth: number;
  children: React.ReactNode;
}

/**
 * Sabit genişlikli tasarım öğelerini (koleksiyon kartı, zincir paylaşım
 * görseli) dar ekranda kırpmadan küçültür.
 *
 * Ölçekleme üst öğeye uygulandığı için içerideki düğümün kendi ölçüsü
 * değişmez — `html-to-image` ile alınan PNG tam çözünürlükte kalır.
 */
export function FitToWidth({ designWidth, children }: FitToWidthProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;

    const update = () => {
      const available = o.clientWidth;
      const natural = i.offsetHeight;
      // Sekme gizliyken (display:none) ikisi de 0 olur. Yarım ölçümle
      // yüksekliği sıfırlarsak kutu çöker ve içerik altındakilerin üstüne
      // biner — bu yüzden düzen oturana kadar dokunmuyoruz.
      if (available === 0 || natural === 0) return;

      const next = Math.min(1, available / designWidth);
      setScale(next);
      setHeight(natural * next);
    };

    update();
    // Sekme görünür olduğu karede ölçüler henüz yerleşmemiş olabiliyor.
    const raf = requestAnimationFrame(update);

    const observer = new ResizeObserver(update);
    observer.observe(o);
    observer.observe(i);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [designWidth]);

  return (
    <div
      ref={outer}
      className="flex w-full justify-center"
      // Küçülen içerik kadar yer kaplasın; aksi halde altında boşluk kalırdı.
      style={height != null ? { height } : undefined}
    >
      <div
        ref={inner}
        className="shrink-0 origin-top"
        style={{ width: designWidth, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
