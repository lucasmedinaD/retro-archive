'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, Heart, Coffee } from 'lucide-react';

interface MobileBottomNavProps {
    lang: 'en' | 'es';
    onDonateClick: () => void;
}

export default function MobileBottomNav({ lang, onDonateClick }: MobileBottomNavProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === `/${lang}/search` && pathname.includes('search')) return true;
        if (path === `/${lang}/shop` && pathname.includes('shop')) return true;
        if (path === `/${lang}/favorites` && pathname.includes('favorites')) return true;
        if (path === `/${lang}` && pathname === `/${lang}`) return true;
        return false;
    };

    const navItems = [
        {
            icon: Home,
            label: lang === 'es' ? 'Inicio' : 'Home',
            path: `/${lang}`,
            action: null
        },
        {
            icon: Search,
            label: lang === 'es' ? 'Buscar' : 'Search',
            path: `/${lang}/search`,
            action: null
        },
        {
            icon: Heart,
            label: lang === 'es' ? 'Favoritos' : 'Favorites',
            path: `/${lang}/favorites`,
            action: null
        },
        {
            icon: ShoppingBag,
            label: lang === 'es' ? 'Tienda' : 'Shop',
            path: `/${lang}/shop`,
            action: null
        },
        {
            icon: Coffee,
            label: lang === 'es' ? 'Apoyar' : 'Support',
            path: null,
            action: onDonateClick
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 py-2 pb-safe bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-black/10 dark:border-white/10 z-50 md:hidden transition-all duration-300">
            <div className="flex justify-around items-center">
                {navItems.map((item) => {
                    const active = item.path ? isActive(item.path) : false;
                    const Icon = item.icon;

                    if (item.action) {
                        return (
                            <button
                                key={item.label}
                                onClick={item.action}
                                className="flex flex-col items-center gap-1 p-2 w-14"
                            >
                                <Icon
                                    size={22}
                                    className="text-gray-500 dark:text-gray-400"
                                    strokeWidth={2}
                                />
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={item.path!}
                            className="flex flex-col items-center gap-1 p-2 w-14"
                        >
                            <Icon
                                size={22}
                                className={`${active ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'} ${item.icon === Heart && active ? 'fill-red-500 text-red-500' : ''}`}
                                strokeWidth={active ? 2.5 : 2}
                            />
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
