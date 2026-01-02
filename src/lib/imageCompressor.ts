/**
 * Image Compression Utility
 * Compresses images before upload using Canvas API
 */

interface CompressionOptions {
    maxWidth?: number;      // Max width in pixels (default: 2000)
    maxHeight?: number;     // Max height in pixels (default: 2000)
    quality?: number;       // JPEG quality 0-1 (default: 0.85)
    maxSizeMB?: number;     // Target max size in MB (will reduce quality if needed)
}

const DEFAULT_OPTIONS: CompressionOptions = {
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 0.85,
    maxSizeMB: 1
};

/**
 * Compresses an image file using Canvas API
 * Returns a new compressed File object
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Skip non-images
    if (!file.type.startsWith('image/')) {
        return file;
    }

    // Skip already small files (< 500KB)
    if (file.size < 500 * 1024) {
        console.log('Image already small, skipping compression');
        return file;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            // Calculate new dimensions maintaining aspect ratio
            let { width, height } = img;
            const maxW = opts.maxWidth!;
            const maxH = opts.maxHeight!;

            if (width > maxW || height > maxH) {
                const ratio = Math.min(maxW / width, maxH / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);

            // Try to hit target size by reducing quality if needed
            let quality = opts.quality!;
            const targetBytes = (opts.maxSizeMB || 1) * 1024 * 1024;

            const compress = () => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Compression failed'));
                            return;
                        }

                        // If still too big and quality can be reduced
                        if (blob.size > targetBytes && quality > 0.5) {
                            quality -= 0.1;
                            compress();
                            return;
                        }

                        // Create new file with compressed data
                        const compressedFile = new File(
                            [blob],
                            file.name.replace(/\.[^.]+$/, '.jpg'),
                            { type: 'image/jpeg' }
                        );

                        console.log(`Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressedFile.size / 1024).toFixed(0)}KB (${Math.round((1 - compressedFile.size / file.size) * 100)}% reduction)`);

                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality
                );
            };

            compress();
        };

        img.onerror = () => reject(new Error('Failed to load image'));

        // Load image from file
        img.src = URL.createObjectURL(file);
    });
}

/**
 * Get estimated compression result without actually compressing
 */
export function estimateCompression(file: File): string {
    if (file.size < 500 * 1024) return 'No compression needed';
    const estimatedSize = Math.round(file.size * 0.15); // ~85% reduction typical
    return `~${(estimatedSize / 1024).toFixed(0)}KB (estimated)`;
}
