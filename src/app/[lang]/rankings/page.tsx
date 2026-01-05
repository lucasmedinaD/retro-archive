'use client';

import { useState, useEffect } from 'react';
import { getRankings } from '@/lib/gamification-db';
import { getTransformationByIdFromDB } from '@/lib/transformations-db';
import { TransformationExtended } from '@/types/transformations';
import TransformationCard from '@/components/anime-to-real/TransformationCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RankingsPage({ params: { lang }, searchParams }: any) {
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
    const [rankings, setRankings] = useState<TransformationExtended[]>([]);
    const [loading, setLoading] = useState(true);

    const dict = {
        title: lang === 'es' ? 'Rankings' : 'Rankings',
        weekly: lang === 'es' ? 'Semanal' : 'Weekly',
        monthly: lang === 'es' ? 'Mensual' : 'Monthly',
        allTime: lang === 'es' ? 'Histórico' : 'All Time',
        subtitle: lang === 'es' ? 'Las transformaciones más impactantes votadas por la comunidad.' : 'Top transformations voted by the community.',
        empty: lang === 'es' ? 'Aún no hay suficientes datos para este periodo.' : 'Not enough data for this period yet.'
    };

    useEffect(() => {
        let isMounted = true;

        async function fetchRankings() {
            setLoading(true);
            try {
                // 1. Get IDs from gamification DB
                const ids = await getRankings(period, 12);

                // 2. Hydrate with full transformation data
                // Note: In a real app we'd optimize this to a single query or a bulk fetch
                const transformationPromises = ids.map(id => getTransformationByIdFromDB(id));
                const results = await Promise.all(transformationPromises);

                if (isMounted) {
                    setRankings(results.filter((t): t is TransformationExtended => !!t));
                }
            } catch (error) {
                console.error("Failed to fetch rankings", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchRankings();
        return () => { isMounted = false; };
    }, [period]);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-20">
            {/* Header */}
            <div className="pt-32 pb-12 px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tighter">
                    {dict.title}
                </h1>
                <p className="text-gray-500 max-w-md mx-auto">{dict.subtitle}</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-2 mb-12">
                {(['weekly', 'monthly', 'all-time'] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-6 py-2 uppercase text-xs font-bold border ${period === p
                                ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                                : 'border-gray-300 dark:border-gray-800 hover:border-black dark:hover:border-white'
                            } transition-colors`}
                    >
                        {p === 'weekly' ? dict.weekly : p === 'monthly' ? dict.monthly : dict.allTime}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4 max-w-7xl">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 dark:bg-gray-900 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : rankings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                        {rankings.map((t, index) => (
                            <div key={t.id} className="relative">
                                {/* Rank Badge */}
                                <div className="absolute -top-4 -left-4 z-10 w-12 h-12 flex items-center justify-center bg-accent text-white font-black text-xl rounded-full shadow-xl border-4 border-white dark:border-black transform -rotate-12">
                                    #{index + 1}
                                </div>
                                <TransformationCard
                                    transformation={t}
                                    lang={lang}
                                    priority={index < 4}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 opacity-50">
                        {dict.empty}
                    </div>
                )}
            </div>
        </div>
    );
}
