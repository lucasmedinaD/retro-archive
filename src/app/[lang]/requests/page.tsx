import { getDictionary } from '@/get-dictionary';
import RequestsList from '@/components/RequestsList';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-server';

interface PageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function RequestsPage({ params }: PageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const supabase = await createClient();

    // Fetch requests sorted by votes
    const { data: requests } = await supabase
        .from('requests')
        .select('*')
        .order('votes', { ascending: false })
        .limit(50); // Limit to top 50 for now

    // Get dynamic settings for social media
    const { getSettings } = await import('@/data/settings');
    const settings = getSettings();

    return (
        <main className="min-h-screen bg-[#f4f4f0] text-black pb-20 selection:bg-black selection:text-white dark:bg-[#111111] dark:text-[#f4f4f0] dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
            <Header lang={lang} dict={dict} />

            <section className="pt-8">
                <RequestsList
                    initialRequests={requests || []}
                    lang={lang}
                    dict={dict}
                />
            </section>

            <Footer lang={lang} settings={settings} />
        </main>
    );
}
