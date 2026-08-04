"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: { widgets?: { load: (el?: HTMLElement | null) => void } };
  }
}

const WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

/**
 * Bir tweet'i X'in kendi gömülü görünümüyle basar — beğeni/retweet sayıları
 * canlı olarak X'in widget'ından gelir, biz hiçbir X API verisi çekmeyiz.
 */
export function TweetEmbed({ url }: { url: string }) {
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme =
      document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

    const holder = holderRef.current;
    if (!holder) return;

    holder.innerHTML = "";
    const quote = document.createElement("blockquote");
    quote.className = "twitter-tweet";
    quote.setAttribute("data-theme", theme);
    quote.setAttribute("data-dnt", "true");
    const anchor = document.createElement("a");
    anchor.href = url;
    quote.appendChild(anchor);
    holder.appendChild(quote);

    if (window.twttr?.widgets) {
      window.twttr.widgets.load(holder);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGETS_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => window.twttr?.widgets?.load(holder), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = WIDGETS_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, [url]);

  return <div ref={holderRef} className="flex justify-center [&_.twitter-tweet]:!my-0" />;
}
