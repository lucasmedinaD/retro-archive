import { getDictionary } from '@/get-dictionary';
import { getTransformations } from '@/data/transformations';
import Header from '@/components/Header';
import ArchiveGalleryWrapper from '@/components/anime-to-real/ArchiveGalleryWrapper';
import { Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

const SocialIcon = ({ Icon }: { Icon: any }) => (
    <div className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer">
        <Icon size={18} />
    </div>
);

interface PageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function AnimeToRealPage({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const transformations = getTransformations();

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

            {/* Footer */}
            <footer className="border-t border-black dark:border-white bg-white dark:bg-black py-8 px-6 mt-20">
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
