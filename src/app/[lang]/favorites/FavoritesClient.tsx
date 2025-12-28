'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';
import { Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

interface FavoritesClientProps {
    lang: 'en' | 'es';
    dict: any;
    allProducts: Product[];
}

export default function FavoritesClient({ lang, dict, allProducts }: FavoritesClientProps) {
    const { favorites, isLoaded } = useFavorites();
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (isLoaded) {
            const filtered = allProducts.filter(p => favorites.includes(p.id));
            setFavoriteProducts(filtered);
        }
    }, [favorites, isLoaded, allProducts]);

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black dark:bg-[#111111] dark:text-[#f4f4f0] transition-colors duration-300">
            <Header lang={lang} dict={dict} />

            {/* Breadcrumb */}
            <div className="px-6 py-4 border-b border-black dark:border-white">
                <Link href={`/${lang}`} className="flex items-center gap-2 font-mono text-xs font-bold hover:underline w-fit">
                    <ArrowLeft size={16} /> {dict.product_detail.back}
                </Link>
            </div>

            {/* Page Content */}
            <section className="max-w-[90rem] mx-auto px-6 py-20">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-4 border-2 border-black dark:border-white">
                        <Heart size={32} fill="currentColor" className="text-red-500" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9]">
                        {dict.favorites.title}
                    </h1>
                </div>

                {isLoaded && favoriteProducts.length === 0 && (
                    <div className="text-center py-20 border border-black dark:border-white bg-white dark:bg-black">
                        <Heart size={64} className="mx-auto mb-6 text-gray-300 dark:text-gray-700" />
                        <h2 className="text-3xl font-black mb-4 uppercase">
                            {dict.favorites.empty_title}
                        </h2>
                        <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            {dict.favorites.empty_description}
                        </p>
                        <Link
                            href={`/${lang}#catalog`}
                            className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-transparent hover:text-black dark:hover:text-white border border-black dark:border-white transition-colors"
                        >
                            {dict.favorites.browse_catalog}
                        </Link>
                    </div>
                )}

                {isLoaded && favoriteProducts.length > 0 && (
                    <>
                        <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-8">
                            {favoriteProducts.length} {favoriteProducts.length === 1 ? dict.favorites.product_count_singular : dict.favorites.product_count_plural}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {favoriteProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    lang={lang}
                                    label={dict.catalog.get_it}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Footer */}
            <footer className="border-t border-black dark:border-white bg-white dark:bg-black py-12 px-6 mt-20">
                <div className="max-w-[90rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="font-black text-2xl mb-4">RETRO<span className="text-accent">.ARCHIVE</span></h4>
                        <p className="font-mono text-xs max-w-xs text-gray-500">
                            {dict.footer.description}
                        </p>
                    </div>
                    <div className="font-mono text-xs text-center md:text-right">
                        <p>© 2024</p>
                        <p>{dict.footer.rights}</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
