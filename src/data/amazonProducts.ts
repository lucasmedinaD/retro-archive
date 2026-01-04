import amazonProductsData from './amazonProducts.json';
import { AmazonProduct } from '@/types/transformations';

export interface StoredAmazonProduct extends AmazonProduct {
    id: string;
    createdAt: string;
}

export function getAmazonProducts(): StoredAmazonProduct[] {
    return amazonProductsData.products || [];
}

export function getAmazonProductById(id: string): StoredAmazonProduct | undefined {
    return getAmazonProducts().find(p => p.id === id);
}
