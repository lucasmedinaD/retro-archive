/**
 * Cloud Upload Helper
 * Uploads images to Supabase Storage via presigned URLs
 * Authentication is handled by cookies (admin_session)
 */

interface UploadResult {
    success: boolean;
    path?: string;
    error?: string;
}

export async function uploadImageToCloud(
    file: File,
    folder: 'products' | 'transformations' | 'slider-demos'
): Promise<UploadResult> {
    try {
        // Step 1: Get signed URL from our API (cookies are sent automatically)
        const signResponse = await fetch('/api/admin/sign-upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies
            body: JSON.stringify({
                folder,
                filename: file.name,
                contentType: file.type
            })
        });

        if (!signResponse.ok) {
            const errorData = await signResponse.json().catch(() => ({}));
            return { success: false, error: errorData.error || `API error: ${signResponse.status}` };
        }

        const { signedUrl, publicUrl } = await signResponse.json();

        // Step 2: Upload directly to Supabase
        const uploadResponse = await fetch(signedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file
        });

        if (!uploadResponse.ok) {
            return { success: false, error: 'Upload to storage failed' };
        }

        // Success
        return { success: true, path: publicUrl };

    } catch (error: any) {
        return { success: false, error: error.message || 'Upload failed' };
    }
}

// Legacy export for backward compatibility (no longer needs password)
export function getStoredAdminPassword(): string {
    return ''; // Not needed anymore - using cookies
}
