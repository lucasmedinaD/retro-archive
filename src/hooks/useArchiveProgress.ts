'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'retro-archive-progress';

export interface ArchiveProgress {
    viewed: string[];
    viewedAt: Record<string, number>; // timestamp when viewed
}

const defaultProgress: ArchiveProgress = {
    viewed: [],
    viewedAt: {}
};

// Helper to get progress from localStorage
function getStoredProgress(): ArchiveProgress {
    if (typeof window === 'undefined') return defaultProgress;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to load archive progress');
    }
    return defaultProgress;
}

// Helper to save progress to localStorage
function saveProgress(progress: ArchiveProgress) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
        console.warn('Failed to save archive progress');
    }
}

export function useArchiveProgress() {
    const [progress, setProgress] = useState<ArchiveProgress>(defaultProgress);
    const [isLoaded, setIsLoaded] = useState(false);
    const progressRef = useRef(progress);

    // Keep ref in sync
    useEffect(() => {
        progressRef.current = progress;
    }, [progress]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = getStoredProgress();
        setProgress(stored);
        progressRef.current = stored;
        setIsLoaded(true);
    }, []);

    const markAsViewed = useCallback((id: string) => {
        // Use ref to get current progress to avoid stale closures
        const current = progressRef.current;

        // Skip if already viewed
        if (current.viewed.includes(id)) return;

        // Create new progress
        const newProgress: ArchiveProgress = {
            viewed: [...current.viewed, id],
            viewedAt: {
                ...current.viewedAt,
                [id]: Date.now()
            }
        };

        // Update state
        setProgress(newProgress);
        progressRef.current = newProgress;

        // Save immediately to localStorage
        saveProgress(newProgress);

        if (process.env.NODE_ENV === 'development') {
            console.log('[Archive] Marked as viewed:', id, 'Total:', newProgress.viewed.length);
        }
    }, []);

    const isViewed = useCallback((id: string) => {
        return progress.viewed.includes(id);
    }, [progress.viewed]);

    const getViewedCount = useCallback(() => {
        return progress.viewed.length;
    }, [progress.viewed]);

    const resetProgress = useCallback(() => {
        const empty = { viewed: [], viewedAt: {} };
        setProgress(empty);
        progressRef.current = empty;
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
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
