import data from './products.json';

export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    buyUrl: string;
    category: 'DESIGN' | 'ART' | 'DIGITAL';
    description: string;
    [key: string]: any;
}

const FALLBACK_DATA = {
    en: [
        {
            id: "d1",
            name: "CYBER DEMON",
            price: "$35.00",
            image: "/mockups/reze-mokup1.jpg",
            buyUrl: "https://www.redbubble.com/",
            category: "DESIGN",
            description: "High-contrast cyber-demonic sigils. Optimized for apparel overlay and digital consumption."
        }
    ],
    es: []
};

// Cast the imported JSON to the expected type structure, with fallback
const productsData = (data && Object.keys(data).length > 0)
    ? (data as unknown as Record<string, Product[]>)
    : (FALLBACK_DATA as unknown as Record<string, Product[]>);

export const getProducts = (lang: 'en' | 'es'): Product[] => {
    // Safety check to prevent 500 errors if JSON fails to load or keys are missing
    const list = productsData?.[lang] || productsData?.['en'] || FALLBACK_DATA.en;
    return Array.isArray(list) ? list : [];
};
