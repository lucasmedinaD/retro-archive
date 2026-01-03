'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook to save and restore scroll position when navigating
 * Useful for preserving scroll position when going back to a list
 */
export function useScrollRestoration() {
    const pathname = usePathname();
    const scrollPositions = useRef<{ [key: string]: number }>({});
    const isRestoringRef = useRef(false);

    useEffect(() => {
        // Save scroll position before navigating away
        const handleRouteChange = () => {
            if (!isRestoringRef.current) {
                scrollPositions.current[pathname] = window.scrollY;
            }
        };

        // Restore scroll position when coming back
        const restoreScroll = () => {
            const savedPosition = scrollPositions.current[pathname];
            if (savedPosition !== undefined) {
                isRestoringRef.current = true;
                window.scrollTo(0, savedPosition);
                setTimeout(() => {
                    isRestoringRef.current = false;
                }, 100);
            }
        };

        // Save on scroll
        const handleScroll = () => {
            if (!isRestoringRef.current) {
                scrollPositions.current[pathname] = window.scrollY;
            }
        };

        // Restore on mount
        restoreScroll();

        // Listen to scroll
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeunload', handleRouteChange);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeunload', handleRouteChange);
        };
    }, [pathname]);
}
