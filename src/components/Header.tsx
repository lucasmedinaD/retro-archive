'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import { useFavorites } from '@/hooks/useFavorites';

interface HeaderProps {
    lang: 'en' | 'es';
    dict: any;
}

export default function Header({ lang, dict }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { favorites } = useFavorites();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <header className="px-6 py-6 flex justify-between items-center border-b border-black dark:border-white sticky top-0 bg-[#f4f4f0] dark:bg-[#111111] z-50 transition-colors duration-300">
                <Link href={`/${lang}`} className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase relative z-50">
                    <img src="/logo.png" alt="" className="h-10 w-auto aspect-square object-contain dark:invert" />
                    RETRO<span className="italic font-serif font-normal text-accent">.ARCHIVE</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wide">
                    <Link href={`/${lang}`} className="hover:underline decoration-2 underline-offset-4">{dict.nav.index}</Link>
                    <Link href={`/${lang}#catalog`} className="hover:underline decoration-2 underline-offset-4">{dict.nav.apparel}</Link>
                    <Link href={`/${lang}/anime-to-real`} className="hover:underline decoration-2 underline-offset-4">{dict.nav.anime_to_real}</Link>
                    {/* Custom Orders - Hidden for future implementation
                    <Link href={`/${lang}/custom`} className="hover:underline decoration-2 underline-offset-4 text-red-500 dark:text-red-400">{dict.nav.custom || 'Custom'}</Link>
                    */}
                    <Link href={`/${lang}/favorites`} className="hover:underline decoration-2 underline-offset-4 relative">
                        {dict.nav.favorites}
                        {favorites.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {favorites.length}
                            </span>
                        )}
                    </Link>
                </nav>

                <div className="flex gap-4 items-center z-50">
                    <div className="hidden md:flex gap-4 items-center">
                        <LanguageSwitcher currentLang={lang} />
                        <ThemeToggle />
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#f4f4f0] dark:bg-[#111111] flex flex-col justify-center items-center gap-8 md:hidden">
                    <nav className="flex flex-col items-center gap-6 text-2xl font-black uppercase tracking-widest">
                        <Link href={`/${lang}`} onClick={toggleMenu} className="hover:text-accent">{dict.nav.index}</Link>
                        <Link href={`/${lang}#catalog`} onClick={toggleMenu} className="hover:text-accent">{dict.nav.apparel}</Link>
                        <Link href={`/${lang}/anime-to-real`} onClick={toggleMenu} className="hover:text-accent">{dict.nav.anime_to_real}</Link>
                        {/* Custom Orders - Hidden for future implementation
                        <Link href={`/${lang}/custom`} onClick={toggleMenu} className="hover:text-accent text-red-500 dark:text-red-400">{dict.nav.custom || 'Custom'}</Link>
                        */}
                        <Link href={`/${lang}/favorites`} onClick={toggleMenu} className="hover:text-accent relative">
                            {dict.nav.favorites}
                            {favorites.length > 0 && (
                                <span className="absolute -top-2 -right-6 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>
                    </nav>

                    <div className="flex gap-6 mt-8">
                        <LanguageSwitcher currentLang={lang} />
                        <ThemeToggle />
                    </div>
                </div>
            )}
        </>
    );
}
