'use server';

import { createClient } from '@/lib/supabase-server';

export interface UserProfile {
    id: string;
    auth_user_id: string;
    username: string;
    avatar_url: string | null;
    max_tap_streak: number;
    created_at: string;
    updated_at: string;
}

/**
 * Get user profile by auth user ID
 */
export async function getUserProfile(authUserId: string): Promise<UserProfile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

    if (error || !data) return null;

    return data as UserProfile;
}

/**
 * Get user profile by username
 */
export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (error || !data) return null;

    return data as UserProfile;
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('username', username)
        .single();

    // Username is available if no profile found
    return error !== null || !data;
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(
    authUserId: string,
    updates: {
        username?: string;
        avatar_url?: string;
        max_tap_streak?: number;
    }
): Promise<{ success: boolean; error?: string; profile?: UserProfile }> {
    const supabase = await createClient();

    try {
        // Check if username is taken by another user
        if (updates.username) {
            const { data: existing } = await supabase
                .from('user_profiles')
                .select('auth_user_id')
                .eq('username', updates.username)
                .single();

            if (existing && existing.auth_user_id !== authUserId) {
                return { success: false, error: 'Username already taken' };
            }
        }

        const { data, error } = await supabase
            .from('user_profiles')
            .upsert({
                auth_user_id: authUserId,
                ...updates,
                updated_at: new Date().toISOString()
            }, { onConflict: 'auth_user_id' })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, profile: data as UserProfile };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}

/**
 * Update user's max tap streak if new streak is higher
 */
export async function updateMaxTapStreak(
    authUserId: string,
    newStreak: number
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();

    try {
        // Get current profile
        const profile = await getUserProfile(authUserId);

        if (!profile) {
            return { success: false, error: 'Profile not found' };
        }

        // Only update if new streak is higher
        if (newStreak > profile.max_tap_streak) {
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    max_tap_streak: newStreak,
                    updated_at: new Date().toISOString()
                })
                .eq('auth_user_id', authUserId);

            if (error) {
                return { success: false, error: error.message };
            }
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: String(err) };
    }
}
