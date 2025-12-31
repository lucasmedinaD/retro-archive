'use server';

import { revalidatePath } from 'next/cache';

const REPO_OWNER = 'lucasmedinaD';
const REPO_NAME = 'retro-archive';
const TRANSFORMATIONS_FILE_PATH = 'src/data/transformations.json';

export interface TransformationData {
    id: string;
    characterName: string;
    animeImage: string;
    realImage: string;
    description?: {
        en: string;
        es: string;
    };
    // Filtering and categorization
    series?: string; // Anime series name (e.g., "Chainsaw Man", "Jujutsu Kaisen")
    category?: 'cosplay' | 'fanart' | '2.5d' | 'other'; // Type of transformation
    tags?: string[]; // Custom tags (e.g., ["protagonist", "villain", "popular"])
    likes?: number; // Vote count for ranking

    // Attribution
    artist?: {
        name: string;
        instagram?: string;
        twitter?: string;
        website?: string;
    };

    // Affiliate integration (products will be managed separately for now)
    outfit?: any[]; // Product references - can be extended later

    // Extra metadata
    metadata?: {
        featured?: boolean;
        difficulty?: 'easy' | 'medium' | 'hard';
        completionTime?: string;
        originalSource?: string;
        funFact?: string; // Hidden fact revealed on slider edge
    };

    // Amazon affiliate products
    amazonProducts?: {
        title: string;
        image: string;
        affiliateUrl: string;
        price?: string;
        category: 'figure' | 'manga' | 'cosplay' | 'accessory' | 'other';
    }[];
}

export async function fetchTransformationsAction() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Missing GITHUB_TOKEN' };

    try {
        const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TRANSFORMATIONS_FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            // File might not exist yet, return empty array
            if (res.status === 404) {
                return { success: true, data: [] };
            }
            throw new Error('Failed to fetch from GitHub');
        }

        const fileData = await res.json();
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const json = JSON.parse(content);
        return { success: true, data: json.transformations || [], sha: fileData.sha };
    } catch (e: any) {
        return { error: e.message || 'Failed to sync transformations' };
    }
}

export async function createTransformationAction(transformation: Omit<TransformationData, 'id'>) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Configuration Error: Missing GITHUB_TOKEN' };

    try {
        // 1. Get current file or create new
        const existing = await fetchTransformationsAction();
        let transformations: TransformationData[] = [];
        let sha: string | undefined;

        if ('data' in existing && existing.data) {
            transformations = existing.data as TransformationData[];
            sha = (existing as any).sha;
        }

        // 2. Generate new ID
        const existingIds = transformations.map(t => t.id);
        let newId = `transform-${Date.now()}`;
        let counter = 1;
        while (existingIds.includes(newId)) {
            newId = `transform-${Date.now()}-${counter}`;
            counter++;
        }

        // 3. Add new transformation
        const newTransformation: TransformationData = {
            ...transformation,
            id: newId
        };
        transformations.push(newTransformation);

        // 4. Commit to GitHub
        const jsonContent = {
            transformations
        };
        const newContent = Buffer.from(JSON.stringify(jsonContent, null, 2)).toString('base64');

        const method = sha ? 'PUT' : 'PUT';
        const body: any = {
            message: `Add transformation: ${transformation.characterName}`,
            content: newContent
        };
        if (sha) body.sha = sha;

        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TRANSFORMATIONS_FILE_PATH}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!putRes.ok) {
            const errorData = await putRes.text();
            throw new Error(`GitHub API rejected request: ${errorData}`);
        }

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath('/admin/transformations');
        return { success: true, transformation: newTransformation };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Creation failed' };
    }
}

