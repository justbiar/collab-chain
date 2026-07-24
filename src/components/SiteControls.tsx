"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/dictionary";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function SiteControls({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with DOM/localStorage set by the pre-hydration theme script
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage unavailable — theme just won't persist
    }
  };

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    setCookie("locale", next);
    router.refresh();
  };

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
      <div className="flex rounded-full border border-bone/15 bg-carbon/80 p-0.5 backdrop-blur">
        <button
          onClick={() => switchLocale("tr")}
          aria-pressed={locale === "tr"}
          className={`rounded-full px-2.5 py-1 text-[11px] font-[500] tracking-wide transition ${
            locale === "tr" ? "bg-bone text-carbon" : "text-iron hover:text-bone"
          }`}
        >
          TR
        </button>
        <button
          onClick={() => switchLocale("en")}
          aria-pressed={locale === "en"}
          className={`rounded-full px-2.5 py-1 text-[11px] font-[500] tracking-wide transition ${
            locale === "en" ? "bg-bone text-carbon" : "text-iron hover:text-bone"
          }`}
        >
          EN
        </button>
      </div>
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="flex h-7 w-7 items-center justify-center rounded-full border border-bone/15 bg-carbon/80 text-bone backdrop-blur transition hover:bg-bone/10"
      >
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3.5 w-3.5"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              strokeLinecap="round"
              d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3.5 w-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
