'use client';

import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { TransformationExtended } from '@/types/transformations';

// Dynamic import to reduce initial bundle size
const SwipeGallery = dynamic(() => import('./SwipeGallery'), {
    loading: () => <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full" />
    </div>
});

interface GalleryTriggerProps {
    transformations: TransformationExtended[];
    initialIndex?: number;
    lang: 'en' | 'es';
    children?: React.ReactNode;
}

export function GalleryTriggerButton({
    transformations,
    lang,
    initialIndex = 0
}: GalleryTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-40 md:bottom-8 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg shadow-purple-500/30 hover:scale-110 transition-transform"
                aria-label="Open gallery mode"
            >
                <Maximize2 size={24} />
            </motion.button>

            {/* Tooltip on first visit */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 1.5 }}
                        className="fixed bottom-24 right-20 z-40 md:bottom-8 bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap pointer-events-none"
                    >
                        {lang === 'es' ? '¡Modo TikTok! 🔥' : 'TikTok Mode! 🔥'}
                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-black" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gallery Modal */}
            <AnimatePresence>
                {isOpen && (
                    <SwipeGallery
                        transformations={transformations}
                        initialIndex={initialIndex}
                        lang={lang}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

// Hook to open gallery from card click
export function useGalleryMode() {
    const [state, setState] = useState<{
        isOpen: boolean;
        initialIndex: number;
    }>({ isOpen: false, initialIndex: 0 });

    const openGallery = (index: number) => {
        setState({ isOpen: true, initialIndex: index });
    };

    const closeGallery = () => {
        setState(prev => ({ ...prev, isOpen: false }));
    };

    return { ...state, openGallery, closeGallery };
}
