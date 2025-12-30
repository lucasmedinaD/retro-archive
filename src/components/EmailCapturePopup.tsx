'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Gift, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'retro-archive-email-captured';
const DISMISS_KEY = 'retro-archive-popup-dismissed';

interface EmailCapturePopupProps {
    delay?: number;
    showOnExitIntent?: boolean;
    dict: {
        email_capture: {
            exclusive_access: string;
            title: string;
            description: string;
            collectors: string;
            description_end: string;
            placeholder: string;
            cta: string;
            processing: string;
            no_spam: string;
            success_title: string;
            success_message: string;
        };
    };
}

export default function EmailCapturePopup({
    delay = 15000,
    showOnExitIntent = true,
    dict
}: EmailCapturePopupProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const alreadyCaptured = localStorage.getItem(STORAGE_KEY);
        const dismissed = localStorage.getItem(DISMISS_KEY);
        const dismissedTime = dismissed ? parseInt(dismissed) : 0;
        const daysSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

        if (alreadyCaptured || (dismissed && daysSinceDismiss < 7)) {
            setHasInteracted(true);
        }
    }, []);

    useEffect(() => {
        if (!showOnExitIntent || hasInteracted) return;

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !isVisible) {
                setIsVisible(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [showOnExitIntent, hasInteracted, isVisible]);

    useEffect(() => {
        if (hasInteracted) return;

        const timer = setTimeout(() => {
            if (!isVisible) {
                setIsVisible(true);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, hasInteracted, isVisible]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setIsSubmitting(true);

        try {
            const emails = JSON.parse(localStorage.getItem('retro-archive-emails') || '[]');
            emails.push({ email, timestamp: Date.now() });
            localStorage.setItem('retro-archive-emails', JSON.stringify(emails));
            localStorage.setItem(STORAGE_KEY, 'true');

            setIsSuccess(true);
            setTimeout(() => setIsVisible(false), 2000);
        } catch (err) {
            console.error('Error saving email');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
        setIsVisible(false);
        setHasInteracted(true);
    };

    if (hasInteracted && !isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={handleDismiss}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={e => e.stopPropagation()}
                        className="relative w-full max-w-md bg-[#0a0a0a] border-2 border-accent overflow-hidden"
                    >
                        <button
                            onClick={handleDismiss}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 border-b border-accent/30">
                            <div className="flex items-center gap-3 mb-2">
                                <Gift className="text-accent" size={24} />
                                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
                                    {dict.email_capture.exclusive_access}
                                </span>
                            </div>
                            <h2 className="text-2xl font-black uppercase text-white">
                                {dict.email_capture.title}
                            </h2>
                        </div>

                        <div className="p-6">
                            {isSuccess ? (
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <Sparkles className="mx-auto text-accent mb-4" size={48} />
                                    <p className="text-xl font-bold text-white mb-2">{dict.email_capture.success_title}</p>
                                    <p className="text-sm text-gray-400 font-mono">
                                        {dict.email_capture.success_message}
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                                        {dict.email_capture.description} <span className="font-bold text-white">{dict.email_capture.collectors}</span> {dict.email_capture.description_end}
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder={dict.email_capture.placeholder}
                                                required
                                                className="w-full bg-black border-2 border-gray-700 focus:border-accent pl-10 pr-4 py-3 text-white outline-none transition-colors font-mono"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-accent text-black font-bold uppercase py-3 hover:bg-white transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? dict.email_capture.processing : dict.email_capture.cta}
                                        </button>
                                    </form>

                                    <p className="text-[10px] text-gray-500 text-center mt-4 font-mono">
                                        {dict.email_capture.no_spam}
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

