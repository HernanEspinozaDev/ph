'use server';

import { getRequestContext } from '@cloudflare/next-on-pages';

export async function saveQuote(id: string, pdfUrl: string, total: number, items: any[]) {
    try {
        const { env } = getRequestContext();
        if (!env.DB) throw new Error("No DB connection");

        // Insert quote, leaving PII fields null/empty
        const queryCotizacion = `
            INSERT INTO cotizaciones (id, pdf_url, total)
            VALUES (?, ?, ?)
        `;
        await env.DB.prepare(queryCotizacion).bind(id, pdfUrl, total).run();

        // Insert items
        const queryItem = `
            INSERT INTO cotizacion_items (cotizacion_id, producto_id, nombre_snapshot, cantidad, precio_unitario, subtotal)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        for (const item of items) {
            await env.DB.prepare(queryItem).bind(
                id,
                item.producto_id,
                item.nombre,
                item.cantidad,
                item.precio_unitario,
                item.cantidad * item.precio_unitario
            ).run();
        }

        return { success: true };
    } catch (e: any) {
        console.error("Error saving quote:", e);
        return { success: false, error: e.message };
    }
}
