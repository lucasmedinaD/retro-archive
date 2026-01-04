'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

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
    const { user } = useAuth();
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage
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

    // Sync with Supabase when user logs in
    useEffect(() => {
        const syncFavorites = async () => {
            if (!user) return; // Keep rendering local items if not logged in

            const supabase = createSupabaseBrowserClient();
            if (!supabase) return;

            // 1. Fetch cloud favorites
            const { data: cloudFavorites, error } = await supabase
                .from('favorites')
                .select('*');

            if (error) {
                console.error('Error fetching cloud favorites:', error);
                return;
            }

            // 2. Merge logic:
            // We want to keep local items that are NOT in cloud yet (add them to cloud)
            // And we want to display everything.

            const cloudItemsMap = new Set(cloudFavorites?.map(f => f.item_id));
            const localItemsToSync = items.filter(item => !cloudItemsMap.has(item.id));

            if (localItemsToSync.length > 0) {
                // Sync local only items to cloud
                const itemsToInsert = localItemsToSync.map(item => ({
                    user_id: user.id,
                    item_id: item.id,
                    item_type: item.type
                }));

                await supabase.from('favorites').insert(itemsToInsert);
            }

            // 3. Final merge state from Cloud (authoritative source after sync)
            // We fetch again or better, just construct it.
            // Let's assume after insert we want the union of both.
            // Actually, simpler: Just add missing cloud items to local state for display.

            setItems(prev => {
                const combined = [...prev];
                cloudFavorites?.forEach(cloudItem => {
                    if (!combined.some(i => i.id === cloudItem.item_id)) {
                        combined.push({
                            id: cloudItem.item_id,
                            type: cloudItem.item_type as 'transformation' | 'product',
                            addedAt: new Date(cloudItem.created_at).getTime()
                        });
                    }
                });
                return combined;
            });
        };

        if (isLoaded && user) {
            syncFavorites();
        }
    }, [user, isLoaded]); // Run when user changes or initial load finishes

    // Save to localStorage whenever items change (Backup / Offline cache)
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = useCallback(async (id: string, type: 'transformation' | 'product') => {
        // Optimistic Update
        setItems(prev => {
            if (prev.some(item => item.id === id)) return prev;
            return [...prev, { id, type, addedAt: Date.now() }];
        });

        // Cloud Sync
        if (user) {
            const supabase = createSupabaseBrowserClient();
            if (supabase) {
                await supabase.from('favorites').insert({
                    user_id: user.id,
                    item_id: id,
                    item_type: type
                });
            }
        }
    }, [user]);

    const removeItem = useCallback(async (id: string) => {
        // Optimistic Update
        setItems(prev => prev.filter(item => item.id !== id));

        // Cloud Sync
        if (user) {
            const supabase = createSupabaseBrowserClient();
            if (supabase) {
                await supabase.from('favorites').delete().eq('item_id', id).eq('user_id', user.id);
            }
        }
    }, [user]);

    const isInWishlist = useCallback((id: string) => {
        return items.some(item => item.id === id);
    }, [items]);

    const toggleItem = useCallback((id: string, type: 'transformation' | 'product') => {
        const isAdded = items.some(item => item.id === id);
        if (isAdded) {
            removeItem(id);
        } else {
            addItem(id, type);
        }
    }, [items, addItem, removeItem]);

    const clearWishlist = useCallback(() => {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
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
