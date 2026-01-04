import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/data/products';
import { getDictionary } from '@/get-dictionary';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Header from '@/components/Header';
import { Instagram, Twitter, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { getTransformationsFromDB } from '@/lib/transformations-db'; // Updated import
import FeaturedHero from '@/components/FeaturedHero';
import MobileTopNav from '@/components/mobile/MobileTopNav';
import FeedSection from '@/components/FeedSection';
import DesktopFilterBar from '@/components/DesktopFilterBar';

// Ensure fresh data
export const revalidate = 0;

// Using a generic type for the icon since we are just rendering them
const SocialIcon = ({ Icon }: { Icon: any }) => (
  <div className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer">
    <Icon size={18} />
  </div>
);

interface HomeProps {
  params: Promise<{ lang: 'en' | 'es' }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ params, searchParams }: HomeProps) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  const dict = await getDictionary(lang);
  const products = getProducts(lang);

  // Filter from MobileTopNav tabs
  const initialFilter = resolvedSearchParams.filter as string | undefined;

  // Get featured transformation for the hero from DB
  const transformations = await getTransformationsFromDB();

  // Try to find one marked as "featured" in metadata, or default to the first one
  const featuredTransformation = transformations.find(t => t.metadata?.featured) || transformations[0];

  // Get dynamic settings for social media
  const { getSettings } = await import('@/data/settings');
  const settings = getSettings();

  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black pb-20 selection:bg-black selection:text-white dark:bg-[#111111] dark:text-[#f4f4f0] dark:selection:bg-white dark:selection:text-black transition-colors duration-300">

      {/* Top Marquee - Hidden on mobile */}
      <div className="hidden md:block bg-black text-white dark:bg-white dark:text-black text-xs font-mono py-2 overflow-hidden border-b border-black dark:border-white">
        <div className="marquee-content uppercase tracking-widest">
          {dict.catalog.marquee} {dict.catalog.marquee}
        </div>
      </div>

      <Header lang={lang} dict={dict} />
      <MobileTopNav lang={lang} dict={dict} />

      {/* Dynamic Featured Hero - Desktop Only */}
      <div className="hidden md:block">
        {featuredTransformation ? (
          <FeaturedHero
            transformation={featuredTransformation}
            dict={dict}
            lang={lang}
          />
        ) : (
          // Fallback if no transformations exist (shouldn't happen)
          <section className="border-b border-black dark:border-white py-24 text-center">
            <h1 className="text-4xl font-bold">SYSTEM OFFLINE</h1>
          </section>
        )}
      </div>





      {/* Main Transformation Feed (The Addiction Hook) */}
      <DesktopFilterBar lang={lang} />
      <section className="max-w-[90rem] mx-auto px-6 py-8 md:py-12 border-b border-black dark:border-white">
        <FeedSection
          featuredTransformation={featuredTransformation || transformations[0]}
          transformations={transformations}
          lang={lang}
          dict={dict}
          initialFilter={initialFilter}
        />
      </section>

      {/* Secondary Product Grid */}
      <section id="catalog" className="max-w-[90rem] mx-auto px-6 py-12">
        <h3 className="text-4xl font-serif italic text-black dark:text-white mb-8">
          {dict.catalog.collection}
        </h3>

        <ProductGrid lang={lang} dict={dict} products={getProducts(lang)} />
      </section>

      {/* Support Message */}
      <section className="border-t border-black/10 dark:border-white/10 py-12 px-6 bg-gradient-to-b from-[#f4f4f0] to-white dark:from-[#111] dark:to-black">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-bold mb-4">
            <Heart size={16} className="text-red-500" />
            {lang === 'es' ? 'PROYECTO INDIE' : 'INDIE PROJECT'}
          </div>
          <h3 className="text-2xl font-black mb-3">
            {lang === 'es' ? 'Tu apoyo hace esto posible' : 'Your support makes this possible'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
            {lang === 'es'
              ? 'Retro Archive es un proyecto personal hecho con amor por un fan del anime. Cada compra en nuestra tienda ayuda directamente a mantener el sitio y agregar más transformaciones, personajes y funciones.'
              : 'Retro Archive is a personal project made with love by an anime fan. Every purchase in our store directly helps maintain the site and add more transformations, characters and features.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/shop`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-sm rounded-full hover:scale-105 transition-transform"
            >
              <ShoppingBag size={16} />
              {lang === 'es' ? 'Ver diseños' : 'See designs'}
            </Link>
            <a
              href="https://buymeacoffee.com/sosacrash"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFDD00] text-black font-bold uppercase text-sm rounded-full hover:scale-105 transition-transform"
            >
              <Sparkles size={16} />
              {lang === 'es' ? 'Invítame un café' : 'Buy me a coffee'}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 dark:border-white/10 bg-white dark:bg-black py-8 px-6">
        <div className="max-w-[90rem] mx-auto">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="text-center md:text-left">
              <h4 className="font-black text-xl mb-2">RETRO<span className="text-red-500">.ARCHIVE</span></h4>
              <p className="font-mono text-xs text-gray-500 max-w-xs">
                {lang === 'es'
                  ? '✨ Transformaciones Anime to Real • Diseños exclusivos'
                  : '✨ Anime to Real Transformations • Exclusive designs'}
              </p>
            </div>
            <div className="flex gap-4">
              {settings.socialMedia.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <Instagram size={18} />
                </a>
              )}
              {settings.socialMedia.twitter && (
                <a
                  href={settings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <Twitter size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap justify-center gap-4 font-mono text-xs text-gray-500">
              <Link href={`/${lang}/shop`} className="hover:text-black dark:hover:text-white transition-colors">
                {lang === 'es' ? 'Tienda' : 'Shop'}
              </Link>
              <Link href={`/${lang}/legal/privacy`} className="hover:text-black dark:hover:text-white transition-colors">
                {lang === 'es' ? 'Privacidad' : 'Privacy'}
              </Link>
              <Link href={`/${lang}/legal/terms`} className="hover:text-black dark:hover:text-white transition-colors">
                {lang === 'es' ? 'Términos' : 'Terms'}
              </Link>
            </div>
            <p className="font-mono text-xs text-gray-400">
              © 2026 Retro Archive • {lang === 'es' ? 'Hecho con' : 'Made with'} ❤️
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
