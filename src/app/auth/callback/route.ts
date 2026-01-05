import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    if (code) {
        // 1. Exchange code for session using a temporary client
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        // We ignore setting cookies here because we'll do it on the response
                    },
                },
            }
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.session) {
            // 2. Determine locale from referrer or default
            const referrer = request.headers.get('referer') || '';
            const locale = referrer.includes('/en') ? 'en' : 'es';

            // 3. Create the redirect response
            const response = NextResponse.redirect(`${origin}/${locale}`)

            // 3. Create another client specifically to set cookies on the response
            const supabaseResponse = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        getAll() {
                            return request.cookies.getAll()
                        },
                        setAll(cookiesToSet) {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                response.cookies.set(name, value, options)
                            })
                        },
                    },
                }
            )

            // 4. Set the session on this response-bound client to trigger cookie setting
            await supabaseResponse.auth.setSession(data.session)

            return response
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
