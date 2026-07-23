"use client";

import { useState } from "react";
import { xAvatarUrl } from "@/lib/avatar";

interface AvatarProps {
  imageUrl: string | null;
  username: string;
  fallback: React.ReactNode;
  className?: string;
}

export function Avatar({ imageUrl, username, fallback, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = imageUrl || xAvatarUrl(username);

  if (!resolvedSrc || failed) {
    return <>{fallback}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={username || "avatar"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
