import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Check admin auth
async function isAdmin(request: NextRequest): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value === 'authenticated';
}

// GET - Fetch all heroes
export async function GET(request: NextRequest) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
        .from('heroes')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// PATCH - Update hero (toggle featured, etc)
export async function PATCH(request: NextRequest) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { heroId, featured, is_anonymous } = body;

    const updates: any = {};
    if (featured !== undefined) updates.featured = featured;
    if (is_anonymous !== undefined) updates.is_anonymous = is_anonymous;

    const { error } = await supabaseAdmin
        .from('heroes')
        .update(updates)
        .eq('id', heroId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

// DELETE - Remove hero
export async function DELETE(request: NextRequest) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { heroId } = body;

    const { error } = await supabaseAdmin
        .from('heroes')
        .delete()
        .eq('id', heroId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
