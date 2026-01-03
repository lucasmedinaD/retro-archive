import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/data/products';
import { getDictionary } from '@/get-dictionary';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Header from '@/components/Header';
import NewsletterForm from '@/components/NewsletterForm';
import { Instagram, Twitter } from 'lucide-react';
import { getTransformations } from '@/data/transformations';
import FeaturedHero from '@/components/FeaturedHero';
import MobileTopNav from '@/components/mobile/MobileTopNav';
import FeedSection from '@/components/FeedSection';

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

  // Get featured transformation for the hero
  const transformations = getTransformations();
  // Try to find one marked as "featured" in metadata, or default to Makima (hardcoded ID makima-1) or just the first one
  const featuredTransformation = transformations.find(t => t.id === 'makima-1') || transformations[0];

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

      {/* Newsletter Section */}
      <section className="border-t border-black dark:border-white py-12 px-6 bg-[#f4f4f0] dark:bg-[#111111]">
        <NewsletterForm dict={dict} />
      </section>

      <footer className="border-t border-black dark:border-white bg-white dark:bg-black py-8 px-6">
        <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="font-black text-2xl mb-4">RETRO<span className="text-accent">.ARCHIVE</span></h4>
            <div className="flex justify-center md:justify-start gap-4 mb-4">
              {settings.socialMedia.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <SocialIcon Icon={Instagram} />
                </a>
              )}
              {settings.socialMedia.twitter && (
                <a
                  href={settings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <SocialIcon Icon={Twitter} />
                </a>
              )}
            </div>
            <p className="font-mono text-xs max-w-xs text-gray-500">
              {dict.footer.description}
            </p>
            <div className="flex gap-4 mt-3 justify-center md:justify-start font-mono text-xs">
              <Link href={`/${lang}#catalog`} className="hover:underline text-gray-600 dark:text-gray-400">
                {lang === 'es' ? 'Suministros' : 'Blueprints'}
              </Link>
              <Link href={`/${lang}/legal/privacy`} className="hover:underline text-gray-600 dark:text-gray-400">
                {lang === 'es' ? 'Privacidad' : 'Privacy'}
              </Link>
              <Link href={`/${lang}/legal/terms`} className="hover:underline text-gray-600 dark:text-gray-400">
                {lang === 'es' ? 'Términos' : 'Terms'}
              </Link>
            </div>
          </div>
          <div className="font-mono text-xs text-center md:text-right">
            <p>© 2024</p>
            <p>{dict.footer.rights}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
