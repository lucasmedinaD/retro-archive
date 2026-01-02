/**
 * Hybrid Upload Helper
 * Attempts Supabase first, falls back to GitHub if Supabase is not configured
 */

interface UploadResult {
    success: boolean;
    path?: string;
    error?: string;
}

export async function uploadImageToCloud(
    file: File,
    folder: 'products' | 'transformations' | 'slider-demos',
    adminPassword: string
): Promise<UploadResult> {
    try {
        // Try Supabase first
        const signResponse = await fetch('/api/admin/sign-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': adminPassword
            },
            body: JSON.stringify({
                folder,
                filename: file.name,
                contentType: file.type
            })
        });

        if (signResponse.ok) {
            const { signedUrl, publicUrl } = await signResponse.json();

            // Upload directly to Supabase
            const uploadResponse = await fetch(signedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            });

            if (uploadResponse.ok) {
                return { success: true, path: publicUrl };
            }
        }

        // If we get here, Supabase failed - return error
        const errorData = await signResponse.json().catch(() => ({}));
        return { success: false, error: errorData.error || 'Supabase upload failed' };

    } catch (error: any) {
        return { success: false, error: error.message || 'Upload failed' };
    }
}

// Helper to get admin password from sessionStorage
export function getStoredAdminPassword(): string {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('adminPassword') || '';
}
