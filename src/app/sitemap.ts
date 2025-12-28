import { getProducts } from '@/data/products';

export default async function sitemap() {
    const productsEn = getProducts('en');
    const productsEs = getProducts('es');

    const baseUrl = 'https://retro-archive.vercel.app';

    // Static pages
    const staticPages = [
        {
            url: `${baseUrl}/en`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/es`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
    ];

    // Product pages - English
    const productPagesEn = productsEn.map(product => ({
        url: `${baseUrl}/en/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Product pages - Spanish
    const productPagesEs = productsEs.map(product => ({
        url: `${baseUrl}/es/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticPages, ...productPagesEn, ...productPagesEs];
}
