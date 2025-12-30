'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
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
        <section className="py-12 border-t-2 border-black dark:border-white">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">
                    Get the Look
                </h2>
                <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    Shop {characterName}'s outfit essentials
                </p>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setActiveFilter(category)}
                        className={`px-4 py-2 text-xs uppercase font-mono whitespace-nowrap transition-all duration-200 ${activeFilter === category
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-white dark:bg-black border-2 border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <p className="font-mono text-sm text-gray-500">
                        No products in this category yet
                    </p>
                </div>
            )}

            {/* Affiliate Disclosure */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center font-mono">
                    * This post contains affiliate links. We may earn a commission at no extra cost to you.
                </p>
            </div>
        </section>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <div className="group border-2 border-black dark:border-white hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_rgba(255,255,255,1)] transition-all duration-200 hover:-translate-y-1 hover:-translate-x-1 bg-white dark:bg-black">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden border-b-2 border-black dark:border-white">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />

                {/* Stock Badge */}
                {product.inStock === false && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-[10px] font-bold uppercase">
                        Out of Stock
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3">
                {/* Brand */}
                <p className="font-mono text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase">
                    {product.brand}
                </p>

                {/* Product Name */}
                <h3 className="font-bold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-lg font-black">
                        ${product.price}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                        {product.currency}
                    </span>
                </div>

                {/* CTA Button */}
                <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={`block w-full text-center py-2.5 text-xs uppercase font-bold transition-colors ${product.inStock === false
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
                        }`}
                    onClick={(e) => {
                        if (product.inStock === false) {
                            e.preventDefault();
                        }
                    }}
                >
                    <span className="flex items-center justify-center gap-2">
                        {product.inStock === false ? 'Unavailable' : 'Shop Now'}
                        {product.inStock !== false && <ExternalLink size={12} />}
                    </span>
                </a>
            </div>
        </div>
    );
}
