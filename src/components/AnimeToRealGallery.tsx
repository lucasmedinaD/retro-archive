'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';
import LiquidSlider from '@/components/LiquidSlider';
import { Transformation } from '@/data/transformations';

interface AnimeToRealGalleryProps {
    transformations: Transformation[];
    dict: any;
    lang: 'en' | 'es';
}

export default function AnimeToRealGallery({ transformations, dict, lang }: AnimeToRealGalleryProps) {
    const [selectedItem, setSelectedItem] = useState<Transformation | null>(null);

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
            {/* Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transformations.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative border-2 border-black dark:border-white overflow-hidden cursor-pointer hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_rgba(255,255,255,1)] transition-all duration-300 hover:-translate-y-1 hover:-translate-x-1"
                        onClick={() => setSelectedItem(item)}
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
                            <h3 className="font-black text-xl uppercase tracking-tight">
                                {item.characterName}
                            </h3>
                            {item.description && (
                                <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.description[lang]}
                                </p>
                            )}
                        </div>

                        {/* Corner Label */}
                        <div className="absolute top-4 left-4 bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 font-mono text-xs font-bold uppercase">
                            2.5D
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Comparison Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm px-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl"
                            onClick={(e) => e.stopPropagation()}
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
