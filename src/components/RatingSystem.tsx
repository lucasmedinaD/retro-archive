'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface RatingSystemProps {
    transformationId: string;
    lang: 'en' | 'es';
}

export default function RatingSystem({ transformationId, lang }: RatingSystemProps) {
    const { user, signInWithGoogle } = useAuth();
    const [userRating, setUserRating] = useState<number | null>(null);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [totalVotes, setTotalVotes] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                // Get average rating
                const { data: stats, error: statsError } = await supabase
                    .from('transformation_ratings')
                    .select('average_rating, vote_count')
                    .eq('transformation_id', transformationId)
                    .single();

                if (!statsError && stats) {
                    setAverageRating(stats.average_rating);
                    setTotalVotes(stats.vote_count);
                }

                // Get user rating if logged in
                if (user) {
                    const { data: userVote, error: userError } = await supabase
                        .from('ratings')
                        .select('rating')
                        .eq('transformation_id', transformationId)
                        .eq('user_id', user.id)
                        .single();

                    if (!userError && userVote) {
                        setUserRating(userVote.rating);
                    }
                }
            } catch (error) {
                console.error('Error fetching ratings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [supabase, transformationId, user]);

    const handleVote = async (rating: number) => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        if (!supabase) return;

        // Optimistic update
        setUserRating(rating);

        // Calculate new optimistic average (simplified)
        const newTotal = userRating ? totalVotes : totalVotes + 1;
        // This is a rough approximation for instant feedback, real data comes on refresh
        // For accurate optimistic avg we'd need the sum, but let's just update the user star immediately for feedback

        try {
            const { error } = await supabase
                .from('ratings')
                .upsert(
                    {
                        user_id: user.id,
                        transformation_id: transformationId,
                        rating
                    },
                    { onConflict: 'user_id, transformation_id' }
                );

            if (error) throw error;
        } catch (error) {
            console.error('Error submitting vote:', error);
            // Revert on error
            // setUserRating(previous); 
        }
    };

    return (
        <div className="flex flex-col items-center gap-2 p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleVote(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                        disabled={isLoading}
                    >
                        <Star
                            size={28}
                            className={`transition-colors ${(hoverRating !== null ? star <= hoverRating : (userRating !== null && star <= userRating))
                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                                : 'text-gray-300 dark:text-gray-600'
                                }`}
                            strokeWidth={
                                (hoverRating !== null ? star <= hoverRating : (userRating !== null && star <= userRating)) ? 0 : 2
                            }
                        />
                    </button>
                ))}
            </div>

            <div className="text-center">
                {averageRating ? (
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold font-mono">
                            {averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 uppercase font-mono">
                            {totalVotes} {totalVotes === 1
                                ? (lang === 'es' ? 'voto' : 'vote')
                                : (lang === 'es' ? 'votos' : 'votes')}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400 font-mono uppercase mt-1">
                        {lang === 'es' ? 'Sin votos aún' : 'No votes yet'}
                    </span>
                )}
            </div>

            {!user && (
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    {lang === 'es' ? 'Inicia sesión para votar' : 'Sign in to vote'}
                </p>
            )}
        </div>
    );
}
