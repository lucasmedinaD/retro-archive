'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Heart, Users, TrendingUp } from 'lucide-react';

interface SocialProofProps {
    likes: number;
    productId?: string;
    variant?: 'minimal' | 'full';
    className?: string;
    dict: {
        social_proof: {
            viewing_now: string;
            added_favorites: string;
            times: string;
            trending: string;
        };
    };
}

function generateViewingNow(productId: string): number {
    const baseValue = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const timeVariation = Math.floor(Date.now() / 30000) % 10;
    return 3 + (baseValue % 15) + timeVariation;
}

export default function SocialProof({
    likes,
    productId = 'default',
    variant = 'full',
    className = '',
    dict
}: SocialProofProps) {
    const [viewingNow, setViewingNow] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setViewingNow(generateViewingNow(productId));

        const interval = setInterval(() => {
            setViewingNow(generateViewingNow(productId));
        }, 30000);

        return () => clearInterval(interval);
    }, [productId]);

    if (!isClient) return null;

    if (variant === 'minimal') {
        return (
            <div className={`flex items-center gap-3 text-xs font-mono ${className}`}>
                <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Eye size={12} className="animate-pulse text-green-500" />
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={viewingNow}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                        >
                            {viewingNow}
                        </motion.span>
                    </AnimatePresence>
                </span>
                {likes > 0 && (
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Heart size={12} className="text-red-500" />
                        {likes}
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-sm"
            >
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={viewingNow}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-bold"
                        >
                            {viewingNow}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-gray-600 dark:text-gray-400 font-mono text-xs uppercase">
                        {dict.social_proof.viewing_now}
                    </span>
                </div>
            </motion.div>

            {likes > 0 && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 text-sm"
                >
                    <Heart size={14} className="text-red-500 fill-red-500" />
                    <span className="font-mono text-xs">
                        {dict.social_proof.added_favorites} <span className="font-bold">{likes}</span> {dict.social_proof.times}
                    </span>
                </motion.div>
            )}

            {(likes > 10 || viewingNow > 10) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold uppercase px-2 py-1"
                >
                    <TrendingUp size={10} />
                    {dict.social_proof.trending}
                </motion.div>
            )}
        </div>
    );
}

