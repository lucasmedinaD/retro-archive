import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/data/products';
import { getDictionary } from '@/get-dictionary';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Header from '@/components/Header';
import NewsletterForm from '@/components/NewsletterForm';
import { Instagram, Twitter } from 'lucide-react';

// Using a generic type for the icon since we are just rendering them
const SocialIcon = ({ Icon }: { Icon: any }) => (
  <div className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer">
    <Icon size={18} />
  </div>
);

interface HomeProps {
  params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function Home({ params }: HomeProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const products = getProducts(lang);
  const featuredProduct = products.find(p => p.featured === true);

  // Get dynamic settings for social media
  const { getSettings } = await import('@/data/settings');
  const settings = getSettings();

  return (
    <main className="min-h-screen bg-[#f4f4f0] text-black pb-20 selection:bg-black selection:text-white dark:bg-[#111111] dark:text-[#f4f4f0] dark:selection:bg-white dark:selection:text-black transition-colors duration-300">

      {/* Top Marquee */}
      <div className="bg-black text-white dark:bg-white dark:text-black text-xs font-mono py-2 overflow-hidden border-b border-black dark:border-white">
        <div className="marquee-content uppercase tracking-widest">
          {dict.catalog.marquee} {dict.catalog.marquee}
        </div>
      </div>

      <Header lang={lang} dict={dict} />

      {/* Hero Section */}
      <section className="border-b border-black dark:border-white">
        <div className="max-w-[90rem] mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-10">

          <div className="flex-1">
            <h1 className="text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter mb-6">
              {dict.hero.title_less} <br />
              <span className="font-serif italic font-normal text-6xl md:text-8xl text-accent">{dict.hero.title_is_more}</span>
            </h1>
            <p className="font-mono text-sm md:text-base max-w-md  mb-6 leading-relaxed border-l-2 border-black dark:border-white pl-4 text-gray-600 dark:text-gray-400">
              {dict.hero.description}
            </p>
            <Link
              href="#catalog"
              className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-transparent hover:text-black dark:hover:text-white border border-black dark:border-white transition-colors"
            >
              {dict.hero.cta}
            </Link>
          </div>

          <div className="flex-1 w-full flex justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] border-2 border-black dark:border-white">
              <div className="w-full h-full bg-white dark:bg-black relative overflow-hidden">
                {/* Featured Hero Image - Makima */}
                <img
                  src="/hero-makima.jpg"
                  alt="Featured Character - Makima"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white px-4 py-2 font-mono text-xs font-bold rotate-[-5deg] shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,1)] z-10">
                {dict.hero.featured}
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* Catalog Marquee */}
      <div className="border-b border-black dark:border-white py-3 overflow-hidden">
        <h2 className="text-8xl font-black opacity-10 whitespace-nowrap marquee-container">
          <div className="marquee-content">
            {dict.catalog.marquee} {dict.catalog.marquee}
          </div>
        </h2>
      </div>

      {/* Product Grid Section */}
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
              <Link href="/legal/privacy" className="hover:underline text-gray-600 dark:text-gray-400">
                Privacy
              </Link>
              <Link href="/legal/terms" className="hover:underline text-gray-600 dark:text-gray-400">
                Terms
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
