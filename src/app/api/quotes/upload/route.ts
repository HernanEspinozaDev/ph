import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const QUOTE_ID_PATTERN = /^COT-[A-Z0-9]{4}$/;
const MAX_PDF_SIZE = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const quoteId = formData.get('quoteId');
    const file = formData.get('file');

    if (typeof quoteId !== 'string' || !QUOTE_ID_PATTERN.test(quoteId)) {
      return NextResponse.json({ error: 'El identificador de la cotización no es válido.' }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0 || file.size > MAX_PDF_SIZE) {
      return NextResponse.json({ error: 'El PDF está vacío o supera el tamaño permitido de 8 MB.' }, { status: 400 });
    }
    if (file.type && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'El archivo generado no es un PDF válido.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const signature = new TextDecoder().decode(bytes.slice(0, 5));
    if (signature !== '%PDF-') {
      return NextResponse.json({ error: 'El archivo enviado no tiene formato PDF.' }, { status: 400 });
    }

    const { env } = getRequestContext();
    const key = `eventos/cotizaciones/${quoteId}.pdf`;
    const publicBase = (env.R2_DOMAIN || 'https://imagenes.pasteleriahijitos.cl').replace(/\/+$/, '');

    // Algunos despliegues de Pages no exponen put() correctamente a las rutas
    // de Next. Conservamos el binding como primera opción y usamos S3 como fallback.
    let bindingError: unknown;
    if (env.ASSETS) {
      try {
        await env.ASSETS.put(key, bytes, {
          httpMetadata: {
            contentType: 'application/pdf',
            contentDisposition: `inline; filename="${quoteId}.pdf"`,
          },
        });
        return NextResponse.json(
          { success: true, url: `${publicBase}/${key}` },
          { headers: { 'Cache-Control': 'no-store' } },
        );
      } catch (error) {
        bindingError = error;
        console.warn('R2 binding failed for quote PDF; trying the S3 API fallback.');
      }
    }

    const vars = env as unknown as Record<string, unknown>;
    const getEnvValue = (name: string) => {
      const value = process.env[name] ?? vars[name];
      return typeof value === 'string' ? value.trim() || undefined : undefined;
    };
    const accountId = getEnvValue('R2_ACCOUNT_ID');
    const accessKeyId = getEnvValue('R2_ACCESS_KEY_ID');
    const secretAccessKey = getEnvValue('R2_SECRET_ACCESS_KEY');

    if (!accountId || !accessKeyId || !secretAccessKey) {
      console.error('Quote PDF upload unavailable: R2 binding failed or S3 credentials are missing.', {
        hasBinding: !!env.ASSETS,
        bindingFailed: !!bindingError,
        hasAccountId: !!accountId,
        hasAccessKeyId: !!accessKeyId,
        hasSecretAccessKey: !!secretAccessKey,
      });
      return NextResponse.json(
        { error: 'El almacenamiento de cotizaciones no está disponible. Revisa los secretos R2 de producción.' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
    await s3.send(new PutObjectCommand({
      Bucket: getEnvValue('R2_BUCKET_NAME') || 'pasteleria-assets',
      Key: key,
      Body: new Uint8Array(bytes),
      ContentType: 'application/pdf',
      ContentDisposition: `inline; filename="${quoteId}.pdf"`,
    }));

    return NextResponse.json(
      { success: true, url: `${publicBase}/${key}` },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('Quote PDF upload failed:', error);
    return NextResponse.json(
      { error: 'No se pudo guardar el PDF de la cotización en Cloudflare. Inténtalo nuevamente.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
