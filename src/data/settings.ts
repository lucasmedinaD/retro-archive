import fs from 'fs';
import path from 'path';

export interface SiteSettings {
    socialMedia: {
        instagram: string;
        twitter: string;
        tiktok: string;
    };
    siteInfo: {
        email: string;
        description: string;
    };
}

export function getSettings(): SiteSettings {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'settings.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // Return defaults if file doesn't exist
        return {
            socialMedia: {
                instagram: 'https://instagram.com/lucasmedinad',
                twitter: 'https://twitter.com/lucasmedinad',
                tiktok: '',
            },
            siteInfo: {
                email: '',
                description: 'Minimalist anime merchandise with brutalist aesthetics',
            },
        };
    }
}

export function updateSettings(settings: SiteSettings): void {
    const filePath = path.join(process.cwd(), 'src', 'data', 'settings.json');
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
}
