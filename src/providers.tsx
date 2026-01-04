'use client';

import { ThemeProvider } from 'next-themes';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <WishlistProvider>
                    {children}
                </WishlistProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

