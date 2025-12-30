import { getDictionary } from '@/get-dictionary';
import FreebiesPageClient from './FreebiesClient';

interface FreebiesPageProps {
    params: Promise<{ lang: 'en' | 'es' }>;
}

export default async function FreebiesPage({ params }: FreebiesPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <FreebiesPageClient lang={lang} dict={dict} />;
}
