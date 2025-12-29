export interface Transformation {
    id: string;
    characterName: string;
    animeImage: string;
    realImage: string;
    description?: {
        en: string;
        es: string;
    };
}

// Fallback transformations (in case JSON doesn't exist yet)
const fallbackTransformations: Transformation[] = [
    {
        id: 'makima-1',
        characterName: 'Makima',
        animeImage: '/transformations/makima-anime.jpg',
        realImage: '/transformations/makima-real.png',
        description: {
            en: 'Iconic character recreation with attention to detail',
            es: 'Recreación icónica del personaje con atención al detalle'
        }
    },
];

// Try to load from JSON file, fallback to hardcoded
let transformationsData: Transformation[] = fallbackTransformations;

try {
    // This will be available after the first admin creation
    const jsonData = require('./transformations.json');
    if (jsonData && jsonData.transformations) {
        transformationsData = jsonData.transformations;
    }
} catch (e) {
    // File doesn't exist yet, use fallback
    transformationsData = fallbackTransformations;
}

export function getTransformations(): Transformation[] {
    return transformationsData;
}

export function getTransformationById(id: string): Transformation | undefined {
    return transformationsData.find(t => t.id === id);
}
