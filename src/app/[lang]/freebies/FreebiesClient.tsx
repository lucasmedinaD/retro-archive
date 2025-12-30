'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Download, Lock, CheckCircle, Gift } from 'lucide-react';
import { trackEmailCapture, trackFreebieDownload } from '@/lib/analytics';

interface FreebiesPageClientProps {
    lang: 'en' | 'es';
    dict: any;
}

export default function FreebiesPageClient({ lang, dict }: FreebiesPageClientProps) {
    const [email, setEmail] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const freebiesDict = dict.freebies;

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call (in production, save to newsletter list)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Track email capture
        trackEmailCapture(true, 'freebies');

        setIsUnlocked(true);
        setIsLoading(false);
    };

    const handleDownload = (packName: string) => {
        trackFreebieDownload(packName);
        // In production, this would trigger actual download
        alert(`Downloading ${packName}... (Demo - connect to actual files)`);
    };

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black dark:bg-[#111111] dark:text-[#f4f4f0] transition-colors duration-300">
            {/* Top Marquee */}
            <div className="bg-black text-white dark:bg-white dark:text-black text-xs font-mono py-2 overflow-hidden border-b border-black dark:border-white">
                <div className="marquee-content uppercase tracking-widest">
                    FREE DOWNLOADS // EXCLUSIVE // WALLPAPERS // STICKERS // FREE //
                </div>
            </div>

            <Header lang={lang} dict={dict} />

            {/* Hero */}
            <section className="border-b border-black dark:border-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-mono mb-6">
                        <Gift size={16} />
                        100% FREE
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
                        {freebiesDict.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                        {freebiesDict.subtitle}
                    </p>
                </div>
            </section>

            {/* Unlock Section */}
            {!isUnlocked ? (
                <section className="py-16 px-6 bg-white dark:bg-black border-b border-black dark:border-white">
                    <div className="max-w-md mx-auto text-center">
                        <Lock size={48} className="mx-auto mb-6 text-gray-400" />
                        <p className="text-lg mb-6">
                            {freebiesDict.description}
                        </p>
                        <form onSubmit={handleUnlock} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={freebiesDict.email_placeholder}
                                required
                                className="w-full border border-black dark:border-white bg-transparent px-4 py-4 text-center focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white dark:bg-white dark:text-black py-4 font-bold uppercase tracking-wider hover:opacity-90 transition-opacity border border-black dark:border-white disabled:opacity-50"
                            >
                                {isLoading ? freebiesDict.unlocking : freebiesDict.unlock_button}
                            </button>
                        </form>
                    </div>
                </section>
            ) : (
                <>
                    {/* Success Message */}
                    <section className="py-8 px-6 bg-green-50 dark:bg-green-900/20 border-b border-black dark:border-white">
                        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-green-700 dark:text-green-400">
                            <CheckCircle size={24} />
                            <div>
                                <strong>{freebiesDict.success_title}</strong> {freebiesDict.success_message}
                            </div>
                        </div>
                    </section>

                    {/* Downloads Grid */}
                    <section className="py-16 px-6">
                        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
                            {/* Pack 1 - Wallpapers */}
                            <div className="border border-black dark:border-white bg-white dark:bg-[#111111] p-6">
                                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 mb-4 flex items-center justify-center">
                                    <span className="text-white text-4xl">🖼️</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{freebiesDict.pack_1_title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{freebiesDict.pack_1_desc}</p>
                                <button
                                    onClick={() => handleDownload('wallpaper-pack')}
                                    className="w-full bg-black text-white dark:bg-white dark:text-black py-3 font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    <Download size={16} />
                                    {freebiesDict.download_button}
                                </button>
                            </div>

                            {/* Pack 2 - Stickers */}
                            <div className="border border-black dark:border-white bg-white dark:bg-[#111111] p-6">
                                <div className="aspect-video bg-gradient-to-br from-yellow-500 to-orange-500 mb-4 flex items-center justify-center">
                                    <span className="text-white text-4xl">🎨</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{freebiesDict.pack_2_title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{freebiesDict.pack_2_desc}</p>
                                <button
                                    onClick={() => handleDownload('sticker-pack')}
                                    className="w-full bg-black text-white dark:bg-white dark:text-black py-3 font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    <Download size={16} />
                                    {freebiesDict.download_button}
                                </button>
                            </div>

                            {/* Pack 3 - Art Collection */}
                            <div className="border border-black dark:border-white bg-white dark:bg-[#111111] p-6 opacity-60">
                                <div className="aspect-video bg-gradient-to-br from-gray-400 to-gray-600 mb-4 flex items-center justify-center">
                                    <span className="text-white text-4xl">🔒</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{freebiesDict.pack_3_title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{freebiesDict.pack_3_desc}</p>
                                <button
                                    disabled
                                    className="w-full border border-black dark:border-white py-3 font-bold uppercase tracking-wider opacity-50 cursor-not-allowed"
                                >
                                    {freebiesDict.coming_soon}
                                </button>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Back to Shop */}
            <section className="py-12 px-6 border-t border-black dark:border-white text-center">
                <Link
                    href={`/${lang}#catalog`}
                    className="inline-block border border-black dark:border-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                    ← {freebiesDict.back_to_shop}
                </Link>
            </section>
        </main>
    );
}
