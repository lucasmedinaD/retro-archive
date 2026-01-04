'use server';

import { createClient } from '@/lib/supabase-server';
import { getUserProfile, updateMaxTapStreak } from './profile';

export interface TapStreakRecord {
    transformation_id: string;
    user_id: string;
    streak: number;
    timestamp: string;
}

/**
 * Record a tap streak and update transformation owner if this is a new record
 */
export async function recordTapStreak(
    transformationId: string,
    authUserId: string,
    streak: number
): Promise<{ success: boolean; newRecord?: boolean; error?: string }> {
    const supabase = await createClient();

    try {
        // Get user profile
        const userProfile = await getUserProfile(authUserId);

        if (!userProfile) {
            return { success: false, error: 'User profile not found. Please create a profile first.' };
        }

        // Get current transformation
        const { data: transformation, error: fetchError } = await supabase
            .from('transformations')
            .select('tap_count, owner_user_id')
            .eq('id', transformationId)
            .single();

        if (fetchError || !transformation) {
            return { success: false, error: 'Transformation not found' };
        }

        const currentRecord = transformation.tap_count || 0;
        const isNewRecord = streak > currentRecord;

        // Update transformation if new record
        if (isNewRecord) {
            const { error: updateError } = await supabase
                .from('transformations')
                .update({
                    tap_count: streak,
                    owner_user_id: userProfile.id,
                    owner_updated_at: new Date().toISOString()
                })
                .eq('id', transformationId);

            if (updateError) {
                return { success: false, error: updateError.message };
            }
        }

        // Update user's max streak if applicable
        await updateMaxTapStreak(authUserId, streak);

        return { success: true, newRecord: isNewRecord };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * Get transformation owner details
 */
export async function getTransformationOwner(transformationId: string): Promise<{
    username: string;
    avatar_url: string | null;
    tap_count: number;
} | null> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('transformations')
            .select(`
                tap_count,
                owner_user_id,
                user_profiles!owner_user_id (
                    username,
                    avatar_url
                )
            `)
            .eq('id', transformationId)
            .single();

        if (error || !data || !data.user_profiles || data.user_profiles.length === 0) {
            return null;
        }

        const profile = Array.isArray(data.user_profiles) ? data.user_profiles[0] : data.user_profiles;

        return {
            username: profile.username,
            avatar_url: profile.avatar_url,
            tap_count: data.tap_count || 0
        };
    } catch (err) {
        return null;
    }
}
