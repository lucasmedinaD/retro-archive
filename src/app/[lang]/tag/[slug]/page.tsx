import { getTransformationsByTag } from '@/lib/transformations-db';
import { getDictionary } from '@/get-dictionary';
import FeedSection from '@/components/FeedSection';
import MobileTopNav from '@/components/mobile/MobileTopNav';
import DesktopFilterBar from '@/components/DesktopFilterBar';
import Header from '@/components/Header';
import { Metadata } from 'next';

interface TagPageProps {
    params: Promise<{ lang: 'en' | 'es'; slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const decodedTag = decodeURIComponent(slug).replace(/-/g, ' ');
    const title = lang === 'es'
        ? `${decodedTag} - Transformaciones Anime Realistas | RETRO.ARCHIVE`
        : `${decodedTag} - Realistic Anime Transformations | RETRO.ARCHIVE`;

    return {
        title: title,
        description: `Explore all realistic AI transformations for ${decodedTag}.`,
        alternates: {
            canonical: `https://retro-archive.art/${lang}/tag/${slug}`
        }
    };
}

export default async function TagPage({ params }: TagPageProps) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);

    // Convert slug back to tag (e.g. "chainsaw-man" -> "Chainsaw Man" usually needs better logic, 
    // but for now let's assume URL encoded or simple replace)
    // MobileTopNav uses "tag" as the raw string often.
    // If the link uses encodeURIComponent, then decodeURIComponent is enough.
    // If we want "seo-friendly" slugs (chainsaw-man), we should map them.
    // For MVP: Let's assume the slug IS the search term for simplicity.
    // MobileTopNav replaces spaces with dashes for the URL.
    // We must revert this to search the DB effectively.
    const tag = decodeURIComponent(slug).replace(/-/g, ' ');

    const transformations = await getTransformationsByTag(tag);

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black pb-20 dark:bg-[#111111] dark:text-[#f4f4f0]">
            <Header lang={lang} dict={dict} />
            <MobileTopNav lang={lang} dict={dict} />

            <div className="pt-24 md:pt-32 px-6 max-w-[90rem] mx-auto">
                <h1 className="text-4xl md:text-6xl font-black uppercase mb-2 tracking-tighter">
                    {tag.replace(/-/g, ' ')}
                </h1>
                <p className="text-gray-500 mb-8 font-mono text-sm">
                    {transformations.length} {lang === 'es' ? 'resultados' : 'results'}
                </p>

                <DesktopFilterBar lang={lang} />
                <div className="border-t border-black dark:border-white py-8">
                    {transformations.length > 0 ? (
                        <FeedSection
                            featuredTransformation={transformations[0]} // Just to satisfy prop, though Feed handles list
                            transformations={transformations}
                            lang={lang}
                            dict={dict}
                        />
                    ) : (
                        <div className="py-20 text-center opacity-50">
                            No results found for "{tag}"
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
