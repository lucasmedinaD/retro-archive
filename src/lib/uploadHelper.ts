/**
 * Cloud Upload Helper with Auto Compression
 * Compresses images before upload to Supabase Storage
 * Authentication is handled by cookies (admin_session)
 */

import { compressImage } from './imageCompressor';

interface UploadResult {
    success: boolean;
    path?: string;
    error?: string;
    originalSize?: number;
    compressedSize?: number;
}

export async function uploadImageToCloud(
    file: File,
    folder: 'products' | 'transformations' | 'slider-demos'
): Promise<UploadResult> {
    try {
        const originalSize = file.size;

        // Step 1: Compress image before upload
        let processedFile = file;
        if (file.type.startsWith('image/')) {
            processedFile = await compressImage(file, {
                maxWidth: 2000,
                maxHeight: 2000,
                quality: 0.85,
                maxSizeMB: 1
            });
        }

        const compressedSize = processedFile.size;

        // Step 2: Get signed URL from our API (cookies are sent automatically)
        const signResponse = await fetch('/api/admin/sign-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                folder,
                filename: processedFile.name,
                contentType: processedFile.type
            })
        });

        if (!signResponse.ok) {
            const errorData = await signResponse.json().catch(() => ({}));
            return { success: false, error: errorData.error || `API error: ${signResponse.status}` };
        }

        const { signedUrl, publicUrl } = await signResponse.json();

        // Step 3: Upload compressed image directly to Supabase
        const uploadResponse = await fetch(signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': processedFile.type },
            body: processedFile
        });

        if (!uploadResponse.ok) {
            return { success: false, error: 'Upload to storage failed' };
        }

        // Success
        return {
            success: true,
            path: publicUrl,
            originalSize,
            compressedSize
        };

    } catch (error: any) {
        return { success: false, error: error.message || 'Upload failed' };
    }
}

// Legacy export for backward compatibility (no longer needs password)
export function getStoredAdminPassword(): string {
    return ''; // Not needed anymore - using cookies
}