export async function deleteTransformationAction(transformationId: string) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Configuration Error: Missing GITHUB_TOKEN' };

    try {
        // 1. Get current file
        const existing = await fetchTransformationsAction();
        if (!existing.success || !existing.data) {
            throw new Error('Failed to fetch current transformations');
        }

        const transformations = existing.data.filter((t: TransformationData) => t.id !== transformationId);
        const sha = (existing as any).sha;

        // 2. Commit Update
        const jsonContent = { transformations };
        const newContent = Buffer.from(JSON.stringify(jsonContent, null, 2)).toString('base64');

        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TRANSFORMATIONS_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Delete transformation: ${transformationId}`,
                content: newContent,
                sha: sha
            })
        });

        if (!putRes.ok) throw new Error('GitHub API rejected delete request');

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath('/admin/transformations');
        return { success: true };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Delete failed' };
    }
}

export async function uploadTransformationImageAction(imageFile: File, type: 'anime' | 'real') {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Configuration Error: Missing GITHUB_TOKEN' };

    try {
        // 1. Convert file to base64
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Content = buffer.toString('base64');

        // 2. Generate unique filename
        const timestamp = Date.now();
        const extension = imageFile.name.split('.').pop() || 'jpg';
        const filename = `${type}-${timestamp}.${extension}`;
        const filePath = `public/transformations/${filename}`;

        // 3. Upload to GitHub
        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Upload ${type} transformation image: ${filename}`,
                content: base64Content
            })
        });

        if (!putRes.ok) {
            const errorData = await putRes.text();
            throw new Error(`Failed to upload image: ${errorData}`);
        }

        // Return public URL path
        return { success: true, path: `/transformations/${filename}` };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Image upload failed' };
    }
}

export async function likeTransformationAction(transformationId: string) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Configuration Error: Missing GITHUB_TOKEN' };

    try {
        // 1. Get current transformations
        const existing = await fetchTransformationsAction();
        if (!existing.success || !existing.data) {
            throw new Error('Failed to fetch current transformations');
        }

        const transformations = existing.data as TransformationData[];
        const sha = (existing as any).sha;

        // 2. Find and increment likes
        const index = transformations.findIndex(t => t.id === transformationId);
        if (index === -1) {
            return { error: 'Transformation not found' };
        }

        transformations[index].likes = (transformations[index].likes || 0) + 1;

        // 3. Commit Update
        const jsonContent = { transformations };
        const newContent = Buffer.from(JSON.stringify(jsonContent, null, 2)).toString('base64');

        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TRANSFORMATIONS_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Like transformation: ${transformationId}`,
                content: newContent,
                sha: sha
            })
        });

        if (!putRes.ok) throw new Error('GitHub API rejected like request');

        revalidatePath('/[lang]/anime-to-real', 'page');
        return { success: true, likes: transformations[index].likes };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Like failed' };
    }
}

export async function updateTransformationAction(transformationId: string, updates: Partial<TransformationData>) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Configuration Error: Missing GITHUB_TOKEN' };

    try {
        // 1. Get current transformations
        const existing = await fetchTransformationsAction();
        if (!existing.success || !existing.data) {
            throw new Error('Failed to fetch current transformations');
        }

        const transformations = existing.data as TransformationData[];
        const sha = (existing as any).sha;

        // 2. Find and update
        const index = transformations.findIndex(t => t.id === transformationId);
        if (index === -1) {
            return { error: 'Transformation not found' };
        }

        transformations[index] = {
            ...transformations[index],
            ...updates,
            id: transformationId // Ensure ID doesn't change
        };

        // 3. Commit Update
        const jsonContent = { transformations };
        const newContent = Buffer.from(JSON.stringify(jsonContent, null, 2)).toString('base64');

        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TRANSFORMATIONS_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Update transformation: ${transformationId}`,
                content: newContent,
                sha: sha
            })
        });

        if (!putRes.ok) throw new Error('GitHub API rejected update request');

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath('/admin/transformations');
        return { success: true, transformation: transformations[index] };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Update failed' };
    }
}

export async function deleteAllTransformationsAction() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) return { error: 'Configuration Error: Missing GITHUB_TOKEN' };

    try {
        // 1. Get current file to get SHA
        const existing = await fetchTransformationsAction();
        const sha = (existing as any).sha;

        // 2. Create empty transformations array
        const jsonContent = { transformations: [] };
        const newContent = Buffer.from(JSON.stringify(jsonContent, null, 2)).toString('base64');

        // 3. Commit Update
        const body: any = {
            message: 'Delete all transformations',
            content: newContent
        };
        if (sha) body.sha = sha;

        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${TRANSFORMATIONS_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!putRes.ok) throw new Error('GitHub API rejected delete all request');

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath('/admin/transformations');
        return { success: true };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Delete all failed' };
    }
}

