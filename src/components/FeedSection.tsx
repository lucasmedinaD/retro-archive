'use client';

import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import MiniAutoHero from '@/components/MiniAutoHero';
import ArchiveGalleryWrapper from '@/components/anime-to-real/ArchiveGalleryWrapper';
import { Transformation } from '@/data/transformations';
import { GalleryTriggerButton } from '@/components/GalleryTrigger';
import { TransformationExtended } from '@/types/transformations';

interface FeedSectionProps {
    featuredTransformation: Transformation;
    transformations: Transformation[];
    lang: 'en' | 'es';
    dict: any;
    initialFilter?: string;
}

export default function FeedSection({
    featuredTransformation,
    transformations,
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

            {/* TikTok-style Gallery Mode Button */}
            <GalleryTriggerButton
                transformations={transformations as TransformationExtended[]}
                lang={lang}
            />
        </>
    );
}

