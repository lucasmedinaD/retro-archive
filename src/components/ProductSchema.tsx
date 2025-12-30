import { Product } from '@/data/products';

interface ProductSchemaProps {
    product: Product;
    lang: 'en' | 'es';
    baseUrl?: string;
}

/**
 * JSON-LD Product Schema for SEO
 * Generates structured data for search engines
 */
export default function ProductSchema({ product, lang, baseUrl = 'https://retro-archive.art' }: ProductSchemaProps) {
    const productName = lang === 'es'
        ? (product.name_es || product.name || product.name_en)
        : (product.name_en || product.name || product.name_es);

    const productDescription = lang === 'es'
        ? (product.description_es || product.description || product.description_en)
        : (product.description_en || product.description || product.description_es);

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productName || "Design",
        "description": productDescription || "Original anime & retro design for merchandise",
        "image": product.image ? `${baseUrl}${product.image}` : undefined,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": "Retro Archive"
        },
        "offers": {
            "@type": "Offer",
            "url": product.buyUrl,
            "priceCurrency": "USD",
            "price": product.price?.replace(/[^0-9.]/g, '') || "20",
            "availability": "https://schema.org/OnlineOnly",
            "seller": {
                "@type": "Organization",
                "name": "Retro Archive"
            }
        },
        "category": product.category || "Design",
        "keywords": product.tags?.join(', ') || "anime, design, merchandise"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Transformation Schema for Anime-to-Real pages
 */
interface TransformationSchemaProps {
    characterName: string;
    series?: string;
    imageUrl: string;
    pageUrl: string;
}

export function TransformationSchema({ characterName, series, imageUrl, pageUrl }: TransformationSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": `${characterName} - Anime to Real Transformation`,
        "description": `See ${characterName}${series ? ` from ${series}` : ''} transformed from anime style to realistic art`,
        "image": imageUrl,
        "url": pageUrl,
        "creator": {
            "@type": "Organization",
            "name": "Retro Archive"
        },
        "genre": ["Anime Art", "Digital Art", "Character Design"]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Organization Schema for the website
 */
export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Retro Archive",
        "url": "https://retro-archive.art",
        "logo": "https://retro-archive.art/logo.png",
        "description": "Original anime & retro designs for merchandise. Custom design services available.",
        "sameAs": [
            "https://www.redbubble.com/people/sosacrash",
            "https://instagram.com/retro.archive"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "hello@retro-archive.art"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

/**
 * Website Schema for overall site structure
 */
export function WebsiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Retro Archive",
        "url": "https://retro-archive.art",
        "description": "Original anime & retro designs for t-shirts, stickers, and merchandise",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://retro-archive.art/en?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
