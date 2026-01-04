'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '@/hooks/useFavorites';
import { Product } from '@/data/products';
import { Transformation } from '@/data/transformations';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowLeft, Sparkles, Package } from 'lucide-react';
import Header from '@/components/Header';

interface FavoritesClientProps {
    lang: 'en' | 'es';
    dict: any;
    allProducts: Product[];
    allTransformations: Transformation[];
}

type TabType = 'designs' | 'transformations';

export default function FavoritesClient({ lang, dict, allProducts, allTransformations }: FavoritesClientProps) {
    const { favorites, isLoaded } = useFavorites();
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
    const [likedTransformations, setLikedTransformations] = useState<Transformation[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('transformations');

    useEffect(() => {
        if (isLoaded) {
            const filtered = allProducts.filter(p => favorites.includes(p.id));
            setFavoriteProducts(filtered);
        }
    }, [favorites, isLoaded, allProducts]);

    // Load liked transformations from localStorage
    useEffect(() => {
        const likedIds = JSON.parse(localStorage.getItem('likedTransformations') || '[]');
        const liked = allTransformations.filter(t => likedIds.includes(t.id));
        setLikedTransformations(liked);
    }, [allTransformations]);

    const hasContent = favoriteProducts.length > 0 || likedTransformations.length > 0;

    const tabs = [
        {
            id: 'transformations' as TabType,
            label: lang === 'es' ? 'TRANSFORMACIONES' : 'TRANSFORMATIONS',
            count: likedTransformations.length,
            icon: Sparkles
        },
        {
            id: 'designs' as TabType,
            label: lang === 'es' ? 'DISEÑOS GUARDADOS' : 'SAVED DESIGNS',
            count: favoriteProducts.length,
            icon: Package
        },
    ];

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
            <section className="max-w-[90rem] mx-auto px-6 py-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 border-2 border-black dark:border-white">
                        <Heart size={24} fill="currentColor" className="text-red-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase leading-[0.9]">
                        {dict.favorites.title}
                    </h1>
                </div>

                {isLoaded && !hasContent && (
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

                {hasContent && (
                    <>
                        {/* Tabs */}
                        <div className="flex border-b-2 border-black dark:border-white mb-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider transition-colors ${activeTab === tab.id
                                        ? 'bg-black text-white dark:bg-white dark:text-black'
                                        : 'hover:bg-black/10 dark:hover:bg-white/10'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="bg-accent text-white px-1.5 py-0.5 text-[10px] rounded-full">
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Transformations Tab Content */}
                        {activeTab === 'transformations' && (
                            <>
                                {likedTransformations.length === 0 ? (
                                    <div className="text-center py-16 border border-dashed border-black/30 dark:border-white/30">
                                        <Sparkles size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                                        <p className="font-mono text-sm text-gray-500">
                                            {lang === 'es' ? 'No le diste like a ninguna transformación' : 'No liked transformations yet'}
                                        </p>
                                        <Link href={`/${lang}`} className="inline-block mt-4 text-accent font-bold text-sm hover:underline">
                                            {lang === 'es' ? 'Explorar transformaciones →' : 'Explore transformations →'}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {likedTransformations.map((t) => (
                                            <Link
                                                key={t.id}
                                                href={`/${lang}/anime-to-real/${t.id}`}
                                                className="group relative border-2 border-black dark:border-white overflow-hidden hover:border-accent transition-colors"
                                            >
                                                <div className="relative aspect-square">
                                                    <Image
                                                        src={t.realImage}
                                                        alt={t.characterName}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                                    <div className="absolute bottom-2 left-2 right-2">
                                                        <p className="font-bold text-white text-sm uppercase truncate">{t.characterName}</p>
                                                        <p className="text-[10px] font-mono text-white/70 truncate">{t.series}</p>
                                                    </div>
                                                    <div className="absolute top-2 right-2">
                                                        <Heart size={16} fill="red" className="text-red-500" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Designs Tab Content */}
                        {activeTab === 'designs' && (
                            <>
                                {favoriteProducts.length === 0 ? (
                                    <div className="text-center py-16 border border-dashed border-black/30 dark:border-white/30">
                                        <Package size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                                        <p className="font-mono text-sm text-gray-500">
                                            {lang === 'es' ? 'No tenés diseños guardados aún' : 'No saved designs yet'}
                                        </p>
                                        <Link href={`/${lang}/shop`} className="inline-block mt-4 text-accent font-bold text-sm hover:underline">
                                            {lang === 'es' ? 'Explorar diseños →' : 'Explore designs →'}
                                        </Link>
                                    </div>
                                ) : (
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
                                )}
                            </>
                        )}
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
