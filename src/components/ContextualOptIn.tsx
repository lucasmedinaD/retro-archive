'use client';

import { useState } from 'react';
import { Bell, Check, X, Loader2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface ContextualOptInProps {
    seriesName: string;
    lang: 'en' | 'es';
}

export default function ContextualOptIn({ seriesName, lang }: ContextualOptInProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsSubmitting(true);
        setError(null);

        const supabase = createSupabaseBrowserClient();
        if (!supabase) {
            setError('Connection error');
            setIsSubmitting(false);
            return;
        }

        try {
            const { error: insertError } = await supabase
                .from('leads')
                .insert({
                    email: email.trim().toLowerCase(),
                    interest_tag: seriesName
                });

            if (insertError) {
                // Duplicate = already subscribed
                if (insertError.code === '23505') {
                    setIsSuccess(true);
                } else {
                    throw insertError;
                }
            } else {
                setIsSuccess(true);
            }
        } catch (err: any) {
            console.error('Error subscribing:', err);
            setError(lang === 'es' ? 'Error al suscribir' : 'Subscription error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
                <Check size={16} />
                <span className="text-sm font-medium">
                    {lang === 'es'
                        ? `¡Te avisaremos cuando subamos más de ${seriesName}!`
                        : `We'll notify you when we upload more ${seriesName}!`}
                </span>
            </div>
        );
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-3 bg-black/5 dark:bg-white/5 hover:bg-accent/10 border border-black/10 dark:border-white/10 hover:border-accent transition-all group w-full"
            >
                <Bell size={16} className="text-accent group-hover:animate-bounce" />
                <span className="text-sm font-medium">
                    {lang === 'es'
                        ? `Avísame cuando subas más de ${seriesName}`
                        : `Notify me when you upload more ${seriesName}`}
                </span>
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Bell size={16} className="text-accent" />
                    <span className="text-sm font-bold uppercase">
                        {lang === 'es' ? `Más ${seriesName}` : `More ${seriesName}`}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                    <X size={14} />
                </button>
            </div>

            <div className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={lang === 'es' ? 'Tu email...' : 'Your email...'}
                    className="flex-1 px-3 py-2 border-2 border-black dark:border-white bg-transparent text-sm font-mono outline-none focus:bg-black/5 dark:focus:bg-white/5"
                    required
                    autoFocus
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="px-4 py-2 bg-accent text-white font-bold text-sm uppercase hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'OK'}
                </button>
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-2">{error}</p>
            )}

            <p className="text-[10px] text-gray-500 mt-2 font-mono">
                {lang === 'es'
                    ? 'Sin spam. Solo te avisamos de nuevos personajes de este anime.'
                    : 'No spam. We only notify you about new characters from this anime.'}
            </p>
        </form>
    );
}
