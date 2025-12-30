import { redirect } from 'next/navigation';

interface PageProps {
    params: Promise<{ lang: 'en' | 'es'; id: string }>;
}

export default async function TransformRedirectPage({ params }: PageProps) {
    const { lang, id } = await params;

    // Redirect to the correct route
    redirect(`/${lang}/anime-to-real/${id}`);
}
