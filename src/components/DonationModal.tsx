'use client';

import { X, Coffee, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: 'en' | 'es';
}

export default function DonationModal({ isOpen, onClose, lang }: DonationModalProps) {
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
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer/Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-[70] bg-[#f4f4f0] dark:bg-[#1b1b1b] rounded-t-3xl border-t border-white/20 p-6 shadow-2xl md:top-1/2 md:left-1/2 md:right-auto md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:rounded-3xl"
                    >
                        {/* Handle for mobile */}
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 md:hidden" />

                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#FFDD00] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Coffee size={32} className="text-black" />
                            </div>

                            <h2 className="text-2xl font-black uppercase mb-2">
                                {lang === 'es' ? 'Apoya el Proyecto' : 'Support the Project'}
                            </h2>

                            <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                {lang === 'es'
                                    ? 'Retro Archive es mantenido por una sola persona. Si te gustan las transformaciones y diseños, ¡un café ayuda mucho!'
                                    : 'Retro Archive is a one-person project. If you love the transformations and designs, a coffee helps a lot!'}
                            </p>

                            <a
                                href="https://buymeacoffee.com/sosacrash"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-4 bg-[#FFDD00] hover:bg-[#FFE433] text-black font-black uppercase tracking-widest rounded-xl transition-transform active:scale-95 shadow-lg mb-4"
                            >
                                {lang === 'es' ? '☕ Invítame un Café' : '☕ Buy me a Coffee'}
                            </a>

                            <button
                                onClick={onClose}
                                className="block w-full py-3 text-sm font-bold text-gray-500 uppercase hover:text-black dark:hover:text-white transition-colors"
                            >
                                {lang === 'es' ? 'Quizás luego' : 'Maybe later'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
