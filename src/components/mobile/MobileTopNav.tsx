'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { getTransformations } from '@/data/transformations';
import { useMemo } from 'react';

interface MobileTopNavProps {
    lang: 'en' | 'es';
    dict: any;
}

export default function MobileTopNav({ lang, dict }: MobileTopNavProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get('filter');

    // Get dynamic series from transformations
    const transformations = getTransformations();
    const dynamicSeries = useMemo(() => {
        const series = transformations
            .map(t => t.series)
            .filter((s): s is string => !!s && s.trim() !== '');
        return [...new Set(series)];
    }, [transformations]);

    // Build filters array with "All" first, then dynamic series
    const filters = [
        { label: lang === 'es' ? 'Todo' : 'All', tag: '' },
        ...dynamicSeries.map(series => ({ label: series, tag: series }))
    ];

    return (
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-black/5 dark:border-white/5 md:hidden transition-colors duration-300">
            <div className="overflow-x-auto no-scrollbar py-3 px-4">
                <div className="flex gap-2 whitespace-nowrap min-w-max">
                    {filters.map((filter) => {
                        // SEO Link Construction: 
                        // If tag is present, go to /tag/[slug]
                        // If removed (All), go to /

                        // NOTE: We need to handle active state differently now.
                        // Active if pathname includes the tag.

                        // Also, we need to make sure the tag is URL friendly.
                        // For now, simple encodeURIComponent. Ideally slugify.
                        const slug = filter.tag ? encodeURIComponent(filter.tag).replace(/%20/g, '-') : '';

                        const href = filter.tag
                            ? `/${lang}/tag/${slug}`
                            : `/${lang}`;

                        // Check active state
                        const isActive = filter.tag
                            ? pathname.includes(`/tag/${slug}`)
                            : (pathname === `/${lang}` || pathname === '/');

                        return (
                            <Link
                                key={filter.label}
                                href={href}
                                className={`
                                    text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200
                                    ${isActive
                                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                        : 'bg-transparent text-gray-500 border-gray-200 dark:border-gray-800 dark:text-gray-400 hover:border-black dark:hover:border-white'
                                    }
                                `}
                            >
                                {filter.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
