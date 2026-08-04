"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { t, type Locale } from "@/lib/dictionary";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
}

function ThemeIcon({ theme, className }: { theme: "dark" | "light"; className: string }) {
  return theme === "dark" ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
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
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with DOM/localStorage set by the pre-hydration theme script
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  // Panel açıkken arkadaki sayfa kaymasın diye gövde scroll'u kilitlenir.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

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
    <>
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

          {/* Masaüstü: tüm kontroller tek sırada. Mobilde yer yetmediği ve
              Farcaster'ın kendi uygulama çerçevesinde ekran daha da dar
              kaldığı için ayrı bir açılır panel kullanılıyor (aşağıda). */}
          <div className="hidden min-w-0 shrink items-center gap-2 sm:flex">
            <Link
              href="/rules"
              className="rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.15em] text-smoke transition hover:text-bone"
            >
              {s.rulesPage.nav}
            </Link>

            <div className="flex shrink-0 rounded-full bg-black/20 p-1">
              <button
                onClick={() => switchLocale("tr")}
                aria-pressed={locale === "tr"}
                className={`rounded-full px-3 py-1 font-mono text-[11px] font-[500] tracking-wide transition ${
                  locale === "tr" ? "btn-metallic-silver" : "text-smoke hover:text-bone"
                }`}
              >
                {locale === "tr" ? "[TR]" : "TR"}
              </button>
              <button
                onClick={() => switchLocale("en")}
                aria-pressed={locale === "en"}
                className={`rounded-full px-3 py-1 font-mono text-[11px] font-[500] tracking-wide transition ${
                  locale === "en" ? "btn-metallic-silver" : "text-smoke hover:text-bone"
                }`}
              >
                {locale === "en" ? "[EN]" : "EN"}
              </button>
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-bone transition hover:bg-black/20"
            >
              <ThemeIcon theme={theme} className="h-4 w-4" />
            </button>

            {authSlot && (
              <>
                <span
                  aria-hidden
                  className="h-5 w-px shrink-0 bg-[rgba(var(--edge-rgb),0.18)]"
                />
                <div className="flex shrink-0 items-center">{authSlot}</div>
              </>
            )}
          </div>

          {/* Mobil: hamburger, sağdan açılan panele açılır. */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-bone transition hover:bg-black/20 sm:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobil menü paneli */}
      <div
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-[70] flex w-[82%] max-w-[320px] flex-col gap-5 bg-carbon p-6 pt-8 shadow-2xl transition-transform duration-300 ease-out sm:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-[0.2em] text-smoke">MENU</span>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-bone transition hover:bg-black/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <Link
          href="/rules"
          onClick={() => setMenuOpen(false)}
          className="rounded-[14px] bg-bone/5 px-4 py-3 font-mono text-[13px] tracking-[0.1em] text-bone transition hover:bg-bone/10"
        >
          {s.rulesPage.nav}
        </Link>

        <div className="flex items-center justify-between rounded-[14px] bg-bone/5 px-4 py-3">
          <span className="font-mono text-[11px] tracking-[0.15em] text-smoke">LANG</span>
          <div className="flex shrink-0 rounded-full bg-black/20 p-1">
            <button
              onClick={() => switchLocale("tr")}
              aria-pressed={locale === "tr"}
              className={`rounded-full px-3 py-1.5 font-mono text-[12px] font-[500] tracking-wide transition ${
                locale === "tr" ? "btn-metallic-silver" : "text-smoke hover:text-bone"
              }`}
            >
              TR
            </button>
            <button
              onClick={() => switchLocale("en")}
              aria-pressed={locale === "en"}
              className={`rounded-full px-3 py-1.5 font-mono text-[12px] font-[500] tracking-wide transition ${
                locale === "en" ? "btn-metallic-silver" : "text-smoke hover:text-bone"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center justify-between rounded-[14px] bg-bone/5 px-4 py-3 text-bone transition hover:bg-bone/10"
        >
          <span className="font-mono text-[11px] tracking-[0.15em] text-smoke">THEME</span>
          <ThemeIcon theme={theme} className="h-5 w-5" />
        </button>

        {authSlot && (
          <div className="mt-1 flex flex-col items-stretch gap-3 border-t border-[rgba(var(--edge-rgb),0.12)] pt-5 [&_a]:w-full [&_a]:justify-center [&_button]:w-full [&_button]:justify-center [&_form]:w-full [&>div]:flex-col [&>div]:items-stretch [&>div]:gap-3">
            {authSlot}
          </div>
        )}
      </div>
    </>
  );
}
