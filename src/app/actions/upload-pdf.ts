'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadPdf(quoteId: string, base64Pdf: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // En Next.js App Router (Edge o Node), process.env se puede usar si se pasan las variables
        const accountId = process.env.R2_ACCOUNT_ID || 'f9f7037e5c7f3cc70c00a2c1f40fe6dd';
        const accessKeyId = process.env.R2_ACCESS_KEY_ID || '929ec46d60e280b129df0fc8ea0f9fa6';
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || 'b90fa94b6ab5e40a2c949f313e6dde9afe44b2b9853a60d7e469ab09286e5108';
        const bucketName = process.env.R2_BUCKET_NAME || 'pasteleria-assets';

        const S3 = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        // Convert base64 to Buffer
        const base64Data = base64Pdf.includes(',') ? base64Pdf.split(',')[1] : base64Pdf;
        const buffer = Buffer.from(base64Data, 'base64');
        
        const fileName = `eventos/cotizaciones/${quoteId}.pdf`;

        await S3.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: buffer,
                ContentType: 'application/pdf',
            })
        );

        const publicUrl = `https://imagenes.pasteleriahijitos.cl/${fileName}`;

        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error('Error uploading PDF to R2:', error);
        return { success: false, error: error.message };
    }
}
