'use client';

import { useState, useEffect, useMemo } from 'react';
import { Star, Eye, Sparkles, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface CategoryRatingSystemProps {
    transformationId: string;
    lang: 'en' | 'es';
}

type CategoryKey = 'realism' | 'impact' | 'fidelity';

interface CategoryConfig {
    key: CategoryKey;
    labelEn: string;
    labelEs: string;
    icon: React.ReactNode;
    color: string;
}

const CATEGORIES: CategoryConfig[] = [
    { key: 'realism', labelEn: 'Realism', labelEs: 'Realismo', icon: <Eye size={16} />, color: 'text-blue-500' },
    { key: 'impact', labelEn: 'Impact', labelEs: 'Impacto', icon: <Sparkles size={16} />, color: 'text-yellow-500' },
    { key: 'fidelity', labelEn: 'Fidelity', labelEs: 'Fidelidad', icon: <Target size={16} />, color: 'text-green-500' },
];

export default function CategoryRatingSystem({ transformationId, lang }: CategoryRatingSystemProps) {
    const { user, signInWithGoogle } = useAuth();
    const [userRatings, setUserRatings] = useState<Record<CategoryKey, number | null>>({
        realism: null,
        impact: null,
        fidelity: null
    });
    const [averageRatings, setAverageRatings] = useState<Record<CategoryKey, number | null>>({
        realism: null,
        impact: null,
        fidelity: null
    });
    const [hoverRating, setHoverRating] = useState<{ category: CategoryKey; value: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = useMemo(() => createSupabaseBrowserClient(), []);

    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Get average ratings per category
                const { data: stats } = await supabase
                    .from('category_votes')
                    .select('category, score')
                    .eq('transformation_id', transformationId);

                if (stats && stats.length > 0) {
                    const grouped: Record<CategoryKey, number[]> = { realism: [], impact: [], fidelity: [] };
                    stats.forEach((row: any) => {
                        if (grouped[row.category as CategoryKey]) {
                            grouped[row.category as CategoryKey].push(row.score);
                        }
                    });

                    const avgRatingsComputed: Record<CategoryKey, number | null> = {
                        realism: grouped.realism.length > 0 ? grouped.realism.reduce((a, b) => a + b, 0) / grouped.realism.length : null,
                        impact: grouped.impact.length > 0 ? grouped.impact.reduce((a, b) => a + b, 0) / grouped.impact.length : null,
                        fidelity: grouped.fidelity.length > 0 ? grouped.fidelity.reduce((a, b) => a + b, 0) / grouped.fidelity.length : null
                    };
                    setAverageRatings(avgRatingsComputed);
                }

                // Get user's own votes if logged in
                if (user) {
                    const { data: userVotes } = await supabase
                        .from('category_votes')
                        .select('category, score')
                        .eq('transformation_id', transformationId)
                        .eq('user_id', user.id);

                    if (userVotes) {
                        const userRatingsComputed: Record<CategoryKey, number | null> = { realism: null, impact: null, fidelity: null };
                        userVotes.forEach((row: any) => {
                            userRatingsComputed[row.category as CategoryKey] = row.score;
                        });
                        setUserRatings(userRatingsComputed);
                    }
                }
            } catch (error) {
                console.error('Error fetching category ratings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [supabase, transformationId, user]);

    const handleVote = async (category: CategoryKey, score: number) => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        if (!supabase) return;

        // Optimistic update
        setUserRatings(prev => ({ ...prev, [category]: score }));

        try {
            const { error } = await supabase
                .from('category_votes')
                .upsert(
                    {
                        user_id: user.id,
                        transformation_id: transformationId,
                        category,
                        score
                    },
                    { onConflict: 'user_id,transformation_id,category' }
                );

            if (error) throw error;
        } catch (error) {
            console.error('Error submitting category vote:', error);
        }
    };

    const renderStars = (category: CategoryKey, config: CategoryConfig) => {
        const userValue = userRatings[category];
        const hoverValue = hoverRating?.category === category ? hoverRating.value : null;

        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleVote(category, star)}
                        onMouseEnter={() => setHoverRating({ category, value: star })}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                        disabled={isLoading}
                    >
                        <Star
                            size={18}
                            className={`transition-colors ${(hoverValue !== null ? star <= hoverValue : (userValue !== null && star <= userValue))
                                    ? `fill-current ${config.color}`
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                            strokeWidth={(hoverValue !== null ? star <= hoverValue : (userValue !== null && star <= userValue)) ? 0 : 2}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-white/5">
            <h3 className="text-xs font-bold uppercase text-gray-500 mb-3">
                {lang === 'es' ? 'Votar por Categoría' : 'Vote by Category'}
            </h3>

            <div className="space-y-3">
                {CATEGORIES.map((config) => (
                    <div key={config.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={config.color}>{config.icon}</span>
                            <span className="text-sm font-medium">
                                {lang === 'es' ? config.labelEs : config.labelEn}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {renderStars(config.key, config)}
                            {averageRatings[config.key] !== null && (
                                <span className="text-xs font-mono text-gray-400 w-8 text-right">
                                    {averageRatings[config.key]!.toFixed(1)}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {!user && (
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-3 text-center">
                    {lang === 'es' ? 'Inicia sesión para votar' : 'Sign in to vote'}
                </p>
            )}
        </div>
    );
}
