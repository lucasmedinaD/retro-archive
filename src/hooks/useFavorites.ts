'use client';

import { useMemo } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';

/**
 * Legacy hook for backwards compatibility with existing code.
 * Now uses the WishlistContext under the hood.
 */
export function useFavorites() {
    const { items, isLoaded, toggleItem, isInWishlist } = useWishlist();

    // Memoize favorites array to prevent unnecessary re-renders
    const favorites = useMemo(() => items.map(item => item.id), [items]);

    const toggleFavorite = (productId: string) => {
        toggleItem(productId, 'product');
    };

    const isFavorite = (productId: string) => isInWishlist(productId);

    return { favorites, toggleFavorite, isFavorite, isLoaded };
}
