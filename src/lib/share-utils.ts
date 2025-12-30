/**
 * Social share utilities for Web Share API and fallbacks
 */

interface ShareData {
    title: string;
    text: string;
    url: string;
}

/**
 * Check if Web Share API is supported
 */
export function isShareSupported(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Share using native Web Share API (mobile)
 */
export async function shareNative(data: ShareData): Promise<boolean> {
    if (!isShareSupported()) {
        return false;
    }

    try {
        await navigator.share(data);
        return true;
    } catch (error) {
        // User cancelled or share failed
        console.error('Share failed:', error);
        return false;
    }
}

/**
 * Generate Twitter share URL
 */
export function getTwitterShareUrl(text: string, url: string): string {
    const params = new URLSearchParams({
        text,
        url
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Generate Facebook share URL
 */
export function getFacebookShareUrl(url: string): string {
    const params = new URLSearchParams({ u: url });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Generate Pinterest share URL
 */
export function getPinterestShareUrl(url: string, media: string, description: string): string {
    const params = new URLSearchParams({
        url,
        media,
        description
    });
    return `https://pinterest.com/pin/create/button/?${params.toString()}`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * Open share window (for social media popups)
 */
export function openShareWindow(url: string, width = 550, height = 420): void {
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
        url,
        'share',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );
}
