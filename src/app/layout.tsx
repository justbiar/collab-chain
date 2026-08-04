import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLocale, t } from "@/lib/i18n";
import { SiteControls } from "@/components/SiteControls";
import { AuthControl } from "@/components/AuthControl";
import { SocialLinks } from "@/components/SocialLinks";
import { FarcasterProvider } from "@/components/FarcasterProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { MiniAppReady } from "@/components/MiniAppReady";
import { getAppUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/**
 * Warpcast/Base App feed'inde linkin etkileşimli bir "Mini App aç" kartı
 * olarak unfurl olması için gereken embed meta etiketi. `fc:miniapp` güncel
 * isim, `fc:frame` eski istemcilerle geriye dönük uyumluluk için aynı içerikle
 * tekrarlanıyor (bkz. @farcaster/miniapp-core embeds şeması).
 */
function miniAppEmbed(appUrl: string) {
  return JSON.stringify({
    version: "1",
    imageUrl: `${appUrl}/logo.png`,
    button: {
      title: "Zinciri Aç",
      action: {
        type: "launch_miniapp",
        name: "Collab Chain",
        url: appUrl,
        splashImageUrl: `${appUrl}/icon-512.png`,
        splashBackgroundColor: "#08080a",
      },
    },
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const s = t(locale);
  const appUrl = getAppUrl();
  const embed = miniAppEmbed(appUrl);
  return {
    title: s.siteName,
    description: s.siteTagline,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    other: {
      "fc:miniapp": embed,
      "fc:frame": embed,
    },
  };
}

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-carbon text-bone">
        <WalletProvider>
          <FarcasterProvider>
            <MiniAppReady />
            <SiteControls locale={locale} authSlot={<AuthControl />} />
            {children}
            <SocialLinks />
          </FarcasterProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
