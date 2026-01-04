'use client';

import Link from 'next/link';
import { Instagram, Twitter, Heart } from 'lucide-react';

interface FooterProps {
    lang: 'en' | 'es';
    settings?: {
        socialMedia: {
            instagram?: string;
            twitter?: string;
        };
    };
}

export default function Footer({ lang, settings }: FooterProps) {
    return (
        <footer className="border-t border-black/10 dark:border-white/10 bg-white dark:bg-black py-8 px-6">
            <div className="max-w-[90rem] mx-auto">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                    <div className="text-center md:text-left">
                        <h4 className="font-black text-xl mb-2">RETRO<span className="text-red-500">.ARCHIVE</span></h4>
                        <p className="font-mono text-xs text-gray-500 max-w-xs">
                            {lang === 'es'
                                ? '✨ Transformaciones Anime to Real • Diseños exclusivos'
                                : '✨ Anime to Real Transformations • Exclusive designs'}
                        </p>
                    </div>
                    {settings && (
                        <div className="flex gap-4">
                            {settings.socialMedia?.instagram && (
                                <a
                                    href={settings.socialMedia.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                >
                                    <Instagram size={18} />
                                </a>
                            )}
                            {settings.socialMedia?.twitter && (
                                <a
                                    href={settings.socialMedia.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                    className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                >
                                    <Twitter size={18} />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-wrap justify-center gap-4 font-mono text-xs text-gray-500">
                        <Link href={`/${lang}/shop`} className="hover:text-black dark:hover:text-white transition-colors">
                            {lang === 'es' ? 'Tienda' : 'Shop'}
                        </Link>
                        <Link href={`/${lang}/legal/privacy`} className="hover:text-black dark:hover:text-white transition-colors">
                            {lang === 'es' ? 'Privacidad' : 'Privacy'}
                        </Link>
                        <Link href={`/${lang}/legal/terms`} className="hover:text-black dark:hover:text-white transition-colors">
                            {lang === 'es' ? 'Términos' : 'Terms'}
                        </Link>
                    </div>
                    <p className="font-mono text-xs text-gray-400 flex items-center gap-1">
                        © 2026 Retro Archive • {lang === 'es' ? 'Hecho con' : 'Made with'} <Heart size={12} className="text-red-500" fill="currentColor" />
                    </p>
                </div>
            </div>
        </footer>
    );
}
