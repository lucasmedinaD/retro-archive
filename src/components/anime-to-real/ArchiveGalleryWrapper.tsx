'use client';

import { useState, useMemo, useEffect } from 'react';
import { useArchiveProgress } from '@/hooks/useArchiveProgress';
import ArchiveProgressBar from '@/components/ArchiveProgressBar';
import EmailCapturePopup from '@/components/EmailCapturePopup';
import InspirationFeed from '@/components/anime-to-real/InspirationFeed';
import { Transformation } from '@/data/transformations';

interface ArchiveGalleryWrapperProps {
    transformations: Transformation[];
    lang: 'en' | 'es';
    dict: any;
    initialFilter?: string;
}

export default function ArchiveGalleryWrapper({ transformations, lang, dict, initialFilter }: ArchiveGalleryWrapperProps) {
    const [selectedSeries, setSelectedSeries] = useState<string | null>(initialFilter || null);

    // Sync state with URL filter changes
    useEffect(() => {
        setSelectedSeries(initialFilter || null);
    }, [initialFilter]);

    // Filter transformations based on selected series (case-insensitive)
    const filteredTransformations = useMemo(() => {
        if (!selectedSeries) return transformations;

        const normalizedFilter = selectedSeries.toLowerCase();
        return transformations.filter(t => t.series && t.series.toLowerCase() === normalizedFilter);
    }, [transformations, selectedSeries]);

    const showingLabel = lang === 'es' ? 'Mostrando' : 'Showing';
    const ofLabel = lang === 'es' ? 'de' : 'of';

    return (
        <>
            {/* Results Counter */}
            <div className="mb-6 font-mono text-sm text-gray-600 dark:text-gray-400">
                {showingLabel} {filteredTransformations.length} {ofLabel} {transformations.length}
            </div>

            <InspirationFeed
                transformations={filteredTransformations}
                lang={lang}
                hasMore={false}
                isLoading={false}
                dict={dict}
            />

            <ArchiveProgressBar totalCount={transformations.length} dict={dict} />
            <EmailCapturePopup delay={20000} showOnExitIntent={true} dict={dict} />
        </>
    );
}
