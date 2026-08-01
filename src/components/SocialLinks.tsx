const LINKS = [
  {
    label: "X",
    href: "https://x.com/justbiar",
    icon: (
      <path d="M18.9 2.5h3.3l-7.2 8.2 8.4 11.1h-6.6l-5.2-6.8-5.9 6.8H2.4l7.7-8.8L2.1 2.5h6.8l4.7 6.2 5.3-6.2Zm-1.2 17.4h1.8L7.4 4.3H5.5l12.2 15.6Z" />
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/justbiar",
    icon: (
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85l-.01 2.75c0 .27.18.58.69.48A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
    ),
  },
  {
    label: "biar.tech",
    href: "https://biar.tech",
    icon: (
      <>
        <circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <ellipse cx="12" cy="12" rx="4" ry="9.25" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
];

/** Sağ altta sabit duran kişisel bağlantılar. */
export function SocialLinks() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-1">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.label}
          aria-label={link.label}
          className="metallic-panel flex h-9 w-9 items-center justify-center rounded-full text-smoke transition hover:text-bone"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
            {link.icon}
          </svg>
        </a>
      ))}
    </div>
  );
}
