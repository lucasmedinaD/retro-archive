import Script from 'next/script';

interface SchemaScriptProps {
    type: 'Organization' | 'WebSite' | 'Product' | 'CreativeWork';
    data: Record<string, any>;
}

export default function SchemaScript({ type, data }: SchemaScriptProps) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data
    };

    return (
        <Script
            id={`schema-${type.toLowerCase()}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
            }}
        />
    );
}

// Pre-built schemas
export function OrganizationSchema() {
    return (
        <SchemaScript
            type="Organization"
            data={{
                name: 'Retro Archive',
                url: 'https://retro-archive.art',
                logo: 'https://retro-archive.art/icon.png',
                sameAs: [
                    'https://instagram.com/lucasmedinad',
                    'https://twitter.com/lucasmedinad'
                ],
                description: 'Curated collection of minimalist anime-inspired designs and 2.5D transformations.'
            }}
        />
    );
}

export function WebSiteSchema() {
    return (
        <SchemaScript
            type="WebSite"
            data={{
                name: 'RETRO.ARCHIVE',
                url: 'https://retro-archive.art',
                potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://retro-archive.art/search?q={search_term_string}',
                    'query-input': 'required name=search_term_string'
                }
            }}
        />
    );
}

export function ProductSchema({
    name,
    description,
    image,
    price,
    url
}: {
    name: string;
    description: string;
    image: string;
    price: string;
    url: string;
}) {
    return (
        <SchemaScript
            type="Product"
            data={{
                name,
                description,
                image,
                offers: {
                    '@type': 'Offer',
                    price: price.replace(/[^0-9.]/g, ''),
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    url
                }
            }}
        />
    );
}

export function TransformationSchema({
    name,
    description,
    image,
    creator,
    series
}: {
    name: string;
    description: string;
    image: string;
    creator?: string;
    series?: string;
}) {
    return (
        <SchemaScript
            type="CreativeWork"
            data={{
                name: `${name} - Anime to Real Transformation`,
                description,
                image,
                creator: creator ? { '@type': 'Person', name: creator } : undefined,
                isPartOf: series ? { '@type': 'CreativeWorkSeries', name: series } : undefined,
                genre: 'Anime',
                inLanguage: ['en', 'es']
            }}
        />
    );
}
