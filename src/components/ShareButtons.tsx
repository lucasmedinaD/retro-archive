'use client';

import { Share2, Twitter, Facebook, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ShareButtonsProps {
    url: string;
    title: string;
    description: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
    const [fullUrl, setFullUrl] = useState(url);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Build the full URL dynamically on the client side
        if (typeof window !== 'undefined') {
            const origin = window.location.origin;
            // If url is relative or doesn't contain the origin, prepend it
            if (!url.startsWith('http')) {
                setFullUrl(`${origin}${url.startsWith('/') ? '' : '/'}${url}`);
            } else {
                setFullUrl(url);
            }
        }
    }, [url]);

    const shareUrl = encodeURIComponent(fullUrl);
    const shareTitle = encodeURIComponent(title);
    const shareDesc = encodeURIComponent(description);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: fullUrl,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <span className="text-xs font-mono uppercase text-gray-500 mr-2">Share:</span>

            {/* Copy Link Button */}
            <button
                onClick={handleCopyLink}
                className={`p-2 border transition-colors ${copied
                        ? 'bg-green-500 text-white border-green-500'
                        : 'border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                    }`}
                aria-label="Copy link"
                title={copied ? 'Link copied!' : 'Copy link'}
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>

            {/* Native Share (mobile) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                    onClick={handleNativeShare}
                    className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    aria-label="Share"
                >
                    <Share2 size={16} />
                </button>
            )}

            {/* Twitter */}
            <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                aria-label="Share on Twitter"
            >
                <Twitter size={16} />
            </a>

            {/* Facebook */}
            <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                aria-label="Share on Facebook"
            >
                <Facebook size={16} />
            </a>

            {/* WhatsApp */}
            <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-lg leading-none"
                aria-label="Share on WhatsApp"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
            </a>
        </div>
    );
}
