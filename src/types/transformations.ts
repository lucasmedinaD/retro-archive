import { Product } from '@/data/products';
export type { Product };

export interface AmazonProduct {
    title: string;
    image: string;
    affiliateUrl: string;
    price?: string;
    category: 'figure' | 'manga' | 'cosplay' | 'accessory' | 'other';
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
    funFact?: string; // Hidden fact revealed on slider edge
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
    amazonProducts?: AmazonProduct[]; // Amazon affiliate products
    metadata?: TransformationMetadata;

    // Easter Egg: Secret Photo Unlock
    secretImage?: string; // Optional bonus image URL
    secretPosition?: number; // Slider position (0-100) where secret is triggered
    poi?: Array<{ label: string; x: number; y: number; scale: number }>; // Dynamic zoom points
}

