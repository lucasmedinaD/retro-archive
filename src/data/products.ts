import data from './products.json';

export interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    buyUrl: string;
    category: 'APPAREL' | 'ACCESSORIES' | 'STICKERS' | 'ROPA' | 'ACCESORIOS';
    description: string;
    [key: string]: any;
}

const FALLBACK_DATA = {
    en: [
        {
            id: "p1",
            name: "CYBER DEMON TEE",
            price: "$35.00",
            image: "/mockups/reze-mokup1.jpg",
            buyUrl: "https://www.redbubble.com/",
            category: "APPAREL",
            description: "Heavyweight cotton tee featuring high-contrast cyber-demonic sigils. Puff print finish. Oversized fit for maximum dystopian comfort."
        },
        {
            id: "p2",
            name: "NEON SOUL HOODIE",
            price: "$65.00",
            image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
            buyUrl: "https://www.redbubble.com/",
            category: "APPAREL",
            description: "Bio-luminescent aesthetic hoodie. 400gsm fleece. Generous hood depth for avoiding facial recognition scanners."
        },
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
