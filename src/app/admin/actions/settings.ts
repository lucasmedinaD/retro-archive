'use server';

import { getSettings, updateSettings, type SiteSettings } from '@/data/settings';

export async function updateSocialMediaAction(formData: FormData) {
    try {
        const currentSettings = getSettings();

        const updatedSettings: SiteSettings = {
            ...currentSettings,
            socialMedia: {
                instagram: formData.get('instagram') as string || '',
                twitter: formData.get('twitter') as string || '',
                tiktok: formData.get('tiktok') as string || '',
            },
        };

        updateSettings(updatedSettings);

        return { success: true };
    } catch (error) {
        console.error('Error updating settings:', error);
        return { error: 'Failed to update settings' };
    }
}
