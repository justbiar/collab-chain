"use client";

import { useState } from "react";
import { SignInButton, type StatusAPIResponse } from "@farcaster/auth-kit";
import { signIn } from "next-auth/react";

interface Props {
  callbackUrl?: string;
  className?: string;
}

/**
 * Warpcast'te onaylanan SIWF mesajını next-auth'un "farcaster" Credentials
 * provider'ına iletir (bkz. src/auth.ts) — imza orada sunucu tarafında
 * doğrulanır, burada sadece client'ın QR/deep-link akışı yönetilir. Buton
 * kendi Farcaster markalı görünümünü (mor buton + QR modal) auth-kit'ten alır.
 */
export function FarcasterSignInButton({ callbackUrl, className }: Props) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={className}>
      <SignInButton
        hideSignOut
        onSuccess={async (res: StatusAPIResponse) => {
          if (!res.message || !res.signature || !res.nonce) {
            setError("INVALID_RESPONSE");
            return;
          }
          const result = await signIn("farcaster", {
            message: res.message,
            signature: res.signature,
            nonce: res.nonce,
            redirect: false,
          });
          if (result?.error) {
            setError(result.error);
            return;
          }
          window.location.href = callbackUrl ?? window.location.href;
        }}
        onError={() => setError("FARCASTER_ERROR")}
      />
      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
