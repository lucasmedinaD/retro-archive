'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
    id: string;
    type: 'transformation' | 'product';
    addedAt: number;
}

interface WishlistContextType {
    items: WishlistItem[];
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

    const addItem = (id: string, type: 'transformation' | 'product') => {
        setItems(prev => {
            if (prev.some(item => item.id === id)) return prev;
            return [...prev, { id, type, addedAt: Date.now() }];
        });
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const isInWishlist = (id: string) => {
        return items.some(item => item.id === id);
    };

    const toggleItem = (id: string, type: 'transformation' | 'product') => {
        if (isInWishlist(id)) {
            removeItem(id);
        } else {
            addItem(id, type);
        }
    };

    const clearWishlist = () => {
        setItems([]);
    };

    return (
        <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, toggleItem, clearWishlist }}>
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
