'use client';

import { useState } from 'react';

interface PinItButtonProps {
    imageUrl: string;
    pageUrl: string;
    description: string;
    className?: string;
    size?: 'small' | 'medium' | 'large';
}

export default function PinItButton({
    imageUrl,
    pageUrl,
    description,
    className = '',
    size = 'medium'
}: PinItButtonProps) {
    const [isHovered, setIsHovered] = useState(false);

    const handlePinIt = () => {
        // Ensure full URLs
        const fullImageUrl = imageUrl.startsWith('http')
            ? imageUrl
            : `${window.location.origin}${imageUrl}`;
        const fullPageUrl = pageUrl.startsWith('http')
            ? pageUrl
            : `${window.location.origin}${pageUrl}`;

        // Pinterest share URL
        const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(fullPageUrl)}&media=${encodeURIComponent(fullImageUrl)}&description=${encodeURIComponent(description)}`;

        // Open in popup
        window.open(
            pinterestUrl,
            'pinterest-share',
            'width=750,height=650,toolbar=0,menubar=0,location=0,status=0,scrollbars=0,resizable=1'
        );
    };

    const sizeClasses = {
        small: 'px-3 py-1.5 text-xs gap-1.5',
        medium: 'px-4 py-2 text-sm gap-2',
        large: 'px-6 py-3 text-base gap-2'
    };

    const iconSizes = {
        small: 14,
        medium: 18,
        large: 22
    };

    return (
        <button
            onClick={handlePinIt}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
                inline-flex items-center justify-center font-bold uppercase tracking-wide
                bg-[#E60023] text-white hover:bg-[#ad081b] 
                transition-all duration-200
                ${sizeClasses[size]}
                ${className}
            `}
            aria-label="Share on Pinterest"
        >
            {/* Pinterest Icon */}
            <svg
                width={iconSizes[size]}
                height={iconSizes[size]}
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`transition-transform ${isHovered ? 'scale-110' : ''}`}
            >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
            <span>Pin It</span>
        </button>
    );
}
