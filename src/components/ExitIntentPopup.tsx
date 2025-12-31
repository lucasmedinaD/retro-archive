'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitIntentPopupProps {
    dict?: any;
}

export default function ExitIntentPopup({ dict }: ExitIntentPopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Check if already shown or dismissed
        const dismissed = localStorage.getItem('exitPopupDismissed');
        const subscribed = localStorage.getItem('newsletterSubscribed');
        if (dismissed || subscribed) return;

        // Wait 5 seconds before enabling exit intent detection
        const timer = setTimeout(() => {
            const handleMouseLeave = (e: MouseEvent) => {
                // Only trigger when mouse leaves from top of page
                if (e.clientY <= 0) {
                    setIsVisible(true);
                    // Remove listener after showing once
                    document.removeEventListener('mouseleave', handleMouseLeave);
                }
            };

            document.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                document.removeEventListener('mouseleave', handleMouseLeave);
            };
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('exitPopupDismissed', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);

        try {
            // Use the existing newsletter action
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setIsSubmitted(true);
                localStorage.setItem('newsletterSubscribed', 'true');
                setTimeout(() => setIsVisible(false), 3000);
            }
        } catch (error) {
            console.error('Newsletter signup failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={handleDismiss}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md bg-[#f4f4f0] dark:bg-[#111111] border-2 border-accent p-8 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {!isSubmitted ? (
                            <>
                                {/* Icon */}
                                <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
                                    <Gift size={32} className="text-accent" />
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-black uppercase mb-2">
                                    {dict?.exitPopup?.title || '¡Espera!'}
                                </h2>

                                {/* Subtitle */}
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    {dict?.exitPopup?.subtitle || 'Suscribite y recibí descuentos exclusivos en nuevos diseños'}
                                </p>

                                {/* Email Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={dict?.exitPopup?.placeholder || 'Tu email...'}
                                            className="w-full pl-12 pr-4 py-4 border-2 border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white outline-none focus:border-accent transition-colors"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-accent text-black font-black uppercase hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting
                                            ? (dict?.exitPopup?.submitting || 'Enviando...')
                                            : (dict?.exitPopup?.cta || '¡Quiero Descuentos!')}
                                    </button>
                                </form>

                                {/* No thanks */}
                                <button
                                    onClick={handleDismiss}
                                    className="mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {dict?.exitPopup?.dismiss || 'No gracias, prefiero pagar precio completo'}
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Success State */}
                                <div className="w-16 h-16 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center">
                                    <span className="text-4xl">🎉</span>
                                </div>
                                <h2 className="text-2xl font-black uppercase mb-2">
                                    {dict?.exitPopup?.successTitle || '¡Gracias!'}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {dict?.exitPopup?.successMessage || 'Te avisaremos cuando haya descuentos exclusivos'}
                                </p>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
