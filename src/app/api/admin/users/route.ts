import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Helper to get admin client
function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
}

// Check admin auth
async function isAdmin(request: NextRequest): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value === 'authenticated';
}

// GET - Fetch all users with activity stats
export async function GET(request: NextRequest) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getAdminClient();

    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    // Get profiles data
    const { data: profiles } = await supabase
        .from('profiles')
        .select('*');

    // Get activity stats for each user
    const usersWithStats = await Promise.all(
        authUsers.users.map(async (user) => {
            const userId = user.id;

            // Count comments
            const { count: commentsCount } = await supabase
                .from('comments')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            // Count favorites
            const { count: favoritesCount } = await supabase
                .from('favorites')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            // Count reactions
            const { count: reactionsCount } = await supabase
                .from('reactions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            // Count category votes
            const { count: votesCount } = await supabase
                .from('category_votes')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            // Find profile
            const profile = profiles?.find(p => p.id === userId);

            return {
                id: userId,
                email: user.email,
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at,
                provider: user.app_metadata?.provider || 'email',
                username: profile?.username || null,
                full_name: profile?.full_name || user.user_metadata?.full_name || null,
                avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || null,
                show_nsfw: profile?.show_nsfw || false,
                stats: {
                    comments: commentsCount || 0,
                    favorites: favoritesCount || 0,
                    reactions: reactionsCount || 0,
                    votes: votesCount || 0,
                },
                is_banned: profile?.is_banned || false,
            };
        })
    );

    // Sort by most recent
    usersWithStats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json(usersWithStats);
}

// PATCH - Ban/unban user
export async function PATCH(request: NextRequest) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, is_banned } = body;

    const supabase = getAdminClient();

    // Update profile
    const { error } = await supabase
        .from('profiles')
        .update({ is_banned })
        .eq('id', userId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
