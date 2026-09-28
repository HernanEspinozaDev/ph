import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

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
    if (!env.ASSETS) {
      console.error('Cloudflare R2 binding ASSETS is unavailable for quote uploads.');
      return NextResponse.json({ error: 'El almacenamiento de cotizaciones no está disponible.' }, { status: 503 });
    }

    const key = `eventos/cotizaciones/${quoteId}.pdf`;
    await env.ASSETS.put(key, bytes, {
      httpMetadata: {
        contentType: 'application/pdf',
        contentDisposition: `inline; filename="${quoteId}.pdf"`,
      },
    });

    const publicBase = (env.R2_DOMAIN || 'https://imagenes.pasteleriahijitos.cl').replace(/\/+$/, '');
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
