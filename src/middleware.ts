import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if accessing root path
    if (pathname === '/') {
        // Get preferred language from Accept-Language header
        const acceptLanguage = request.headers.get('accept-language') || '';

        // Simple language detection - check if Spanish is preferred
        const preferredLang = acceptLanguage.toLowerCase().includes('es') ? 'es' : 'en';

        // Redirect to detected language
        return NextResponse.redirect(new URL(`/${preferredLang}`, request.url));
    }

    // Admin routes protection
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const session = request.cookies.get('admin_session');

        if (!session || session.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/admin/:path*'],
};
