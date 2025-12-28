'use client';

import { useEffect } from 'react';
import { addUTMParams, trackAffiliateClick } from '@/lib/analytics';

interface BuyButtonProps {
    productId: string;
    productName: string;
    buyUrl: string;
    platform?: string;
    label: string;
    className?: string;
}

export default function BuyButton({
    productId,
    productName,
    buyUrl,
    platform = 'redbubble',
    label,
    className = ''
}: BuyButtonProps) {
    // Add UTM parameters to the buy URL
    const trackedUrl = addUTMParams(buyUrl, {
        source: 'retro-archive',
        medium: 'product-page',
        campaign: 'affiliate',
        content: productId,
    });

    const handleClick = () => {
        trackAffiliateClick(productId, productName, platform);
    };

    return (
        <a
            href={trackedUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className={className}
        >
            {label}
        </a>
    );
}
