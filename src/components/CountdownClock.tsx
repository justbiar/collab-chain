"use client";

import { useEffect, useState } from "react";
import { Locale, t } from "@/lib/dictionary";

interface CountdownClockProps {
  /** Hedef anın epoch ms değeri. */
  deadlineMs: number;
  /**
   * Sunucuda hesaplanmış kalan süre. İlk render'da hem sunucu hem istemci
   * aynı değeri bastığı için hydration uyuşmazlığı olmaz; saymaya istemci
   * bağlandıktan sonra başlar.
   */
  initialRemainingMs: number;
  locale: Locale;
  size?: "sm" | "lg";
}

function split(value: number, pad = 2): string[] {
  return String(Math.max(0, value)).padStart(pad, "0").split("");
}

// Dar ekranda altı kutu + ayraçlar 375px'e sığmadığı için ölçüler duyarlı.
const SIZES = {
  sm: {
    tile: "h-11 w-8 text-[24px] rounded-[8px] sm:h-14 sm:w-10 sm:text-[30px] sm:rounded-[10px]",
    gap: "gap-0.5 sm:gap-1",
    sep: "text-[18px] sm:text-[24px]",
  },
  lg: {
    tile: "h-14 w-10 text-[30px] rounded-[10px] sm:h-20 sm:w-14 sm:text-[44px] sm:rounded-[14px]",
    gap: "gap-1 sm:gap-1.5",
    sep: "text-[24px] sm:text-[32px]",
  },
} as const;

function Group({ digits, label, size }: { digits: string[]; label: string; size: "sm" | "lg" }) {
  const s = SIZES[size];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`flex ${s.gap}`}>
        {digits.map((d, i) => (
          <span
            key={i}
            className={`flip-tile flex items-center justify-center font-[700] tabular-nums ${s.tile}`}
          >
            {d}
          </span>
        ))}
      </div>
      <span className="font-mono text-[9px] tracking-[0.2em] text-smoke">{label}</span>
    </div>
  );
}

/**
 * Split-flap tarzı geri sayım. Saat, dakika ve saniye yan yana dizilir.
 * Saat 99'u aşarsa kutu sayısı kendiliğinden artar (uzun süreli koleksiyonlar).
 */
export function CountdownClock({
  deadlineMs,
  initialRemainingMs,
  locale,
  size = "sm",
}: CountdownClockProps) {
  const s = t(locale).countdown;
  const [remaining, setRemaining] = useState(initialRemainingMs);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadlineMs - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineMs]);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const sep = SIZES[size].sep;

  return (
    <div
      className="flex items-start justify-center gap-1.5 sm:gap-2.5"
      role="timer"
      aria-live="off"
    >
      <Group digits={split(hours)} label={s.hours} size={size} />
      <span className={`flip-separator ${sep}`}>:</span>
      <Group digits={split(minutes)} label={s.minutes} size={size} />
      <span className={`flip-separator ${sep}`}>:</span>
      <Group digits={split(seconds)} label={s.seconds} size={size} />
    </div>
  );
}
