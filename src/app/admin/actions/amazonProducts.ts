'use server';

import { revalidatePath } from 'next/cache';
import { AmazonProduct } from '@/types/transformations';

const REPO_OWNER = 'lucasmedinaD';
const REPO_NAME = 'retro-archive';
const AMAZON_FILE_PATH = 'src/data/amazonProducts.json';

export interface StoredAmazonProduct extends AmazonProduct {
    id: string;
    createdAt: string;
}

interface AmazonProductsData {
    products: StoredAmazonProduct[];
}

async function getGitHubFile(): Promise<{ data: AmazonProductsData; sha: string } | null> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return null;

    try {
        const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${AMAZON_FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            if (res.status === 404) {
                return { data: { products: [] }, sha: '' };
            }
            return null;
        }

        const fileData = await res.json();
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const json = JSON.parse(content);
        return { data: json, sha: fileData.sha };
    } catch {
        return null;
    }
}

async function commitToGitHub(data: AmazonProductsData, message: string, sha?: string): Promise<boolean> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return false;

    try {
        const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

        const body: any = {
            message,
            content: newContent
        };
        if (sha) body.sha = sha;

        const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${AMAZON_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        return res.ok;
    } catch {
        return false;
    }
}

export async function fetchAmazonProductsAction(): Promise<{ success: boolean; data?: StoredAmazonProduct[]; error?: string }> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { success: false, error: 'Missing GITHUB_TOKEN' };

    try {
        const result = await getGitHubFile();
        if (!result) {
            return { success: false, error: 'Failed to fetch from GitHub' };
        }
        return { success: true, data: result.data.products || [] };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createAmazonProductAction(
    product: Omit<StoredAmazonProduct, 'id' | 'createdAt'>
): Promise<{ success: boolean; data?: StoredAmazonProduct; error?: string }> {
    try {
        const result = await getGitHubFile();
        if (!result) {
            return { success: false, error: 'Failed to fetch from GitHub' };
        }

        const newProduct: StoredAmazonProduct = {
            ...product,
            id: `amazon-${Date.now()}`,
            createdAt: new Date().toISOString()
        };

        result.data.products.push(newProduct);

        const committed = await commitToGitHub(
            result.data,
            `Add Amazon product: ${product.title}`,
            result.sha || undefined
        );

        if (!committed) {
            return { success: false, error: 'Failed to commit to GitHub' };
        }

        revalidatePath('/admin/amazon-products');
        return { success: true, data: newProduct };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateAmazonProductAction(
    id: string,
    updates: Partial<AmazonProduct>
): Promise<{ success: boolean; error?: string }> {
    try {
        const result = await getGitHubFile();
        if (!result) {
            return { success: false, error: 'Failed to fetch from GitHub' };
        }

        const index = result.data.products.findIndex(p => p.id === id);
        if (index === -1) {
            return { success: false, error: 'Product not found' };
        }

        result.data.products[index] = {
            ...result.data.products[index],
            ...updates
        };

        const committed = await commitToGitHub(
            result.data,
            `Update Amazon product: ${id}`,
            result.sha
        );

        if (!committed) {
            return { success: false, error: 'Failed to commit to GitHub' };
        }

        revalidatePath('/admin/amazon-products');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteAmazonProductAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        const result = await getGitHubFile();
        if (!result) {
            return { success: false, error: 'Failed to fetch from GitHub' };
        }

        result.data.products = result.data.products.filter(p => p.id !== id);

        const committed = await commitToGitHub(
            result.data,
            `Delete Amazon product: ${id}`,
            result.sha
        );

        if (!committed) {
            return { success: false, error: 'Failed to commit to GitHub' };
        }

        revalidatePath('/admin/amazon-products');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
