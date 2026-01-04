'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Transformation } from '@/data/transformations';

interface MiniAutoHeroProps {
    transformation: Transformation;
    lang: 'en' | 'es';
}

export default function MiniAutoHero({ transformation, lang }: MiniAutoHeroProps) {
    const [sliderX, setSliderX] = useState(50);

    // Auto-play the slider continuously
    useEffect(() => {
        const sequence = async () => {
            while (true) {
                // Start centered
                setSliderX(50);
                await new Promise(r => setTimeout(r, 1500));
                // Reveal anime
                setSliderX(10);
                await new Promise(r => setTimeout(r, 2000));
                // Reveal real
                setSliderX(90);
                await new Promise(r => setTimeout(r, 2000));
            }
        };
        sequence();
    }, []);

    return (
        <div className="mb-6 md:mb-8">
            <div className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden border-2 border-black dark:border-white shadow-lg">
                {/* Background: Real Image (defines height) */}
                <div className="relative w-full">
                    <img
                        src={transformation.realImage}
                        alt="Real"
                        className="w-full h-auto block"
                    />
                </div>

                {/* Foreground: Anime - Clipped */}
                <motion.div
                    className="absolute inset-0 z-10 overflow-hidden bg-white dark:bg-black"
                    animate={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                >
                    <img
                        src={transformation.animeImage}
                        alt="Anime"
                        className="w-full h-full object-cover sm:object-contain"
                    />

                    {/* Anime Label */}
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-blue-600 text-white px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                            ANIME
                        </span>
                    </div>
                </motion.div>

                {/* Real Label */}
                <div className="absolute top-3 right-3 z-0">
                    <span className="bg-green-600 text-white px-2 py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                        REAL
                    </span>
                </div>

                {/* Slider Line */}
                <motion.div
                    className="absolute inset-y-0 w-0.5 bg-white dark:bg-accent z-20 shadow-lg"
                    animate={{ left: `${sliderX}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                />

                {/* Character Name Overlay */}
                <div className="absolute bottom-3 left-3 right-3 z-20">
                    <div className="bg-black/80 dark:bg-white/90 px-3 py-2 rounded">
                        <p className="text-white dark:text-black font-bold text-sm md:text-base">
                            {transformation.characterName}
                        </p>
                        {transformation.series && (
                            <p className="text-white/80 dark:text-black/70 text-xs font-mono">
                                {transformation.series}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
