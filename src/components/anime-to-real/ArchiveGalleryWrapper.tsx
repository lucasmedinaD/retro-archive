'use client';

import { useState, useMemo, useEffect } from 'react';
import { useArchiveProgress } from '@/hooks/useArchiveProgress';
import ArchiveProgressBar from '@/components/ArchiveProgressBar';
import EmailCapturePopup from '@/components/EmailCapturePopup';
import InspirationFeed from '@/components/anime-to-real/InspirationFeed';
import { TransformationExtended } from '@/types/transformations';
import { Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchiveGalleryWrapperProps {
    transformations: TransformationExtended[];
    lang: 'en' | 'es';
    dict: any;
    initialFilter?: string;
}

export default function ArchiveGalleryWrapper({ transformations, lang, dict, initialFilter }: ArchiveGalleryWrapperProps) {
    const [selectedSeries, setSelectedSeries] = useState<string | null>(initialFilter || null);
    const [selectedEra, setSelectedEra] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [selectedRealism, setSelectedRealism] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Sync state with URL filter changes
    useEffect(() => {
        setSelectedSeries(initialFilter || null);
    }, [initialFilter]);

    // Unique values for dropdowns
    const eras = useMemo(() => Array.from(new Set(transformations.map(t => t.era).filter(Boolean))), [transformations]);
    const styles = useMemo(() => Array.from(new Set(transformations.map(t => t.style).filter(Boolean))), [transformations]);
    const realisms = useMemo(() => Array.from(new Set(transformations.map(t => t.realismLevel).filter(Boolean))), [transformations]);

    // Filter transformations based on all criteria
    const filteredTransformations = useMemo(() => {
        return transformations.filter(t => {
            const matchesSeries = selectedSeries ? t.series?.toLowerCase() === selectedSeries.toLowerCase() : true;
            const matchesEra = selectedEra ? t.era === selectedEra : true;
            const matchesStyle = selectedStyle ? t.style === selectedStyle : true;
            const matchesRealism = selectedRealism ? t.realismLevel === selectedRealism : true;

            return matchesSeries && matchesEra && matchesStyle && matchesRealism;
        });
    }, [transformations, selectedSeries, selectedEra, selectedStyle, selectedRealism]);

    const clearFilters = () => {
        setSelectedSeries(null); // Optional: Do we want to clear series too?
        setSelectedEra(null);
        setSelectedStyle(null);
        setSelectedRealism(null);
    };

    const hasActiveFilters = selectedSeries || selectedEra || selectedStyle || selectedRealism;

    return (
        <div className="space-y-6">
            {/* Filter Toggle & Active Chips */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between px-6">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-black dark:border-white uppercase text-xs font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                    <Filter size={14} />
                    {lang === 'es' ? 'Filtros' : 'Filters'}
                    {(selectedEra || selectedStyle || selectedRealism) && (
                        <span className="bg-accent text-black px-1.5 rounded-full text-[10px]">!</span>
                    )}
                </button>

                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 text-xs">
                        {selectedSeries && (
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 flex items-center gap-2">
                                Series: {selectedSeries}
                                <button onClick={() => setSelectedSeries(null)}><X size={12} /></button>
                            </span>
                        )}
                        {selectedEra && (
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 flex items-center gap-2">
                                Era: {selectedEra}
                                <button onClick={() => setSelectedEra(null)}><X size={12} /></button>
                            </span>
                        )}
                        {selectedStyle && (
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 flex items-center gap-2">
                                Style: {selectedStyle}
                                <button onClick={() => setSelectedStyle(null)}><X size={12} /></button>
                            </span>
                        )}
                        {selectedRealism && (
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 flex items-center gap-2">
                                Realism: {selectedRealism}
                                <button onClick={() => setSelectedRealism(null)}><X size={12} /></button>
                            </span>
                        )}
                        <button onClick={clearFilters} className="text-gray-500 hover:text-red-500 underline ml-2">
                            {lang === 'es' ? 'Limpiar todo' : 'Clear all'}
                        </button>
                    </div>
                )}
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-black/10 dark:border-white/10"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-6">
                            {/* Era Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase mb-2 text-gray-500">Era / Decade</h4>
                                <div className="flex flex-wrap gap-2">
                                    {eras.map((era: any) => (
                                        <button
                                            key={era}
                                            onClick={() => setSelectedEra(selectedEra === era ? null : era)}
                                            className={`px-3 py-1 text-xs border ${selectedEra === era ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'}`}
                                        >
                                            {era}
                                        </button>
                                    ))}
                                    {eras.length === 0 && <span className="text-xs text-gray-400 italic">No data</span>}
                                </div>
                            </div>

                            {/* Style Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase mb-2 text-gray-500">Visual Style</h4>
                                <div className="flex flex-wrap gap-2">
                                    {styles.map((style: any) => (
                                        <button
                                            key={style}
                                            onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
                                            className={`px-3 py-1 text-xs border ${selectedStyle === style ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                    {styles.length === 0 && <span className="text-xs text-gray-400 italic">No data</span>}
                                </div>
                            </div>

                            {/* Realism Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase mb-2 text-gray-500">Realism Level</h4>
                                <div className="flex flex-wrap gap-2">
                                    {realisms.map((realism: any) => (
                                        <button
                                            key={realism}
                                            onClick={() => setSelectedRealism(selectedRealism === realism ? null : realism)}
                                            className={`px-3 py-1 text-xs border ${selectedRealism === realism ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white'}`}
                                        >
                                            {realism}
                                        </button>
                                    ))}
                                    {realisms.length === 0 && <span className="text-xs text-gray-400 italic">No data</span>}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <InspirationFeed
                transformations={filteredTransformations}
                lang={lang}
                hasMore={false}
                isLoading={false}
                dict={dict}
            />

            <ArchiveProgressBar totalCount={transformations.length} dict={dict} />
            <EmailCapturePopup delay={20000} showOnExitIntent={true} dict={dict} />
        </div>
    );
}
