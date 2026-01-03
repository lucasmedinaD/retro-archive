'use client';

import { useParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
    const params = useParams();
    const lang = (params.lang as 'en' | 'es') || 'en';

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black dark:bg-[#111111] dark:text-[#f4f4f0] pb-24">
            {/* Mobile Header */}
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-black/5 dark:border-white/5 p-4 flex items-center gap-4 md:hidden">
                <Link href={`/${lang}`}>
                    <ArrowLeft size={24} className="text-gray-500" />
                </Link>
                <div className="flex-1">
                    <SearchBar
                        onSearch={() => { }}
                        placeholder={lang === 'es' ? 'Buscar...' : 'Search...'}
                        className="w-full"
                        autoFocus={true}
                    />
                </div>
            </header>

            <div className="p-6 md:p-12 max-w-4xl mx-auto">
                {/* Desktop Version Placeholder */}
                <div className="hidden md:block">
                    <h1 className="text-4xl font-black mb-8">{lang === 'es' ? 'BÚSQUEDA' : 'SEARCH'}</h1>
                    <SearchBar
                        onSearch={() => { }}
                        placeholder={lang === 'es' ? 'Buscar personaje, serie o producto...' : 'Search character, series or product...'}
                        className="w-full max-w-xl"
                    />
                </div>

                {/* Recent Searches / Trending (Placeholder for now) */}
                <div className="mt-8">
                    <h3 className="text-xs font-mono uppercase text-gray-500 mb-4">
                        {lang === 'es' ? 'Tendencias' : 'Trending'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {['Chainsaw Man', 'Reze', 'Komi-san', 'Cyberpunk'].map(tag => (
                            <Link
                                key={tag}
                                href={`/${lang}/shop?search=${tag}`}
                                className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-sm font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="md:hidden">
                {/* Mobile Nav is injected via layout generally, but we might need a specific wrapper here if layout doesn't handle it yet */}
            </div>
        </main>
    );
}
