'use client';

import { useState, useEffect } from 'react';
import { Crown, Star, Heart, Sparkles } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface Hero {
    id: string;
    name: string;
    message?: string;
    avatar_url?: string;
    featured: boolean;
    is_anonymous: boolean;
    created_at: string;
}

interface HeroesSectionProps {
    lang: 'en' | 'es';
    showClaimForm?: boolean;
}

export default function HeroesSection({ lang, showClaimForm = true }: HeroesSectionProps) {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', bmc_name: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchHeroes();
    }, []);

    const fetchHeroes = async () => {
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        const { data } = await supabase
            .from('heroes')
            .select('*')
            .eq('is_verified', true)
            .order('featured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(50);

        if (data) setHeroes(data);
        setIsLoading(false);
    };

    const handleClaimSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) return;

        setIsSubmitting(true);
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        const { error } = await supabase
            .from('hero_claims')
            .insert({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                bmc_name: formData.bmc_name.trim() || null,
                message: formData.message.trim() || null
            });

        if (!error) {
            setSubmitSuccess(true);
            setFormData({ name: '', email: '', bmc_name: '', message: '' });
        }
        setIsSubmitting(false);
    };

    return (
        <section className="border-2 border-black dark:border-white p-6">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-6">
                <Crown className="text-yellow-500" size={24} />
                <h3 className="text-xl font-black uppercase">
                    {lang === 'es' ? 'Héroes de la Tribu' : 'Heroes of the Tribe'}
                </h3>
                <Crown className="text-yellow-500" size={24} />
            </div>

            {/* Heroes Grid */}
            {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                    <Sparkles className="animate-spin mx-auto mb-2" />
                </div>
            ) : heroes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-mono text-sm">
                    {lang === 'es'
                        ? 'Sé el primero en unirte a la tribu'
                        : 'Be the first to join the tribe'}
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {heroes.map((hero) => (
                        <div
                            key={hero.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-transform hover:scale-105 ${hero.featured
                                    ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-500 shadow-lg shadow-yellow-500/20'
                                    : 'bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20'
                                }`}
                        >
                            {hero.featured && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                            <span className={`text-sm font-bold ${hero.featured ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
                                {hero.is_anonymous
                                    ? (lang === 'es' ? 'Héroe Anónimo' : 'Anonymous Hero')
                                    : hero.name}
                            </span>
                            <Heart size={12} className="text-red-500 fill-red-500" />
                        </div>
                    ))}
                </div>
            )}

            {/* CTA Button */}
            <div className="text-center mb-4">
                <a
                    href="https://buymeacoffee.com/sosacrash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFDD00] text-black font-bold text-sm uppercase hover:bg-[#FFE433] transition-colors border-2 border-black hover:scale-105"
                >
                    🍜 {lang === 'es' ? 'Invita un Ramen' : 'Buy me a Ramen'}
                </a>
            </div>

            {/* Claim Form Toggle */}
            {showClaimForm && !submitSuccess && (
                <div className="text-center">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="text-xs font-mono text-gray-500 hover:text-black dark:hover:text-white underline"
                    >
                        {lang === 'es' ? '¿Ya donaste? Reclama tu lugar' : 'Already donated? Claim your spot'}
                    </button>
                </div>
            )}

            {/* Claim Form */}
            {showForm && !submitSuccess && (
                <form onSubmit={handleClaimSubmit} className="mt-4 space-y-3 max-w-md mx-auto">
                    <input
                        type="text"
                        placeholder={lang === 'es' ? 'Tu nombre (como quieres aparecer)' : 'Your name (as you want to appear)'}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black dark:border-white bg-transparent text-sm"
                        required
                    />
                    <input
                        type="email"
                        placeholder={lang === 'es' ? 'Email usado en Buy Me a Coffee' : 'Email used on Buy Me a Coffee'}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black dark:border-white bg-transparent text-sm"
                        required
                    />
                    <input
                        type="text"
                        placeholder={lang === 'es' ? 'Tu nombre en BMC (opcional)' : 'Your BMC display name (optional)'}
                        value={formData.bmc_name}
                        onChange={(e) => setFormData({ ...formData, bmc_name: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-black dark:border-white bg-transparent text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase disabled:opacity-50"
                    >
                        {isSubmitting
                            ? (lang === 'es' ? 'Enviando...' : 'Sending...')
                            : (lang === 'es' ? 'Reclamar mi lugar' : 'Claim my spot')}
                    </button>
                    <p className="text-[10px] text-gray-500 text-center">
                        {lang === 'es'
                            ? 'Verificaremos tu donación y te agregaremos a la lista.'
                            : "We'll verify your donation and add you to the list."}
                    </p>
                </form>
            )}

            {/* Success Message */}
            {submitSuccess && (
                <div className="mt-4 text-center p-4 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400">
                    <Sparkles className="mx-auto mb-2" size={20} />
                    <p className="text-sm font-medium">
                        {lang === 'es'
                            ? '¡Gracias! Verificaremos tu donación pronto.'
                            : "Thank you! We'll verify your donation soon."}
                    </p>
                </div>
            )}
        </section>
    );
}
