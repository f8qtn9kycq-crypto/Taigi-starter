import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://taigi-start.alexcy2025.chatgpt.site"),
  title: {
    default: "台語起步 Tâi-gí Start",
    template: "%s | 台語起步 Tâi-gí Start",
  },
  description: "給零基礎學習者的台語聽說課程、錄音練習與間隔複習。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "台語起步 Tâi-gí Start",
    description: "給零基礎學習者的台語聽說課程、錄音練習與間隔複習。",
    url: "https://taigi-start.alexcy2025.chatgpt.site/",
    siteName: "台語起步 Tâi-gí Start",
    images: [
      {
        url: "https://taigi-start.alexcy2025.chatgpt.site/og.png",
        width: 1730,
        height: 909,
        alt: "台語起步 Tâi-gí Start",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "台語起步 Tâi-gí Start",
    description: "給零基礎學習者的台語聽說課程、錄音練習與間隔複習。",
    images: ["https://taigi-start.alexcy2025.chatgpt.site/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
