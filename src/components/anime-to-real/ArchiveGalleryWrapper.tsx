'use client';

import { useEffect } from 'react';
import { useArchiveProgress } from '@/hooks/useArchiveProgress';
import ArchiveProgressBar from '@/components/ArchiveProgressBar';
import InspirationFeed from '@/components/anime-to-real/InspirationFeed';
import { Transformation } from '@/data/transformations';

interface ArchiveGalleryWrapperProps {
    transformations: Transformation[];
    lang: 'en' | 'es';
}

export default function ArchiveGalleryWrapper({ transformations, lang }: ArchiveGalleryWrapperProps) {
    return (
        <>
            <InspirationFeed
                transformations={transformations}
                lang={lang}
                hasMore={false}
                isLoading={false}
            />

            <ArchiveProgressBar totalCount={transformations.length} />
        </>
    );
}
