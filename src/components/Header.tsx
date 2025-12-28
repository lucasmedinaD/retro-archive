'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

interface HeaderProps {
    lang: 'en' | 'es';
    dict: any;
}

export default function Header({ lang, dict }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <header className="px-6 py-6 flex justify-between items-center border-b border-black dark:border-white sticky top-0 bg-[#f4f4f0] dark:bg-[#111111] z-50 transition-colors duration-300">
                <Link href={`/${lang}`} className="text-3xl font-black tracking-tighter uppercase relative z-50">
                    RETRO<span className="italic font-serif font-normal text-accent">.ARCHIVE</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wide">
                    <Link href={`/${lang}`} className="hover:underline decoration-2 underline-offset-4">{dict.nav.index}</Link>
                    <Link href={`/${lang}#catalog`} className="hover:underline decoration-2 underline-offset-4">{dict.nav.apparel}</Link>
                    <Link href="#" className="hover:underline decoration-2 underline-offset-4">{dict.nav.about}</Link>
                </nav>

                <div className="flex gap-4 items-center z-50">
                    <div className="hidden md:flex gap-4 items-center">
                        <LanguageSwitcher currentLang={lang} />
                        <ThemeToggle />
                        <div className="font-mono text-xs border border-black dark:border-white px-2 py-1">
                            {dict.nav.cart} (0)
                        </div>
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
                        <Link href="#" onClick={toggleMenu} className="hover:text-accent">{dict.nav.about}</Link>
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
