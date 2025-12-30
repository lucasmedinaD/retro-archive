/**
 * Utility functions for affiliate link tracking and management
 */

interface AffiliateParams {
    tag?: string;
    campaign?: string;
    medium?: string;
    source?: string;
}

/**
 * Adds tracking parameters to an affiliate URL
 */
export function addAffiliateParams(url: string, params: AffiliateParams): string {
    try {
        const urlObj = new URL(url);

        if (params.tag) urlObj.searchParams.set('tag', params.tag);
        if (params.campaign) urlObj.searchParams.set('utm_campaign', params.campaign);
        if (params.medium) urlObj.searchParams.set('utm_medium', params.medium);
        if (params.source) urlObj.searchParams.set('utm_source', params.source);

        return urlObj.toString();
    } catch (error) {
        console.error('Invalid URL:', url);
        return url;
    }
}

/**
 * Track affiliate click event (analytics integration point)
 */
export function trackAffiliateClick(productId: string, productName: string, affiliateUrl: string) {
    // Google Analytics 4 example
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'affiliate_click', {
            product_id: productId,
            product_name: productName,
            destination_url: affiliateUrl,
            event_category: 'affiliate',
            event_label: productName
        });
    }

    // Console log for development
    console.log('Affiliate click tracked:', {
        productId,
        productName,
        url: affiliateUrl
    });
}

/**
 * Check if URL is a valid affiliate link
 */
export function isValidAffiliateUrl(url: string): boolean {
    try {
        const urlObj = new URL(url);

        // List of known affiliate domains/parameters
        const affiliateIndicators = [
            'amazon.com/dp',
            'amzn.to',
            'tag=',
            'affiliate',
            'ref=',
            'aff_id='
        ];

        return affiliateIndicators.some(indicator =>
            url.toLowerCase().includes(indicator)
        );
    } catch {
        return false;
    }
}
