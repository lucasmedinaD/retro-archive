'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Eye, TrendingUp, Star } from 'lucide-react';
import { TransformationData } from '../actions/transformations';

// Helper to get transformations
async function fetchTransformations(): Promise<TransformationData[]> {
    try {
        const res = await fetch('/api/transformations');
        if (res.ok) {
            const data = await res.json();
            return data.transformations || [];
        }
    } catch (e) { }
    return [];
}

export default function StatsPage() {
    const [transformations, setTransformations] = useState<TransformationData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to load from transformations.json directly
        import('@/data/transformations.json').then((data) => {
            setTransformations(data.transformations || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    // Calculate stats
    const totalLikes = transformations.reduce((sum, t) => sum + (t.likes || 0), 0);
    const avgLikes = transformations.length > 0 ? (totalLikes / transformations.length).toFixed(1) : 0;
    const topTransformations = [...transformations]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 5);

    // Group by series
    const seriesStats = transformations.reduce((acc, t) => {
        const series = t.series || 'Unknown';
        if (!acc[series]) acc[series] = { count: 0, likes: 0 };
        acc[series].count++;
        acc[series].likes += t.likes || 0;
        return acc;
    }, {} as Record<string, { count: number; likes: number }>);

    const topSeries = Object.entries(seriesStats)
        .sort((a, b) => b[1].likes - a[1].likes)
        .slice(0, 5);

    if (loading) {
        return (
            <main className="min-h-screen bg-[#111] text-white p-8">
                <div className="animate-pulse">Loading stats...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#111] text-white font-mono p-8">
            <header className="flex items-center gap-4 mb-12 border-b border-[#333] pb-6">
                <Link href="/admin" className="hover:text-accent">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black uppercase">📊 Statistics</h1>
                    <p className="text-xs text-gray-500">Analytics Overview</p>
                </div>
            </header>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Total Transformations</div>
                    <div className="text-4xl font-bold text-accent">{transformations.length}</div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Total Likes</div>
                    <div className="text-4xl font-bold text-red-500 flex items-center gap-2">
                        <Heart size={24} className="fill-red-500" />
                        {totalLikes}
                    </div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Avg Likes</div>
                    <div className="text-4xl font-bold">{avgLikes}</div>
                </div>
                <div className="border border-[#333] p-6 bg-black/50">
                    <div className="text-xs text-gray-500 uppercase mb-2">Unique Series</div>
                    <div className="text-4xl font-bold text-purple-400">{Object.keys(seriesStats).length}</div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Top Transformations */}
                <div className="border border-[#333] p-6 bg-black/50">
                    <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-accent" />
                        Top Transformations
                    </h2>
                    <div className="space-y-3">
                        {topTransformations.map((t, i) => (
                            <div key={t.id} className="flex items-center justify-between py-2 border-b border-[#222]">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-gray-600">#{i + 1}</span>
                                    <div>
                                        <div className="font-bold">{t.characterName}</div>
                                        <div className="text-xs text-gray-500">{t.series}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-red-400">
                                    <Heart size={14} className="fill-red-400" />
                                    {t.likes || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Series */}
                <div className="border border-[#333] p-6 bg-black/50">
                    <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
                        <Star size={20} className="text-yellow-400" />
                        Top Series
                    </h2>
                    <div className="space-y-3">
                        {topSeries.map(([series, stats], i) => (
                            <div key={series} className="flex items-center justify-between py-2 border-b border-[#222]">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-gray-600">#{i + 1}</span>
                                    <div>
                                        <div className="font-bold">{series}</div>
                                        <div className="text-xs text-gray-500">{stats.count} transformations</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-red-400">
                                    <Heart size={14} className="fill-red-400" />
                                    {stats.likes}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
