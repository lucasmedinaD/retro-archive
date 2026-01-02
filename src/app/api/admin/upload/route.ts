import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin, STORAGE_BUCKET, VALID_FOLDERS, ValidFolder, getPublicUrl } from '@/lib/supabase';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: NextRequest) {
    // 1. Verify admin authentication via cookie
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Get form data with file
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string;

        // 3. Validate inputs
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!folder || !VALID_FOLDERS.includes(folder as ValidFolder)) {
            return NextResponse.json(
                { error: `Invalid folder. Must be one of: ${VALID_FOLDERS.join(', ')}` },
                { status: 400 }
            );
        }

        // 4. Generate unique filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
        const uniqueFilename = `${timestamp}-${safeName}`;
        const filePath = `${folder}/${uniqueFilename}`;

        // 5. Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 6. Upload to Supabase (server-side, no CORS issues)
        const supabase = getSupabaseAdmin();

        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 7. Return public URL
        return NextResponse.json({
            success: true,
            path: filePath,
            publicUrl: getPublicUrl(filePath)
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
