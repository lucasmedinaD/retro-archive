'use server';

import { getSupabaseAdmin, getPublicUrl } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { TransformationExtended } from '@/types/transformations';

// Export the type so other files can use it consistently
export type TransformationData = TransformationExtended;

// Map DB row to Interface
function mapRowToTransformation(row: any): TransformationExtended {
    return {
        id: row.id,
        characterName: row.character_name,
        animeImage: row.anime_image,
        realImage: row.real_image,
        series: row.series,
        category: row.category,
        tags: row.tags,
        likes: row.likes,
        description: row.description,
        artist: row.metadata?.artist,
        outfit: row.metadata?.outfit,
        amazonProducts: row.amazon_products,
        metadata: row.metadata,
        secretImage: row.secret_image,
        secretPosition: row.secret_position,
        era: row.era,
        style: row.style,
        realismLevel: row.realism_level
    };
}

// Map Interface to DB row
function mapTransformationToRow(data: TransformationExtended) {
    return {
        id: data.id,
        character_name: data.characterName,
        anime_image: data.animeImage,
        real_image: data.realImage,
        series: data.series,
        category: data.category,
        tags: data.tags,
        description: data.description,
        amazon_products: data.amazonProducts,
        metadata: {
            ...data.metadata,
            artist: data.artist,
            outfit: data.outfit
        },
        secret_image: data.secretImage,
        secret_position: data.secretPosition,
        era: data.era,
        style: data.style,
        realism_level: data.realismLevel
    };
}

export async function fetchTransformationsAction() {
    try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
            .from('transformations')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data: data.map(mapRowToTransformation) };
    } catch (error: any) {
        console.error('Fetch error:', error);
        return { error: error.message };
    }
}

export async function createTransformationAction(transformation: Omit<TransformationExtended, 'id'>) {
    try {
        const supabase = getSupabaseAdmin();

        // Generate slug-like ID
        const slug = transformation.characterName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newId = `${slug}-${Date.now()}`;

        // Add ID and map
        const dataWithId = { ...transformation, id: newId };
        const row = mapTransformationToRow(dataWithId);

        const { data, error } = await supabase
            .from('transformations')
            .insert(row)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath('/admin/transformations');

        return { success: true, transformation: mapRowToTransformation(data) };
    } catch (error: any) {
        console.error('Create error:', error);
        return { error: error.message };
    }
}

export async function updateTransformationAction(id: string, updates: Partial<TransformationExtended>) {
    try {
        const supabase = getSupabaseAdmin();

        // Prepare row updates
        const rowUpdates: any = {};
        if (updates.characterName) rowUpdates.character_name = updates.characterName;
        if (updates.animeImage) rowUpdates.anime_image = updates.animeImage;
        if (updates.realImage) rowUpdates.real_image = updates.realImage;
        if (updates.series) rowUpdates.series = updates.series;
        if (updates.category) rowUpdates.category = updates.category;
        if (updates.tags) rowUpdates.tags = updates.tags;
        if (updates.description) rowUpdates.description = updates.description;
        if (updates.amazonProducts) rowUpdates.amazon_products = updates.amazonProducts;
        if (updates.era) rowUpdates.era = updates.era;
        if (updates.style) rowUpdates.style = updates.style;
        if (updates.realismLevel) rowUpdates.realism_level = updates.realismLevel;

        // Metadata / Artist / Outfit merging
        if (updates.metadata || updates.artist || updates.outfit) {
            // To be safe and simple: Fetch existing first.
            const { data: existing } = await supabase.from('transformations').select('metadata').eq('id', id).single();
            const currentMeta = existing?.metadata || {};

            rowUpdates.metadata = {
                ...currentMeta,
                ...(updates.metadata || {}),
                artist: updates.artist !== undefined ? updates.artist : currentMeta.artist,
                outfit: updates.outfit !== undefined ? updates.outfit : currentMeta.outfit
            };
        }

        const { data, error } = await supabase
            .from('transformations')
            .update(rowUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath('/admin/transformations');
        revalidatePath(`/[lang]/anime-to-real/${id}`, 'page');

        return { success: true, transformation: mapRowToTransformation(data) };
    } catch (error: any) {
        console.error('Update error:', error);
        return { error: error.message };
    }
}

export async function deleteTransformationAction(id: string) {
    try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase
            .from('transformations')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath('/admin/transformations');

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function likeTransformationAction(id: string) {
    try {
        const supabase = getSupabaseAdmin();

        const { data: current } = await supabase.from('transformations').select('likes').eq('id', id).single();
        const newLikes = (current?.likes || 0) + 1;

        const { data, error } = await supabase
            .from('transformations')
            .update({ likes: newLikes })
            .eq('id', id)
            .select('likes')
            .single();

        if (error) throw error;

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath(`/[lang]/anime-to-real/${id}`, 'page');

        return { success: true, likes: data.likes };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteAllTransformationsAction() {
    try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase
            .from('transformations')
            .delete()
            .neq('id', '000-placeholder'); // Safe delete all

        if (error) throw error;

        revalidatePath('/[lang]/anime-to-real', 'page');
        revalidatePath('/admin/transformations');

        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
