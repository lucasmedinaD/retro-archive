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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://retro-archive.vercel.app'),
  title: {
    template: '%s | RETRO.ARCHIVE',
    default: 'RETRO.ARCHIVE - Minimalist Anime Merchandise'
  },
  description: 'Curated collection of minimalist anime-inspired designs. Brutalist aesthetic streetwear, pixel art, and digital artifacts.',
  keywords: ['anime merchandise', 'minimalist design', 'pixel art', 'retro aesthetic', 'brutalist design', 'anime streetwear', 'digital art'],
  authors: [{ name: 'Lucas Medina', url: 'https://instagram.com/lucasmedinad' }],
  creator: 'Lucas Medina',
  publisher: 'Retro Archive',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f0' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RETRO.ARCHIVE',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES'],
    url: '/',
    siteName: 'RETRO.ARCHIVE',
    title: 'RETRO.ARCHIVE - Minimalist Anime Merchandise',
    description: 'Curated collection of minimalist anime-inspired designs. Brutalist aesthetic streetwear and digital artifacts.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Retro Archive - Minimalist Anime Designs',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RETRO.ARCHIVE',
    description: 'Minimalist anime merchandise with brutalist aesthetics',
    creator: '@lucasmedinad',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
