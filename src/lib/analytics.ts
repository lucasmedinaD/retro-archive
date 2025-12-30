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

// Track transformation views
export function trackTransformationView(transformationId: string, characterName: string, series?: string) {
    trackEvent('transformation_view', {
        transformation_id: transformationId,
        character_name: characterName,
        series: series || 'unknown',
    });
}

// Track related product clicks from transformations
export function trackRelatedProductClick(productId: string, productName: string, transformationId: string) {
    trackEvent('related_product_click', {
        product_id: productId,
        product_name: productName,
        transformation_id: transformationId,
        interaction_type: 'transformation_related',
    });
}

// Track slider completion (reached 0% or 100%)
export function trackSliderCompletion(transformationId: string, position: 'start' | 'end') {
    trackEvent('slider_complete', {
        transformation_id: transformationId,
        position: position,
    });
}

// Track email capture
export function trackEmailCapture(success: boolean, source: string) {
    trackEvent('email_capture', {
        success: success,
        source: source,
    });
}

// Track archive progress
export function trackArchiveProgress(viewedCount: number, totalCount: number) {
    trackEvent('archive_progress', {
        viewed_count: viewedCount,
        total_count: totalCount,
        percentage: Math.round((viewedCount / totalCount) * 100),
    });
}

// Track custom form interactions
export function trackCustomFormStart(projectType: string) {
    trackEvent('start_custom_form', {
        project_type: projectType,
    });
}

export function trackCustomFormSubmit(projectType: string, budgetRange: string) {
    trackEvent('submit_custom_form', {
        project_type: projectType,
        budget_range: budgetRange,
    });
}

// Track freebie downloads
export function trackFreebieDownload(assetName: string) {
    trackEvent('download_freebie', {
        asset_name: assetName,
    });
}

// Track view design events (for design detail pages)
export function trackViewDesign(designSlug: string, category: string) {
    trackEvent('view_design', {
        design_slug: designSlug,
        category: category,
    });
}

