/**
 * Cloud Upload Helper with Auto Compression
 * Compresses images and uploads via server endpoint (no CORS issues)
 * Authentication is handled by cookies (admin_session)
 */

import { compressImage } from './imageCompressor';

interface UploadResult {
    success: boolean;
    path?: string;
    publicUrl?: string; // NEW: Full Supabase URL
    error?: string;
    originalSize?: number;
    compressedSize?: number;
    filename?: string;
}

interface UploadOptions {
    title?: string;      // Title for filename generation (e.g., "Komi-San")
    prefix?: string;     // Prefix for file (e.g., "anime", "real", "product")
}

export async function uploadImageToCloud(
    file: File,
    folder: 'products' | 'transformations' | 'slider-demos' | 'amazon-products',
    options: UploadOptions = {}
): Promise<UploadResult> {
    try {
        const originalSize = file.size;

        // Step 1: Compress image before upload
        let processedFile = file;
        if (file.type.startsWith('image/')) {
            try {
                processedFile = await compressImage(file, {
                    maxWidth: 2000,
                    maxHeight: 2000,
                    quality: 0.85,
                    maxSizeMB: 1
                });
            } catch (compressError) {
                console.warn('Compression failed, using original file:', compressError);
                // Continue with original file if compression fails
            }
        }

        const compressedSize = processedFile.size;

        // Step 2: Create FormData for server upload
        const formData = new FormData();
        formData.append('file', processedFile);
        formData.append('folder', folder);

        // NEW: Add title and prefix for smart naming
        if (options.title) {
            formData.append('title', options.title);
        }
        if (options.prefix) {
            formData.append('prefix', options.prefix);
        }

        // Step 3: Upload via server endpoint (avoids CORS)
        const uploadResponse = await fetch('/api/admin/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}));
            return { success: false, error: errorData.error || `Upload failed: ${uploadResponse.status}` };
        }

        const result = await uploadResponse.json();

        // Success - returns full Supabase URL
        return {
            success: true,
            path: result.path,
            publicUrl: result.publicUrl, // Full URL
            filename: result.filename,
            originalSize,
            compressedSize
        };

    } catch (error: any) {
        console.error('Upload error:', error);
        return { success: false, error: error.message || 'Upload failed' };
    }
}

// Legacy export for backward compatibility
export function getStoredAdminPassword(): string {
    return '';
}
