'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const [lang, setLang] = useState<'en' | 'es'>('en');

    useEffect(() => {
        // Detect language from browser or URL
        const browserLang = navigator.language.toLowerCase();
        const urlLang = window.location.pathname.startsWith('/es') ? 'es' : 'en';
        setLang(browserLang.startsWith('es') || urlLang === 'es' ? 'es' : 'en');
    }, []);

    const content = {
        en: {
            subtitle: 'SIGNAL NOT FOUND',
            description: 'The page you\'re looking for doesn\'t exist in our archive. It may have been moved or deleted.',
            back: '← BACK TO HOME',
            catalog: 'VIEW CATALOG'
        },
        es: {
            subtitle: 'SEÑAL NO ENCONTRADA',
            description: 'La página que buscas no existe en nuestro archivo. Puede haber sido movida o eliminada.',
            back: '← VOLVER AL INICIO',
            catalog: 'VER CATÁLOGO'
        }
    };

    const t = content[lang];

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f4f4f0] dark:bg-[#111111] text-black dark:text-white p-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-[12rem] md:text-[16rem] font-black leading-none">404</h1>
                    <div className="h-1 bg-black dark:bg-white w-full mb-4" />
                    <p className="text-2xl md:text-3xl font-mono uppercase tracking-wider">
                        {t.subtitle}
                    </p>
                </div>

                <p className="text-sm md:text-base font-mono text-gray-600 dark:text-gray-400 mb-12 max-w-md mx-auto">
                    {t.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href={`/${lang}`}
                        className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-4 font-bold uppercase text-sm tracking-widest border-2 border-black dark:border-white hover:bg-transparent hover:text-black dark:hover:bg-transparent dark:hover:text-white transition-all"
                    >
                        {t.back}
                    </Link>
                    <Link
                        href={`/${lang}`}
                        className="inline-block bg-transparent text-black dark:text-white px-8 py-4 font-bold uppercase text-sm tracking-widest border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                        {t.catalog}
                    </Link>
                </div>
            </div>
        </div>
    );
}
