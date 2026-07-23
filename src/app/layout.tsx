import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 Chain Card",
  description: "Zincire katıl, kartını oluştur, X'te paylaş.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-carbon text-bone">{children}</body>
    </html>
  );
}
