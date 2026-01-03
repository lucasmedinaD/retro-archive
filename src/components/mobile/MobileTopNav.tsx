'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileTopNavProps {
    lang: 'en' | 'es';
    dict: any;
}

export default function MobileTopNav({ lang, dict }: MobileTopNavProps) {
    const pathname = usePathname();

    const tabs = [
        { label: 'Anime Design', path: `/${lang}/shop?category=design` },
        { label: 'Anime to Real', path: `/${lang}/anime-to-real` },
        { label: 'Favorites', path: `/${lang}/favorites` },
    ];

    return (
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-black/5 dark:border-white/5 md:hidden transition-colors duration-300">
            <div className="overflow-x-auto no-scrollbar py-3 px-4">
                <div className="flex gap-4 whitespace-nowrap min-w-max">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.path;
                        return (
                            <Link
                                key={tab.label}
                                href={tab.path}
                                className={`text-sm font-bold uppercase tracking-wider px-2 py-1 relative ${isActive
                                    ? 'text-black dark:text-white'
                                    : 'text-gray-400 dark:text-gray-600'
                                    }`}
                            >
                                {tab.label}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent transform scale-x-100 transition-transform" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
