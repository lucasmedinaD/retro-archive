export interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    currency: string;
    image: string;
    affiliateUrl: string;
    category: 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'other';
    inStock?: boolean;
}

export interface Artist {
    name: string;
    instagram?: string;
    twitter?: string;
    website?: string;
}

export interface TransformationMetadata {
    originalSource?: string;
    featured?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard';
    completionTime?: string; // e.g., "2 hours", "1 week"
}

export interface TransformationExtended {
    // Existing fields
    id: string;
    characterName: string;
    animeImage: string;
    realImage: string;
    series?: string;
    category?: 'cosplay' | 'fanart' | '2.5d' | 'other';
    tags?: string[];
    likes?: number;
    description?: {
        en: string;
        es: string;
    };

    // New fields for enhanced experience
    artist?: Artist;
    outfit?: Product[];
    metadata?: TransformationMetadata;
}
