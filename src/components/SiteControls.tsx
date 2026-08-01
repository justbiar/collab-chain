"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { t, type Locale } from "@/lib/dictionary";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

export function SiteControls({
  locale,
  authSlot,
}: {
  locale: Locale;
  /** Sunucuda render edilen oturum göstergesi (giriş / profil / çıkış). */
  authSlot?: React.ReactNode;
}) {
  const router = useRouter();
  const s = t(locale);
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
    <div className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div className="glass-panel flex w-full max-w-3xl items-center justify-between gap-4 rounded-full py-2 pl-5 pr-2 shadow-2xl">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-mono text-[11px] font-[500] tracking-[0.15em] text-bone transition hover:text-chrome"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={56}
            className="shrink-0 h-16 w-auto -my-5"
          />
          {/* Logo görselinde site adı zaten mevcut */}
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/rules"
            className="hidden rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.15em] text-smoke transition hover:text-bone sm:block"
          >
            {s.rulesPage.nav}
          </Link>

          <div className="flex rounded-full bg-black/20 p-1">
            <button
              onClick={() => switchLocale("tr")}
              aria-pressed={locale === "tr"}
              className={`rounded-full px-3 py-1 font-mono text-[11px] font-[500] tracking-wide transition ${
                locale === "tr"
                  ? "btn-metallic-silver"
                  : "text-smoke hover:text-bone"
              }`}
            >
              {locale === "tr" ? "[TR]" : "TR"}
            </button>
            <button
              onClick={() => switchLocale("en")}
              aria-pressed={locale === "en"}
              className={`rounded-full px-3 py-1 font-mono text-[11px] font-[500] tracking-wide transition ${
                locale === "en"
                  ? "btn-metallic-silver"
                  : "text-smoke hover:text-bone"
              }`}
            >
              {locale === "en" ? "[EN]" : "EN"}
            </button>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-full text-bone transition hover:bg-black/20"
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
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
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </button>

          {authSlot && (
            <>
              <span
                aria-hidden
                className="h-5 w-px shrink-0 bg-[rgba(var(--edge-rgb),0.18)]"
              />
              {authSlot}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
