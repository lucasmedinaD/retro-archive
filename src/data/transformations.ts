import { normalizeTransformation } from '@/lib/imageUrlHelper';

export interface Transformation {
    id: string;
    characterName: string;
    animeImage: string;
    realImage: string;
    description?: {
        en: string;
        es: string;
    };
    // New filtering fields
    series?: string; // Anime series name (e.g., "Chainsaw Man", "Jujutsu Kaisen")
    category?: 'cosplay' | 'fanart' | '2.5d' | 'other'; // Type of transformation
    tags?: string[]; // Custom tags (e.g., ["protagonist", "villain", "popular"])
    likes?: number; // Vote count for ranking
}

// Fallback transformations (in case JSON doesn't exist yet)
const fallbackTransformations: Transformation[] = [
    {
        id: 'makima-1',
        characterName: 'Makima',
        series: 'Chainsaw Man',
        category: 'cosplay',
        tags: ['protagonist', 'popular'],
        animeImage: '/hero-anime.png',
        realImage: '/hero-real.png',
        description: {
            en: 'Iconic character recreation with attention to detail',
            es: 'Recreación icónica del personaje con atención al detalle'
        },
        likes: 0
    },
];

// Try to load from JSON file, fallback to hardcoded
let transformationsData: Transformation[] = fallbackTransformations;

try {
    // This will be available after the first admin creation
    const jsonData = require('./transformations.json');
    if (jsonData && jsonData.transformations) {
        // Normalize all image URLs (converts local paths to Supabase URLs)
        transformationsData = jsonData.transformations.map(normalizeTransformation);
    }
} catch (e) {
    // File doesn't exist yet, use fallback
    transformationsData = fallbackTransformations.map(normalizeTransformation);
}

export function getTransformations(): Transformation[] {
    return transformationsData;
}

export function getTransformationById(id: string): Transformation | undefined {
    return transformationsData.find(t => t.id === id);
}
