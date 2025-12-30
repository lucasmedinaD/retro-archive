'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'retro-archive-progress';

export interface ArchiveProgress {
    viewed: string[];
    viewedAt: Record<string, number>; // timestamp when viewed
}

const defaultProgress: ArchiveProgress = {
    viewed: [],
    viewedAt: {}
};

export function useArchiveProgress() {
    const [progress, setProgress] = useState<ArchiveProgress>(defaultProgress);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setProgress(parsed);
            }
        } catch (e) {
            console.warn('Failed to load archive progress');
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage when progress changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
            } catch (e) {
                console.warn('Failed to save archive progress');
            }
        }
    }, [progress, isLoaded]);

    const markAsViewed = useCallback((id: string) => {
        setProgress(prev => {
            if (prev.viewed.includes(id)) return prev;
            return {
                viewed: [...prev.viewed, id],
                viewedAt: {
                    ...prev.viewedAt,
                    [id]: Date.now()
                }
            };
        });
    }, []);

    const isViewed = useCallback((id: string) => {
        return progress.viewed.includes(id);
    }, [progress.viewed]);

    const getViewedCount = useCallback(() => {
        return progress.viewed.length;
    }, [progress.viewed]);

    const resetProgress = useCallback(() => {
        setProgress(defaultProgress);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        progress,
        isLoaded,
        markAsViewed,
        isViewed,
        getViewedCount,
        resetProgress
    };
}
