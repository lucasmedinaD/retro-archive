'use client';

import { useWishlist } from '@/contexts/WishlistContext';

/**
 * Legacy hook for backwards compatibility with existing code.
 * Now uses the WishlistContext under the hood.
 */
export function useFavorites() {
    const { items, toggleItem, isInWishlist } = useWishlist();

    // Get only the IDs for backwards compatibility
    const favorites = items.map(item => item.id);

    const toggleFavorite = (productId: string) => {
        toggleItem(productId, 'product');
    };

    const isFavorite = (productId: string) => isInWishlist(productId);

    // Context is always "loaded" once mounted
    const isLoaded = true;

    return { favorites, toggleFavorite, isFavorite, isLoaded };
}
