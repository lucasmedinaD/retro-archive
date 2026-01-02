import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin, STORAGE_BUCKET, VALID_FOLDERS, ValidFolder, getPublicUrl } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    // 1. Verify admin authentication via cookie (same as other admin actions)
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { folder, filename, contentType } = body;

        // 2. Validate folder
        if (!folder || !VALID_FOLDERS.includes(folder as ValidFolder)) {
            return NextResponse.json(
                { error: `Invalid folder. Must be one of: ${VALID_FOLDERS.join(', ')}` },
                { status: 400 }
            );
        }

        // 3. Validate filename
        if (!filename || typeof filename !== 'string') {
            return NextResponse.json({ error: 'Filename required' }, { status: 400 });
        }

        // 4. Generate unique path with timestamp
        const timestamp = Date.now();
        const extension = filename.split('.').pop() || 'jpg';
        const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
        const uniqueFilename = `${timestamp}-${safeName}`;
        const filePath = `${folder}/${uniqueFilename}`;

        // 5. Get Supabase admin client and generate signed URL
        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .createSignedUploadUrl(filePath);

        if (error) {
            console.error('Supabase signed URL error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 6. Return signed URL and public URL
        return NextResponse.json({
            signedUrl: data.signedUrl,
            token: data.token,
            path: filePath,
            publicUrl: getPublicUrl(filePath)
        });

    } catch (error: any) {
        console.error('Sign upload error:', error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
