'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface CommentFormProps {
    transformationId: string;
    lang: 'en' | 'es';
    onCommentPosted: () => void;
    parentId?: string;
    autoFocus?: boolean;
}

export default function CommentForm({ transformationId, lang, onCommentPosted, parentId, autoFocus }: CommentFormProps) {
    const { user, signInWithGoogle } = useAuth();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !user) return;

        setIsSubmitting(true);
        setError(null);

        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    transformation_id: transformationId,
                    user_id: user.id,
                    content: content.trim(),
                    parent_id: parentId || null
                });

            if (error) throw error;

            setContent('');
            onCommentPosted();
        } catch (err) {
            console.error('Error posting comment:', err);
            setError(lang === 'es' ? 'Error al publicar comentario' : 'Error posting comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-xl text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {lang === 'es'
                        ? 'Inicia sesión para dejar un comentario'
                        : 'Sign in to leave a comment'}
                </p>
                <button
                    onClick={signInWithGoogle}
                    className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full hover:opacity-80 transition-opacity"
                >
                    {lang === 'es' ? 'Iniciar Sesión con Google' : 'Sign In with Google'}
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    {user.user_metadata?.avatar_url ? (
                        <Image
                            src={user.user_metadata.avatar_url}
                            alt="Avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                    )}
                </div>
                <div className="flex-grow">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={lang === 'es' ? 'Escribe un comentario...' : 'Write a comment...'}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all resize-none min-h-[100px]"
                        disabled={isSubmitting}
                        autoFocus={autoFocus}
                    />

                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}

                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!content.trim() || isSubmitting}
                            className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-full disabled:opacity-50 hover:opacity-80 transition-opacity"
                        >
                            {isSubmitting
                                ? (lang === 'es' ? 'Publicando...' : 'Posting...')
                                : (lang === 'es' ? 'Publicar' : 'Post')}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
