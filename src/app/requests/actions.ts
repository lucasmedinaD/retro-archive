'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createRequestAction(characterName: string, series?: string) {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Debes iniciar sesión para crear una petición', code: 'UNAUTHORIZED' };
    }

    try {
        const { data, error } = await supabase
            .from('requests')
            .insert({
                character_name: characterName,
                series: series || null,
                user_id: user.id
            })
            .select()
            .single();

        if (error) throw error;

        // Auto-vote for own request
        await supabase
            .from('request_votes')
            .insert({
                request_id: data.id,
                user_id: user.id
            });

        revalidatePath('/requests');
        return { success: true, data };
    } catch (error: any) {
        console.error('Create request error:', error);
        return { error: 'Error al crear la petición' };
    }
}

export async function voteRequestAction(requestId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Debes iniciar sesión para votar', code: 'UNAUTHORIZED' };
    }

    try {
        // Check if already voted
        const { data: existing } = await supabase
            .from('request_votes')
            .select('id')
            .eq('request_id', requestId)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            // Remove vote (toggle)
            await supabase
                .from('request_votes')
                .delete()
                .eq('id', existing.id);

            return { success: true, voted: false };
        } else {
            // Add vote
            await supabase
                .from('request_votes')
                .insert({
                    request_id: requestId,
                    user_id: user.id
                });

            return { success: true, voted: true };
        }
    } catch (error: any) {
        console.error('Vote request error:', error);
        return { error: 'Error al votar' };
    }
}
