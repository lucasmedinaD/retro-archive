'use client';

import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Comment } from '@/types/comment';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface CommentListProps {
    comments: Comment[];
    lang: 'en' | 'es';
    onDelete: (id: string) => void;
}

export default function CommentList({ comments, lang, onDelete }: CommentListProps) {
    const { user } = useAuth();

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

    if (comments.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>{lang === 'es' ? 'Sé el primero en comentar' : 'Be the first to comment'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                        {comment.profiles?.avatar_url ? (
                            <Image
                                src={comment.profiles.avatar_url}
                                alt={comment.profiles.full_name || 'User'}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-xs font-bold">
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
                        <div className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">
                            {comment.content}
                        </div>

                        {user && user.id === comment.user_id && (
                            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-red-500 text-xs flex items-center gap-1 hover:underline"
                                >
                                    <Trash2 size={12} />
                                    {lang === 'es' ? 'Eliminar' : 'Delete'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
