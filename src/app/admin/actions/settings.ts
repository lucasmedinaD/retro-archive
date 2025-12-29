'use server';

import { revalidatePath } from 'next/cache';
import type { SiteSettings } from '@/data/settings';

const REPO_OWNER = 'lucasmedinaD';
const REPO_NAME = 'retro-archive';
const SETTINGS_FILE_PATH = 'src/data/settings.json';

export async function updateSocialMediaAction(formData: FormData) {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return { error: 'Configuration Error: Missing GITHUB_TOKEN' };
    }

    try {
        // 1. Get current settings file (SHA needed to update)
        const getRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SETTINGS_FILE_PATH}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (!getRes.ok) {
            throw new Error('Failed to fetch current settings');
        }

        const fileData = await getRes.json();
        const sha = fileData.sha;
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const currentSettings: SiteSettings = JSON.parse(content);

        // 2. Update settings
        const updatedSettings: SiteSettings = {
            ...currentSettings,
            socialMedia: {
                instagram: formData.get('instagram') as string || '',
                twitter: formData.get('twitter') as string || '',
                tiktok: formData.get('tiktok') as string || '',
            },
        };

        // 3. Commit to GitHub
        const newContent = Buffer.from(JSON.stringify(updatedSettings, null, 2)).toString('base64');

        const putRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${SETTINGS_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Update social media settings',
                content: newContent,
                sha: sha
            })
        });

        if (!putRes.ok) {
            throw new Error('GitHub API rejected write request');
        }

        // Revalidate to show new data
        revalidatePath('/');
        revalidatePath('/admin');

        return { success: true };
    } catch (error: any) {
        console.error('Error updating settings:', error);
        return { error: error.message || 'Failed to update settings' };
    }
}
