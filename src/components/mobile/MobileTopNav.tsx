'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileTopNavProps {
    lang: 'en' | 'es';
    dict: any;
}

export default function MobileTopNav({ lang, dict }: MobileTopNavProps) {
    const pathname = usePathname();

    const filters = [
        { label: lang === 'es' ? 'Todo' : 'All', tag: 'all' },
        { label: 'Bocchi The Rock', tag: 'Bocchi The Rock' },
        { label: 'Chainsaw Man', tag: 'Chainsaw Man' },
        { label: 'Dandadan', tag: 'Dandadan' },
        { label: 'Death Note', tag: 'Death Note' },
        { label: 'Jujutsu Kaisen', tag: 'Jujutsu Kaisen' },
        { label: 'Komi Can\'t Communicate', tag: 'Komi Can\'t Communicate' },
        { label: 'My Dress-Up Darling', tag: 'My Dress-Up Darling' },
        { label: 'Cyberpunk', tag: 'Cyberpunk' },
        { label: 'Nier Automata', tag: 'Nier Automata' },
    ];

    return (
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-black/5 dark:border-white/5 md:hidden transition-colors duration-300">
            <div className="overflow-x-auto no-scrollbar py-3 px-4">
                <div className="flex gap-2 whitespace-nowrap min-w-max">
                    {filters.map((filter) => {
                        const isAll = filter.tag === 'all';
                        const href = isAll
                            ? `/${lang}/shop`
                            : `/${lang}/shop?search=${encodeURIComponent(filter.tag)}`;

                        return (
                            <Link
                                key={filter.label}
                                href={href}
                                className={`
                                    text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200
                                    ${pathname.includes('shop') && (isAll || decodeURIComponent(pathname).includes(filter.tag)) // Basic active check, improves with searchParams
                                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                                        : 'bg-transparent text-gray-500 border-gray-200 dark:border-gray-800 dark:text-gray-400 hover:border-black dark:hover:border-white'
                                    }
                                `}
                            >
                                {filter.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
