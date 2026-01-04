'use server';

import fs from 'fs/promises';
import path from 'path';
import { AmazonProduct } from '@/types/transformations';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'amazonProducts.json');

export interface StoredAmazonProduct extends AmazonProduct {
    id: string;
    createdAt: string;
}

interface AmazonProductsData {
    products: StoredAmazonProduct[];
}

async function readData(): Promise<AmazonProductsData> {
    try {
        const content = await fs.readFile(DATA_PATH, 'utf-8');
        return JSON.parse(content);
    } catch {
        return { products: [] };
    }
}

async function writeData(data: AmazonProductsData): Promise<void> {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function fetchAmazonProductsAction(): Promise<{ success: boolean; data?: StoredAmazonProduct[]; error?: string }> {
    try {
        const data = await readData();
        return { success: true, data: data.products };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createAmazonProductAction(product: Omit<StoredAmazonProduct, 'id' | 'createdAt'>): Promise<{ success: boolean; data?: StoredAmazonProduct; error?: string }> {
    try {
        const data = await readData();

        const newProduct: StoredAmazonProduct = {
            ...product,
            id: `amazon-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        data.products.push(newProduct);
        await writeData(data);

        return { success: true, data: newProduct };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateAmazonProductAction(id: string, updates: Partial<AmazonProduct>): Promise<{ success: boolean; error?: string }> {
    try {
        const data = await readData();
        const index = data.products.findIndex(p => p.id === id);

        if (index === -1) {
            return { success: false, error: 'Product not found' };
        }

        data.products[index] = { ...data.products[index], ...updates };
        await writeData(data);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAmazonProductAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const data = await readData();
        data.products = data.products.filter(p => p.id !== id);
        await writeData(data);

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
