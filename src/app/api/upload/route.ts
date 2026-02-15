import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const categoryName = formData.get('categoryName') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const { env } = getRequestContext();
        const bucket = env.ASSETS;
        const r2Domain = env.R2_DOMAIN;

        if (!bucket) {
            console.error('R2 binding ASSETS not found');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Sanitize category name for folder path
        const safeCategory = categoryName ? categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'uncategorized';

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 10);
        // We assume the frontend converts to webp, so extension is .webp, but let's trust the blob type or force it
        const extension = file.type === 'image/webp' ? 'webp' : file.name.split('.').pop();
        const key = `carta/${safeCategory}/${timestamp}-${random}.${extension}`;

        // Upload to R2
        await bucket.put(key, file);

        // Construct public URL
        const publicUrl = `${r2Domain}/${key}`;

        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
