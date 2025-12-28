'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';

interface FeaturedProductProps {
    product: Product;
    lang: 'en' | 'es';
    dict: any;
}

export default function FeaturedProduct({ product, lang, dict }: FeaturedProductProps) {
    const displayName = lang === 'es' && product.name_es ? product.name_es : (product.name_en || product.name);
    const displayDescription = lang === 'es' && product.description_es ? product.description_es : (product.description_en || product.description);

    return (
        <section className="relative w-full bg-[#f4f4f0] dark:bg-[#111111] border-b-2 border-black dark:border-white py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Image Side */}
                    <div className="relative aspect-square w-full">
                        <div className="relative w-full h-full border-2 border-black dark:border-white shadow-[8px_8px_0px_#111111] dark:shadow-[8px_8px_0px_#f4f4f0]">
                            <Image
                                src={product.image}
                                alt={displayName}
                                fill
                                className="object-cover"
                                unoptimized
                                priority
                            />
                        </div>
                        {/* Featured Label */}
                        <div className="absolute -bottom-6 left-0 bg-white dark:bg-black border-2 border-black dark:border-white px-6 py-2">
                            <p className="font-mono text-sm font-bold uppercase tracking-wider">
                                {lang === 'es' ? 'DESTACADO' : 'FEATURED'} // VOL. 01
                            </p>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">
                                {lang === 'es' ? 'PRODUCTO DESTACADO' : 'FEATURED PRODUCT'}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                                {displayName}
                            </h2>
                            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                {displayDescription}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold font-mono">{product.price}</span>
                            <Link
                                href={product.buyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-bold uppercase tracking-wider border-2 border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all inline-block"
                            >
                                {dict.catalog?.get_it || 'GET IT'}
                            </Link>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t border-black/10 dark:border-white/10">
                                {product.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-xs px-3 py-1 bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/20 font-mono uppercase"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
