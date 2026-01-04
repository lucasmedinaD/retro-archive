'use client';

import { useEffect, useState, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Comment } from '@/types/comment';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { Loader2 } from 'lucide-react';

interface CommentSectionProps {
    transformationId: string;
    lang: 'en' | 'es';
}

export default function CommentSection({ transformationId, lang }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        // 1. Fetch comments with profiles and total likes count
        const { data: commentsData, error: commentsError } = await supabase
            .from('comments')
            .select(`
                *,
                profiles (
                    full_name,
                    avatar_url
                ),
                likes_count:comment_likes(count)
            `)
            .eq('transformation_id', transformationId)
            .order('created_at', { ascending: false });

        if (commentsError || !commentsData) {
            console.error('Error fetching comments:', commentsError);
            setIsLoading(false);
            return;
        }

        // 2. If user is logged in, fetch their likes to see which they liked
        let userLikesSet = new Set<string>();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const commentIds = commentsData.map(c => c.id);
            if (commentIds.length > 0) {
                const { data: userLikes } = await supabase
                    .from('comment_likes')
                    .select('comment_id')
                    .eq('user_id', user.id)
                    .in('comment_id', commentIds);

                if (userLikes) {
                    userLikes.forEach(l => userLikesSet.add(l.comment_id));
                }
            }
        }

        // 3. Merge data
        const formattedComments: Comment[] = commentsData.map(c => ({
            ...c,
            likes_count: c.likes_count?.[0]?.count || 0,
            user_has_liked: userLikesSet.has(c.id)
        }));

        setComments(formattedComments);
        setIsLoading(false);
    }, [transformationId]);

    useEffect(() => {
        fetchComments();

        // Optional: Realtime subscription
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        const channel = supabase
            .channel('public:comments')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    filter: `transformation_id=eq.${transformationId}`
                },
                () => {
                    fetchComments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [transformationId, fetchComments]);

    return (
        <section className="mt-16 pt-16 border-t border-gray-200 dark:border-zinc-800 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black uppercase mb-8">
                {lang === 'es'
                    ? `Comentarios (${comments.length})`
                    : `Comments (${comments.length})`}
            </h3>

            <CommentForm
                transformationId={transformationId}
                lang={lang}
                onCommentPosted={fetchComments}
            />

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <CommentList
                    comments={comments}
                    lang={lang}
                    onDelete={(id) => setComments(prev => prev.filter(c => c.id !== id))}
                    onReplyPosted={fetchComments}
                />
            )}
        </section>
    );
}
