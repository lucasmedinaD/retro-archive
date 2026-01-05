import { TransformationExtended } from '@/types/transformations';
import { createClient } from '@supabase/supabase-js';

// Server-side client for fetching in Server Components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getTransformationsFromDB(): Promise<TransformationExtended[]> {
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

export async function getTransformationByIdFromDB(id: string): Promise<TransformationExtended | undefined> {
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

export async function getTransformationsByTag(tag: string): Promise<TransformationExtended[]> {
    if (!supabaseUrl || !supabaseAnonKey) return [];
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // We search in both 'series' (exact match) and 'tags' array (contains)
    // Supabase 'or' syntax: series.eq.Tag,tags.cs.{Tag}
    // But 'tags' is text[] array. 'cs' means contains. 
    // Ideally we want efficient search. 

    // Let's implement robust search:
    // 1. Exact match on Series (case insensitive if possible, but exact for DB)
    // 2. Contains in Tags array

    // Note: Supabase ILIKE is good for case insensitive. 
    // tags.cs.{tag} expects exact case if I recall. 
    // Let's rely on exact match for now or use text search if configured.
    // Simple approach: Fetch matching Series or Tags.

    // Using .or() with filter
    // series.ilike.%tag%, tags.cs.{"tag"} 
    // (cs is case sensitive usually).

    // For now, let's assume the tag coming in is clean.
    // Actually, widespread generic search (ilike) might be better for "tags" if they are strings.
    // If 'tags' is JSONB or Array, query differs. 
    // Assuming 'tags' is text[] based on mapDBToTransformation.

    const { data, error } = await supabase
        .from('transformations')
        .select('*')
        .or(`series.ilike.%${tag}%,tags.cs.{${tag}}`)
        .order('created_at', { ascending: false });

    // Fallback if the OR syntax fails or we want broader search: 
    // Just search series for now as that's the main "Tag" showing in UI filter

    if (error) {
        // Fallback or retry? 
        console.error('Error fetching by tag:', error);

        // Simple fallback: just series
        const { data: dataSeries } = await supabase
            .from('transformations')
            .select('*')
            .ilike('series', `%${tag}%`)
            .order('created_at', { ascending: false });

        return mapDBToTransformation(dataSeries || []);
    }

    return mapDBToTransformation(data || []);
}

// Helper to map DB row to TS interface
function mapDBToTransformation(rows: any[]): TransformationExtended[] {
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
        outfit: row.metadata?.outfit,
        amazonProducts: row.amazon_products,
        metadata: row.metadata,
        secretImage: row.secret_image,
        secretPosition: row.secret_position,
        era: row.era,
        style: row.style,
        realismLevel: row.realism_level,
        is_nsfw: row.is_nsfw
    }));
}
