import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase-middleware';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Supabase Session Update (Critical for Auth Persistence)
    // This MUST run first to header/cookie management works
    const response = await updateSession(request);

    // 2. Language Layout Logic
    // 2. Language Layout Logic
    const pathnameIsMissingLocale = ['/en', '/es'].every(
        (locale) => !pathname.startsWith(`${locale}/`) && pathname !== locale
    );

    if (pathnameIsMissingLocale && !pathname.startsWith('/admin') && pathname !== '/admin') {
        const acceptLanguage = request.headers.get('accept-language') || '';
        const preferredLang = acceptLanguage.toLowerCase().includes('es') ? 'es' : 'en';

        // Preserve query search params
        const newUrl = new URL(`/${preferredLang}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url);
        newUrl.search = request.nextUrl.search;

        return NextResponse.redirect(newUrl);
    }

    // 3. Admin Routes Protection
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const session = request.cookies.get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Return the response created by updateSession (which carries the cookies)
    // If we return NextResponse.next() here effectively, but we must use the response object from updateSession
    // However, since we redirected above, this part is for non-redirect paths.

    // Note: updateSession returns a response provided by NextResponse.next(). 
    // If we need to modify headers further we should clone or use it. 
    // Simpler approach for this specific file structure:
    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
