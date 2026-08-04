"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import { getAppDomain, getAppUrl } from "@/lib/site-url";
import "@farcaster/auth-kit/styles.css";

const config = {
  domain: getAppDomain(),
  siweUri: getAppUrl(),
};

/** "Sign in with Farcaster" QR/deep-link akışı için gereken context. */
export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
}
