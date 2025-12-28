import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | RETRO.ARCHIVE',
    default: 'RETRO.ARCHIVE'
  },
  description: 'Anime Aesthetic Streetwear & Digital Artifacts. Limited drops and experimental gear.',
  manifest: '/manifest.json',
  themeColor: '#00ff00',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RETRO.ARCHIVE',
  },
  openGraph: {
    title: 'RETRO.ARCHIVE',
    description: 'Anime Aesthetic Streetwear & Digital Artifacts.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
