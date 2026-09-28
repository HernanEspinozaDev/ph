'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';

export async function uploadPdf(quoteId: string, base64Pdf: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        if (!/^COT-[A-Z0-9]{4}$/.test(quoteId)) {
            return { success: false, error: 'El identificador de la cotización no es válido.' };
        }

        const { env } = getRequestContext();
        if (!env.ASSETS) throw new Error('No está disponible el binding de Cloudflare R2.');

        const base64Data = base64Pdf.includes(',') ? base64Pdf.split(',')[1] : base64Pdf;
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
        }
        
        const fileName = `eventos/cotizaciones/${quoteId}.pdf`;
        await env.ASSETS.put(fileName, bytes, {
            httpMetadata: { contentType: 'application/pdf' },
        });

        const publicBase = (env.R2_DOMAIN || 'https://imagenes.pasteleriahijitos.cl').replace(/\/+$/, '');
        const publicUrl = `${publicBase}/${fileName}`;

        return { success: true, url: publicUrl };
    } catch (error: any) {
        console.error('Error uploading PDF to R2:', error);
        return { success: false, error: error.message };
    }
}
