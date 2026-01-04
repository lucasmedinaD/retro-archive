import { getDictionary } from '@/get-dictionary';
import { getTransformationsFromDB } from '@/lib/transformations-db';
import Header from '@/components/Header';
import ArchiveGalleryWrapper from '@/components/anime-to-real/ArchiveGalleryWrapper';
import CharacterRequestSection from '@/components/CharacterRequestSection';
import Footer from '@/components/Footer';

interface PageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export const revalidate = 0; // Ensure fresh data on every request

export default async function AnimeToRealPage({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const transformations = await getTransformationsFromDB();

    // Get dynamic settings for social media
    const { getSettings } = await import('@/data/settings');
    const settings = getSettings();

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black pb-20 selection:bg-black selection:text-white dark:bg-[#111111] dark:text-[#f4f4f0] dark:selection:bg-white dark:selection:text-black transition-colors duration-300">

            {/* Top Marquee */}
            <div className="bg-black text-white dark:bg-white dark:text-black text-xs font-mono py-2 overflow-hidden border-b border-black dark:border-white">
                <div className="marquee-content uppercase tracking-widest">
                    {dict.anime_to_real.title} // {dict.anime_to_real.subtitle} // {dict.anime_to_real.title} // {dict.anime_to_real.subtitle} //
                </div>
            </div>

            <Header lang={lang} dict={dict} />

            {/* Hero Section */}
            <section className="border-b border-black dark:border-white">
                <div className="max-w-[90rem] mx-auto px-6 py-16 md:py-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter mb-6">
                            {dict.anime_to_real.title}
                        </h1>
                        <p className="text-2xl md:text-3xl font-serif italic text-accent mb-8">
                            {dict.anime_to_real.subtitle}
                        </p>
                        <p className="font-mono text-sm md:text-base max-w-2xl mx-auto leading-relaxed border-l-2 border-black dark:border-white pl-4 text-gray-600 dark:text-gray-400">
                            {dict.anime_to_real.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="max-w-[90rem] mx-auto px-6 py-12">
                <ArchiveGalleryWrapper
                    transformations={transformations}
                    lang={lang}
                    dict={dict}
                />
            </section>

            {/* Character Request Section */}
            <section className="max-w-[90rem] mx-auto px-6 py-12">
                <CharacterRequestSection lang={lang} />
            </section>

            <Footer lang={lang} settings={settings} />
        </main>
    );
}
