'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Store scroll positions by path
const scrollPositions = new Map<string, number>();

export function useScrollRestoration() {
    const pathname = usePathname();

    useEffect(() => {
        // Restore scroll position when coming back
        const savedPosition = scrollPositions.get(pathname);
        if (savedPosition !== undefined) {
            requestAnimationFrame(() => {
                window.scrollTo(0, savedPosition);
            });
        }

        // Save scroll position before leaving
        const handleScroll = () => {
            scrollPositions.set(pathname, window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            handleScroll(); // Save one last time before unmounting
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname]);
}
