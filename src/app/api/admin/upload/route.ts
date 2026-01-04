import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSupabaseAdmin, STORAGE_BUCKET, TRANSFORMATIONS_BUCKET, VALID_FOLDERS, ValidFolder, getPublicUrl } from '@/lib/supabase';

export const config = {
    api: {
        bodyParser: false,
    },
};

/**
 * Generate safe filename from title
 * Example: "Komi-San Anime" → "komi-san-anime"
 */
function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD') // Normalize unicode
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
        .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
        .slice(0, 50); // Max 50 chars
}

/**
 * Check if file exists in Supabase and find next available name
 * Returns: unique filename with extension
 */
async function getUniqueFilename(
    supabase: ReturnType<typeof getSupabaseAdmin>,
    folder: string,
    baseName: string,
    extension: string,
    bucket: string = STORAGE_BUCKET
): Promise<string> {
    let filename = `${baseName}${extension}`;
    let counter = 1;

    while (true) {
        // If transformations bucket used, path is root, else folder/filename
        const listPath = bucket === TRANSFORMATIONS_BUCKET ? '' : folder;
        const searchName = filename;

        // Check if file exists
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(listPath, {
                search: searchName
            });

        // If error (bucket might be empty) or file doesn't exist, this name is available
        // Note: Supabase list returns exact matches if search is exact, but might match partials.
        // Safer check: look for exact match in results
        const exists = data?.some(f => f.name === filename);

        if (error || !exists) {
            return filename;
        }

        // File exists, try next number
        filename = `${baseName}-${counter}${extension}`;
        counter++;

        // Safety: don't loop forever
        if (counter > 100) {
            // Fallback to timestamp if we hit too many duplicates
            return `${baseName}-${Date.now()}${extension}`;
        }
    }
}

export async function POST(request: NextRequest) {
    // 1. Verify admin authentication via cookie
    const cookieStore = await cookies();
    const adminSession = cookieStore.get('admin_session');

    if (!adminSession || adminSession.value !== 'authenticated') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 2. Get form data with file and title
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string;
        const title = formData.get('title') as string; // NEW: title for naming
        const prefix = formData.get('prefix') as string; // NEW: 'anime' or 'real' etc.

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

        // 4. Generate smart filename from title
        const baseName = title ? slugify(title) : 'upload';
        const extension = '.jpg'; // Always .jpg after compression
        const finalBaseName = prefix ? `${prefix}-${baseName}` : baseName;

        // 5. Determine bucket and path
        const supabase = getSupabaseAdmin();

        let bucket = STORAGE_BUCKET;
        // Logic: if folder is transformations, use separate bucket.
        if (folder === 'transformations') {
            bucket = TRANSFORMATIONS_BUCKET;
        }

        // 6. Get unique filename (checks for duplicates in the correct bucket)
        const uniqueFilename = await getUniqueFilename(supabase, folder, finalBaseName, extension, bucket);

        // Path depends on bucket structure
        // For transformations bucket, we might want root or folder. Let's stick to root?
        // Actually earlier code used 'transformations/filename' for assets bucket.
        // If we use dedicated bucket, root is cleaner.
        const filePath = bucket === TRANSFORMATIONS_BUCKET ? uniqueFilename : `${folder}/${uniqueFilename}`;

        // 7. Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 8. Upload to Supabase
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: 'image/jpeg',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // 9. Return full public URL
        const publicUrl = getPublicUrl(filePath, bucket);

        return NextResponse.json({
            success: true,
            path: filePath,
            publicUrl,
            filename: uniqueFilename
        });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
