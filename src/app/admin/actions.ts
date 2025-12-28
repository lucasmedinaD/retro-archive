'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const PASS = process.env.ADMIN_PASSWORD || 'admin123'; // Default fallback, user should change this

export async function loginAction(formData: FormData) {
    const password = formData.get('password');

    if (password === PASS) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        redirect('/admin');
    } else {
        return { error: 'ACCESS DENIED: Invalid Protocol Credentials' };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}

// --- GITHUB PERSISTENCE ---

const REPO_OWNER = 'lucasmedinaD';
const REPO_NAME = 'retro-archive';
const FILE_PATH = 'src/data/products.json';

export async function updateProductAction(updatedProduct: any) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Configuration Error: Missing GITHUB_TOKEN' };

    try {
        // 1. Get current file (SHA is needed to update)
        const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (!getRes.ok) throw new Error('Failed to fetch current inventory');
        const fileData = await getRes.json();
        const sha = fileData.sha;
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');

        // 2. Modify JSON
        const productsJson = JSON.parse(content);
        const lang = 'en'; // Editing English for now (or find in both)

        const index = productsJson[lang].findIndex((p: any) => p.id === updatedProduct.id);
        if (index !== -1) {
            productsJson[lang][index] = { ...productsJson[lang][index], ...updatedProduct };

            // Also sync to ES if it exists/matches
            const indexEs = productsJson['es'].findIndex((p: any) => p.id === updatedProduct.id);
            if (indexEs !== -1) {
                // Keep spanish translation but update shared fields like price/image/category
                productsJson['es'][indexEs].price = updatedProduct.price;
                productsJson['es'][indexEs].image = updatedProduct.image;
                productsJson['es'][indexEs].category = updatedProduct.category;
                productsJson['es'][indexEs].buyUrl = updatedProduct.buyUrl;
                // Name/Desc we don't auto-translate yet to avoid overwriting spanish text with english
            }
        } else {
            // New Product logic could go here
            return { error: 'Product not found globally' };
        }

        // 3. Commit Update
        const newContent = Buffer.from(JSON.stringify(productsJson, null, 4)).toString('base64');

        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Update product: ${updatedProduct.name}`,
                content: newContent,
                sha: sha
            })
        });

        if (!putRes.ok) throw new Error('GitHub API rejected write request');

    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Update failed' };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
}

export async function fetchLatestInventory() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Missing GITHUB_TOKEN' };

    try {
        const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (!res.ok) throw new Error('Failed to fetch from GitHub');
        const fileData = await res.json();
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const json = JSON.parse(content);
        return { success: true, data: json.en || [] };
    } catch (e) {
        return { error: 'Failed to sync with Mainframe' };
    }
}

export async function createProductAction(newProduct: any) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Configuration Error: Missing GITHUB_TOKEN' };

    try {
        // 1. Get current file
        const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (!getRes.ok) throw new Error('Failed to fetch current inventory');
        const fileData = await getRes.json();
        const sha = fileData.sha;
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');

        // 2. Parse and generate new ID
        const productsJson = JSON.parse(content);
        const existingIds = productsJson.en.map((p: any) => p.id);
        let newId = 'd1';
        let counter = 1;
        while (existingIds.includes(newId)) {
            counter++;
            newId = `d${counter}`;
        }

        // 3. Create product objects for both languages
        const productEn = { ...newProduct, id: newId };
        const productEs = {
            ...newProduct,
            id: newId
        };

        productsJson.en.push(productEn);
        productsJson.es.push(productEs);

        // 4. Commit Update
        const newContent = Buffer.from(JSON.stringify(productsJson, null, 4)).toString('base64');

        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Add product: ${newProduct.name}`,
                content: newContent,
                sha: sha
            })
        });

        if (!putRes.ok) throw new Error('GitHub API rejected write request');

        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true, product: productEn };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Creation failed' };
    }
}
