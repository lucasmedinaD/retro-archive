import { getDictionary } from '@/get-dictionary';
import Header from '@/components/Header';
import Link from 'next/link';
import { Instagram, Twitter, Mail } from 'lucide-react';

interface ContactPageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const contactDict = dict.contact;

    // Get dynamic settings for social media
    const { getSettings } = await import('@/data/settings');
    const settings = getSettings();

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black dark:bg-[#111111] dark:text-[#f4f4f0] transition-colors duration-300">
            {/* Top Marquee */}
            <div className="bg-black text-white dark:bg-white dark:text-black text-xs font-mono py-2 overflow-hidden border-b border-black dark:border-white">
                <div className="marquee-content uppercase tracking-widest">
                    CONTACT // GET IN TOUCH // COLLABORATE // CONTACT //
                </div>
            </div>

            <Header lang={lang} dict={dict} />

            {/* Hero */}
            <section className="border-b border-black dark:border-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
                        {contactDict.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-600 dark:text-gray-400">
                        {contactDict.subtitle}
                    </p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-0 border-b border-black dark:border-white">
                {/* Form Section */}
                <section className="border-r-0 md:border-r border-black dark:border-white py-12 px-6">
                    <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">
                        {contactDict.description}
                    </p>
                    <form action="/api/contact" method="POST" className="space-y-6">
                        <input type="hidden" name="lang" value={lang} />

                        <div>
                            <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                                {contactDict.form_name} *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                                {contactDict.form_email} *
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                                {contactDict.form_subject}
                            </label>
                            <input
                                type="text"
                                name="subject"
                                className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                                {contactDict.form_message} *
                            </label>
                            <textarea
                                name="message"
                                required
                                rows={5}
                                className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white dark:bg-white dark:text-black py-4 font-bold uppercase tracking-wider hover:opacity-90 transition-opacity border border-black dark:border-white"
                        >
                            {contactDict.form_submit}
                        </button>
                    </form>
                </section>

                {/* Direct Contact */}
                <section className="py-12 px-6 bg-white dark:bg-black">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-8">
                        {contactDict.or}
                    </h3>

                    <div className="space-y-8">
                        {/* Email */}
                        <div>
                            <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-2">
                                {contactDict.email_label}
                            </p>
                            <a
                                href="mailto:hello@retro-archive.art"
                                className="flex items-center gap-3 text-lg hover:underline"
                            >
                                <Mail size={20} />
                                hello@retro-archive.art
                            </a>
                        </div>

                        {/* Social */}
                        <div>
                            <p className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-4">
                                {contactDict.social_label}
                            </p>
                            <div className="flex gap-4">
                                {settings.socialMedia.instagram && (
                                    <a
                                        href={settings.socialMedia.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                    >
                                        <Instagram size={24} />
                                    </a>
                                )}
                                {settings.socialMedia.twitter && (
                                    <a
                                        href={settings.socialMedia.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                                    >
                                        <Twitter size={24} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="mt-12 pt-8 border-t border-black/20 dark:border-white/20">
                        <p className="text-sm text-gray-500 mb-4">Quick links</p>
                        <div className="flex flex-col gap-2">
                            <Link href={`/${lang}/custom`} className="hover:underline">
                                → Request Custom Design
                            </Link>
                            <Link href={`/${lang}/freebies`} className="hover:underline">
                                → Free Downloads
                            </Link>
                            <Link href={`/${lang}#catalog`} className="hover:underline">
                                → Browse Designs
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
