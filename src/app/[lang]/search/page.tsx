'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getTransformations } from '@/data/transformations';
import InspirationFeed from '@/components/anime-to-real/InspirationFeed';

export default function SearchPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const lang = (params.lang as 'en' | 'es') || 'en';

    // Get query from URL params
    const urlQuery = searchParams.get('q') || '';
    const [inputValue, setInputValue] = useState(urlQuery);

    // Get all transformations
    const allTransformations = getTransformations();

    // Filter transformations based on URL query
    const filteredTransformations = useMemo(() => {
        if (!urlQuery) return allTransformations;

        return allTransformations.filter(t =>
            t.characterName.toLowerCase().includes(urlQuery.toLowerCase()) ||
            (t.series && t.series.toLowerCase().includes(urlQuery.toLowerCase())) ||
            (t.tags && t.tags.some(tag => tag.toLowerCase().includes(urlQuery.toLowerCase())))
        );
    }, [urlQuery, allTransformations]);

    // Handle search submission
    const handleSearch = (query: string) => {
        setInputValue(query);
        if (query.trim()) {
            router.push(`/${lang}/search?q=${encodeURIComponent(query)}`);
        } else {
            router.push(`/${lang}/search`);
        }
    };

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black dark:bg-[#111111] dark:text-[#f4f4f0] pb-24">
            {/* Mobile Header */}
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-black/5 dark:border-white/5 p-4 flex items-center gap-4 md:hidden">
                <Link href={`/${lang}`}>
                    <ArrowLeft size={24} className="text-gray-500" />
                </Link>
                <div className="flex-1">
                    <SearchBar
                        onSearch={handleSearch}
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
                        onSearch={handleSearch}
                        placeholder={lang === 'es' ? 'Buscar por personaje, serie o tags...' : 'Search by character, series or tags...'}
                        className="max-w-2xl"
                    />
                </div>

                {/* Trending Series Pills */}
                <div className="mb-8">
                    <p className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider">
                        {lang === 'es' ? 'Tendencias' : 'Trending'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {['Chainsaw Man', 'Jujutsu Kaisen', 'Bocchi The Rock', 'Dandadan'].map(series => (
                            <button
                                key={series}
                                onClick={() => handleSearch(series)}
                                className="px-4 py-2 bg-white dark:bg-black border border-black dark:border-white text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            >
                                {series}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                <div>
                    {urlQuery && (
                        <p className="text-sm font-mono mb-4 text-gray-600 dark:text-gray-400">
                            {lang === 'es'
                                ? `${filteredTransformations.length} resultados para "${urlQuery}"`
                                : `${filteredTransformations.length} results for "${urlQuery}"`
                            }
                        </p>
                    )}

                    {filteredTransformations.length > 0 ? (
                        <InspirationFeed
                            transformations={filteredTransformations}
                            lang={lang}
                            hasMore={false}
                            isLoading={false}
                            dict={{}}
                        />
                    ) : urlQuery ? (
                        <div className="text-center py-20 max-w-md mx-auto">
                            <p className="text-2xl font-black mb-4">
                                {lang === 'es' ? '¡Todavía no!' : 'Not yet!'}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {lang === 'es'
                                    ? `No encontramos "${urlQuery}" aún, pero estamos agregando nuevos personajes constantemente. ¡Vuelve pronto!`
                                    : `We haven't found "${urlQuery}" yet, but we're constantly adding new characters. Check back soon!`
                                }
                            </p>
                            <Link
                                href={`/${lang}`}
                                className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-80 transition-opacity"
                            >
                                {lang === 'es' ? 'Ver todas las transformaciones' : 'View all transformations'}
                            </Link>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500 font-mono">
                                {lang === 'es' ? 'Escribe algo para buscar' : 'Type something to search'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
