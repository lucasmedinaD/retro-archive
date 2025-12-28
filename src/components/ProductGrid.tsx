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

const ITEMS_PER_PAGE = 9;

export default function ProductGrid({ lang, dict, products }: ProductGridProps) {
    const [filter, setFilter] = useState<string>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    // Get unique categories from products
    const uniqueCategories = Array.from(new Set(products.map(p => p.category.toUpperCase())));

    // Filter by category and search term
    const filteredProducts = products.filter(p => {
        const matchesCategory = filter === 'ALL' || p.category.toUpperCase() === filter;
        const matchesSearch = searchTerm === '' ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Paginated products
    const visibleProducts = filteredProducts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProducts.length;

    const categories = [
        { key: 'ALL', label: dict.catalog?.filters?.all || 'ALL' },
        ...uniqueCategories.map(cat => ({
            key: cat,
            label: cat
        }))
    ];

    const loadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    return (
        <div>
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-8 border-b border-black dark:border-white pb-4">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => {
                            setFilter(cat.key);
                            setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on filter change
                        }}
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
                {visibleProducts.map((product) => (
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

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={loadMore}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 font-bold uppercase tracking-wider border-2 border-black dark:border-white hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all"
                    >
                        LOAD MORE ({filteredProducts.length - visibleCount} remaining)
                    </button>
                </div>
            )}
        </div>
    );
}
