'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import { useFavorites } from '@/hooks/useFavorites';
import AuthButton from '@/components/AuthButton';

interface HeaderProps {
    lang: 'en' | 'es';
    dict: any;
}

export default function Header({ lang, dict }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { favorites } = useFavorites();
    const pathname = usePathname();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Helper to check if a path is active
    const isActive = (path: string) => {
        if (path === `/${lang}` && pathname === `/${lang}`) return true;
        if (path !== `/${lang}` && pathname.startsWith(path)) return true;
        return false;
    };

    const linkClass = (path: string) =>
        `hover:underline decoration-2 underline-offset-4 ${isActive(path) ? 'text-accent font-black' : ''}`;

    return (
        <>
            <header className="hidden md:flex px-6 py-6 justify-between items-center border-b border-black dark:border-white sticky top-0 bg-[#f4f4f0] dark:bg-[#111111] z-50 transition-colors duration-300">
                <Link href={`/${lang}`} className="flex items-center gap-3 text-3xl font-black tracking-tighter uppercase relative z-50">
                    <img src="/logo.png" alt="" className="h-10 w-auto aspect-square object-contain dark:invert" />
                    RETRO<span className="italic font-serif font-normal text-accent">.ARCHIVE</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wide">
                    <Link href={`/${lang}`} className={linkClass(`/${lang}`)}>{dict.nav.index}</Link>
                    <Link href={`/${lang}`} className={linkClass(`/${lang}`)}>{dict.nav.anime_to_real}</Link>
                    <Link href={`/${lang}#catalog`} className="hover:underline decoration-2 underline-offset-4">{dict.nav.apparel}</Link>
                </nav>

                <div className="flex gap-4 items-center z-50">
                    <div className="hidden md:flex gap-4 items-center">
                        <AuthButton lang={lang} />
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
                        <Link href={`/${lang}`} onClick={toggleMenu} className={isActive(`/${lang}`) ? 'text-accent' : 'hover:text-accent'}>{dict.nav.index}</Link>
                        <Link href={`/${lang}`} onClick={toggleMenu} className={isActive(`/${lang}`) ? 'text-accent' : 'hover:text-accent'}>{dict.nav.anime_to_real}</Link>
                        <Link href={`/${lang}#catalog`} onClick={toggleMenu} className="hover:text-accent">{dict.nav.apparel}</Link>
                    </nav>

                    <div className="flex flex-col items-center gap-6 mt-8">
                        <AuthButton lang={lang} />
                        <div className="flex gap-6">
                            <LanguageSwitcher currentLang={lang} />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
