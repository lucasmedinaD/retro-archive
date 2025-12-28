// Utility function to add UTM parameters to affiliate links
export function addUTMParams(url: string, options: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
} = {}): string {
    try {
        const urlObj = new URL(url);

        // Default UTM parameters
        const utmParams = {
            utm_source: options.source || 'retro-archive',
            utm_medium: options.medium || 'website',
            utm_campaign: options.campaign || 'product-link',
            ...(options.content && { utm_content: options.content }),
            ...(options.term && { utm_term: options.term })
        };

        // Add UTM parameters to URL
        Object.entries(utmParams).forEach(([key, value]) => {
            urlObj.searchParams.set(key, value);
        });

        return urlObj.toString();
    } catch (error) {
        // If URL is invalid, return original
        console.error('Invalid URL for UTM params:', error);
        return url;
    }
}

// Track events to Google Analytics
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, eventParams);
    }
}

// Track page views
export function trackPageView(url: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
            page_path: url,
        });
    }
}

// Track product clicks
export function trackProductClick(productId: string, productName: string, category: string) {
    trackEvent('product_click', {
        product_id: productId,
        product_name: productName,
        category: category,
    });
}

// Track favorite actions
export function trackFavorite(action: 'add' | 'remove', productId: string) {
    trackEvent('favorite', {
        action: action,
        product_id: productId,
    });
}

// Track search
export function trackSearch(searchTerm: string, resultsCount: number) {
    trackEvent('search', {
        search_term: searchTerm,
        results_count: resultsCount,
    });
}

// Track affiliate link clicks
export function trackAffiliateClick(productId: string, productName: string, platform: string) {
    trackEvent('affiliate_click', {
        product_id: productId,
        product_name: productName,
        platform: platform,
    });
}
