import affiliatesData from './affiliates.json';

export interface AffiliateProduct {
    id: string;
    name: string;
    name_es?: string;
    image: string;
    affiliateUrl: string;
    price: string;
    category: string;
    tags: string[];
}

export function getAffiliates(): AffiliateProduct[] {
    return affiliatesData.products || [];
}

export function getAffiliateById(id: string): AffiliateProduct | undefined {
    return affiliatesData.products.find(p => p.id === id);
}

export function getAffiliatesByIds(ids: string[]): AffiliateProduct[] {
    return ids
        .map(id => getAffiliateById(id))
        .filter((p): p is AffiliateProduct => p !== undefined);
}

export function getAffiliatesByTags(tags: string[]): AffiliateProduct[] {
    const normalizedTags = tags.map(t => t.toLowerCase());
    return affiliatesData.products.filter(p =>
        p.tags.some(tag => normalizedTags.includes(tag.toLowerCase()))
    );
}

export function getRelatedAffiliates(currentId: string, limit: number = 4): AffiliateProduct[] {
    const current = getAffiliateById(currentId);
    if (!current) return [];

    // Find affiliates with matching tags, excluding current
    const related = affiliatesData.products.filter(p => {
        if (p.id === currentId) return false;
        return p.tags.some(tag => current.tags.includes(tag));
    });

    return related.slice(0, limit);
}
