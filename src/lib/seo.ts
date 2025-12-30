import type { Metadata } from 'next';

export function generateCustomMetadata(params: {
    title: string;
    description: string;
    image?: string;
    url?: string;
}): Metadata {
    const { title, description, image, url } = params;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: image ? [image] : undefined,
            url,
            type: 'website',
            siteName: 'Retro Archive'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: image ? [image] : undefined,
            creator: '@retroarchive'
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1
            }
        }
    };
}

// Optimized JSON-LD for SEO
export function generateTransformationJSONLD(params: {
    name: string;
    description: string;
    image: string;
    url: string;
    series?: string;
    artist?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: params.name,
        description: params.description,
        image: params.image,
        url: params.url,
        ...(params.series && { isPartOf: { '@type': 'CreativeWorkSeries', name: params.series } }),
        ...(params.artist && { creator: { '@type': 'Person', name: params.artist } })
    };
}
