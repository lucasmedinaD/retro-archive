import { getDictionary } from '@/get-dictionary';
import Header from '@/components/Header';
import Link from 'next/link';

interface AboutPageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const aboutDict = dict.about;

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black dark:bg-[#111111] dark:text-[#f4f4f0] transition-colors duration-300">
            {/* Top Marquee */}
            <div className="bg-black text-white dark:bg-white dark:text-black text-xs font-mono py-2 overflow-hidden border-b border-black dark:border-white">
                <div className="marquee-content uppercase tracking-widest">
                    ABOUT // THE STORY // MISSION // PROCESS // ABOUT //
                </div>
            </div>

            <Header lang={lang} dict={dict} />

            {/* Hero */}
            <section className="border-b border-black dark:border-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight mb-4">
                        {aboutDict.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-600 dark:text-gray-400">
                        {aboutDict.subtitle}
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className="border-b border-black dark:border-white py-16 px-6 bg-white dark:bg-black">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-2xl md:text-3xl font-light leading-relaxed">
                        &ldquo;{aboutDict.intro}&rdquo;
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="border-b border-black dark:border-white py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold uppercase tracking-tight mb-6">
                        {aboutDict.mission_title}
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        {aboutDict.mission}
                    </p>
                </div>
            </section>

            {/* Process */}
            <section className="border-b border-black dark:border-white py-16 px-6 bg-white dark:bg-black">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold uppercase tracking-tight mb-10">
                        {aboutDict.process_title}
                    </h2>
                    <div className="space-y-8">
                        <div className="flex gap-6 items-start">
                            <div className="text-5xl font-black text-gray-200 dark:text-gray-800 shrink-0">01</div>
                            <p className="text-lg pt-3">{aboutDict.process_1}</p>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="text-5xl font-black text-gray-200 dark:text-gray-800 shrink-0">02</div>
                            <p className="text-lg pt-3">{aboutDict.process_2}</p>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="text-5xl font-black text-gray-200 dark:text-gray-800 shrink-0">03</div>
                            <p className="text-lg pt-3">{aboutDict.process_3}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold uppercase tracking-tight mb-4">
                        {aboutDict.cta_title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        {aboutDict.cta_shop}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href={`/${lang}#catalog`}
                            className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 font-bold uppercase tracking-wider hover:opacity-90 transition-opacity border border-black dark:border-white"
                        >
                            {aboutDict.cta_button_shop}
                        </Link>
                        <Link
                            href={`/${lang}/custom`}
                            className="border-2 border-black dark:border-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                            {aboutDict.cta_button_custom}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
