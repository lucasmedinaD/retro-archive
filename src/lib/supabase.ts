import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
// Use this for admin operations like generating signed URLs
export function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Storage bucket names
export const STORAGE_BUCKET = 'assets';
export const TRANSFORMATIONS_BUCKET = 'transformations'; // Created via SQL

// Valid folders for organizing uploads
export const VALID_FOLDERS = ['products', 'transformations', 'slider-demos', 'amazon-products'] as const;
export type ValidFolder = typeof VALID_FOLDERS[number];

// Get public URL for a file
export function getPublicUrl(path: string, bucket: string = STORAGE_BUCKET): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) return '';
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
