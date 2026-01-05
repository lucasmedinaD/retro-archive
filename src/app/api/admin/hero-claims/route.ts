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

// GET - Fetch all claims
export async function GET(request: NextRequest) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
        .from('hero_claims')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST - Approve or reject claim
export async function POST(request: NextRequest) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, claimId, name, email } = body;

    if (action === 'approve') {
        // 1. Create hero
        const { error: heroError } = await supabaseAdmin
            .from('heroes')
            .insert({
                name,
                email,
                is_verified: true,
                verified_at: new Date().toISOString()
            });

        if (heroError) {
            return NextResponse.json({ error: heroError.message }, { status: 500 });
        }

        // 2. Update claim status
        await supabaseAdmin
            .from('hero_claims')
            .update({ status: 'approved' })
            .eq('id', claimId);

        return NextResponse.json({ success: true });
    }

    if (action === 'reject') {
        await supabaseAdmin
            .from('hero_claims')
            .update({ status: 'rejected' })
            .eq('id', claimId);

        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
