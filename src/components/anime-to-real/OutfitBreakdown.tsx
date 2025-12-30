'use client';

import { useState } from 'react';
import { ExternalLink, Archive } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types/transformations';

interface OutfitBreakdownProps {
    products: Product[];
    characterName: string;
}

export default function OutfitBreakdown({ products, characterName }: OutfitBreakdownProps) {
    const [activeFilter, setActiveFilter] = useState<string>('all');

    const categories = ['all', 'tops', 'bottoms', 'shoes', 'accessories', 'other'];

    const filteredProducts = products.filter(p =>
        activeFilter === 'all' || p.category === activeFilter
    );

    return (
        <section className="py-16 md:py-24 border-t-2 border-black dark:border-white">
            {/* Editorial Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Archive size={24} className="text-accent" />
                    <span className="font-mono text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                        Archival Reference
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black uppercase mb-3 leading-none">
                    Construction<br />Elements
                </h2>
                <p className="font-mono text-sm text-gray-600 dark:text-gray-400 max-w-2xl">
                    Curated essentials to recreate {characterName}'s aesthetic. Each piece selected for authenticity and availability.
                </p>
            </div>

            {/* Refined Category Filters */}
            <div className="flex gap-2 mb-12 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        className={`px-5 py-2.5 text-xs uppercase font-mono whitespace-nowrap transition-all duration-200 border-2 ${activeFilter === category
                                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                                : 'bg-transparent border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white'
                            }`}
                    >
                        {category === 'all' ? 'All Elements' : category}
                    </button>
                ))}
            </div>

            {/* Premium Products Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <p className="font-mono text-sm text-gray-500">
                        No elements archived in this category
                    </p>
                </div>
            )}

            {/* Editorial Disclosure */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-mono leading-relaxed max-w-2xl mx-auto">
                    Product links are affiliate partnerships. Revenue supports our archival work at no additional cost to you.
                    All recommendations are editorially independent.
                </p>
            </div>
        </section>
    );
}

function ProductCard({ product }: { product: Product }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className="group">
            {/* Premium Image Container */}
            <div className="relative aspect-square overflow-hidden border-2 border-black dark:border-white mb-4 bg-gray-100 dark:bg-gray-900">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 animate-pulse" />
                )}

                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={`object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
                        }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    onLoad={() => setImageLoaded(true)}
                />

                {/* Availability Badge */}
                {product.inStock === false && (
                    <div className="absolute top-3 right-3 bg-black/90 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">
                        Archive Only
                    </div>
                )}

                {/* Category Label */}
                <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-black/95 px-3 py-1 text-[10px] font-mono uppercase border border-black/10 dark:border-white/10">
                    {product.category}
                </div>
            </div>

            {/* Refined Product Info */}
            <div className="space-y-3">
                {/* Brand */}
                <p className="font-mono text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    {product.brand}
                </p>

                {/* Product Name */}
                <h3 className="font-bold text-base leading-tight min-h-[2.5rem]">
                    {product.name}
                </h3>

                {/* Price with Editorial Styling */}
                <div className="flex items-baseline gap-2 pb-3 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-xl font-black tabular-nums">
                        ${product.price}
                    </span>
                    <span className="text-xs font-mono text-gray-500">
                        {product.currency}
                    </span>
                </div>

                {/* Premium CTA */}
                <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={`group/cta block w-full text-center py-3 text-xs uppercase font-bold tracking-wider transition-all duration-200 ${product.inStock === false
                            ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                        }`}
                    onClick={(e) => {
                        if (product.inStock === false) {
                            e.preventDefault();
                        }
                    }}
                >
                    <span className="flex items-center justify-center gap-2">
                        {product.inStock === false ? (
                            'Currently Unavailable'
                        ) : (
                            <>
                                View Source
                                <ExternalLink size={12} className="group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
                            </>
                        )}
                    </span>
                </a>
            </div>
        </div>
    );
}
