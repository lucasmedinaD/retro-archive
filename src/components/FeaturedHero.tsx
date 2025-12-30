'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ScanLine, Fingerprint, Zap } from 'lucide-react';
import { Transformation } from '@/data/transformations';

interface FeaturedHeroProps {
    transformation: Transformation;
    dict: any;
    lang: string;
}

export default function FeaturedHero({ transformation, dict, lang }: FeaturedHeroProps) {
    const controls = useAnimation();
    const [sliderX, setSliderX] = useState(50);

    // Auto-play the slider
    useEffect(() => {
        const sequence = async () => {
            while (true) {
                // Center
                setSliderX(50);
                await new Promise(r => setTimeout(r, 2000));

                // Show Anime (Source)
                setSliderX(10);
                await new Promise(r => setTimeout(r, 3000));

                // Show Real (Sim)
                setSliderX(90);
                await new Promise(r => setTimeout(r, 3000));

                // Back to center
            }
        };
        sequence();
    }, []);

    return (
        <section className="relative border-b border-black dark:border-white overflow-hidden bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white h-[85vh] md:h-[80vh] flex flex-col md:flex-row">
            {/* Left: Context & CTA */}
            <div className="relative z-20 flex-1 flex flex-col justify-center p-8 md:p-16 lg:p-24 border-b md:border-b-0 md:border-r border-black/10 dark:border-white/20">

                <div className="flex items-center gap-3 mb-6">
                    <img src="/logo.png" alt="Retro Archive" className="w-10 h-10 dark:invert" />
                    <div className="flex items-center gap-2 text-accent">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em]">
                            LABORATORY ONLINE
                        </span>
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-6 uppercase">
                    {dict?.hero?.title_less || 'LESS'} <br />
                    <span className="text-accent italic font-serif font-normal block mt-2">
                        {dict?.hero?.title_is_more || 'IS MORE'}
                    </span>
                </h1>

                <p className="font-mono text-sm text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed border-l-2 border-accent pl-4">
                    {dict?.hero?.description || 'Laboratory of advanced aesthetics. Raw materials for physical reality.'}
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <Link
                        href={`/${lang}#catalog`}
                        className="group relative inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-accent dark:hover:bg-accent hover:text-white transition-colors"
                    >
                        <span>{dict?.hero?.cta_secondary || 'Browse Designs'}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />

                        {/* Tech corners */}
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

            {/* Right: The Loop (Visual Hook) */}
            <div className="absolute inset-0 md:relative md:inset-auto md:flex-1 h-full w-full overflow-hidden flex items-center justify-center p-4 bg-white/50 dark:bg-black/40">
                <div className="relative h-full max-h-[80vh] w-auto aspect-[4/5] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
                    {/* Background: Real (Simulation) */}
                    <img
                        src={transformation.realImage}
                        alt="Reality"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Foreground: Anime (Source) - Clipped */}
                    <motion.div
                        className="absolute inset-0 z-10 overflow-hidden"
                        animate={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <img
                            src={transformation.animeImage}
                            alt="Anime"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Source Label Overlay */}
                        <div className="absolute top-6 left-6 z-20">
                            <span className="bg-blue-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20 shadow-lg">
                                {dict?.transformation?.from || 'SOURCE'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Simulation Label Overlay (Static on right) */}
                    <div className="absolute top-6 right-6 z-0">
                        <span className="bg-green-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20 shadow-lg">
                            {dict?.anime_to_real?.title || 'SIMULATION'}
                        </span>
                    </div>

                    {/* Slider Line */}
                    <motion.div
                        className="absolute inset-y-0 w-1 bg-white z-20 shadow-[0_0_20px_rgba(255,255,255,0.5)] cursor-none pointer-events-none"
                        animate={{ left: `${sliderX}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full border border-white flex items-center justify-center">
                            <ScanLine size={20} className="text-white animate-pulse" />
                        </div>
                    </motion.div>

                    {/* Overlay Gradient for Text readability on Mobile */}
                    <div className="absolute inset-0 bg-black/40 md:bg-transparent pointer-events-none z-10" />
                </div>
            </div>
        </section>
    );
}
