'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Load favorites from localStorage on mount
        const stored = localStorage.getItem('favorites');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse favorites', e);
            }
        }
        setIsLoaded(true);
    }, []);

    const toggleFavorite = (productId: string) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];

            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const isFavorite = (productId: string) => favorites.includes(productId);

    return { favorites, toggleFavorite, isFavorite, isLoaded };
}
