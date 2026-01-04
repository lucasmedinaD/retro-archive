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

        // Save scroll position before leaving
        const handleBeforeUnload = () => {
            if (!isRestoringRef.current) {
                savePosition(pathname, window.scrollY);
            }
        };

        // Save position when clicking any link (before navigation)
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link && !isRestoringRef.current) {
                savePosition(pathname, window.scrollY);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('click', handleClick, true);

        return () => {
            // Save position when unmounting
            if (!isRestoringRef.current) {
                savePosition(pathname, window.scrollY);
            }
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('click', handleClick, true);
        };
    }, [pathname, getStoredPositions, savePosition]);

    // Reset restoration flag when pathname changes
    useEffect(() => {
        hasRestoredRef.current = false;
    }, [pathname]);
}
