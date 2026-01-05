'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ChevronDown } from 'lucide-react';
import { TransformationExtended } from '@/types/transformations';
import { useArchiveProgress } from '@/hooks/useArchiveProgress';
import OwnerBadge from '@/components/OwnerBadge';
import TransformationCard from './TransformationCard';

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

// TransformationCard is now imported from its own file
