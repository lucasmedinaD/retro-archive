'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/data/products';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface ProductCardProps {
    product: Product;
    lang: 'en' | 'es';
    label: string;
}

export default function ProductCard({ product, lang, label }: ProductCardProps) {
    const { isFavorite, toggleFavorite, isLoaded } = useFavorites();

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toggleFavorite(product.id);
    };

    return (
        <Link href={`/${lang}/product/${product.id}`} className="group relative border border-black dark:border-white bg-white dark:bg-[#111111] flex flex-col h-full transition-all duration-300 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_#f4f4f0] hover:-translate-y-1 hover:-translate-x-1 block">
            {/* Category Tag */}
            <div className="absolute top-2 left-2 z-10">
                <span className="bg-black dark:bg-white text-white dark:text-black text-[10px] font-mono px-2 py-1 uppercase tracking-tighter">
                    {product.category}
                </span>
            </div>

            {/* Favorite Button */}
            {isLoaded && (
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-2 right-2 z-10 p-2 bg-white dark:bg-black border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    aria-label="Toggle favorite"
                >
                    <Heart
                        size={16}
                        fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                        className={isFavorite(product.id) ? 'text-red-500' : ''}
                    />
                </button>
            )}

            {/* Image Container - Aspect Ratio Square */}
            <div className="relative aspect-square w-full overflow-hidden border-b border-black dark:border-white md:aspect-[3/4]">
                <Image
                    src={product.image || '/mockups/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    unoptimized
                />
            </div>

            {/* Info & Action */}
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div className="mb-4">
                    <h3 className="text-lg font-bold uppercase tracking-tight leading-none mb-1 text-black dark:text-white">
                        {product.name}
                    </h3>
                    <p className="text-xs font-mono text-gray-500">REF: {product.id.toUpperCase()}</p>
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {product.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 font-mono">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-end justify-between border-t border-black dark:border-white pt-3">
                    <span className="text-sm font-bold font-mono text-black dark:text-white">***</span>
                    <span
                        className="bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-xs font-bold uppercase tracking-wider hover:invert border border-black dark:border-white transition-all"
                    >
                        {label} &rarr;
                    </span>
                </div>
            </div>
        </Link>
    );
}
