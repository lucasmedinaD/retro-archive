'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { getTransformations } from '@/data/transformations';
import { useMemo } from 'react';

interface DesktopFilterBarProps {
    lang: 'en' | 'es';
}

export default function DesktopFilterBar({ lang }: DesktopFilterBarProps) {
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

    // Don't render if no series available
    if (dynamicSeries.length === 0) return null;

    return (
        <div className="hidden md:block py-4 px-6 max-w-[90rem] mx-auto">
            <div className="flex items-center gap-4">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                    {lang === 'es' ? 'Filtrar:' : 'Filter:'}
                </p>
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => {
                        const href = filter.tag
                            ? `/${lang}?filter=${encodeURIComponent(filter.tag)}`
                            : `/${lang}`;

                        const isActive = filter.tag
                            ? currentFilter === filter.tag
                            : !currentFilter;

                        return (
                            <Link
                                key={filter.label}
                                href={href}
                                className={`
                                    text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 transition-all duration-200
                                    ${isActive
                                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                        : 'bg-transparent text-gray-600 border-gray-300 dark:border-gray-700 dark:text-gray-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
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
