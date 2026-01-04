'use client';

import { X, Coffee, Heart, Sparkles, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: 'en' | 'es';
}

export default function DonationModal({ isOpen, onClose, lang }: DonationModalProps) {
    const content = {
        es: {
            badge: '💜 PROYECTO INDIE',
            title: '¿Te gusta Retro Archive?',
            subtitle: 'Soy una sola persona detrás de todo esto',
            description: 'Cada transformación, cada diseño, cada línea de código... todo hecho con amor por un fan del anime como tú. Por ahora es un proyecto pequeño, pero con tu apoyo podría crecer muchísimo más.',
            features: [
                '🎨 Más transformaciones cada semana',
                '✨ Nuevas series y personajes',
                '🛠️ Mejores herramientas y funciones'
            ],
            cta: '☕ Invítame un Café',
            ctaSubtext: 'Tu café = más contenido para todos',
            dismiss: 'Tal vez después',
            footer: 'Incluso compartir ayuda mucho 💜'
        },
        en: {
            badge: '💜 INDIE PROJECT',
            title: 'Enjoying Retro Archive?',
            subtitle: 'I\'m just one person behind all of this',
            description: 'Every transformation, every design, every line of code... all made with love by an anime fan like you. It\'s a small project for now, but with your support it could grow so much more.',
            features: [
                '🎨 More transformations every week',
                '✨ New series and characters',
                '🛠️ Better tools and features'
            ],
            cta: '☕ Buy me a Coffee',
            ctaSubtext: 'Your coffee = more content for everyone',
            dismiss: 'Maybe later',
            footer: 'Even sharing helps a lot 💜'
        }
    };

    const t = content[lang];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer/Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[70] bg-gradient-to-b from-[#f8f8f5] to-[#f0f0eb] dark:from-[#1a1a1a] dark:to-[#0f0f0f] rounded-t-3xl border-t border-white/20 p-6 shadow-2xl max-h-[85vh] overflow-y-auto md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:rounded-3xl"
                    >
                        {/* Handle for mobile */}
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4 md:hidden" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center">
                            {/* Badge */}
                            <span className="inline-block px-4 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                {t.badge}
                            </span>

                            {/* Icon */}
                            <div className="w-20 h-20 bg-gradient-to-br from-[#FFDD00] to-[#FF9900] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 hover:rotate-0 transition-transform">
                                <Coffee size={36} className="text-black" />
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-black mb-1">
                                {t.title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
                                <Code size={14} />
                                {t.subtitle}
                            </p>

                            {/* Description */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed px-2">
                                {t.description}
                            </p>

                            {/* Features */}
                            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 mb-5 text-left">
                                <p className="text-xs uppercase font-bold text-gray-400 mb-2">
                                    {lang === 'es' ? 'Tu apoyo hace posible:' : 'Your support makes possible:'}
                                </p>
                                {t.features.map((feature, i) => (
                                    <p key={i} className="text-sm py-1.5 border-b border-gray-200/50 dark:border-gray-700/50 last:border-0">
                                        {feature}
                                    </p>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <a
                                href="https://buymeacoffee.com/sosacrash"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block w-full py-4 bg-gradient-to-r from-[#FFDD00] to-[#FFE433] hover:from-[#FFE433] hover:to-[#FFDD00] text-black font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-lg shadow-yellow-500/20 mb-2"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {t.cta}
                                    <Sparkles size={16} className="group-hover:animate-pulse" />
                                </span>
                            </a>
                            <p className="text-xs text-gray-400 mb-4">{t.ctaSubtext}</p>

                            {/* Dismiss */}
                            <button
                                onClick={onClose}
                                className="block w-full py-3 text-sm font-medium text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                {t.dismiss}
                            </button>

                            {/* Footer */}
                            <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                                <Heart size={12} className="text-red-400" />
                                {t.footer}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
