import { getDictionary } from '@/get-dictionary';
import { getTransformations } from '@/data/transformations';
import Header from '@/components/Header';
import TransformationDetail from '@/components/anime-to-real/TransformationDetail';
import InspirationFeed from '@/components/anime-to-real/InspirationFeed';
import { Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SocialIcon = ({ Icon }: { Icon: any }) => (
    <div className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer">
        <Icon size={18} />
    </div>
);

interface PageProps {
    params: Promise<{ lang: 'en' | 'es'; id: string }>;
}

export default async function TransformationDetailPage({ params }: PageProps) {
    const { lang, id } = await params;
    const dict = await getDictionary(lang);
    const transformations = getTransformations();

    // Find the transformation
    const transformation = transformations.find(t => t.id === id);

    if (!transformation) {
        notFound();
    }

    // Get dynamic settings for social media
    const { getSettings } = await import('@/data/settings');
    const settings = getSettings();

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black pb-20 selection:bg-black selection:text-white dark:bg-[#111111] dark:text-[#f4f4f0] dark:selection:bg-white dark:selection:text-black transition-colors duration-300">

            {/* Top Marquee */}
            <div className="bg-black text-white dark:bg-white dark:text-black text-xs font-mono py-2 overflow-hidden border-b border-black dark:border-white">
                <div className="marquee-content uppercase tracking-widest">
                    {transformation.characterName} // {transformation.series || 'Anime to Real'} // {dict.anime_to_real.title} //
                </div>
            </div>

            <Header lang={lang} dict={dict} />

            {/* Breadcrumb */}
            <div className="max-w-[90rem] mx-auto px-6 py-4 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2 font-mono text-xs uppercase text-gray-600 dark:text-gray-400">
                    <Link href={`/${lang}`} className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <span>/</span>
                    <span className="text-black dark:text-white font-bold">{transformation.characterName}</span>
                </div>
            </div>

            {/* Detail Section */}
            <TransformationDetail
                transformation={transformation}
                dict={dict}
                lang={lang}
            />

            {/* Support Section */}
            <section className="max-w-[90rem] mx-auto px-6 mt-12">
                <div className="border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 p-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {lang === 'es'
                            ? '☕ ¿Te gustó? Este proyecto es mantenido por una sola persona. Si querés apoyar:'
                            : '☕ Enjoyed this? This project is maintained by one person. If you want to support:'
                        }
                    </p>
                    <a
                        href="https://buymeacoffee.com/sosacrash"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-black font-bold text-sm uppercase hover:bg-[#FFE433] transition-colors border-2 border-black"
                    >
                        ☕ Buy me a coffee
                    </a>
                </div>
            </section>

            {/* Related Transformations - Same Series Only */}
            {(() => {
                const relatedTransformations = transformations
                    .filter(t => t.id !== id && t.series === transformation.series)
                    .slice(0, 6);

                const hasRelated = relatedTransformations.length > 0;

                return (
                    <section className="max-w-[90rem] mx-auto px-6 py-12 border-t-2 border-black dark:border-white mt-12">
                        {hasRelated ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold uppercase">
                                        {lang === 'es' ? `Más de ${transformation.series}` : `More from ${transformation.series}`}
                                    </h3>
                                    <span className="text-sm font-mono text-gray-500">
                                        {relatedTransformations.length} {lang === 'es' ? 'personajes' : 'characters'}
                                    </span>
                                </div>
                                <InspirationFeed
                                    transformations={relatedTransformations}
                                    currentTransformationId={id}
                                    hasMore={false}
                                    isLoading={false}
                                    lang={lang}
                                    dict={dict}
                                />
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 font-mono text-sm mb-4">
                                    {lang === 'es'
                                        ? `${transformation.characterName} es el único de ${transformation.series} por ahora`
                                        : `${transformation.characterName} is the only one from ${transformation.series} so far`}
                                </p>
                            </div>
                        )}

                        {/* CTA to explore more */}
                        <div className="mt-8 text-center">
                            <Link
                                href={`/${lang}`}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase text-sm hover:scale-105 transition-transform"
                            >
                                {lang === 'es' ? '✨ Explorar más personajes' : '✨ Explore more characters'}
                            </Link>
                        </div>
                    </section>
                );
            })()}

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

// Generate static params for all transformations
export async function generateStaticParams() {
    const transformations = getTransformations();
    const langs = ['en', 'es'];

    const params = [];
    for (const lang of langs) {
        for (const transformation of transformations) {
            params.push({
                lang,
                id: transformation.id
            });
        }
    }

    return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
    const { lang, id } = await params;
    const transformations = getTransformations();
    const transformation = transformations.find(t => t.id === id);

    if (!transformation) {
        return {
            title: 'Transformation Not Found'
        };
    }

    const description = transformation.description?.[lang] ||
        `Realistic ${transformation.characterName} AI interpretation from ${transformation.series || 'anime'}. Nano Banana Pro generated visualization. Archival Entry: ${transformation.id}.`;

    const titlePrefix = lang === 'es' ? 'Simulación Realista' : 'Realistic Simulation';

    return {
        title: `${titlePrefix}: ${transformation.characterName} | Retro Archive Lab`,
        description,
        openGraph: {
            title: `${transformation.characterName} - AI Reality Study`,
            description,
            images: [transformation.realImage],
            type: 'article'
        },
        twitter: {
            card: 'summary_large_image',
            title: `${transformation.characterName} - AI Reality Study`,
            description,
            images: [transformation.realImage]
        }
    };
}
