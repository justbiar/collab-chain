"use client";

import { useEffect } from "react";

/**
 * Warpcast/Base App içinde Mini App olarak açıldığında splash ekranını
 * kapatır. Normal tarayıcıda (Mini App host'u yokken) `isInMiniApp()` false
 * döner ve hiçbir şey yapılmaz — sitenin dışarıdan da normal çalışmasını
 * bozmaz.
 */
export function MiniAppReady() {
  useEffect(() => {
    let cancelled = false;

    import("@farcaster/miniapp-sdk")
      .then(async ({ sdk }) => {
        if (cancelled) return;
        if (await sdk.isInMiniApp()) {
          await sdk.actions.ready();
        }
      })
      .catch(() => {
        // Mini App SDK'sı yüklenemezse (host yok, ağ hatası vb.) sessizce geç.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
