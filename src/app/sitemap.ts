import type { MetadataRoute } from 'next'
import transformationsData from '@/data/transformations.json';
import productsData from '@/data/products.json';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://retro-archive.art'
    const currentDate = new Date();

    // Static pages for both languages
    const staticPages: MetadataRoute.Sitemap = [
        // Home pages
        { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/en`, lastModified: currentDate, changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/es`, lastModified: currentDate, changeFrequency: 'daily', priority: 1 },

        // Anime to Real gallery
        { url: `${baseUrl}/en/anime-to-real`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/es/anime-to-real`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

        // Other pages
        { url: `${baseUrl}/en/favorites`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/es/favorites`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/en/custom`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/es/custom`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/en/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/es/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/en/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/es/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/en/freebies`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/es/freebies`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    ];

    // Dynamic transformation pages
    const transformations = (transformationsData as any).transformations || [];
    const transformationPages: MetadataRoute.Sitemap = transformations.flatMap((t: any) => [
        { url: `${baseUrl}/en/anime-to-real/${t.id}`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
        { url: `${baseUrl}/es/anime-to-real/${t.id}`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    ]);

    // Dynamic product pages
    const products = (productsData as any).en || [];
    const productPages: MetadataRoute.Sitemap = products.flatMap((p: any) => [
        { url: `${baseUrl}/en/product/${p.id}`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
        { url: `${baseUrl}/es/product/${p.id}`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
    ]);

    return [...staticPages, ...transformationPages, ...productPages];
}
