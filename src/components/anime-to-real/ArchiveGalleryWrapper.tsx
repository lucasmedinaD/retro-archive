'use client';

import { useState, useMemo, useCallback } from 'react';
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

        // Filter by series
        if (selectedSeries) {
            result = result.filter(t => t.series === selectedSeries);
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
            {/* Search + Filter Section */}
            <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <SearchBar
                    onSearch={handleSearch}
                    placeholder={searchPlaceholder}
                    className="max-w-md"
                />

                {/* Filter Toggle Button (Mobile) */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center gap-2 border-2 border-black dark:border-white px-4 py-2 font-bold text-sm uppercase mb-4 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                    <Filter size={16} />
                    {filterLabel}
                    {selectedSeries && (
                        <span className="bg-accent text-black px-2 py-0.5 text-xs">1</span>
                    )}
                </button>

                {/* Filter Pills */}
                <div className={`flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden md:flex'}`}>
                    {/* All Button */}
                    <button
                        onClick={() => setSelectedSeries(null)}
                        className={`px-4 py-2 border-2 font-bold text-xs uppercase transition-all ${!selectedSeries
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                            : 'border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                            }`}
                    >
                        {allLabel} ({transformations.length})
                    </button>

                    {/* Series Buttons */}
                    {allSeries.map(series => {
                        const count = transformations.filter(t => t.series === series).length;
                        return (
                            <button
                                key={series}
                                onClick={() => setSelectedSeries(series === selectedSeries ? null : series)}
                                className={`px-4 py-2 border-2 font-bold text-xs uppercase transition-all flex items-center gap-2 ${selectedSeries === series
                                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                    : 'border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                                    }`}
                            >
                                {series}
                                <span className="bg-accent text-black px-1.5 py-0.5 text-[10px] rounded-sm">
                                    {count}
                                </span>
                                {selectedSeries === series && (
                                    <X size={12} className="ml-1" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Active Filter Indicator */}
                {selectedSeries && (
                    <div className="mt-4 font-mono text-sm text-gray-600 dark:text-gray-400">
                        {showingLabel} {filteredTransformations.length} {ofLabel} {transformations.length}
                    </div>
                )}
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
