'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ChevronDown } from 'lucide-react';
import { TransformationExtended } from '@/types/transformations';
import { useArchiveProgress } from '@/hooks/useArchiveProgress';
import OwnerBadge from '@/components/OwnerBadge';

interface InspirationFeedProps {
    transformations: TransformationExtended[];
    currentTransformationId?: string;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
    lang?: 'en' | 'es';
    dict?: any;
}

export default function InspirationFeed({
    transformations,
    currentTransformationId,
    onLoadMore,
    hasMore = false,
    isLoading = false,
    lang = 'en',
    dict
}: InspirationFeedProps) {
    const [visibleItems, setVisibleItems] = useState<TransformationExtended[]>([]);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Filter out current transformation
    const filteredTransformations = transformations.filter(
        t => t.id !== currentTransformationId
    );

    useEffect(() => {
        setVisibleItems(filteredTransformations);
    }, [transformations, currentTransformationId]);

    // Infinite scroll observer
    useEffect(() => {
        if (!onLoadMore || !hasMore) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoading) {
                    onLoadMore();
                }
            },
            { threshold: 0.5 }
        );

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [onLoadMore, hasMore, isLoading]);

    return (
        <section className="py-12">
            {/* Header Removed as it's now main feed */}
            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
                {visibleItems.map((transformation, idx) => (
                    <TransformationCard
                        key={transformation.id}
                        transformation={transformation}
                        index={idx}
                        lang={lang}
                        viewedText={dict?.archive?.viewed || 'VIEWED'}
                    />
                ))}
            </div>

            {/* Load More Trigger */}
            {hasMore && (
                <div ref={loadMoreRef} className="mt-8 text-center">
                    {isLoading ? (
                        <div className="flex justify-center items-center gap-2 py-4">
                            <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-mono text-sm">Loading more...</span>
                        </div>
                    ) : (
                        <button
                            onClick={onLoadMore}
                            className="px-8 py-3 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold uppercase text-sm"
                        >
                            Load More
                        </button>
                    )}
                </div>
            )}
        </section>
    );
}

function TransformationCard({
    transformation,
    index,
    lang,
    viewedText = 'VIEWED'
}: {
    transformation: TransformationExtended;
    index: number;
    lang: 'en' | 'es';
    viewedText?: string;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: true, margin: "-50px" });
    const { isViewed } = useArchiveProgress();

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={isInView ? {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { delay: index * 0.05, duration: 0.4 }
            } : {}}
            className="break-inside-avoid relative mb-4"
        >
            {/* Viewed Badge */}
            {isViewed(transformation.id) && (
                <div className="absolute -top-1 -right-1 z-20 bg-accent text-black text-[8px] font-bold px-1.5 py-0.5 uppercase">
                    {viewedText}
                </div>
            )}
            <Link href={`/${lang}/anime-to-real/${transformation.id}`}>
                <div
                    className="group relative border-2 border-black dark:border-white overflow-hidden hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] transition-all duration-200 hover:-translate-y-1 cursor-pointer bg-white dark:bg-black"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Image with original aspect ratio */}
                    <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <Image
                            src={isHovered ? transformation.realImage : transformation.animeImage}
                            alt={transformation.characterName}
                            width={400}
                            height={600}
                            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            onLoad={() => setImageLoaded(true)}
                        />

                        {/* Overlay */}
                        <div
                            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-white font-black text-lg mb-1">
                                    {transformation.characterName}
                                </h3>
                                {transformation.series && (
                                    <p className="text-white/80 text-xs font-mono">
                                        {transformation.series}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* DISABLED: Owner Badge - Feature not working
                        <div className="absolute top-2 left-2 z-10">
                            <OwnerBadge
                                transformationId={transformation.id}
                                className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded"
                            />
                        </div>
                        */}

                        {/* Category Badge */}
                        <div className="absolute top-2 right-2 bg-black text-white dark:bg-white dark:text-black px-2 py-1 text-[10px] font-bold uppercase">
                            {transformation.category || '2.5D'}
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-3 bg-white dark:bg-black border-t-2 border-black dark:border-white">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <h3 className="font-bold text-sm line-clamp-1">
                                    {transformation.characterName}
                                </h3>
                                {transformation.series && (
                                    <p className="text-xs font-mono text-gray-600 dark:text-gray-400 line-clamp-1">
                                        {transformation.series}
                                    </p>
                                )}
                            </div>

                            {/* Like Count */}
                            {(transformation.likes ?? 0) > 0 && (
                                <div className="flex items-center gap-1 text-sm">
                                    <Heart size={14} className="fill-red-500 text-red-500" />
                                    <span className="font-mono text-xs">
                                        {transformation.likes}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
