import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        console.log("Upload request received");
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const categoryName = formData.get('categoryName') as string;

        if (!file) {
            console.error("No file in formData");
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const { env } = getRequestContext();
        // Fallback for local development if needed, but bindings are preferred
        const bucket = env.ASSETS;
        const r2Domain = env.R2_DOMAIN || 'https://imagenes.pasteleriahijitos.cl';

        console.log("Environment check:", {
            hasBucket: !!bucket,
            r2Domain,
            categoryName,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
        });

        if (!bucket) {
            console.error('R2 binding ASSETS not found. Check wrangler.toml and Cloudflare dashboard.');
            return NextResponse.json({ error: 'Server configuration error: ASSETS binding missing' }, { status: 500 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error("Invalid file type:", file.type);
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Sanitize category name
        // Replace spaces with dashes, remove special chars, keep alphanumeric
        const safeCategory = categoryName
            ? categoryName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-')
            : 'uncategorized';

        // Use original filename (sanitized) or generate random
        // User requested maintaining names like "americana.webp"
        // Let's try to use the original name but sanitize it
        const originalName = file.name.split('.')[0];
        const safeName = originalName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-');
        const extension = 'webp'; // Frontend converts to webp

        const key = `carta/${safeCategory}/${safeName}.${extension}`;

        console.log(`Uploading to key: ${key}`);

        // Upload to R2
        try {
            await bucket.put(key, file, {
                httpMetadata: {
                    contentType: 'image/webp', // Force content type
                }
            });
            console.log("Upload successful");
        } catch (uploadError) {
            console.error("R2 put error:", uploadError);
            throw uploadError;
        }

        // Construct public URL
        const publicUrl = `${r2Domain}/${key}`;

        return NextResponse.json({ url: publicUrl });

    } catch (error) {
        console.error('Upload error (top level):', error);
        return NextResponse.json({ error: 'Upload failed', details: (error as Error).message }, { status: 500 });
    }
}
