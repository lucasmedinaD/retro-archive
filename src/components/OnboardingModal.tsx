'use client';

import { useState, useEffect } from 'react';
import { User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface OnboardingModalProps {
    lang: 'en' | 'es';
}

export default function OnboardingModal({ lang }: OnboardingModalProps) {
    const { user, showNsfw } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [enableNsfw, setEnableNsfw] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        // Check if we should show onboarding
        if (!user || hasChecked) return;

        const checkProfile = async () => {
            const supabase = createSupabaseBrowserClient();
            if (!supabase) return;

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single();

                // Show onboarding if no profile OR no username set
                if (error || !data || !data.username) {
                    setIsOpen(true);
                    // Pre-fill with Google name if available
                    if (user.user_metadata?.full_name) {
                        setUsername(user.user_metadata.full_name.split(' ')[0]);
                    }
                }
            } catch (err) {
                console.error('Error checking profile:', err);
            }
            setHasChecked(true);
        };

        checkProfile();
    }, [user, hasChecked]);

    const handleSubmit = async () => {
        if (!user || !username.trim()) return;

        setIsSubmitting(true);
        const supabase = createSupabaseBrowserClient();
        if (!supabase) return;

        try {
            // Update profile with username and NSFW preference + Google data
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username: username.trim(),
                    full_name: user.user_metadata?.full_name || username.trim(),
                    avatar_url: user.user_metadata?.avatar_url || null,
                    show_nsfw: enableNsfw,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            // Close modal
            setIsOpen(false);
            // Force refresh to apply NSFW setting
            window.location.reload();
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111] border-2 border-black dark:border-white w-full max-w-md animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-6 border-b border-black/10 dark:border-white/10 text-center">
                    <h2 className="text-2xl font-black uppercase">
                        {lang === 'es' ? '¡Bienvenido!' : 'Welcome!'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 font-mono">
                        {lang === 'es' ? 'Configura tu perfil' : 'Set up your profile'}
                    </p>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Username */}
                    <div>
                        <label className="block text-xs uppercase mb-2 font-bold flex items-center gap-2">
                            <User size={14} />
                            {lang === 'es' ? 'Nombre de Usuario' : 'Username'}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={lang === 'es' ? 'Tu nombre...' : 'Your name...'}
                            className="w-full px-4 py-3 border-2 border-black dark:border-white bg-transparent font-mono outline-none focus:bg-black/5 dark:focus:bg-white/5 transition-colors"
                            maxLength={30}
                            autoFocus
                        />
                    </div>

                    {/* NSFW Toggle */}
                    <div className="border-2 border-red-500/30 bg-red-500/5 p-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={enableNsfw}
                                onChange={(e) => setEnableNsfw(e.target.checked)}
                                className="w-5 h-5 accent-red-500"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-sm">
                                    <Shield size={14} />
                                    {lang === 'es' ? 'Contenido +18' : '+18 Content'}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {lang === 'es'
                                        ? 'Activar contenido picante (puedes cambiarlo después)'
                                        : 'Enable spicy content (you can change this later)'}
                                </p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-black/10 dark:border-white/10">
                    <button
                        onClick={handleSubmit}
                        disabled={!username.trim() || isSubmitting}
                        className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isSubmitting
                            ? (lang === 'es' ? 'Guardando...' : 'Saving...')
                            : (lang === 'es' ? '¡Empezar!' : 'Get Started!')}
                    </button>
                </div>
            </div>
        </div>
    );
}
