'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { TransformationExtended } from '@/types/transformations';

interface RandomHeroProps {
    transformation: TransformationExtended;
    lang: 'en' | 'es';
}

export default function RandomHero({ transformation, lang }: RandomHeroProps) {
    return (
        <section className="border-b-2 border-black dark:border-white">
            <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row">
                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-16 bg-[#f4f4f0] dark:bg-[#111111]">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-500">
                            {lang === 'es' ? 'TRANSFORMACIÓN DESTACADA' : 'FEATURED TRANSFORMATION'}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight mb-2 uppercase">
                        {transformation.characterName}
                    </h1>

                    {transformation.series && (
                        <p className="text-lg md:text-xl font-serif italic text-accent mb-6">
                            {transformation.series}
                        </p>
                    )}

                    <p className="font-mono text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
                        {lang === 'es'
                            ? 'Deslizá para ver la transformación de anime a real. Cada visita muestra un personaje diferente.'
                            : 'Swipe to see the anime to real transformation. Each visit shows a different character.'}
                    </p>

                    <div className="flex gap-4">
                        <Link
                            href={`/${lang}/anime-to-real/${transformation.id}`}
                            className="group inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-accent hover:text-white transition-colors"
                        >
                            <span>{lang === 'es' ? 'Ver Transformación' : 'View Transformation'}</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href={`/${lang}/anime-to-real`}
                            className="inline-flex items-center gap-2 border-2 border-black dark:border-white px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                            {lang === 'es' ? 'Ver Todas' : 'See All'}
                        </Link>
                    </div>
                </div>

                {/* Image - Respects original aspect ratio */}
                <Link
                    href={`/${lang}/anime-to-real/${transformation.id}`}
                    className="flex-1 relative bg-gray-100 dark:bg-black/50 p-4 md:p-8 flex items-center justify-center group cursor-pointer"
                >
                    <div className="relative w-full max-w-md overflow-hidden border-2 border-black dark:border-white shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,1)] group-hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[12px_12px_0px_rgba(255,255,255,1)] transition-shadow">
                        {/* Show anime image as preview - original aspect ratio */}
                        <Image
                            src={transformation.animeImage}
                            alt={transformation.characterName}
                            width={500}
                            height={700}
                            className="w-full h-auto object-contain"
                            priority
                        />

                        {/* Overlay hint */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                            <span className="text-white font-bold text-sm uppercase tracking-wide px-4 py-2 bg-black/50 backdrop-blur-sm">
                                {lang === 'es' ? 'Ver la magia →' : 'See the magic →'}
                            </span>
                        </div>

                        {/* Badge */}
                        <div className="absolute top-3 left-3">
                            <span className="bg-accent text-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider">
                                2.5D
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
