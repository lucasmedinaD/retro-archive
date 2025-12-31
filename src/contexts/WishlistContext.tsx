'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';

interface WishlistItem {
    id: string;
    type: 'transformation' | 'product';
    addedAt: number;
}

interface WishlistContextType {
    items: WishlistItem[];
    isLoaded: boolean;
    addItem: (id: string, type: 'transformation' | 'product') => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    toggleItem: (id: string, type: 'transformation' | 'product') => void;
    clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = 'retro-archive-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse wishlist:', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = useCallback((id: string, type: 'transformation' | 'product') => {
        setItems(prev => {
            if (prev.some(item => item.id === id)) return prev;
            return [...prev, { id, type, addedAt: Date.now() }];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const isInWishlist = useCallback((id: string) => {
        return items.some(item => item.id === id);
    }, [items]);

    const toggleItem = useCallback((id: string, type: 'transformation' | 'product') => {
        setItems(prev => {
            const exists = prev.some(item => item.id === id);
            if (exists) {
                return prev.filter(item => item.id !== id);
            } else {
                return [...prev, { id, type, addedAt: Date.now() }];
            }
        });
    }, []);

    const clearWishlist = useCallback(() => {
        setItems([]);
    }, []);

    const value = useMemo(() => ({
        items,
        isLoaded,
        addItem,
        removeItem,
        isInWishlist,
        toggleItem,
        clearWishlist
    }), [items, isLoaded, addItem, removeItem, isInWishlist, toggleItem, clearWishlist]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
