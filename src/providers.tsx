'use client';

import { ThemeProvider } from 'next-themes';
import { WishlistProvider } from '@/contexts/WishlistContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WishlistProvider>
                {children}
            </WishlistProvider>
        </ThemeProvider>
    );
}
