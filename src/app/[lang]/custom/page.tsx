import { getDictionary } from '@/get-dictionary';
import Header from '@/components/Header';
import Link from 'next/link';

interface CustomPageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function CustomPage({ params }: CustomPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const customDict = dict.custom;

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black dark:bg-[#111111] dark:text-[#f4f4f0] transition-colors duration-300">
            {/* Top Marquee */}
            <div className="bg-black text-white dark:bg-white dark:text-black text-xs font-mono py-2 overflow-hidden border-b border-black dark:border-white">
                <div className="marquee-content uppercase tracking-widest">
                    CUSTOM DESIGNS // MADE FOR YOU // UNIQUE ART // CUSTOM DESIGNS //
                </div>
            </div>

            <Header lang={lang} dict={dict} />

            {/* Hero */}
            <section className="border-b border-black dark:border-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
                        {customDict.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                        {customDict.subtitle}
                    </p>
                    <p className="mt-6 text-base max-w-xl mx-auto">
                        {customDict.description}
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="border-b border-black dark:border-white py-16 px-6 bg-white dark:bg-black">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-tight">
                        {customDict.how_it_works}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="border border-black dark:border-white p-8 text-center">
                            <div className="text-6xl font-black text-gray-200 dark:text-gray-800 mb-4">01</div>
                            <h3 className="text-xl font-bold mb-2">{customDict.step_1_title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{customDict.step_1_desc}</p>
                        </div>
                        {/* Step 2 */}
                        <div className="border border-black dark:border-white p-8 text-center">
                            <div className="text-6xl font-black text-gray-200 dark:text-gray-800 mb-4">02</div>
                            <h3 className="text-xl font-bold mb-2">{customDict.step_2_title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{customDict.step_2_desc}</p>
                        </div>
                        {/* Step 3 */}
                        <div className="border border-black dark:border-white p-8 text-center">
                            <div className="text-6xl font-black text-gray-200 dark:text-gray-800 mb-4">03</div>
                            <h3 className="text-xl font-bold mb-2">{customDict.step_3_title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{customDict.step_3_desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="border-b border-black dark:border-white py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 uppercase tracking-tight">
                        {customDict.pricing_title}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Personal */}
                        <div className="border border-black dark:border-white p-8 bg-white dark:bg-[#111111] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_#f4f4f0] transition-all">
                            <div className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-2">{customDict.tier_personal}</div>
                            <div className="text-4xl font-black mb-4">{customDict.tier_personal_price}</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{customDict.tier_personal_desc}</p>
                        </div>
                        {/* Pro */}
                        <div className="border-2 border-black dark:border-white p-8 bg-black text-white dark:bg-white dark:text-black relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-xs font-bold uppercase">
                                Popular
                            </div>
                            <div className="text-sm font-mono uppercase tracking-wider opacity-60 mb-2">{customDict.tier_pro}</div>
                            <div className="text-4xl font-black mb-4">{customDict.tier_pro_price}</div>
                            <p className="text-sm opacity-80">{customDict.tier_pro_desc}</p>
                        </div>
                        {/* Commercial */}
                        <div className="border border-black dark:border-white p-8 bg-white dark:bg-[#111111] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_#f4f4f0] transition-all">
                            <div className="text-sm font-mono uppercase tracking-wider text-gray-500 mb-2">{customDict.tier_commercial}</div>
                            <div className="text-4xl font-black mb-4">{customDict.tier_commercial_price}</div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{customDict.tier_commercial_desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="py-16 px-6" id="form">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8 uppercase tracking-tight">
                        {customDict.form_title}
                    </h2>
                    <CustomForm dict={customDict} lang={lang} />
                </div>
            </section>

            {/* Footer CTA */}
            <section className="border-t border-black dark:border-white bg-black text-white dark:bg-white dark:text-black py-12 px-6 text-center">
                <p className="text-lg mb-4">
                    {lang === 'es' ? 'O explorá mis diseños listos para comprar' : 'Or browse my ready-to-buy designs'}
                </p>
                <Link
                    href={`/${lang}`}
                    className="inline-block border-2 border-white dark:border-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-colors"
                >
                    {dict.hero.cta_secondary}
                </Link>
            </section>
        </main>
    );
}

// Client component for form
function CustomForm({ dict, lang }: { dict: any; lang: string }) {
    return (
        <form
            action={`/api/submit-brief`}
            method="POST"
            className="space-y-6"
        >
            <input type="hidden" name="lang" value={lang} />

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                        {dict.form_name} *
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
                        {dict.form_email} *
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                        {dict.form_project} *
                    </label>
                    <select
                        name="projectType"
                        required
                        className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    >
                        <option value="personal">{dict.form_project_personal}</option>
                        <option value="business">{dict.form_project_business}</option>
                        <option value="commercial">{dict.form_project_commercial}</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                        {dict.form_budget}
                    </label>
                    <select
                        name="budget"
                        className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    >
                        <option value="50-100">$50 - $100</option>
                        <option value="100-200">$100 - $200</option>
                        <option value="200-500">$200 - $500</option>
                        <option value="500+">$500+</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                    {dict.form_deadline}
                </label>
                <input
                    type="date"
                    name="deadline"
                    className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
            </div>

            <div>
                <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                    {dict.form_references}
                </label>
                <input
                    type="text"
                    name="references"
                    placeholder="Pinterest, Instagram, or any image URLs..."
                    className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
            </div>

            <div>
                <label className="block text-sm font-mono uppercase tracking-wider mb-2">
                    {dict.form_notes} *
                </label>
                <textarea
                    name="notes"
                    required
                    rows={5}
                    className="w-full border border-black dark:border-white bg-transparent px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                ></textarea>
            </div>

            <button
                type="submit"
                className="w-full bg-black text-white dark:bg-white dark:text-black py-4 font-bold uppercase tracking-wider hover:opacity-90 transition-opacity border border-black dark:border-white"
            >
                {dict.form_submit}
            </button>
        </form>
    );
}
