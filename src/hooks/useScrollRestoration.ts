'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const STORAGE_KEY = 'scroll-positions-v3';

/**
 * Scroll restoration that works with both pathname and search params (for tabs)
 * Key = pathname + search params to support dynamic filtering
 */
export function useScrollRestoration() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isRestoredRef = useRef(false);
    const lastSavedKeyRef = useRef<string | null>(null);

    // Create a unique key from pathname + search params
    const getStorageKey = () => {
        const search = searchParams.toString();
        return search ? `${pathname}?${search}` : pathname;
    };

    // Restore scroll on mount/route change
    useEffect(() => {
        // Disable browser's automatic scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Only restore if we haven't already for this mount
        if (isRestoredRef.current) return;

        const currentKey = getStorageKey();

        const restore = () => {
            try {
                const stored = sessionStorage.getItem(STORAGE_KEY);
                if (!stored) return;

                const positions: Record<string, number> = JSON.parse(stored);
                const savedY = positions[currentKey];

                if (savedY !== undefined && savedY > 0) {
                    // Use multiple attempts for dynamic content
                    window.scrollTo(0, savedY);
                    setTimeout(() => window.scrollTo(0, savedY), 100);
                    setTimeout(() => window.scrollTo(0, savedY), 300);
                }
            } catch { }

            isRestoredRef.current = true;
        };

        // Restore after a brief delay to let content render
        requestAnimationFrame(restore);
    }, [pathname, searchParams]);

    // Reset restored flag when route changes
    useEffect(() => {
        isRestoredRef.current = false;
        lastSavedKeyRef.current = null;
    }, [pathname, searchParams]);

    // Global click handler to save position BEFORE navigation
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            // Only handle internal links
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

            const currentKey = getStorageKey();

            // Don't save again if we just saved for this key
            if (lastSavedKeyRef.current === currentKey) return;

            // Save current scroll position for current page/tab
            const scrollY = window.scrollY;

            try {
                const stored = sessionStorage.getItem(STORAGE_KEY);
                const positions: Record<string, number> = stored ? JSON.parse(stored) : {};
                positions[currentKey] = scrollY;
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
                lastSavedKeyRef.current = currentKey;
            } catch { }
        };

        // Capture phase to run before navigation
        document.addEventListener('click', handleClick, { capture: true });

        return () => {
            document.removeEventListener('click', handleClick, { capture: true });
        };
    }, [pathname, searchParams]);
}
