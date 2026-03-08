import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        console.log("Upload request received");
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const categoryName = formData.get('categoryName') as string;
        const productName = formData.get('productName') as string;
        const oldImageUrl = formData.get('oldImageUrl') as string; // URL of previous image to delete

        if (!file) {
            console.error("No file in formData");
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const { env } = getRequestContext();
        // Bindings are preferred
        let bucket = env.ASSETS;
        const r2Domain = env.R2_DOMAIN || 'https://imagenes.pasteleriahijitos.cl';

        // Validate file type
        if (!file.type.startsWith('image/')) {
            console.error("Invalid file type:", file.type);
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Sanitize category name
        const safeCategory = categoryName
            ? categoryName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-')
            : 'uncategorized';

        // Use productName if available, otherwise original filename
        const rawName = productName || file.name.split('.')[0];
        const safeName = rawName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-');

        const extension = 'webp';

        // Add timestamp to filename for cache-busting (avoids CDN serving stale cached images)
        const timestamp = Date.now();
        const key = `carta/${safeCategory}/${safeName}_${timestamp}.${extension}`;

        console.log(`Uploading to key: ${key}`);

        // Helper to extract R2 key from a full public URL
        const extractOldKey = (url: string): string | null => {
            if (!url) return null;
            try {
                const urlObj = new URL(url);
                // Remove leading slash to get the R2 key
                return urlObj.pathname.startsWith('/') ? urlObj.pathname.slice(1) : urlObj.pathname;
            } catch {
                return null;
            }
        };

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Try R2 Binding first
        let r2Error: any = null;
        if (bucket) {
            try {
                await bucket.put(key, arrayBuffer, {
                    httpMetadata: { contentType: 'image/webp' }
                });
                console.log("Upload successful via R2 Binding");

                // Delete old image from R2 after successful upload
                const oldKey = extractOldKey(oldImageUrl);
                if (oldKey) {
                    try {
                        await bucket.delete(oldKey);
                        console.log(`Deleted old image from R2: ${oldKey}`);
                    } catch (delErr: any) {
                        console.warn(`Failed to delete old image ${oldKey}:`, delErr.message);
                    }
                }

                const publicUrl = `${r2Domain}/${key}`;
                return NextResponse.json({ url: publicUrl });
            } catch (err: any) {
                r2Error = err;
                console.warn("R2 Binding failed, trying S3 fallback if credentials exist...", err.message);
            }
        }

        // Fallback: S3 Client (for local dev or if binding fails)
        // Helper to get env value even if key has trailing spaces AND TRIM VALUE
        const getEnvVar = (key: string) => {
            let val = undefined;
            if (process.env[key]) val = process.env[key];
            else if ((env as any)[key]) val = (env as any)[key];
            else {
                // Fuzzy search in env object
                const fuzzyKey = Object.keys(env as any).find(k => k.trim() === key);
                if (fuzzyKey) val = (env as any)[fuzzyKey];
            }

            // TRIM VALUE to fix "Invalid header value" errors
            return val ? String(val).trim() : undefined;
        };

        const envVars = env as any;
        console.log("Debug: Available Env Keys (Raw):", Object.keys(envVars).map(k => `"${k}"`));

        const accountId = getEnvVar('R2_ACCOUNT_ID') || 'f9f7037e5c7f3cc70c00a2c1f40fe6dd';
        const accessKeyId = getEnvVar('R2_ACCESS_KEY_ID');
        const secretAccessKey = getEnvVar('R2_SECRET_ACCESS_KEY');

        console.log("Fallback Credentials Check:", {
            hasAccountId: !!accountId,
            hasAccessKey: !!accessKeyId,
            hasSecret: !!secretAccessKey,
            accessKeyPrefix: accessKeyId ? accessKeyId.substring(0, 4) + '...' : 'none'
        });

        if (accountId && accessKeyId && secretAccessKey) {
            console.log("Using S3 Client fallback...");
            const S3 = new S3Client({
                region: 'auto',
                endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });

            await S3.send(new PutObjectCommand({
                Bucket: 'pasteleria-assets',
                Key: key,
                Body: Buffer.from(arrayBuffer),
                ContentType: 'image/webp',
            }));

            console.log("Upload successful via S3 Client");

            // Delete old image from R2 via S3 after successful upload
            const oldKey = extractOldKey(oldImageUrl);
            if (oldKey) {
                try {
                    await S3.send(new DeleteObjectCommand({
                        Bucket: 'pasteleria-assets',
                        Key: oldKey,
                    }));
                    console.log(`Deleted old image via S3: ${oldKey}`);
                } catch (delErr: any) {
                    console.warn(`Failed to delete old image ${oldKey}:`, delErr.message);
                }
            }

            const publicUrl = `${r2Domain}/${key}`;
            return NextResponse.json({ url: publicUrl });
        }

        // Collect debug info for the client error
        const debugInfo = {
            hasBucket: !!bucket,
            r2Error: r2Error ? r2Error.message : 'No binding error',
            envKeys: Object.keys(envVars),
            hasAccId: !!accountId,
            hasKeyId: !!accessKeyId,
            hasSecret: !!secretAccessKey
        };

        console.error('R2 binding failed and no S3 credentials provided for fallback.', debugInfo);
        return NextResponse.json({
            error: 'Upload Failed',
            details: `Binding failed (${debugInfo.r2Error}) & No S3 Creds. Env Keys: ${debugInfo.envKeys.join(', ')}`
        }, { status: 500 });

    } catch (error) {
        console.error('Upload error (top level):', error);
        return NextResponse.json({ error: 'Upload failed', details: (error as Error).message }, { status: 500 });
    }
}
