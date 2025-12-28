'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { getProducts, Product } from '@/data/products';

// Dynamically import ProductCard with SSR disabled
const ProductCard = dynamic(() => import('@/components/ProductCard'), { ssr: false });

interface ProductGridProps {
    lang: 'en' | 'es';
    dict: any;
    products: Product[];
}

export default function ProductGrid({ lang, dict, products }: ProductGridProps) {
    const [filter, setFilter] = useState<'ALL' | 'APPAREL' | 'ACCESSORIES' | 'STICKERS'>('ALL');

    const filteredProducts = filter === 'ALL'
        ? products
        : products.filter(p => p.category === filter);

    const categories = [
        { key: 'ALL', label: dict.catalog.filters.all },
        { key: 'APPAREL', label: dict.catalog.filters.apparel },
        { key: 'ACCESSORIES', label: dict.catalog.filters.accessories },
        { key: 'STICKERS', label: dict.catalog.filters.stickers },
    ];

    return (
        <div>
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-8 border-b border-black dark:border-white pb-4">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setFilter(cat.key as any)}
                        className={`text-xs font-bold font-mono uppercase px-3 py-1 border transition-all ${filter === cat.key
                            ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                            : 'bg-transparent text-gray-500 hover:text-black dark:hover:text-white border-transparent hover:border-black dark:hover:border-white'
                            }`}
                    >
                        [ {cat.label} ]
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        lang={lang}
                        label={dict.catalog.get_it}
                    />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center font-mono text-gray-400">
                        NO SIGNALS FOUND.
                    </div>
                )}
            </div>
        </div>
    );
}
