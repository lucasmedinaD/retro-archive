'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Fingerprint, Zap } from 'lucide-react';
import { Transformation } from '@/data/transformations';

interface FeaturedHeroProps {
    transformation: Transformation;
    dict: any;
    lang: string;
}

export default function FeaturedHero({ transformation, dict, lang }: FeaturedHeroProps) {
    const [sliderX, setSliderX] = useState(50);

    // Auto-play the slider
    useEffect(() => {
        const sequence = async () => {
            while (true) {
                setSliderX(50);
                await new Promise(r => setTimeout(r, 2000));
                setSliderX(10);
                await new Promise(r => setTimeout(r, 3000));
                setSliderX(90);
                await new Promise(r => setTimeout(r, 3000));
            }
        };
        sequence();
    }, []);

    return (
        <section className="border-b border-black dark:border-white bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white">
            {/* Mobile: Stack vertically | Desktop: Side by side */}
            <div className="flex flex-col md:flex-row min-h-[60vh] md:min-h-[80vh]">

                {/* Content Section - Always visible with solid background */}
                <div className="flex-1 flex flex-col justify-center p-6 md:p-16 lg:p-24 bg-[#f4f4f0] dark:bg-[#111111] z-10">

                    <div className="flex items-center gap-2 text-accent mb-4 md:mb-6">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em]">
                            LABORATORY ONLINE
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-4 md:mb-6 uppercase">
                        {dict?.hero?.title_less || 'DISEÑOS'} <br />
                        <span className="text-accent italic font-serif font-normal block mt-1 md:mt-2">
                            {dict?.hero?.title_is_more || 'ORIGINALES'}
                        </span>
                    </h1>

                    <p className="font-mono text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6 md:mb-8 leading-relaxed border-l-2 border-accent pl-4">
                        {dict?.hero?.description || 'Arte único de anime y retro listo para camisetas, stickers y más.'}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start gap-4">
                        <Link
                            href={`/${lang}#catalog`}
                            className="group relative inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-6 sm:px-8 py-3 sm:py-4 font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-white transition-colors"
                        >
                            <span>{dict?.hero?.cta_secondary || 'Ver Diseños'}</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white dark:border-black" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white dark:border-black" />
                        </Link>

                        <div className="hidden md:flex flex-col gap-1 text-[10px] font-mono text-gray-500 uppercase mt-2">
                            <span className="flex items-center gap-1">
                                <Fingerprint size={12} /> SECURE CONNECTION
                            </span>
                            <span className="flex items-center gap-1">
                                <Zap size={12} /> INSTANT RENDER
                            </span>
                        </div>
                    </div>
                </div>

                {/* Image Section - Below on mobile, side on desktop */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-6 bg-gray-100 dark:bg-black/50">
                    <div className="relative w-full max-w-sm md:max-w-none md:h-full md:max-h-[70vh] aspect-[4/5] shadow-xl border border-black/10 dark:border-white/10 overflow-hidden">
                        {/* Background: Real Image */}
                        <img
                            src={transformation.realImage}
                            alt="Reality"
                            className="absolute inset-0 w-full h-full object-contain bg-white dark:bg-black"
                        />

                        {/* Foreground: Anime - Clipped */}
                        <motion.div
                            className="absolute inset-0 z-10 overflow-hidden"
                            animate={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        >
                            <img
                                src={transformation.animeImage}
                                alt="Anime"
                                className="absolute inset-0 w-full h-full object-contain bg-white dark:bg-black"
                            />
                            <div className="absolute top-4 left-4 z-20">
                                <span className="bg-blue-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                    {dict?.transformation?.from || 'ANIME'}
                                </span>
                            </div>
                        </motion.div>

                        {/* Real Label */}
                        <div className="absolute top-4 right-4 z-0">
                            <span className="bg-green-600 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                {dict?.anime_to_real?.title || 'REAL'}
                            </span>
                        </div>

                        {/* Slider Line */}
                        <motion.div
                            className="absolute inset-y-0 w-0.5 bg-white z-20 shadow-lg"
                            animate={{ left: `${sliderX}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

