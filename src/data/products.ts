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

// Cast the imported JSON to the expected type structure
const productsData = (data || {}) as unknown as Record<string, Product[]>;

export const getProducts = (lang: 'en' | 'es'): Product[] => {
    // Safety check to prevent 500 errors if JSON fails to load or keys are missing
    const list = productsData?.[lang] || productsData?.['en'];
    return Array.isArray(list) ? list : [];
};
