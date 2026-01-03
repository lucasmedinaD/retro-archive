import MobileLayoutWrapper from '@/components/mobile/MobileLayoutWrapper';

export default async function LangLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: 'en' | 'es' }>;
}) {
    const { lang } = await params;

    return (
        <>
            {children}
            <MobileLayoutWrapper lang={lang} />
        </>
    );
}
