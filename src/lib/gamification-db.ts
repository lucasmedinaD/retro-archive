'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type InteractionType = 'like' | 'fire' | 'mindblown' | 'diamond';
export type VoteCategory = 'realism' | 'impact' | 'fidelity';

// Record a reaction (Like, Fire, etc.)
export async function recordInteraction(transformationId: string, type: InteractionType, userId?: string, sessionId?: string) {
    if (!supabaseUrl || !supabaseAnonKey) return { error: 'Missing env vars' };
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase
        .from('interactions')
        .insert({
            transformation_id: transformationId,
            user_id: userId || null,
            session_id: sessionId || null,
            interaction_type: type
        });

    if (error) {
        console.error('Error recording interaction:', error);
        return { error: error.message };
    }

    revalidatePath(`/anime-to-real/${transformationId}`);
    return { success: true };
}

// Get interaction counts for a specific transformation
export async function getInteractionCounts(transformationId: string) {
    if (!supabaseUrl || !supabaseAnonKey) return { likes: 0, fire: 0, mindblown: 0, diamond: 0 };
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // We can use the view if it exists, or raw count
    const { data, error } = await supabase
        .from('ranking_scores_view')
        .select('*')
        .eq('transformation_id', transformationId)
        .single();

    if (error || !data) {
        return { likes: 0, fire: 0, mindblown: 0, diamond: 0 };
    }

    return {
        likes: data.like_count,
        fire: data.fire_count,
        mindblown: data.mindblown_count,
        diamond: data.diamond_count
    };
}

// Submit a detailed category vote
export async function submitCategoryVote(transformationId: string, category: VoteCategory, value: number, userId?: string) {
    if (!supabaseUrl || !supabaseAnonKey) return { error: 'Missing env vars' };
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase
        .from('category_votes')
        .insert({
            transformation_id: transformationId,
            user_id: userId || null,
            category: category,
            vote_value: value
        });

    if (error) {
        console.error('Error submitting vote:', error);
        return { error: error.message };
    }

    return { success: true };
}

// Get Top Rankings (Weekly/Monthly/All-Time)
export async function getRankings(period: 'weekly' | 'monthly' | 'all-time' = 'weekly', limit = 10) {
    if (!supabaseUrl || !supabaseAnonKey) return [];
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // This is a simplified logic. For strict time filtering, we'd need to query the interactions table directly with a date filter
    // or have the view handle it.
    // For MVP: We will query the 'ranking_scores_view' directly (which is All-Time currently)
    // To support periods properly, we would need to adjust the query:

    // NOTE: The current 'ranking_scores_view' in setup.sql is aggregate of ALL time.
    // To filter by time, we need to do a raw query on interactions.

    let timeFilter = new Date(0).toISOString(); // Default all time
    const now = new Date();

    if (period === 'weekly') {
        now.setDate(now.getDate() - 7);
        timeFilter = now.toISOString();
    } else if (period === 'monthly') {
        now.setDate(now.getDate() - 30);
        timeFilter = now.toISOString();
    }

    // Doing a raw aggregation query since the view is all-time
    // Weighted Score: Like(1) + Fire(2) + Mindblown(3) + Diamond(5)

    const { data, error } = await supabase
        .from('interactions')
        .select('transformation_id, interaction_type')
        .gte('created_at', timeFilter);

    if (error) {
        console.error('Error fetching rankings:', error);
        return [];
    }

    // Aggregate in JS (for MVP scale this is fine and faster than writing complex SQL function right now)
    const scores: Record<string, number> = {};

    data.forEach((row: any) => {
        let weight = 1;
        if (row.interaction_type === 'fire') weight = 2;
        if (row.interaction_type === 'mindblown') weight = 3;
        if (row.interaction_type === 'diamond') weight = 5;

        scores[row.transformation_id] = (scores[row.transformation_id] || 0) + weight;
    });

    // Convert to sorted array
    const sortedIds = Object.entries(scores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA) // Descending
        .slice(0, limit)
        .map(([id]) => id);

    return sortedIds; // Returns IDs. Caller needs to fetch full transformation details.
}
