'use client';

import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client for authentication
export function createSupabaseBrowserClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return null if env vars not available (during build/SSR)
        return null;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

