'use client';

import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import ArchiveGalleryWrapper from '@/components/anime-to-real/ArchiveGalleryWrapper';
import MiniAutoHero from '@/components/MiniAutoHero';
import { Transformation } from '@/data/transformations';

interface FeedSectionProps {
    transformations: Transformation[];
    featuredTransformation: Transformation;
    lang: 'en' | 'es';
    dict: any;
    initialFilter?: string;
}

export default function FeedSection({
    transformations,
    featuredTransformation,
    lang,
    dict,
    initialFilter
}: FeedSectionProps) {
    // Enable scroll restoration
    useScrollRestoration();

    return (
        <>
            {/* Mini Auto Hero - Shows how transformations work */}
            <MiniAutoHero
                transformation={featuredTransformation}
                lang={lang}
            />

            <ArchiveGalleryWrapper
                transformations={transformations}
                lang={lang}
                dict={dict}
                initialFilter={initialFilter}
            />
        </>
    );
}
