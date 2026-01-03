/**
 * Image URL Helper
 * Normalizes image paths to work with both local and Supabase storage
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const STORAGE_BUCKET = 'assets';

/**
 * Converts any image path to a full Supabase URL
 * Handles both legacy local paths and new Supabase URLs
 * 
 * Examples:
 * - "/transformations/anime-1767.jpg" → "https://xxx.supabase.co/storage/v1/object/public/assets/transformations/anime-1767.jpg"
 * - "https://xxx.supabase.co/..." → "https://xxx.supabase.co/..." (unchanged)
 */
export function normalizeImageUrl(path: string | undefined): string {
    if (!path) return '';

    // Already a full URL (starts with http/https)
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Legacy local path (starts with /)
    if (path.startsWith('/')) {
        // Remove leading slash
        const relativePath = path.substring(1);

        // Construct Supabase URL
        if (SUPABASE_URL) {
            return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${relativePath}`;
        }

        // Fallback to local path if no Supabase URL
        return path;
    }

    // Relative path without leading slash
    if (SUPABASE_URL) {
        return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
    }

    return `/${path}`;
}

/**
 * Process transformation object to normalize all image URLs
 */
export function normalizeTransformation<T extends { animeImage: string; realImage: string; outfit?: any[]; amazonProducts?: any[] }>(
    transformation: T
): T {
    return {
        ...transformation,
        animeImage: normalizeImageUrl(transformation.animeImage),
        realImage: normalizeImageUrl(transformation.realImage),
        outfit: transformation.outfit?.map(item => ({
            ...item,
            image: normalizeImageUrl(item.image)
        })),
        amazonProducts: transformation.amazonProducts?.map(product => ({
            ...product,
            image: normalizeImageUrl(product.image)
        }))
    };
}
