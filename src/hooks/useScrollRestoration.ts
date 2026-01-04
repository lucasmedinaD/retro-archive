'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'scroll-positions-v2';

/**
 * Simple scroll restoration that:
 * 1. Saves scroll position BEFORE navigation via click handler
 * 2. Restores position when returning to a page
 */
export function useScrollRestoration() {
    const pathname = usePathname();
    const isRestoredRef = useRef(false);
    const lastSavedPathRef = useRef<string | null>(null);

    // Restore scroll on mount/pathname change
    useEffect(() => {
        // Disable browser's automatic scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Only restore if we haven't already for this mount
        if (isRestoredRef.current) return;

        const restore = () => {
            try {
                const stored = sessionStorage.getItem(STORAGE_KEY);
                if (!stored) return;

                const positions: Record<string, number> = JSON.parse(stored);
                const savedY = positions[pathname];

                if (savedY !== undefined && savedY > 0) {
                    // Use multiple attempts for dynamic content
                    window.scrollTo(0, savedY);

                    // Retry after images load
                    setTimeout(() => window.scrollTo(0, savedY), 100);
                    setTimeout(() => window.scrollTo(0, savedY), 300);
                }
            } catch { }

            isRestoredRef.current = true;
        };

        // Restore after a brief delay to let content render
        requestAnimationFrame(restore);
    }, [pathname]);

    // Reset restored flag when pathname changes
    useEffect(() => {
        isRestoredRef.current = false;
        lastSavedPathRef.current = null;
    }, [pathname]);

    // Global click handler to save position BEFORE navigation
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            // Only handle internal links
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

            // Don't save again if we just saved for this path
            if (lastSavedPathRef.current === pathname) return;

            // Save current scroll position for current page
            const scrollY = window.scrollY;

            try {
                const stored = sessionStorage.getItem(STORAGE_KEY);
                const positions: Record<string, number> = stored ? JSON.parse(stored) : {};
                positions[pathname] = scrollY;
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
                lastSavedPathRef.current = pathname;
            } catch { }
        };

        // Capture phase to run before navigation
        document.addEventListener('click', handleClick, { capture: true });

        return () => {
            document.removeEventListener('click', handleClick, { capture: true });
        };
    }, [pathname]);
}
