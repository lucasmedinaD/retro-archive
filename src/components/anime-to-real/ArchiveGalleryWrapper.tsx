'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useArchiveProgress } from '@/hooks/useArchiveProgress';
import ArchiveProgressBar from '@/components/ArchiveProgressBar';
import EmailCapturePopup from '@/components/EmailCapturePopup';
import InspirationFeed from '@/components/anime-to-real/InspirationFeed';
import SearchBar from '@/components/SearchBar';
import { Transformation } from '@/data/transformations';
import { Filter, X } from 'lucide-react';

interface ArchiveGalleryWrapperProps {
    transformations: Transformation[];
    lang: 'en' | 'es';
    dict: any;
    initialFilter?: string;
}

export default function ArchiveGalleryWrapper({ transformations, lang, dict, initialFilter }: ArchiveGalleryWrapperProps) {
    const [selectedSeries, setSelectedSeries] = useState<string | null>(initialFilter || null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Sync state with URL filter changes
    useEffect(() => {
        setSelectedSeries(initialFilter || null);
    }, [initialFilter]);

    // Handle search
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query.toLowerCase());
    }, []);

    // Extract unique series from transformations
    const allSeries = useMemo(() => {
        const seriesSet = new Set<string>();
        transformations.forEach(t => {
            if (t.series) {
                seriesSet.add(t.series);
            }
        });
        return Array.from(seriesSet).sort();
    }, [transformations]);

    // Filter transformations based on search AND selected series
    const filteredTransformations = useMemo(() => {
        let result = transformations;

        // Filter by series (case-insensitive)
        if (selectedSeries) {
            const normalizedFilter = selectedSeries.toLowerCase();
            result = result.filter(t => t.series && t.series.toLowerCase() === normalizedFilter);
        }

        // Filter by search query
        if (searchQuery) {
            result = result.filter(t =>
                t.characterName.toLowerCase().includes(searchQuery) ||
                (t.series && t.series.toLowerCase().includes(searchQuery)) ||
                (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
            );
        }

        return result;
    }, [transformations, selectedSeries, searchQuery]);

    const filterLabel = lang === 'es' ? 'Filtrar por Anime' : 'Filter by Anime';
    const allLabel = lang === 'es' ? 'Todos' : 'All';
    const showingLabel = lang === 'es' ? 'Mostrando' : 'Showing';
    const ofLabel = lang === 'es' ? 'de' : 'of';
    const searchPlaceholder = lang === 'es' ? 'Buscar personaje o serie...' : 'Search character or series...';

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
