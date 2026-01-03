'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getTransformations } from '@/data/transformations';
import InspirationFeed from '@/components/anime-to-real/InspirationFeed';

export default function SearchPage() {
    const params = useParams();
    const lang = (params.lang as 'en' | 'es') || 'en';
    const [searchQuery, setSearchQuery] = useState('');

    // Get all transformations
    const allTransformations = getTransformations();

    // Filter transformations based on search
    const filteredTransformations = searchQuery
        ? allTransformations.filter(t =>
            t.characterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.series && t.series.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        )
        : allTransformations; // Show all when no search query

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black dark:bg-[#111111] dark:text-[#f4f4f0] pb-24">
            {/* Mobile Header */}
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-black/5 dark:border-white/5 p-4 flex items-center gap-4 md:hidden">
                <Link href={`/${lang}`}>
                    <ArrowLeft size={24} className="text-gray-500" />
                </Link>
                <div className="flex-1">
                    <SearchBar
                        onSearch={(query) => setSearchQuery(query)}
                        placeholder={lang === 'es' ? 'Buscar transformación...' : 'Search transformation...'}
                        className="w-full"
                        autoFocus={true}
                    />
                </div>
            </header>

            <div className="p-6 md:p-12 max-w-[90rem] mx-auto">
                {/* Desktop Version */}
                <div className="hidden md:block mb-8">
                    <h1 className="text-4xl font-black mb-6">{lang === 'es' ? 'BUSCAR TRANSFORMACIONES' : 'SEARCH TRANSFORMATIONS'}</h1>
                    <SearchBar
                        onSearch={(query) => setSearchQuery(query)}
                        placeholder={lang === 'es' ? 'Buscar personaje o serie...' : 'Search character or series...'}
                        className="w-full max-w-xl"
                    />
                </div>

                {/* Trending Tags */}
                <div className="mb-8">
                    <h3 className="text-xs font-mono uppercase text-gray-500 mb-4">
                        {lang === 'es' ? 'Tendencias' : 'Trending'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {['Chainsaw Man', 'Jujutsu Kaisen', 'Bocchi The Rock', 'Dandadan'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSearchQuery(tag)}
                                className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-sm font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {searchQuery && (
                    <div>
                        <p className="text-sm font-mono mb-4 text-gray-600 dark:text-gray-400">
                            {lang === 'es'
                                ? `${filteredTransformations.length} resultados para "${searchQuery}"`
                                : `${filteredTransformations.length} results for "${searchQuery}"`
                            }
                        </p>

                        {filteredTransformations.length > 0 ? (
                            <InspirationFeed
                                transformations={filteredTransformations}
                                lang={lang}
                                hasMore={false}
                                isLoading={false}
                                dict={{}}
                            />
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-gray-500 font-mono">
                                    {lang === 'es' ? 'No se encontraron transformaciones' : 'No transformations found'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
