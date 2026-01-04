'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { getProducts, Product } from '@/data/products';
import { Search, X } from 'lucide-react';

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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Get unique categories from products
    const uniqueCategories = Array.from(new Set(products.map(p => p.category.toUpperCase())));

    // Enhanced filter by category and search term (including tags)
    const filteredProducts = products.filter(p => {
        const matchesCategory = filter === 'ALL' || p.category.toUpperCase() === filter;

        if (searchTerm === '') return matchesCategory;

        const searchLower = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(searchLower);
        const matchesDescription = p.description.toLowerCase().includes(searchLower);
        const matchesTags = p.tags?.some(tag =>
            tag.toLowerCase().includes(searchLower)
        ) || false;

        return matchesCategory && (matchesName || matchesDescription || matchesTags);
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

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div>
            {/* Search Bar - Minimalist */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setVisibleCount(ITEMS_PER_PAGE);
                        }}
                        placeholder={dict.search?.placeholder || 'BUSCAR DISEÑOS ...'}
                        className="w-full pl-12 pr-12 py-4 border-2 border-black dark:border-white bg-[#f4f4f0] dark:bg-[#111] text-black dark:text-white font-mono text-sm uppercase placeholder:text-gray-400 focus:outline-none focus:border-accent transition-colors"
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar - Brutalist Tags */}
            <div className="flex flex-wrap gap-4 mb-8 border-b-2 border-black dark:border-white pb-6">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => {
                            setFilter(cat.key);
                            setVisibleCount(ITEMS_PER_PAGE);
                        }}
                        className={`text-xs font-black font-mono uppercase px-3 py-1 transition-all ${filter === cat.key
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-transparent text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5'
                            }`}
                    >
                        [ {cat.label} ]
                    </button>
                ))}
            </div>

            {/* Grid - Matching InspirationFeed spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
                {visibleProducts.map((product, index) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        lang={lang}
                        label={dict.catalog.get_it}
                        index={index}
                        dict={dict}
                    />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 text-center font-mono">
                        {searchTerm ? (
                            <>
                                <Search size={64} className="mx-auto mb-6 text-gray-300 dark:text-gray-700" />
                                <h3 className="text-2xl font-black mb-2">{dict.search?.no_results || 'No products found'}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    {dict.search?.no_results_desc || 'Try different keywords'}
                                </p>
                                <button
                                    onClick={clearSearch}
                                    className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-bold uppercase text-xs hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                                >
                                    CLEAR SEARCH
                                </button>
                            </>
                        ) : (
                            <p className="text-gray-400">NO SIGNALS FOUND.</p>
                        )}
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
