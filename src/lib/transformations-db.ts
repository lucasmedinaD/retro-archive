import { createClient } from '@supabase/supabase-js';
import { Transformation } from '@/data/transformations';

// Server-side client for fetching in Server Components
// Server-side client for fetching in Server Components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getTransformationsFromDB(): Promise<Transformation[]> {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase env vars missing, returning empty transformations');
        return [];
    }
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // We select all fields to match the Transformation interface
    // Note: The DB columns are snake_case, interface is camelCase. We'll need to map them.
    const { data, error } = await supabase
        .from('transformations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transformations:', error);
        return [];
    }

    return mapDBToTransformation(data);
}

export async function getTransformationByIdFromDB(id: string): Promise<Transformation | undefined> {
    if (!supabaseUrl || !supabaseAnonKey) return undefined;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
        .from('transformations')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return undefined;
    }

    return mapDBToTransformation([data])[0];
}

// Helper to map DB row to TS interface
function mapDBToTransformation(rows: any[]): Transformation[] {
    return rows.map(row => ({
        id: row.id,
        characterName: row.character_name,
        animeImage: row.anime_image,
        realImage: row.real_image,
        description: row.description,
        series: row.series,
        category: row.category,
        tags: row.tags,
        likes: row.likes,
        artist: row.metadata?.artist,
        amazonProducts: row.amazon_products,
        // Map other fields as needed
        metadata: row.metadata
    }));
}
