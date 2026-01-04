'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'scroll-positions';

/**
 * Hook to save and restore scroll position when navigating
 * Uses sessionStorage to persist positions across page navigations
 */
export function useScrollRestoration() {
    const pathname = usePathname();
    const isRestoringRef = useRef(false);
    const hasRestoredRef = useRef(false);
    const isNavigatingRef = useRef(false);  // New: prevent saves during navigation

    // Get stored positions from sessionStorage
    const getStoredPositions = useCallback((): Record<string, number> => {
        if (typeof window === 'undefined') return {};
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    }, []);

    // Save position to sessionStorage
    const savePosition = useCallback((path: string, position: number) => {
        if (typeof window === 'undefined') return;
        if (isNavigatingRef.current) return; // Don't save during navigation
        try {
            const positions = getStoredPositions();
            positions[path] = position;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
        } catch {
            // Ignore storage errors
        }
    }, [getStoredPositions]);

    useEffect(() => {
        // Restore scroll position on mount
        if (!hasRestoredRef.current) {
            const positions = getStoredPositions();
            const savedPosition = positions[pathname];

            if (savedPosition !== undefined && savedPosition > 0) {
                isRestoringRef.current = true;

                // Wait for content to render before scrolling
                requestAnimationFrame(() => {
                    window.scrollTo(0, savedPosition);

                    setTimeout(() => {
                        isRestoringRef.current = false;
                        hasRestoredRef.current = true;
                    }, 150);
                });
            } else {
                hasRestoredRef.current = true;
            }
        }

        // Save position when clicking any link (before navigation)
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link && !isRestoringRef.current && !isNavigatingRef.current) {
                // IMMEDIATELY save current scroll position
                const currentScroll = window.scrollY;

                // Mark as navigating to prevent further saves
                isNavigatingRef.current = true;

                // Save the position at the moment of click
                const positions = getStoredPositions();
                positions[pathname] = currentScroll;
                try {
                    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
                } catch { }
            }
        };

        // Use capture phase to catch click BEFORE any scroll happens
        document.addEventListener('click', handleClick, true);

        return () => {
            document.removeEventListener('click', handleClick, true);
            // Reset navigation flag on unmount
            isNavigatingRef.current = false;
        };
    }, [pathname, getStoredPositions, savePosition]);

    // Reset flags when pathname changes (new page loaded)
    useEffect(() => {
        hasRestoredRef.current = false;
        isNavigatingRef.current = false;
    }, [pathname]);
}
