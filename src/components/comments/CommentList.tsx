'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Comment } from '@/types/comment';
import { Trash2, Heart, MessageCircle, Reply } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useState } from 'react';
import CommentForm from './CommentForm';

interface CommentListProps {
    comments: Comment[];
    lang: 'en' | 'es';
    onDelete: (id: string) => void;
    onReplyPosted: () => void;
}

export default function CommentList({ comments, lang, onDelete, onReplyPosted }: CommentListProps) {
    const { user, signInWithGoogle } = useAuth();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

    // Helper to toggle like locally for optimistic UI
    // In a real app we would sync this state better with the parent, but for now local state + refetch works
    const toggleLike = async (commentId: string, currentHasLiked: boolean) => {
        if (!user) {
            signInWithGoogle();
            return;
        }

        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        // Optimistic update
        // We can't easily update the specific comment object deep in the tree without a complex state manager or context
        // Ideally the parent refetches on any interaction, but let's try to just hit the DB and let the parent re-fetch

        if (currentHasLiked) {
            await supabase.from('comment_likes').delete().eq('comment_id', commentId).eq('user_id', user.id);
        } else {
            await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id });
        }

        onReplyPosted(); // Trigger refetch (reusing this function name for "refresh")
    };

    const handleDelete = async (commentId: string) => {
        if (!confirm(lang === 'es' ? '¿Eliminar comentario?' : 'Delete comment?')) return;

        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (!error) {
            onDelete(commentId);
        }
    };

    // Recursive component for rendering comments tree
    const CommentItem = ({ comment, depth = 0 }: { comment: Comment, depth?: number }) => {
        const hasLiked = comment.user_has_liked || false;
        const replies = comments.filter(c => c.parent_id === comment.id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        return (
            <div className={`flex gap-4 group ${depth > 0 ? 'mt-4 ml-8 border-l-2 border-gray-100 dark:border-zinc-800 pl-4' : ''}`}>
                <div className="flex-shrink-0">
                    {comment.profiles?.avatar_url ? (
                        <Image
                            src={comment.profiles.avatar_url}
                            alt={comment.profiles.full_name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full w-8 h-8 object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-xs font-bold">
                            {comment.profiles?.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <div className="flex items-baseline justify-between">
                        <h4 className="font-bold text-sm">
                            {comment.profiles?.full_name || (lang === 'es' ? 'Usuario Anónimo' : 'Anonymous User')}
                        </h4>
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.created_at), {
                                addSuffix: true,
                                locale: lang === 'es' ? es : enUS
                            })}
                        </span>
                    </div>

                    <div className="mt-1 text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm">
                        {comment.content}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-2">
                        <button
                            onClick={() => toggleLike(comment.id, !!comment.user_has_liked)}
                            className={`flex items-center gap-1 text-xs font-medium transition-colors ${comment.user_has_liked ? 'text-red-500' : 'text-gray-500 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            <Heart size={14} fill={comment.user_has_liked ? "currentColor" : "none"} />
                            {comment.likes_count || 0}
                        </button>

                        <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <MessageCircle size={14} />
                            {lang === 'es' ? 'Responder' : 'Reply'}
                        </button>

                        {user && user.id === comment.user_id && (
                            <button
                                onClick={() => handleDelete(comment.id)}
                                className="text-red-500 text-xs flex items-center gap-1 hover:underline ml-auto"
                            >
                                <Trash2 size={12} />
                                {lang === 'es' ? 'Eliminar' : 'Delete'}
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                        <div className="mt-4">
                            <CommentForm
                                transformationId={comment.transformation_id}
                                lang={lang}
                                onCommentPosted={() => {
                                    setReplyingTo(null);
                                    onReplyPosted();
                                }}
                                parentId={comment.id}
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Nested Replies */}
                    {replies.length > 0 && (
                        <div className="mt-2">
                            {replies.map(reply => (
                                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Filter only top-level comments for the main list
    const rootComments = comments.filter(c => !c.parent_id);

    if (comments.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>{lang === 'es' ? 'Sé el primero en comentar' : 'Be the first to comment'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {rootComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
            ))}
        </div>
    );
}
