import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import { OrganizationSchema, WebSiteSchema } from "@/components/SchemaScript";
import { Providers } from "@/providers";
import ExitIntentPopup from "@/components/ExitIntentPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://retro-archive.art'),
  title: {
    template: '%s | RETRO.ARCHIVE',
    default: 'RETRO.ARCHIVE - Anime to Real Transformations & AI Art'
  },
  description: 'Explore realistic AI transformations of your favorite anime characters. Compare anime vs real life versions with our interactive slider. Minimalist aesthetics & curated designs.',
  keywords: ['anime to real', 'ai art', 'realistic anime', 'anime transformation', 'midjourney anime', 'stable diffusion anime', 'semireal anime', 'anime merchandise', 'minimalist design'],
  authors: [{ name: 'Lucas Medina', url: 'https://instagram.com/lucasmedinad' }],
  creator: 'Lucas Medina',
  publisher: 'Retro Archive',
  other: {
    'p:domain_verify': 'fee3cd4a1ee32820a8c118a739242f00',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RETRO.ARCHIVE',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES'],
    url: '/',
    siteName: 'RETRO.ARCHIVE',
    title: 'RETRO.ARCHIVE - Anime to Real Transformations',
    description: 'Explore realistic AI transformations of your favorite anime characters. Compare anime vs real life versions with our interactive slider.',
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
    description: 'Explore realistic AI transformations of your favorite anime characters.',
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

};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f0' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' }
  ],
  width: 'device-width',
  initialScale: 1,
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
        <AnalyticsScripts />
        <OrganizationSchema />
        <WebSiteSchema />
        <Providers>
          {children}
          {/* ExitIntentPopup temporarily disabled */}
          {/* <ExitIntentPopup /> */}
        </Providers>
      </body>
    </html>
  );
}

