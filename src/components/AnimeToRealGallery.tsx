'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { X, Heart, Filter } from 'lucide-react';
import LiquidSlider from '@/components/LiquidSlider';
import { Transformation } from '@/data/transformations';
import { likeTransformationAction } from '@/app/admin/actions/transformations';

interface AnimeToRealGalleryProps {
    transformations: Transformation[];
    dict: any;
    lang: 'en' | 'es';
}

export default function AnimeToRealGallery({ transformations, dict, lang }: AnimeToRealGalleryProps) {
    const [selectedItem, setSelectedItem] = useState<Transformation | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterSeries, setFilterSeries] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('popular');
    const [showFilters, setShowFilters] = useState(false);
    const [localLikes, setLocalLikes] = useState<Record<string, number>>({});

    // Extract unique series and categories for filters
    const { uniqueSeries, uniqueCategories } = useMemo(() => {
        const series = new Set<string>();
        const categories = new Set<string>();

        transformations.forEach(t => {
            if (t.series) series.add(t.series);
            if (t.category) categories.add(t.category);
        });

        return {
            uniqueSeries: Array.from(series),
            uniqueCategories: Array.from(categories)
        };
    }, [transformations]);

    // Filter and sort transformations
    const filteredTransformations = useMemo(() => {
        let filtered = transformations.filter(t => {
            if (filterCategory !== 'all' && t.category !== filterCategory) return false;
            if (filterSeries !== 'all' && t.series !== filterSeries) return false;
            return true;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'popular') {
                const likesA = localLikes[a.id] ?? a.likes ?? 0;
                const likesB = localLikes[b.id] ?? b.likes ?? 0;
                return likesB - likesA;
            } else if (sortBy === 'name') {
                return a.characterName.localeCompare(b.characterName);
            }
            // Default: newest (by id timestamp)
            return b.id.localeCompare(a.id);
        });

        return filtered;
    }, [transformations, filterCategory, filterSeries, sortBy, localLikes]);

    const handleLike = async (e: React.MouseEvent, transformationId: string) => {
        e.stopPropagation();

        // Optimistic update
        setLocalLikes(prev => ({
            ...prev,
            [transformationId]: (prev[transformationId] ?? transformations.find(t => t.id === transformationId)?.likes ?? 0) + 1
        }));

        // Server update
        const result = await likeTransformationAction(transformationId);
        if (result.error) {
            // Revert on error
            setLocalLikes(prev => {
                const newLikes = { ...prev };
                delete newLikes[transformationId];
                return newLikes;
            });
            console.error('Like failed:', result.error);
        }
    };

    if (transformations.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-4xl font-black mb-4">{dict.anime_to_real.empty_title}</h3>
                <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
                    {dict.anime_to_real.empty_description}
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Filters Bar */}
            <div className="mb-8 border-2 border-black dark:border-white bg-white dark:bg-black">
                {/* Filter Toggle Button (Mobile) */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full md:hidden flex items-center justify-between p-4 font-mono text-sm uppercase"
                >
                    <span className="flex items-center gap-2">
                        <Filter size={16} />
                        Filters & Sort
                    </span>
                    <span>{showFilters ? '▲' : '▼'}</span>
                </button>

                {/* Filters Content */}
                <div className={`${showFilters ? 'block' : 'hidden'} md:block p-4 border-t-2 md:border-t-0 border-black dark:border-white`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block font-mono text-xs uppercase mb-2 text-gray-600 dark:text-gray-400">
                                Category
                            </label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full border-2 border-black dark:border-white bg-white dark:bg-black p-2 font-mono text-sm uppercase outline-none focus:bg-gray-100 dark:focus:bg-gray-900"
                            >
                                <option value="all">All Types</option>
                                {uniqueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Series Filter */}
                        <div>
                            <label className="block font-mono text-xs uppercase mb-2 text-gray-600 dark:text-gray-400">
                                Series
                            </label>
                            <select
                                value={filterSeries}
                                onChange={(e) => setFilterSeries(e.target.value)}
                                className="w-full border-2 border-black dark:border-white bg-white dark:bg-black p-2 font-mono text-sm uppercase outline-none focus:bg-gray-100 dark:focus:bg-gray-900"
                            >
                                <option value="all">All Series</option>
                                {uniqueSeries.map(series => (
                                    <option key={series} value={series}>{series}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <label className="block font-mono text-xs uppercase mb-2 text-gray-600 dark:text-gray-400">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="w-full border-2 border-black dark:border-white bg-white dark:bg-black p-2 font-mono text-sm uppercase outline-none focus:bg-gray-100 dark:focus:bg-gray-900"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="newest">Newest First</option>
                                <option value="name">A-Z</option>
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-end">
                            <div className="w-full text-center md:text-left font-mono text-xs text-gray-600 dark:text-gray-400 uppercase">
                                {filteredTransformations.length} {filteredTransformations.length === 1 ? 'Result' : 'Results'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTransformations.map((item, idx) => {
                    const likes = localLikes[item.id] ?? item.likes ?? 0;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.3 }}
                            className="group relative border-2 border-black dark:border-white overflow-hidden cursor-pointer hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_rgba(255,255,255,1)] transition-shadow duration-200 hover:-translate-y-1 hover:-translate-x-1"
                            onClick={() => setSelectedItem(item)}
                            style={{ willChange: 'transform' }}
                        >
                            {/* Anime Image Preview */}
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    src={item.animeImage}
                                    alt={item.characterName}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Overlay with CTA */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-white font-mono text-xs mb-2">
                                            {dict.anime_to_real.click_to_compare}
                                        </p>
                                        <div className="inline-block bg-white text-black px-6 py-3 font-bold text-sm uppercase">
                                            {dict.anime_to_real.cta}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Character Info */}
                            <div className="p-4 bg-white dark:bg-black border-t-2 border-black dark:border-white">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl uppercase tracking-tight flex-1">
                                        {item.characterName}
                                    </h3>

                                    {/* Like Button */}
                                    <button
                                        onClick={(e) => handleLike(e, item.id)}
                                        className="group/like flex items-center gap-1 px-2 py-1 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                        aria-label="Like"
                                    >
                                        <Heart
                                            size={16}
                                            className={likes > 0 ? 'fill-current' : ''}
                                        />
                                        <span className="font-mono text-xs font-bold">{likes}</span>
                                    </button>
                                </div>

                                {/* Series Badge */}
                                {item.series && (
                                    <div className="inline-block bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 font-mono text-[10px] uppercase mb-2">
                                        {item.series}
                                    </div>
                                )}

                                {item.description && (
                                    <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {item.description[lang]}
                                    </p>
                                )}
                            </div>

                            {/* Corner Label */}
                            <div className="absolute top-4 left-4 bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 font-mono text-xs font-bold uppercase">
                                {item.category || '2.5D'}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Comparison Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 px-4"
                        onClick={() => setSelectedItem(null)}
                        style={{ willChange: 'opacity' }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-4xl"
                            onClick={(e) => e.stopPropagation()}
                            style={{ willChange: 'transform, opacity' }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute -top-12 right-0 md:-right-12 md:top-0 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white p-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors z-10"
                                aria-label="Close"
                            >
                                <X size={24} />
                            </button>

                            {/* Liquid Slider */}
                            <LiquidSlider
                                animeImage={selectedItem.animeImage}
                                realImage={selectedItem.realImage}
                                characterName={selectedItem.characterName}
                            />

                            {/* Instructions */}
                            <div className="mt-4 text-center">
                                <p className="font-mono text-xs text-white/70">
                                    {dict.anime_to_real.drag_to_reveal}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
